export type Gate = {
  readonly id: string;
  readonly label: string;
  readonly state: "open" | "not_granted";
  readonly explanation: string;
};

export const launchGates: readonly Gate[] = [
  {
    id: "G-01",
    label: "Fixed sampling protocol",
    state: "open",
    explanation: "Question classes, control set, locale, surfaces, routes, timing and missing-data rules are not frozen.",
  },
  {
    id: "G-02",
    label: "Named research owner",
    state: "open",
    explanation: "A responsible owner and backup reviewer have not been assigned.",
  },
  {
    id: "G-03",
    label: "Per-batch cost ceiling",
    state: "open",
    explanation: "A per-batch ceiling and twelve-month operating budget are not recorded.",
  },
  {
    id: "G-04",
    label: "Redistribution review",
    state: "open",
    explanation: "Retention, quotation and publication rights require a provider-by-provider review.",
  },
  {
    id: "G-05",
    label: "Comparable batches",
    state: "open",
    explanation: "Zero of three required comparable batches across at least 60 days exist.",
  },
  {
    id: "G-06",
    label: "Inspectable evidence package",
    state: "open",
    explanation: "No publishable raw or safely redacted observations, denominators or calculation package exists.",
  },
  {
    id: "G-07",
    label: "Public launch approval",
    state: "not_granted",
    explanation: "No explicit launch approval or verified custom-domain production release is recorded.",
  },
] as const;

export const studyRegistry = [
  {
    id: "AF-001",
    title: "Control-set longitudinal pilot",
    state: "Protocol draft",
    collection: "Not started",
    publication: "No findings",
    owner: "Not assigned",
    job: "Test whether a stable question set can produce lawful, comparable public observations across repeated windows.",
    gate: "Protocol, owner, cost and redistribution review remain open.",
  },
] as const;

export const observationSchema = [
  ["observation_id", "Stable record identifier"],
  ["observed_at", "UTC observation timestamp"],
  ["surface", "Public product or search surface"],
  ["surface_version", "Publicly available version or release identifier, when known"],
  ["locale", "Declared language and market context"],
  ["question_id", "Stable preregistered question identifier"],
  ["response_hash", "Integrity hash when retaining the response is permitted"],
  ["source_urls", "Visible cited or linked source URLs"],
  ["missing_reason", "Explicit reason when a field is unavailable"],
  ["protocol_version", "Version governing collection and calculation"],
] as const;

export const methodologySections = [
  {
    id: "observation-unit",
    number: "01",
    title: "Observation unit",
    body: "One public answer, its visible cited or linked sources, the public surface and configuration, locale, and timestamp.",
  },
  {
    id: "sampling-frame",
    number: "02",
    title: "Sampling frame",
    body: "Question classes and a stable control set must be fixed before collection starts.",
  },
  {
    id: "measures",
    number: "03",
    title: "Measures",
    body: "Source-domain diversity, source recurrence, answer overlap, citation persistence, and missingness—with denominators.",
  },
  {
    id: "comparability-breaks",
    number: "04",
    title: "Comparability breaks",
    body: "Prompt, route, model, interface, policy, locale, or sampling changes must create a new series or a visible annotation.",
  },
  {
    id: "redistribution",
    number: "05",
    title: "Redistribution",
    body: "Only material permitted by provider terms and applicable rights may be retained or published.",
  },
  {
    id: "corrections",
    number: "06",
    title: "Corrections",
    body: "Every correction records a version, affected records, reason, reviewer, and effect on comparability.",
  },
] as const;
