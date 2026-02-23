const pool = require('../config/db');

// ─── Question Generator ──────────────────────────────────────────
function generateQuestion(difficulty) {
  let a, b, op, question, answer;

  switch (difficulty) {
    case 'hard': {
      const ops = ['+', '-', '×'];
      op = ops[Math.floor(Math.random() * ops.length)];
      if (op === '×') {
        a = Math.floor(Math.random() * 12) + 1;
        b = Math.floor(Math.random() * 12) + 1;
        answer = a * b;
      } else if (op === '-') {
        a = Math.floor(Math.random() * 50) + 1;
        b = Math.floor(Math.random() * a) + 1;
        answer = a - b;
      } else {
        a = Math.floor(Math.random() * 50) + 1;
        b = Math.floor(Math.random() * 50) + 1;
        answer = a + b;
      }
      break;
    }
    case 'medium': {
      const ops = ['+', '-'];
      op = ops[Math.floor(Math.random() * ops.length)];
      if (op === '-') {
        a = Math.floor(Math.random() * 50) + 1;
        b = Math.floor(Math.random() * a) + 1;
        answer = a - b;
      } else {
        a = Math.floor(Math.random() * 50) + 1;
        b = Math.floor(Math.random() * 50) + 1;
        answer = a + b;
      }
      break;
    }
    default: { // easy
      op = '+';
      a = Math.floor(Math.random() * 20) + 1;
      b = Math.floor(Math.random() * 20) + 1;
      answer = a + b;
      break;
    }
  }

  question = `${a} ${op} ${b}`;
  return { question, answer };
}

// ─── POST /tugofwar/start ────────────────────────────────────────
exports.startGame = async (req, res) => {
  const { user_id } = req.user;
  const { difficulty = 'easy' } = req.body;

  if (!['easy', 'medium', 'hard'].includes(difficulty)) {
    return res.status(400).json({ error: 'Invalid difficulty. Use easy, medium, or hard.' });
  }

  try {
    const q1 = generateQuestion(difficulty);
    const q2 = generateQuestion(difficulty);

    const result = await pool.query(
      `INSERT INTO tug_of_war_games
         (user_id, difficulty, current_q_team1, current_a_team1, current_q_team2, current_a_team2)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, difficulty, current_q_team1, current_q_team2, status`,
      [user_id, difficulty, q1.question, q1.answer, q2.question, q2.answer]
    );

    const game = result.rows[0];
    res.status(201).json({
      gameId: game.id,
      difficulty: game.difficulty,
      team1Question: { question: `${q1.question} = ?` },
      team2Question: { question: `${q2.question} = ?` },
    });
  } catch (error) {
    console.error('Start game error:', error.message);
    res.status(500).json({ error: 'Failed to start game' });
  }
};

// ─── POST /tugofwar/submit ───────────────────────────────────────
exports.submitAnswer = async (req, res) => {
  const { gameId, team, answer } = req.body;

  if (!gameId || !team || answer === undefined) {
    return res.status(400).json({ error: 'gameId, team, and answer are required' });
  }

  if (team !== 'team1' && team !== 'team2') {
    return res.status(400).json({ error: 'team must be team1 or team2' });
  }

  try {
    // Fetch game
    const gameResult = await pool.query(
      'SELECT * FROM tug_of_war_games WHERE id = $1',
      [gameId]
    );

    if (gameResult.rows.length === 0) {
      return res.status(404).json({ error: 'Game not found' });
    }

    const game = gameResult.rows[0];

    if (game.status !== 'active') {
      return res.status(400).json({ error: 'Game is already finished' });
    }

    const correctAnswer = team === 'team1' ? game.current_a_team1 : game.current_a_team2;
    const isCorrect = Number(answer) === correctAnswer;

    // Calculate updates
    const scoreField = team === 'team1' ? 'team1_score' : 'team2_score';
    const correctField = team === 'team1' ? 'correct_team1' : 'correct_team2';
    const ropeShift = team === 'team1' ? -20 : 20; // negative = left (team1 wins), positive = right (team2 wins)

    // Generate new question for this team
    const newQ = generateQuestion(game.difficulty);
    const qField = team === 'team1' ? 'current_q_team1' : 'current_q_team2';
    const aField = team === 'team1' ? 'current_a_team1' : 'current_a_team2';

    let updateQuery, updateParams;

    if (isCorrect) {
      updateQuery = `
        UPDATE tug_of_war_games
        SET ${scoreField} = ${scoreField} + 1,
            ${correctField} = ${correctField} + 1,
            total_questions = total_questions + 1,
            rope_position = rope_position + $1,
            ${qField} = $2,
            ${aField} = $3
        WHERE id = $4
        RETURNING team1_score, team2_score, rope_position, ${qField} as new_question`;
      updateParams = [ropeShift, newQ.question, newQ.answer, gameId];
    } else {
      updateQuery = `
        UPDATE tug_of_war_games
        SET total_questions = total_questions + 1,
            ${qField} = $1,
            ${aField} = $2
        WHERE id = $3
        RETURNING team1_score, team2_score, rope_position, ${qField} as new_question`;
      updateParams = [newQ.question, newQ.answer, gameId];
    }

    const updated = await pool.query(updateQuery, updateParams);
    const row = updated.rows[0];

    // Check if threshold crossed (±100 → instant win)
    let winner = null;
    if (row.rope_position <= -100) winner = 'team1';
    if (row.rope_position >= 100) winner = 'team2';

    if (winner) {
      await pool.query(
        "UPDATE tug_of_war_games SET status = 'finished', winner = $1 WHERE id = $2",
        [winner, gameId]
      );
    }

    res.json({
      correct: isCorrect,
      team1Score: row.team1_score,
      team2Score: row.team2_score,
      ropePosition: row.rope_position,
      newQuestion: { question: `${newQ.question} = ?` },
      winner,
    });
  } catch (error) {
    console.error('Submit answer error:', error.message);
    res.status(500).json({ error: 'Failed to submit answer' });
  }
};

// ─── POST /tugofwar/end ──────────────────────────────────────────
exports.endGame = async (req, res) => {
  const { gameId, team1Score, team2Score, winner, duration } = req.body;

  if (!gameId) {
    return res.status(400).json({ error: 'gameId is required' });
  }

  try {
    const result = await pool.query(
      `UPDATE tug_of_war_games
       SET team1_score = COALESCE($1, team1_score),
           team2_score = COALESCE($2, team2_score),
           winner = COALESCE($3, winner),
           duration = COALESCE($4, duration),
           status = 'finished'
       WHERE id = $5
       RETURNING *`,
      [team1Score, team2Score, winner, duration, gameId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Game not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('End game error:', error.message);
    res.status(500).json({ error: 'Failed to end game' });
  }
};
