// data/cases.ts
// All case studies. Adding a case = adding an object here.

import type { Case } from '@/types/case';

export const cases: Case[] = [
  // =========================================================================
  // CASE 1 — True Blue Loyalty Rewards (Access Softek)
  // =========================================================================
  {
    slug: 'true-blue-loyalty',
    year: 2025,
    title: 'True Blue Loyalty Rewards',
    oneLineImpact:
      'Designed a tiered rewards system shipped simultaneously to two credit unions on a multi-tenant white-label platform — across web, iOS and Android.',
    meta: {
      company: 'Access Softek',
      industry: 'fintech',
      type: 'web + mobile',
      role: 'product designer',
      duration: '5 months',
      isNDA: false,
    },
    tags: ['multi-tenant', 'design system', 'web + mobile'],
    cover: {
      kind: 'nda',
      metric: '×2',
      caption: 'credit unions · simultaneous launch',
    },

    tldr: {
      problem:
        'Tiered loyalty system needed to ship simultaneously to two credit unions with different brands, tier counts, and benefits, on web and mobile.',
      solution:
        'Treated tier status as a system (icon + color + state), built a parameterized component library, made platform-specific layout decisions for desktop comparison vs. mobile sequence.',
      impact:
        'Shipped on schedule to Texas Trust and Evolve. Both adopted it as a core engagement product. Component system holds up through ongoing maintenance.',
    },

    // I will with real Loom URL when recorded; placeholder shows pretty empty state
    loomUrl: undefined,

    body: [
      // ===== 01 — Context =====
      { type: 'h2', mono: '// 01 — context', text: 'The product' },
      {
        type: 'p',
        text:
          "Access Softek serves credit unions that need a modern digital banking platform but don't have the engineering capacity to build one in-house. Each credit union deploys the platform under its own brand, with feature and visual customization per institution.",
      },
      {
        type: 'p',
        text:
          'True Blue Loyalty Rewards is a tiered membership program — Bronze, Silver, Gold, Blue Diamond — that rewards members with concrete benefits (loan skip payments, APY bumps on CDs, fee waivers, theater raffle entries) for the breadth of products they hold with their credit union. The strategic intent: encourage members to consolidate more financial products with their credit union, increasing both retention and cross-sell.',
      },
      {
        type: 'p',
        text:
          'I worked alongside a Product Manager who owned the program strategy and benefit definition. I owned the design execution: how the system would look, feel, and behave on web, iOS, and Android — in a way that could be deployed across multiple credit unions with brand and configuration variation.',
      },

      // ===== 02 — Problem =====
      { type: 'h2', mono: '// 02 — the problem', text: 'Where the design needed to land' },
      {
        type: 'p',
        text:
          'The PM defined what to ship; my job was figuring out how it should work as a designed system. The core design challenges were:',
      },
      {
        type: 'ul',
        items: [
          'Make tier progression feel motivating, not gatekeeping. The system needed to celebrate members\' current status while making the path to the next tier visible and achievable.',
          'Keep dense benefit information scannable. Each tier carried multiple concrete benefits with their own actions and fine print. Users needed to understand their status fast and compare tiers without getting buried in text.',
          'Survive multi-tenant deployment. The same feature would launch at two credit unions with overlapping but not identical benefit lists, brand colors, icon sets, and tier counts. Visual patterns and components had to be composable enough to handle variation without rebuilding.',
          'Work on web and mobile from day one — not as an afterthought. Members use both surfaces, and each platform supports a different mental model for engaging with rewards.',
        ],
      },

      // ===== 03 — Constraints =====
      { type: 'h2', mono: '// 03 — constraints', text: 'What I had to work with' },
      {
        type: 'ul',
        items: [
          'Multi-tenant: two credit unions launching simultaneously with brand and benefit variations. A third client could come online at any point.',
          "Existing design system: Access Softek's white-label platform has established components and patterns; the new feature had to fit, not fight the system.",
          'Compliance: NCUA membership disclosure, Equal Housing Lender notice, and standard regulatory footer elements needed clear placement.',
          'No direct end-user research access — typical for white-label platform design where the end user is mediated through the credit union and PM.',
          'I cannot share actual mockups in this case study due to NDA. Illustrations would be simplified, redrawn versions of patterns I designed, not reproductions of the production UI.',
        ],
      },

      // ===== 04 — Process =====
      { type: 'h2', mono: '// 04 — process', text: 'Designing tiers as a system' },
      {
        type: 'p',
        text:
          'I worked from the strategy PM owned and translated it into a designed system through several key decisions.',
      },

      { type: 'h3', text: 'A tier is a system, not a screen' },
      {
        type: 'p',
        text:
          "The temptation with a tiered loyalty program is to design four screens — one per tier. I treated tier status as a system: color, icon, and state combined into a visual language that reads identically anywhere it appears in the product. Every tier got a distinct icon family (shields for entry tiers, a diamond for the top tier) paired with a semantic color from the platform's existing palette. The same pattern shows up on the Rewards page, on the Accounts hero block, and in inline status references throughout the app — so members encounter their status consistently, not only when they navigate to a dedicated screen.",
      },

      { type: 'h3', text: 'Web and mobile solve different problems' },
      {
        type: 'p',
        text:
          'On desktop, members compare tiers side by side — "what do I get if I move from Silver to Gold?" The 2×2 grid layout puts all four tiers in one glance, with the user\'s current tier visually marked. On mobile, members read tiers in sequence — they\'re not comparing, they\'re scrolling through depth. So the mobile layout stacks tiers vertically. This wasn\'t a "make it responsive" decision — the two views serve different mental models.',
      },

      { type: 'h3', text: 'Status as anchor, benefits as disclosure' },
      {
        type: 'p',
        text:
          'Every screen leads with the user\'s current status — name and visual mark front and center ("You\'re a Blue Diamond Account Holder"). Benefit details sit one tap behind a "View benefits" secondary CTA. This progressive disclosure keeps the page scannable for the dominant case ("just remind me where I am") and provides depth for the smaller case ("show me everything I get and the path to the next tier").',
      },

      { type: 'h3', text: 'Built-in upsell, but not pushy' },
      {
        type: 'p',
        text:
          'The platform\'s strategic intent was cross-sell. The design surfaces this in two ways: an "X of Y products" progress indicator on locked tiers (so members see exactly what unlocks the next tier) and a contextual "Open an account / Apply for a loan" CTA at the bottom of the page (visible, but positioned after the educational content). The page motivates action without making the user feel sold to.',
      },

      { type: 'h3', text: 'Actions inside the rewards, not next to them' },
      {
        type: 'p',
        text:
          "The strongest version of a benefit isn't a description; it's a working button. Where benefits had associated actions in the platform — start a skip payment, replace a card — I deep-linked directly to those flows from inside the benefit copy. The Rewards page becomes a working tool, not a marketing surface.",
      },

      { type: 'h3', text: 'The iteration: one tier or all of them on the detail page?' },
      {
        type: 'p',
        text:
          'The most-discussed decision during review was the "View benefits" destination. PM wasn\'t sure whether tapping into a tier should reveal just that tier\'s full benefits or all tiers at once for comparison. We prototyped both. The answer turned out to be platform-specific: on desktop, where comparison is the dominant use case and the grid was already visible on the previous page, we kept the focused single-tier view (depth on top of comparison the user already saw). On mobile, where the user landed on the detail page expecting full breakdown, we showed all tiers stacked — the same pattern they\'d been scrolling on the overview, now with full benefit detail. Different platform, different right answer.',
      },

      { type: 'h3', text: 'Multi-tenant from the start, not retrofitted' },
      {
        type: 'p',
        text:
          "The feature launched simultaneously at two credit unions: Texas Trust and Evolve. Both use the same component system, but their loyalty programs differ: tier names, tier counts (Evolve has more tiers than Texas Trust), brand colors, icon sets, and benefit lists. I designed every component to be themed and parameterized — the tier card accepts variable tier counts, theme colors, icon assets, and benefit entries. Onboarding a third credit union with its own configuration doesn't require redesigning anything; it's a configuration change.",
      },

      // ===== 05 — Solution =====
      { type: 'h2', mono: '// 05 — solution', text: 'Three connected surfaces, one system' },
      { type: 'p', text: 'The shipped system spans three connected surfaces:' },
      {
        type: 'ul',
        items: [
          'Accounts hero - when a member opens the app, the top of the Accounts page shows their current tier status, tying loyalty visibility into the daily banking moment instead of hiding it in a sub-menu.',
          "Rewards overview — a scannable comparison view of all tiers, with the member's current tier visually marked, locked tiers showing required product progress, and a clear path to the next tier.",
          'Tier detail — full benefit information with deep-links to act on benefits the member already has (start a skip payment, replace a card). The rewards page becomes an actionable tool, not passive marketing.',
        ],
      },
      {
        type: 'p',
        text:
          'Underneath these surfaces is a reusable component library — Tier Card, Benefit Item, Status Badge, CTA Link — that lets the same design ship to multiple credit unions with their own brand and benefit configurations. The library was the deliverable as much as the screens.',
      },
    ],

    impact: [
      {
        metric: '×2 credit unions',
        text:
          'Shipped simultaneously to Texas Trust and Evolve, each with custom brand, tier counts, and benefit lists.',
      },
      {
        metric: '3 platforms',
        text: 'Live on web, iOS and Android from launch, with platform-specific layout decisions.',
      },
      {
        metric: '0 architectural rework',
        text:
          'The component system survived multi-tenant deployment and PM-driven iteration without redesign.',
      },
      {
        metric: '3+ months in production',
        text:
          'The feature still ships at both institutions and has absorbed ongoing maintenance without breaking.',
      },
    ],

    reflection: [
      "I'd push for at least one round of moderated usability testing with real members, even informally. The white-label structure made this logistically hard, but a tiered loyalty program is exactly the kind of feature where qualitative friction — do members understand the tier names? does the upsell feel earned or pushy? — can't be inferred from the screens alone.",
      "I'd write a tighter variation spec earlier in the project. The variation points between credit unions (tier counts, names, colors, benefits) emerged iteratively as the second client came online. A documented variation matrix from day one would have saved a few rounds of \"wait, can the system handle this?\" conversations with PM and engineering.",
      "I'd expose the path to the next tier more prominently. The current design shows product progress on locked tiers, but the connection between \"open this product\" and \"move up\" could be more direct. There's a product opportunity for personalized upsell — \"you're one product away from Gold\" as a contextual banner — that I'd push for in v2.",
    ],
  },
];

/** Find a case by slug. Returns undefined if not found. */
export function getCaseBySlug(slug: string): Case | undefined {
  return cases.find((c) => c.slug === slug);
}

/** Get the next case after the current one, looping back to first. */
export function getNextCase(currentSlug: string): Case | undefined {
  if (cases.length < 2) return undefined;
  const idx = cases.findIndex((c) => c.slug === currentSlug);
  if (idx === -1) return undefined;
  return cases[(idx + 1) % cases.length];
}