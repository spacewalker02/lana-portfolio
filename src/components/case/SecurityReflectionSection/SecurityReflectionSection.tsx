import styles from './SecurityReflectionSection.module.scss';

export function SecurityReflectionSection() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <h2>What I’d do differently</h2>

        <div className={styles.copy}>
          <p>
            With more time, I’d run five short usability sessions with credit
            union admins earlier in the process. That would help uncover unclear
            labels before the structure and copy were finalized.
          </p>

          <p>
            I’d also add a temporary “recently changed” state before saving.
            When several settings are edited at once, it should be easy to see
            exactly what has changed and review it before the policy goes live.
          </p>

          <p>
            Finally, I’d explore a member-facing preview that shows what the
            next login would look like with the current policy. This would make
            the relationship between an admin decision and the member
            experience even more concrete.
          </p>
        </div>
      </div>
    </section>
  );
}