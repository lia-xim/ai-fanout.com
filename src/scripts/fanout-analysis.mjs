const STOPWORDS = new Set(["a","an","and","are","as","at","best","der","die","das","ein","eine","for","für","how","in","ist","mit","of","oder","the","to","und","von","was","what","which","wie","zu"]);
const COMPARISON = /\b(vs\.?|versus|vergleich|compare|comparison|alternative|alternativen|beste?n?|top)\b/i;
const PRICE = /\b(preis|preise|pricing|price|prices|cost|costs|kosten|günstig|cheap|budget)\b/i;

export function sourceDomain(source) {
  try { return new URL(source?.url ?? source).hostname.replace(/^www\./, "").toLowerCase(); } catch { return ""; }
}

export function analyzeFanout(result) {
  const queryStrings = (result?.queries ?? []).map((item) => typeof item === "string" ? item : item.query).filter(Boolean);
  const domains = [...new Set((result?.sources ?? []).map(sourceDomain).filter(Boolean))];
  const counts = new Map();
  for (const query of queryStrings) for (const token of query.toLocaleLowerCase(result?.language ?? "en").normalize("NFKD").replace(/[^a-z0-9äöüß]+/gi, " ").split(/\s+/)) {
    if (token.length < 3 || STOPWORDS.has(token)) continue;
    counts.set(token, (counts.get(token) ?? 0) + 1);
  }
  return {
    evidenceState: "derived",
    methodVersion: "rules-based-reading/1.0",
    observedQueryCount: queryStrings.length,
    comparisonQuestionCount: queryStrings.filter((query) => COMPARISON.test(query)).length,
    priceQuestionCount: queryStrings.filter((query) => PRICE.test(query)).length,
    distinctSourceDomainCount: domains.length,
    sourceDomains: domains,
    recurringThemes: [...counts].filter(([, count]) => count > 1).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 5).map(([term, count]) => ({ term, count })),
  };
}
