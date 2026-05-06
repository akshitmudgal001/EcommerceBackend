import { useState, useEffect } from "react";
import { adminGetUsers, adminDeleteUser } from "../../api/adminApi";
import styles from "../../styles/admin.module.css";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const res = await adminGetUsers();
      setUsers(res.data);
    } finally { setLoading(false); }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete user "${name}"? This cannot be undone.`)) return;
    try {
      await adminDeleteUser(id);
      load();
    } catch (err) {
      alert(err.response?.data?.error || "Delete failed");
    }
  };

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <div>
          <h1 className={styles.sectionTitle}>Users</h1>
          <p className={styles.sectionSub}>{users.length} registered users</p>
        </div>
      </div>

      {loading ? <p className={styles.loadMsg}>Loading...</p> : (
        <div className={styles.table}>
          <div className={styles.tableHead}>
            <span>Name</span>
            <span>Email</span>
            <span>Role</span>
            <span>Joined</span>
            <span>Actions</span>
          </div>
          {users.map(u => (
            <div key={u.userId} className={styles.tableRow}>
              <div className={styles.userCell}>
                <div className={styles.avatar}>
                  {u.name.charAt(0).toUpperCase()}
                </div>
                <span className={styles.userName}>{u.name}</span>
              </div>
              <span className={styles.cell}>{u.email}</span>
              <span className={styles.cell}>
                <span className={u.role === "ADMIN" ? styles.badgeAdmin : styles.badgeUser}>
                  {u.role}
                </span>
              </span>
              <span className={styles.cell}>
                {u.createdAt ? new Date(u.createdAt).toLocaleDateString("en-IN") : "—"}
              </span>
              <div className={styles.actions}>
                {u.role !== "ADMIN" && (
                  <button className={styles.deleteBtn}
                    onClick={() => handleDelete(u.userId, u.name)}>
                    Delete
                  </button>
                )}
                {u.role === "ADMIN" && (
                  <span className={styles.protectedLabel}>Protected</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}