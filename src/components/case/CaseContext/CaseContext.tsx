import styles from './CaseContext.module.scss';

export function CaseContext() {
  return (
    <>

      <section className={styles.section}>
        <div className={styles.inner}>
          <div className={styles.copy}>
            <h2>The starting point</h2>

            <p>
            Core rewards and point tracking were already in place, 
            but the experience had evolved differently across clients.
            </p>

            <p>
            Tier logic, reward types, and brand customization lacked a shared structure, 
            making the product inconsistent for members and harder for the team to maintain.
            </p>

            <p>
            The challenge was to create one framework flexible enough 
            for different credit unions while keeping the experience 
            clear across web and mobile.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}