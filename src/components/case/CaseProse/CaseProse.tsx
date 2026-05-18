import type { CaseBlock } from '@/types/case';
import { Container } from '@/components/layout/Container/Container';
import { CodeNote } from '@/components/case/CodeNote/CodeNote';
import { DecisionMatrix } from '@/components/case/DecisionMatrix/DecisionMatrix';
import { FlowDiagram } from '@/components/case/FlowDiagram/FlowDiagram';
import styles from './CaseProse.module.scss';

interface CaseProseProps {
  blocks: CaseBlock[];
  onImageClick: (image: { src: string; alt: string }) => void;
}

export function CaseProse({ blocks, onImageClick }: CaseProseProps) {
  return (
    <Container size="narrow">
      <div className={styles.prose}>
        {blocks.map((block, i) => (
          <BlockRenderer key={i} block={block} onImageClick={onImageClick} />
        ))}
      </div>
    </Container>
  );
}

function BlockRenderer({ 
  block,
  onImageClick,
 }: { 
  block: CaseBlock;
  onImageClick: (image: { src: string; alt: string }) => void;
 }) {
  switch (block.type) {
    case 'h2':
      return (
        <h2 className={styles.h2}>
          <span className={styles.h2Mono}>{block.mono}</span>
          {block.text}
        </h2>
      );

    case 'h3':
      return <h3 className={styles.h3}>{block.text}</h3>;

    case 'p':
      return <p className={styles.p}>{block.text}</p>;

    case 'ul':
      return (
        <ul className={styles.ul}>
          {block.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      );

    case 'quote':
      return (
        <blockquote className={styles.quote}>
          {block.text}
          {block.cite && <cite>— {block.cite}</cite>}
        </blockquote>
      );

    case 'matrix':
      return <DecisionMatrix rows={block.rows} />;

    case 'flow':
      return (
        <FlowDiagram
          steps={block.steps}
          highlightIndex={block.highlightIndex}
          caption={block.caption}
        />
      );

    case 'codeNote':
      return <CodeNote title={block.title} body={block.body} links={block.links} />;

      case 'image':
        return (
          <figure className={styles.figure}>
            <button
              type='button'
              className={styles.imageButton}
              onClick={() => onImageClick({ src: block.src, alt: block.alt })}
              aria-label={`Open image: ${block.alt}`}
            >
              <img src={block.src} alt={block.alt} loading="lazy" />
            </button>
            {block.caption && <figcaption>{block.caption}</figcaption>}
          </figure>
        );
  }
}