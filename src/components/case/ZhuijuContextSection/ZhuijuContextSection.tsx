import styles from './ZhuijuContextSection.module.scss';

export function ZhuijuContextSection() {
  return (
    <>
      <section className={styles.section}>
        <div className={styles.inner}>
          <div className={styles.copy}>
            <h2>The idea</h2>

            <p>
              I started learning Chinese in 2026 and didn’t want to study
              through textbook dialogues, so I built myself a small reader for
              stories I actually wanted to read. Then I asked a product
              question: could this work for other learners too?
            </p>

            <p>
              Zhuiju (追剧, zhuījù) means binge-watching a TV series. The app
              is built around that feeling: one more episode, then the next.
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
                Course apps teach through short textbook dialogues with no
                story to follow.
              </li>

              <li>
                Graded readers are rarely stories anyone wants to finish.
              </li>

              <li>
                In my own study I remembered characters but kept forgetting
                how they sound, so pinyin and audio had to stay close.
              </li>

              <li>
                Most learners jump between levels and never close one fully.
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
              Make a beginner text feel like a drama worth binge-reading,
              while keeping every screen calm enough to study on a phone.
            </p>

            <p>
              The hard constraint: a full HSK 1 season can only use about 300
              words, and each of them has to appear often enough to stick.
            </p>
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.surface}`}>
        <div className={styles.inner}>
          <div className={styles.copy}>
            <h2>My role</h2>

            <p>
              I owned the product and the design end to end: research,
              concept, UX and UI, testing and iteration.
            </p>

            <p>
              The code and the story texts were produced with Claude, an AI
              coding partner, under my direction. I set the requirements,
              checked every build on my phone and sent work back with notes
              until it behaved the way I designed it.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
