// data/cases.ts
// All case studies. Adding a case = adding an object here.

import type { Case } from '@/types/case';

export const cases: Case[] = [
  // =========================================================================
  // CASE 1 — Loyalty Rewards (Access Softek)
  // =========================================================================
  {
    slug: 'multi-tenant-rewards',
    year: 2025,
    title: 'Multi-tenant loyalty system',
    oneLineImpact:
      'Designed a tiered rewards system shipped simultaneously to two credit unions on a multi-tenant white-label platform - across web, iOS and Android.',
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
      kind: 'screenshot',
      src: '/cases/true-blue/hero-desktop.png',
      alt: 'Desktop and mobile mockups showing tier-based rewards dashboard for Harbor Credit Union (fictional, NDA-safe brand)',
    },
    heroImage: {
      src: '/cases/true-blue/hero-desktop.png',
      alt: 'Desktop and mobile mockups showing tier levels and benefits, on a fictional Harbor Credit Union brand',
    },

    tldr: {
      problem:
        'Tiered loyalty system needed to ship simultaneously across web and mobile for two credit unions with different brands, tier counts, tier names, and benefit structures, without duplicating the experience.',
      solution:
        'Shared configurable framework: reusable tier cards, status states, benefit structures, and account-level logic that could adapt to each credit union\'s branding, tier model, icons, and reward rules.',
      impact:
        'Shipped to two credit unions in the same release. One configurable component framework supported both implementations, and the feature became a core engagement tool for both institutions.',
    },

    loomUrl: 'https://www.loom.com/share/93ca6bb03de44ac9981ae18c41ed2821',

    body: [
      // ===== 01 — Context =====
      { type: 'h2', mono: '// 01 context', text: 'The product' },
      {
        type: 'p',
        text:
          "Access Softek provides white-label digital banking platforms for credit unions. Each institution deploys the same core product under its own brand, with configurable features, visuals, and content.",
      },
      {
        type: 'p',
        text:
          'This project was a tiered loyalty system that helped credit union members understand their current status, available rewards, and path to the next tier. The business goal was to increase retention and cross-sell by encouraging members to hold more products with their credit union.',
      },
      {
        type: 'p',
        text:
          'I worked with a Product Manager who owned the program strategy and benefit definition. My role was to translate the loyalty model into a web, iOS, and Android experience that could support different brands, tier configurations, benefit structures, and visual systems without redesigning the flow from scratch.',
      },

      // ===== 02 — Problem =====
      { type: 'h2', mono: '// 02 the problem', text: 'Where the design needed to land' },
      {
        type: 'p',
        text:
          'The PM defined what to ship; my role was to translate the loyalty strategy into a scalable design system across web and mobile. The core design challenges were:',
      },
      {
        type: 'ul',
        items: [
          'Make tier progression feel motivating, not gatekeeping.   Celebrate the member\’s current status while making the path to the next tier clear and achievable.',
          'Keep dense benefit information scannable.   Help members understand their status, compare tiers, and access benefit details without getting buried in text.',
          'Support multi-tenant deployment. The same feature needed to work for credit unions with different tier counts, tier names, brand styles, icons, and benefit structures.',
          'Work across web and mobile from day one. The experience had to adapt to different screen sizes, content density, and navigation patterns without becoming a separate product on each platform.',
        ],
      },

      // ===== 03 — Constraints =====
      { type: 'h2', mono: '// 03 constraints', text: 'What I had to work with' },
      {
        type: 'ul',
        items: [
          'Multi-tenant launch: two credit unions with different tier models, brand systems, and benefit structures, with a third client possible later.',
          "Existing white-label design system: the feature had to extend Access Softek\’s established components and patterns, not introduce a disconnected experience.",
          'Compliance requirements: NCUA disclosure, Equal Housing Lender notice, and standard regulatory footer elements needed clear placement.',
          'Limited research access: end-user insight came through the credit unions and PM rather than direct member research.',
          'NDA constraints: visuals in this case study are simplified, redrawn representations of the patterns I designed, not production mockups.',
        ],
      },

      // ===== 04 — Process =====
      { type: 'h2', mono: '// 04 process', text: 'Designing a configurable loyalty framework' },
      {
        type: 'p',
        text:
          'I worked from the PM’s program strategy and translated it into a design framework that could support different credit union brands, tier models, and benefit structures.',
      },

      { type: 'h3', text: 'Tier status became a reusable pattern' },
      {
        type: 'p',
        text:
          "Each tier used the same core structure: name, visual mark, status state, criteria, benefit list, and optional CTA. The framework stayed consistent, while tier count, names, icons, colors, and benefits could change per credit union.",
      },

      { type: 'h3', text: 'The hierarchy starts with current status' },
      {
        type: 'p',
        text:
          'The experience leads with the member\’s current tier and progress, then lets them open benefit details when needed. This keeps the main page scannable while still supporting deeper exploration.',
      },
      {
        type: 'image',
        src: '/cases/true-blue/tier-system.png',
        alt: 'Four tier icons (Signature, Premier, Plus, Starter) shown next to three product contexts where the same icon-and-color combination is reused',
        caption: 'The same tier identity reads across Status Greeting, Tier Grid, and Tier Detail.',
      },

      { type: 'h3', text: 'Web and mobile use different content layouts' },
      {
        type: 'p',
        text:
          'On web, tiers can be compared side by side. On mobile, the same information becomes a stacked flow, which works better for narrow screens and longer benefit content.',
      },
      {
        type: 'image',
        src: '/cases/true-blue/web-vs-mobile.png',
        alt: 'Side-by-side comparison of web layout (2×2 tier grid for at-a-glance comparison) and mobile layout (vertical stack for sequential scrolling)',
        caption: 'Two layouts for two different questions — "what do I get if I move up?" vs. "where am I now?"',
      },

      { type: 'h3', text: 'Benefits can become actions' },
      {
        type: 'p',
        text:
          'Where a reward connected to an existing banking flow, the benefit included a direct action such as starting a skip payment or replacing a card.',
      },

      { type: 'h3', text: 'Multi-tenant variation was planned from the start' },
      {
        type: 'p',
        text:
          "The same framework supported two credit unions with different brands, tier counts, tier names, icons, and benefit lists, without redesigning the experience from scratch.",
      },

      // ===== 05 — Solution =====
      { type: 'h2', mono: '// 05 solution', text: 'Three connected surfaces' },
      { type: 'p', text: 'The loyalty experience shipped across three connected surfaces:' },
      {
        type: 'ul',
        items: [
          'Accounts hero: surfaces the member\’s current tier in the daily banking context, so loyalty status is visible without requiring the member to open a separate rewards page.',
          "Rewards overview: shows all tiers in a scannable comparison view, with the current tier marked and locked tiers showing progress toward the next level.",
          'Tier detail: provides the full benefit breakdown and links eligible benefits to existing banking flows, such as starting a skip payment or replacing a card.',
        ],
      },
      {
        type: 'p',
        text:
          'Underneath these surfaces, I designed reusable building blocks: Tier Card, Benefit Item, Status Badge, and CTA Link, so the same framework could support different credit union brands, tier models, and benefit configurations.',
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
      "Run at least one moderated usability test with real members to validate tier comprehension, benefit clarity, and the tone of the upsell.",
      "Define a variation matrix earlier, so tier counts, names, colors, icons, and benefits were documented before additional credit unions came online.",
      "Make the path to the next tier more direct, with contextual prompts like “You’re one product away from Gold.",
    ],
  },
  {
    slug: 'otp-configuration',
    year: 2024,
    title: 'Admin OTP configuration',
    oneLineImpact:
      'Designed a dense security configuration page that feels structured, explainable, and safe to use - without hiding important advanced controls.',
    meta: {
      company: 'Access Softek',
      industry: 'fintech',
      type: 'admin web app',
      role: 'product designer',
      duration: '~6 weeks',
      isNDA: false,
    },
    tags: ['information architecture', 'admin UX', 'security'],
    cover: {
      kind: 'screenshot',
      src: 'https://placehold.co/1280x800/f4f4f5/8a8a90?text=OTP+configuration+%E2%80%94+cover',
      alt: 'Admin OTP login configuration page. (Placeholder)',
    },
    heroImage: {
      src: 'https://placehold.co/1600x1000/f4f4f5/0a0a0a?text=OTP+configuration+%E2%80%94+full+page',
      alt: 'OTP login configuration page on the admin web app - structured by admin decision, with warning state on high-impact controls, inline help, and separated advanced targeting. (Placeholder)',
    },
    tldr: {
      problem:
        'A dense security configuration page where settings affected account access for every member. Many interdependent controls with different scopes; admins needed to understand both what a setting does and who it affects.',
      solution:
        'Structured by admin decision (not by input type), warning state on highest-impact controls, advanced targeting separated but visible, inline help where meaning is not obvious.',
      impact:
        'Same capability, different read. Pattern reused across two more admin configuration pages on the platform.',
    },
    loomUrl: undefined,
    body: [
      // ===== 01 — The product =====
      { type: 'h2', mono: '// 01 the product', text: 'The product' },
      { type: 'p', text: "Access Softek's admin platform lets financial institutions configure security settings for their digital banking experience. This page focused on OTP rules: when verification is required, who it applies to, and which delivery channels are available." },
  
      // ===== 02 — The problem =====
      { type: 'h2', mono: '// 02 the problem', text: 'The problem' },
      { type: 'ul', items: [
        'Settings affected account access and security, so mistakes could create serious friction.',
        'The page contained many interdependent controls with different scopes.',
        'Admins needed to understand both what a setting does and who it affects.',
      ] },
  
      // ===== 03 — Design challenge =====
      { type: 'h2', mono: '// 03 design challenge', text: 'Design challenge' },
      { type: 'p', text: 'The challenge was to make a dense security configuration page feel structured, explainable, and safe to use - without hiding important advanced controls.' },
  
      // ===== 04 — Design decisions =====
      { type: 'h2', mono: '// 04 design decisions', text: 'Design decisions' },
  
      { type: 'h3', text: 'Group settings by decision, not by input type' },
      { type: 'p', text: 'Not "radio / checkbox / dropdown", but by what the admin is configuring:' },
      { type: 'ul', items: [
        'request mode',
        'general settings',
        'user scope',
        'delivery channels',
        'account protection',
        'advanced settings',
      ] },
  
      { type: 'h3', text: 'Use warnings for high-impact choices' },
      { type: 'p', text: 'A warning sits next to the OTP request mode - it affects access for every member of the institution, so the consequences of changing it warrant a beat of attention before the click.' },
  
      { type: 'h3', text: 'Keep advanced targeting visible but separated' },
      { type: 'p', text: "Specific users, groups, excluded users, IP addresses - these matter for power admins, but shouldn't overload the base configuration. They live in their own section, separated from the everyday controls." },
  
      { type: 'h3', text: 'Add contextual help where meaning is not obvious' },
      { type: 'p', text: 'Inline help explains what each setting does and who it affects - so admins understand the scope of a control without leaving the page for documentation.' },
  
      // ===== 05 — Final direction / what shipped =====
      { type: 'h2', mono: '// 05 final direction', text: 'What shipped' },
      { type: 'p', text: 'A single configuration page: grouped sections, contextual warning at the highest-stakes decision, inline help on every field, and advanced targeting available but visually separated.' },
    ],
  
    impact: [
      { metric: 'Structure', text: 'Settings grouped by admin decision, not control type.' },
      { metric: 'Safety', text: 'High-impact OTP mode received a warning state.' },
      { metric: 'Clarity', text: 'Help text explained scope and consequences.' },
      { metric: 'Scalability', text: 'Advanced targeting supported users, groups, exclusions, and IPs.' },
    ],
  
    reflection: [
      "I'd run a quick user test with credit union admins early. Five 20-minute sessions would have caught misalignments faster than internal review.",
      'I\'d add a "recently changed" state for settings - a temporary highlight on dirty fields would help admins audit their edits before saving.',
      'I\'d add a "member flow preview" so admins could see what their members will experience on next login with the current configuration.',
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