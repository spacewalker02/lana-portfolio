import { ZHUIJU_VIDEO_EMBED_URL } from '../../../pages/ZhuijuCasePage/links';
import styles from './ZhuijuOverviewSection.module.scss';

export function ZhuijuOverviewSection() {
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
              Beginner Chinese apps teach through textbook dialogues. Graded
              readers feel like homework, and dramas with subtitles are far too
              hard at HSK 1.
            </p>

            <p>
              Learners lose motivation long before they can read anything they
              actually want to read.
            </p>
          </article>

          <article className={styles.item}>
            <h3>The solution</h3>

            <p>
              A reading app where every story is written like a Chinese drama
              and told in seasons.
            </p>

            <p>
              One season covers one full HSK level, so finishing it means
              meeting every word of that level in a story you wanted to
              finish.
            </p>
          </article>

          <article className={styles.item}>
            <h3>The impact</h3>

            <ul>
              <li>Working web prototype I use for my own study</li>
              <li>Season 1 covers all 300 HSK 1 words in 18 episodes</li>
              <li>6 stories, 5 review modes, an exam for every part</li>
              <li>First learner test turned into two new features</li>
            </ul>
          </article>
        </div>

        {ZHUIJU_VIDEO_EMBED_URL && (
          <div className={styles.videoBlock}>
            <p className={styles.videoLabel}>
              Watch a short product walkthrough
            </p>

            <div className={styles.videoFrame}>
              <iframe
                src={ZHUIJU_VIDEO_EMBED_URL}
                title="Zhuiju product walkthrough"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                loading="lazy"
                allowFullScreen
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
