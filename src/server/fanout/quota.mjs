import { ToolError, REQUEST_RESERVE_MICRO_EUR } from "./contracts.mjs";

const RESERVE_SCRIPT = `
local bucket = tonumber(redis.call('GET', KEYS[1]) or '0')
if bucket >= tonumber(ARGV[1]) then return {'RATE_LIMIT'} end
local daily = tonumber(redis.call('GET', KEYS[2]) or '0')
if daily >= tonumber(ARGV[2]) then return {'GLOBAL_LIMIT'} end
local spent = tonumber(redis.call('HGET', KEYS[3], 'spent') or '0')
local reserved = tonumber(redis.call('HGET', KEYS[3], 'reserved') or '0')
if spent >= tonumber(ARGV[3]) then return {'SOFT_BUDGET'} end
if spent + reserved + tonumber(ARGV[5]) > tonumber(ARGV[4]) then return {'HARD_BUDGET'} end
redis.call('INCR', KEYS[1]); redis.call('EXPIRE', KEYS[1], tonumber(ARGV[6]))
redis.call('INCR', KEYS[2]); redis.call('EXPIRE', KEYS[2], tonumber(ARGV[7]))
redis.call('HINCRBY', KEYS[3], 'reserved', tonumber(ARGV[5])); redis.call('EXPIRE', KEYS[3], tonumber(ARGV[8]))
redis.call('HSET', KEYS[4], 'status', 'reserved', 'amount', ARGV[5], 'questionHash', ARGV[9], 'model', ARGV[10], 'plannerVersion', ARGV[11], 'createdAt', ARGV[12])
redis.call('EXPIRE', KEYS[4], tonumber(ARGV[8]))
return {'OK'}
`;

const SETTLE_SCRIPT = `
local state = redis.call('HGET', KEYS[1], 'status')
if state ~= 'reserved' then return {'ALREADY_SETTLED'} end
local amount = tonumber(redis.call('HGET', KEYS[1], 'amount') or '0')
redis.call('HINCRBY', KEYS[2], 'reserved', -amount)
redis.call('HINCRBY', KEYS[2], 'spent', tonumber(ARGV[1]))
redis.call('HSET', KEYS[1], 'status', ARGV[2], 'actualCost', ARGV[1], 'inputTokens', ARGV[3], 'outputTokens', ARGV[4], 'latencyMs', ARGV[5], 'settledAt', ARGV[6])
return {'OK'}
`;

export class RedisQuotaLedger {
  constructor({ url, token, now = () => new Date(), reserveMicroEur = REQUEST_RESERVE_MICRO_EUR }) { this.url = url.replace(/\/$/, ""); this.token = token; this.now = now; this.reserveMicroEur = reserveMicroEur; }
  async command(parts) {
    const response = await fetch(this.url, { method: "POST", headers: { Authorization: `Bearer ${this.token}`, "Content-Type": "application/json" }, body: JSON.stringify(parts), signal: AbortSignal.timeout(4000) });
    if (!response.ok) throw new ToolError("LEDGER_UNAVAILABLE", 503);
    const data = await response.json();
    if (data.error) throw new ToolError("LEDGER_UNAVAILABLE", 503);
    return data.result;
  }
  keys(bucketHash, reservationId) {
    const now = this.now();
    const day = now.toISOString().slice(0, 10);
    const month = day.slice(0, 7);
    return [`af:bucket:${bucketHash}`, `af:daily:${day}`, `af:month:${month}`, `af:reservation:${reservationId}`];
  }
  async reserve({ bucketHash, reservationId, questionHash, model, plannerVersion }) {
    const now = this.now();
    const args = [5, 40, 25_000_000, 30_000_000, this.reserveMicroEur, 86_400, 172_800, 3_456_000, questionHash, model, plannerVersion, now.toISOString()];
    const result = await this.command(["EVAL", RESERVE_SCRIPT, 4, ...this.keys(bucketHash, reservationId), ...args.map(String)]);
    const code = result?.[0];
    if (code === "RATE_LIMIT") throw new ToolError("RATE_LIMIT", 429);
    if (code === "GLOBAL_LIMIT") throw new ToolError("GLOBAL_LIMIT", 429);
    if (code === "SOFT_BUDGET" || code === "HARD_BUDGET") throw new ToolError("BUDGET_LIMIT", 503);
    if (code !== "OK") throw new ToolError("LEDGER_UNAVAILABLE", 503);
    return { reservationId };
  }
  async settle({ bucketHash, reservationId, actualCostMicroEur, status, inputTokens = 0, outputTokens = 0, latencyMs = 0 }) {
    const [, , monthKey, reservationKey] = this.keys(bucketHash, reservationId);
    return this.command(["EVAL", SETTLE_SCRIPT, 2, reservationKey, monthKey, String(actualCostMicroEur), status, String(inputTokens), String(outputTokens), String(latencyMs), this.now().toISOString()]);
  }
}

export class MemoryQuotaLedger {
  constructor({ now = () => new Date(), spent = 0, reserveMicroEur = REQUEST_RESERVE_MICRO_EUR } = {}) { this.now = now; this.spent = spent; this.reserveMicroEur = reserveMicroEur; this.reserved = 0; this.buckets = new Map(); this.daily = 0; this.records = new Map(); this.lock = Promise.resolve(); }
  async atomic(fn) { const before = this.lock; let release; this.lock = new Promise((r) => { release = r; }); await before; try { return fn(); } finally { release(); } }
  reserve(data) { return this.atomic(() => { const count = this.buckets.get(data.bucketHash) ?? 0; if (count >= 5) throw new ToolError("RATE_LIMIT", 429); if (this.daily >= 40) throw new ToolError("GLOBAL_LIMIT", 429); if (this.spent >= 25_000_000 || this.spent + this.reserved + this.reserveMicroEur > 30_000_000) throw new ToolError("BUDGET_LIMIT", 503); this.buckets.set(data.bucketHash, count + 1); this.daily++; this.reserved += this.reserveMicroEur; this.records.set(data.reservationId, { ...data, status: "reserved", amount: this.reserveMicroEur }); return { reservationId: data.reservationId }; }); }
  settle(data) { return this.atomic(() => { const record = this.records.get(data.reservationId); if (!record || record.status !== "reserved") return ["ALREADY_SETTLED"]; this.reserved -= record.amount; this.spent += data.actualCostMicroEur; Object.assign(record, data); return ["OK"]; }); }
}

