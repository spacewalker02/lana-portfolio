import { Container } from '@/components/layout/Container/Container';
import styles from './Footer.module.scss';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <Container>
        <div className={styles.inner}>
          <div>© {year} Svetlana Saikova · Built with React + TypeScript</div>
          <div className={styles.right}>
            <span>v1.0.0</span>
            <a
              href="https://github.com/spacewalker02/lana-portfolio"
              target="_blank"
              rel="noreferrer"
            >
              source ↗
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}