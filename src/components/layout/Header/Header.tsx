import styles from './Header.module.scss';

const navigation = [
  { label: 'Work', href: '#work' },
  { label: 'Visual', href: '#visual' },
  { label: 'About', href: '#about' },
];

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <a className={styles.logo} href="#top">
          /lana.design
        </a>

        <nav className={styles.navigation} aria-label="Main navigation">
          {navigation.map((item) => (
            <a
              className={styles.link}
              href={item.href}
              key={item.label}
            >
              {item.label}
            </a>
          ))}

          <a
            className={styles.link}
            href="mailto:svetlanasaykova@gmail.com"
          >
            Hire me
          </a>
        </nav>
      </div>
    </header>
  );
}