import assert from "node:assert/strict";
import test from "node:test";
import { authenticateUmami, resetUmamiWebsite, syncUmamiReports } from "../src/server/umami-admin.mjs";

test("versioned report contract contains the two complete funnels and five requested goals", async () => {
  const config = JSON.parse(await (await import("node:fs/promises")).readFile(new URL("../config/umami-reports.v1.json", import.meta.url), "utf8"));
  const funnels = config.reports.filter(report => report.type === "funnel");
  const goals = config.reports.filter(report => report.type === "goal");
  assert.equal(funnels.length, 2);
  assert.deepEqual(funnels.map(report => report.parameters.steps.map(step => step.value)), [
    ["/", "tool_run_started", "tool_run_succeeded", "result_workflow_advanced", "handoff_clicked"],
    ["/de", "tool_run_started", "tool_run_succeeded", "result_workflow_advanced", "handoff_clicked"],
  ]);
  assert.deepEqual(goals.map(report => report.parameters.value), ["tool_run_succeeded", "tool_run_zero_query", "result_exported", "model_comparison_completed", "handoff_clicked"]);
});

test("report sync updates matching reports and creates missing reports", async () => {
  const requests = [];
  const fetchImpl = async (url, options = {}) => {
    requests.push({ url: String(url), options });
    if (String(url).includes("/api/reports?")) return new Response(JSON.stringify({ data: [{ id: "old", name: "Goal", type: "goal" }] }), { status: 200 });
    return new Response(JSON.stringify({ id: String(url).endsWith("/old") ? "old" : "new" }), { status: 200 });
  };
  const result = await syncUmamiReports({ baseUrl: "https://analytics.example/", websiteId: "site", token: "secret", reports: [
    { type: "goal", name: "Goal", parameters: { type: "event", value: "done" } },
    { type: "funnel", name: "Funnel", parameters: { steps: [{ type: "path", value: "/" }, { type: "event", value: "done" }], window: 60 } },
  ], fetchImpl });
  assert.deepEqual(result.map(item => item.action), ["updated", "created"]);
  assert.equal(requests[1].url.endsWith("/api/reports/old"), true);
  assert.equal(requests[2].url.endsWith("/api/reports"), true);
  assert.equal(requests.every(request => !JSON.stringify(request).includes("keyword")), true);
});

test("self-hosted authentication returns a bearer token without logging credentials", async () => {
  const token = await authenticateUmami({ baseUrl: "https://analytics.example", username: "operator", password: "secret", fetchImpl: async () => new Response(JSON.stringify({ token: "bearer" }), { status: 200 }) });
  assert.equal(token, "bearer");
});

test("analytics reset requires the exact website confirmation", async () => {
  await assert.rejects(() => resetUmamiWebsite({ baseUrl: "https://analytics.example", websiteId: "site", token: "secret", confirmation: "wrong", fetchImpl: async () => new Response("{}") }), /Exact website ID/);
  let called = false;
  await resetUmamiWebsite({ baseUrl: "https://analytics.example", websiteId: "site", token: "secret", confirmation: "site", fetchImpl: async () => { called = true; return new Response(JSON.stringify({ ok: true }), { status: 200 }); } });
  assert.equal(called, true);
});
