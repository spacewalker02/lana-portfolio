import styles from './Footer.module.scss';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.identity}>
          <a className={styles.logo} href="#top">
            /lana.design
          </a>

          <span>
            © {new Date().getFullYear()} Svetlana Saikova
          </span>
        </div>

        <nav className={styles.navigation} aria-label="Footer navigation">
          <a href="mailto:svetlanasaykova@gmail.com">
            Email
          </a>

          <a
            href="/svetlana-saikova-resume.pdf"
            target="_blank"
            rel="noreferrer"
          >
            Résumé
          </a>

          <a href="#top">
            Back to top
            <span aria-hidden="true"> ↑</span>
          </a>
        </nav>
      </div>
    </footer>
  );
}