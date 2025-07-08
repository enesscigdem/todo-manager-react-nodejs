// src/config/db.js
const sql = require('mssql');

let pool;

module.exports = async function connect() {
  // Local geliştirme için .env okuma; prod’da Vercel’in ENV’ini kullanır
  require('dotenv').config();

  const connectionString = process.env.MSSQL_CONNECTION_STRING;
  if (!connectionString) {
    console.error('MSSQL_CONNECTION_STRING environment variable is not set.');
    process.exit(1);
  }

  try {
    pool = await sql.connect(connectionString);
    console.log('MSSQL connected');

    // Basit migration: Users tablosu
    await pool.request().query(`
      IF NOT EXISTS (
        SELECT * FROM sys.objects
        WHERE object_id = OBJECT_ID(N'Users') AND type in (N'U')
      )
      CREATE TABLE Users (
        id INT IDENTITY(1,1) PRIMARY KEY,
        email NVARCHAR(255) NOT NULL UNIQUE,
        password NVARCHAR(255) NOT NULL
      );
    `);

    // Basit migration: Tasks tablosu
    await pool.request().query(`
      IF NOT EXISTS (
        SELECT * FROM sys.objects
        WHERE object_id = OBJECT_ID(N'Tasks') AND type in (N'U')
      )
      CREATE TABLE Tasks (
        id INT IDENTITY(1,1) PRIMARY KEY,
        userId INT NOT NULL,
        title NVARCHAR(255) NOT NULL,
        description NVARCHAR(MAX),
        priority NVARCHAR(10) DEFAULT 'Low',
        completed BIT DEFAULT 0,
        FOREIGN KEY (userId) REFERENCES Users(id)
      );
    `);

    // userId sütunu eksikse ekle
    await pool.request().query(`
      IF COL_LENGTH('Tasks','userId') IS NULL
      BEGIN
        ALTER TABLE Tasks ADD userId INT NOT NULL DEFAULT 0;
      END;
    `);

  } catch (err) {
    console.error('MSSQL connection error:', err.message);
    process.exit(1);
  }
};

module.exports.getPool = () => pool;
