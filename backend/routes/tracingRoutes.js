const express = require('express');
const auth = require('../middleware/auth');
const {
  updateTracing,
  getTracingProgress,
  getStudentTracingProgress,
} = require('../controllers/tracingController');

const router = express.Router();

router.post('/update-tracing', auth, updateTracing);
router.get('/tracing-progress', auth, getTracingProgress);
router.get('/students/:student_id/tracing-progress', auth, getStudentTracingProgress);

module.exports = router;
