import styles from './CaseContext.module.scss';

export function CaseContext() {
  return (
    <>
      <section className={`${styles.section} ${styles.surface}`}>
        <div className={styles.inner}>
          <div className={styles.copy}>
            <h2>Where the design needed to land</h2>

            <p>
              The final design had to work for multiple credit
              unions, feel native to each brand, and be simple
              for members to understand.
            </p>

            <p>
              It needed to support real reward behaviors, work
              across web and mobile, and remain flexible enough
              to grow with new clients and reward types.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.inner}>
          <div className={styles.copy}>
            <h2>What I had to work with</h2>

            <p>
              I joined an existing product with its core
              functionality already in place. The system
              supported basic rewards and point tracking, but
              the experience was inconsistent across clients.
            </p>

            <p>
              It also lacked a clear, scalable structure for new
              reward types, tier logic, and brand customization.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}