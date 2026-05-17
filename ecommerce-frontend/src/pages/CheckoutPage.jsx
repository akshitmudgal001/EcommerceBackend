import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCart } from "../api/cartApi";
import { checkout } from "../api/orderApi";
import styles from "../styles/checkout.module.css";

const STEPS = ["Shipping", "Payment", "Review"];

const EMPTY_ADDR = {
  fullName: "", phone: "", addressLine1: "",
  addressLine2: "", city: "", state: "", pincode: ""
};

const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh",
  "Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka",
  "Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram",
  "Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana",
  "Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Delhi","Chandigarh"
];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [addr, setAddr] = useState(EMPTY_ADDR);
  const [addrErrors, setAddrErrors] = useState({});
  const [payment, setPayment] = useState("COD");
  const [orderSuccess, setOrderSuccess] = useState(null);

  useEffect(() => {
    getCart()
      .then(res => {
        if (!res.data.items?.length) navigate("/cart");
        else setCart(res.data);
      })
      .catch(() => navigate("/cart"))
      .finally(() => setLoading(false));
  }, []);

  // ─── Validation ─────────────────────────────────
  const validateAddr = () => {
    const e = {};
    if (!addr.fullName.trim())       e.fullName = "Full name is required";
    if (!/^[6-9]\d{9}$/.test(addr.phone)) e.phone = "Enter valid 10-digit mobile";
    if (!addr.addressLine1.trim())   e.addressLine1 = "Address is required";
    if (!addr.city.trim())           e.city = "City is required";
    if (!addr.state)                 e.state = "State is required";
    if (!/^[1-9][0-9]{5}$/.test(addr.pincode)) e.pincode = "Enter valid 6-digit pincode";
    setAddrErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleAddrChange = (e) => {
    setAddr(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setAddrErrors(prev => ({ ...prev, [e.target.name]: "" }));
  };

  const nextStep = () => {
    if (step === 0 && !validateAddr()) return;
    setStep(s => s + 1);
  };

  // ─── Place Order ────────────────────────────────
  const handlePlaceOrder = async () => {
    setPlacing(true);
    try {
      const res = await checkout({
        shippingAddress: addr,
        paymentMethod: payment
      });
      setOrderSuccess(res.data);
    } catch (err) {
      alert(err.response?.data?.error || "Order failed. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  if (loading) return <div className={styles.center}>Loading...</div>;

  // ─── Success Screen ─────────────────────────────
  if (orderSuccess) {
    return (
      <div className={styles.successPage}>
        <div className={styles.successCard}>
          <div className={styles.successIcon}>✓</div>
          <h1 className={styles.successTitle}>Order Placed!</h1>
          <p className={styles.successSub}>
            Order #{String(orderSuccess.orderId).padStart(6, "0")} has been confirmed.
          </p>
          <p className={styles.successDetail}>
            Total paid: <strong>₹{Number(orderSuccess.totalAmount).toLocaleString("en-IN")}</strong>
            &nbsp;via {orderSuccess.paymentMethod}
          </p>
          <div className={styles.successActions}>
            <button className={styles.primaryBtn} onClick={() => navigate("/orders")}>
              View My Orders
            </button>
            <button className={styles.outlineBtn} onClick={() => navigate("/products")}>
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* Step indicator */}
      <div className={styles.stepBar}>
        {STEPS.map((s, i) => (
          <div key={s} className={styles.stepItem}>
            <div className={`${styles.stepCircle} ${i <= step ? styles.stepDone : ""}`}>
              {i < step ? "✓" : i + 1}
            </div>
            <span className={`${styles.stepLabel} ${i === step ? styles.stepActive : ""}`}>{s}</span>
            {i < STEPS.length - 1 && <div className={`${styles.stepLine} ${i < step ? styles.lineDone : ""}`} />}
          </div>
        ))}
      </div>

      <div className={styles.layout}>

        {/* Left — Form */}
        <div className={styles.formPanel}>

          {/* Step 0 — Shipping */}
          {step === 0 && (
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Shipping Details</h2>
              <div className={styles.grid2}>
                <Field label="Full Name *" name="fullName" value={addr.fullName}
                  onChange={handleAddrChange} error={addrErrors.fullName} placeholder="Akshit Mudgal" />
                <Field label="Phone Number *" name="phone" value={addr.phone}
                  onChange={handleAddrChange} error={addrErrors.phone} placeholder="9876543210" />
              </div>
              <Field label="Address Line 1 *" name="addressLine1" value={addr.addressLine1}
                onChange={handleAddrChange} error={addrErrors.addressLine1}
                placeholder="House / Flat / Block No." />
              <Field label="Address Line 2" name="addressLine2" value={addr.addressLine2}
                onChange={handleAddrChange} placeholder="Street, Area, Landmark (optional)" />
              <div className={styles.grid3}>
                <Field label="City *" name="city" value={addr.city}
                  onChange={handleAddrChange} error={addrErrors.city} placeholder="Ludhiana" />
                <div className={styles.fieldWrap}>
                  <label className={styles.label}>State *</label>
                  <select name="state" value={addr.state} onChange={handleAddrChange}
                    className={`${styles.input} ${addrErrors.state ? styles.inputError : ""}`}>
                    <option value="">Select state</option>
                    {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {addrErrors.state && <span className={styles.error}>{addrErrors.state}</span>}
                </div>
                <Field label="Pincode *" name="pincode" value={addr.pincode}
                  onChange={handleAddrChange} error={addrErrors.pincode} placeholder="141001" />
              </div>
            </div>
          )}

          {/* Step 1 — Payment */}
          {step === 1 && (
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Payment Method</h2>
              <div className={styles.paymentOptions}>
                {[
                  { id: "COD",  label: "Cash on Delivery", desc: "Pay when your order arrives", icon: "💵" },
                  { id: "UPI",  label: "UPI",              desc: "PhonePe, GPay, Paytm, etc.",   icon: "📱" },
                  { id: "CARD", label: "Credit / Debit Card", desc: "Visa, Mastercard, RuPay",   icon: "💳" },
                ].map(opt => (
                  <label key={opt.id}
                    className={`${styles.payOption} ${payment === opt.id ? styles.paySelected : ""}`}>
                    <input type="radio" name="payment" value={opt.id}
                      checked={payment === opt.id}
                      onChange={e => setPayment(e.target.value)}
                      className={styles.radioInput} />
                    <span className={styles.payIcon}>{opt.icon}</span>
                    <div>
                      <div className={styles.payLabel}>{opt.label}</div>
                      <div className={styles.payDesc}>{opt.desc}</div>
                    </div>
                    {payment === opt.id && <span className={styles.payCheck}>✓</span>}
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Step 2 — Review */}
          {step === 2 && (
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Review Order</h2>
              <div className={styles.reviewSection}>
                <div className={styles.reviewLabel}>Delivery Address</div>
                <div className={styles.reviewText}>
                  <strong>{addr.fullName}</strong> · {addr.phone}<br />
                  {addr.addressLine1}{addr.addressLine2 ? ", " + addr.addressLine2 : ""}<br />
                  {addr.city}, {addr.state} — {addr.pincode}
                </div>
              </div>
              <div className={styles.reviewSection}>
                <div className={styles.reviewLabel}>Payment</div>
                <div className={styles.reviewText}>{payment}</div>
              </div>
              <div className={styles.reviewItems}>
                {cart.items.map(item => (
                  <div key={item.cartItemId} className={styles.reviewItem}>
                    <img src={item.imageUrl || "https://placehold.co/48x48"}
                      alt={item.productName} className={styles.reviewThumb} />
                    <div className={styles.reviewItemInfo}>
                      <span className={styles.reviewItemName}>{item.productName}</span>
                      <span className={styles.reviewItemQty}>× {item.quantity}</span>
                    </div>
                    <span className={styles.reviewItemPrice}>
                      ₹{Number(item.itemTotal).toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className={styles.navBtns}>
            {step > 0 && (
              <button className={styles.outlineBtn} onClick={() => setStep(s => s - 1)}>
                ← Back
              </button>
            )}
            {step === 0 && (
              <button className={styles.outlineBtn} onClick={() => navigate("/cart")}>
                ← Back to Cart
              </button>
            )}
            {step < 2 && (
              <button className={styles.primaryBtn} onClick={nextStep}>
                Continue →
              </button>
            )}
            {step === 2 && (
              <button className={styles.primaryBtn} onClick={handlePlaceOrder} disabled={placing}>
                {placing ? "Placing Order..." : "Place Order"}
              </button>
            )}
          </div>
        </div>

        {/* Right — Summary */}
        <div className={styles.summary}>
          <h3 className={styles.summaryTitle}>Order Summary</h3>
          <div className={styles.summaryItems}>
            {cart.items.map(item => (
              <div key={item.cartItemId} className={styles.summaryItem}>
                <span className={styles.summaryName}>
                  {item.productName}
                  <span className={styles.summaryQty}> × {item.quantity}</span>
                </span>
                <span className={styles.summaryPrice}>
                  ₹{Number(item.itemTotal).toLocaleString("en-IN")}
                </span>
              </div>
            ))}
          </div>
          <div className={styles.summaryDivider} />
          <div className={styles.summaryRow}>
            <span>Subtotal</span>
            <span>₹{Number(cart.totalPrice).toLocaleString("en-IN")}</span>
          </div>
          <div className={styles.summaryRow}>
            <span>GST (18%)</span>
            <span>₹{(cart.totalPrice * 0.18).toLocaleString("en-IN", { maximumFractionDigits: 2 })}</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Delivery</span>
            <span className={styles.free}>Free</span>
          </div>
          <div className={styles.summaryDivider} />
          <div className={styles.summaryTotal}>
            <span>Total</span>
            <span>₹{(cart.totalPrice * 1.18).toLocaleString("en-IN", { maximumFractionDigits: 2 })}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Reusable field component
function Field({ label, name, value, onChange, error, placeholder, type = "text" }) {
  return (
    <div className={styles.fieldWrap}>
      <label className={styles.label}>{label}</label>
      <input type={type} name={name} value={value} onChange={onChange}
        placeholder={placeholder}
        className={`${styles.input} ${error ? styles.inputError : ""}`} />
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}