const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName:  { type: String, required: true },
  email:     { type: String, required: true, unique: true }
}, { timestamps: true });

module.exports = mongoose.model("Admin", adminSchema);
