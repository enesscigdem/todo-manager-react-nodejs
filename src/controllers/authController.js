const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const sql = require('mssql')
const { getPool } = require('../config/db')
const Joi = require('joi')

// Schema for user registration/login
const authSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

// Register a new user and return JWT
exports.register = async (req, res, next) => {
  try {
    const { error, value } = authSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });

    const pool = getPool()
    const { recordset: existing } = await pool
      .request()
      .input('email', sql.NVarChar, value.email)
      .query('SELECT id FROM Users WHERE email = @email')
    if (existing.length > 0) return res.status(400).json({ error: 'Email already taken' })

    const hashed = await bcrypt.hash(value.password, 10)
    const result = await pool
      .request()
      .input('email', sql.NVarChar, value.email)
      .input('password', sql.NVarChar, hashed)
      .query('INSERT INTO Users (email, password) OUTPUT INSERTED.id VALUES (@email, @password)')
    const userId = result.recordset[0].id

    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({ token });
  } catch (err) {
    next(err);
  }
};

// Login user and return JWT
exports.login = async (req, res, next) => {
  try {
    const { error, value } = authSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });

    const pool = getPool()
    const { recordset } = await pool
      .request()
      .input('email', sql.NVarChar, value.email)
      .query('SELECT * FROM Users WHERE email = @email')
    if (recordset.length === 0) return res.status(401).json({ error: 'Invalid credentials' })
    const user = recordset[0]

    const valid = await bcrypt.compare(value.password, user.password)
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' })

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({ token });
  } catch (err) {
    next(err);
  }
};

// Return current user info
exports.profile = async (req, res, next) => {
  try {
    const pool = getPool();
    const { recordset } = await pool
      .request()
      .input('id', sql.Int, req.userId)
      .query('SELECT id, email FROM Users WHERE id=@id');
    if (recordset.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(recordset[0]);
  } catch (err) {
    next(err);
  }
};

// Update current user email or password
exports.updateProfile = async (req, res, next) => {
  try {
    const schema = Joi.object({
      email: Joi.string().email(),
      password: Joi.string().min(6),
    }).min(1);
    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });

    const pool = getPool();
    const fields = [];
    const request = pool.request().input('id', sql.Int, req.userId);
    if (value.email) {
      request.input('email', sql.NVarChar, value.email);
      fields.push('email=@email');
    }
    if (value.password) {
      const hashed = await bcrypt.hash(value.password, 10);
      request.input('password', sql.NVarChar, hashed);
      fields.push('password=@password');
    }
    if (fields.length > 0) {
      await request.query(`UPDATE Users SET ${fields.join(', ')} WHERE id=@id`);
    }
    const { recordset } = await pool
      .request()
      .input('id', sql.Int, req.userId)
      .query('SELECT id, email FROM Users WHERE id=@id');
    res.json(recordset[0]);
  } catch (err) {
    next(err);
  }
};
