const express = require('express');
const auth = require('../middleware/auth');
const { sendHelpRequest } = require('../controllers/supportController');

const router = express.Router();

router.post('/send-help', auth, sendHelpRequest);

module.exports = router;
