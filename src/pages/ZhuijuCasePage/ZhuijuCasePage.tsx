import { ZhuijuOverviewSection } from '../../components/case/ZhuijuOverviewSection/ZhuijuOverviewSection';
import { ZhuijuContextSection } from '../../components/case/ZhuijuContextSection/ZhuijuContextSection';
import { ZhuijuFeatureSection } from '../../components/case/ZhuijuFeatureSection/ZhuijuFeatureSection';
import { ZhuijuChangedSection } from '../../components/case/ZhuijuChangedSection/ZhuijuChangedSection';
import { ZhuijuReflectionSection } from '../../components/case/ZhuijuReflectionSection/ZhuijuReflectionSection';
import { NextCaseLink } from '../../components/case/NextCaseLink/NextCaseLink';
import { ZHUIJU_LIVE_URL, ZHUIJU_REPO_URL } from './links';
import styles from './ZhuijuCasePage.module.scss';

const readingFeatures = [
  {
    title: 'A season is a whole HSK level',
    paragraphs: [
      'The first plan was one story rewritten for every HSK level. That would triple the writing and spoil the plot on every reread.',
      'Instead, each story runs in seasons, and one season closes one level. Season 1 has 18 episodes in 6 parts, and every one of the 300 HSK 1 words has a planned episode. A post-credits scene at the end of each episode brings rare words back once more.',
    ],
  },
  {
    title: 'Reading comes first',
    paragraphs: [
      'My first visual direction styled chapters like a screenplay. It looked atmospheric and was hard to read.',
      'The reader now uses one book typeface, pinyin above every word and a translation one tap away. It is a light page inside a dark library, with three text sizes and a dark theme for evening reading.',
    ],
  },
  {
    title: 'Grammar without leaving the scene',
    paragraphs: [
      'Research on reading shows that highlighting grammar in a text helps a little, and a short explicit rule helps much more. So grammar works in two layers.',
      'In the text, each new pattern gets a quiet dotted underline; tapping it shows the rule with an example from the same scene. After every part, a summary screen collects that part’s grammar in one place.',
    ],
  },
  {
    title: 'Role reading',
    paragraphs: [
      'Learners pick a character, the app voices everyone else, and they read their own lines out loud. Each line also has its own audio button, so a sentence can be replayed without restarting the chapter.',
    ],
  },
];

const loopFeatures = [
  {
    title: 'Read, review, prove it',
    paragraphs: [
      'Every part ends the same way: a grammar summary, then a 15-question exam in the HSK format — listening, reading, vocabulary and word order — built only from chapters already read.',
    ],
  },
  {
    title: 'Words come back on a schedule',
    paragraphs: [
      'Saved words return after one, three, seven and fourteen days. A word leaves the hard list only after two correct answers in a row.',
      'Five review modes train different skills: flashcards, a gap in a sentence from a chapter you’ve read, tones, listening, and recall from the translation.',
    ],
  },
  {
    title: 'Simple on purpose',
    paragraphs: [
      'The prototype is a single-page app in plain JavaScript, so it opens fast on a phone. Stories are stored as data — every line knows its words, pinyin and translation — and the screens are generated from that data, so one design works for every story.',
      'Tones follow real speech: 一 (yī) and 不 (bù) change with the next syllable, and the app shows the tone you actually hear.',
    ],
  },
];

export function ZhuijuCasePage() {
  return (
    <article className={styles.page}>
      <section className={styles.hero} id="top">
        <div className={styles.inner}>
          <div className={styles.copy}>
            <div className={styles.meta}>
              <p>
                2026 · Personal product
                <span>Product Designer</span>
              </p>
            </div>

            <h1>Zhuiju</h1>

            <p className={styles.intro}>
              A mobile web app that teaches Chinese through original stories
              written like Chinese dramas. One season for every HSK
              level.
            </p>

            {(ZHUIJU_LIVE_URL || ZHUIJU_REPO_URL) && (
              <div className={styles.links}>
                {ZHUIJU_LIVE_URL && (
                  <a
                    className={styles.primaryLink}
                    href={ZHUIJU_LIVE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open the app
                  </a>
                )}

                {ZHUIJU_REPO_URL && (
                  <a
                    className={styles.secondaryLink}
                    href={ZHUIJU_REPO_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View the code
                  </a>
                )}
              </div>
            )}

            <div className={styles.annotation} aria-hidden="true">
              <span>
                Designed it.
                <br />
                Shipped it.
              </span>

              <svg viewBox="0 0 110 100">
                <path d="M16 7C47 8 78 23 84 48C88 67 72 82 48 91" />
                <path d="M48 91L55 78M48 91L63 91" />
              </svg>
            </div>
          </div>

          <figure className={styles.figure}>
            <div className={styles.visual}>
              <img
                src="/cases/zhuiju/hero.jpg"
                alt="Zhuiju library, chapter reader and a review exercise on phone screens"
              />
            </div>

            <figcaption>
              Library · Chapter with pinyin · Review with a sentence from the
              story. Interface in Russian, for Russian-speaking learners.
            </figcaption>
          </figure>
        </div>
      </section>

      <ZhuijuOverviewSection />
      <ZhuijuContextSection />

      <ZhuijuFeatureSection
        title="Design decisions"
        intro="I designed Zhuiju around the moment of reading: everything a beginner needs is one tap away, and nothing else competes with the story."
        image="/cases/zhuiju/reading.jpg"
        imageAlt="Story page with seasons and a word card with a grammar rule"
        caption="Story page · Word card with a grammar rule from the scene"
        features={readingFeatures}
      />

      <section className={styles.coversSection}>
        <div className={styles.inner}>
          <header className={styles.coversHeading}>
            <h2>Covers sell the story</h2>

            <p>
              Learners choose a story the way they choose a drama: by the
              poster. Each cover has a vertical Chinese title in a typeface
              chosen for its genre, and the library is grouped into genre
              shelves the way streaming services do it.
            </p>
          </header>

          <figure className={styles.coversFigure}>
            <img
              src="/cases/zhuiju/covers.jpg"
              alt="Six drama-style story covers"
              loading="lazy"
            />
          </figure>
        </div>
      </section>

      <ZhuijuFeatureSection
        title="The learning loop"
        intro="Reading is the core, and everything else exists to make the words from the story stay."
        image="/cases/zhuiju/learning-loop.jpg"
        imageAlt="Grammar summary, word order exam question and review mode picker"
        caption="Grammar summary · Exam: word order · Choosing a review mode"
        features={loopFeatures}
        wide
      />

      <ZhuijuChangedSection />
      <ZhuijuReflectionSection />

      <NextCaseLink
        href="/case/multi-tenant-rewards"
        title="Multi-tenant loyalty system"
        description="Designing a shared rewards system that adapts to different brands across web and mobile."
      />
    </article>
  );
}
