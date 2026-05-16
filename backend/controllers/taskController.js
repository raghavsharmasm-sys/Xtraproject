const Task = require('../models/Task');
const Project = require('../models/Project');

const getTasks = async (req, res) => {
  const { projectId } = req.query;
  try {
    let query = {};
    if (projectId) {
      query.project_id = projectId;
      // Need to verify user is a member of this project
      const project = await Project.findById(projectId);
      if (!project) return res.status(404).json({ message: 'Project not found' });
      if (req.user.role !== 'Admin' && !project.members.includes(req.user._id)) {
        return res.status(403).json({ message: 'Not authorized for this project' });
      }
    } else {
      if (req.user.role !== 'Admin') {
        query.assigned_to = req.user._id;
      }
    }
    
    const tasks = await Task.find(query).populate('assigned_to', 'name').populate('project_id', 'name');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createTask = async (req, res) => {
  const { title, description, status, due_date, project_id, assigned_to } = req.body;
  try {
    const task = await Task.create({
      title,
      description,
      status: status || 'Todo',
      due_date,
      project_id,
      assigned_to
    });
    const populatedTask = await Task.findById(task._id).populate('assigned_to', 'name').populate('project_id', 'name');
    res.status(201).json(populatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, status, due_date, assigned_to } = req.body;
  
  try {
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    
    if (req.user.role === 'Admin') {
      // Admin can update anything
      task.title = title || task.title;
      task.description = description !== undefined ? description : task.description;
      task.status = status || task.status;
      task.due_date = due_date || task.due_date;
      task.assigned_to = assigned_to || task.assigned_to;
    } else {
      // Member can only update status if assigned
      if (task.assigned_to && task.assigned_to.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to update this task' });
      }
      if (status) task.status = status;
    }
    
    await task.save();
    const updatedTask = await Task.findById(id).populate('assigned_to', 'name').populate('project_id', 'name');
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getTasks, createTask, updateTask };
