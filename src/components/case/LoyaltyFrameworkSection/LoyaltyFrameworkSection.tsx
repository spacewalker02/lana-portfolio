import styles from './LoyaltyFrameworkSection.module.scss';

export function LoyaltyFrameworkSection() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.copy}>
          <h2>Designing a configurable loyalty framework</h2>

          <p>
            I designed a flexible system that supports different
            reward structures, tier identities, and brand
            expressions — all within the same core logic.
          </p>

          <p>
            The goal was to create a consistent experience for
            members while giving each credit union the freedom
            to make it their own.
          </p>
        </div>

        <div className={styles.visualCard}>
          <div className={styles.visualHeader}>
            <h3>Tier system and brand variations</h3>

            <span aria-hidden="true">→</span>
          </div>

          <div className={styles.visual}>
            <img
              src="/cases/true-blue/tier-system.png"
              alt="Two branded variations of the same loyalty tier system"
              loading="lazy"
            />

            <div className={styles.annotation} aria-hidden="true">
              <span>
                Same structure.
                <br />
                Unique brands
              </span>

              <svg viewBox="0 0 110 100">
                <path d="M94 7C95 38 81 61 54 73C38 80 28 86 21 94" />
                <path d="M21 94L25 80M21 94L36 91" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}