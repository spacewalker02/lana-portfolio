import type { MatrixRow } from '@/types/case';
import styles from './DecisionMatrix.module.scss';

interface DecisionMatrixProps {
  rows: MatrixRow[];
}

export function DecisionMatrix({ rows }: DecisionMatrixProps) {
  return (
    <div className={styles.matrix}>
      <table>
        <thead>
          <tr>
            <th>Option</th>
            <th>Effort</th>
            <th>Predicted impact</th>
            <th>Risk</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.option} className={row.picked ? styles.picked : ''}>
              <td>{row.option}</td>
              <td>{row.effort}</td>
              <td>{row.impact}</td>
              <td>{row.risk}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}