// Single source of truth for all "about me" data.

export const profile = {
    name: 'Svetlana Saikova',
    photo: '/svetlana.png',
    handle: 'lana.design',
    role: 'Product Designer',
    positioning: 'Designing fintech interfaces & shipping them in code.',
  
    status: {
      available: true,
      label: 'available · may 2026',
    },
  
    location: 'Dubai / Remote · working flexibly across US, EU, and Asia time zones',
    experience: '3+ yrs in fintech',
  
    heroSub: [
        "I'm Svetlana, a Product Designer with 3+ years in fintech.",
        "I work end-to-end: research, UX, UI, design systems, and write the React that ships them.",
        "Dubai / Remote · collaborating across US, EU & Asia time zones.",
      ],
  
    bio: [
        `I spent the last three years at Access Softek, an American fintech
        building white-label digital banking platforms for US credit unions.
        I designed multi-tenant features that ship to multiple institutions
        simultaneously, each with its own brand, benefits, and configuration.`,
   
       `Somewhere along the way I got tired of the handoff gap. So I learned
        React and TypeScript well enough to prototype in code, validate UI
        implementation directly in DevTools, and have real conversations
        with engineers about trade-offs.`,
   
       `I'm looking for a remote middle Product Designer role at a fintech,
        SaaS, or developer-tools company that values designers who think in
        systems and ship in code. Open to flexible time zones.`,
    ],
  
    contact: {
      email: 'svetlanasaykova@gmail.com',
      replyTime: 'I reply within 24 hours.',
      bestTime: 'flexible · Mon–Fri',
    },
  
    links: {
      linkedin: 'https://www.linkedin.com/in/svetlana-saikova-520b6611b/',
      github: 'https://github.com/spacewalker02',
      behance: 'https://behance.net/svetlanasaykova',
      telegram: 'https://t.me/say_fit',
      resume: '/svetlana-saikova-resume.pdf',
    },
  } as const;