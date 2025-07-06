const sql = require('mssql')

let pool

module.exports = async function connect(connectionString) {
  try {
    pool = await sql.connect(connectionString)
    console.log('MSSQL connected')

    // Run simple migrations to ensure tables exist
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'Users') AND type in (N'U'))
      CREATE TABLE Users (
        id INT IDENTITY(1,1) PRIMARY KEY,
        email NVARCHAR(255) NOT NULL UNIQUE,
        password NVARCHAR(255) NOT NULL
      )
    `)
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'Tasks') AND type in (N'U'))
      CREATE TABLE Tasks (
        id INT IDENTITY(1,1) PRIMARY KEY,
        title NVARCHAR(255) NOT NULL,
        description NVARCHAR(MAX),
        priority NVARCHAR(10) DEFAULT 'Low',
        completed BIT DEFAULT 0
      )
    `)
  } catch (err) {
    console.error('MSSQL connection error:', err.message)
    process.exit(1)
  }
}

module.exports.getPool = () => pool
