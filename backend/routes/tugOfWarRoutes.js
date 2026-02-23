const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { startGame, submitAnswer, endGame } = require('../controllers/tugOfWarController');

// POST /tugofwar/start — create a new game
router.post('/start', auth, startGame);

// POST /tugofwar/submit — submit an answer
router.post('/submit', auth, submitAnswer);

// POST /tugofwar/end — finalise the game
router.post('/end', auth, endGame);

module.exports = router;
