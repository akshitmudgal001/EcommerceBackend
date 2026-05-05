import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { getCart } from "../api/cartApi";
import styles from "../styles/navbar.module.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    if (user) {
      getCart()
        .then(res => setCartCount(res.data.totalItems || 0))
        .catch(() => {});
    }
  }, [user, location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <span className={styles.logo} onClick={() => navigate("/dashboard")}>
          ShopApp
        </span>

        <div className={styles.links}>
          <button
            className={`${styles.link} ${isActive("/dashboard") ? styles.active : ""}`}
            onClick={() => navigate("/dashboard")}
          >
            Home
          </button>
          <button
            className={`${styles.link} ${isActive("/products") ? styles.active : ""}`}
            onClick={() => navigate("/products")}
          >
            Products
          </button>
          <button
            className={`${styles.link} ${isActive("/cart") ? styles.active : ""}`}
            onClick={() => navigate("/cart")}
          >
            Cart
            {cartCount > 0 && (
              <span className={styles.badge}>{cartCount}</span>
            )}
          </button>
        </div>

        <div className={styles.right}>
          <span className={styles.userName}>{user?.name}</span>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}