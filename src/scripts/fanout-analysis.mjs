export function sourceDomain(source) {
  try { return new URL(source?.url ?? source).hostname.replace(/^www\./, "").toLowerCase(); } catch { return ""; }
}

export function analyzeFanout(result) {
  const queryStrings = (result?.queries ?? []).map((item) => typeof item === "string" ? item : item.query).filter(Boolean);
  const domains = [...new Set((result?.sources ?? []).map(sourceDomain).filter(Boolean))];
  return {
    evidenceState: "observed_summary",
    methodVersion: "observed-summary/1.0",
    observedQueryCount: queryStrings.length,
    distinctSourceDomainCount: domains.length,
    sourceDomains: domains,
  };
}
