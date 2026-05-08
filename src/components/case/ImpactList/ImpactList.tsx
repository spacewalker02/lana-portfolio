import type { CaseImpactRow } from '@/types/case';
import styles from './ImpactList.module.scss';

interface ImpactListProps {
  rows: CaseImpactRow[];
}

export function ImpactList({ rows }: ImpactListProps) {
  return (
    <div className={styles.list}>
      {rows.map((row, i) => (
        <div key={i} className={styles.row}>
          <div className={styles.metric}>{row.metric}</div>
          <div className={styles.text}>{row.text}</div>
        </div>
      ))}
    </div>
  );
}