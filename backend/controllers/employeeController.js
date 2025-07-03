const Employee = require("../models/employee");
const LeadEntry = require("../models/leadEntry");

// 🚀 Get employee stats (assigned & closed leads)
exports.getEmployeeStats = async (req, res) => {
  try {
    const employees = await Employee.find().lean();

    const leadStats = await LeadEntry.aggregate([
      {
        $group: {
          _id: "$assignedTo",
          assigned: { $sum: 1 },
          closed: {
            $sum: { $cond: [{ $eq: ["$status", "closed"] }, 1, 0] }
          }
        }
      }
    ]);

    const statsMap = {};
    leadStats.forEach(stat => {
      if (stat._id) {
        statsMap[stat._id.toString()] = {
          assigned: stat.assigned,
          closed: stat.closed
        };
      }
    });

    const enrichedEmployees = employees.map(emp => {
      const stats = statsMap[emp._id.toString()] || { assigned: 0, closed: 0 };
      return {
        ...emp,
        assignedLeads: stats.assigned,
        closedLeads: stats.closed
      };
    });

    res.status(200).json(enrichedEmployees);
  } catch (err) {
    console.error("❌ Error fetching employee stats:", err);
    res.status(500).json({ message: "Failed to fetch employee statistics." });
  }
};

// ✅ Login (using email + lastName as password)
exports.loginEmployee = async (req, res) => {
  try {
    const { email, password } = req.body;

    const employee = await Employee.findOne({ email });
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    if (!employee.lastName || employee.lastName.toLowerCase() !== password.toLowerCase()) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    employee.status = "Active";
    await employee.save();

    res.status(200).json({ message: "Logged in", employee });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ message: "Login failed" });
  }
};

// 🚀 Logout (sets status to Inactive)
exports.logoutEmployee = async (req, res) => {
  try {
    const { email } = req.body;
    const employee = await Employee.findOneAndUpdate(
      { email },
      { status: "Inactive" },
      { new: true }
    );

    if (!employee) return res.status(404).json({ message: "Employee not found" });

    res.status(200).json({ message: "Logged out", employee });
  } catch (err) {
    console.error("❌ Logout error:", err);
    res.status(500).json({ message: "Logout failed" });
  }
};

// 🚀 Manually update status
exports.updateEmployeeStatus = async (req, res) => {
  try {
    const { employeeId, status } = req.body;

    const employee = await Employee.findByIdAndUpdate(
      employeeId, // ✅ fix here
      { status },
      { new: true }
    );

    if (!employee) return res.status(404).json({ message: "Employee not found" });

    res.status(200).json({ message: "Status updated", employee });
  } catch (err) {
    console.error("❌ Status update error:", err);
    res.status(500).json({ message: "Failed to update status" });
  }
};

// ✅ Set inactive manually via URL param
exports.setInactive = async (req, res) => {
  try {
    const { id } = req.params;
    await Employee.findByIdAndUpdate(id, { status: "Inactive" });
    res.status(200).json({ message: "Status set to Inactive" });
  } catch (err) {
    console.error("❌ Set Inactive Error:", err);
    res.status(500).json({ message: "Failed to set status" });
  }
};
