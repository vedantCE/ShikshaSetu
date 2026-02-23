const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const { addChild, getChildren, submitQuizResult, getStudentAnalytics } = require('../controllers/studentController');

// POST /students — create student (with optional image upload)
router.post('/', auth, upload.single('image'), addChild);

// GET /students — list students for current user
router.get('/', auth, getChildren);

// POST /students/:student_id/quiz-result — submit quiz
router.post('/:student_id/quiz-result', auth, submitQuizResult);

// GET /students/:student_id/analytics — student progress analytics
router.get('/:student_id/analytics', auth, getStudentAnalytics);

module.exports = router;
