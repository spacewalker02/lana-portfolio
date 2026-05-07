// Single source of truth for all "about me" data.

export const profile = {
    name: 'Svetlana Saikova',
    handle: 'lana.design',
    role: 'Product Designer',
    positioning: 'Designing fintech interfaces & shipping them in code.',
  
    status: {
      available: true,
      label: 'available · may 2026',
    },
  
    location: 'Based in Asia · collaborating across US, EU & Asia time zones',
    experience: '3+ yrs in regulated fintech',
  
    heroSub: [
        "I'm Svetlana, a Product Designer with 3+ years in regulated fintech.",
        "I work end-to-end: research, UX, UI, design systems, and write the React that ships them.",
        "Based in Asia · collaborating across US, EU & Asia time zones.",
      ],
  
    bio: [
      `I spent the last three years inside a US fintech, designing
       regulated products — onboarding, KYC, lending. Most of that work
       lives behind NDAs and dashboards few people see. I learned to make
       calm, trustworthy interfaces under constraints other designers
       never touch.`,
  
      `Somewhere along the way I got tired of the handoff gap. So I learned
       React and TypeScript well enough to ship a feature myself - and now
       I prototype in code, build the marketing pages I design, and have
       real conversations with engineers about trade-offs.`,
  
      `I'm looking for a remote middle Product Designer role at a fintech,
       SaaS, or developer-tools company that values designers who think in
       systems and ship in code.`,
    ],
  
    contact: {
      email: 'svetlanasaykova@gmail.com',
      replyTime: 'I reply within 24 hours.',
      bestTime: 'Mon–Fri, 9–18 CET',
    },
  
    links: {
      linkedin: 'https://www.linkedin.com/in/svetlana-saikova-520b6611b/',
      github: 'https://github.com/spacewalker02',
      behance: 'https://behance.net/svetlanasaykova',
      telegram: 'https://t.me/say_fit',
      resume: '/resume.html',
    },
  } as const;