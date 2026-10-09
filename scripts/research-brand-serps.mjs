#!/usr/bin/env node

/**
 * Local-only brand-name collision research with DataForSEO Live SERPs.
 *
 * - Reads existing Contextter credentials without printing or persisting them.
 * - Requests only the default top 10 (no paid add-ons).
 * - Stores a compact evidence summary, never the raw provider response.
 * - Enforces a hard estimated-cost ceiling before making any request.
 */

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";

const ENDPOINT =
  "https://api.dataforseo.com/v3/serp/google/organic/live/advanced";
const LIVE_TOP_10_USD = 0.002;
const DEFAULT_MAX_COST_USD = 0.5;
const DEFAULT_CONCURRENCY = 12;
const CONTEXTTER_REPO =
  process.env.CONTEXTTER_REPO ??
  "C:\\Users\\matth\\Documents\\SEOTool\\contextter-5.0";

const MARKETS = [
  { id: "de", locationCode: 2276, languageCode: "de" },
  { id: "us", locationCode: 2840, languageCode: "en" },
];

const CANDIDATES = [
  "Arven", "Belnor", "Cadrik", "Daxon", "Elvar", "Fendor",
  "Gravis", "Harken", "Ivero", "Jasko", "Keldor", "Lasko",
  "Mavren", "Neral", "Orvex", "Paxon", "Rasken", "Selvo",
  "Tarsen", "Ulven", "Varek", "Welkin", "Zoren", "Branik",
  "Calven", "Drexon", "Evron", "Falis", "Galdin", "Havor",
  "Isken", "Jovar", "Karsen", "Lorven", "Marden", "Norik",
  "Oltar", "Pexon", "Quaris", "Rixon", "Seldor", "Torvik",
  "Valden", "Wexen", "Zarik", "Aldren", "Brevik", "Corvan",
  "Darsen", "Eldrix", "Fenrik", "Gavor", "Haldin", "Ivrin",
  "Jorven", "Kavik", "Lendor", "Molven", "Norsel", "Odrik",
  "Ravik", "Sorven", "Teldor", "Vasken", "Zevik", "Bexar",
  "Corten", "Dravis", "Elnor", "Fexel", "Hestor", "Lurix",
  "Avenor", "Brixen", "Celdor", "Dovren", "Evarik", "Fosken",
  "Grendor", "Horvik", "Ildren", "Jaxor", "Kerven", "Laxen",
  "Merik", "Navor", "Orenix", "Peldor", "Quenor", "Raldex",
  "Senrik", "Tovan", "Urven", "Veldin", "Wexor", "Yarden",
  "Zorven", "Bravor", "Costen", "Drenik",
];

function parseArgs(argv) {
  const args = {
    dryRun: false,
    concurrency: DEFAULT_CONCURRENCY,
    maxCostUsd: DEFAULT_MAX_COST_USD,
    namesFiles: [],
    outputDir: null,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (value === "--dry-run") args.dryRun = true;
    else if (value === "--concurrency") {
      args.concurrency = Number(argv[++index]);
    } else if (value === "--max-cost-usd") {
      args.maxCostUsd = Number(argv[++index]);
    } else if (value === "--names-file") {
      args.namesFiles.push(resolve(String(argv[++index])));
    } else if (value === "--output") {
      args.outputDir = resolve(String(argv[++index]));
    } else {
      throw new Error(`Unknown argument: ${value}`);
    }
  }
  if (!Number.isInteger(args.concurrency) || args.concurrency < 1) {
    throw new Error("--concurrency must be a positive integer");
  }
  if (!Number.isFinite(args.maxCostUsd) || args.maxCostUsd <= 0) {
    throw new Error("--max-cost-usd must be a positive number");
  }
  return args;
}

async function loadCandidateFile(namesFile) {
  const content = await readFile(namesFile, "utf8");
  let values;
  if (namesFile.toLowerCase().endsWith(".json")) {
    values = JSON.parse(content);
    if (!Array.isArray(values)) {
      throw new Error("--names-file JSON must contain an array of names");
    }
  } else if (namesFile.toLowerCase().endsWith(".csv")) {
    values = content.split(/\r?\n/u).map((line) => {
      const trimmed = line.trim();
      if (!trimmed.startsWith('"')) return trimmed.split(",", 1)[0];
      const match = /^"((?:[^"]|"")*)"/u.exec(trimmed);
      return match == null ? trimmed : match[1].replaceAll('""', '"');
    });
    if (["name", "candidate"].includes(String(values[0] ?? "").toLowerCase())) {
      values.shift();
    }
  } else {
    values = content.split(/\r?\n/u);
  }
  const names = [
    ...new Set(
      values
        .map((value) => String(value).trim())
        .filter((value) => value.length > 0 && !value.startsWith("#")),
    ),
  ];
  if (names.length === 0) throw new Error("--names-file contains no names");
  return names;
}

async function loadCandidateNames(namesFiles) {
  if (namesFiles.length === 0) return CANDIDATES;
  const lists = await Promise.all(namesFiles.map(loadCandidateFile));
  return [...new Set(lists.flat())];
}

function cleanEnvValue(raw) {
  let value = raw.trim();
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1);
  }
  const whitespace = value.search(/\s/u);
  return whitespace === -1 ? value : value.slice(0, whitespace);
}

async function loadCredentials() {
  let login = process.env.DATAFORSEO_LOGIN;
  let password = process.env.DATAFORSEO_PASSWORD;
  const envPath = join(CONTEXTTER_REPO, "apps", "app", ".env.local");
  try {
    const envText = await readFile(envPath, "utf8");
    for (const line of envText.split(/\r?\n/u)) {
      const match = /^([A-Z0-9_]+)=(.*)$/u.exec(line);
      if (match == null) continue;
      const [, key, rawValue] = match;
      if (key === "DATAFORSEO_LOGIN" && !login) login = cleanEnvValue(rawValue);
      if (key === "DATAFORSEO_PASSWORD" && !password) {
        password = cleanEnvValue(rawValue);
      }
    }
  } catch {
    // Environment variables remain a supported fallback.
  }
  if (!login || !password) {
    throw new Error(
      "Missing DATAFORSEO_LOGIN / DATAFORSEO_PASSWORD in the environment or Contextter apps/app/.env.local",
    );
  }
  return { login, password };
}

function normalize(value) {
  return String(value ?? "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/gu, "");
}

function compactItem(item) {
  return {
    type: typeof item.type === "string" ? item.type : null,
    rank:
      typeof item.rank_absolute === "number" ? item.rank_absolute : null,
    title: typeof item.title === "string" ? item.title : null,
    domain: typeof item.domain === "string" ? item.domain : null,
    url: typeof item.url === "string" ? item.url : null,
    description:
      typeof item.description === "string" ? item.description : null,
  };
}

function summarizeResult(name, market, task, result) {
  const items = Array.isArray(result.items)
    ? result.items.map(compactItem).filter((item) => item.type != null)
    : [];
  const visibleItems = items
    .filter((item) => item.type === "organic" || item.type === "knowledge_graph")
    .slice(0, 10);

  const spell =
    result.spell != null && typeof result.spell === "object"
      ? {
          keyword:
            typeof result.spell.keyword === "string"
              ? result.spell.keyword
              : null,
          type:
            typeof result.spell.type === "string" ? result.spell.type : null,
        }
      : null;

  return {
    name,
    market: market.id,
    spell,
    seResultsCount:
      typeof result.se_results_count === "number"
        ? result.se_results_count
        : null,
    checkUrl: typeof result.check_url === "string" ? result.check_url : null,
    fetchedAt: typeof result.datetime === "string" ? result.datetime : null,
    providerCostUsd: typeof task.cost === "number" ? task.cost : null,
    topResults: visibleItems.slice(0, 10),
  };
}

async function fetchSerp(name, market, credentials, attempt = 0) {
  const auth = Buffer.from(
    `${credentials.login}:${credentials.password}`,
  ).toString("base64");
  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify([
      {
        keyword: name,
        location_code: market.locationCode,
        language_code: market.languageCode,
        device: "desktop",
        depth: 10,
        tag: `brand-check:${market.id}:${normalize(name)}`,
      },
    ]),
  });

  if ((response.status === 429 || response.status >= 500) && attempt < 2) {
    await new Promise((resolveDelay) =>
      setTimeout(resolveDelay, 500 * 2 ** attempt),
    );
    return fetchSerp(name, market, credentials, attempt + 1);
  }
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  const payload = await response.json();
  const task = payload?.tasks?.[0];
  if (task == null || task.status_code !== 20000) {
    throw new Error(
      `Provider task failed: ${task?.status_code ?? "?"} ${task?.status_message ?? "unknown"}`,
    );
  }
  const result = task.result?.[0];
  if (result == null) throw new Error("Provider returned no result");
  return summarizeResult(name, market, task, result);
}

async function mapConcurrent(tasks, concurrency, worker) {
  const results = new Array(tasks.length);
  let nextIndex = 0;
  async function runWorker() {
    while (nextIndex < tasks.length) {
      const index = nextIndex;
      nextIndex += 1;
      try {
        results[index] = await worker(tasks[index], index);
      } catch (error) {
        results[index] = {
          name: tasks[index].name,
          market: tasks[index].market.id,
          error: error instanceof Error ? error.message : String(error),
        };
      }
    }
  }
  await Promise.all(
    Array.from({ length: Math.min(concurrency, tasks.length) }, runWorker),
  );
  return results;
}

function combineResults(results) {
  const byName = new Map();
  for (const result of results) {
    const entries = byName.get(result.name) ?? [];
    entries.push(result);
    byName.set(result.name, entries);
  }
  return [...byName.entries()].map(([name, markets]) => {
    return {
      name,
      markets: markets.sort((left, right) => left.market.localeCompare(right.market)),
    };
  });
}

function csvEscape(value) {
  const text = Array.isArray(value) ? value.join(" | ") : String(value ?? "");
  return `"${text.replaceAll('"', '""')}"`;
}

function serializeCsv(combined) {
  const header = [
    "name", "market", "status", "correction_type", "correction_keyword",
    "result_count", "provider_cost_usd",
  ];
  const rows = combined.flatMap((entry) =>
    entry.markets.map((market) => [
      entry.name,
      market.market,
      market.error == null ? "ok" : "error",
      market.spell?.type,
      market.spell?.keyword,
      market.seResultsCount,
      market.providerCostUsd,
    ]),
  );
  return [header, ...rows].map((row) => row.map(csvEscape).join(",")).join("\n");
}

function markdownText(value) {
  return String(value ?? "")
    .replaceAll("\r", " ")
    .replaceAll("\n", " ")
    .trim();
}

function serializeCandidateMarkdown(entry, generatedAt) {
  const lines = [
    `# ${entry.name}`,
    "",
    `Generated: ${generatedAt}`,
    "",
    "> Evidence file only. No automatic brand-name score or recommendation.",
  ];
  for (const market of entry.markets) {
    lines.push("", `## ${market.market.toUpperCase()}`, "");
    if (market.error != null) {
      lines.push(`Provider error: ${markdownText(market.error)}`);
      continue;
    }
    lines.push(
      `- Result count reported by Google: ${market.seResultsCount ?? "not reported"}`,
      `- Spell handling: ${market.spell == null ? "none" : `${market.spell.type}: ${market.spell.keyword ?? ""}`}`,
      `- Checked at: ${market.fetchedAt ?? "not reported"}`,
      `- Google check URL: ${market.checkUrl ?? "not reported"}`,
    );
    for (const result of market.topResults) {
      lines.push(
        "",
        `### ${result.rank ?? "?"}. ${markdownText(result.title) || "Untitled result"}`,
        "",
        `- Type: ${result.type ?? "unknown"}`,
        `- Domain: ${result.domain ?? "not reported"}`,
        `- URL: ${result.url ?? "not reported"}`,
      );
      if (result.description) {
        lines.push("", markdownText(result.description));
      }
    }
  }
  return `${lines.join("\n")}\n`;
}

function serializeMarkdownIndex(combined, generatedAt) {
  return [
    "# Brand SERP evidence files",
    "",
    `Generated: ${generatedAt}`,
    "",
    "> Provider evidence only. Every candidate requires human review.",
    "",
    ...combined.map((entry) => `- [${entry.name}](candidates/${normalize(entry.name)}.md)`),
    "",
  ].join("\n");
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const candidates = await loadCandidateNames(args.namesFiles);
  const names = candidates;
  const tasks = names.flatMap((name) =>
    MARKETS.map((market) => ({ name, market })),
  );
  const estimatedCostUsd = tasks.length * LIVE_TOP_10_USD;
  if (estimatedCostUsd > args.maxCostUsd) {
    throw new Error(
      `Estimated cost $${estimatedCostUsd.toFixed(3)} exceeds cap $${args.maxCostUsd.toFixed(3)}`,
    );
  }
  process.stdout.write(
    `Brand SERP research: ${names.length} names × ${MARKETS.length} markets = ${tasks.length} tasks; estimated max $${estimatedCostUsd.toFixed(3)}\n`,
  );
  if (args.dryRun) return;

  const credentials = await loadCredentials();
  let completed = 0;
  const results = await mapConcurrent(
    tasks,
    args.concurrency,
    async (task) => {
      const result = await fetchSerp(task.name, task.market, credentials);
      completed += 1;
      if (completed % 20 === 0 || completed === tasks.length) {
        process.stdout.write(`Completed ${completed}/${tasks.length}\n`);
      }
      return result;
    },
  );
  const combined = combineResults(results).sort((left, right) =>
    left.name.localeCompare(right.name),
  );
  const actualCostUsd = results.reduce(
    (sum, result) => sum + (result.providerCostUsd ?? 0),
    0,
  );
  const timestamp = new Date().toISOString().replaceAll(":", "-");
  const outputDir =
    args.outputDir ?? join(tmpdir(), `contextter-brand-serps-${timestamp}`);
  await mkdir(outputDir, { recursive: true });
  const generatedAt = new Date().toISOString();
  const report = {
    generatedAt,
    methodology: {
      endpoint: "serp/google/organic/live/advanced",
      markets: MARKETS,
      depth: 10,
      paidAddOns: false,
      estimatedCostUsd,
      actualCostUsd,
      note: "Evidence export only. No automatic score, grade, or recommendation.",
    },
    combined,
  };
  const markdownDir = join(outputDir, "candidates");
  await mkdir(markdownDir, { recursive: true });
  await Promise.all([
    writeFile(
      join(outputDir, "brand-serp-report.json"),
      JSON.stringify(report, null, 2),
      "utf8",
    ),
    writeFile(
      join(outputDir, "brand-serp-ranking.csv"),
      serializeCsv(combined),
      "utf8",
    ),
    writeFile(
      join(outputDir, "README.md"),
      serializeMarkdownIndex(combined, generatedAt),
      "utf8",
    ),
    ...combined.map((entry) =>
      writeFile(
        join(markdownDir, `${normalize(entry.name)}.md`),
        serializeCandidateMarkdown(entry, generatedAt),
        "utf8",
      ),
    ),
  ]);
  const errors = results.filter((result) => result.error != null).length;
  process.stdout.write(
    `Done. Actual provider cost: $${actualCostUsd.toFixed(3)}; errors: ${errors}; output: ${outputDir}\n`,
  );
  process.stdout.write(`Wrote ${combined.length} human-review Markdown files.\n`);
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});
