import { SecurityOverviewSection } from '../../components/case/SecurityOverviewSection/SecurityOverviewSection';
import { SecurityContextSection } from '../../components/case/SecurityContextSection/SecurityContextSection';
import { SecurityDecisionsSection } from '../../components/case/SecurityDecisionsSection/SecurityDecisionsSection';
import { SecurityShippedSection } from '../../components/case/SecurityShippedSection/SecurityShippedSection';
import { SecurityChangedSection } from '../../components/case/SecurityChangedSection/SecurityChangedSection';
import { SecurityReflectionSection } from '../../components/case/SecurityReflectionSection/SecurityReflectionSection';
import styles from './SecurityPolicyCasePage.module.scss';

export function SecurityPolicyCasePage() {
  return (
    <article className={styles.page}>
      <section className={styles.hero} id="top">
        <div className={styles.inner}>
          <div className={styles.copy}>
            <div className={styles.meta}>
              <p>
                2026 · Access Softek
                <span>Product Designer · 6 weeks</span>
              </p>
            </div>

            <h1>Security Policy Builder</h1>

            <p className={styles.intro}>
              A page where credit union admins set authentication rules for
              their members — designed so that high-stakes changes are safer to
              make.
            </p>

            <div className={styles.annotation} aria-hidden="true">
              <span>
                From logic
                <br />
                to interface
              </span>

              <svg viewBox="0 0 110 100">
                <path d="M16 7C47 8 78 23 84 48C88 67 72 82 48 91" />
                <path d="M48 91L55 78M48 91L63 91" />
              </svg>
            </div>
          </div>

          <figure className={styles.figure}>
            <div className={styles.visual}>
              <img
                src="/cases/security-policy-builder/cover.png"
                alt="Security Policy Builder interface"
              />
            </div>

            <figcaption>
              Security Policy Builder · Authentication rule configuration
            </figcaption>
          </figure>
        </div>
      </section>

      <SecurityOverviewSection />
      <SecurityContextSection />
      <SecurityDecisionsSection />
      <SecurityShippedSection />
      <SecurityChangedSection />
      <SecurityReflectionSection />
    </article>
  );
}