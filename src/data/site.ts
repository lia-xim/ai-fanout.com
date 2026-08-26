export type NavigationItem = { readonly href: `/${string}`; readonly label: string };
export const site = {
  domain: "ai-fanout.com",
  url: "https://ai-fanout.com",
  language: "en" as const,
  title: "AI Query Fanout",
  description: "Turn one keyword into ten modelled follow-up searches with GPT-5.6 Luna, DeepSeek V4 Flash or Gemini 3.7 Flash.",
  purpose: "Help people explore ten distinct research directions around one keyword before making SEO or editorial decisions.",
  status: "The free, CAPTCHA-protected fanout tool and bilingual learning pages are live.",
  boundary: "The tool creates a modelled research plan. It does not reveal hidden provider searches, retrieval traces or chain of thought.",
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
