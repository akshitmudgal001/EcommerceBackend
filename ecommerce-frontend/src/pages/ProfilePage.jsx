import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { updateProfile, updatePassword } from "../api/userApi";
import styles from "../styles/profile.module.css";

export default function ProfilePage() {
  const { user, login } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [nameMsg, setNameMsg] = useState("");
  const [nameError, setNameError] = useState("");
  const [savingName, setSavingName] = useState(false);

  const [pwd, setPwd] = useState({ currentPassword: "", newPassword: "", confirm: "" });
  const [pwdErrors, setPwdErrors] = useState({});
  const [pwdMsg, setPwdMsg] = useState("");
  const [savingPwd, setSavingPwd] = useState(false);

  const handleNameSave = async () => {
    if (!name.trim()) { setNameError("Name cannot be empty"); return; }
    setSavingName(true);
    setNameMsg(""); setNameError("");
    try {
      const res = await updateProfile({ name: name.trim() });
      // Update AuthContext so Navbar reflects new name immediately
      const token = localStorage.getItem("token");
      login(res.data, token);
      setNameMsg("Profile updated successfully");
    } catch (err) {
      setNameError(err.response?.data?.error || "Update failed");
    } finally { setSavingName(false); }
  };

  const handlePwdSave = async () => {
    const e = {};
    if (!pwd.currentPassword) e.currentPassword = "Current password is required";
    if (!pwd.newPassword || pwd.newPassword.length < 6)
      e.newPassword = "Password must be at least 6 characters";
    if (pwd.newPassword !== pwd.confirm)
      e.confirm = "Passwords do not match";
    setPwdErrors(e);
    if (Object.keys(e).length) return;

    setSavingPwd(true);
    setPwdMsg("");
    try {
      await updatePassword({
        currentPassword: pwd.currentPassword,
        newPassword: pwd.newPassword
      });
      setPwdMsg("Password updated successfully");
      setPwd({ currentPassword: "", newPassword: "", confirm: "" });
    } catch (err) {
      setPwdErrors({ currentPassword: err.response?.data?.error || "Failed" });
    } finally { setSavingPwd(false); }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>My Profile</h1>
        <p className={styles.sub}>Manage your account details</p>
      </div>

      <div className={styles.grid}>

        {/* Personal Info */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.avatar}>{user?.name?.charAt(0).toUpperCase()}</div>
            <div>
              <h2 className={styles.cardTitle}>Personal Information</h2>
              <span className={`${styles.roleBadge} ${user?.role === "ADMIN" ? styles.adminRole : styles.userRole}`}>
                {user?.role}
              </span>
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Full Name</label>
            <input className={styles.input} value={name}
              onChange={e => { setName(e.target.value); setNameError(""); setNameMsg(""); }} />
            {nameError && <span className={styles.error}>{nameError}</span>}
            {nameMsg   && <span className={styles.success}>{nameMsg}</span>}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Email Address</label>
            <input className={`${styles.input} ${styles.readOnly}`}
              value={user?.email} readOnly />
            <span className={styles.hint}>Email cannot be changed</span>
          </div>

          <button className={styles.primaryBtn} onClick={handleNameSave} disabled={savingName}>
            {savingName ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {/* Change Password */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Change Password</h2>

          {["currentPassword", "newPassword", "confirm"].map((key) => (
            <div key={key} className={styles.field}>
              <label className={styles.label}>
                {{ currentPassword: "Current Password", newPassword: "New Password", confirm: "Confirm New Password" }[key]}
              </label>
              <input type="password" className={`${styles.input} ${pwdErrors[key] ? styles.inputError : ""}`}
                value={pwd[key]}
                onChange={e => {
                  setPwd(p => ({ ...p, [key]: e.target.value }));
                  setPwdErrors(p => ({ ...p, [key]: "" }));
                  setPwdMsg("");
                }}
                placeholder="••••••••" />
              {pwdErrors[key] && <span className={styles.error}>{pwdErrors[key]}</span>}
            </div>
          ))}

          {pwdMsg && <p className={styles.success}>{pwdMsg}</p>}

          <button className={styles.primaryBtn} onClick={handlePwdSave} disabled={savingPwd}>
            {savingPwd ? "Updating..." : "Update Password"}
          </button>
        </div>
      </div>
    </div>
  );
}