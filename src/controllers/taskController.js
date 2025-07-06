const Task = require('../models/Task');
const Joi = require('joi');

const createSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().allow(''),
  priority: Joi.string().valid('Low', 'Medium', 'High'),
});

const updateSchema = Joi.object({
  title: Joi.string(),
  description: Joi.string().allow(''),
  priority: Joi.string().valid('Low', 'Medium', 'High'),
  completed: Joi.boolean(),
}).min(1);

// List tasks with optional filter/search
exports.list = async (req, res, next) => {
  try {
    const { filter = 'all', search = '' } = req.query;
    const query = { owner: req.userId };
    if (filter === 'active') query.completed = false;
    if (filter === 'completed') query.completed = true;
    if (search) query.$or = [
      { title: new RegExp(search, 'i') },
      { description: new RegExp(search, 'i') },
    ];
    const tasks = await Task.find(query).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    next(err);
  }
};

// Create a new task
exports.create = async (req, res, next) => {
  try {
    const { error, value } = createSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });
    const task = await Task.create({ ...value, owner: req.userId });
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
};

// Update a task
exports.update = async (req, res, next) => {
  try {
    const { error, value } = updateSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });

    const task = await Task.findOne({ _id: req.params.id, owner: req.userId });
    if (!task) return res.status(404).json({ error: 'Task not found' });

    Object.assign(task, value);
    await task.save();
    res.json(task);
  } catch (err) {
    next(err);
  }
};

// Toggle completed flag
exports.toggle = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.userId });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    task.completed = !task.completed;
    await task.save();
    res.json(task);
  } catch (err) {
    next(err);
  }
};

// Delete a task
exports.remove = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.userId });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    next(err);
  }
};
