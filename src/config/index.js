require('dotenv').config()
const loadDB = require('./db')

module.exports = async () => {
  const { MSSQL_CONNECTION_STRING } = process.env
  if (!MSSQL_CONNECTION_STRING) {
    throw new Error('MSSQL_CONNECTION_STRING not set')
  }
  await loadDB(MSSQL_CONNECTION_STRING)
}
