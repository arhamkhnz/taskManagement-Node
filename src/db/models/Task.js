const mongoose = require('mongoose');
const Schema = mongoose.Schema

const TaskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  status: { type: String, default: 'In Progress' },
  parentId: { type: String, default: "N.A" }
}, { timestamps: true }
);

module.exports = mongoose.model('Task', TaskSchema);