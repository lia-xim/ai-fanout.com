import test from "node:test";
import assert from "node:assert/strict";
import { HISTORY_LIMIT, HISTORY_TTL_MS, pruneHistory } from "../src/scripts/fanout-history.mjs";

test("local history expires after 30 days, sorts newest first and keeps 20", () => {
  const now = Date.UTC(2026, 7, 27);
  const entries = Array.from({ length: 24 }, (_, index) => ({
    id: String(index),
    savedAt: now - index * 1000,
    expiresAt: now + HISTORY_TTL_MS - index * 1000,
  }));
  entries.push({ id: "expired", savedAt: now, expiresAt: now - 1 });
  const result = pruneHistory(entries, now);
  assert.equal(result.length, HISTORY_LIMIT);
  assert.equal(result[0].id, "0");
  assert.equal(result.some((entry) => entry.id === "expired"), false);
});

