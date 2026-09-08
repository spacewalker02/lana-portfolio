import { CaseOverview } from '../../components/case/CaseOverview/CaseOverview';
import { ProductSection } from '../../components/case/ProductSection/ProductSection';
import { CaseContext } from '../../components/case/CaseContext/CaseContext';
import { LoyaltyFrameworkSection } from '../../components/case/LoyaltyFrameworkSection/LoyaltyFrameworkSection';
import { ConnectedSurfacesSection } from '../../components/case/ConnectedSurfacesSection/ConnectedSurfacesSection';
import { WhatChangedSection } from '../../components/case/WhatChangedSection/WhatChangedSection';
import { ReflectionSection } from '../../components/case/ReflectionSection/ReflectionSection';
import { NextCaseLink } from '../../components/case/NextCaseLink/NextCaseLink';
import styles from './LoyaltyCasePage.module.scss';

export function LoyaltyCasePage() {
  return (
    <article className={styles.page}>
      <section className={styles.hero} id="top">
        <div className={styles.inner}>
          <div className={styles.copy}>
            <div className={styles.meta}>
              <p>
                2025 · Access Softek
                <span>Product Designer · 5 months</span>
              </p>
            </div>

            <h1>Multi-tenant loyalty system</h1>

            <p className={styles.intro}>
              Designing a shared rewards system that adapts to
              each credit union’s brand, serves members across
              web and mobile, and enables sustainable growth.
            </p>

            <div className={styles.annotation} aria-hidden="true">
              <span>
                Same system.
                <br />
                Different brands
              </span>

              <svg viewBox="0 0 100 120">
                <path d="M84 5C90 38 84 70 65 91C52 105 36 112 17 115" />
                <path d="M17 115L21 100M17 115L32 111" />
              </svg>
            </div>
          </div>

          <div className={styles.visual}>
            <img
              src="/cases/true-blue/hero-desktop.png"
              alt="Multi-tenant loyalty system shown on desktop"
            />
          </div>
        </div>
      </section>

      <CaseOverview />
      <ProductSection />
      <CaseContext />
      <LoyaltyFrameworkSection />
      <ConnectedSurfacesSection />
      <WhatChangedSection />
      <ReflectionSection />

      <NextCaseLink
        title="Security Policy Builder"
        description="From logic to UI — making complex policy creation simple and approachable."
        href="/case/security-policy-builder"
      />
    </article>
  );
}