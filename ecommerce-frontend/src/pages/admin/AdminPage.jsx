import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AdminProducts from "./AdminProducts";
import AdminUsers from "./AdminUsers";
import AdminCarts from "./AdminCarts";
import styles from "../../styles/admin.module.css";

export default function AdminPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className={styles.shell}>

      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarTop}>
          <div className={styles.sidebarLogo} onClick={() => navigate("/dashboard")}>
            ShopApp
          </div>
          <div className={styles.sidebarLabel}>Admin Panel</div>
        </div>

        <nav className={styles.sidebarNav}>
          <button
            className={`${styles.navItem} ${isActive("/admin") || isActive("/admin/products") ? styles.navActive : ""}`}
            onClick={() => navigate("/admin/products")}
          >
            <span className={styles.navIcon}>📦</span>
            Products
          </button>
          <button
            className={`${styles.navItem} ${isActive("/admin/users") ? styles.navActive : ""}`}
            onClick={() => navigate("/admin/users")}
          >
            <span className={styles.navIcon}>👥</span>
            Users
          </button>
          <button
            className={`${styles.navItem} ${isActive("/admin/carts") ? styles.navActive : ""}`}
            onClick={() => navigate("/admin/carts")}
          >
            <span className={styles.navIcon}>🛒</span>
            Carts
          </button>
        </nav>

        <div className={styles.sidebarBottom}>
          <div className={styles.adminInfo}>
            <div className={styles.adminName}>{user?.name}</div>
            <div className={styles.adminEmail}>{user?.email}</div>
          </div>
          <button className={styles.backBtn} onClick={() => navigate("/dashboard")}>
            ← Back to Store
          </button>
          <button className={styles.logoutSide} onClick={() => { logout(); navigate("/login"); }}>
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className={styles.main}>
        <Routes>
          <Route path="/" element={<Navigate to="/admin/products" replace />} />
          <Route path="/products" element={<AdminProducts />} />
          <Route path="/users" element={<AdminUsers />} />
          <Route path="/carts" element={<AdminCarts />} />
        </Routes>
      </main>
    </div>
  );
}