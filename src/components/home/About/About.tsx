import styles from './About.module.scss';

export function About() {
  return (
    <section className={styles.section} id="about">
      <div className={styles.inner}>
        <header className={styles.heading}>
          <h2>About</h2>
        </header>

        <div className={styles.content}>
          <img
            className={styles.photo}
            src="/svetlana.png"
            alt="Svetlana, product designer"
            loading="lazy"
          />

          <div className={styles.information}>
            <h3>
              A designer who learned to code
              <br />
              so the work would actually ship.
            </h3>

            <p className={styles.description}>
              I’m a product designer with 3+ years in fintech. I
              design web and mobile products, work closely with
              developers, and learn frontend so I can understand
              what happens after Figma.
            </p>

            <div className={styles.meta}>
              <div className={styles.metaItem}>
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M20 10C20 15 12 21 12 21C12 21 4 15 4 10C4 5.6 7.6 2 12 2C16.4 2 20 5.6 20 10Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>

                <span>UAE · UTC+2</span>
              </div>

              <div className={styles.metaItem}>
                <span
                  className={styles.statusDot}
                  aria-hidden="true"
                />

                <span>Open to remote opportunities</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}