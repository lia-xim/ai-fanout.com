import assert from "node:assert/strict";
import test from "node:test";
import {
  SEO_HANDOFF_SCHEMA,
  buildSeoResearchUrl,
  encodeSeoResearchHandoff,
} from "../src/lib/seo-handoff.mjs";

const fixture = {
  schemaVersion: SEO_HANDOFF_SCHEMA,
  producer: "ai-fanout.com",
  transferredAt: "2026-08-31T12:00:00.000Z",
  run: {
    question: "SEO für KI-Suche",
    language: "de",
    queries: [{ text: "SEO für KI-Suche Quellen", sources: [] }],
  },
};

test("creates a fragment-only browser handoff", () => {
  const url = new URL(buildSeoResearchUrl(fixture));
  assert.equal(url.origin, "https://seo-fanout.com");
  assert.equal(url.search, "");
  assert.match(url.hash, /^#research=/u);
  assert.equal(url.hash.includes("SEO"), false);
});

test("keeps unicode payloads bounded and encodable", () => {
  assert.ok(encodeSeoResearchHandoff(fixture).length > 40);
  assert.throws(
    () => encodeSeoResearchHandoff({ ...fixture, padding: "x".repeat(49_000) }),
    /SEO_HANDOFF_TOO_LARGE/u,
  );
});
