const express = require('express');
const router = express.Router();
const { createTask, getTasks } = require('../controllers/taskController');

router.route('/')
  .get(getTasks)
  .post(createTask);

module.exports = router;