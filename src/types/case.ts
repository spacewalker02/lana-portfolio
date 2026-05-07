// All shapes for case-related data.

export type CaseTag = string;

/** Three flavors of case-card cover. */
export type CaseCover =
  | { kind: 'nda'; metric: string; caption: string }
  | { kind: 'screenshot'; src: string; alt: string }
  | { kind: 'code' };

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
}