import styles from './WhatChangedSection.module.scss';

export function WhatChangedSection() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.copy}>
          <h2>What changed</h2>

          <p>
            The loyalty system launched with two credit unions
            across web, iOS, and Android. The shared
            architecture supported both launches without
            requiring structural rework.
          </p>

          <p>
            Instead of rebuilding the experience for every new
            client, the team could adapt brand expression,
            rewards, and tier configurations while keeping the
            same core logic and components.
          </p>
        </div>
      </div>
    </section>
  );
}