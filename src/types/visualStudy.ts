export type VisualStudyCategory =
  | 'mobile'
  | 'dashboard'
  | 'typography'
  | 'landing page'
  | 'color'
  | 'landing'
  | 'component';

export type VisualStudyStatus = 'published' | 'draft' | 'archived';

export interface VisualStudy {
  id: string;
  title: string;
  year: number;
  category: VisualStudyCategory;
  tags: string[];
  description: string;
  image: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  status: VisualStudyStatus;
  externalLink?: {
    url: string;
    label: 'Dribbble' | 'Behance';
  };
  featured?: boolean;
  createdAt: string;
}