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

    const {
      status,
      priority,
      search,
      page = 1,
      limit = 5
    } = req.query;

    const query = {};

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter by priority
    if (priority) {
      query.priority = priority;
    }

    // Search by title
    if (search) {
      query.title = {
        $regex: search,
        $options: 'i'
      };
    }

    const skip = (page - 1) * limit;

    const tasks = await Task.find(query)

      .populate('assignedTo', 'name email')

      .skip(skip)

      .limit(parseInt(limit));

    const total = await Task.countDocuments(query);

    res.status(200).json({

      success: true,

      total,

      currentPage: parseInt(page),

      totalPages: Math.ceil(total / limit),

      data: tasks

    });

  } catch (error) {

    res.status(400).json({

      success: false,
      message: error.message

    });

  }

};