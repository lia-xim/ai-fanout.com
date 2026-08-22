# Controlled Signal

## Accepted direction

A premium, modern research interface built around one idea: **controlled signal**. The website uses a calm near-black field, cool-white type, precise graphite rules, cyan for observable evidence and restrained red only for open or blocked states. It behaves like an inspectable research system, not a faux paper, terminal or generic SaaS dashboard.

The library extends the system with a typographic reference index, direct-answer bands, sticky evidence spines and source rails. It avoids article cards, decorative dashboards and interchangeable blog templates.

## Selected design skills

- `premium-frontend-ui`: foundational direction for strong first viewports, authored navigation, coherent editorial rhythm, high type-scale contrast and disciplined motion.
- `impeccable-design-polish`: final audit of the rendered library for hierarchy, spacing, anti-slop, responsive composition, interaction states and accessibility hardening.
- `frontend-testing-debugging`: production browser verification at desktop and mobile sizes, including the library filter, mobile navigation, overflow and runtime/console state.

Deliberately rejected: `redesign-existing-projects` because the accepted Controlled Signal direction was extended rather than replaced; `frontend-design`, `minimalist-ui`, `industrial-brutalist-ui` and `od-crazy-websites` because a second foundational aesthetic would dilute the system; all GSAP and motion skills because category filtering, navigation and reading flow need no choreographed animation; image generation because code-native composition remains the domain-specific visual asset.

## Tokens

- Background: `#080b0d`
- Surface: `#0d1114`
- Raised surface: `#11171b`
- Primary text: `#f3f7f8`
- Muted text: `#9aa6ab`
- Observable/source: `#27c7f4`
- Open/blocked: `#ff5b4d`
- Focus: `#8de7ff`
- Strong rule: `rgba(224, 235, 239, 0.28)`
- Fine rule: `rgba(224, 235, 239, 0.13)`
- Display: condensed modern system sans stack
- Body: Segoe UI/Helvetica-style system grotesk
- Metadata: system monospace, used sparingly
- Motion: 180ms controls; 520ms first-view entrance; transforms and opacity only

## Component rules

- Maximum surface width: `96rem`; horizontal gutter follows `clamp(1.25rem, 4vw, 4.5rem)`.
- Open bands, rails, lists and tables are preferred over cards.
- The Observation Field remains the homepage signature composition.
- The Library Index is the signature research-navigation composition.
- Article pages use one direct-answer band, one sticky evidence spine and one source register.
- Cyan is semantic: observable evidence, current navigation and active controls.
- Red is semantic: open gates and unobserved/private boundaries.
- Borders stay square and precise; circles are reserved for steps and state nodes.
- No decorative eyebrow, status pill, proof badge, fake chart, fake metric, glass panel, glow field or bento grid.

## Responsive composition

- Desktop library: asymmetric hero; filterable ruled index; persistent evidence spine beside a calm reading column.
- Mobile library: the hero recomposes at large editorial scale; index metadata becomes a two-row record; evidence spine becomes a two-column then single-column table of contents.
- Detail titles use intentional wrapping rather than scaled desktop leftovers.
- Minimum target size: 44px. No horizontal page scroll at 320px.

## Motion and accessibility

- Motion clarifies entrance, selection and directional hover only.
- Category filters use native buttons and `aria-pressed`; filtered results retain ordinary crawlable links.
- No scroll hijacking, pinning, infinite animation or custom cursor.
- `prefers-reduced-motion: reduce` collapses non-essential animation and transitions.
- Native landmarks, keyboard-operable controls, visible focus rings, high-contrast text, breadcrumbs and semantic source lists remain mandatory.

## Rendered proof

- Desktop library hub: 1440×1000, 13 references, six filters, no overflow.
- Mobile article: 390×844, intentional title composition, mobile menu, four substantive sections and source register, no overflow.
- Local Chrome CDP verification: filter state 4 visible / 9 hidden, mobile menu opened, no runtime or console problems.

Screenshots are QA artifacts only and are stored outside the repository under the current Codex visualization workspace.
