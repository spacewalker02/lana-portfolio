import styles from './ReflectionSection.module.scss';

export function ReflectionSection() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.copy}>
          <h2>What I’d do differently</h2>

          <p>
            With more time, I would test the system with a wider
            range of members earlier — especially people who
            rarely use reward programs.
          </p>

          <p>
            This would help validate whether the tier logic,
            progress states, and messaging were as clear in
            practice as they appeared in prototypes.
          </p>

          <p>
            I would also explore more personalized reward
            recommendations and dynamic messaging, but only
            after validating the core experience. The priority
            would be making the system easier to understand, not
            simply adding more configuration.
          </p>
        </div>
      </div>
    </section>
  );
}