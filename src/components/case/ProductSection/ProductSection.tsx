import styles from './ProductSection.module.scss';

export function ProductSection() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.copy}>
          <h2>The product</h2>

          <p>
            Access Softek builds white-label digital banking
            products for credit unions. I worked on the loyalty
            system: one shared product that each credit union
            could adapt to its brand, reward structure, and
            members.
          </p>
        </div>

        <figure className={styles.figure}>
          <div className={styles.visual}>
            <img
              src="/cases/true-blue/hero-desktop.png"
              alt="Main loyalty system experience on desktop"
              loading="lazy"
            />

            <div className={styles.annotation} aria-hidden="true">
              <span>
                Clear and consistent
                <br />
                across web and mobile
              </span>

              <svg viewBox="0 0 110 90">
                <path d="M96 6C79 20 69 35 67 51C65 67 52 77 30 81" />
                <path d="M30 81L37 69M30 81L44 82" />
              </svg>
            </div>
          </div>

          <figcaption>
            Main loyalty experience across web and mobile
          </figcaption>
        </figure>
      </div>
    </section>
  );
}