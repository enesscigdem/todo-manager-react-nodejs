// src/config/index.js
const connectDB = require('./db');

module.exports = async () => {
  await connectDB();
};
