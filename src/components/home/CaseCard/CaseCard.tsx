import { Link } from 'react-router-dom';
import type { Case } from '@/types/case';
import { Tag } from '@/components/ui';
import styles from './CaseCard.module.scss';

interface CaseCardProps {
  caseData: Case;
  variant?: 'hero' | 'default';
}

export function CaseCard({ caseData, variant = 'default' }: CaseCardProps) {
  const { slug, title, oneLineImpact, meta, tags, cover, year } = caseData;

  return (
    <Link
      to={`/case/${slug}`}
      className={`${styles.card} ${variant === 'hero' ? styles.cardHero : ''}`}
    >
      <div className={styles.cover}>
        <div className={styles.visual}>
          <CoverRenderer cover={cover} />
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.meta}>
          {year} — {meta.company} · {meta.type} — {meta.role} · {meta.duration}
        </div>

        <h3 className={styles.title}>{title}</h3>
        <p className={styles.impact}>{oneLineImpact}</p>

        <div className={styles.bottom}>
          <div className={styles.tags}>
            {tags.map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </div>
          <span className={styles.arrow}>read case →</span>
        </div>
      </div>
    </Link>
  );
}

// CoverRenderer — picks the right cover by `cover.kind`

function CoverRenderer({ cover }: { cover: Case['cover'] }) {
  if (cover.kind === 'nda') {
    return (
      <div className={styles.coverNda}>
        <div className={styles.coverNdaInner}>
          <div className={styles.metric}>{cover.metric}</div>
          <div className={styles.caption}>{cover.caption}</div>
        </div>
      </div>
    );
  }

  if (cover.kind === 'screenshot') {
    return (
      <img
        className={styles.coverImage}
        src={cover.src}
        alt={cover.alt}
        loading="lazy"
      />
    );
  }

  // kind === 'code'
  return (
    <div className={styles.coverCode}>
      <div className={styles.codeWindow}>
        <div className={styles.codeBar}>
          <span /><span /><span />
        </div>
        <div className={styles.codeBody}>
          <div className={styles.codeHero} />
          <div className={styles.codeLine} />
          <div className={`${styles.codeLine} ${styles.short}`} />
          <div className={styles.codeBtn} />
        </div>
      </div>
    </div>
  );
}