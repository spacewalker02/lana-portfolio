import { Container } from '@/components/layout/Container/Container';
import { MonoLabel } from '@/components/ui';
import { VisualStudies } from '@/components/home/VisualStudies/VisualStudies';
import styles from './VisualStudiesPage.module.scss';

export default function VisualStudiesPage() {
  return (
    <>
      <section className={styles.intro}>
        <Container size="narrow">
          <MonoLabel block>// visual studies</MonoLabel>
          <h1 className={styles.title}>Where I sharpen my visual craft</h1>
          <p className={styles.lead}>
            Each piece is a focused 1-2 hour exercise in typography, color, or
            interface detail. They&apos;re not full case studies - they&apos;re me
            staying close to the pixels.
          </p>
        </Container>
      </section>

      <VisualStudies variant="page" />
    </>
  );
}