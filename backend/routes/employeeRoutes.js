const express = require("express");
const router = express.Router();
const Employee = require("../models/Employee");
const Counter = require("../models/counter");
const employeeController = require("../controllers/employeeController");

// ✅ Get all employees (raw)
router.get("/", async (req, res) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });
    res.status(200).json(employees);
  } catch (err) {
    console.error("❌ Error fetching employees:", err);
    res.status(500).json({ message: "Failed to fetch employees." });
  }
});

// ✅ Get stats with assigned/closed lead counts
router.get("/stats", employeeController.getEmployeeStats);

// ✅ Add new employee
router.post("/", async (req, res) => {
  try {
    const { firstName, lastName, email, location, language } = req.body;
    if (!firstName || !lastName || !email || !location || !language) {
      return res.status(400).json({ message: "All fields are required." });
    }

    let counter = await Counter.findOne({ name: "employeeId" });
    if (!counter) {
      counter = new Counter({ name: "employeeId", value: 1000 });
    }

    counter.value += 1;
    await counter.save();

    const newEmployee = new Employee({
      firstName,
      lastName,
      email,
      location,
      language,
      employeeId: `CON${counter.value}`,
    });

    const saved = await newEmployee.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("❌ Error saving employee:", err);
    res.status(500).json({ message: "Failed to save employee" });
  }
});

// ✅ Delete employee
router.delete("/:id", async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting employee:", err);
    res.status(500).json({ message: "Failed to delete employee" });
  }
});

// ✅ Update employee (for edit modal)
router.put("/:id", async (req, res) => {
  try {
    const updated = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (err) {
    console.error("❌ Error updating employee:", err);
    res.status(500).json({ message: "Failed to update employee" });
  }
});

// ✅ Login
router.post("/login", employeeController.loginEmployee);

// ✅ Logout
router.post("/logout", employeeController.logoutEmployee);

// ✅ Manually update status
router.post("/status", employeeController.updateEmployeeStatus);

// ✅ Automatically mark as Inactive (used on tab close)
router.put("/inactive/:id", employeeController.setInactive);

module.exports = router;
