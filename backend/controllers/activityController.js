// @desc    Get all activity logs (Admin view)
exports.getAllActivities = async (req, res) => {
  try {
    const activities = await Activity.find()
      .populate("employee", "firstName lastName email employeeId")
      .populate("lead", "name email")
      .sort({ createdAt: -1 }); // ✅ FIXED HERE

    res.status(200).json(activities);
  } catch (error) {
    console.error("❌ Error fetching all activities:", error);
    res.status(500).json({ message: "Server error while fetching activities" });
  }
};

// @desc    Get activity logs for a specific employee
exports.getEmployeeActivities = async (req, res) => {
  const employeeId = req.params.id;

  try {
    const activities = await Activity.find({ employee: employeeId })
      .populate("employee", "firstName lastName email employeeId")
      .populate("lead", "name")
      .sort({ createdAt: -1 })
      .limit(10);// ✅ FIXED HERE

    res.status(200).json(activities);
  } catch (error) {
    console.error(`❌ Error fetching activities for employee ${employeeId}:`, error);
    res.status(500).json({ message: "Server error while fetching employee activities" });
  }
};
