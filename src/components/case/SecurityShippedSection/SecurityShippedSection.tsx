import styles from './SecurityShippedSection.module.scss';

export function SecurityShippedSection() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.copy}>
          <h2>What shipped</h2>

          <p>
            The final experience brings the complete policy
            into one page: a master toggle followed by
            verification trigger, code expiration, and delivery
            settings.
          </p>

          <p>
            Scope, exceptions, and lockout controls collapse
            when they are not needed, while the explanatory
            sidebar remains visible throughout the editing
            process.
          </p>

          <p>
            The structure can also support new authentication
            rule types without requiring another page or a
            complete layout redesign.
          </p>
        </div>
      </div>
    </section>
  );
}