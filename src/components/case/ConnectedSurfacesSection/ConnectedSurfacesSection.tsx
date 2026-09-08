import styles from './ConnectedSurfacesSection.module.scss';

export function ConnectedSurfacesSection() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.copy}>
          <h2>Three connected surfaces</h2>

          <p>
            I kept the same tier logic and visual language
            across web, iOS, and Android while adapting the
            experience to how each surface is used.
          </p>

          <p>
            Desktop supports comparison between tiers, while
            mobile prioritizes the member’s current status and
            the next step. Members can move between platforms
            without having to relearn the system.
          </p>
        </div>

        <div className={styles.visualCard}>
          <div className={styles.visualHeader}>
            <h3>Web and mobile — different mental models</h3>

            <span aria-hidden="true">→</span>
          </div>

          <div className={styles.visual}>
            <img
              src="/cases/true-blue/web-vs-mobile.png"
              alt="Comparison of loyalty tier experiences on web and mobile"
              loading="lazy"
            />

            <div className={styles.annotation} aria-hidden="true">
              <span>
                Same logic.
                <br />
                Different behaviors
              </span>

              <svg viewBox="0 0 120 100">
                <path d="M105 10C80 7 59 16 46 33C34 49 29 67 19 83" />
                <path d="M19 83L21 68M19 83L34 78" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}