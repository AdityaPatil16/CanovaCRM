import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./Settings.module.css";

export default function Settings() {
  const location = useLocation();
  const [formData] = useState({
    firstName: "Aditya",
    lastName: "Patil",
    email: "aditya.patil1603@outlook.com",
  });

  return (
    <div className={styles.wrapper}>
      <aside className={styles.sidebar}>
        <h2 className={styles.logo}>
          Canova<span className={styles.crmColor}>CRM</span>
        </h2>
        <ul className={styles.navList}>
          <li className={location.pathname === "/dashboard" ? styles.active : ""}>
            <Link to="/dashboard" className={styles.navLink}>Dashboard</Link>
          </li>
          <li className={location.pathname === "/leads" ? styles.active : ""}>
            <Link to="/leads" className={styles.navLink}>Leads</Link>
          </li>
          <li className={location.pathname === "/employees" ? styles.active : ""}>
            <Link to="/employees" className={styles.navLink}>Employees</Link>
          </li>
          <li className={location.pathname === "/settings" ? styles.active : ""}>
            <Link to="/settings" className={styles.navLink}>Settings</Link>
          </li>
        </ul>
      </aside>

      <main className={styles.mainContent}>
        <p className={styles.breadcrumb}>Home &gt; Settings</p>

        <div className={styles.formContainer}>
          <h3 className={styles.formTitle}>Edit Profile</h3>
          <form className={styles.form}>
            <div className={styles.formGroup}>
              <label>First name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                disabled
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Last name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                disabled
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                disabled
                className={styles.input}
              />
            </div>

            {/* Optional Save button if you want to enable editing later */}
            <button type="submit" className={styles.saveBtn} disabled>
              Save
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
