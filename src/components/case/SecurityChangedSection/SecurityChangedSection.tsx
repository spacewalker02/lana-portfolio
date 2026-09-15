import styles from './SecurityChangedSection.module.scss';

const changes = [
  {
    title: 'Frame',
    description:
      'The page is framed as a policy the admin is defining, rather than a collection of unrelated system settings. A single master toggle controls the entire rule.',
  },
  {
    title: 'Context',
    description:
      'A persistent sidebar explains what the policy changes for members, so admins can see the consequences while they edit.',
  },
  {
    title: 'Structure',
    description:
      'Scope, exceptions, and lockout settings are grouped into sections that open independently. Admins can skip anything that does not apply.',
  },
  {
    title: 'Language',
    description:
      'Labels describe the decisions admins are making instead of exposing internal system fields and technical terminology.',
  },
  {
    title: 'Scalability',
    description:
      'The same structure works for smaller credit unions using only the essential settings and for larger institutions that need every section.',
  },
];

export function SecurityChangedSection() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <header className={styles.heading}>
          <h2>What changed</h2>

          <p>
            The redesign changed more than the visual layout. It gave the
            policy a clearer mental model and made complex configuration easier
            to understand.
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