import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import styles from "../styles/dashboard.module.css";

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <p className={styles.greeting}>Good day, {user?.name}</p>
        <h1 className={styles.heading}>What are you shopping for today?</h1>
        <p className={styles.sub}>
          Browse our catalog, manage your cart, and track your orders.
        </p>
        <button className={styles.cta} onClick={() => navigate("/products")}>
          Browse Products →
        </button>
      </div>

      <div className={styles.cards}>
        <div className={styles.card} onClick={() => navigate("/products")}>
          <div className={styles.cardIcon}>🛍</div>
          <h3 className={styles.cardTitle}>Products</h3>
          <p className={styles.cardDesc}>Browse and search our full catalog</p>
        </div>
        <div className={styles.card} onClick={() => navigate("/cart")}>
          <div className={styles.cardIcon}>🛒</div>
          <h3 className={styles.cardTitle}>My Cart</h3>
          <p className={styles.cardDesc}>View items and proceed to checkout</p>
        </div>
        <div className={styles.card}>
          <div className={styles.cardIcon}>📦</div>
          <h3 className={styles.cardTitle}>Orders</h3>
          <p className={styles.cardDesc}>Track your order history</p>
        </div>
      </div>
    </div>
  );
}