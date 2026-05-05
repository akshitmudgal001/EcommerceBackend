import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCart, updateItem, removeItem, clearCart } from "../api/cartApi";
import styles from "../styles/cart.module.css";

export default function CartPage() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [checkingOut, setCheckingOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { fetchCart(); }, []);

  const fetchCart = async () => {
    try {
      const res = await getCart();
      setCart(res.data);
    } catch {
      setError("Failed to load cart.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQty = async (cartItemId, newQty) => {
    try {
      const res = await updateItem(cartItemId, newQty);
      setCart(res.data);
    } catch (err) {
      alert(err.response?.data?.error || "Failed to update quantity");
    }
  };

  const handleRemove = async (cartItemId) => {
    try {
      const res = await removeItem(cartItemId);
      setCart(res.data);
    } catch {
      alert("Failed to remove item");
    }
  };

  const handleClear = async () => {
    if (!window.confirm("Clear your entire cart?")) return;
    try {
      await clearCart();
      setCart(prev => ({ ...prev, items: [], totalPrice: 0, totalItems: 0 }));
    } catch {
      alert("Failed to clear cart");
    }
  };

  const handleCheckout = async () => {
    setCheckingOut(true);
    // Orders module — coming next session
    setTimeout(() => {
      alert("Order placed successfully! (Orders module coming soon)");
      setCheckingOut(false);
    }, 1200);
  };

  if (loading) return <div className={styles.center}>Loading cart...</div>;
  if (error)   return <div className={styles.center}>{error}</div>;

  const isEmpty = !cart?.items?.length;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>My Cart</h1>
        {!isEmpty && (
          <button className={styles.clearBtn} onClick={handleClear}>
            Clear all
          </button>
        )}
      </div>

      {isEmpty ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>🛒</div>
          <h2 className={styles.emptyTitle}>Your cart is empty</h2>
          <p className={styles.emptyText}>Add some products to get started</p>
          <button className={styles.shopBtn} onClick={() => navigate("/products")}>
            Browse Products
          </button>
        </div>
      ) : (
        <div className={styles.layout}>

          {/* Items list */}
          <div className={styles.itemsList}>
            {cart.items.map((item) => (
              <div key={item.cartItemId} className={styles.item}>
                <img
                  src={item.imageUrl || "https://placehold.co/100x100"}
                  alt={item.productName}
                  className={styles.itemImage}
                  onClick={() => navigate(`/products/${item.productId}`)}
                />
                <div className={styles.itemDetails}>
                  <h3
                    className={styles.itemName}
                    onClick={() => navigate(`/products/${item.productId}`)}
                  >
                    {item.productName}
                  </h3>
                  <p className={styles.itemPrice}>₹{item.price} each</p>
                </div>

                {/* Quantity control */}
                <div className={styles.qtyControl}>
                  <button
                    className={styles.qBtn}
                    onClick={() => handleUpdateQty(item.cartItemId, item.quantity - 1)}
                  >−</button>
                  <span className={styles.qNum}>{item.quantity}</span>
                  <button
                    className={styles.qBtn}
                    onClick={() => handleUpdateQty(item.cartItemId, item.quantity + 1)}
                  >+</button>
                </div>

                <div className={styles.itemTotal}>
                  ₹{Number(item.itemTotal).toLocaleString("en-IN")}
                </div>

                <button
                  className={styles.removeBtn}
                  onClick={() => handleRemove(item.cartItemId)}
                  title="Remove item"
                >✕</button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className={styles.summary}>
            <h2 className={styles.summaryTitle}>Order Summary</h2>

            <div className={styles.summaryRows}>
              <div className={styles.summaryRow}>
                <span>Items ({cart.totalItems})</span>
                <span>₹{Number(cart.totalPrice).toLocaleString("en-IN")}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Delivery</span>
                <span className={styles.free}>Free</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Tax (18% GST)</span>
                <span>₹{(cart.totalPrice * 0.18).toFixed(2)}</span>
              </div>
            </div>

            <div className={styles.divider} />

            <div className={styles.totalRow}>
              <span>Total</span>
              <span className={styles.totalAmount}>
                ₹{(cart.totalPrice * 1.18).toLocaleString("en-IN", {
                  maximumFractionDigits: 2
                })}
              </span>
            </div>

            <button
              className={styles.checkoutBtn}
              onClick={handleCheckout}
              disabled={checkingOut}
            >
              {checkingOut ? "Placing Order..." : "Proceed to Checkout"}
            </button>

            <button
              className={styles.continueBtn}
              onClick={() => navigate("/products")}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
}