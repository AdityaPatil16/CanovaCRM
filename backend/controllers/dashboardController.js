const Employee = require("../models/Employee");
const LeadEntry = require("../models/LeadEntry");

exports.getDashboardStats = async (req, res) => {
  try {
    const totalLeads = await LeadEntry.countDocuments();
    const unassignedLeads = await LeadEntry.countDocuments({ status: "unassigned" });

    // This week's assigned leads
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    const assignedThisWeek = await LeadEntry.countDocuments({
      createdAt: { $gte: startOfWeek },
      status: "assigned"
    });

    // Conversion rate calculation
    const assignedLeads = await LeadEntry.countDocuments({ status: "assigned" });
    const closedLeads = await LeadEntry.countDocuments({ status: "closed" });
    const conversionRate =
      assignedLeads === 0 ? "0%" : `${Math.round((closedLeads / assignedLeads) * 100)}%`;

    // Fetch all employees
    const allEmployees = await Employee.find().lean();

    // Fetch lead stats per employee
    const leadSummary = await LeadEntry.aggregate([
      {
        $group: {
          _id: "$assignedTo",
          assigned: { $sum: 1 },
          closed: {
            $sum: {
              $cond: [{ $eq: ["$status", "closed"] }, 1, 0]
            }
          }
        }
      }
    ]);

    const leadMap = {};
    leadSummary.forEach(entry => {
      if (entry._id) {
        leadMap[entry._id.toString()] = entry;
      }
    });

    // Build employee data for frontend
    const employees = allEmployees.map(emp => {
      const leadStats = leadMap[emp._id.toString()] || { assigned: 0, closed: 0 };

      return {
        name: `${emp.firstName} ${emp.lastName}`,
        email: emp.email,
        employeeId: emp.employeeId,
        initials: (emp.firstName?.[0] || "") + (emp.lastName?.[0] || ""),
        assigned: leadStats.assigned,
        closed: leadStats.closed,
        status: emp.status || "Inactive"
      };
    });

    // Count active employees by status field
    const activeSalespeople = employees.filter(emp => emp.status === "Active").length;

    // Send response
    res.status(200).json({
      unassignedLeads,
      assignedThisWeek,
      activeSalespeople,
      conversionRate,
      employees
    });
  } catch (error) {
    console.error("❌ Error fetching dashboard stats:", error);
    res.status(500).json({ message: "Failed to fetch dashboard stats." });
  }
};
