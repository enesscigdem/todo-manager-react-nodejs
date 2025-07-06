const express = require('express');
const cors = require('cors');
const authRoutes = require('./src/routes/auth');
const taskRoutes = require('./src/routes/tasks');
const authMiddleware = require('./src/middleware/auth');
const errorHandler = require('./src/middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/tasks', authMiddleware, taskRoutes);

app.use(errorHandler);

module.exports = app;
