import { Container } from '@/components/layout/Container/Container';
import { CaseCard } from '@/components/home/CaseCard/CaseCard';
import { MonoLabel } from '@/components/ui';
import { cases } from '@/data/cases';
import styles from './SelectedWork.module.scss';

export function SelectedWork() {
  const [first, ...rest] = cases;
  const hasMultiple = cases.length > 1;

  return (
    <section className={styles.section} id="work">
      <Container>
        <div className={styles.head}>
          <div>
            <MonoLabel block>// selected work</MonoLabel>
            <h2 className={styles.title}>
              Designing fintech systems that ship & scale across products,
              brands, and platforms.
            </h2>
          </div>
          <span className={styles.count}>
            {String(cases.length).padStart(2, '0')} / 2024–2026
          </span>
        </div>

        <div className={`${styles.grid} ${hasMultiple ? styles.gridDouble : styles.gridSingle}`}>
          {first && <CaseCard caseData={first} variant="hero" />}
          {rest.map((c) => (
            <CaseCard key={c.slug} caseData={c} />
          ))}
        </div>
      </Container>
    </section>
  );
}