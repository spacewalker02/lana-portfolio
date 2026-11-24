import styles from './ZhuijuFeatureSection.module.scss';

type Feature = {
  title: string;
  paragraphs: string[];
};

type ZhuijuFeatureSectionProps = {
  title: string;
  intro: string;
  image: string;
  imageAlt: string;
  caption: string;
  features: Feature[];
  wide?: boolean;
};

export function ZhuijuFeatureSection({
  title,
  intro,
  image,
  imageAlt,
  caption,
  features,
  wide = false,
}: ZhuijuFeatureSectionProps) {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <header className={styles.heading}>
          <h2>{title}</h2>
          <p>{intro}</p>
        </header>

        <div className={wide ? styles.wideLayout : styles.layout}>
          <figure className={styles.figure}>
            <div className={styles.visual}>
              <img src={image} alt={imageAlt} loading="lazy" />
            </div>

            <figcaption>{caption}</figcaption>
          </figure>

          <div className={styles.decisions}>
            {features.map((feature) => (
              <article className={styles.decision} key={feature.title}>
                <h3>{feature.title}</h3>

                {feature.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
