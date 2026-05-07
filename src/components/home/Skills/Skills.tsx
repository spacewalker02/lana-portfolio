import { Container } from '@/components/layout/Container/Container';
import { MonoLabel } from '@/components/ui';
import { designSkills, engineeringSkills, type SkillItem } from '@/data/skills';
import styles from './Skills.module.scss';

export function Skills() {
  return (
    <section className={styles.section}>
      <Container>
        <div className={styles.head}>
          <div>
            <MonoLabel block>// what i do</MonoLabel>
            <h2 className={styles.title}>Design and engineering, on the same desk.</h2>
          </div>
        </div>

        <div className={styles.grid}>
          <SkillsColumn title="Design" badge="core" items={designSkills} />
          <SkillsColumn title="Engineering" badge="differentiator" items={engineeringSkills} />
        </div>
      </Container>
    </section>
  );
}

function SkillsColumn({
  title,
  badge,
  items,
}: {
  title: string;
  badge: string;
  items: SkillItem[];
}) {
  return (
    <div className={styles.col}>
      <div className={styles.colHead}>
        <h3>{title}</h3>
        <MonoLabel>{badge}</MonoLabel>
      </div>
      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item.label}>
            {item.label}
            {item.badge && <small>{item.badge}</small>}
          </li>
        ))}
      </ul>
    </div>
  );
}