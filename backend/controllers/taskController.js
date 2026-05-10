const Task = require('../models/Task');

// Create a new task
exports.createTask = async (req, res) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json({ success: true, data: task });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get all tasks
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate('assignedTo', 'name email');
    res.status(200).json({ success: true, data: tasks });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};