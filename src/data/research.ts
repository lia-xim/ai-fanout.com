export type Gate = {
  readonly id: string;
  readonly label: string;
  readonly state: "open" | "met";
  readonly explanation: string;
};

export const governance = {
  researchOwner: "Matthias Ramahi",
  protocolVersionResponsibility: "Matthias Ramahi assigns and records protocol versions before a study run.",
  correctionsResponsibility: "Matthias Ramahi records the affected route or record, reason, date, reviewer status and comparability effect.",
  reviewerStatus: "No independent reviewer is assigned. Pages must not describe owner review as independent review.",
  currentProviderApiBudget: "EUR 0: the public tools make no provider/API calls and run only on user-supplied browser-local inputs.",
  futureCollectionBudget: "A separate per-window ceiling is required before any site-run provider collection.",
  benchmarkStatus: "No independent provider benchmark has been run or published.",
  reviewCadence: "Quarterly, with the next governance review scheduled for 2026-11-22.",
} as const;

export const launchGates: readonly Gate[] = [
  {
    id: "G-01",
    label: "Fixed sampling protocol",
    state: "open",
    explanation: "The dated synthetic example is reproducible, but a provider-comparison control set, locale, routes, timing and missing-data rules are not frozen.",
  },
  {
    id: "G-02",
    label: "Named research owner",
    state: "met",
    explanation: "Matthias Ramahi is the named Research Owner. No independent reviewer is currently assigned.",
  },
  {
    id: "G-03",
    label: "Current tool cost ceiling",
    state: "met",
    explanation: "Current provider/API collection budget is EUR 0 because both tools run on user-supplied inputs in browser memory. Future site-run collection needs a separate ceiling.",
  },
  {
    id: "G-04",
    label: "Redistribution review",
    state: "open",
    explanation: "Provider-by-provider retention, quotation and publication rights remain required before any site-run output dataset is retained or published.",
  },
  {
    id: "G-05",
    label: "Comparable provider batches",
    state: "open",
    explanation: "Zero of three required comparable provider batches across at least 60 days exist. The synthetic example is not a provider batch.",
  },
  {
    id: "G-06",
    label: "Inspectable provider evidence package",
    state: "open",
    explanation: "No public provider-output package, independent benchmark or trend dataset exists. The synthetic example validates only the local calculation workflow.",
  },
  {
    id: "G-07",
    label: "Minimum viable website launch",
    state: "met",
    explanation: "Matthias Ramahi approved indexation once the legal, technical and evidence boundaries passed launch QA.",
  },
] as const;

export const studyRegistry = [
  {
    id: "AF-001",
    title: "Control-set longitudinal pilot",
    state: "Protocol draft",
    collection: "Not started",
    publication: "No findings",
    owner: "Matthias Ramahi",
    job: "Test whether a stable question set can produce lawful, comparable public observations across repeated windows.",
    gate: "Protocol freeze, independent reviewer status, future collection cost and provider rights review remain open.",
  },
] as const;

export const observationSchema = [
  ["observation_id", "Stable record identifier"],
  ["observed_at", "UTC observation timestamp"],
  ["question", "Exact public question supplied for the observation"],
  ["surface", "Public product or search surface"],
  ["surface_version", "Publicly available version or release identifier, when known"],
  ["locale", "Declared language and market context"],
  ["question_id", "Stable preregistered question identifier when a protocol defines one"],
  ["answer_text", "User-supplied public answer text when local processing or retention is permitted"],
  ["response_hash", "Integrity hash when retaining the response is permitted"],
  ["source_urls", "Visible cited or linked source URLs"],
  ["coverage_criteria", "User-defined literal phrases tested against the supplied answer"],
  ["missing_reason", "Explicit reason when a field is unavailable"],
  ["protocol_version", "Version governing collection and calculation"],
] as const;

export const methodologySections = [
  {
    id: "observation-unit",
    number: "01",
    title: "Observation unit",
    body: "One user-supplied public answer, its visible cited or linked sources, the public surface and configuration, locale, and timestamp.",
  },
  {
    id: "sampling-frame",
    number: "02",
    title: "Sampling frame",
    body: "Question classes and a stable control set must be fixed before provider collection starts.",
  },
  {
    id: "measures",
    number: "03",
    title: "Measures",
    body: "Visible source-domain recurrence, mean pairwise token Jaccard overlap, literal phrase coverage, and missingness—with explicit denominators and limitations.",
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
    body: "Every correction records a version, affected records, reason, reviewer status, and effect on comparability.",
  },
] as const;
