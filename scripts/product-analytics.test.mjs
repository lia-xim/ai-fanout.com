import assert from "node:assert/strict";
import test from "node:test";
import { productAnalyticsEvents, sanitizeProductEvent } from "../src/scripts/product-analytics.mjs";

test("product analytics exposes the expected bounded event vocabulary", () => {
  assert.deepEqual(productAnalyticsEvents, [
    "tool_mode_selected", "tool_run_blocked", "tool_run_started", "tool_run_succeeded",
    "tool_run_zero_query", "tool_run_failed", "result_saved", "result_copied",
    "result_feedback", "result_workflow_advanced", "result_exported", "runs_compared",
    "model_comparison_requested", "model_comparison_completed", "result_source_clicked", "handoff_clicked",
  ]);
});

test("feedback and provider comparison events cannot carry tool content", () => {
  assert.deepEqual(sanitizeProductEvent("result_feedback", {
    mode: "native", provider: "gemini", rating: "helpful", keyword: "private", query: "private",
  }), { name: "result_feedback", data: { mode: "native", provider: "gemini", rating: "helpful" } });
  assert.deepEqual(sanitizeProductEvent("model_comparison_completed", {
    direction: "openai_to_gemini", keyword: "private", country: "DE",
  }), { name: "model_comparison_completed", data: { direction: "openai_to_gemini" } });
});

test("successful run keeps only allowlisted aggregate dimensions", () => {
  assert.deepEqual(sanitizeProductEvent("tool_run_succeeded", {
    mode: "native", provider: "openai", result_status: "complete", query_count: 4,
    source_count: 7, search_action_count: 1, keyword: "private topic", url: "https://secret.test",
  }), {
    name: "tool_run_succeeded",
    data: { mode: "native", provider: "openai", result_status: "complete", query_count: 4, source_count: 7, search_action_count: 1 },
  });
});

test("unknown values, raw content keys and unknown events are rejected", () => {
  assert.deepEqual(sanitizeProductEvent("result_exported", {
    provider: "unknown-provider", format: "xlsx", scope: "raw", item_count: 5000,
    query: "do not collect", source_domain: "example.com", user_id: "123",
  }), { name: "result_exported", data: { item_count: 100 } });
  assert.equal(sanitizeProductEvent("raw_prompt", { prompt: "no" }), null);
});
