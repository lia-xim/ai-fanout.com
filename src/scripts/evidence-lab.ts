type LabField = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
type SourceRecord = { raw: string; host: string };
type Observation = { label: string; surface: string; model: string; locale: string; observedAt: string; route: string; answer: string; sources: SourceRecord[]; invalidSources: string[] };
type EvidencePackage = {
  schema_version: "0.1"; method_version: "0.1"; generated_at: string; question: string; criteria: string[]; observations: Observation[];
  metrics: { unique_source_domains: number; recurring_source_domains: number; mean_answer_token_jaccard: number | null; literal_coverage_matches: number; literal_coverage_cells: number };
  source_presence: Record<string, boolean[]>; criterion_presence: Record<string, boolean[]>; comparability_notes: string[]; boundary: string;
};

const stopWords = new Set(["about", "after", "again", "also", "because", "before", "being", "between", "could", "does", "from", "have", "into", "more", "most", "other", "over", "such", "than", "that", "their", "there", "these", "they", "this", "those", "through", "under", "using", "very", "what", "when", "where", "which", "while", "with", "would", "your"]);
const normalizeText = (value: string) => value.toLocaleLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").replace(/\s+/g, " ").trim();
const tokenize = (value: string) => new Set(normalizeText(value).split(" ").filter((token) => token.length >= 4 && !stopWords.has(token)));
const intersect = <T>(left: Set<T>, right: Set<T>) => new Set([...left].filter((value) => right.has(value)));
const union = <T>(left: Set<T>, right: Set<T>) => new Set([...left, ...right]);
const pairwiseJaccard = (answers: string[]) => {
  if (answers.length < 2) return null;
  const sets = answers.map(tokenize); const scores: number[] = [];
  for (let left = 0; left < sets.length; left += 1) for (let right = left + 1; right < sets.length; right += 1) {
    const denominator = union(sets[left], sets[right]).size;
    scores.push(denominator === 0 ? 0 : intersect(sets[left], sets[right]).size / denominator);
  }
  return scores.reduce((sum, score) => sum + score, 0) / scores.length;
};
const uniqueLines = (value: string) => [...new Set(value.split(/\r?\n/).map((line) => line.trim()).filter(Boolean))];
const parseSources = (value: string) => {
  const valid: SourceRecord[] = []; const invalid: string[] = [];
  for (const raw of uniqueLines(value)) {
    try {
      const parsed = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
      const host = parsed.hostname.toLocaleLowerCase().replace(/^www\./, "");
      if (!host.includes(".")) throw new Error("Host missing");
      valid.push({ raw, host });
    } catch { invalid.push(raw); }
  }
  return { valid, invalid };
};
const download = (name: string, content: string, type: string) => {
  const url = URL.createObjectURL(new Blob([content], { type })); const link = document.createElement("a");
  link.href = url; link.download = name; link.click(); URL.revokeObjectURL(url);
};
const csvCell = (value: unknown) => `"${String(value ?? "").replaceAll('"', '""')}"`;

for (const root of document.querySelectorAll<HTMLElement>("[data-evidence-lab]")) {
  const form = root.querySelector<HTMLFormElement>("[data-lab-form]");
  const stack = root.querySelector<HTMLElement>("[data-observation-stack]");
  const template = root.querySelector<HTMLTemplateElement>("[data-observation-template]");
  const results = root.querySelector<HTMLElement>("[data-lab-results]");
  const error = root.querySelector<HTMLElement>("[data-form-error]");
  const questionInput = root.querySelector<HTMLTextAreaElement>("[data-lab-question]");
  const criteriaInput = root.querySelector<HTMLTextAreaElement>("[data-lab-criteria]");
  if (!form || !stack || !template || !results || !error || !questionInput || !criteriaInput) continue;

  let latestPackage: EvidencePackage | null = null;
  const cards = () => [...stack.querySelectorAll<HTMLFieldSetElement>("[data-observation]")];
  const getField = (card: HTMLFieldSetElement, name: string) => card.querySelector<LabField>(`[data-field="${name}"]`);
  const setField = (card: HTMLFieldSetElement, name: string, value: string) => { const input = getField(card, name); if (input) input.value = value; };
  const syncCards = () => {
    const current = cards();
    current.forEach((card, index) => {
      card.dataset.index = String(index); const number = String(index + 1).padStart(2, "0");
      const badge = card.querySelector<HTMLElement>("[data-observation-number]");
      const title = card.querySelector<HTMLElement>("[data-observation-title]") ?? card.querySelector("legend strong");
      const remove = card.querySelector<HTMLButtonElement>("[data-remove-observation]");
      if (badge) badge.textContent = number; if (title) title.textContent = `Observation ${index + 1}`;
      if (remove) { remove.disabled = current.length === 1; remove.setAttribute("aria-label", `Remove observation ${index + 1}`); }
      card.querySelectorAll<LabField>("[data-field]").forEach((field) => {
        const fieldName = field.dataset.field ?? "field"; field.id = `observation-${index + 1}-${fieldName}`; field.closest("label")?.setAttribute("for", field.id);
      });
    });
    const count = root.querySelector<HTMLElement>("[data-observation-count]"); const add = root.querySelector<HTMLButtonElement>("[data-add-observation]");
    if (count) count.textContent = `${current.length} of 5 observations`; if (add) add.disabled = current.length >= 5;
  };
  const addObservation = () => {
    if (cards().length >= 5) return null;
    const fragment = template.content.cloneNode(true) as DocumentFragment; const card = fragment.querySelector<HTMLFieldSetElement>("[data-observation]");
    if (!card) return null; stack.append(fragment); syncCards(); return card;
  };
  stack.addEventListener("click", (event) => {
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>("[data-remove-observation]");
    if (!button || cards().length === 1) return; button.closest("[data-observation]")?.remove(); syncCards();
  });
  root.querySelector("[data-add-observation]")?.addEventListener("click", () => addObservation()?.querySelector<HTMLInputElement>('[data-field="label"]')?.focus());

  const collectObservations = () => cards().map((card, index): Observation => {
    const sources = parseSources(getField(card, "sources")?.value ?? "");
    return { label: getField(card, "label")?.value.trim() || `Observation ${index + 1}`, surface: getField(card, "surface")?.value.trim() || "Not recorded", model: getField(card, "model")?.value.trim() ?? "", locale: getField(card, "locale")?.value.trim() || "Not recorded", observedAt: getField(card, "observedAt")?.value.trim() ?? "", route: getField(card, "route")?.value.trim() ?? "", answer: getField(card, "answer")?.value.trim() ?? "", sources: sources.valid, invalidSources: sources.invalid };
  });
  const makePresence = (items: string[], observations: Observation[], select: (observation: Observation) => Set<string>) => Object.fromEntries(items.map((item) => [item, observations.map((observation) => select(observation).has(item))]));
  const literalPresence = (criteria: string[], observations: Observation[]) => Object.fromEntries(criteria.map((criterion) => {
    const normalized = normalizeText(criterion); return [criterion, observations.map((observation) => normalizeText(observation.answer).includes(normalized))];
  }));
  const comparabilityNotes = (observations: Observation[], criteria: string[]) => {
    const notes: string[] = []; const distinct = (select: (observation: Observation) => string) => new Set(observations.map(select).filter(Boolean));
    if (observations.length === 1) notes.push("Single-observation audit: recurrence and answer-overlap measures require at least two observations.");
    if (distinct((item) => item.surface).size > 1) notes.push("Public surfaces differ. Treat this as a cross-surface comparison, not a longitudinal series.");
    if (distinct((item) => item.locale).size > 1) notes.push("Locales differ. Language and market context can change both answers and visible sources.");
    if (distinct((item) => item.model).size > 1) notes.push("Recorded model or version labels differ. Preserve those labels in any interpretation.");
    if (observations.some((item) => !item.model)) notes.push("At least one model or version label is missing.");
    if (observations.some((item) => !item.observedAt)) notes.push("At least one observation timestamp is missing.");
    if (distinct((item) => item.route).size > 1) notes.push("Routes or modes differ and may represent a comparability break.");
    if (observations.some((item) => item.sources.length === 0)) notes.push("At least one observation has no valid visible source URL; source measures are incomplete.");
    const invalid = observations.flatMap((item) => item.invalidSources);
    if (invalid.length) notes.push(`${invalid.length} source ${invalid.length === 1 ? "entry was" : "entries were"} excluded because a valid host could not be parsed.`);
    if (!criteria.length) notes.push("No coverage criteria were supplied, so literal coverage was not calculated.");
    notes.push("Source presence measures recurrence only; they do not rate source quality, support, authorship or independence."); return notes;
  };
  const renderMatrix = (table: HTMLTableElement | null, presence: Record<string, boolean[]>, observations: Observation[], empty: string) => {
    if (!table) return; const head = table.querySelector("thead"); const body = table.querySelector("tbody"); if (!head || !body) return;
    head.replaceChildren(); body.replaceChildren(); const row = document.createElement("tr"); const axis = document.createElement("th"); axis.scope = "col"; axis.textContent = "Evidence"; row.append(axis);
    observations.forEach((observation) => { const cell = document.createElement("th"); cell.scope = "col"; cell.textContent = observation.label; row.append(cell); }); head.append(row);
    const entries = Object.entries(presence);
    if (!entries.length) { const emptyRow = document.createElement("tr"); const cell = document.createElement("td"); cell.colSpan = observations.length + 1; cell.textContent = empty; emptyRow.append(cell); body.append(emptyRow); return; }
    entries.forEach(([label, states]) => {
      const matrixRow = document.createElement("tr"); const heading = document.createElement("th"); heading.scope = "row"; heading.textContent = label; matrixRow.append(heading);
      states.forEach((present, index) => { const cell = document.createElement("td"); cell.textContent = present ? "●" : "—"; cell.className = present ? "is-present" : "is-absent"; cell.setAttribute("aria-label", `${label} ${present ? "present in" : "absent from"} ${observations[index].label}`); matrixRow.append(cell); }); body.append(matrixRow);
    });
  };
  const analyze = () => {
    error.textContent = ""; const question = questionInput.value.trim(); const observations = collectObservations(); const missingAnswer = observations.findIndex((item) => !item.answer);
    if (!question) { error.textContent = "Enter the public user question before analyzing."; questionInput.focus(); return; }
    if (missingAnswer >= 0) { error.textContent = `Observation ${missingAnswer + 1} needs a visible final answer.`; getField(cards()[missingAnswer], "answer")?.focus(); return; }
    const criteria = uniqueLines(criteriaInput.value); const domains = [...new Set(observations.flatMap((item) => item.sources.map((source) => source.host)))].sort();
    const sourcePresence = makePresence(domains, observations, (item) => new Set(item.sources.map((source) => source.host))); const criterionPresence = literalPresence(criteria, observations);
    const recurring = Object.values(sourcePresence).filter((states) => states.filter(Boolean).length >= 2).length; const overlap = pairwiseJaccard(observations.map((item) => item.answer));
    const coverageMatches = Object.values(criterionPresence).flat().filter(Boolean).length; const coverageCells = criteria.length * observations.length; const notes = comparabilityNotes(observations, criteria);
    latestPackage = { schema_version: "0.1", method_version: "0.1", generated_at: new Date().toISOString(), question, criteria, observations, metrics: { unique_source_domains: domains.length, recurring_source_domains: recurring, mean_answer_token_jaccard: overlap, literal_coverage_matches: coverageMatches, literal_coverage_cells: coverageCells }, source_presence: sourcePresence, criterion_presence: criterionPresence, comparability_notes: notes, boundary: "Describes user-supplied public outputs only; does not verify factual accuracy or expose hidden queries, private retrieval traces, ranking internals or model reasoning." };
    const metric = (name: string, value: string) => { const node = root.querySelector<HTMLElement>(`[data-metric="${name}"]`); if (node) node.textContent = value; };
    metric("observations", String(observations.length)); metric("domains", String(domains.length)); metric("recurring", `${recurring} / ${domains.length}`); metric("overlap", overlap === null ? "—" : `${Math.round(overlap * 100)}%`); metric("coverage", coverageCells ? `${coverageMatches} / ${coverageCells}` : "—");
    const summary = root.querySelector<HTMLElement>("[data-result-summary]"); if (summary) summary.textContent = `${observations.length} ${observations.length === 1 ? "observation" : "observations"} for “${question}”. ${domains.length} visible source ${domains.length === 1 ? "domain" : "domains"}; ${recurring} recur across at least two runs.`;
    renderMatrix(root.querySelector("[data-source-matrix]"), sourcePresence, observations, "No valid visible source domains were supplied."); renderMatrix(root.querySelector("[data-coverage-matrix]"), criterionPresence, observations, "Add one observable phrase per line to calculate literal coverage.");
    const list = root.querySelector<HTMLElement>("[data-warning-list]"); if (list) { list.replaceChildren(); notes.forEach((note) => { const item = document.createElement("li"); item.textContent = note; list.append(item); }); }
    results.hidden = false; results.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
  };
  root.querySelector("[data-load-sample]")?.addEventListener("click", () => {
    while (cards().length < 3) addObservation(); questionInput.value = "What should a small team record before comparing public AI answers over time?"; criteriaInput.value = "observation timestamp\npublic surface\nvisible source URLs\nmissing data rule";
    const demo = [
      { label: "Demo A", surface: "Synthetic surface A", model: "Synthetic version A", locale: "en-US", observedAt: "2026-08-01T09:00", route: "Synthetic route A", answer: "Record an observation timestamp, the public surface, locale and visible source URLs. Keep a missing data rule beside the record.", sources: "https://method.example/observation\nhttps://schema.example/evidence" },
      { label: "Demo B", surface: "Synthetic surface B", model: "Synthetic version B", locale: "en-US", observedAt: "2026-08-08T09:00", route: "Synthetic route B", answer: "A repeatable record needs an observation timestamp, public surface, question and visible source URLs. State a missing data rule before comparison.", sources: "https://method.example/observation\nhttps://rights.example/retention" },
      { label: "Demo C", surface: "Synthetic surface C", model: "Synthetic version C", locale: "en-US", observedAt: "2026-08-15T09:00", route: "Synthetic route C", answer: "Record the public surface, locale, question, observation timestamp and any missing data rule. Preserve visible source URLs when retention is allowed.", sources: "https://method.example/observation\nhttps://schema.example/evidence" },
    ];
    cards().slice(0, 3).forEach((card, index) => Object.entries(demo[index]).forEach(([name, value]) => setField(card, name, value))); error.textContent = "Synthetic demo loaded. Its values are illustrative and are not research findings.";
  });
  form.addEventListener("submit", (event) => { event.preventDefault(); analyze(); });
  root.querySelector("[data-export-json]")?.addEventListener("click", () => { if (latestPackage) download("ai-fanout-evidence-package.json", JSON.stringify(latestPackage, null, 2), "application/json"); });
  root.querySelector("[data-export-csv]")?.addEventListener("click", () => {
    if (!latestPackage) return; const header = ["question", "label", "surface", "model", "locale", "observed_at", "route", "answer", "source_urls", "source_domains", "matched_criteria"];
    const rows = latestPackage.observations.map((item, index) => [latestPackage!.question, item.label, item.surface, item.model, item.locale, item.observedAt, item.route, item.answer, item.sources.map((source) => source.raw).join(" | "), item.sources.map((source) => source.host).join(" | "), latestPackage!.criteria.filter((criterion) => latestPackage!.criterion_presence[criterion][index]).join(" | ")]);
    download("ai-fanout-evidence-package.csv", [header, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n"), "text/csv;charset=utf-8");
  });
  root.querySelector("[data-clear-lab]")?.addEventListener("click", () => { form.reset(); while (cards().length > 2) cards().at(-1)?.remove(); syncCards(); latestPackage = null; results.hidden = true; error.textContent = ""; questionInput.focus(); });
  syncCards();
}
