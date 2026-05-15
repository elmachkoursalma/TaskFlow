const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  getProjects,
  createProject,
  updateProject,
  deleteProject
} = require('../controllers/projectController');

router.use(authMiddleware);

router.get('/',     getProjects);
router.post('/',    createProject);
router.put('/:id',  updateProject);
router.delete('/:id', deleteProject);

module.exports = router;