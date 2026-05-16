const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  status: { type: String, enum: ['Todo', 'In Progress', 'Completed'], default: 'Todo' },
  due_date: { type: Date },
  project_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  assigned_to: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
