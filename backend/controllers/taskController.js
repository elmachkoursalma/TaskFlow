const Task = require('../models/Task');
const { logActivity } = require('./activityController');
// Create a new task
exports.createTask = async (req, res) => {
  try {
    const task = await Task.create({
      ...req.body,
       assignedTo: req.user.id
    });
    await logActivity('task_created', task.project, req.user.id, { taskTitle: task.title });
    res.status(201).json({ success: true, data: task });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
// Get tasks for a specific project
exports.getProjectTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ project: req.params.projectId })
      .populate('assignedTo', 'fullName email');
    res.status(200).json({ success: true, data: tasks });
  } catch (error) {

    res.status(400).json({

      success: false,
      message: error.message

    });

  }
};
// Update task status
exports.updateTaskStatus = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Tâche introuvable' });

    const oldStatus = task.status; 

    task.status = req.body.status;
    await task.save();

    await logActivity('status_changed', task.project, req.user.id, {
      taskTitle: task.title,
      oldStatus,
      newStatus: req.body.status
    });
    res.status(200).json({ success: true, data: task });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
// Update task details
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    res.status(200).json({ success: true, data: task });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id); 
    if (!task) return res.status(404).json({ success: false, message: 'Tâche introuvable' });

    await logActivity('task_deleted', task.project, req.user.id, { taskTitle: task.title }); 
    await task.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
// Assign a task to a user
exports.assignTask = async (req, res) => {
  try {
    const { userId } = req.body;

    const task =await Task.findByIdAndUpdate(
      req.params.id,
      { assignedTo: userId },
      { new: true, runValidators: true }
    
    ).populate('assignedTo', 'name email');

    if (!task) {
      return res.status(404).json({success: false, message: 'Task not found' });
  }
  res.status(200).json({ success: true,data: task });
} catch (error) {
  res.status(400).json({ success: false, message: error.message });
}
};