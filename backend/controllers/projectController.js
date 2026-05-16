const Project = require('../models/Project');
const User = require('../models/User');

const getProjects = async (req, res) => {
  try {
    let projects;
    if (req.user.role === 'Admin') {
      projects = await Project.find().populate('members', 'name email').populate('created_by', 'name');
    } else {
      projects = await Project.find({ members: req.user._id }).populate('members', 'name email').populate('created_by', 'name');
    }
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createProject = async (req, res) => {
  const { name, description } = req.body;
  try {
    const project = await Project.create({
      name,
      description,
      created_by: req.user._id,
      members: [req.user._id] // creator is automatically a member
    });
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addMember = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  
  try {
    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    if (project.members.includes(userId)) {
      return res.status(400).json({ message: 'User already a member' });
    }
    
    project.members.push(userId);
    await project.save();
    
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProjects, createProject, addMember };
