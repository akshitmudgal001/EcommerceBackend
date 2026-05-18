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
    // Only fetch cart for regular users, not admin
    if (user && user.role !== "ADMIN") {
      getCart()
        .then(res => setCartCount(res.data.totalItems || 0))
        .catch(() => {});
    }
  }, [user, location.pathname]);

  const isActive = (path) => location.pathname.startsWith(path);

  const NAV_LINKS = [
    { label: "Home",     path: "/dashboard" },
    { label: "Products", path: "/products"  },
    { label: "Orders",   path: "/orders"    },
  ];

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>

        <span className={styles.logo} onClick={() => navigate("/dashboard")}>
          ShopApp
        </span>

        <div className={styles.links}>
          {NAV_LINKS.map(({ label, path }) => (
            <button key={path}
              className={`${styles.link} ${isActive(path) ? styles.active : ""}`}
              onClick={() => navigate(path)}>
              {label}
            </button>
          ))}

          <button
            className={`${styles.link} ${isActive("/cart") ? styles.active : ""}`}
            onClick={() => navigate("/cart")}>
            Cart
            {cartCount > 0 && <span className={styles.badge}>{cartCount}</span>}
          </button>
        </div>

        <div className={styles.right}>
          <button className={styles.profileBtn} onClick={() => navigate("/profile")}>
            <span className={styles.profileAvatar}>
              {user?.name?.charAt(0).toUpperCase()}
            </span>
            <span className={styles.profileName}>{user?.name}</span>
          </button>
          <button className={styles.logoutBtn}
            onClick={() => { logout(); navigate("/login"); }}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}