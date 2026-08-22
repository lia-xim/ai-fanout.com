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
    readonly allowed: boolean;
    readonly launchApproval: boolean;
    readonly excludedRoutes: readonly string[];
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
  title: "AI Answer Evidence Lab",
  description: "A free, browser-local workbench for comparing observable AI answers, visible sources, coverage and stability without claiming access to private retrieval traces.",
  purpose: "Help people turn public AI answers and visible citations into a transparent, exportable evidence package before any trend or optimization claim is made.",
  status: "Evidence Lab, protocol tools and a reproducible synthetic example are public. No provider benchmark dataset or trend claim exists.",
  boundary: "This project observes user-supplied public outputs. It does not claim access to hidden queries, private retrieval traces or model reasoning.",
  primaryProject: "Contextter (accepted)",
  ownershipDisclosure: "Operated by Matthias Ramahi, Research Owner. Common ownership with Contextter is disclosed and never treated as independent corroboration.",
  githubUrl: "https://github.com/lia-xim/ai-fanout.com",
  indexing: {
    allowed: true,
    launchApproval: true,
    excludedRoutes: ["/tracker", "/404"],
  },
  analytics: {
    enabled: false,
    provider: null,
  },
  navigation: [
    { href: "/lab", label: "Evidence Lab" },
    { href: "/protocol-builder", label: "Protocol Builder" },
    { href: "/library", label: "Library" },
    { href: "/research", label: "Research" },
    { href: "/datasets", label: "Datasets" },
  ],
} as const satisfies SiteConfig;
