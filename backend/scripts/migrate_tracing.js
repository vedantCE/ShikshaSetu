const pool = require('../config/db');

const alphabetColumns = 'abcdefghijklmnopqrstuvwxyz'.split('');
const numberColumns = ['n0', 'n1', 'n2', 'n3', 'n4', 'n5', 'n6', 'n7', 'n8', 'n9'];

function averageExpression(columns) {
  const sumExpression = columns.map((column) => `COALESCE(NEW.${column}, 0)`).join(' + ');
  return `ROUND(((${sumExpression})::numeric / ${columns.length}), 2)`;
}

async function ensureColumns(tableName, columns) {
  for (const column of columns) {
    await pool.query(`
      ALTER TABLE ${tableName}
      ADD COLUMN IF NOT EXISTS ${column} INTEGER NOT NULL DEFAULT 0;
    `);
  }
}

async function ensureScoreChecks(tableName, columns) {
  for (const column of columns) {
    const constraintName = `${tableName}_${column}_range_check`;
    await pool.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1
          FROM pg_constraint
          WHERE conname = '${constraintName}'
        ) THEN
          ALTER TABLE ${tableName}
          ADD CONSTRAINT ${constraintName}
          CHECK (${column} BETWEEN 0 AND 3);
        END IF;
      END $$;
    `);
  }
}

async function ensureTracingTable(tableName, columns) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS ${tableName} (
      student_id INTEGER PRIMARY KEY REFERENCES student(student_id) ON DELETE CASCADE,
      progress NUMERIC(5,2) NOT NULL DEFAULT 0,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await ensureColumns(tableName, columns);

  await pool.query(`
    ALTER TABLE ${tableName}
    ADD COLUMN IF NOT EXISTS progress NUMERIC(5,2) NOT NULL DEFAULT 0;
  `);

  await pool.query(`
    ALTER TABLE ${tableName}
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;
  `);

  await pool.query(`
    ALTER TABLE ${tableName}
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;
  `);

  await ensureScoreChecks(tableName, columns);

  await pool.query(`
    CREATE UNIQUE INDEX IF NOT EXISTS ${tableName}_student_id_uidx
    ON ${tableName} (student_id);
  `);

  await pool.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = '${tableName}_student_id_fkey'
      ) THEN
        ALTER TABLE ${tableName}
        ADD CONSTRAINT ${tableName}_student_id_fkey
        FOREIGN KEY (student_id) REFERENCES student(student_id) ON DELETE CASCADE;
      END IF;
    END $$;
  `);
}

async function createProgressTrigger(tableName, columns) {
  const functionName = `${tableName}_progress_sync`;
  const triggerName = `${tableName}_progress_before_write`;

  await pool.query(`
    CREATE OR REPLACE FUNCTION ${functionName}()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.progress := ${averageExpression(columns)};
      NEW.updated_at := NOW();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `);

  await pool.query(`DROP TRIGGER IF EXISTS ${triggerName} ON ${tableName};`);

  await pool.query(`
    CREATE TRIGGER ${triggerName}
    BEFORE INSERT OR UPDATE ON ${tableName}
    FOR EACH ROW
    EXECUTE FUNCTION ${functionName}();
  `);
}

async function backfillProgress(tableName, columns) {
  const sumExpression = columns.map((column) => `COALESCE(${column}, 0)`).join(' + ');

  await pool.query(`
    UPDATE ${tableName}
    SET progress = ROUND(((${sumExpression})::numeric / ${columns.length}), 2),
        updated_at = COALESCE(updated_at, created_at, NOW());
  `);
}

async function migrate() {
  console.log('Running tracing migrations...');

  await ensureTracingTable('abctracing', alphabetColumns);
  console.log('✅ abctracing table ensured');

  await ensureTracingTable('number_tracing', numberColumns);
  console.log('✅ number_tracing table ensured');

  await createProgressTrigger('abctracing', alphabetColumns);
  console.log('✅ abctracing progress trigger ensured');

  await createProgressTrigger('number_tracing', numberColumns);
  console.log('✅ number_tracing progress trigger ensured');

  await backfillProgress('abctracing', alphabetColumns);
  await backfillProgress('number_tracing', numberColumns);
  console.log('✅ tracing progress backfilled');

  console.log('Tracing migration complete!');
  process.exit(0);
}

migrate().catch((error) => {
  console.error('Tracing migration failed:', error);
  process.exit(1);
});
