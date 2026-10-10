// Entirely synthetic, owner-created protocol shapes. No provider calls or stored outputs.
export const fixtures = {
  openai: {
    id: "synthetic-response", status: "completed", model: "synthetic-model",
    output: [
      { id: "synthetic-search-1", type: "web_search_call", action: { type: "search", queries: ["example topic", "example cost"], sources: [{ url: "https://example.com/guide", title: "Fictional source" }] } },
      { id: "synthetic-search-2", type: "web_search_call", action: { type: "search", query: "example import" } },
      { type: "message", content: [{ type: "output_text", annotations: [{ type: "url_citation", url: "https://example.com/citation", title: "Fictional citation" }] }] }
    ]
  },
  gemini: {
    id: "synthetic-interaction", status: "completed", model: "synthetic-model",
    steps: [
      { id: "synthetic-search-1", type: "google_search_call", arguments: { queries: ["example topic", "example cost"] } },
      { type: "google_search_result", call_id: "synthetic-search-1", result: [{ search_suggestions: "SYNTHETIC marker: must not appear in parser output" }] },
      { type: "model_output", content: [{ type: "text", annotations: [{ type: "url_citation", url: "https://example.com/citation", title: "Fictional citation" }] }] }
    ]
  }
};
