import { Link } from 'react-router-dom';
import { Container } from '@/components/layout/Container/Container';
import { MonoLabel } from '@/components/ui';
import styles from './NotFound.module.scss';

export default function NotFound() {
  return (
    <section className={styles.section}>
      <Container>
        <MonoLabel block>// 404</MonoLabel>
            <h1 className={styles.title}>This page doesn&apos;t exist.</h1>
            <p className={styles.sub}>
                Maybe the URL is off, or the case isn&apos;t published yet.
            </p>
        <Link to="/" className={styles.link}>
          ← back to home
        </Link>
      </Container>
    </section>
  );
}