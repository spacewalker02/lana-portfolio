export interface SkillItem {
    label: string;
    badge?: string;
  }
  
  export const designSkills: SkillItem[] = [
    { label: 'Product design end-to-end', badge: '3+ yrs' },
    { label: 'Multi-tenant design systems', badge: 'shipped' },
    { label: 'Design tokens & theming' },
    { label: 'Web + mobile (iOS, Android)' },
    { label: 'User flows & prototyping' },
    { label: 'Cross-functional collaboration' },
  ];
  
  export const engineeringSkills: SkillItem[] = [
    { label: 'React + TypeScript', badge: 'shipping' },
    { label: 'SCSS modules & CSS architecture' },
    { label: 'HTML / responsive layouts' },
    { label: 'Git, GitHub, Vercel deploys' },
    { label: 'Component-driven development' },
    { label: 'DevTools & implementation QA' },
  ];