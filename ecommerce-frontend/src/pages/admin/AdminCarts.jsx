import { useState, useEffect } from "react";
import { adminGetCarts } from "../../api/adminApi";
import styles from "../../styles/admin.module.css";

export default function AdminCarts() {
  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const res = await adminGetCarts();
      setCarts(res.data);
    } finally { setLoading(false); }
  };

  const toggle = (id) => setExpanded(expanded === id ? null : id);

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <div>
          <h1 className={styles.sectionTitle}>User Carts</h1>
          <p className={styles.sectionSub}>{carts.length} active carts</p>
        </div>
      </div>

      {loading ? <p className={styles.loadMsg}>Loading...</p> : (
        <div className={styles.cartList}>
          {carts.length === 0 && (
            <p className={styles.emptyMsg}>No active carts found.</p>
          )}
          {carts.map(cart => (
            <div key={cart.cartId} className={styles.cartCard}>
              <div className={styles.cartCardHeader} onClick={() => toggle(cart.cartId)}>
                <div className={styles.cartUserInfo}>
                  <div className={styles.avatar}>{cart.userName.charAt(0).toUpperCase()}</div>
                  <div>
                    <div className={styles.cartUserName}>{cart.userName}</div>
                    <div className={styles.cartUserEmail}>{cart.userEmail}</div>
                  </div>
                </div>
                <div className={styles.cartMeta}>
                  <span className={styles.cartItems}>{cart.totalItems} items</span>
                  <span className={styles.cartTotal}>
                    ₹{Number(cart.totalPrice).toLocaleString("en-IN")}
                  </span>
                  <span className={styles.expandIcon}>
                    {expanded === cart.cartId ? "▲" : "▼"}
                  </span>
                </div>
              </div>

              {expanded === cart.cartId && (
                <div className={styles.cartItems}>
                  {cart.items.length === 0
                    ? <p className={styles.emptyMsg}>Cart is empty</p>
                    : cart.items.map(item => (
                      <div key={item.cartItemId} className={styles.cartItemRow}>
                        <img
                          src={item.imageUrl || "https://placehold.co/40x40"}
                          alt={item.productName}
                          className={styles.cartItemThumb}
                        />
                        <span className={styles.cartItemName}>{item.productName}</span>
                        <span className={styles.cartItemQty}>× {item.quantity}</span>
                        <span className={styles.cartItemTotal}>
                          ₹{Number(item.itemTotal).toLocaleString("en-IN")}
                        </span>
                      </div>
                    ))
                  }
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}