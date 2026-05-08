import type { Case } from '@/types/case';
import { Container } from '@/components/layout/Container/Container';
import styles from './CaseHero.module.scss';

interface CaseHeroProps {
  caseData: Case;
}

export function CaseHero({ caseData }: CaseHeroProps) {
  const { year, title, oneLineImpact, meta } = caseData;

  return (
    <section className={styles.hero}>
      <Container size="narrow">
        <div className={styles.meta}>
          <span>// {year}</span>
          <span>· {meta.company}</span>
          <span>· {meta.role}</span>
          <span>· {meta.duration}</span>
        </div>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.lead}>{oneLineImpact}</p>
      </Container>
    </section>
  );
}