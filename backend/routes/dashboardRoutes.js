const express = require("express");
const router = express.Router();

// ✅ Import the correct controller
const dashboardController = require("../controllers/dashboardController");

// ✅ Use the actual function from the controller
router.get("/stats", dashboardController.getDashboardStats);

module.exports = router;
