import { useState, useEffect } from "react";
import { adminGetOrders, adminUpdateStatus } from "../../api/orderApi";
import styles from "../../styles/admin.module.css";

const STATUSES = ["CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];

const STATUS_COLORS = {
  CONFIRMED: styles.badgeActive,
  SHIPPED:   styles.badgeAdmin,
  DELIVERED: styles.badgeUser,
  CANCELLED: styles.badgeInactive,
  PENDING:   styles.badgeInactive,
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const res = await adminGetOrders();
      setOrders(res.data);
    } finally { setLoading(false); }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await adminUpdateStatus(orderId, newStatus);
      setOrders(prev => prev.map(o =>
        o.orderId === orderId ? { ...o, status: newStatus } : o
      ));
    } catch { alert("Failed to update status"); }
  };

  const toggle = (id) => setExpanded(expanded === id ? null : id);

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <div>
          <h1 className={styles.sectionTitle}>Orders</h1>
          <p className={styles.sectionSub}>{orders.length} total orders</p>
        </div>
      </div>

      {loading ? <p className={styles.loadMsg}>Loading...</p> : (
        <div className={styles.table}>
          <div className={styles.tableHead}
            style={{ gridTemplateColumns: "0.8fr 1.5fr 1fr 1fr 1fr 1.5fr" }}>
            <span>Order ID</span>
            <span>Customer</span>
            <span>Total</span>
            <span>Payment</span>
            <span>Date</span>
            <span>Status</span>
          </div>

          {orders.map(order => (
            <div key={order.orderId}>
              <div className={styles.tableRow}
                style={{ gridTemplateColumns: "0.8fr 1.5fr 1fr 1fr 1fr 1.5fr", cursor: "pointer" }}
                onClick={() => toggle(order.orderId)}>
                <span className={styles.cell} style={{ fontWeight: 600 }}>
                  #{String(order.orderId).padStart(6, "0")}
                </span>
                <div className={styles.userCell}>
                  <div className={styles.avatar}>{order.customerName.charAt(0).toUpperCase()}</div>
                  <div>
                    <div className={styles.userName}>{order.customerName}</div>
                    <div style={{ fontSize: 11, color: "#aaa" }}>{order.customerEmail}</div>
                  </div>
                </div>
                <span className={styles.cell} style={{ fontWeight: 600 }}>
                  ₹{Number(order.totalAmount).toLocaleString("en-IN")}
                </span>
                <span className={styles.cell}>{order.paymentMethod}</span>
                <span className={styles.cell}>
                  {new Date(order.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric", month: "short"
                  })}
                </span>
                <div onClick={e => e.stopPropagation()}>
                  <select
                    value={order.status}
                    onChange={e => handleStatusChange(order.orderId, e.target.value)}
                    className={styles.statusSelect}
                    style={{ fontSize: 13, padding: "5px 10px", borderRadius: 6,
                      border: "1.5px solid #e0e0e0", background: "white",
                      cursor: "pointer", fontFamily: "inherit" }}
                  >
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              {expanded === order.orderId && (
                <div style={{
                  padding: "14px 20px 18px",
                  background: "#fafafa",
                  borderTop: "1px solid #f0f0f0"
                }}>
                  {order.items.map(item => (
                    <div key={item.orderItemId} style={{
                      display: "flex", alignItems: "center", gap: 12,
                      padding: "8px 0", borderBottom: "1px solid #f0f0f0"
                    }}>
                      <img src={item.productImage || "https://placehold.co/36x36"}
                        alt={item.productName}
                        style={{ width: 36, height: 36, objectFit: "cover", borderRadius: 6 }} />
                      <span style={{ flex: 1, fontSize: 13, color: "#444" }}>{item.productName}</span>
                      <span style={{ fontSize: 13, color: "#888" }}>× {item.quantity}</span>
                      <span style={{ fontSize: 13, fontWeight: 600 }}>
                        ₹{Number(item.totalPrice).toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                  {order.shippingAddress && (
                    <div style={{ marginTop: 12, fontSize: 13, color: "#666" }}>
                      <strong>Ship to:</strong> {order.shippingAddress.fullName}, {order.shippingAddress.addressLine1}, {order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.pincode}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}