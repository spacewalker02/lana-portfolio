// types/case.ts
// All shapes for case-related data.

export type CaseTag = string;

/** Three flavors of case-card cover. */
export type CaseCover =
  | { kind: 'nda'; metric: string; caption: string }
  | { kind: 'screenshot'; src: string; alt: string }
  | { kind: 'code' };

export interface CaseTLDR {
  problem: string;
  solution: string;
  impact: string;
}

export interface CaseImpactRow {
  metric: string;
  text: string;
}

export interface MatrixRow {
  option: string;
  effort: string;
  impact: string;
  risk: string;
  picked?: boolean;
}

export type CaseBlock =
  | { type: 'h2'; mono: string; text: string }
  | { type: 'h3'; text: string }
  | { type: 'p'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'quote'; text: string; cite?: string }
  | { type: 'matrix'; rows: MatrixRow[] }
  | { type: 'flow'; steps: string[]; highlightIndex?: number; caption?: string }
  | {
      type: 'codeNote';
      title: string;
      body: string;
      links?: { label: string; url: string }[];
    };

export interface CaseMeta {
  company: string;
  industry: string;
  type: string;
  role: string;
  duration: string;
  isNDA: boolean;
}

export interface Case {
  slug: string;
  year: number;
  title: string;
  oneLineImpact: string;
  meta: CaseMeta;
  tags: CaseTag[];
  cover: CaseCover;
  tldr: CaseTLDR;
  loomUrl?: string;
  body: CaseBlock[];
  impact: CaseImpactRow[];
  reflection: string[];
  links?: {
    live?: string;
    repo?: string;
    figma?: string;
  };
}