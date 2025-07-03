import React, { useState, useRef, useEffect } from "react";
import styles from "./Leads.module.css";
import { FiSearch } from "react-icons/fi";
import { IoCloseOutline } from "react-icons/io5";
import { MdOutlineFileUpload } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";

export default function Leads() {
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [leadData, setLeadData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const fileInputRef = useRef(null);

  const fetchLeadEntries = async () => {
    try {
      const res = await fetch("${import.meta.env.VITE_API_BASE_URL}/api/leads");
      if (res.ok) {
        const data = await res.json();
        setLeadData(data);
      } else {
        console.error("❌ Failed to fetch leads");
      }
    } catch (error) {
      console.error("❌ Error fetching leads:", error);
    }
  };

  useEffect(() => {
    fetchLeadEntries();
  }, []);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const sortedLeads = [...leadData].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aVal = a[sortConfig.key]?.toLowerCase?.() || "";
    const bVal = b[sortConfig.key]?.toLowerCase?.() || "";

    if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const filteredLeads = sortedLeads.filter((lead) =>
    Object.values(lead).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleAddLeadsClick = () => setIsModalOpen(true);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFile(null);
    setIsUploading(false);
    setUploadPercentage(0);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.name.endsWith(".csv")) {
      setFile(selectedFile);
    } else {
      alert("Please select a valid .csv file");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.name.endsWith(".csv")) {
      setFile(droppedFile);
    } else {
      alert("Please upload a CSV file.");
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file to upload.");
    setIsUploading(true);
    setUploadPercentage(0);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "${import.meta.env.VITE_API_BASE_URL}/api/leads/upload", true);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          setUploadPercentage(percent);
        }
      };

      xhr.onload = () => {
        setIsUploading(false);
        if (xhr.status === 200) {
          fetchLeadEntries();
          setShowConfirmation(true);
        } else {
          const error = JSON.parse(xhr.responseText);
          alert(error.message || "Error uploading CSV.");
        }
      };

      xhr.onerror = () => {
        setIsUploading(false);
        alert("Something went wrong during upload.");
      };

      xhr.send(formData);
    } catch (error) {
      console.error("❌ Upload error:", error);
      alert("Something went wrong during upload.");
      setIsUploading(false);
    }
  };

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
        <div className={styles.pageInner}>
          <div className={styles.searchRow}>
            <div className={styles.searchBar}>
              <FiSearch />
              <input
                type="text"
                placeholder="Search here..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className={styles.addLeadsBtn} onClick={handleAddLeadsClick}>
              Add Leads
            </button>
          </div>

          <p className={styles.breadcrumb}>Home &gt; Leads</p>

          <div className={styles.tableWrapper}>
            <table className={styles.leadsTable}>
              <thead>
                <tr>
                  <th>No.</th>
                  <th onClick={() => handleSort("name")} style={{ cursor: "pointer" }}>
                    Name {sortConfig.key === "name" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
                  </th>
                  <th onClick={() => handleSort("date")} style={{ cursor: "pointer" }}>
                    Date {sortConfig.key === "date" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
                  </th>
                  <th>No. of Leads</th>
                  <th>Assigned Leads</th>
                  <th>Unassigned Leads</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.length > 0 ? (
                  filteredLeads.map((lead, i) => (
                    <tr key={lead._id || i}>
                      <td>{i + 1}</td>
                      <td>{lead.name || "N/A"}</td>
                      <td>{lead.date || "N/A"}</td>
                      <td>0</td>
                      <td>0</td>
                      <td>0</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className={styles.noResults}>No leads found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Upload Modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Upload CSV</h3>
              <button onClick={handleCloseModal} className={styles.modalCloseBtn}>
                <IoCloseOutline size={22} />
              </button>
            </div>

            <div
              className={styles.dropZone}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {!isUploading ? (
                <div className={styles.dropArea}>
                  <MdOutlineFileUpload size={48} />
                  <p className={styles.dragText}>Drag & drop your CSV here</p>
                  <p className={styles.orText}>OR</p>
                  <button className={styles.browseFilesBtn} onClick={handleBrowseClick}>
                    Browse files
                  </button>
                  <input
                    type="file"
                    accept=".csv"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                  {file && (
                    <p className={styles.selectedFile}>
                      {file.name} - {(file.size / 1024).toFixed(2)} KB
                    </p>
                  )}
                </div>
              ) : (
                <div className={styles.uploadingStateCircle}>
                  <div className={styles.loaderWrapper}>
                    <div className={styles.loaderCircle}></div>
                    <div className={styles.percentageOverlay}>
                      {uploadPercentage}%
                    </div>
                  </div>
                  <p className={styles.verifyingText}>Uploading...</p>
                </div>
              )}
            </div>

            {!isUploading && (
              <div className={styles.modalActions}>
                <button onClick={handleCloseModal} className={styles.modalCancelBtn}>
                  Cancel
                </button>
                <button onClick={handleUpload} className={styles.modalNextBtn} disabled={!file}>
                  Upload
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.modalContent} ${styles.confirmationModal}`}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Confirm Distribution</h3>
              <button onClick={() => setShowConfirmation(false)} className={styles.modalCloseBtn}>
                <IoCloseOutline size={22} />
              </button>
            </div>
            <p className={styles.modalDescription}>
              All the Leads will be distributed among other employees equally.
              <br />
              Do you want to delete this employee?
            </p>
            <div className={styles.modalActions}>
              <button
                className={styles.modalCancelBtn}
                onClick={() => {
                  setShowConfirmation(false);
                  handleCloseModal();
                }}
              >
                Cancel
              </button>
              <button
                className={styles.modalNextBtn}
                onClick={() => {
                  setShowConfirmation(false);
                  handleCloseModal();
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
