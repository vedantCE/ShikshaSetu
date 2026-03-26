const { Pool } = require('pg');
require('dotenv').config();
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: true }   // secure in production
    : { rejectUnauthorized: false }  // relaxed for local dev only
});

module.exports = pool;
