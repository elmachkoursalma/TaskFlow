// taskRoutes.js
const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middleware/authMiddleware');

//protect all task route globally with authentification middleware
router.use(authMiddleware);

// Routes for task management
router.post('/', authMiddleware, taskController.createTask);
router.get('/project/:projectId', authMiddleware, taskController.getProjectTasks);
router.patch('/:id/status', authMiddleware, taskController.updateTaskStatus);
router.patch('/:id/assign', authMiddleware, taskController.assignTask);
router.put('/:id', authMiddleware, taskController.updateTask);
router.delete('/:id', authMiddleware, taskController.deleteTask);

module.exports = router;