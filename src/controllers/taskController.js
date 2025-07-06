const sql = require('mssql')
const { getPool } = require('../config/db')
const Joi = require('joi')

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
    const { filter = 'all', search = '' } = req.query
    const pool = getPool()
    let query = 'SELECT * FROM Tasks WHERE owner = @owner'
    if (filter === 'active') query += ' AND completed = 0'
    if (filter === 'completed') query += ' AND completed = 1'
    if (search) query += ' AND (title LIKE @search OR description LIKE @search)'
    const request = pool.request().input('owner', sql.Int, req.userId)
    if (search) request.input('search', sql.NVarChar, `%${search}%`)
    const { recordset } = await request.query(query + ' ORDER BY id DESC')
    res.json(recordset)
  } catch (err) {
    next(err);
  }
};

// Create a new task
exports.create = async (req, res, next) => {
  try {
    const { error, value } = createSchema.validate(req.body)
    if (error) return res.status(400).json({ error: error.message })

    const pool = getPool()
    const result = await pool
      .request()
      .input('title', sql.NVarChar, value.title)
      .input('description', sql.NVarChar, value.description || null)
      .input('priority', sql.NVarChar, value.priority || 'Low')
      .input('owner', sql.Int, req.userId)
      .query(
        'INSERT INTO Tasks (title, description, priority, owner) OUTPUT INSERTED.* VALUES (@title, @description, @priority, @owner)'
      )
    res.status(201).json(result.recordset[0])
  } catch (err) {
    next(err);
  }
};

// Update a task
exports.update = async (req, res, next) => {
  try {
    const { error, value } = updateSchema.validate(req.body)
    if (error) return res.status(400).json({ error: error.message })

    const pool = getPool()
    const { recordset } = await pool
      .request()
      .input('id', sql.Int, req.params.id)
      .input('owner', sql.Int, req.userId)
      .query('SELECT * FROM Tasks WHERE id=@id AND owner=@owner')
    if (recordset.length === 0) return res.status(404).json({ error: 'Task not found' })

    const fields = []
    const request = pool.request().input('id', sql.Int, req.params.id).input('owner', sql.Int, req.userId)
    if (value.title !== undefined) { request.input('title', sql.NVarChar, value.title); fields.push('title=@title') }
    if (value.description !== undefined) { request.input('description', sql.NVarChar, value.description); fields.push('description=@description') }
    if (value.priority !== undefined) { request.input('priority', sql.NVarChar, value.priority); fields.push('priority=@priority') }
    if (value.completed !== undefined) { request.input('completed', sql.Bit, value.completed); fields.push('completed=@completed') }
    if (fields.length > 0) {
      await request.query(`UPDATE Tasks SET ${fields.join(', ')} WHERE id=@id AND owner=@owner`)
    }

    const { recordset: updated } = await pool
      .request()
      .input('id', sql.Int, req.params.id)
      .input('owner', sql.Int, req.userId)
      .query('SELECT * FROM Tasks WHERE id=@id AND owner=@owner')
    res.json(updated[0])
  } catch (err) {
    next(err);
  }
};

// Toggle completed flag
exports.toggle = async (req, res, next) => {
  try {
    const pool = getPool()
    const result = await pool
      .request()
      .input('id', sql.Int, req.params.id)
      .input('owner', sql.Int, req.userId)
      .query(
        'UPDATE Tasks SET completed = CASE WHEN completed = 1 THEN 0 ELSE 1 END OUTPUT INSERTED.* WHERE id=@id AND owner=@owner'
      )
    if (result.recordset.length === 0) return res.status(404).json({ error: 'Task not found' })
    res.json(result.recordset[0])
  } catch (err) {
    next(err);
  }
};

// Delete a task
exports.remove = async (req, res, next) => {
  try {
    const pool = getPool()
    const result = await pool
      .request()
      .input('id', sql.Int, req.params.id)
      .input('owner', sql.Int, req.userId)
      .query('DELETE FROM Tasks WHERE id=@id AND owner=@owner')
    if (result.rowsAffected[0] === 0) return res.status(404).json({ error: 'Task not found' })
    res.json({ message: 'Task deleted' })
  } catch (err) {
    next(err);
  }
};
