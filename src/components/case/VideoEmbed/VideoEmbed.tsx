import { Container } from '@/components/layout/Container/Container';
import styles from './VideoEmbed.module.scss';

interface VideoEmbedProps {
  url?: string;
  caption?: string;
}

/**
 * Loom-friendly video embed.
 * If `url` is a Loom share link, shows the iframe embed.
 * Otherwise shows a clickable placeholder.
 */
export function VideoEmbed({ url, caption = '2 min walkthrough · loom' }: VideoEmbedProps) {
  const embedUrl = url ? toLoomEmbed(url) : null;

  return (
    <Container size="narrow">
      <div className={styles.block}>
        {embedUrl ? (
          <iframe
            className={styles.iframe}
            src={embedUrl}
            allowFullScreen
            title="Case walkthrough"
          />
        ) : (
          <div className={styles.placeholder} role="img" aria-label="Loom video placeholder">
            <div className={styles.play} />
            <div className={styles.caption}>// {caption}</div>
          </div>
        )}
      </div>
    </Container>
  );
}

function toLoomEmbed(url: string): string {
  const m = url.match(/loom\.com\/share\/([a-z0-9-]+)/i);
  return m ? `https://www.loom.com/embed/${m[1]}` : url;
}