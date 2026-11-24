import styles from './ZhuijuReflectionSection.module.scss';

export function ZhuijuReflectionSection() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <h2>What I’d do differently</h2>

        <div className={styles.copy}>
          <p>
            I’d test with five learners before writing a full season. One
            tester gave me two strong features, but a small group would show
            which parts of the reader people actually use.
          </p>

          <p>
            I’d bring in a native speaker earlier. The texts follow the HSK
            word lists, yet natural phrasing needs a person who speaks the
            language every day.
          </p>

          <p>
            Next steps: recorded voices instead of browser speech, a second
            season for HSK 2, and simple analytics to see where readers stop.
          </p>
        </div>
      </div>
    </section>
  );
}
