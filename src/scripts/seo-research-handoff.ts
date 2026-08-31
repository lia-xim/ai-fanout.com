import {
  SEO_HANDOFF_SCHEMA,
  buildSeoResearchUrl,
} from "../lib/seo-handoff.mjs";

type Source = { url: string; title: string; scope: string };

const clean = (value: string | null | undefined, limit = 240) =>
  String(value ?? "").replace(/\s+/gu, " ").trim().slice(0, limit);

const collectSources = (container: Element, scope: string): Source[] =>
  [...container.querySelectorAll<HTMLAnchorElement>("a[data-source-link]")]
    .map((link) => ({
      url: link.href,
      title: clean(link.textContent, 180),
      scope,
    }))
    .filter((source) => /^https?:\/\//iu.test(source.url));

const planner = document.querySelector<HTMLElement>("[data-fanout-planner]");
const handoff = planner?.querySelector<HTMLAnchorElement>(
  '[data-handoff="seo_fanout"]',
);

if (planner && handoff) {
  const de = planner.dataset.locale === "de";
  handoff.textContent = de
    ? "Tiefere SEO-Recherche zu diesem Lauf"
    : "Deep SEO research for this run";
  handoff.insertAdjacentHTML("beforeend", '<span aria-hidden="true">→</span>');

  handoff.addEventListener("click", (event) => {
    const result = planner.querySelector<HTMLDialogElement>("[data-result-dialog]");
    if (!result?.open) return;

    const queries = [...result.querySelectorAll<HTMLElement>("[data-result-queries] > li")]
      .filter((item) => item.querySelector<HTMLInputElement>('input[type="checkbox"]')?.checked !== false)
      .map((item) => {
        const detail = item.querySelector<HTMLElement>(":scope > div:not(.query-sources)");
        const sourceBox = item.querySelector<HTMLElement>(".query-sources");
        return {
          text: clean(item.querySelector(":scope > strong")?.textContent, 200),
          intent: clean(detail?.querySelector("span")?.textContent?.replace(/^.*?:\s*/u, ""), 80),
          reason: clean(detail?.querySelector("p")?.textContent?.replace(/^.*?:\s*/u, ""), 240),
          sourceRelation: clean(sourceBox?.querySelector("p")?.textContent, 180),
          sources: sourceBox ? collectSources(sourceBox, "provider_query_or_action") : [],
        };
      })
      .filter((query) => query.text);

    if (!queries.length) return;
    event.preventDefault();

    const evidenceLabel = clean(
      result.querySelector("[data-result-evidence]")?.textContent,
      160,
    );
    const evidenceState = /provider|anbieter/iu.test(evidenceLabel)
      ? "provider_exposed_native_search"
      : "modelled_search_ideas";
    const globalSourceSection = result.querySelector<HTMLElement>(
      "[data-result-sources-section]",
    );
    const payload = {
      schemaVersion: SEO_HANDOFF_SCHEMA,
      producer: "ai-fanout.com",
      transferredAt: new Date().toISOString(),
      run: {
        question: clean(result.querySelector("[data-result-keyword]")?.textContent, 160),
        language: planner.dataset.locale === "de" ? "de" : "en",
        market: clean(result.querySelector("[data-result-locale]")?.textContent, 120),
        providerLabel: clean(result.querySelector("[data-result-model]")?.textContent, 160),
        evidenceLabel,
        evidenceState,
        displayedRunTime: clean(result.querySelector("[data-result-date]")?.textContent, 120),
        queries,
        runSources: globalSourceSection
          ? collectSources(globalSourceSection, "provider_run")
          : [],
      },
      notice:
        "Browser-local handoff of the visible AI Fanout result. No second provider request and no claim of hidden queries, search demand, rankings, or independent validation.",
    };

    try {
      window.location.href = buildSeoResearchUrl(
        payload,
        "https://seo-fanout.com/tool/?utm_source=ai-fanout.com&utm_medium=referral&utm_campaign=result_research",
      );
    } catch {
      window.location.href = handoff.href;
    }
  });
}
