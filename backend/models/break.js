const mongoose = require("mongoose");

const breakSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    date: {
      type: String,
      required: true, // format: "YYYY-MM-DD"
    },
    start: {
      type: String, // e.g., "05:15 PM"
      required: true,
    },
    end: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Break", breakSchema);
