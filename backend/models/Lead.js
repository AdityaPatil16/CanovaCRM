const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  date: {
    type: String,
  },
  totalLeads: {
    type: Number,
    default: 0,
  },
  assignedLeads: {
    type: Number,
    default: 0,
  },
  unassignedLeads: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

// ✅ Check if model already exists
module.exports = mongoose.models.Lead || mongoose.model('Lead', leadSchema);
