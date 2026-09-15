import styles from './ShortStudies.module.scss';

const studies = [
  {
    title: 'Focus Loop · focus session app',
    image: '/visual/focus-loop.png',
    alt: 'Focus Loop focus session application',
    href: 'https://dribbble.com/shots/27461641-Focus-Loop-Productivity-Deep-Work-Mobile-App',
  },
  {
    title: 'Editorial · Fintech Blog',
    image: '/visual/fintechbloglanding.png',
    alt: 'Editorial fintech blog landing page',
    href: 'https://dribbble.com/shots/27461552-Fintech-Landing-Page',
  },
];

export function ShortStudies() {
  return (
    <section className={styles.section} id="visual">
      <div className={styles.inner}>
        <header className={styles.heading}>
          <h2>Short Studies</h2>

          <div className={styles.sectionNote} aria-hidden="true">
            <span>
              Small projects.
              <br />
              Real practice
            </span>

            <svg viewBox="0 0 90 100">
              <path d="M12 6C48 9 78 28 72 56C68 74 49 87 24 94" />
              <path d="M24 94L29 80M24 94L39 91" />
            </svg>
          </div>
        </header>

        <div className={styles.grid}>
          {studies.map((study) => (
            <a
              className={styles.card}
              href={study.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View ${study.title} on Dribbble`}
              key={study.title}
            >
              <div className={styles.cardHeader}>
                <h3>{study.title}</h3>

                <span className={styles.arrow} aria-hidden="true">
                  →
                </span>
              </div>

              <div className={styles.visual}>
                <img
                  className={styles.image}
                  src={study.image}
                  alt={study.alt}
                  loading="lazy"
                />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}