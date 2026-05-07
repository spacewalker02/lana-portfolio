import { profile } from '@/data/profile';
import { Container } from '@/components/layout/Container/Container';
import { MonoLabel, ButtonLink } from '@/components/ui';
import styles from './Contact.module.scss';

export function Contact() {
  return (
    <section className={styles.contact} id="contact">
      <Container>
        <MonoLabel block>// let&apos;s talk</MonoLabel>
        <a className={styles.email} href={`mailto:${profile.contact.email}`}>
          {profile.contact.email}
        </a>
        <p className={styles.sub}>
          Open to remote middle Product Designer roles. Best time to reach me:{' '}
          {profile.contact.bestTime}. {profile.contact.replyTime}
        </p>
        <div className={styles.links}>
          <ButtonLink href={profile.links.linkedin} variant="ghost" target="_blank" rel="noreferrer">
            LinkedIn ↗
          </ButtonLink>
          <ButtonLink href={profile.links.github} variant="ghost" target="_blank" rel="noreferrer">
            GitHub ↗
          </ButtonLink>
          <ButtonLink href={profile.links.behance} variant="ghost" target="_blank" rel="noreferrer">
            Behance ↗
          </ButtonLink>
          <ButtonLink href={profile.links.telegram} variant="ghost" target="_blank" rel="noreferrer">
            Telegram ↗
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}