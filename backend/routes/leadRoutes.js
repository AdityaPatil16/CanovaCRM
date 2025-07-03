const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const leadController = require("../controllers/leadController");
const LeadEntry = require("../models/leadEntry");

// ✅ Ensure 'uploads' folder exists
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// 🔧 Multer Setup for CSV Upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + Date.now() + ext);
  },
});
const upload = multer({ storage });

// ✅ Get all leads
router.get("/", leadController.getAllLeads);

// ✅ Upload CSV file
router.post("/upload", upload.single("file"), leadController.uploadLeads);

// ✅ Get leads assigned to a specific employee
router.get("/employee/:id", async (req, res) => {
  try {
    const leads = await LeadEntry.find({ assignedTo: req.params.id });
    res.json(leads);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch leads." });
  }
});

// ✅ Get scheduled leads by path param (original)
router.get("/scheduled/:employeeId", leadController.getScheduledLeads);

// ✅ Optional: Get scheduled leads using query param (?employeeId=xxx)
router.get("/scheduled", async (req, res) => {
  try {
    const employeeId = req.query.employeeId;
    if (!employeeId) {
      return res.status(400).json({ error: "Missing employeeId" });
    }

    const leads = await LeadEntry.find({
      assignedTo: employeeId,
      status: "scheduled", // make sure your DB uses this status
    });

    res.json(leads);
  } catch (err) {
    console.error("Error fetching scheduled leads:", err);
    res.status(500).json({ error: "Failed to fetch scheduled leads." });
  }
});

// ✅ Update lead info
router.put("/update/:id", leadController.updateLeadInfo);

module.exports = router;
