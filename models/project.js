const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dueDate: { type: Date, required: true },
  course: { type: String , required: true },  // Reference to the Course model
  status: { type: String, default: "In Progress" },
});

module.exports = mongoose.model("Project", projectSchema);