import styles from './SelectedWork.module.scss';

export function SelectedWork() {
  return (
    <section className={styles.section} id="work">
      <div className={styles.inner}>
        <header className={styles.heading}>
          <h2>Selected Work</h2>
        </header>

        <div className={styles.grid}>
          <a
            className={`${styles.card} ${styles.featured}`}
            href="/case/multi-tenant-rewards"
          >
            <div className={styles.cardHeader}>
              <h3>Multi-tenant loyalty system</h3>

              <span className={styles.arrow} aria-hidden="true">
                →
              </span>
            </div>

            <div className={styles.visual}>
              <img
                className={styles.image}
                src="/cases/true-blue/hero-desktop.png"
                alt="Multi-tenant loyalty system interface"
              />

              <div className={styles.note} aria-hidden="true">
                <span>
                  Same system.
                  <br />
                  Different brands
                </span>

                <svg viewBox="0 0 90 120">
                  <path d="M72 4C76 33 72 61 58 82C47 98 34 108 18 113" />
                  <path d="M18 113L20 99M18 113L32 109" />
                </svg>
              </div>
            </div>
          </a>

          <div className={styles.stack}>
            <a
              className={`${styles.card} ${styles.compact}`}
              href="/case/security-policy-builder"
            >
              <div className={styles.cardHeader}>
                <h3>Security Policy Builder</h3>

                <span className={styles.arrow} aria-hidden="true">
                  →
                </span>
              </div>

              <div className={styles.visual}>
                <img
                  className={styles.image}
                  src="/cases/security-policy-builder/cover.png"
                  alt="Security Policy Builder interface"
                  loading="lazy"
                />
              </div>
            </a>

            <div className={styles.comingSoon}>
              <span className={styles.plus} aria-hidden="true">
                +
              </span>

              <p>
                More projects
                <br />
                coming soon.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}