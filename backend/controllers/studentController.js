const bcrypt = require('bcrypt');
const pool = require('../config/db');

exports.addChild = async (req, res) => {
  const { student_name, age, password } = req.body;
  const { user_id, user_role } = req.user;

  if (user_role !== 'parent') {
    return res.status(403).json({ error: 'Only parents can add children' });
  }

  if (!student_name || !age || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      'INSERT INTO student (user_id, student_name, age, password) VALUES ($1, $2, $3, $4) RETURNING student_id, student_name, age, disorder_type, is_active',
      [user_id, student_name, age, hashedPassword]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Add child error:', error.message);
    res.status(500).json({ error: 'Failed to add child' });
  }
};

exports.getChildren = async (req, res) => {
  const { user_id, user_role } = req.user;

  if (user_role !== 'parent') {
    return res.status(403).json({ error: 'Only parents can view children' });
  }

  try {
    const result = await pool.query(
      'SELECT student_id, student_name, age, disorder_type, is_active FROM student WHERE user_id = $1 ORDER BY student_id DESC',
      [user_id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get children error:', error.message);
    res.status(500).json({ error: 'Failed to fetch children' });
  }
};

exports.submitQuizResult = async (req, res) => {
  const student_id = req.params.student_id || req.body.student_id;
  const { user_id, user_role } = req.user;

  if (user_role !== 'parent') {
    return res.status(403).json({ error: 'Only parents can submit quiz results' });
  }

  if (!student_id) {
    return res.status(400).json({ error: 'student_id is required' });
  }

  // Support both payload styles:
  // 1) asd_percentage / adhd_percentage / id_percentage
  // 2) AUTISM / ADHD / ID
  const asd = Number(req.body.asd_percentage ?? req.body.AUTISM ?? 0);
  const adhd = Number(req.body.adhd_percentage ?? req.body.ADHD ?? 0);
  const id = Number(req.body.id_percentage ?? req.body.ID ?? 0);

  if ([asd, adhd, id].some((value) => Number.isNaN(value) || value < 0)) {
    return res.status(400).json({ error: 'Percentages must be valid non-negative numbers' });
  }

  try {
    const studentCheck = await pool.query(
      'SELECT * FROM student WHERE student_id = $1 AND user_id = $2',
      [student_id, user_id]
    );

    if (studentCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Child not found or access denied' });
    }

    let disorderType = 'Unknown';
    const highest = Math.max(asd, adhd, id);
    if (highest > 0) {
      if (highest === asd) {
        disorderType = 'ASD';
      } else if (highest === adhd) {
        disorderType = 'ADHD';
      } else {
        disorderType = 'Intellectual Disability';
      }
    }

    const result = await pool.query(
      'UPDATE student SET disorder_type = $1, updated_at = NOW() WHERE student_id = $2 RETURNING student_id, student_name, disorder_type, updated_at',
      [disorderType, student_id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Submit quiz result error:', error.message);
    res.status(500).json({ error: 'Failed to update quiz result' });
  }
};
