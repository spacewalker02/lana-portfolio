import styles from './FlowDiagram.module.scss';

interface FlowDiagramProps {
  steps: string[];
  highlightIndex?: number;
  caption?: string;
}

export function FlowDiagram({ steps, highlightIndex, caption }: FlowDiagramProps) {
  return (
    <div className={styles.illu}>
      <div className={styles.flow}>
        {steps.map((step, i) => (
          <Step
            key={step}
            label={step}
            highlight={i === highlightIndex}
            isLast={i === steps.length - 1}
          />
        ))}
      </div>
      {caption && <div className={styles.caption}>// {caption}</div>}
    </div>
  );
}

function Step({
  label,
  highlight,
  isLast,
}: {
  label: string;
  highlight: boolean;
  isLast: boolean;
}) {
  return (
    <>
      <div className={`${styles.step} ${highlight ? styles.highlight : ''}`}>{label}</div>
      {!isLast && <span className={styles.arrow}>→</span>}
    </>
  );
}