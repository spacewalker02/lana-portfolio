import styles from './Skills.module.scss';

const designSkills = [
  'User Research',
  'Interaction Design',
  'UI Design',
  'Prototyping',
  'Design Systems',
  'Product Strategy',
];

const frontendSkills = [
  'HTML / CSS',
  'JavaScript',
  'TypeScript',
  'React',
  'SCSS',
  'Git',
];

export function Skills() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <header className={styles.heading}>
          <h2>Design & Frontend</h2>
        </header>

        <div className={styles.groups}>
          <article className={styles.group}>
            <div className={styles.groupHeader}>
              <div className={styles.icon} aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M5 5H10V10H5V5Z" />
                  <path d="M14 5H19V10H14V5Z" />
                  <path d="M5 14H10V19H5V14Z" />
                  <path d="M14 14H19V19H14V14Z" />
                  <path d="M10 7.5H14M7.5 10V14M16.5 10V14M10 16.5H14" />
                </svg>
              </div>

              <div>
                <h3>Design</h3>

                <p>
                  From research and product flows to polished
                  interfaces, I design products that are clear,
                  useful, and realistic to build.
                </p>
              </div>
            </div>

            <ul className={styles.tags} aria-label="Design skills">
              {designSkills.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          </article>

          <article className={styles.group}>
            <div className={styles.groupHeader}>
              <div
                className={`${styles.icon} ${styles.codeIcon}`}
                aria-hidden="true"
              >
                {'</>'}
              </div>

              <div>
                <h3>Frontend</h3>

                <p>
                  I use code to prototype ideas, understand
                  technical constraints, and stay close to
                  implementation.
                </p>
              </div>
            </div>

            <ul className={styles.tags} aria-label="Frontend skills">
              {frontendSkills.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}