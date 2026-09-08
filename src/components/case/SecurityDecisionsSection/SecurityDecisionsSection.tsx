import styles from './SecurityDecisionsSection.module.scss';

export function SecurityDecisionsSection() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <header className={styles.heading}>
          <h2>Design decisions</h2>

          <p>
            I treated the page as one connected policy rather
            than a collection of independent form fields.
          </p>
        </header>

        <div className={styles.layout}>
          <figure className={styles.figure}>
            <div className={styles.visual}>
              <img
                src="/cases/security-policy-builder/hero-page.png"
                alt="Complete Security Policy Builder page"
                loading="lazy"
              />
            </div>

            <figcaption>
              Complete authentication policy configuration
            </figcaption>
          </figure>

          <div className={styles.decisions}>
            <article className={styles.decision}>
              <h3>Written like a policy</h3>

              <p>
                Admins are not simply filling out a form.
                They’re defining a rule that members will
                experience.
              </p>

              <p>
                The page follows the order in which admins make
                decisions: verification trigger, code delivery,
                member scope, exceptions, and lockout behavior.
                Labels describe what admins are deciding rather
                than exposing internal system terminology.
              </p>
            </article>

            <article className={styles.decision}>
              <h3>Consequences stay visible</h3>

              <p>
                A master toggle controls the entire policy
                without deleting the configuration underneath.
                This allows admins to temporarily suspend a rule
                and restore it later.
              </p>

              <p>
                The persistent “Why this matters” sidebar
                explains how each setting affects members and
                remains visible while the admin edits the page.
              </p>
            </article>

            <article className={styles.decision}>
              <h3>Complexity appears only when needed</h3>

              <p>
                Frequent settings remain immediately available,
                while scope, exceptions, and lockout controls
                live in independent collapsible sections.
              </p>

              <p>
                Smaller credit unions can complete the policy
                without opening every section. Larger
                institutions can configure advanced rules
                without turning the default experience into a
                wall of controls.
              </p>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}