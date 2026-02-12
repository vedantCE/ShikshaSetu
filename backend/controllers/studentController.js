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
  const { student_id } = req.params;
  const scores = req.body;
  const { user_id, user_role } = req.user;

  if (user_role !== 'parent') {
    return res.status(403).json({ error: 'Only parents can submit quiz results' });
  }

  try {
    const studentCheck = await pool.query(
      'SELECT * FROM student WHERE student_id = $1 AND user_id = $2',
      [student_id, user_id]
    );

    if (studentCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Child not found or access denied' });
    }

    const maxDisorder = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);

    const result = await pool.query(
      'UPDATE student SET disorder_type = $1 WHERE student_id = $2 RETURNING student_id, student_name, disorder_type',
      [maxDisorder, student_id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Submit quiz result error:', error.message);
    res.status(500).json({ error: 'Failed to update quiz result' });
  }
};
