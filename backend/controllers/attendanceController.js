const Attendance = require("../models/attendance");
const Break = require("../models/break"); // ✅ FIXED: Import the Break model

// ✅ Check-in
exports.checkIn = async (req, res) => {
  try {
    const { employeeId, date, time } = req.body;

    let attendance = await Attendance.findOne({ employeeId, date });

    if (!attendance) {
      attendance = new Attendance({ employeeId, date, checkIn: time });
    } else {
      attendance.checkIn = time;
    }

    await attendance.save();
    res.status(200).json(attendance);
  } catch (err) {
    console.error("❌ Check-in error:", err);
    res.status(500).json({ message: "Check-in failed" });
  }
};

// ✅ Check-out
exports.checkOut = async (req, res) => {
  try {
    const { employeeId, date, time } = req.body;

    const attendance = await Attendance.findOne({ employeeId, date });
    if (!attendance) {
      return res.status(404).json({ message: "Attendance not found" });
    }

    attendance.checkOut = time;
    await attendance.save();

    res.status(200).json(attendance);
  } catch (err) {
    console.error("❌ Check-out error:", err);
    res.status(500).json({ message: "Check-out failed" });
  }
};

// ✅ Today's Attendance
exports.getTodayAttendance = async (req, res) => {
  try {
    const { employeeId, date } = req.query;

    const attendance = await Attendance.findOne({ employeeId, date });
    if (!attendance) return res.status(404).json({ message: "No attendance found" });

    res.status(200).json(attendance);
  } catch (err) {
    console.error("❌ Error getting attendance:", err);
    res.status(500).json({ message: "Failed to fetch attendance" });
  }
};

// ✅ Start/End Break
exports.toggleBreak = async (req, res) => {
  try {
    const { employeeId, date, isStarting } = req.body;

    if (isStarting) {
      // Start new break
      const newBreak = new Break({
        employeeId,
        date,
        start: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      });

      await newBreak.save();
      return res.status(200).json({ message: "Break started", break: newBreak });
    } else {
      // End the latest break
      const latestBreak = await Break.findOne({ employeeId, date, end: null }).sort({ createdAt: -1 });
      if (!latestBreak) {
        return res.status(404).json({ message: "No active break found" });
      }

      latestBreak.end = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      await latestBreak.save();
      return res.status(200).json({ message: "Break ended", break: latestBreak });
    }
  } catch (err) {
    console.error("❌ Toggle break error:", err);
    res.status(500).json({ message: "Failed to toggle break" });
  }
};

// ✅ Get Breaks History
exports.getBreaks = async (req, res) => {
  try {
    const { employeeId } = req.query;

    const breaks = await Break.find({ employeeId }).sort({ createdAt: -1 });
    res.status(200).json(breaks);
  } catch (err) {
    console.error("❌ Break fetch error:", err);
    res.status(500).json({ message: "Failed to fetch breaks" });
  }
};
