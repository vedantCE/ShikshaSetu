const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { addChild, getChildren, submitQuizResult } = require('../controllers/studentController');

router.post('/', auth, addChild);
router.get('/', auth, getChildren);
router.post('/:student_id/quiz-result', auth, submitQuizResult);

module.exports = router;
