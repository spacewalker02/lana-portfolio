import styles from './Contact.module.scss';

export function Contact() {
  return (
    <section className={styles.section} id="contact">
      <div className={styles.inner}>
        <header className={styles.heading}>
          <h2>Get in touch</h2>
          <p>Let’s build something together.</p>
        </header>

        <div className={styles.content}>
          <div>
            <h3>
              Design and frontend,
              <br />
              on the same desk.
            </h3>

            <p className={styles.description}>
              I’m open to remote product design opportunities
              and interesting projects.
            </p>
          </div>

          <a
            className={styles.button}
            href="mailto:svetlanasaykova@gmail.com"
          >
            Email me

            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}