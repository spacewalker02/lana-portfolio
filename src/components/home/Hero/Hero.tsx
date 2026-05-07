import { profile } from '@/data/profile';
import { Container } from '@/components/layout/Container/Container';
import { MonoLabel, StatusPill, ButtonLink, ArrowRight, ArrowDown } from '@/components/ui';
import styles from './Hero.module.scss';

export function Hero() {
  return (
    <section className={styles.hero}>
      <Container>
        <div className={styles.top}>
          <MonoLabel>// product designer · fintech & saas</MonoLabel>
          <StatusPill label={profile.status.label} available={profile.status.available} />
        </div>

        <h1 className={styles.title}>
          Designing fintech interfaces  &{' '}
          <em>shipping them in code</em>.
        </h1>

        <div className={styles.sub}>
            {profile.heroSub.map((line, i) => (
                <p key={i}>{line}</p>
            ))}
        </div>

        <div className={styles.actions}>
          <ButtonLink href="#work">
            See selected work <ArrowRight />
          </ButtonLink>
          <ButtonLink href={profile.links.resume} variant="ghost" target="_blank" rel="noreferrer">
            View resume <ArrowDown />
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}