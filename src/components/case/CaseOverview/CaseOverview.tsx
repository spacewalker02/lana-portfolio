import styles from './CaseOverview.module.scss';

export function CaseOverview() {
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
              Access Softek’s credit union clients needed a
              modern loyalty system to engage their members,
              but each had different brand identities, reward
              structures, and business rules.
            </p>

            <p>
              The existing solutions were fragmented, difficult
              to maintain, and not designed to scale across
              multiple tenants.
            </p>
          </article>

          <article className={styles.item}>
            <h3>The solution</h3>

            <p>
              I designed a configurable loyalty framework with
              clear information architecture, flexible reward
              programs, and consistent web and mobile
              experiences.
            </p>

            <p>
              The system adapts to each credit union’s brand
              while sharing the same underlying logic and
              components.
            </p>
          </article>

          <article className={styles.item}>
            <h3>The impact</h3>

            <ul>
              <li>Launched with 2 credit unions</li>
              <li>Live on web, iOS, and Android</li>
              <li>No architectural rework needed</li>
              <li>3+ months in production</li>
            </ul>
          </article>
        </div>

        <div className={styles.videoBlock}>
          <p className={styles.videoLabel}>
            Watch a short product walkthrough
          </p>

          <div className={styles.videoFrame}>
            <iframe
              src="https://www.loom.com/embed/93ca6bb03de44ac9981ae18c41ed2821"
              title="Multi-tenant loyalty system product walkthrough"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              loading="lazy"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </section>
  );
}