import styles from './CodeNote.module.scss';

interface CodeNoteProps {
  title: string;
  body: string;
  links?: { label: string; url: string }[];
}

export function CodeNote({ title, body, links }: CodeNoteProps) {
  return (
    <aside className={styles.note}>
      <div className={styles.label}>// designer who codes</div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.body}>{body}</p>
      {links && links.length > 0 && (
        <div className={styles.links}>
          {links.map((l) => (
            <a key={l.url} href={l.url} target="_blank" rel="noreferrer">
              {l.label}
            </a>
          ))}
        </div>
      )}
    </aside>
  );
}