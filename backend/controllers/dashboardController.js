const Task = require('../models/Task');
const Project = require('../models/Project');

const getDashboardStats = async (req, res) => {
  try {
    let taskQuery = {};
    
    if (req.user.role !== 'Admin') {
      taskQuery.assigned_to = req.user._id;
    }
    
    const tasks = await Task.find(taskQuery);
    
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'Completed').length;
    const pending = total - completed;
    
    const now = new Date();
    const overdue = tasks.filter(t => t.status !== 'Completed' && t.due_date && new Date(t.due_date) < now).length;
    
    // Fetch recent activity (last 5 updated tasks)
    const recentActivity = await Task.find(taskQuery)
      .sort({ updatedAt: -1 })
      .limit(5)
      .populate('project_id', 'name')
      .populate('assigned_to', 'name');

    res.json({
      total,
      completed,
      pending,
      overdue,
      recentActivity
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboardStats };
