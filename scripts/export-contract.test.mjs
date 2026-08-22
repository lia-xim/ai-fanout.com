import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(new URL("..", import.meta.url).pathname.replace(/^\/(.:)/, "$1"));
const schema = JSON.parse(await readFile(resolve(root, "public/contracts/fanout-plan-export.schema.v1.json"), "utf8"));
const fixture = JSON.parse(await readFile(resolve(root, "public/examples/fanout-plan-export.v1.synthetic.json"), "utf8"));

test("v1 schema is strict and immutable by identifier", () => {
  assert.equal(schema.$id, "https://ai-fanout.com/contracts/fanout-plan-export.schema.v1.json");
  assert.equal(schema.additionalProperties, false);
  assert.equal(schema.properties.schemaVersion.const, "ai-fanout.export/1.0");
  assert.equal(schema.properties.kind.const, "planner_hypothesis_set");
  assert.equal(schema.properties.branches.minItems, 4);
  assert.equal(schema.properties.branches.maxItems, 8);
  assert.equal(schema.properties.branches.items.additionalProperties, false);
});

test("synthetic fixture satisfies the portable contract", () => {
  assert.equal(fixture.schemaVersion, schema.properties.schemaVersion.const);
  assert.equal(fixture.kind, schema.properties.kind.const);
  assert.ok(fixture.question.length >= 4 && fixture.question.length <= 120);
  assert.ok(fixture.branches.length >= 4 && fixture.branches.length <= 8);
  const allowedIntents = new Set(schema.properties.branches.items.properties.intent.enum);
  const allowedSources = new Set(schema.properties.branches.items.properties.sourceType.enum);
  for (const [index, branch] of fixture.branches.entries()) {
    assert.equal(branch.id, `branch-${String(index + 1).padStart(2, "0")}`);
    assert.ok(allowedIntents.has(branch.intent));
    assert.ok(allowedSources.has(branch.sourceType));
    assert.equal(branch.evidenceState, "hypothesis");
  }
  assert.equal(fixture.metadata.modelId, "synthetic-fixture/no-provider-call");
  assert.equal(fixture.metadata.producer, "ai-fanout.com");
  assert.equal(fixture.notice, schema.properties.notice.const);
});

test("fixture contains no provider or hidden-trace claim", () => {
  const text = JSON.stringify(fixture).toLowerCase();
  for (const forbidden of ["actual google queries", "chain of thought exposed", "private retrieval trace", "provider benchmark"]) {
    assert.equal(text.includes(forbidden), false);
  }
});
