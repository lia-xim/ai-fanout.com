export const SEO_HANDOFF_SCHEMA = "ai-fanout.seo-research-handoff/1.0";
export const SEO_HANDOFF_FRAGMENT_KEY = "research";
export const SEO_HANDOFF_MAX_BYTES = 48_000;

const toBase64Url = (bytes) => {
  let binary = "";
  for (let offset = 0; offset < bytes.length; offset += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + 0x8000));
  }
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/u, "");
};

export function encodeSeoResearchHandoff(payload) {
  const bytes = new TextEncoder().encode(JSON.stringify(payload));
  if (bytes.length > SEO_HANDOFF_MAX_BYTES) throw new Error("SEO_HANDOFF_TOO_LARGE");
  return toBase64Url(bytes);
}

export function buildSeoResearchUrl(payload, base = "https://seo-fanout.com/tool/") {
  const url = new URL(base);
  url.hash = `${SEO_HANDOFF_FRAGMENT_KEY}=${encodeSeoResearchHandoff(payload)}`;
  return url.toString();
}
