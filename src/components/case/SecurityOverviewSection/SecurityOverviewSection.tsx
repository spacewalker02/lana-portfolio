import styles from './SecurityOverviewSection.module.scss';

export function SecurityOverviewSection() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <header className={styles.heading}>
          <h2>Problem / Solution / Impact</h2>
        </header>

        <div className={styles.grid}>
          <article className={styles.item}>
            <h3>The problem</h3>

            <p>
              Every setting on this page affects login and
              account access for every member of a credit union.
            </p>

            <p>
              Admins need to understand what each control does,
              who it applies to, and how it interacts with the
              rest of the policy.
            </p>
          </article>

          <article className={styles.item}>
            <h3>The solution</h3>

            <p>
              I designed one page with a master toggle followed
              by the main verification settings.
            </p>

            <p>
              Scope, exceptions, and lockout settings live in
              collapsible sections, while a persistent sidebar
              explains how each change affects members.
            </p>
          </article>

          <article className={styles.item}>
            <h3>The impact</h3>

            <ul>
              <li>
                Shipped as the platform’s main authentication
                settings page
              </li>

              <li>
                New rule types can be added without rebuilding
                the layout
              </li>

              <li>
                Consequences remain visible while admins edit
                the policy
              </li>
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}