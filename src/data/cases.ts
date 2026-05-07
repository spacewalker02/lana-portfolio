// All case studies. Adding a case = adding an object.

import type { Case } from '@/types/case';

export const cases: Case[] = [
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
  },
];