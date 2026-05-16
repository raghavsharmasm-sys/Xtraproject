const express = require('express');
const { getProjects, createProject, addMember } = require('../controllers/projectController');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/role');
const router = express.Router();

router.route('/')
  .get(protect, getProjects)
  .post(protect, admin, createProject);

router.post('/:id/members', protect, admin, addMember);

module.exports = router;
