import { Link } from 'react-router-dom';
import { Container } from '@/components/layout/Container/Container';
import { MonoLabel } from '@/components/ui';
import { getPublishedStudies } from '@/data/visualStudies';
import type { VisualStudy } from '@/types/visualStudy';
import styles from './VisualStudies.module.scss';

interface VisualStudiesProps {
  variant?: 'home' | 'page';
}

export function VisualStudies({ variant = 'home' }: VisualStudiesProps) {
  const studies = getPublishedStudies();

  // Hide section entirely on home when there are no studies yet.
  if (variant === 'home' && studies.length === 0) return null;

  const items = variant === 'home' ? studies.slice(0, 4) : studies;

  return (
    <section
      className={styles.section}
      id="visual"
      aria-labelledby="visual-studies-heading"
    >
      <Container>
        <header className={styles.head}>
          <div>
            <MonoLabel block>// visual studies</MonoLabel>
            <h2 id="visual-studies-heading" className={styles.title}>
              Ongoing UI explorations - small craft pieces between case studies.
            </h2>
          </div>
          {variant === 'home' && studies.length > 4 && (
            <Link to="/visual-studies" className={styles.viewAll}>
              View all {studies.length} studies →
            </Link>
          )}
        </header>

        {variant === 'page' && studies.length === 0 ? (
          <p className={styles.empty}>
            Nothing here yet. New studies posted weekly.
          </p>
        ) : (
          <ul className={styles.grid}>
            {items.map((s) => (
              <StudyCard key={s.id} study={s} />
            ))}
          </ul>
        )}

        {variant === 'page' && studies.length > 0 && (
          <p className={styles.note}>More studies on the way. I publish 2-3 per week.</p>
        )}
      </Container>
    </section>
  );
}

function StudyCard({ study }: { study: VisualStudy }) {
  const CardBody = (
    <figure className={styles.figure}>
      <div className={styles.cover}>
        <img
          src={study.image.src}
          alt={study.image.alt}
          width={study.image.width}
          height={study.image.height}
          loading="lazy"
          className={styles.coverImg}
        />
      </div>
      <figcaption className={styles.caption}>
        <h3 className={styles.cardTitle}>{study.title}</h3>
        <p className={styles.cardDesc}>{study.description}</p>
        <div className={styles.meta}>
          <span className={styles.tag}>{study.category}</span>
          <span className={styles.year}>{study.year}</span>
        </div>
      </figcaption>
    </figure>
  );

  return (
    <li className={styles.card}>
      {study.externalLink ? (
        <a
          href={study.externalLink.url}
          target="_blank"
          rel="noreferrer"
          className={styles.cardLink}
          aria-label={`${study.title} - view on ${study.externalLink.label}`}
        >
          {CardBody}
          <span className={styles.externalCue}>
            View on {study.externalLink.label} ↗
          </span>
        </a>
      ) : (
        CardBody
      )}
    </li>
  );
}