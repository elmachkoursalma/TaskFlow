const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getActivities } = require('../controllers/activityController');

// GET /api/projects/:id/activities
router.get('/:id/activities', authMiddleware, getActivities);

module.exports = router;