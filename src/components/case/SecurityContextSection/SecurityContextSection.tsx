import styles from './SecurityContextSection.module.scss';

export function SecurityContextSection() {
  return (
    <>
      <section className={styles.section}>
        <div className={styles.inner}>
          <div className={styles.copy}>
            <h2>The product</h2>

            <p>
              Access Softek builds white-label digital banking
              products for US credit unions. Each institution
              has an admin panel where its internal team
              configures the product for its members.
            </p>

            <p>
              The Security Policy Builder is where admins define
              authentication rules: when verification is
              required, who it applies to, how codes are
              delivered, and what happens after failed attempts.
            </p>
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.surface}`}>
        <div className={styles.inner}>
          <div className={styles.copy}>
            <h2>The problem</h2>

            <ul>
              <li>
                Every setting affects login for real members.
                Mistakes can create support tickets and block
                account access.
              </li>

              <li>
                Scope, delivery, exceptions, and lockout are
                separate concepts, but they all form one policy.
              </li>

              <li>
                Admins need to understand both what a setting
                does and who it applies to.
              </li>

              <li>
                A rule sometimes needs to be temporarily
                disabled without losing its configuration.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.inner}>
          <div className={styles.copy}>
            <h2>Design challenge</h2>

            <p>
              The challenge was to fit all of this on one page
              without turning it into a wall of controls.
            </p>

            <p>
              Frequent settings needed to be quick to reach,
              rare settings needed to stay out of the way, and
              high-risk actions needed enough context to prevent
              accidental changes.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}