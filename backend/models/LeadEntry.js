const mongoose = require('mongoose');

const leadEntrySchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  date: Date,
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
  },
  status: {
    type: String,
    enum: ["assigned", "Ongoing", "Closed"],
    default: "assigned",
  },
  type: {
    type: String,
    enum: ["Hot", "Warm", "Cold"],
    default: "Warm",
  },
  scheduledDate: String,
  scheduledTime: String,
}, { timestamps: true });

// ✅ Prevent the OverwriteModelError
module.exports = mongoose.models.LeadEntry || mongoose.model("LeadEntry", leadEntrySchema);
