require('dotenv').config();
const loadDB = require('./db');

module.exports = async () => {
  const { MONGODB_URI } = process.env;
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI not set');
  }
  await loadDB(MONGODB_URI);
};
