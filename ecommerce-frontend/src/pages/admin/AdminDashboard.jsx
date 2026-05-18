import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { adminGetStats } from "../../api/adminApi";
import styles from "../../styles/adminDashboard.module.css";

const STATUS_CONFIG = {
  CONFIRMED: { label: "Confirmed", cls: "blue"   },
  PENDING:   { label: "Pending",   cls: "gray"   },
  SHIPPED:   { label: "Shipped",   cls: "amber"  },
  DELIVERED: { label: "Delivered", cls: "green"  },
  CANCELLED: { label: "Cancelled", cls: "red"    },
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    adminGetStats()
      .then(res => setStats(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className={styles.loading}>Loading dashboard...</div>;
  if (!stats)  return <div className={styles.loading}>Failed to load stats.</div>;

  const statCards = [
    {
      label: "Total Revenue",
      value: `₹${Number(stats.totalRevenue).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`,
      sub: "All time",
      icon: "💰",
      color: "green",
      action: () => navigate("/admin/orders"),
    },
    {
      label: "Total Orders",
      value: stats.totalOrders,
      sub: `${stats.confirmedOrders} confirmed`,
      icon: "📋",
      color: "blue",
      action: () => navigate("/admin/orders"),
    },
    {
      label: "Total Users",
      value: stats.totalUsers,
      sub: "Registered accounts",
      icon: "👥",
      color: "purple",
      action: () => navigate("/admin/users"),
    },
    {
      label: "Active Products",
      value: stats.activeProducts,
      sub: `${stats.totalProducts} total`,
      icon: "📦",
      color: "amber",
      action: () => navigate("/admin/products"),
    },
  ];

  const orderStatusData = [
    { label: "Confirmed", count: stats.confirmedOrders, cls: "blue"  },
    { label: "Shipped",   count: stats.shippedOrders,   cls: "amber" },
    { label: "Delivered", count: stats.deliveredOrders, cls: "green" },
    { label: "Pending",   count: stats.pendingOrders,   cls: "gray"  },
  ];

  return (
    <div className={styles.page}>

      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Dashboard</h1>
        <p className={styles.pageSub}>Welcome back — here's what's happening.</p>
      </div>

      {/* Stat cards */}
      <div className={styles.statGrid}>
        {statCards.map((card) => (
          <div key={card.label}
            className={`${styles.statCard} ${styles[card.color]}`}
            onClick={card.action}>
            <div className={styles.statTop}>
              <span className={styles.statIcon}>{card.icon}</span>
              <span className={styles.statLabel}>{card.label}</span>
            </div>
            <div className={styles.statValue}>{card.value}</div>
            <div className={styles.statSub}>{card.sub}</div>
          </div>
        ))}
      </div>

      <div className={styles.bottomGrid}>

        {/* Recent Orders */}
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2 className={styles.panelTitle}>Recent Orders</h2>
            <button className={styles.panelLink}
              onClick={() => navigate("/admin/orders")}>
              View all →
            </button>
          </div>

          {stats.recentOrders.length === 0 ? (
            <p className={styles.emptyMsg}>No orders yet</p>
          ) : (
            <div className={styles.orderList}>
              {stats.recentOrders.map(order => {
                const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING;
                return (
                  <div key={order.orderId} className={styles.orderRow}>
                    <div className={styles.orderInfo}>
                      <span className={styles.orderIdText}>
                        #{String(order.orderId).padStart(6, "0")}
                      </span>
                      <span className={styles.orderCustomer}>
                        {order.customerName}
                      </span>
                    </div>
                    <div className={styles.orderRight}>
                      <span className={`${styles.statusPill} ${styles[cfg.cls]}`}>
                        {cfg.label}
                      </span>
                      <span className={styles.orderAmount}>
                        ₹{Number(order.totalAmount).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Order Status Breakdown */}
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2 className={styles.panelTitle}>Order Status</h2>
          </div>
          <div className={styles.statusBreakdown}>
            {orderStatusData.map(({ label, count, cls }) => (
              <div key={label} className={styles.statusRow}>
                <div className={styles.statusLeft}>
                  <span className={`${styles.statusDot} ${styles[cls]}`} />
                  <span className={styles.statusLabel}>{label}</span>
                </div>
                <div className={styles.statusRight}>
                  <div className={styles.statusBar}>
                    <div
                      className={`${styles.statusBarFill} ${styles[cls]}`}
                      style={{
                        width: stats.totalOrders > 0
                          ? `${(count / stats.totalOrders) * 100}%`
                          : "0%"
                      }}
                    />
                  </div>
                  <span className={styles.statusCount}>{count}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick actions */}
          <div className={styles.quickActions}>
            <h3 className={styles.quickTitle}>Quick Actions</h3>
            <button className={styles.quickBtn}
              onClick={() => navigate("/admin/products")}>
              + Add Product
            </button>
            <button className={styles.quickBtn}
              onClick={() => navigate("/admin/orders")}>
              Manage Orders
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}