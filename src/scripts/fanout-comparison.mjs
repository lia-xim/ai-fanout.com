import { analyzeFanout, sourceDomain } from "./fanout-analysis.mjs";

const queryText = (item) => typeof item === "string" ? item : item.query;
const normalize = (value) => String(value ?? "").normalize("NFKC").trim().toLocaleLowerCase();

export function compareFanoutRuns(entries) {
  const runs = entries.map((entry) => ({ id: entry.id, savedAt: entry.savedAt, ...entry.result, analysis: analyzeFanout(entry.result) }));
  const queryOwners = new Map(), domainOwners = new Map();
  for (const run of runs) {
    for (const query of run.queries.map(queryText).filter(Boolean)) {
      const key = normalize(query); if (!queryOwners.has(key)) queryOwners.set(key, new Set()); queryOwners.get(key).add(run.id);
    }
    for (const domain of (run.sources ?? []).map(sourceDomain).filter(Boolean)) {
      if (!domainOwners.has(domain)) domainOwners.set(domain, new Set()); domainOwners.get(domain).add(run.id);
    }
  }
  return {
    schemaVersion: "ai-fanout.local-comparison/1.0",
    createdAt: new Date().toISOString(),
    runCount: runs.length,
    runs,
    sharedQueries: [...queryOwners].filter(([, owners]) => owners.size > 1).map(([query]) => query),
    sharedSourceDomains: [...domainOwners].filter(([, owners]) => owners.size > 1).map(([domain]) => domain),
    notice: "Browser-local comparison of saved observations. Matching and categories are deterministic post-run analysis, not provider evidence or an independent benchmark.",
  };
}

export function comparisonCsv(comparison) {
  const rows = [["run_id","saved_at","provider","model","keyword","country","language","query_index","query","source_domains","input_tokens","output_tokens","estimated_cost_usd"]];
  for (const run of comparison.runs) run.queries.forEach((item, index) => rows.push([run.id, new Date(run.savedAt).toISOString(), run.providerId, run.modelId, run.keyword, run.country ?? "", run.language, String(index + 1), queryText(item), (run.sources ?? []).map(sourceDomain).filter(Boolean).join("|"), String(run.usage?.inputTokens ?? ""), String(run.usage?.outputTokens ?? ""), String(run.usage?.estimatedCostUsd ?? "")]));
  return rows.map((row) => row.map((value) => `"${String(value).replaceAll('"','""')}"`).join(",")).join("\n");
}
