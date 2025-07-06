const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Joi = require('joi');

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

    const existing = await User.findOne({ email: value.email });
    if (existing) return res.status(400).json({ error: 'Email already taken' });

    const hashed = await bcrypt.hash(value.password, 10);
    const user = await User.create({ email: value.email, password: hashed });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
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

    const user = await User.findOne({ email: value.email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const valid = await bcrypt.compare(value.password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({ token });
  } catch (err) {
    next(err);
  }
};
