// models/attendance.js
const mongoose = require("mongoose");

const breakSchema = new mongoose.Schema({
  start: {
    type: String,
    required: true,
  },
  end: {
    type: String,
    default: null,
  },
});

const attendanceSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    date: {
      type: String, // Format: "YYYY-MM-DD"
      required: true,
    },
    checkIn: {
      type: String, // Format: "HH:MM"
      default: null,
    },
    checkOut: {
      type: String, // Format: "HH:MM"
      default: null,
    },
    
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Prevent OverwriteModelError on hot reload
module.exports =
  mongoose.models.Attendance || mongoose.model("Attendance", attendanceSchema);
