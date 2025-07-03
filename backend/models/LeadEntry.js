const mongoose = require('mongoose');

const leadEntrySchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: String,
  email: String,
  date: String,
  language: String,
  location: String,
  type: { type: String, enum: ['hot', 'warm', 'cold'], default: 'warm' }, // ✅ Add this
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', default: null },
  status: { type: String, enum: ['unassigned', 'assigned', 'closed'], default: 'unassigned' },
  uploadedBy: String
}, { timestamps: true });

module.exports = mongoose.model('LeadEntry', leadEntrySchema);
