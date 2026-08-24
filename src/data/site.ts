export type NavigationItem = { readonly href: `/${string}`; readonly label: string };
export const site = {
  domain: "ai-fanout.com",
  url: "https://ai-fanout.com",
  language: "en" as const,
  title: "AI Query Fanout",
  description: "See the web searches and cited websites exposed by one OpenAI web-search run for your keyword.",
  purpose: "Help people inspect how one bounded AI web-search run expands a keyword into searches and sources.",
  status: "The learning pages are live. The free tool remains closed until its provider and abuse-protection gates pass live verification.",
  boundary: "The tool reports only provider-exposed API search actions. It does not inspect ChatGPT, reveal hidden reasoning or reconstruct missing queries.",
  primaryProject: "Contextter (accepted)",
  ownershipDisclosure: "Operated by Matthias Ramahi. ai-fanout.com, Contextter and SEO Fanout share an owner; those sites are not independent recommendations.",
  githubUrl: "https://github.com/lia-xim/ai-fanout.com",
  indexing: { allowed: true, launchApproval: true, excludedRoutes: ["/tracker", "/404", "/api", "/lab", "/protocol-builder", "/research", "/datasets", "/protocols"] },
  analytics: { enabled: false, provider: null },
  navigation: [
    { href: "/#tool", label: "Free tool" },
    { href: "/library", label: "Learn" },
    { href: "/methodology", label: "How it works" },
  ] satisfies readonly NavigationItem[],
} as const;
