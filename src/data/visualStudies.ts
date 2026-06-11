// data/visualStudies.ts
// Ongoing UI studies. Push a new entry every cycle.
// First cycle publishes 2026-06-10.

import type { VisualStudy } from '@/types/visualStudy';

export const visualStudies: VisualStudy[] = [
  // The first entry will be Cycle 1 (Editorial type hierarchy) — published 2026-06-10.
  // Drop the published shot here as soon as it's live on Dribbble.
  //
  // Example shape for when you publish:
  //
  {
    id: 'cycle-2-focus-loop',
    title: 'Focus Loop - focus session app',
    year: 2026,
    category: 'mobile',
    tags: ['mobile', 'app design', 'productivity'],
    description:
      'A focus-session app concept - twelve screens across light and dark modes, built around the idea of a ritual for entering flow, not just a timer. UI in Russian.',
    image: {
      src: '/visual/focus-loop.png',
      alt: 'Focus Loop mobile app - twelve screens including welcome, today\'s tasks, active session timer in dark mode, session complete with streaks, monthly progress, settings, new task creation, and how-it-works intro. UI in Russian.',
      width: 1600,
      height: 1200,
    },
    status: 'published',
    externalLink: {
      url: 'https://dribbble.com/shots/27461641-Focus-Loop-Productivity-Deep-Work-Mobile-App',
      label: 'Dribbble',
    },
    featured: true,
    createdAt: '2026-06-10',
  },
  {
    id: 'cycle-1-editorial-type',
    title: 'Editorial · Fintech Blog',
    year: 2026,
    category: 'landing page',
    tags: ['landing page', 'editorial', 'fintech'],
    description:
      'A small study in building visual rhythm with type alone.',
    image: {
      src: '/visual/fintechbloglanding.png',
      alt: 'Top of a fintech blog article - eyebrow, headline, lede, byline, body, pull quote - all in one sans-serif at four type sizes.',
      width: 1600,
      height: 1200,
    },
    status: 'published',
    externalLink: { url: 'https://dribbble.com/shots/27461552-Fintech-Landing-Page', label: 'Dribbble' },
    featured: true,
    createdAt: '2026-06-10',
  },
];

/** Get only published studies, newest first. */
export function getPublishedStudies(): VisualStudy[] {
  return visualStudies
    .filter((s) => s.status === 'published')
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}