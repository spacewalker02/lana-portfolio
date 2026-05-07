import { profile } from '@/data/profile';
import { Container } from '@/components/layout/Container/Container';
import { MonoLabel } from '@/components/ui';
import styles from './About.module.scss';

export function About() {
  return (
    <section className={styles.about} id="about">
      <Container>
        <div className={styles.head}>
          <div>
            <MonoLabel block>// about</MonoLabel>
            <h2 className={styles.title}>
              A designer who learned to code so the work would actually ship.
            </h2>
          </div>
        </div>

        <div className={styles.grid}>
          <div className={styles.photo} aria-label={`Portrait of ${profile.name}`} />
          <div className={styles.bio}>
            {profile.bio.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}