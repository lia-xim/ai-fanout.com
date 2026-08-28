const queryText = (item) => typeof item === "string" ? item : item.query;

export function selectedQueryExport(result, selectedIndexes) {
  const selected = new Set([...selectedIndexes].filter((index) => Number.isInteger(index) && index >= 0));
  const queries = (result?.queries ?? []).flatMap((item, index) => selected.has(index) ? [{
    index: index + 1,
    query: queryText(item),
    intent: typeof item === "string" ? null : item.intent,
    reason: typeof item === "string" ? null : item.reason,
  }] : []);
  return {
    schemaVersion: "ai-fanout.query-selection/1.0",
    exportedAt: new Date().toISOString(),
    run: {
      keyword: result.keyword,
      providerId: result.providerId,
      modelId: result.modelId,
      generatedAt: result.generatedAt,
      country: result.country,
      language: result.language,
      evidenceStatus: result.evidenceStatus,
    },
    selectedQueryCount: queries.length,
    queries,
    notice: "User-selected query strings from one ai-fanout.com result. Provider-exposed and modelled results remain distinct; no query-to-source relationship is added by this export.",
  };
}

export function selectedQueriesCsv(selection) {
  const rows = [["keyword", "provider", "model", "observed_at", "country", "language", "evidence_status", "query_index", "query", "intent", "reason"]];
  for (const item of selection.queries) rows.push([
    selection.run.keyword,
    selection.run.providerId,
    selection.run.modelId,
    selection.run.generatedAt,
    selection.run.country ?? "",
    selection.run.language,
    selection.run.evidenceStatus,
    String(item.index),
    item.query,
    item.intent ?? "",
    item.reason ?? "",
  ]);
  return rows.map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(",")).join("\n");
}
