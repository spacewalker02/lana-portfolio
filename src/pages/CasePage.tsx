import { useParams } from 'react-router-dom';
import { cases, getCaseBySlug, getNextCase } from '@/data/cases';
import { CaseHero } from '@/components/case/CaseHero/CaseHero';
import { CaseTLDR } from '@/components/case/CaseTLDR/CaseTLDR';
import { VideoEmbed } from '@/components/case/VideoEmbed/VideoEmbed';
import { CaseProse } from '@/components/case/CaseProse/CaseProse';
import { Container } from '@/components/layout/Container/Container';
import { ImpactList } from '@/components/case/ImpactList/ImpactList';
import { NextCase } from '@/components/case/NextCase/NextCase';
import NotFound from '@/pages/NotFound';
import styles from './CasePage.module.scss';

export default function CasePage() {
  const { slug } = useParams<{ slug: string }>();
  const caseData = slug ? getCaseBySlug(slug) : undefined;
  const next = slug ? getNextCase(slug) : undefined;

  if (!caseData) return <NotFound />;

  const nextIndex = next ? cases.findIndex((c) => c.slug === next.slug) + 1 : 0;

  return (
    <article>
      <CaseHero caseData={caseData} />
      {caseData.heroImage && (
      <Container size='narrow'>
        <figure className={styles.heroFigure}>
          <img
            src={caseData.heroImage.src}
            alt={caseData.heroImage.alt}
          />
        </figure>
      </Container>
    )}
      <CaseTLDR tldr={caseData.tldr} />
      <VideoEmbed url={caseData.loomUrl} />
      <CaseProse blocks={caseData.body} />

      <Container size="narrow">
        <h2 className={styles.h2}>
          <span className={styles.h2Mono}>// 06 — impact</span>
          What changed
        </h2>
        <ImpactList rows={caseData.impact} />
      </Container>

      <Container size="narrow">
        <h2 className={styles.h2}>
          <span className={styles.h2Mono}>// 07 — reflection</span>
          What I&apos;d do differently
        </h2>
        <div className={styles.reflection}>
          {caseData.reflection.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </Container>

      {next && <NextCase next={next} index={nextIndex} total={cases.length} />}
    </article>
  );
}