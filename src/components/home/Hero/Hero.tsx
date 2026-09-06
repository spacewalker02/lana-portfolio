import styles from './Hero.module.scss';

export function Hero() {
  return (
    <section className={styles.hero} id="top">
      <div className={styles.inner}>
        <div className={styles.content}>
          <p className={styles.role}>
            Product Designer
            <span>Remote · Worldwide</span>
          </p>

          <h1 className={styles.title}>
            <span>Designing fintech interfaces &</span>

            <span className={styles.accent}>
              shipping them in code.
              <span className={styles.cursor} aria-hidden="true" />
            </span>
          </h1>

          <div className={styles.annotation} aria-hidden="true">
            <span>
              Ideas
              <br />
              to products
              <br />
              {'</>'}
            </span>

            <svg viewBox="0 0 90 60">
              <path d="M80 6C51 8 27 20 14 47" />
              <path d="M14 47L15 35M14 47L25 42" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}