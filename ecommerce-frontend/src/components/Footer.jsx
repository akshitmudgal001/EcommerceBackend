import styles from "../styles/footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.left}>
          <span className={styles.logo}>ShopApp</span>
          <span className={styles.copy}>© 2024 All rights reserved</span>
        </div>
        <div className={styles.links}>
          <span>Full Stack POC — Spring Boot + React + MySQL</span>
        </div>
      </div>
    </footer>
  );
}