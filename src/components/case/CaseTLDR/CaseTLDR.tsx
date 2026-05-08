import type { CaseTLDR as TLDRType } from '@/types/case';
import { Container } from '@/components/layout/Container/Container';
import styles from './CaseTLDR.module.scss';

interface CaseTLDRProps {
  tldr: TLDRType;
}

export function CaseTLDR({ tldr }: CaseTLDRProps) {
  return (
    <Container size="narrow">
      <div className={styles.tldr}>
        <Cell label="// problem" text={tldr.problem} />
        <Cell label="// solution" text={tldr.solution} />
        <Cell label="// impact" text={tldr.impact} highlight />
      </div>
    </Container>
  );
}

function Cell({
  label,
  text,
  highlight = false,
}: {
  label: string;
  text: string;
  highlight?: boolean;
}) {
  return (
    <div className={`${styles.cell} ${highlight ? styles.cellImpact : ''}`}>
      <h4>{label}</h4>
      <p>{text}</p>
    </div>
  );
}