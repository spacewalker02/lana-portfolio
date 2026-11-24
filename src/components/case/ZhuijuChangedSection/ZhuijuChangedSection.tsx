import styles from './ZhuijuChangedSection.module.scss';

const changes = [
  {
    title: 'Progress path',
    description:
      'After the first test with a friend, I added a Path tab. It shows every story by parts, with chapters, grammar and exams in one timeline, plus a diary of study days.',
  },
  {
    title: 'Exams',
    description:
      'The same test showed that reading needed a finish line. Each part now ends with a 15-question exam in the HSK format, built only from chapters already read.',
  },
  {
    title: 'Grammar',
    description:
      'Grammar notes at the end of every chapter made chapters too long. They moved to a summary screen after each part; inside the text, grammar stays as a quiet underline.',
  },
  {
    title: 'Saved words',
    description:
      'One long list became hard to scroll after a few chapters. Words are now grouped by story and by HSK level, and any group can be reviewed on its own.',
  },
  {
    title: 'Text size',
    description:
      'Text size sat behind an unlabelled button, and the three sizes could only be found by trial. It became a sheet with labelled sizes and a reading theme.',
  },
  {
    title: 'Stable text',
    description:
      'Turning pinyin on made the text jump, so readers lost their line. The first fix worked in Chrome but not on my iPhone. Now hidden pinyin keeps its space, and nothing on the page moves.',
  },
];

export function ZhuijuChangedSection() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <header className={styles.heading}>
          <h2>What testing changed</h2>

          <p>
            I tested the prototype with a friend and used it on my own phone
            every day. Most changes came from moments
            where reading stopped.
          </p>
        </header>

        <dl className={styles.list}>
          {changes.map((change) => (
            <div className={styles.item} key={change.title}>
              <dt>{change.title}</dt>
              <dd>{change.description}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
