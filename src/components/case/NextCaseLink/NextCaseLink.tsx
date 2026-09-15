import styles from './NextCaseLink.module.scss';

type NextCaseLinkProps = {
  title: string;
  description: string;
  href: string;
};

export function NextCaseLink({
  title,
  description,
  href,
}: NextCaseLinkProps) {
  return (
    <section
      className={styles.section}
      aria-label="Next case study"
    >
      <div className={styles.inner}>
        <a className={styles.link} href={href}>
          <div className={styles.copy}>
            <span className={styles.label}>Next case</span>

            <h2>{title}</h2>

            <p>{description}</p>
          </div>

          <span className={styles.arrow} aria-hidden="true">
            →
          </span>
        </a>
      </div>
    </section>
  );
}