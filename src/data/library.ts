export const libraryCategories = ["Concept", "Measurement", "Method", "Data standard", "Field guide"] as const;

export type LibraryCategory = typeof libraryCategories[number];

export type LibrarySection = {
  readonly id: string;
  readonly title: string;
  readonly paragraphs: readonly string[];
  readonly points?: readonly string[];
};

export type LibraryArticle = {
  readonly slug: string;
  readonly number: string;
  readonly category: LibraryCategory;
  readonly title: string;
  readonly shortTitle: string;
  readonly description: string;
  readonly primaryIntent: string;
  readonly answer: string;
  readonly useWhen: string;
  readonly reviewedAt: string;
  readonly sections: readonly LibrarySection[];
  readonly sourceIds: readonly string[];
  readonly relatedSlugs: readonly string[];
};

export const libraryArticles = [
  {
    slug: "query-fan-out",
    number: "L-01",
    category: "Concept",
    title: "What is query fan-out?",
    shortTitle: "Query fan-out",
    description: "A source-grounded definition of query fan-out, what public evidence can show, and what remains private to an AI search system.",
    primaryIntent: "Define query fan-out without claiming access to private generated queries.",
    answer: "Query fan-out is a retrieval technique in which an AI search system issues multiple related searches across subtopics or data sources to help develop a response. The public answer may reveal the final wording and visible links, but it does not normally reveal the full set of generated searches or private retrieval trace.",
    useWhen: "Use this definition when a report needs to separate a provider-documented mechanism from an observation made in a public answer.",
    reviewedAt: "2026-08-22",
    sections: [
      {
        id: "documented-mechanism",
        title: "The documented mechanism",
        paragraphs: [
          "Google describes query fan-out for AI Overviews and AI Mode as issuing multiple related searches across subtopics and data sources. That description establishes that the technique exists on those surfaces. It does not establish the exact searches generated for a particular answer, nor does it establish that every provider implements the same process.",
          "A careful definition therefore names the provider and surface. “Google documents query fan-out in AI Mode” is supportable. “Every assistant secretly runs these queries” is not. A generic label should never erase material differences between products, routes, locales or observation dates."
        ],
        points: [
          "Provider documentation supports a mechanism-level statement.",
          "A captured public answer supports an output-level observation.",
          "Neither source alone exposes a complete private retrieval trace."
        ]
      },
      {
        id: "observable-boundary",
        title: "What an observer can record",
        paragraphs: [
          "A public-output study can record the original submitted question, the public surface, locale, date and time, visible response, and visible cited or linked sources. It can also record its own route and settings. Those are direct observations when collected faithfully.",
          "Topic coverage, source patterns and wording may support a hypothesis about decomposition. They do not convert that hypothesis into a recovered list of hidden searches. The clean language is “consistent with decomposition” or “the response covered these subtopics,” followed by the evidence used."
        ]
      },
      {
        id: "seo-implication",
        title: "The SEO implication is depth, not page multiplication",
        paragraphs: [
          "Fan-out does not justify publishing a page for every imaginable query variation. Google’s current guidance says its systems can relate a useful page to many different searches and warns against producing separate pages primarily to manipulate rankings or generative AI responses.",
          "A defensible content architecture splits pages only when the user job changes. A definition, an audit procedure and a longitudinal sampling method deserve separate pages because they solve different problems. Three near-identical definitions with rearranged keywords do not."
        ],
        points: [
          "One page owns the core definition.",
          "Method pages explain how to collect and compare evidence.",
          "Field guides turn the method into a bounded task.",
          "Overlapping variants are consolidated into the strongest page."
        ]
      },
      {
        id: "reporting-language",
        title: "Language that keeps the claim honest",
        paragraphs: [
          "Write the evidence level into the sentence. Use “Google documents,” “we observed in the public response,” “we inferred from the observed pattern,” or “we have not verified.” This prevents a plausible interpretation from being presented as direct access.",
          "The distinction matters most when a diagram looks authoritative. A flow chart may explain the public methodology, but it must not depict guessed private queries as if they were captured records."
        ]
      }
    ],
    sourceIds: ["google-query-fanout", "google-ai-optimization", "google-spam-policies", "portfolio-dossier"],
    relatedSlugs: ["observable-ai-answer-evidence", "audit-ai-answer-sources", "sampling-ai-answers"]
  },
  {
    slug: "observable-ai-answer-evidence",
    number: "L-02",
    category: "Concept",
    title: "Observable evidence in AI answers",
    shortTitle: "Observable evidence",
    description: "A practical boundary between captured public AI-answer evidence, interpretation, and claims that cannot be verified from the output.",
    primaryIntent: "Distinguish direct public-output evidence from inference and unknown system behavior.",
    answer: "Observable AI-answer evidence is information a researcher can directly capture from the public interaction: the submitted question, visible answer, visible links or citations, declared settings, route, locale and timestamp. Explanations of hidden retrieval, ranking or reasoning remain inference unless the provider publishes corresponding evidence.",
    useWhen: "Use this boundary before designing a dataset, writing a claim, or reviewing a visual that appears to show internal system behavior.",
    reviewedAt: "2026-08-22",
    sections: [
      {
        id: "three-layers",
        title: "Keep three evidence layers separate",
        paragraphs: [
          "A usable observation record distinguishes the submitted input, the returned public output, and the observer’s interpretation. Mixing the layers makes later review almost impossible: an analyst cannot tell whether a label came from the interface, the provider documentation or the researcher.",
          "The first two layers can be recorded directly when terms and rights allow. The third layer is legitimate analysis, but it needs its own field, method and confidence. It should never overwrite the raw observation."
        ],
        points: [
          "Observed: text and controls visible in the public interaction.",
          "Supported: a mechanism described in named provider documentation.",
          "Inferred: an interpretation derived from observed patterns.",
          "Unknown: information neither observed nor documented for the case."
        ]
      },
      {
        id: "minimum-capture",
        title: "Minimum capture for a reviewable observation",
        paragraphs: [
          "Record a stable observation ID, timestamp with timezone, surface and route, locale, stable question ID, protocol version, visible source URLs, and a missing-data reason when an expected field is unavailable. If raw answer retention is restricted, record the permitted representation and the rule that produced it.",
          "A screenshot alone is weak provenance. It may show appearance, but often omits route, locale, timing, configuration and machine-readable source normalization. Pair visual evidence with a structured record whenever possible."
        ]
      },
      {
        id: "do-not-upgrade",
        title: "Do not upgrade an observation into a system claim",
        paragraphs: [
          "A source link appearing in an answer proves that the link was visible in that captured output. It does not prove how the system found, ranked, read or weighted the page. Similar answers across two runs show similarity across those runs, not permanent model stability.",
          "This is the most common reporting error in AI-search studies: the observation is real, but the sentence travels beyond it. A reviewer should be able to trace every claim back to the exact field or documentation source that supports it."
        ]
      },
      {
        id: "evidence-table",
        title: "A compact claim test",
        paragraphs: [
          "Before publication, ask four questions: What exactly was captured? Which part of the sentence comes from documentation? Which part is analysis? What plausible alternative explanation remains? If any answer is missing, reduce the claim or collect better evidence.",
          "The result may sound less dramatic, but it becomes more useful. Readers can repeat the observation, challenge the interpretation and understand what would change the conclusion."
        ]
      }
    ],
    sourceIds: ["google-query-fanout", "nist-ai-rmf-genai", "w3c-prov-o", "portfolio-dossier"],
    relatedSlugs: ["query-fan-out", "observation-schema", "reproducibility-package"]
  },
  {
    slug: "source-diversity",
    number: "L-03",
    category: "Measurement",
    title: "How to measure source diversity in AI answers",
    shortTitle: "Source diversity",
    description: "A denominator-first method for measuring domain, URL and source-type diversity in visible AI-answer citations.",
    primaryIntent: "Define source-diversity measures that remain interpretable across repeated AI-answer observations.",
    answer: "Source diversity describes how broadly visible citations are distributed across distinct URLs, domains or declared source classes within a defined observation set. A valid result names the unit, normalization rule, sample, denominator and missing-data treatment; a count of unique domains alone is not enough.",
    useWhen: "Use this method when a study needs to compare the breadth or concentration of visible sources across questions, surfaces or dates.",
    reviewedAt: "2026-08-22",
    sections: [
      {
        id: "choose-unit",
        title: "Choose the diversity unit first",
        paragraphs: [
          "URL diversity, registered-domain diversity and source-type diversity answer different questions. Ten cited URLs from one publisher can be diverse at page level and concentrated at domain level. A study should report the unit explicitly rather than using “sources” as an undefined count.",
          "Normalize hosts and URLs before counting. Decide how to handle www aliases, tracking parameters, fragments, syndicated copies, subdomains and redirects. Preserve the original visible URL beside the normalized value so the transformation remains reviewable."
        ],
        points: [
          "Unique visible URLs: breadth at document level.",
          "Unique registered domains: publisher concentration.",
          "Declared source classes: mix of documentation, research, editorial or other categories.",
          "Recurrence share: how much of the sample is occupied by repeating sources."
        ]
      },
      {
        id: "denominator",
        title: "Publish the denominator",
        paragraphs: [
          "A result such as “24 domains appeared” cannot be interpreted without the number of questions, answers returned, answers with citations and total visible citation slots. The denominator also changes when an interface returns no answer or no links.",
          "Report coverage before diversity: eligible observations, captured answers, answers with at least one visible source, and total source occurrences. Then report unique values and concentration. This prevents a sparse surface from looking diverse simply because only a few observations contained links."
        ]
      },
      {
        id: "interpretation",
        title: "Diversity is descriptive, not automatically good",
        paragraphs: [
          "A higher unique-domain count may reflect broader sourcing, noisy citations, repeated one-off domains or a different question mix. A lower count may reflect appropriate reliance on primary documentation. Diversity should therefore be interpreted beside question class, source relevance and source role.",
          "Do not turn the measure into an unvalidated quality score. If quality, authority or correctness matters, define and review those constructs separately."
        ]
      },
      {
        id: "comparison",
        title: "Comparing two windows",
        paragraphs: [
          "Use the same control questions, surface, locale, route, timing rule and normalization code. Compare both the set overlap and the distribution of occurrences. A stable unique count can hide a complete turnover in which domains appeared.",
          "Annotate interface or provider changes. If a change affects citation availability, the safest result may be a comparability break rather than a trend line."
        ]
      }
    ],
    sourceIds: ["w3c-prov-o", "fair-principles", "nist-ai-rmf-genai", "portfolio-dossier"],
    relatedSlugs: ["citation-persistence", "answer-stability", "missing-data-ai-observations"]
  },
  {
    slug: "answer-stability",
    number: "L-04",
    category: "Measurement",
    title: "How to measure AI answer stability",
    shortTitle: "Answer stability",
    description: "A repeatable framework for comparing public AI answers while separating wording overlap, claim continuity and source continuity.",
    primaryIntent: "Define answer stability without reducing it to one opaque similarity score.",
    answer: "AI answer stability is the degree to which selected observable features remain consistent across repeated, comparable observations. It can include response availability, claim continuity, structural overlap, visible-source overlap and citation persistence. The measure is only meaningful when the question, surface, locale, route and protocol are held stable or explicitly annotated.",
    useWhen: "Use this framework when comparing repeated answers or designing a longitudinal series.",
    reviewedAt: "2026-08-22",
    sections: [
      {
        id: "feature-vector",
        title: "Stability has several dimensions",
        paragraphs: [
          "Exact text matching is too brittle for most generated answers, while a single semantic score can hide important changes. Treat stability as a feature set. Record whether an answer appeared, which defined claims were present, how the response was structured, which sources were visible and which citations persisted.",
          "Choose the features before collection. Retrofitting the measure after seeing the answers invites selective interpretation and makes repeated batches harder to compare."
        ],
        points: [
          "Availability: answer returned, unavailable or interrupted.",
          "Claim continuity: preregistered propositions present or absent.",
          "Structural continuity: sections, ordering or answer form.",
          "Source continuity: URL or domain overlap.",
          "Citation persistence: recurrence for the same control question."
        ]
      },
      {
        id: "repeatability",
        title: "Control the observation conditions",
        paragraphs: [
          "Repeat the same stable question through the same declared route under the same locale and configuration. Record timestamps and any visible model or surface label. If account state, personalization or session context cannot be controlled, record that limitation rather than pretending the runs are identical.",
          "Multiple repetitions within a window help separate within-window variability from change between windows. The number and timing of repetitions belong in the protocol."
        ]
      },
      {
        id: "scoring",
        title: "Prefer inspectable components to a magic score",
        paragraphs: [
          "A composite score can be useful only when its components, weights and missing-data behavior are published. Otherwise it gives precision without interpretability. Report the component measures first and keep any composite secondary.",
          "For claim continuity, publish the coding guide and reviewer process. For source overlap, publish normalization rules. For text or embedding similarity, publish the model, version, threshold and sensitivity analysis where rights allow."
        ]
      },
      {
        id: "trend-boundary",
        title: "Two observations are a difference, not a trend",
        paragraphs: [
          "A change between two points is descriptive. A trend claim needs repeated comparable windows, enough observations to assess normal variation, and a protocol that survived the interval. A provider or interface change may require a new series.",
          "The practical reporting language is simple: name the dates, sample and observed difference; state whether the series met the preregistered trend gate."
        ]
      }
    ],
    sourceIds: ["nist-ai-rmf-genai", "w3c-prov-o", "rfc-3339", "portfolio-dossier"],
    relatedSlugs: ["compare-ai-answers-over-time", "citation-persistence", "comparability-breaks"]
  },
  {
    slug: "citation-persistence",
    number: "L-05",
    category: "Measurement",
    title: "Citation persistence in AI answers",
    shortTitle: "Citation persistence",
    description: "A precise method for measuring whether visible AI-answer citations recur for the same questions across runs and observation windows.",
    primaryIntent: "Measure citation recurrence without equating persistence with source quality or ranking causation.",
    answer: "Citation persistence is the recurrence of a normalized visible source for the same defined observation unit across repeated runs or windows. It is measured against eligible opportunities and must distinguish URL-level persistence, domain-level persistence and source-position changes.",
    useWhen: "Use this measure when the research question is whether the same visible sources continue to appear, not merely how many unique sources exist.",
    reviewedAt: "2026-08-22",
    sections: [
      {
        id: "unit",
        title: "Define an eligible opportunity",
        paragraphs: [
          "The most defensible unit is usually a stable question observed on a declared surface, locale and route in a defined window. A source has an opportunity to persist only when both comparison observations are eligible. Missing answers and interfaces without visible citations need explicit treatment.",
          "Do not silently remove failed or uncited observations. Report the eligible pair count, the missing pair count and the rule used for each."
        ]
      },
      {
        id: "normalization",
        title: "Preserve visible and normalized identities",
        paragraphs: [
          "Store the URL exactly as shown, then derive a normalized URL and registered domain. This permits several views: exact document recurrence, canonical-page recurrence and publisher recurrence. Each view answers a different question.",
          "Redirect resolution can change over time and may require network access. Record when and how it was resolved. Never rewrite the original captured value."
        ]
      },
      {
        id: "measures",
        title: "Report recurrence as a set of measures",
        paragraphs: [
          "For each control question, report intersection and union across windows, then aggregate with a declared weighting rule. A question with ten source slots should not silently dominate a question with one unless that weighting is intentional.",
          "Separate persistence from position. A source may recur while moving from a prominent citation to an expandable list. If visibility tiers matter, preregister them and capture the interface evidence."
        ],
        points: [
          "Exact-URL persistence rate.",
          "Normalized-page persistence rate.",
          "Registered-domain persistence rate.",
          "New, returning and disappeared source counts.",
          "Visibility-tier or position change, when reliably observable."
        ]
      },
      {
        id: "interpretation",
        title: "Persistence is not endorsement or quality",
        paragraphs: [
          "A persistent citation is a recurring visible source in the measured outputs. It is not proof that the source caused the answer, is correct, is preferred globally, or will appear for another user. Those claims require different evidence.",
          "Persistence becomes useful when paired with source relevance, question class and comparability notes. Alone, it is a descriptive recurrence measure."
        ]
      }
    ],
    sourceIds: ["w3c-prov-o", "rfc-3339", "fair-principles", "portfolio-dossier"],
    relatedSlugs: ["source-diversity", "answer-stability", "compare-ai-answers-over-time"]
  },
  {
    slug: "sampling-ai-answers",
    number: "L-06",
    category: "Method",
    title: "How to sample public AI answers",
    shortTitle: "Sampling AI answers",
    description: "A bounded sampling method for public AI-answer studies, covering the target population, strata, controls, repetitions and exclusions.",
    primaryIntent: "Design a repeatable AI-answer sample that supports a defined research question.",
    answer: "A defensible AI-answer sample starts with a target population and research question, then fixes eligible surfaces, locales, question classes, control questions, timing, repetitions and exclusions before collection. The sample is not representative merely because it is large; representativeness depends on how units were selected.",
    useWhen: "Use this method before collecting answers for a comparison, benchmark or longitudinal tracker.",
    reviewedAt: "2026-08-22",
    sections: [
      {
        id: "population",
        title: "Name the population you want to describe",
        paragraphs: [
          "“AI answers” is not a useful population. Define the provider surface, access route, locale, time period and question space. A study of English informational questions in one public search interface cannot automatically describe other languages, commercial tasks, logged-in assistants or API outputs.",
          "Write the scope as a sentence another researcher could use to decide whether a new observation belongs in the sample. Ambiguous membership produces ambiguous denominators."
        ]
      },
      {
        id: "question-frame",
        title: "Build a question frame before choosing examples",
        paragraphs: [
          "Group the question space by dimensions that matter to the research question: task type, answer form, topic volatility, source requirement, locale or another defensible class. Select within those strata using a documented rule.",
          "Convenient or hand-picked prompts may still support an exploratory pilot, but label the result accordingly. Do not present a convenience sample as a market-wide benchmark."
        ],
        points: [
          "Define inclusion and exclusion rules.",
          "Assign stable question IDs before collection.",
          "Separate fixed controls from rotating exploratory questions.",
          "Record the source of the question frame without exposing personal data."
        ]
      },
      {
        id: "repetitions",
        title: "Separate breadth from repetition",
        paragraphs: [
          "More unique questions improve coverage of the declared question space. More repetitions per question help estimate response variability. They are not interchangeable. A design needs enough of each for the intended measure.",
          "Fix the timing rule: sequential runs, spaced runs, fixed daily windows or another method. Avoid silently changing the schedule between batches."
        ]
      },
      {
        id: "pilot",
        title: "Run a protocol pilot, not a headline pilot",
        paragraphs: [
          "The first batch should test whether questions are unambiguous, capture fields work, missing cases are classified, costs are sustainable and provider terms permit retention. It is a method test, not a public trend result.",
          "Freeze the protocol only after documenting pilot changes. If those changes affect the observation unit or measure, start the comparable series after the freeze."
        ]
      }
    ],
    sourceIds: ["nist-ai-rmf-genai", "fair-principles", "portfolio-dossier", "google-helpful-content"],
    relatedSlugs: ["control-question-set", "missing-data-ai-observations", "reproducibility-package"]
  },
  {
    slug: "control-question-set",
    number: "L-07",
    category: "Method",
    title: "Designing a control question set",
    shortTitle: "Control question set",
    description: "A method for creating, freezing and maintaining a stable set of questions for longitudinal AI-answer observations.",
    primaryIntent: "Create a control set that detects change without drifting with every observation window.",
    answer: "A control question set is a versioned group of stable questions repeated under comparable conditions across observation windows. It should cover the declared question classes, avoid unstable wording, record expected answer constraints, and change only through an explicit version and comparability decision.",
    useWhen: "Use this method when a study needs a fixed reference series rather than a rotating collection of topical prompts.",
    reviewedAt: "2026-08-22",
    sections: [
      {
        id: "purpose",
        title: "Controls need a job",
        paragraphs: [
          "A control set is not a list of popular queries. Its job is to provide repeated observation units that make change interpretable. Each question should connect to a declared class or stress condition in the protocol.",
          "Include enough variety to expose the behavior under study, but keep the set small enough to repeat reliably within the cost ceiling. Unmaintainable controls are not controls."
        ]
      },
      {
        id: "selection",
        title: "Select for stability and diagnostic value",
        paragraphs: [
          "Prefer wording that has one clear task and does not depend on a private personal context. Flag time-sensitive questions, location-sensitive questions and questions whose correct answer changes. These can be useful, but they need their own interpretation.",
          "Record why each question exists, which class it represents and what would make it invalid. This protects the set from becoming an unexplained prompt collection."
        ],
        points: [
          "Stable question ID and exact submitted text.",
          "Question class and inclusion rationale.",
          "Locale and route requirements.",
          "Volatility or safety flag.",
          "Retirement condition."
        ]
      },
      {
        id: "freeze",
        title: "Freeze text and conditions together",
        paragraphs: [
          "The text alone is not the full control. Surface, route, locale, session rule, timing and available configuration belong to the protocol version. A stable prompt sent through a different route may be a different observation unit.",
          "Hash or otherwise identify the frozen control file. Publish the version and effective date. Where the raw question cannot be shared, publish enough metadata to explain the limitation without inventing reproducibility."
        ]
      },
      {
        id: "change-control",
        title: "Change through retirement and replacement",
        paragraphs: [
          "Do not edit a question in place. Retire the old ID with a reason and add a new ID. Decide whether the new question begins a new series or can be analyzed only as an adjacent exploratory track.",
          "Periodic review is still necessary. A formerly stable question may become ambiguous, unsafe, obsolete or impossible to run under changed provider terms. Version control preserves the history without forcing a broken control to continue forever."
        ]
      }
    ],
    sourceIds: ["w3c-prov-o", "fair-principles", "rfc-3339", "portfolio-dossier"],
    relatedSlugs: ["sampling-ai-answers", "comparability-breaks", "compare-ai-answers-over-time"]
  },
  {
    slug: "comparability-breaks",
    number: "L-08",
    category: "Method",
    title: "Comparability breaks in AI-answer studies",
    shortTitle: "Comparability breaks",
    description: "A decision framework for detecting, annotating and handling product or protocol changes that invalidate longitudinal comparisons.",
    primaryIntent: "Decide when an AI-answer observation series must be annotated, segmented or restarted.",
    answer: "A comparability break occurs when a change to the surface, route, model label, interface, locale, prompt, sampling frame, capture method or calculation changes what the observation means. The correct response is to annotate, segment or restart the series—not to smooth the change away.",
    useWhen: "Use this framework before comparing batches and whenever the product or protocol changes.",
    reviewedAt: "2026-08-22",
    sections: [
      {
        id: "triggers",
        title: "Watch the whole observation system",
        paragraphs: [
          "The model is only one source of change. Interfaces can alter whether citations are visible, routes can add browsing behavior, locale settings can change available sources, and capture code can normalize URLs differently. Any of these may change the measure.",
          "Maintain a change log beside every batch. Record provider announcements when available, but also record observed interface and response-shape changes because not every material change is announced."
        ],
        points: [
          "Surface, route or access-mode change.",
          "Visible model or version label change.",
          "Prompt, control set or question-class change.",
          "Locale, personalization or session-rule change.",
          "Citation UI or extraction change.",
          "Normalization, coding or metric change."
        ]
      },
      {
        id: "decision",
        title: "Classify the effect, not the size",
        paragraphs: [
          "A small implementation change can be a major methodological break if it changes the denominator. A large visual redesign may be immaterial if the captured fields remain identical. Review the effect on the observation unit, missingness, field meaning and measure.",
          "Use three outcomes: annotation when meaning is preserved, segmentation when comparison is possible only within eras, and restart when the unit or measure is no longer equivalent."
        ]
      },
      {
        id: "bridge",
        title: "Use overlap runs when possible",
        paragraphs: [
          "If a known change can be anticipated, run the old and new method over the same control subset. The overlap does not automatically repair comparability, but it provides evidence about the size and direction of the method effect.",
          "Document any bridge calculation separately. Never backfill old values with a new method without preserving the original release and explaining the revision."
        ]
      },
      {
        id: "reporting",
        title: "Make the break visible in the result",
        paragraphs: [
          "A chart should show the boundary, and the data release should carry the protocol version for every record. The narrative should state what changed and which comparisons remain valid.",
          "A broken series is not a failed study. Hiding the break is the failure. Visible segmentation is evidence that the research design responded honestly to a changing system."
        ]
      }
    ],
    sourceIds: ["w3c-prov-o", "nist-ai-rmf-genai", "rfc-3339", "portfolio-dossier"],
    relatedSlugs: ["answer-stability", "control-question-set", "reproducibility-package"]
  },
  {
    slug: "missing-data-ai-observations",
    number: "L-09",
    category: "Method",
    title: "Missing data in AI-answer observations",
    shortTitle: "Missing data",
    description: "A practical missing-data taxonomy for unavailable answers, absent citations, capture failures and rights-limited AI observations.",
    primaryIntent: "Record missing AI-answer data without silently changing denominators or confusing absence with zero.",
    answer: "Missing AI-answer data should be represented with an explicit reason and eligibility state. No answer, no visible citation, blocked access, capture failure and rights-limited retention are different conditions; none should be silently converted to a zero or dropped row.",
    useWhen: "Use this taxonomy when designing a schema, cleaning a batch or calculating any answer or source measure.",
    reviewedAt: "2026-08-22",
    sections: [
      {
        id: "not-zero",
        title: "Missing is not zero",
        paragraphs: [
          "An answer with zero visible citations is an observed value. An answer that failed to load has unknown citation count. A route that does not expose citations may be ineligible for a citation measure. Treating all three as zero changes the result and hides why.",
          "Store the raw state and derive measure eligibility through code. This keeps the record reusable when a later analysis applies a different defensible rule."
        ]
      },
      {
        id: "taxonomy",
        title: "Use a bounded reason taxonomy",
        paragraphs: [
          "Free-text notes are useful but difficult to aggregate. Define a small versioned set of machine-readable reasons, then allow an optional note for case detail. The taxonomy should match the actual collection process rather than copying a generic data-science list.",
          "A useful starting set separates response unavailable, response interrupted, no visible source, source UI unavailable, access blocked, capture failure, field not exposed, retention not permitted and protocol exclusion."
        ]
      },
      {
        id: "denominators",
        title: "Publish the eligibility flow",
        paragraphs: [
          "For every measure, show how the initial scheduled observations became the analyzed denominator. Report scheduled, attempted, completed, eligible, excluded and missing counts. Reasons should reconcile to the totals.",
          "When missingness differs by surface or window, report that before comparing the main metric. A change in missingness may explain an apparent change in diversity or stability."
        ],
        points: [
          "Never delete a scheduled observation because it failed.",
          "Never use one denominator label for different eligibility rules.",
          "Never infer “no citations” from a missing capture.",
          "Version changes to the reason taxonomy."
        ]
      },
      {
        id: "rights",
        title: "Rights-limited is a data state, not a loophole",
        paragraphs: [
          "Provider terms or applicable rights may permit metadata while restricting raw output retention or publication. Record the permitted representation and the decision source. Do not imply that a hash or summary reproduces content that reviewers cannot inspect.",
          "If the limitation prevents the research question from being audited, the correct outcome may be to withhold the claim or redesign the study."
        ]
      }
    ],
    sourceIds: ["fair-principles", "w3c-prov-o", "nist-ai-rmf-genai", "portfolio-dossier"],
    relatedSlugs: ["observation-schema", "source-diversity", "sampling-ai-answers"]
  },
  {
    slug: "observation-schema",
    number: "L-10",
    category: "Data standard",
    title: "An observation schema for public AI answers",
    shortTitle: "Observation schema",
    description: "A field-level blueprint for versioned, provenance-aware public AI-answer records without fabricated or private system data.",
    primaryIntent: "Implement a minimum viable record for repeatable public AI-answer observations.",
    answer: "A public AI-answer observation schema should identify the record, time, surface, route, locale, stable question, protocol version, visible answer and sources, missing-data state, rights state and provenance. It must keep captured values separate from normalized values and analyst inference.",
    useWhen: "Use this blueprint before collection or when reviewing whether an existing dataset can support reproducible comparisons.",
    reviewedAt: "2026-08-22",
    sections: [
      {
        id: "identity",
        title: "Identity and time",
        paragraphs: [
          "Give every scheduled observation a stable identifier before the result is known. Use an unambiguous timestamp with an explicit offset, such as an RFC 3339 representation. Record the collection window separately when timing is grouped for analysis.",
          "Identifiers should survive correction and publication. A corrected record becomes a version or successor; it should not silently replace the identity of the original observation."
        ]
      },
      {
        id: "context",
        title: "Surface and question context",
        paragraphs: [
          "Record provider, public product surface, access route, visible version label when available, locale, session rule and configuration relevant to the protocol. Store a stable question ID and the exact submitted text when permitted.",
          "Do not add fields for private ranking score, hidden query or chain of thought simply because they would be convenient. A schema should model evidence the study can actually obtain."
        ]
      },
      {
        id: "outputs",
        title: "Outputs, sources and transformations",
        paragraphs: [
          "Keep the visible source URL apart from normalized URL, registered domain and analyst-assigned source class. Record the transformation code version. If answer text cannot be retained, store only the permitted derivative and name its limitation.",
          "Inference belongs in a separate analysis table or clearly typed fields. This preserves the difference between what the surface returned and what the researcher concluded."
        ],
        points: [
          "Raw captured value, when permitted.",
          "Normalized value and transformation version.",
          "Missing reason and eligibility state.",
          "Rights or redistribution state.",
          "Protocol, collector and correction versions."
        ]
      },
      {
        id: "validation",
        title: "Validate before accepting a row",
        paragraphs: [
          "Use machine validation for required types, controlled vocabularies, timestamps, stable identifiers and referential links. Add study-specific checks for surface, locale and protocol compatibility.",
          "Validation cannot prove that a capture is truthful, but it can prevent structurally ambiguous records from entering the release. Preserve rejected rows and reasons in an audit log."
        ]
      }
    ],
    sourceIds: ["rfc-3339", "w3c-prov-o", "fair-principles", "portfolio-dossier"],
    relatedSlugs: ["missing-data-ai-observations", "reproducibility-package", "observable-ai-answer-evidence"]
  },
  {
    slug: "reproducibility-package",
    number: "L-11",
    category: "Data standard",
    title: "A reproducibility package for AI-answer research",
    shortTitle: "Reproducibility package",
    description: "The minimum evidence bundle needed to review, rerun and challenge a public AI-answer study within provider and rights constraints.",
    primaryIntent: "Package methods, observations, transformations and limitations so another practitioner can audit the study.",
    answer: "A reproducibility package connects a frozen protocol, control set, observation records, data dictionary, transformation code, environment and version notes, denominators, missing-data report, rights statement, results and correction log. When raw outputs cannot be shared, it must state exactly what cannot be reproduced.",
    useWhen: "Use this checklist before publishing a dataset, benchmark, tracker update or research claim.",
    reviewedAt: "2026-08-22",
    sections: [
      {
        id: "bundle",
        title: "Package the chain, not just the chart",
        paragraphs: [
          "A result is reproducible only to the extent that its inputs, transformations and environment can be understood. Publish the protocol version, control-set version, observation schema, records or permitted derivatives, calculation code and result artifact as linked entities.",
          "W3C provenance concepts are useful here: distinguish the entities, activities and responsible agents involved in creating a release. The implementation can remain simple while still preserving who did what with which input and version."
        ]
      },
      {
        id: "minimum",
        title: "Minimum release contents",
        paragraphs: [
          "Include a plain-language readme, machine-readable metadata, data dictionary, inclusion flow, missing-data table, calculation definitions, execution instructions, dependency lock, known comparability breaks, license or rights statement and contact for corrections.",
          "The package should name the tested environment and collection dates. “Latest” is not a version. A reader should be able to identify the exact release used by a report."
        ],
        points: [
          "Stable release identifier and publication date.",
          "Protocol, schema and control-set versions.",
          "Checksums for released files.",
          "Source and transformation provenance.",
          "Rights, exclusions and redistribution limits.",
          "Correction and supersession record."
        ]
      },
      {
        id: "limits",
        title: "Be precise about partial reproducibility",
        paragraphs: [
          "Public AI surfaces may change, and some outputs may not be redistributable. A later researcher may reproduce the procedure without receiving the same answer. Name whether the package supports computational reproduction, methodological review, rerunning the collection, or only inspection of aggregate calculations.",
          "If a critical input cannot be inspected, do not use “fully reproducible.” Describe the remaining audit path and the resulting limit on the claim."
        ]
      },
      {
        id: "maintenance",
        title: "Treat corrections as part of the package",
        paragraphs: [
          "Never overwrite a released result without a trace. Publish the reason, affected files or observations, corrected version, reviewer and effect on conclusions. Preserve the prior release when lawful and practical.",
          "A correction log is not a sign of weak research. It is the mechanism that lets a changing evidence base remain trustworthy."
        ]
      }
    ],
    sourceIds: ["w3c-prov-o", "fair-principles", "rfc-3339", "nist-ai-rmf-genai"],
    relatedSlugs: ["observation-schema", "comparability-breaks", "audit-ai-answer-sources"]
  },
  {
    slug: "audit-ai-answer-sources",
    number: "L-12",
    category: "Field guide",
    title: "How to audit sources in public AI answers",
    shortTitle: "Audit AI-answer sources",
    description: "A step-by-step field guide for capturing, normalizing and reviewing sources visibly cited in public AI answers.",
    primaryIntent: "Run a bounded, reviewable audit of visible AI-answer sources.",
    answer: "To audit AI-answer sources, freeze the question and observation conditions, capture the public answer and every visible source, preserve original URLs, normalize copies, classify missing cases, verify a bounded sample of target pages, and report counts with denominators and limitations. The audit covers visible citations, not hidden retrieval behavior.",
    useWhen: "Use this guide for a one-off evidence audit or as the collection procedure inside a registered study.",
    reviewedAt: "2026-08-22",
    sections: [
      {
        id: "scope",
        title: "1. Freeze the audit scope",
        paragraphs: [
          "Write the research question, public surface, route, locale, account or session rule, observation window and question list before capture. Define what counts as a visible source: inline citation, linked source panel, expandable source or another interface element.",
          "State what the audit cannot see. It does not recover private query fan-out, retrieval candidates, ranking weights or model reasoning."
        ]
      },
      {
        id: "capture",
        title: "2. Capture the public record",
        paragraphs: [
          "Assign an observation ID, record an offset timestamp, preserve the exact submitted question and capture the visible answer state. Store every visible source URL as shown, with its location or visibility tier when that distinction is reliable.",
          "When the answer or source panel is unavailable, record the missing reason. Do not rerun only failed cases until a preferred result appears unless the retry rule was defined in advance."
        ]
      },
      {
        id: "normalize-verify",
        title: "3. Normalize and verify without erasing provenance",
        paragraphs: [
          "Derive normalized URLs and registered domains while preserving the original values. Document parameter removal, redirect handling and canonical selection. Then open a bounded, stated sample of cited pages to check status, title, topic match and whether the page is actually accessible.",
          "A cited URL is not automatically evidence for the answer’s claim. The audit can distinguish source presence from source support, but claim-level verification needs a separate coding guide and reviewer process."
        ]
      },
      {
        id: "report",
        title: "4. Report coverage before conclusions",
        paragraphs: [
          "Publish scheduled and completed observations, answers with visible citations, total citation occurrences, unique URLs and domains, missing reasons and the verification sample size. Then report source recurrence, concentration or category mix if those measures were preregistered.",
          "Include the source list or a rights-safe representation when permitted. Name capture limitations, possible personalization, interface changes and any pages that could not be verified."
        ],
        points: [
          "Keep raw capture and analysis tables separate.",
          "Use one rule for every eligible observation.",
          "Show denominators beside percentages.",
          "Treat common ownership and conflicts explicitly.",
          "Publish corrections without deleting the old record."
        ]
      }
    ],
    sourceIds: ["google-query-fanout", "w3c-prov-o", "rfc-3339", "fair-principles", "portfolio-dossier"],
    relatedSlugs: ["observable-ai-answer-evidence", "source-diversity", "reproducibility-package"]
  },
  {
    slug: "compare-ai-answers-over-time",
    number: "L-13",
    category: "Field guide",
    title: "How to compare AI answers over time",
    shortTitle: "Compare answers over time",
    description: "A longitudinal field guide for comparing public AI answers across observation windows without overstating a difference as a trend.",
    primaryIntent: "Run a transparent time comparison of public AI answers with explicit comparability and trend gates.",
    answer: "To compare AI answers over time, repeat a frozen control set under the same declared conditions, preserve raw and normalized observations, measure predefined answer and source features, audit missingness and comparability breaks, and report dated differences before making any trend claim. Two windows show a change between two samples, not a durable trend.",
    useWhen: "Use this guide when moving from a one-off capture to a repeatable longitudinal observation series.",
    reviewedAt: "2026-08-22",
    sections: [
      {
        id: "preconditions",
        title: "1. Set the comparison contract",
        paragraphs: [
          "Freeze the control question set, surface, route, locale, session rule, repetition schedule, capture schema and measures. Define the minimum number of comparable windows and the conditions that break the series.",
          "Choose whether the study describes within-window variability, between-window change or both. The design and number of repetitions differ."
        ]
      },
      {
        id: "collect",
        title: "2. Collect each window as a versioned batch",
        paragraphs: [
          "Give every batch an identifier, protocol version, start and end time, environment note, rights state and cost record. Run the same validation and missing-data checks before calculating results.",
          "Do not backfill a missed run with a later observation and label it with the original date. Keep the gap visible."
        ]
      },
      {
        id: "compare",
        title: "3. Compare components, not impressions",
        paragraphs: [
          "Calculate the preregistered components: availability, claim continuity, structural features, source overlap, citation persistence, diversity and missingness as applicable. Preserve question-level results so an aggregate can be traced back to individual controls.",
          "Review changes in the question mix, source UI and missingness before interpreting the main metric. A stable average can hide offsetting changes; a large shift can be a capture-method effect."
        ]
      },
      {
        id: "report",
        title: "4. State the evidence level",
        paragraphs: [
          "Report the exact windows, sample, eligible denominator, observed difference and uncertainty or variability available from the design. Identify any segmented series and show the protocol version beside the data.",
          "Use “difference” for two comparable points. Reserve “trend” for the preregistered number of comparable windows across the required duration. For ai-fanout.com, the accepted public launch gate is at least three comparable batches across at least 60 days, plus the remaining evidence and ownership gates."
        ],
        points: [
          "Difference: a measured contrast between named windows.",
          "Pattern: repeated behavior within the observed sample.",
          "Trend: a preregistered longitudinal claim that passed the series gate.",
          "Hypothesis: an explanation that still needs targeted evidence."
        ]
      }
    ],
    sourceIds: ["nist-ai-rmf-genai", "w3c-prov-o", "rfc-3339", "portfolio-dossier"],
    relatedSlugs: ["answer-stability", "citation-persistence", "comparability-breaks"]
  }
] as const satisfies readonly LibraryArticle[];

export const libraryBySlug = new Map(libraryArticles.map((article) => [article.slug, article]));

export const libraryGroups = libraryCategories
  .map((category) => ({ category, articles: libraryArticles.filter((article) => article.category === category) }))
  .filter((group) => group.articles.length > 0);
