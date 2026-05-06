import { useEffect, useState } from 'react';
import styles from './Header.module.scss';

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.inner}>
        <a href="/" className={styles.logo}>
          lana.design
        </a>

        <nav className={styles.nav}>
          <a href="#work">Work</a>
          <a href="#about">About</a>
          <a
            href="mailto:svetlanasaykova@gmail.com"
            className={styles.cta}
>
            Hire me →
          </a>
        </nav>
      </div>
    </header>
  );
}