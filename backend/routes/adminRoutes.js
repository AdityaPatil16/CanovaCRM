const express = require("express");
const router = express.Router();
const admin = require("../models/admin");

// GET admin details
router.get("/", async (req, res) => {
  try {
    const admin = await Admin.findOne(); // Only one admin
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    res.status(200).json(admin);
  } catch (err) {
    console.error("❌ Error fetching admin:", err);
    res.status(500).json({ message: "Failed to fetch admin details" });
  }
});

// PUT to update
router.put("/update", async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;

    const updatedAdmin = await Admin.findOneAndUpdate(
      {}, // Only one admin
      { firstName, lastName, email },
      { new: true, runValidators: true }
    );

    if (!updatedAdmin) return res.status(404).json({ message: "Admin not found" });

    res.status(200).json(updatedAdmin);
  } catch (err) {
    console.error("❌ Error updating admin:", err);
    res.status(500).json({ message: "Failed to update admin" });
  }
});

module.exports = router;
