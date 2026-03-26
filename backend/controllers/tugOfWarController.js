// const pool = require('../config/db');

// // ─── Question Generator ──────────────────────────────────────────
// function generateQuestion(difficulty) {
//   let a, b, op, question, answer;

//   switch (difficulty) {
//     case 'hard': {
//       const ops = ['+', '-', '×'];
//       op = ops[Math.floor(Math.random() * ops.length)];
//       if (op === '×') {
//         a = Math.floor(Math.random() * 12) + 1;
//         b = Math.floor(Math.random() * 12) + 1;
//         answer = a * b;
//       } else if (op === '-') {
//         a = Math.floor(Math.random() * 50) + 1;
//         b = Math.floor(Math.random() * a) + 1;
//         answer = a - b;
//       } else {
//         a = Math.floor(Math.random() * 50) + 1;
//         b = Math.floor(Math.random() * 50) + 1;
//         answer = a + b;
//       }
//       break;
//     }
//     case 'medium': {
//       const ops = ['+', '-'];
//       op = ops[Math.floor(Math.random() * ops.length)];
//       if (op === '-') {
//         a = Math.floor(Math.random() * 50) + 1;
//         b = Math.floor(Math.random() * a) + 1;
//         answer = a - b;
//       } else {
//         a = Math.floor(Math.random() * 50) + 1;
//         b = Math.floor(Math.random() * 50) + 1;
//         answer = a + b;
//       }
//       break;
//     }
//     default: { // easy
//       op = '+';
//       a = Math.floor(Math.random() * 20) + 1;
//       b = Math.floor(Math.random() * 20) + 1;
//       answer = a + b;
//       break;
//     }
//   }

//   question = `${a} ${op} ${b}`;
//   return { question, answer };
// }

// // ─── POST /tugofwar/start ────────────────────────────────────────
// exports.startGame = async (req, res) => {
//   const { user_id } = req.user;
//   const { difficulty = 'easy' } = req.body;

//   if (!['easy', 'medium', 'hard'].includes(difficulty)) {
//     return res.status(400).json({ error: 'Invalid difficulty. Use easy, medium, or hard.' });
//   }

//   try {
//     const q1 = generateQuestion(difficulty);
//     const q2 = generateQuestion(difficulty);

//     const result = await pool.query(
//       `INSERT INTO tug_of_war_games
//          (user_id, difficulty, current_q_team1, current_a_team1, current_q_team2, current_a_team2)
//        VALUES ($1, $2, $3, $4, $5, $6)
//        RETURNING id, difficulty, current_q_team1, current_q_team2, status`,
//       [user_id, difficulty, q1.question, q1.answer, q2.question, q2.answer]
//     );

//     const game = result.rows[0];
//     res.status(201).json({
//       gameId: game.id,
//       difficulty: game.difficulty,
//       team1Question: { question: `${q1.question} = ?` },
//       team2Question: { question: `${q2.question} = ?` },
//     });
//   } catch (error) {
//     console.error('Start game error:', error.message);
//     res.status(500).json({ error: 'Failed to start game' });
//   }
// };

// // ─── POST /tugofwar/submit ───────────────────────────────────────
// exports.submitAnswer = async (req, res) => {
//   const { gameId, team, answer } = req.body;

//   if (!gameId || !team || answer === undefined) {
//     return res.status(400).json({ error: 'gameId, team, and answer are required' });
//   }

//   if (team !== 'team1' && team !== 'team2') {
//     return res.status(400).json({ error: 'team must be team1 or team2' });
//   }

//   try {
//     // Fetch game
//     const gameResult = await pool.query(
//       'SELECT * FROM tug_of_war_games WHERE id = $1',
//       [gameId]
//     );

//     if (gameResult.rows.length === 0) {
//       return res.status(404).json({ error: 'Game not found' });
//     }

//     const game = gameResult.rows[0];

//     if (game.status !== 'active') {
//       return res.status(400).json({ error: 'Game is already finished' });
//     }

//     const correctAnswer = team === 'team1' ? game.current_a_team1 : game.current_a_team2;
//     const isCorrect = Number(answer) === correctAnswer;

//     // Calculate updates
//     const scoreField = team === 'team1' ? 'team1_score' : 'team2_score';
//     const correctField = team === 'team1' ? 'correct_team1' : 'correct_team2';
//     const ropeShift = team === 'team1' ? -20 : 20; // negative = left (team1 wins), positive = right (team2 wins)

//     // Generate new question for this team
//     const newQ = generateQuestion(game.difficulty);
//     const qField = team === 'team1' ? 'current_q_team1' : 'current_q_team2';
//     const aField = team === 'team1' ? 'current_a_team1' : 'current_a_team2';

//     let updateQuery, updateParams;

//     if (isCorrect) {
//       updateQuery = `
//         UPDATE tug_of_war_games
//         SET ${scoreField} = ${scoreField} + 1,
//             ${correctField} = ${correctField} + 1,
//             total_questions = total_questions + 1,
//             rope_position = rope_position + $1,
//             ${qField} = $2,
//             ${aField} = $3
//         WHERE id = $4
//         RETURNING team1_score, team2_score, rope_position, ${qField} as new_question`;
//       updateParams = [ropeShift, newQ.question, newQ.answer, gameId];
//     } else {
//       updateQuery = `
//         UPDATE tug_of_war_games
//         SET total_questions = total_questions + 1,
//             ${qField} = $1,
//             ${aField} = $2
//         WHERE id = $3
//         RETURNING team1_score, team2_score, rope_position, ${qField} as new_question`;
//       updateParams = [newQ.question, newQ.answer, gameId];
//     }

//     const updated = await pool.query(updateQuery, updateParams);
//     const row = updated.rows[0];

//     // Check if threshold crossed (±100 → instant win)
//     let winner = null;
//     if (row.rope_position <= -100) winner = 'team1';
//     if (row.rope_position >= 100) winner = 'team2';

//     if (winner) {
//       await pool.query(
//         "UPDATE tug_of_war_games SET status = 'finished', winner = $1 WHERE id = $2",
//         [winner, gameId]
//       );
//     }

//     res.json({
//       correct: isCorrect,
//       team1Score: row.team1_score,
//       team2Score: row.team2_score,
//       ropePosition: row.rope_position,
//       newQuestion: { question: `${newQ.question} = ?` },
//       winner,
//     });
//   } catch (error) {
//     console.error('Submit answer error:', error.message);
//     res.status(500).json({ error: 'Failed to submit answer' });
//   }
// };

// // ─── POST /tugofwar/end ──────────────────────────────────────────
// exports.endGame = async (req, res) => {
//   const { gameId, team1Score, team2Score, winner, duration } = req.body;

//   if (!gameId) {
//     return res.status(400).json({ error: 'gameId is required' });
//   }

//   try {
//     const result = await pool.query(
//       `UPDATE tug_of_war_games
//        SET team1_score = COALESCE($1, team1_score),
//            team2_score = COALESCE($2, team2_score),
//            winner = COALESCE($3, winner),
//            duration = COALESCE($4, duration),
//            status = 'finished'
//        WHERE id = $5
//        RETURNING *`,
//       [team1Score, team2Score, winner, duration, gameId]
//     );

//     if (result.rows.length === 0) {
//       return res.status(404).json({ error: 'Game not found' });
//     }

//     res.json(result.rows[0]);
//   } catch (error) {
//     console.error('End game error:', error.message);
//     res.status(500).json({ error: 'Failed to end game' });
//   }
// };

// Player opens TugOfWar screen
//          ↓
// 1. startGame   → creates a game in DB, sends first questions to both teams
//          ↓
// 2. submitAnswer → player answers, AI answers → rope moves left or right
//          ↓
// 3. endGame     → timer runs out → saves final scores and winner


const pool = require('../config/db');
const AppError = require('../utils/AppError');
const asyncHandler = require('../middleware/asyncHandler');

function generateQuestion(difficulty) {
    let a, b, op, answer; //Declared with "let" because they change based on difficulty

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
        default: {
            op = '+';
            a = Math.floor(Math.random() * 20) + 1;
            b = Math.floor(Math.random() * 20) + 1;
            answer = a + b;
            break;
        }
    }

    return { question: `${a} ${op} ${b}`, answer };
    // Returns object with both pieces:
    // question = "7 + 4"   <- shown to player
    // answer   = 11        <- stored in DB, never sent to frontend
    // This is also why we removed eval() — answer is already calculated HERE
}

// Function 1 — startGame
// Called when player taps "Start Game" in the app,Creates a fresh game row in DB
// Sends back first questions for both Team 1 (player) and Team 2 (AI)
exports.startGame = asyncHandler(async (req, res) => {

    const { user_id } = req.user;
    // From JWT token — which user is starting this game? , Stored in DB so we know whose game history this belongs to

    const difficulty = req.body.difficulty || 'easy';

    if (!['easy', 'medium', 'hard'].includes(difficulty))
        throw new AppError('Invalid difficulty. Use easy, medium, or hard.', 400);

    const q1 = generateQuestion(difficulty);
    const q2 = generateQuestion(difficulty);

    
    // Saves the game to DB including the ANSWERS
        // Answers are stored in DB — never sent to frontend
        // This is how the backend checks if player's answer is correct
        // Frontend never sees the answer — no cheating possible
    const result = await pool.query(
        `INSERT INTO tug_of_war_games
           (user_id, difficulty, current_q_team1, current_a_team1, current_q_team2, current_a_team2)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id, difficulty, status`,
        [user_id, difficulty, q1.question, q1.answer, q2.question, q2.answer]
    );

    const game = result.rows[0];
    res.status(201).json({
        gameId: game.id,
        difficulty: game.difficulty,
        team1Question: { question: `${q1.question} = ?` },
        team2Question: { question: `${q2.question} = ?` },
    });
});


// Function 2 — submitAnswer 

// Called every time EITHER team answers a question
// team1 = real player submitting via keypad
// team2 = AI submitting (from TugOfWarScreen's handleAISubmit)
// Both use the same endpoint — just different "team" value
exports.submitAnswer = asyncHandler(async (req, res) => {

    const { gameId, team, answer } = req.body;
    // gameId = which game (from startGame response)
    // team   = "team1" or "team2"
    // answer = the number the player/AI submitted e.g. 11


    if (!gameId || !team || answer === undefined)
        throw new AppError('gameId, team, and answer are required', 400);

    if (team !== 'team1' && team !== 'team2')
        throw new AppError('team must be team1 or team2', 400);

    // Step 1 — fetch the current game from DB
    const gameResult = await pool.query(
        'SELECT * FROM tug_of_war_games WHERE id = $1', [gameId]
    );

    if (gameResult.rows.length === 0)
        throw new AppError('Game not found', 404);

    const game = gameResult.rows[0];
    // game now has everything:
        // game.current_a_team1 = correct answer for team1 (e.g. 11)
        // game.current_a_team2 = correct answer for team2 (e.g. 8)
        // game.rope_position   = current rope position (-100 to +100)
        // game.status          = 'active' or 'finished'
        // game.difficulty      = 'easy'/'medium'/'hard'

    // Edge case prevention: Prevent submitting answers after game ends Could happen if player submits just as timer hits 0
    if (game.status !== 'active')
        throw new AppError('Game is already finished', 400);

    // Step 2 — check if answer is correct
    const correctAnswer = team === 'team1' ? game.current_a_team1 : game.current_a_team2;
    const isCorrect = Number(answer) === correctAnswer;

    // Step 3 — figure out what DB columns to update
    const scoreField   = team === 'team1' ? 'team1_score'   : 'team2_score';
    const correctField = team === 'team1' ? 'correct_team1' : 'correct_team2';
    const ropeShift    = team === 'team1' ? -20 : 20;

    // Generate a fresh question for whoever just answered,So the game keeps going with new questions continuously
    const newQ         = generateQuestion(game.difficulty);

    // Which DB columns to update with new question/answer
    const qField       = team === 'team1' ? 'current_q_team1' : 'current_q_team2';
    const aField       = team === 'team1' ? 'current_a_team1' : 'current_a_team2';

    // Step 4 — build and run the UPDATE query
    let updateQuery, updateParams;

    if (isCorrect) {
        updateQuery = `
            UPDATE tug_of_war_games
            SET ${scoreField} = ${scoreField} + 1, 
                ${correctField} = ${correctField} + 1,
                total_questions = total_questions + 1,
                rope_position = rope_position + $1,
                ${qField} = $2, ${aField} = $3
            WHERE id = $4
            RETURNING team1_score, team2_score, rope_position`;
        updateParams = [ropeShift, newQ.question, newQ.answer, gameId];
    } else { // Wrong ans
        updateQuery = `
            UPDATE tug_of_war_games
            SET total_questions = total_questions + 1,
                ${qField} = $1, ${aField} = $2
            WHERE id = $3
            RETURNING team1_score, team2_score, rope_position`;
        updateParams = [newQ.question, newQ.answer, gameId];
    }
        // Two different queries — correct answer moves rope, wrong doesn't
        // Both replace the current question with a new one either way

    //Step 5 — check if someone won instantly
    const updated = await pool.query(updateQuery, updateParams);
    const row = updated.rows[0];

    let winner = null;
    if (row.rope_position <= -100) winner = 'team1';
    if (row.rope_position >= 100)  winner = 'team2';
    // If rope crossed the threshold → instant win
    // Doesn't wait for timer — pure domination win
    if (winner) {
        await pool.query(
            "UPDATE tug_of_war_games SET status = 'finished', winner = $1 WHERE id = $2",
            [winner, gameId]
        );
        // Mark game as finished in DB so no more answers accepted
    }

    res.json({
        correct: isCorrect,  // did they get it right?
        team1Score: row.team1_score,  // updated scores
        team2Score: row.team2_score,
        ropePosition: row.rope_position, // frontend uses this to animate rope
        newQuestion: { question: `${newQ.question} = ?` }, // next question
        winner,
    });
    // Frontend receives this and:
        // 1. Animates rope to new position
        // 2. Updates score display
        // 3. Shows new question
        // 4. If winner exists -> ends game
});

// Function 3 — endGame
// Called when the 30 second timer runs out
// Frontend sends final scores and who won based on rope position
// This just saves everything to DB for history/analytics
exports.endGame = asyncHandler(async (req, res) => {
    const { gameId, team1Score, team2Score, winner, duration } = req.body;

    if (!gameId)
        throw new AppError('gameId is required', 400);

    const result = await pool.query(
        `UPDATE tug_of_war_games
         SET team1_score = COALESCE($1, team1_score),
             team2_score = COALESCE($2, team2_score),
             winner      = COALESCE($3, winner),
             duration    = COALESCE($4, duration),
             status      = 'finished'
         WHERE id = $5
         RETURNING *`,
        [team1Score, team2Score, winner, duration, gameId]
        // RETURNING * = return ALL columns of the updated row

    );

    if (result.rows.length === 0)
        throw new AppError('Game not found', 404);
      // If no rows updated = gameId doesn't exist in DB


    res.json(result.rows[0]);
    // Send back complete game record
    // Frontend uses this to show the results screen
});