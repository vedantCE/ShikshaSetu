/**
 * Migration script — run once to add image_url to student
 * and create student_progress table.
 *
 * Usage:  node scripts/migrate.js
 */
const pool = require('../config/db');

async function migrate() {
  console.log('Running migrations...');

  // 1. Add image_url column to student table (idempotent)
  await pool.query(`
    ALTER TABLE student
    ADD COLUMN IF NOT EXISTS image_url TEXT;
  `);
  console.log('✅  student.image_url column ensured');

  // 2. Create student_progress table (idempotent)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS student_progress (
      id SERIAL PRIMARY KEY,
      student_id INTEGER REFERENCES student(student_id) ON DELETE CASCADE,
      activity_type VARCHAR(50) NOT NULL,
      score INTEGER DEFAULT 0,
      stars INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log('✅  student_progress table ensured');

  console.log('Migration complete!');
  process.exit(0);
}

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
