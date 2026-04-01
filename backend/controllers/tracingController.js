const pool = require('../config/db');

const ALPHABET_ITEMS = 'abcdefghijklmnopqrstuvwxyz'.split('');
const NUMBER_ITEMS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

const ACCESS_TABLES = ['parent_student_mapping', 'teacher_student_mapping'];
let accessTableCache = null;

function isWholeNumber(value) {
  return Number.isInteger(Number(value));
}

function normalizeType(type) {
  return String(type || '').trim().toLowerCase();
}

function normalizeItem(type, item) {
  if (type === 'alphabet') {
    const normalized = String(item || '').trim().toLowerCase();
    return ALPHABET_ITEMS.includes(normalized) ? normalized : null;
  }

  if (type === 'number') {
    const normalized = String(item || '').trim();
    return NUMBER_ITEMS.includes(normalized) ? normalized : null;
  }

  return null;
}

function getTracingMeta(type, item) {
  if (type === 'alphabet') {
    return {
      tableName: 'abctracing',
      columnName: item,
      progressKey: 'alphabet_progress',
      items: ALPHABET_ITEMS,
    };
  }

  return {
    tableName: 'number_tracing',
    columnName: `n${item}`,
    progressKey: 'number_progress',
    items: NUMBER_ITEMS.map((value) => `n${value}`),
  };
}

function buildAggregateSelect(tableName, columns, alias) {
  const maxColumns = columns
    .map((column) => `MAX(${tableName}.${column}) AS ${column}`)
    .join(',\n          ');

  const progressExpression = columns
    .map((column) => `COALESCE(MAX(${tableName}.${column}), 0)`)
    .join(' + ');

  return `
    SELECT
      ${tableName}.student_id,
      ${maxColumns},
      ROUND(((${progressExpression})::numeric / ${columns.length}), 2) AS progress,
      MAX(${tableName}.created_at) AS created_at
    FROM ${tableName}
    GROUP BY ${tableName}.student_id
  `;
}

async function getAccessTableCache(client) {
  if (accessTableCache) {
    return accessTableCache;
  }

  const { rows } = await client.query(
    `SELECT table_name
     FROM information_schema.tables
     WHERE table_schema = 'public'
       AND table_name = ANY($1::text[])`,
    [ACCESS_TABLES]
  );

  const tables = new Set(rows.map((row) => row.table_name));
  accessTableCache = {
    hasParentMapping: tables.has('parent_student_mapping'),
    hasTeacherMapping: tables.has('teacher_student_mapping'),
  };

  return accessTableCache;
}

function buildAccessibleStudentsCte({ userId, userRole, hasParentMapping, hasTeacherMapping }) {
  const queries = [
    {
      text: 'SELECT s.student_id FROM student s WHERE s.user_id = $1',
      values: [userId],
    },
  ];

  if (userRole === 'parent' && hasParentMapping) {
    queries.push({
      text: 'SELECT psm.student_id FROM parent_student_mapping psm WHERE psm.parent_id = $1',
      values: [userId],
    });
  }

  if (userRole === 'teacher' && hasTeacherMapping) {
    queries.push({
      text: 'SELECT tsm.student_id FROM teacher_student_mapping tsm WHERE tsm.teacher_id = $1',
      values: [userId],
    });
  }

  return {
    text: queries.map((query) => query.text).join(' UNION '),
    values: queries[0].values,
  };
}

async function assertStudentAccess(client, user, studentId) {
  if (!['parent', 'teacher'].includes(user.user_role)) {
    return false;
  }

  const tableInfo = await getAccessTableCache(client);
  const accessibleStudents = buildAccessibleStudentsCte({
    userId: user.user_id,
    userRole: user.user_role,
    ...tableInfo,
  });

  const { rows } = await client.query(
    `WITH accessible_students AS (${accessibleStudents.text})
     SELECT 1
     FROM accessible_students
     WHERE student_id = $2
     LIMIT 1`,
    [...accessibleStudents.values, studentId]
  );

  return rows.length > 0;
}

function buildTracingProjection(includeStars) {
  const alphabetStars = includeStars
    ? `COALESCE(
         to_jsonb(at) - 'id' - 'student_id' - 'progress' - 'created_at',
         '{}'::jsonb
       ) AS alphabet_stars,`
    : '';

  const numberStars = includeStars
    ? `COALESCE(
         to_jsonb(nt) - 'id' - 'student_id' - 'progress' - 'created_at',
         '{}'::jsonb
       ) AS number_stars,`
    : '';

  return `
    SELECT
      s.student_id,
      s.student_name,
      COALESCE(at.progress, 0)::numeric(5,2) AS alphabet_progress,
      COALESCE(nt.progress, 0)::numeric(5,2) AS number_progress,
      ${alphabetStars}
      ${numberStars}
      GREATEST(at.created_at, nt.created_at) AS last_tracing_update
    FROM student s
    LEFT JOIN (
      ${buildAggregateSelect('abctracing', ALPHABET_ITEMS, 'at')}
    ) at ON at.student_id = s.student_id
    LEFT JOIN (
      ${buildAggregateSelect('number_tracing', NUMBER_ITEMS.map((value) => `n${value}`), 'nt')}
    ) nt ON nt.student_id = s.student_id
  `;
}

exports.updateTracing = async (req, res) => {
  const { student_id, type, item, stars } = req.body;
  const normalizedType = normalizeType(type);
  const normalizedItem = normalizeItem(normalizedType, item);
  const normalizedStars = Number(stars);

  if (!isWholeNumber(student_id)) {
    return res.status(400).json({ error: 'student_id must be a valid integer' });
  }

  if (!['alphabet', 'number'].includes(normalizedType)) {
    return res.status(400).json({ error: 'type must be either "alphabet" or "number"' });
  }

  if (!normalizedItem) {
    return res.status(400).json({ error: 'item is invalid for the selected type' });
  }

  if (!Number.isInteger(normalizedStars) || normalizedStars < 0 || normalizedStars > 3) {
    return res.status(400).json({ error: 'stars must be an integer between 0 and 3' });
  }

  const client = await pool.connect();

  try {
    const studentId = Number(student_id);
    const hasAccess = await assertStudentAccess(client, req.user, studentId);

    if (!hasAccess) {
      return res.status(403).json({ error: 'Access denied for this student' });
    }

    const { tableName, columnName, progressKey, items } = getTracingMeta(normalizedType, normalizedItem);

    const { rows } = await client.query(
      `WITH latest_record AS (
         SELECT id, ${columnName} AS existing_stars
         FROM ${tableName}
         WHERE student_id = $1
         ORDER BY created_at DESC NULLS LAST, id DESC
         LIMIT 1
       ),
       updated_record AS (
         UPDATE ${tableName}
         SET ${columnName} = GREATEST(COALESCE(${columnName}, 0), $2)
         WHERE id = (SELECT id FROM latest_record)
         RETURNING student_id, ${columnName} AS stored_stars, progress,
           (COALESCE((SELECT existing_stars FROM latest_record), 0) < $2) AS updated
       ),
       inserted_record AS (
         INSERT INTO ${tableName} (student_id, ${columnName})
         SELECT $1, $2
         WHERE NOT EXISTS (SELECT 1 FROM latest_record)
         RETURNING student_id, ${columnName} AS stored_stars, progress, true AS updated
       )
       SELECT student_id, stored_stars, progress, updated
       FROM updated_record
       UNION ALL
       SELECT student_id, stored_stars, progress, updated
       FROM inserted_record
       LIMIT 1`,
      [studentId, normalizedStars]
    );

    const result = rows[0];
    const progressResult = await client.query(
      `SELECT progress
       FROM (
         ${buildAggregateSelect(tableName, items, 'agg')}
       ) progress_view
       WHERE student_id = $1
       LIMIT 1`,
      [studentId]
    );
    const aggregatedProgress = Number(progressResult.rows[0]?.progress ?? 0);

    res.json({
      message: result.updated ? 'Tracing updated successfully' : 'Existing stars are already higher or equal',
      student_id: studentId,
      type: normalizedType,
      item: normalizedItem,
      requested_stars: normalizedStars,
      stored_stars: Number(result.stored_stars),
      [progressKey]: aggregatedProgress,
      updated: result.updated,
    });
  } catch (error) {
    console.error('Update tracing error:', error.message);
    res.status(500).json({ error: 'Failed to update tracing progress' });
  } finally {
    client.release();
  }
};

exports.getTracingProgress = async (req, res) => {
  const includeStars = String(req.query.includeStars || '').toLowerCase() === 'true';
  const client = await pool.connect();

  try {
    if (!['parent', 'teacher'].includes(req.user.user_role)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const tableInfo = await getAccessTableCache(client);
    const accessibleStudents = buildAccessibleStudentsCte({
      userId: req.user.user_id,
      userRole: req.user.user_role,
      ...tableInfo,
    });

    const { rows } = await client.query(
      `WITH accessible_students AS (${accessibleStudents.text})
       ${buildTracingProjection(includeStars)}
       WHERE s.student_id IN (SELECT student_id FROM accessible_students)
       ORDER BY s.student_id DESC`,
      accessibleStudents.values
    );

    res.json({
      role: req.user.user_role,
      count: rows.length,
      students: rows,
    });
  } catch (error) {
    console.error('Get tracing progress list error:', error.message);
    res.status(500).json({ error: 'Failed to fetch tracing progress' });
  } finally {
    client.release();
  }
};

exports.getStudentTracingProgress = async (req, res) => {
  const includeStars = String(req.query.includeStars || '').toLowerCase() === 'true';
  const studentId = Number(req.params.student_id);

  if (!Number.isInteger(studentId)) {
    return res.status(400).json({ error: 'student_id must be a valid integer' });
  }

  const client = await pool.connect();

  try {
    const hasAccess = await assertStudentAccess(client, req.user, studentId);

    if (!hasAccess) {
      return res.status(403).json({ error: 'Access denied for this student' });
    }

    const { rows } = await client.query(
      `${buildTracingProjection(includeStars)}
       WHERE s.student_id = $1
       LIMIT 1`,
      [studentId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Get student tracing progress error:', error.message);
    res.status(500).json({ error: 'Failed to fetch student tracing progress' });
  } finally {
    client.release();
  }
};
