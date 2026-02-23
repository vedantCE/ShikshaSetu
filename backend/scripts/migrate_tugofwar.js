/**
 * Migration script — create tug_of_war_games table.
 *
 * Usage:  node scripts/migrate_tugofwar.js
 */
const pool = require('../config/db');

async function migrate() {
  console.log('Running Tug of War migration...');

  await pool.query(`
    CREATE TABLE IF NOT EXISTS tug_of_war_games (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL,
      difficulty VARCHAR(10) NOT NULL DEFAULT 'easy',
      team1_score INTEGER DEFAULT 0,
      team2_score INTEGER DEFAULT 0,
      winner VARCHAR(10),
      duration INTEGER,
      total_questions INTEGER DEFAULT 0,
      correct_team1 INTEGER DEFAULT 0,
      correct_team2 INTEGER DEFAULT 0,
      rope_position INTEGER DEFAULT 0,
      current_q_team1 TEXT,
      current_a_team1 INTEGER,
      current_q_team2 TEXT,
      current_a_team2 INTEGER,
      status VARCHAR(20) DEFAULT 'active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log('✅  tug_of_war_games table created');

  console.log('Migration complete!');
  process.exit(0);
}

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
