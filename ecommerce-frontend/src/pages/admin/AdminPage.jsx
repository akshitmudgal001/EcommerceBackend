import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AdminDashboard from "./AdminDashboard";
import AdminProducts  from "./AdminProducts";
import AdminUsers     from "./AdminUsers";
import AdminCarts     from "./AdminCarts";
import AdminOrders    from "./AdminOrders";
import styles from "../../styles/admin.module.css";

const NAV = [
  { path: "/admin",          exact: true, icon: "📊", label: "Dashboard" },
  { path: "/admin/products",              icon: "📦", label: "Products"  },
  { path: "/admin/orders",               icon: "📋", label: "Orders"    },
  { path: "/admin/users",                icon: "👥", label: "Users"     },
  { path: "/admin/carts",                icon: "🛒", label: "Carts"     },
];

export default function AdminPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path, exact) =>
    exact ? location.pathname === path : location.pathname.startsWith(path);

  return (
    <div className={styles.shell}>

      {/* Sidebar */}
      <aside className={styles.sidebar}>

        <div className={styles.sidebarTop}>
          <div className={styles.sidebarBrand}>
            <span className={styles.sidebarLogo}>ShopApp</span>
            <span className={styles.sidebarBadge}>ADMIN</span>
          </div>
        </div>

        <nav className={styles.sidebarNav}>
          {NAV.map(({ path, exact, icon, label }) => (
            <button key={path}
              className={`${styles.navItem} ${isActive(path, exact) ? styles.navActive : ""}`}
              onClick={() => navigate(path)}>
              <span className={styles.navIcon}>{icon}</span>
              {label}
            </button>
          ))}
        </nav>

        <div className={styles.sidebarBottom}>
          <div className={styles.adminInfo}>
            <div className={styles.adminAvatar}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className={styles.adminName}>{user?.name}</div>
              <div className={styles.adminEmail}>{user?.email}</div>
            </div>
          </div>
          <button className={styles.logoutSide}
            onClick={() => { logout(); navigate("/login"); }}>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className={styles.main}>
        <Routes>
          <Route path="/"          element={<AdminDashboard />} />
          <Route path="/products"  element={<AdminProducts />} />
          <Route path="/orders"    element={<AdminOrders />} />
          <Route path="/users"     element={<AdminUsers />} />
          <Route path="/carts"     element={<AdminCarts />} />
          <Route path="*"          element={<Navigate to="/admin" replace />} />
        </Routes>
      </main>
    </div>
  );
}