import { useState, useEffect } from "react";
import {
  adminGetProducts, adminCreateProduct,
  adminUpdateProduct, adminDeleteProduct
} from "../../api/adminApi";
import styles from "../../styles/admin.module.css";

const EMPTY_FORM = {
  name: "", description: "", price: "", stock: "",
  category: "", imageUrl: "", active: true
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const res = await adminGetProducts();
      setProducts(res.data);
    } catch { setError("Failed to load products"); }
    finally { setLoading(false); }
  };

  const openAdd = () => { setForm(EMPTY_FORM); setEditingId(null); setShowForm(true); };

  const openEdit = (p) => {
    setForm({
      name: p.name, description: p.description || "",
      price: p.price, stock: p.stock,
      category: p.category, imageUrl: p.imageUrl || "",
      active: p.active
    });
    setEditingId(p.productId);
    setShowForm(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editingId) {
        await adminUpdateProduct(editingId, form);
      } else {
        await adminCreateProduct(form);
      }
      setShowForm(false);
      load();
    } catch (err) {
      alert(err.response?.data?.error || "Save failed");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Deactivate this product?")) return;
    try {
      await adminDeleteProduct(id);
      load();
    } catch { alert("Delete failed"); }
  };

  const handleReactivate = async (p) => {
    try {
      await adminUpdateProduct(p.productId, { ...p, active: true });
      load();
    } catch { alert("Failed"); }
  };

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <div>
          <h1 className={styles.sectionTitle}>Products</h1>
          <p className={styles.sectionSub}>{products.length} total products</p>
        </div>
        <button className={styles.primaryBtn} onClick={openAdd}>+ Add Product</button>
      </div>

      {error && <p className={styles.errorMsg}>{error}</p>}
      {loading ? <p className={styles.loadMsg}>Loading...</p> : (
        <div className={styles.table}>
          <div className={styles.tableHead}>
            <span>Product</span>
            <span>Category</span>
            <span>Price</span>
            <span>Stock</span>
            <span>Status</span>
            <span>Actions</span>
          </div>
          {products.map(p => (
            <div key={p.productId} className={`${styles.tableRow} ${!p.active ? styles.inactiveRow : ""}`}>
              <div className={styles.productCell}>
                <img
                  src={p.imageUrl || "https://placehold.co/48x48"}
                  alt={p.name}
                  className={styles.productThumb}
                />
                <div>
                  <div className={styles.productName}>{p.name}</div>
                  <div className={styles.productDesc}>
                    {p.description?.slice(0, 50)}{p.description?.length > 50 ? "..." : ""}
                  </div>
                </div>
              </div>
              <span className={styles.cell}>{p.category}</span>
              <span className={styles.cell}>₹{Number(p.price).toLocaleString("en-IN")}</span>
              <span className={styles.cell}>{p.stock}</span>
              <span className={styles.cell}>
                <span className={p.active ? styles.badgeActive : styles.badgeInactive}>
                  {p.active ? "Active" : "Inactive"}
                </span>
              </span>
              <div className={styles.actions}>
                <button className={styles.editBtn} onClick={() => openEdit(p)}>Edit</button>
                {p.active
                  ? <button className={styles.deleteBtn} onClick={() => handleDelete(p.productId)}>Deactivate</button>
                  : <button className={styles.reactivateBtn} onClick={() => handleReactivate(p)}>Reactivate</button>
                }
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showForm && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                {editingId ? "Edit Product" : "Add New Product"}
              </h2>
              <button className={styles.modalClose} onClick={() => setShowForm(false)}>✕</button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.formGrid}>
                <div className={styles.formField}>
                  <label>Product Name *</label>
                  <input value={form.name}
                    onChange={e => setForm({...form, name: e.target.value})}
                    placeholder="e.g. iPhone 15 Pro" />
                </div>
                <div className={styles.formField}>
                  <label>Category *</label>
                  <input value={form.category}
                    onChange={e => setForm({...form, category: e.target.value})}
                    placeholder="e.g. Electronics" />
                </div>
                <div className={styles.formField}>
                  <label>Price (₹) *</label>
                  <input type="number" value={form.price}
                    onChange={e => setForm({...form, price: e.target.value})}
                    placeholder="e.g. 79999" />
                </div>
                <div className={styles.formField}>
                  <label>Stock *</label>
                  <input type="number" value={form.stock}
                    onChange={e => setForm({...form, stock: e.target.value})}
                    placeholder="e.g. 25" />
                </div>
                <div className={`${styles.formField} ${styles.fullWidth}`}>
                  <label>Image URL</label>
                  <input value={form.imageUrl}
                    onChange={e => setForm({...form, imageUrl: e.target.value})}
                    placeholder="https://..." />
                </div>
                <div className={`${styles.formField} ${styles.fullWidth}`}>
                  <label>Description</label>
                  <textarea value={form.description}
                    onChange={e => setForm({...form, description: e.target.value})}
                    rows={3} placeholder="Product description..." />
                </div>
                <div className={styles.formField}>
                  <label>Status</label>
                  <select value={form.active}
                    onChange={e => setForm({...form, active: e.target.value === "true"})}>
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button className={styles.cancelBtn} onClick={() => setShowForm(false)}>Cancel</button>
              <button className={styles.primaryBtn} onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : editingId ? "Update Product" : "Add Product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}