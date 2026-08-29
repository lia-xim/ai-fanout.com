const EVENT_SCHEMAS = Object.freeze({
  tool_mode_selected: { mode: ["native", "modelled"] },
  tool_run_blocked: { mode: ["native", "modelled"], provider: ["openai", "gemini"], reason: ["captcha_not_ready", "mode_unavailable"] },
  tool_run_started: { mode: ["native", "modelled"], provider: ["openai", "gemini"] },
  tool_run_succeeded: { mode: ["native", "modelled"], provider: ["openai", "gemini"], result_status: ["complete", "incomplete", "unknown"], query_count: "count", source_count: "count", search_action_count: "count" },
  tool_run_zero_query: { mode: ["native", "modelled"], provider: ["openai", "gemini"] },
  tool_run_failed: { mode: ["native", "modelled"], provider: ["openai", "gemini"], reason: ["validation", "captcha", "rate_limit", "global_limit", "budget_limit", "timeout", "provider", "unavailable", "unknown"] },
  result_saved: { mode: ["native", "modelled"], provider: ["openai", "gemini"], query_count: "count" },
  result_copied: { mode: ["native", "modelled"], provider: ["openai", "gemini"], query_count: "count" },
  result_feedback: { mode: ["native", "modelled"], provider: ["openai", "gemini"], rating: ["helpful", "not_helpful"] },
  result_workflow_advanced: { provider: ["openai", "gemini", "mixed"], action: ["save", "export"] },
  result_exported: { provider: ["openai", "gemini", "mixed"], format: ["json", "csv"], scope: ["full", "selected", "comparison", "contextter"], item_count: "count" },
  runs_compared: { comparison_type: ["provider", "date", "mixed"], run_count: "count" },
  model_comparison_requested: { direction: ["openai_to_gemini", "gemini_to_openai"] },
  model_comparison_completed: { direction: ["openai_to_gemini", "gemini_to_openai"] },
  result_source_clicked: { provider: ["openai", "gemini"] },
  handoff_clicked: { destination: ["seo_fanout", "contextter"] },
});

export function sanitizeProductEvent(name, data = {}) {
  const schema = EVENT_SCHEMAS[name];
  if (!schema || !data || typeof data !== "object" || Array.isArray(data)) return null;
  const clean = {};
  for (const [key, rule] of Object.entries(schema)) {
    const value = data[key];
    if (rule === "count") {
      if (Number.isFinite(value)) clean[key] = Math.max(0, Math.min(100, Math.round(value)));
      continue;
    }
    if (rule.includes(value)) clean[key] = value;
  }
  return { name, data: clean };
}

export function trackProductEvent(name, data = {}) {
  const event = sanitizeProductEvent(name, data);
  if (!event || typeof window === "undefined") return false;
  const send = () => {
    const tracker = window.umami;
    if (!tracker || typeof tracker.track !== "function") return false;
    tracker.track(event.name, event.data);
    return true;
  };
  if (send()) return true;
  window.setTimeout(send, 800);
  return false;
}

export const productAnalyticsEvents = Object.freeze(Object.keys(EVENT_SCHEMAS));
