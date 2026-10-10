// Owner-created offline teaching example. It deliberately differs from the site's
// normalized, capped UI wrapper: exact strings and all occurrences are preserved.
const parserVersion = "ai-fanout.parser-example/1.0";

function object(value) { return value !== null && typeof value === "object" && !Array.isArray(value); }
function stateOf(response) {
  if (response.error || ["failed", "cancelled"].includes(response.status)) return "failed";
  if (response.status === "completed") return "completed";
  if (["incomplete", "in_progress"].includes(response.status)) return "partial";
  return "unknown";
}
function container(response, field) {
  if (!object(response)) throw new TypeError("INVALID_RESPONSE: expected an object");
  if (stateOf(response) === "failed" && !Object.hasOwn(response, field)) return [];
  if (!Array.isArray(response[field])) throw new TypeError(`INVALID_RESPONSE: expected ${field} array`);
  return response[field];
}
function strings(action) {
  if (!object(action)) return [];
  if (Object.hasOwn(action, "queries")) {
    if (!Array.isArray(action.queries) || action.queries.some(q => typeof q !== "string")) {
      throw new TypeError("INVALID_QUERY_FIELD: queries must be a string array");
    }
    return [...action.queries];
  }
  if (Object.hasOwn(action, "query")) {
    if (typeof action.query !== "string") throw new TypeError("INVALID_QUERY_FIELD: query must be a string");
    return [action.query];
  }
  return [];
}
function source(value, scope) {
  if (!object(value) || typeof value.url !== "string") return null;
  try {
    const parsed = new URL(value.url);
    if (!["https:", "http:"].includes(parsed.protocol) || parsed.username || parsed.password) return null;
  } catch { return null; }
  return { url: value.url, ...(typeof value.title === "string" ? { title: value.title } : {}), ...(scope ? { sourceScope: scope } : {}) };
}
function citations(content) {
  return (Array.isArray(content) ? content : []).flatMap(part =>
    (Array.isArray(part?.annotations) ? part.annotations : [])
      .filter(annotation => annotation?.type === "url_citation")
      .map(annotation => source(annotation, "run")).filter(Boolean));
}
function result(response, provider, actions, runSources, webToolCallCount) {
  const state = stateOf(response);
  const queries = actions.flatMap(action => action.queries);
  return {
    parserVersion, provider,
    model: typeof response.model === "string" ? response.model : null,
    providerStatus: typeof response.status === "string" ? response.status : null,
    state, queries,
    exposedQueryCount: state === "failed" ? null : state === "completed" || queries.length ? queries.length : null,
    searchActionCount: actions.length, webToolCallCount, actions, runSources
  };
}

export function parseOpenAiResponse(response) {
  const output = container(response, "output");
  const calls = output.filter(item => item?.type === "web_search_call");
  const actions = calls.filter(call => call.action?.type === "search").map(call => {
    const sources = (Array.isArray(call.action.sources) ? call.action.sources : []).map(item => source(item)).filter(Boolean);
    return {
      providerCallId: typeof call.id === "string" ? call.id : null,
      queries: strings(call.action), sources,
      sourceScope: sources.length ? "search_action" : "not_exposed"
    };
  });
  const runSources = output.filter(item => item?.type === "message").flatMap(item => citations(item.content));
  return result(response, "openai", actions, runSources, calls.length);
}

export function parseGeminiInteraction(response) {
  const steps = container(response, "steps");
  const calls = steps.filter(step => step?.type === "google_search_call");
  const actions = calls.map(call => ({
    providerCallId: typeof call.id === "string" ? call.id : null,
    queries: strings(call.arguments), sources: [], sourceScope: "not_exposed"
  }));
  // Do not retain google_search_result / search_suggestions or thought payloads.
  const runSources = steps.filter(step => step?.type === "model_output").flatMap(step => citations(step.content));
  return result(response, "gemini", actions, runSources, calls.length);
}
