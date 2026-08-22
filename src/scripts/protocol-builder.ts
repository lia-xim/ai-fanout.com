type ProtocolField = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
type ProtocolPackage = {
  schema_version: "0.1";
  state: "draft_not_preregistered";
  generated_at: string;
  protocol_id: string;
  name: string;
  objective: string;
  questions: string[];
  surface: { name: string; route: string; model_version_rule: string; access_state: string };
  observation: { locale: string; repetitions_per_question: number; cadence: string; planned_start: string | null; timezone: string };
  evidence: { missing_data_rule: string; exclusions_and_stop_rules: string; retention_decision: string; source_url_treatment: string };
  accountability: { research_owner: string | null; backup_reviewer: string | null; per_window_cost_ceiling: number | null; currency: string };
  boundary: string;
};

const lines = (value: string) => [...new Set(value.split(/\r?\n/).map((line) => line.trim()).filter(Boolean))];
const slugify = (value: string) => value.toLocaleLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 54) || "observation-protocol";
const downloadProtocol = (name: string, content: string, type: string) => {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement("a"); link.href = url; link.download = name; link.click(); URL.revokeObjectURL(url);
};
const toMarkdown = (item: ProtocolPackage) => `# ${item.name}

- Protocol ID: \`${item.protocol_id}\`
- State: draft, not preregistered
- Generated: ${item.generated_at}
- Locale: ${item.observation.locale}
- Public surface: ${item.surface.name}
- Route or mode: ${item.surface.route}

## Observable objective

${item.objective}

## Fixed question set

${item.questions.map((question, index) => `${index + 1}. ${question}`).join("\n")}

## Surface contract

- Model/version rule: ${item.surface.model_version_rule || "Not specified"}
- Access state: ${item.surface.access_state}
- Repetitions per question: ${item.observation.repetitions_per_question}
- Cadence: ${item.observation.cadence}
- Planned start: ${item.observation.planned_start || "Not scheduled"}
- Timezone: ${item.observation.timezone}

## Missingness, exclusions and rights

- Missing-data rule: ${item.evidence.missing_data_rule}
- Exclusions and stop rules: ${item.evidence.exclusions_and_stop_rules || "Not specified"}
- Retention decision: ${item.evidence.retention_decision}
- Source URL treatment: ${item.evidence.source_url_treatment}

## Accountability

- Research owner: ${item.accountability.research_owner || "Not assigned"}
- Backup reviewer: ${item.accountability.backup_reviewer || "Not assigned"}
- Per-window cost ceiling: ${item.accountability.per_window_cost_ceiling === null ? "Not assigned" : `${item.accountability.per_window_cost_ceiling} ${item.accountability.currency}`}

## Boundary

${item.boundary}
`;

for (const root of document.querySelectorAll<HTMLElement>("[data-protocol-builder]")) {
  const form = root.querySelector<HTMLFormElement>("[data-protocol-form]");
  const result = root.querySelector<HTMLElement>("[data-protocol-result]");
  const error = root.querySelector<HTMLElement>("[data-protocol-error]");
  const preview = root.querySelector<HTMLElement>("[data-protocol-preview]");
  const readiness = root.querySelector<HTMLElement>("[data-protocol-readiness]");
  if (!form || !result || !error || !preview || !readiness) continue;
  let latest: ProtocolPackage | null = null;
  const field = (name: string) => root.querySelector<ProtocolField>(`[data-protocol-field="${name}"]`);
  const value = (name: string) => field(name)?.value.trim() ?? "";
  const setValue = (name: string, next: string) => { const target = field(name); if (target) target.value = next; };
  const required = ["name", "locale", "objective", "questions", "surface", "route", "repetitions", "cadence", "missingRule", "retention"];
  const renderReadiness = (item: ProtocolPackage) => {
    const signals = [
      ["Observable objective recorded", Boolean(item.objective)],
      [`Fixed question set recorded (${item.questions.length})`, item.questions.length > 0],
      ["Surface, route and locale recorded", Boolean(item.surface.name && item.surface.route && item.observation.locale)],
      ["Missing-data rule recorded", Boolean(item.evidence.missing_data_rule)],
      ["Retention decision recorded", Boolean(item.evidence.retention_decision)],
      ["Research owner assigned", Boolean(item.accountability.research_owner)],
      ["Backup reviewer assigned", Boolean(item.accountability.backup_reviewer)],
      ["Per-window cost ceiling assigned", item.accountability.per_window_cost_ceiling !== null],
    ] as const;
    readiness.replaceChildren();
    signals.forEach(([label, ready]) => { const node = document.createElement("li"); node.textContent = label; node.classList.toggle("is-ready", ready); readiness.append(node); });
  };
  const generate = () => {
    error.textContent = "";
    const missing = required.find((name) => !value(name));
    if (missing) { error.textContent = "Complete every required protocol field before generating the package."; field(missing)?.focus(); return; }
    const questions = lines(value("questions"));
    if (!questions.length) { error.textContent = "Record at least one fixed public question."; field("questions")?.focus(); return; }
    const repetitions = Math.max(1, Math.min(20, Number(value("repetitions")) || 1));
    const costRaw = value("cost");
    latest = {
      schema_version: "0.1", state: "draft_not_preregistered", generated_at: new Date().toISOString(), protocol_id: `${slugify(value("name"))}-v0-1`,
      name: value("name"), objective: value("objective"), questions,
      surface: { name: value("surface"), route: value("route"), model_version_rule: value("modelRule"), access_state: value("accessState") },
      observation: { locale: value("locale"), repetitions_per_question: repetitions, cadence: value("cadence"), planned_start: value("start") || null, timezone: value("timezone") || "UTC" },
      evidence: { missing_data_rule: value("missingRule"), exclusions_and_stop_rules: value("exclusions"), retention_decision: value("retention"), source_url_treatment: value("sourceTreatment") },
      accountability: { research_owner: value("owner") || null, backup_reviewer: value("reviewer") || null, per_window_cost_ceiling: costRaw === "" ? null : Number(costRaw), currency: value("currency") || "EUR" },
      boundary: "This protocol observes public final answers and visible source links only. It does not expose hidden queries, private retrieval traces, ranking internals or model reasoning, and it does not authorize collection or redistribution.",
    };
    preview.textContent = toMarkdown(latest); renderReadiness(latest); result.hidden = false;
    result.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
  };
  form.addEventListener("submit", (event) => { event.preventDefault(); generate(); });
  root.querySelector("[data-load-protocol-sample]")?.addEventListener("click", () => {
    const example: Record<string, string> = {
      name: "Monthly public answer-source control set", locale: "en-US", objective: "Describe whether visible source-domain recurrence changes across repeated public answers while the declared question, surface, locale and route remain fixed.",
      questions: "What evidence should a small team retain when auditing public AI answers?\nHow should missing visible source data be recorded?", surface: "ChatGPT Search", route: "Search", modelRule: "Record the displayed model or version label; use unavailable when none is shown.", accessState: "Signed out", repetitions: "3", cadence: "Monthly", timezone: "UTC",
      missingRule: "Record unavailable answers and missing visible source lists as explicit observations; keep them in the denominator.", exclusions: "Stop a run when the public route changes or a security challenge blocks normal access. Do not automate around access controls.", retention: "Decision still blocked", sourceTreatment: "Retain normalized domains only", owner: "", reviewer: "", cost: "", currency: "EUR",
    };
    Object.entries(example).forEach(([name, next]) => setValue(name, next)); error.textContent = "Example loaded. It is a planning specimen, not a preregistered study.";
  });
  root.querySelector("[data-export-protocol-json]")?.addEventListener("click", () => { if (latest) downloadProtocol(`${latest.protocol_id}.json`, JSON.stringify(latest, null, 2), "application/json"); });
  root.querySelector("[data-export-protocol-markdown]")?.addEventListener("click", () => { if (latest) downloadProtocol(`${latest.protocol_id}.md`, toMarkdown(latest), "text/markdown;charset=utf-8"); });
}
