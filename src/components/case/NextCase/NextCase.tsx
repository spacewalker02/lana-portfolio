import { Link } from 'react-router-dom';
import type { Case } from '@/types/case';
import { Container } from '@/components/layout/Container/Container';
import styles from './NextCase.module.scss';

interface NextCaseProps {
  next: Case;
  index: number;
  total: number;
}

export function NextCase({ next, index, total }: NextCaseProps) {
  return (
    <Link to={`/case/${next.slug}`} className={styles.next}>
      <Container>
        <div className={styles.inner}>
          <div>
            <span className={styles.label}>
              // next case · {String(index).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </span>
            <h3 className={styles.title}>{next.title}</h3>
          </div>
          <span className={styles.arrow}>read case →</span>
        </div>
      </Container>
    </Link>
  );
}