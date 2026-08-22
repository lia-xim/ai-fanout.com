export type NavigationItem = {
  readonly href: `/${string}`;
  readonly label: string;
};

export type SiteConfig = {
  readonly domain: string;
  readonly url: `https://${string}`;
  readonly language: "en";
  readonly title: string;
  readonly description: string;
  readonly purpose: string;
  readonly status: string;
  readonly boundary: string;
  readonly primaryProject: string;
  readonly ownershipDisclosure: string;
  readonly githubUrl: `https://${string}`;
  readonly indexing: {
    readonly allowed: false;
    readonly directive: "noindex, nofollow, noarchive";
    readonly launchApproval: false;
  };
  readonly analytics: {
    readonly enabled: false;
    readonly provider: null;
  };
  readonly navigation: readonly NavigationItem[];
};

export const site = {
  domain: "ai-fanout.com",
  url: "https://ai-fanout.com",
  language: "en",
  title: "AI Fan-out Research Observatory",
  description: "A noindex research incubator and source-grounded methods library for repeatable observations of public AI answers and visible sources.",
  purpose: "Publish research methods now and versioned observations, datasets and findings only after a repeatable protocol has passed every launch gate.",
  status: "Protocol draft. The reference library is available noindex; collection has not started and no public dataset or trend claim exists.",
  boundary: "This project observes public outputs. It does not claim access to hidden queries, private retrieval traces or model reasoning.",
  primaryProject: "Contextter (accepted)",
  ownershipDisclosure: "Operated by the team behind Contextter. Common ownership is disclosed and never treated as independent corroboration.",
  githubUrl: "https://github.com/lia-xim/ai-fanout.com",
  indexing: {
    allowed: false,
    directive: "noindex, nofollow, noarchive",
    launchApproval: false,
  },
  analytics: {
    enabled: false,
    provider: null,
  },
  navigation: [
    { href: "/research", label: "Research" },
    { href: "/library", label: "Library" },
    { href: "/datasets", label: "Datasets" },
    { href: "/methodology", label: "Methodology" },
    { href: "/tracker", label: "Tracker" },
    { href: "/transparency", label: "Transparency" },
  ],
} as const satisfies SiteConfig;
