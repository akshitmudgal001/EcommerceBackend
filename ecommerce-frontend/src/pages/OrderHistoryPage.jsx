import { useState, useEffect } from "react";
import { getMyOrders } from "../api/orderApi";
import { useNavigate } from "react-router-dom";
import styles from "../styles/orderHistory.module.css";

const STATUS_CONFIG = {
  CONFIRMED: { label: "Confirmed",  cls: "blue"   },
  PENDING:   { label: "Pending",    cls: "gray"   },
  SHIPPED:   { label: "Shipped",    cls: "amber"  },
  DELIVERED: { label: "Delivered",  cls: "green"  },
  CANCELLED: { label: "Cancelled",  cls: "red"    },
};

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getMyOrders()
      .then(res => setOrders(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className={styles.center}>Loading orders...</div>;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>My Orders</h1>
        <p className={styles.sub}>{orders.length} order{orders.length !== 1 ? "s" : ""} placed</p>
      </div>

      {orders.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>📦</div>
          <h2 className={styles.emptyTitle}>No orders yet</h2>
          <p className={styles.emptySub}>Once you place an order it will appear here</p>
          <button className={styles.shopBtn} onClick={() => navigate("/products")}>
            Start Shopping
          </button>
        </div>
      ) : (
        <div className={styles.list}>
          {orders.map(order => {
            const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING;
            const isOpen = expanded === order.orderId;
            return (
              <div key={order.orderId} className={styles.orderCard}>
                <div className={styles.orderHeader} onClick={() => setExpanded(isOpen ? null : order.orderId)}>
                  <div className={styles.orderMeta}>
                    <span className={styles.orderId}>
                      Order #{String(order.orderId).padStart(6, "0")}
                    </span>
                    <span className={styles.orderDate}>
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric", month: "short", year: "numeric"
                      })}
                    </span>
                  </div>
                  <div className={styles.orderRight}>
                    <span className={`${styles.statusBadge} ${styles[cfg.cls]}`}>
                      {cfg.label}
                    </span>
                    <span className={styles.orderTotal}>
                      ₹{Number(order.totalAmount).toLocaleString("en-IN")}
                    </span>
                    <span className={styles.expandIcon}>{isOpen ? "▲" : "▼"}</span>
                  </div>
                </div>

                {isOpen && (
                  <div className={styles.orderBody}>
                    {/* Items */}
                    <div className={styles.orderItems}>
                      {order.items.map(item => (
                        <div key={item.orderItemId} className={styles.orderItem}>
                          <img src={item.productImage || "https://placehold.co/48x48"}
                            alt={item.productName} className={styles.itemThumb} />
                          <div className={styles.itemInfo}>
                            <span className={styles.itemName}>{item.productName}</span>
                            <span className={styles.itemMeta}>
                              × {item.quantity} · ₹{Number(item.unitPrice).toLocaleString("en-IN")} each
                            </span>
                          </div>
                          <span className={styles.itemTotal}>
                            ₹{Number(item.totalPrice).toLocaleString("en-IN")}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Price breakdown */}
                    <div className={styles.breakdown}>
                      <div className={styles.breakdownRow}>
                        <span>Subtotal</span>
                        <span>₹{Number(order.subtotal).toLocaleString("en-IN")}</span>
                      </div>
                      <div className={styles.breakdownRow}>
                        <span>GST (18%)</span>
                        <span>₹{Number(order.tax).toLocaleString("en-IN")}</span>
                      </div>
                      <div className={styles.breakdownRow}>
                        <span>Delivery</span>
                        <span className={styles.free}>Free</span>
                      </div>
                      <div className={`${styles.breakdownRow} ${styles.totalRow}`}>
                        <span>Total</span>
                        <span>₹{Number(order.totalAmount).toLocaleString("en-IN")}</span>
                      </div>
                    </div>

                    {/* Shipping address */}
                    {order.shippingAddress && (
                      <div className={styles.addressBox}>
                        <div className={styles.addressLabel}>Delivery Address</div>
                        <div className={styles.addressText}>
                          <strong>{order.shippingAddress.fullName}</strong> · {order.shippingAddress.phone}<br />
                          {order.shippingAddress.addressLine1}
                          {order.shippingAddress.addressLine2 ? ", " + order.shippingAddress.addressLine2 : ""}<br />
                          {order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.pincode}
                        </div>
                      </div>
                    )}

                    <div className={styles.paymentInfo}>
                      Payment: <strong>{order.paymentMethod}</strong>
                      &nbsp;·&nbsp;
                      <span className={order.paymentStatus === "PAID" ? styles.paid : styles.pending}>
                        {order.paymentStatus}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}