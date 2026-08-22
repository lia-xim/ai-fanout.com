import type { LibraryArticle } from "./library";

export const plainLanguageArticles = [
  {
    slug: "how-query-fanout-works",
    number: "L-14",
    category: "Concept",
    title: "How does query fanout work?",
    shortTitle: "How query fanout works",
    description: "A plain-English explanation of how one broad question can be split into smaller searches, what the result can show, and what remains private.",
    primaryIntent: "Understand the steps in query fanout without confusing a useful model with a provider's hidden process.",
    answer: "Query fanout starts with one broad question and turns it into several smaller questions. Each smaller question covers a different need: a definition, a comparison, a practical step, a risk, or a source to check. A search or AI system may use a related technique internally, but an outside tool can only model useful branches. It cannot reveal the exact private searches another system ran.",
    useWhen: "Use this guide when you need the basic process before planning content, research, or an audit.",
    reviewedAt: "2026-08-23",
    sections: [
      { id: "start", title: "Start with the real question", paragraphs: [
        "A good fanout begins with the question a person is actually trying to solve. 'How do I improve AI visibility?' is broad. It may contain separate needs about measurement, sources, technical access, content quality, and reporting. Splitting those needs makes the work easier to inspect.",
        "The first question should still be short enough to understand without extra notes. If it contains three projects, a URL, and a long brief, split it before building the fanout. Clear input makes it easier to spot repeated or irrelevant branches."
      ]},
      { id: "branches", title: "Give each branch a different job", paragraphs: [
        "Useful branches do not simply reword the same phrase. One may explain the concept, another may compare two approaches, and another may ask what evidence is needed. The difference is the job the reader is trying to complete.",
        "This is why a fanout is more than a list of keywords. It should show the likely intent, why the branch matters, what kind of source could answer it, and which assumption needs checking. Those fields make weak branches easier to reject."
      ]},
      { id: "check", title: "Check the branches before using them", paragraphs: [
        "A generated plan is a starting point. Remove branches that repeat one another, fall outside the topic, or depend on evidence you cannot obtain. Add an important user question if the plan missed it. Nothing about generation makes the list complete.",
        "Then compare the surviving branches with pages you already have. A branch may deserve a paragraph, an update to an existing page, a new page, or no action. The right choice depends on the user's job, not the number of phrases in the list."
      ]},
      { id: "limits", title: "Know what the diagram cannot prove", paragraphs: [
        "A fanout diagram can show how this tool organized a question. It cannot show the private retrieval path used by Google, ChatGPT, or another provider. Similar wording in a public answer does not prove that the provider ran the same searches.",
        "Use direct language: 'our planner suggested these branches' or 'the public answer covered these topics.' Avoid 'the model searched for' unless the provider supplies evidence for that exact case."
      ]}
    ],
    sourceIds: ["google-query-fanout", "google-ai-optimization", "portfolio-dossier"],
    relatedSlugs: ["query-fan-out", "how-to-check-a-fanout-plan", "can-tools-see-hidden-ai-queries"]
  },
  {
    slug: "how-to-check-a-fanout-plan",
    number: "L-15",
    category: "Field guide",
    title: "How to check an AI query fanout plan",
    shortTitle: "Check a fanout plan",
    description: "A practical review checklist for removing repeated, vague, unsupported, and unnecessary branches from an AI query fanout plan.",
    primaryIntent: "Review a generated fanout plan before turning any branch into research or content work.",
    answer: "Check a fanout plan in four passes: remove duplicates, confirm that every branch solves a different user need, verify that a suitable source can answer it, and decide whether it belongs on a new page, an existing page, or nowhere. Keep the original question beside the plan so a plausible-sounding branch cannot quietly pull the work off topic.",
    useWhen: "Use this checklist immediately after generating a plan and again before assigning content work.",
    reviewedAt: "2026-08-23",
    sections: [
      { id: "relevance", title: "1. Keep the original question in view", paragraphs: [
        "Read every branch beside the original question. Ask whether answering that branch would materially help the same person. A branch can be interesting and still be irrelevant. Mark those ideas for another project instead of stretching the current page.",
        "Also look for vague branches such as 'best practices' or 'future trends.' They need a clear decision or problem before they are useful. Rewrite them as a question someone could answer with evidence, or remove them."
      ]},
      { id: "overlap", title: "2. Remove repeated user jobs", paragraphs: [
        "Two branches may use different words but ask for the same outcome. 'How much does it cost?' and 'What is the pricing?' usually belong together. A comparison and a buying guide may sound related but can be separate if one explains differences and the other helps a reader choose.",
        "Write a one-line job beside each branch: learn, compare, calculate, decide, fix, or verify. If two branches have the same job and would use the same evidence, combine them unless there is a strong reason not to."
      ]},
      { id: "evidence", title: "3. Match each claim to a source", paragraphs: [
        "Name the source type before commissioning the work. Product behavior needs current provider documentation or direct testing. Legal or medical claims need appropriate primary and professional sources. A definition may need a standard or named documentation source.",
        "If the required evidence is unavailable, the branch may still be a hypothesis, but it is not ready to publish as fact. Record the gap rather than filling it with confident generalities."
      ]},
      { id: "destination", title: "4. Choose the smallest useful destination", paragraphs: [
        "A branch does not automatically deserve a URL. It may fit naturally into an existing guide, FAQ, comparison table, or tool result. Give it a separate page only when the user arrives with a distinct question and the page can answer that question fully.",
        "End the review with an action for every branch: new page, existing-page update, research note, hold, or reject. That simple decision list prevents a fanout from becoming a queue of thin articles."
      ]}
    ],
    sourceIds: ["google-helpful-content", "google-spam-policies", "portfolio-dossier"],
    relatedSlugs: ["how-query-fanout-works", "when-does-a-subtopic-need-its-own-page", "how-to-choose-sources-for-ai-content"]
  },
  {
    slug: "when-does-a-subtopic-need-its-own-page",
    number: "L-16",
    category: "Field guide",
    title: "When does a subtopic need its own page?",
    shortTitle: "Page or section?",
    description: "A simple decision framework for choosing whether a subtopic needs a separate page, a section on an existing page, or no new content.",
    primaryIntent: "Decide whether a fanout branch should become a page or remain part of a broader answer.",
    answer: "A subtopic needs its own page when it serves a distinct user job, requires enough evidence to answer properly, and would make the broader page harder to use if included there. Keep it as a section when the same reader needs it to complete the main task. Reject it when it merely repeats wording, lacks evidence, or exists only to target another keyword variation.",
    useWhen: "Use this decision before creating a brief, URL, or internal-link plan for a fanout branch.",
    reviewedAt: "2026-08-23",
    sections: [
      { id: "job", title: "Test whether the user job changes", paragraphs: [
        "Start with the action the reader wants to complete. A person asking 'what is query fanout?' needs a definition. A person asking 'how do I review a fanout plan?' needs a checklist. Those jobs can support separate pages even though they share a topic.",
        "Different wording alone is not a different job. Singular and plural forms, close synonyms, and small modifiers often belong on one strong page. The test is whether the best answer, evidence, and next step would genuinely change."
      ]},
      { id: "depth", title: "Check whether the answer has enough depth", paragraphs: [
        "A separate page should be able to answer the question early, explain the reasoning, show a useful example, and name its limits. If all you can write is a short definition followed by generic advice, it probably belongs inside a broader page.",
        "Depth does not mean adding length for its own sake. A calculator or comparison table may solve the job with little text. What matters is whether the page provides a complete and maintainable answer."
      ]},
      { id: "overlap", title: "Look for overlap with existing pages", paragraphs: [
        "Search your own site before creating the URL. If an existing page already answers most of the question, improve that page and link to the relevant section. Two pages competing to explain the same thing make navigation and maintenance harder.",
        "When both pages are useful, draw a clean boundary. State the primary question for each, link them in context, and avoid repeating the same introduction and evidence on both."
      ]},
      { id: "decision", title: "Record the decision, including no action", paragraphs: [
        "Use four outcomes: new page, existing-page section, merge into another idea, or reject. A hold is useful when the topic is relevant but evidence, ownership, or maintenance capacity is missing.",
        "This record matters because generated plans are easy to mistake for a publishing backlog. The plan suggests possibilities; the editorial decision explains why a URL deserves to exist."
      ]}
    ],
    sourceIds: ["google-ai-optimization", "google-helpful-content", "google-spam-policies", "portfolio-dossier"],
    relatedSlugs: ["how-to-check-a-fanout-plan", "query-fan-out", "query-fanout-vs-topic-clusters"]
  },
  {
    slug: "how-to-choose-sources-for-ai-content",
    number: "L-17",
    category: "Field guide",
    title: "How to choose sources for AI content research",
    shortTitle: "Choose useful sources",
    description: "A source-selection guide for matching definitions, product claims, comparisons, and practical advice to evidence that can support them.",
    primaryIntent: "Choose the right kind of source for each question in a fanout plan.",
    answer: "Choose sources by claim, not by convenience. Use current provider documentation for product behavior, standards or official records for definitions and rules, direct observation for what happened in a named test, and strong independent research for broader findings. Record publication date, scope, conflicts, and what the source cannot prove before using it.",
    useWhen: "Use this guide while turning a fanout branch into a research brief or checking an existing draft.",
    reviewedAt: "2026-08-23",
    sections: [
      { id: "claim", title: "Start with the claim you need to support", paragraphs: [
        "A source is only useful in relation to a specific sentence. 'Google documents query fanout for AI Mode' calls for Google documentation. 'This public answer showed three visible sources on 23 August' calls for a dated observation record. Neither source proves the other claim.",
        "Write the intended claim before collecting links. This prevents a pile of reputable-looking sources from replacing the harder task of matching evidence to language."
      ]},
      { id: "primary", title: "Prefer the closest available source", paragraphs: [
        "For features, terms, specifications, laws, and standards, begin with the organization responsible for them. For research findings, begin with the original paper and its methods. Secondary explanations can help a reader, but they should not silently become the foundation for a precise claim.",
        "Closest does not always mean sufficient. Provider documentation can describe a feature but may not establish independent effectiveness. A company case study can show what that company reports, not a general market result."
      ]},
      { id: "quality", title: "Check date, scope, method, and incentives", paragraphs: [
        "Record when the source was published or last updated and which product, country, language, or population it covers. Fast-changing AI features make old documentation especially easy to misuse.",
        "Look at how the result was produced and who benefits from the conclusion. A source can still be useful when it has a commercial interest, but that interest should shape the weight and wording you give it."
      ]},
      { id: "register", title: "Keep a small source register", paragraphs: [
        "For each important source, store its title, publisher, URL, date checked, the claim it supports, and any limitation or rights note. This is enough to make later review faster without building a large research system.",
        "If a source disappears or changes, the register shows which pages need attention. It also makes it easier to remove a claim cleanly instead of leaving unsupported text behind."
      ]}
    ],
    sourceIds: ["google-query-fanout", "nist-ai-rmf-genai", "w3c-prov-o", "portfolio-dossier"],
    relatedSlugs: ["how-to-check-a-fanout-plan", "observable-ai-answer-evidence", "audit-ai-answer-sources"]
  },
  {
    slug: "query-fanout-vs-keyword-clustering",
    number: "L-18",
    category: "Concept",
    title: "Query fanout vs keyword clustering: what is the difference?",
    shortTitle: "Fanout vs keyword clustering",
    description: "A practical comparison of query fanout and keyword clustering, including what each method is good for and where they overlap.",
    primaryIntent: "Choose between question decomposition and grouping an existing keyword set.",
    answer: "Query fanout starts with one question and proposes smaller questions, intents, and source needs that may help answer it. Keyword clustering starts with an existing keyword set and groups terms that appear to belong together. Fanout is useful for exploration; clustering is useful for organizing known demand. Neither method alone decides which pages should be published.",
    useWhen: "Use this comparison when planning research or content architecture and deciding which method should come first.",
    reviewedAt: "2026-08-23",
    sections: [
      { id: "inputs", title: "They start with different inputs", paragraphs: [
        "A fanout can begin with one plain question. Its job is to expose useful angles that may be missing from the initial wording. The output can include questions for learning, comparing, deciding, verifying, or implementing.",
        "Keyword clustering begins after you have a set of search terms, usually with metrics or search-result evidence. Its job is to organize that set into groups that may share an intent or suitable destination."
      ]},
      { id: "outputs", title: "They produce different kinds of output", paragraphs: [
        "A fanout plan should explain why each branch matters and what evidence could answer it. The branches are hypotheses until checked. They are not demand data and do not show that people search each phrase.",
        "A keyword cluster is an organizational claim about known terms. The strength of that claim depends on the clustering method and data. It still does not guarantee that every cluster needs its own page."
      ]},
      { id: "together", title: "Use them together in the right order", paragraphs: [
        "Fanout can help build a broader research list before keyword collection. Clustering can then show which observed terms appear to belong together. Editorial review decides whether the result belongs on a page, in a section, in a tool, or nowhere.",
        "The order can also run the other way. A cluster may reveal a broad user need, and a fanout can help break that need into research questions. Keep the outputs labelled so generated ideas are not confused with measured demand."
      ]},
      { id: "choice", title: "Choose by the question you need answered", paragraphs: [
        "Use fanout when you are asking, 'What would someone need to understand or decide here?' Use clustering when you are asking, 'Which terms in this dataset likely belong together?' Use both when you need exploration and evidence-led organization.",
        "If your actual question is 'What should we publish?', neither output is enough. You still need existing-page review, evidence availability, business fit, maintenance capacity, and a clear user benefit."
      ]}
    ],
    sourceIds: ["google-ai-optimization", "google-helpful-content", "google-spam-policies", "portfolio-dossier"],
    relatedSlugs: ["query-fan-out", "query-fanout-vs-topic-clusters", "when-does-a-subtopic-need-its-own-page"]
  },
  {
    slug: "query-fanout-vs-topic-clusters",
    number: "L-19",
    category: "Concept",
    title: "Query fanout vs topic clusters: how are they different?",
    shortTitle: "Fanout vs topic clusters",
    description: "A plain-language comparison of a fanout plan and a website topic cluster, with rules for avoiding thin or overlapping pages.",
    primaryIntent: "Understand when a set of question branches should and should not become a website topic cluster.",
    answer: "A query fanout is a map of possible questions around one starting point. A topic cluster is a set of published pages with defined jobs and links. Fanout happens during exploration; a topic cluster is an editorial and site-architecture decision. Several fanout branches may fit on one page, and some may not deserve publication at all.",
    useWhen: "Use this comparison before turning a generated branch map into a content plan.",
    reviewedAt: "2026-08-23",
    sections: [
      { id: "map", title: "A fanout is a question map", paragraphs: [
        "The fanout helps you see the territory around a broad question. It may include definitions, choices, practical steps, risks, and checks. Its value is that the branches are visible and can be reviewed before work begins.",
        "At this stage, branches are not URLs. Some are weak, some overlap, and some need evidence you do not have. Treating the map as a publishing list skips the most important decisions."
      ]},
      { id: "architecture", title: "A topic cluster is maintained site architecture", paragraphs: [
        "A useful cluster gives every page a clear primary job and connects pages where a reader benefits from moving between them. It also has an owner, review cycle, and reason to remain accurate.",
        "The cluster may contain a broad guide, focused how-to pages, a comparison, and a tool. It should not contain many near-identical pages made from small keyword variations."
      ]},
      { id: "conversion", title: "Convert branches into decisions", paragraphs: [
        "Review each branch against the current site. Combine repeated jobs, attach missing parts to strong existing pages, and reject ideas that cannot provide an original answer. Only then choose which gaps deserve new URLs.",
        "Internal links should follow the reader's next question. They are not decoration and they are not proof that pages belong in the same cluster. If a link does not help at that point, leave it out."
      ]},
      { id: "maintenance", title: "Plan for maintenance before expansion", paragraphs: [
        "Every new page adds a claim set, source list, link path, and future update. A smaller cluster that stays accurate is more useful than a large cluster that repeats itself or goes stale.",
        "Name the owner and review trigger for important pages. Product changes, source changes, legal changes, and new evidence are better triggers than an arbitrary promise to publish every week."
      ]}
    ],
    sourceIds: ["google-ai-optimization", "google-helpful-content", "google-spam-policies", "portfolio-dossier"],
    relatedSlugs: ["query-fanout-vs-keyword-clustering", "when-does-a-subtopic-need-its-own-page", "how-to-check-a-fanout-plan"]
  },
  {
    slug: "can-tools-see-hidden-ai-queries",
    number: "L-20",
    category: "Concept",
    title: "Can a tool see the hidden queries used by an AI system?",
    shortTitle: "Can tools see hidden queries?",
    description: "What an outside tool can observe in a public AI answer, what it can model, and why that is not the same as seeing private retrieval queries.",
    primaryIntent: "Check whether a fanout tool can reveal the actual hidden searches or reasoning used by another AI system.",
    answer: "An outside tool normally cannot see the private searches, retrieval candidates, ranking steps, or reasoning used inside another AI system. It can record the question you entered, the public answer, and visible links. It can also create its own plausible fanout plan. That plan may be useful for research, but it is not a recovered provider trace.",
    useWhen: "Use this page when evaluating a product claim, diagram, or report that appears to show an AI system's hidden process.",
    reviewedAt: "2026-08-23",
    sections: [
      { id: "visible", title: "What a public page can actually show", paragraphs: [
        "A researcher can usually record the submitted question, the visible answer, displayed citations or links, the route, date, locale, and settings they controlled. Those are direct observations when captured accurately.",
        "The public interface may also explain a feature in general. Provider documentation can support a statement about that documented feature, but it does not reveal the exact private steps taken for every answer."
      ]},
      { id: "model", title: "What a fanout tool creates", paragraphs: [
        "A fanout tool can take the user's question and generate a separate planning model: related questions, possible intents, source types, and assumptions. The tool should identify its own model and planner version so the origin of the output is clear.",
        "This output can help a team spot research gaps. It should be labelled as generated or modelled. Calling it 'the queries ChatGPT used' would replace a useful hypothesis with an unsupported claim."
      ]},
      { id: "claims", title: "How to check a hidden-query claim", paragraphs: [
        "Ask where the data came from. Was it shown by the provider, exposed through an authorized API, documented for the exact surface, or inferred from the answer? A screenshot of a branch diagram is not enough.",
        "Look for dates, route names, model identifiers, and a method that separates observed fields from analyst labels. If the seller cannot name that boundary, treat the hidden-query claim as unproven."
      ]},
      { id: "language", title: "Use wording that keeps the distinction clear", paragraphs: [
        "Good labels include 'suggested branches,' 'modelled subquestions,' and 'topics visible in the answer.' These phrases tell the reader what the tool did without pretending to have privileged access.",
        "This distinction does not make the tool less useful. It makes the result reviewable: readers can challenge a branch, change an assumption, and decide what evidence is still needed."
      ]}
    ],
    sourceIds: ["google-query-fanout", "w3c-prov-o", "portfolio-dossier"],
    relatedSlugs: ["how-query-fanout-works", "observable-ai-answer-evidence", "query-fan-out"]
  },
  {
    slug: "query-fanout-examples",
    number: "L-21",
    category: "Field guide",
    title: "Query fanout examples: from one question to useful branches",
    shortTitle: "Query fanout examples",
    description: "Three worked examples showing how a broad question can become distinct research branches without turning every variation into a page.",
    primaryIntent: "See what a useful fanout looks like and how its branches lead to different editorial decisions.",
    answer: "A useful query fanout gives each branch a different purpose. For a pricing question, branches might cover total cost, plan limits, alternatives, and cancellation. For a measurement question, they might cover the metric, data source, baseline, and failure cases. The branches are reviewed before any page is created: some become sections, some become pages, and some are rejected.",
    useWhen: "Use these examples when reviewing the quality of a generated plan or teaching a team how to work with one.",
    reviewedAt: "2026-08-23",
    sections: [
      { id: "software", title: "Example 1: choosing business software", paragraphs: [
        "Starting question: 'Which project management tool fits a ten-person agency?' Useful branches could cover team workflow, client access, reporting, integrations, total cost, migration effort, and cancellation terms. Each branch changes the decision in a specific way.",
        "A weak plan would produce several versions of 'best project management tool for agencies.' The stronger plan makes the choice criteria visible. Most criteria may belong in one comparison page; a detailed migration guide could deserve its own page if it solves a separate task."
      ]},
      { id: "measurement", title: "Example 2: measuring AI-answer visibility", paragraphs: [
        "Starting question: 'How do I know whether my site appears in AI answers?' Branches might cover which public surfaces are in scope, what counts as a visible source, how questions are sampled, how dates and locales are recorded, and how missing answers are handled.",
        "These branches expose the measurement contract. They do not reveal the provider's private searches. A team could use them to build one methodology page, a reusable observation template, and a separate guide to source auditing."
      ]},
      { id: "local", title: "Example 3: answering a local service question", paragraphs: [
        "Starting question: 'What should I ask before hiring a wedding photographer?' Branches could cover style, full-gallery review, availability, rights, backup plans, delivery times, pricing, and accessibility needs. The intent is practical preparation, not a list of city-keyword pages.",
        "The best destination may be one detailed checklist with links to pricing and rights explanations. Creating a separate thin page for every question would make the reader move more and learn less."
      ]},
      { id: "review", title: "What the examples have in common", paragraphs: [
        "Each plan begins with a real decision. The branches do different jobs, suggest different evidence, and stay close to the starting question. None of the examples treats the first generated list as final.",
        "After generation, combine overlap, verify sources, check the current site, and choose the smallest useful content change. That review is what turns a fanout from an idea list into a practical planning aid."
      ]}
    ],
    sourceIds: ["google-ai-optimization", "google-helpful-content", "google-spam-policies", "portfolio-dossier"],
    relatedSlugs: ["how-query-fanout-works", "how-to-check-a-fanout-plan", "when-does-a-subtopic-need-its-own-page"]
  }
] as const satisfies readonly LibraryArticle[];
