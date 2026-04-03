// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const pool = require('../config/db');

// exports.register = async (req, res) => {
//   const { user_name, user_email, user_password, confirm_password, contact_number, address, user_role } = req.body;

//   if (!user_name || !user_email || !user_password || !confirm_password || !user_role) {
//     return res.status(400).json({ error: 'All fields are required' });
//   }

//   if (user_password !== confirm_password) {
//     return res.status(400).json({ error: 'Passwords do not match' });
//   }

//   if (!['parent', 'teacher'].includes(user_role)) {
//     return res.status(400).json({ error: 'Invalid user role' });
//   }

//   try {
//     const emailCheck = await pool.query('SELECT user_email FROM users WHERE user_email = $1', [user_email]);
//     if (emailCheck.rows.length > 0) {
//       return res.status(409).json({ error: 'Email already exists' });
//     }

//     const hashedPassword = await bcrypt.hash(user_password, 10);

//     const result = await pool.query(
//       'INSERT INTO users (user_role, user_name, user_email, user_password, contact_number, address) VALUES ($1, $2, $3, $4, $5, $6) RETURNING user_id, user_role, user_name, user_email',
//       [user_role, user_name, user_email, hashedPassword, contact_number, address]
//     );

//     const user = result.rows[0];
//     const token = jwt.sign({ user_id: user.user_id, user_role: user.user_role }, process.env.JWT_SECRET, { expiresIn: '7d' });

//     res.status(201).json({ user_id: user.user_id, user_role: user.user_role, user_name: user.user_name, token });
//   } catch (error) {
//     console.error('Register error:', error.message);
//     res.status(500).json({ error: 'Registration failed' });
//   }
// };

// exports.login = async (req, res) => {
//   const { user_email, user_password } = req.body;

//   if (!user_email || !user_password) {
//     return res.status(400).json({ error: 'Email and password are required' });
//   }

//   try {
//     const result = await pool.query('SELECT user_id, user_role, user_name, user_password FROM users WHERE user_email = $1', [user_email]);

//     if (result.rows.length === 0) {
//       return res.status(401).json({ error: 'Invalid credentials' });
//     }

//     const user = result.rows[0];
//     const isMatch = await bcrypt.compare(user_password, user.user_password);

//     if (!isMatch) {
//       return res.status(401).json({ error: 'Invalid credentials' });
//     }

//     const token = jwt.sign({ user_id: user.user_id, user_role: user.user_role }, process.env.JWT_SECRET, { expiresIn: '7d' });

//     res.json({ user_id: user.user_id, user_role: user.user_role, user_name: user.user_name, token });
//   } catch (error) {
//     console.error('Login error:', error.message);
//     res.status(500).json({ error: 'Login failed' });
//   }
// };

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const AppError = require('../utils/AppError');
const asyncHandler = require('../middleware/asyncHandler');

exports.register = asyncHandler(async (req, res) => {
    const { user_name, user_email, user_password, confirm_password,
        contact_number, address, user_role } = req.body;

    // Validation -> check inputs before touching DB        
    if (!user_name || !user_email || !user_password || !confirm_password || !user_role)
        throw new AppError('All fields are required', 400);

    if (user_password !== confirm_password)
        throw new AppError('Passwords do not match', 400);

    if (!['parent', 'teacher'].includes(user_role))
        throw new AppError('Invalid user role', 400);

    // Check if email already exists in DB
    const emailCheck = await pool.query(
        'SELECT user_email FROM users WHERE user_email = $1', [user_email]
    );
    if (emailCheck.rows.length > 0)
        throw new AppError('Email already exists', 409);

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(user_password, 10);

    // Insert new user into database
    const result = await pool.query(
        'INSERT INTO users (user_role, user_name, user_email, user_password, contact_number, address) VALUES ($1, $2, $3, $4, $5, $6) RETURNING user_id, user_role, user_name, user_email',
        [user_role, user_name, user_email, hashedPassword, contact_number, address]
    );

    // Create a JWT token for this user
    const user = result.rows[0];
    const token = jwt.sign(
        { user_id: user.user_id, user_role: user.user_role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );

    // Send success response back to app
    res.status(201).json({
        user_id: user.user_id, user_role: user.user_role,
        user_name: user.user_name, token
    });
});

exports.login = asyncHandler(async (req, res) => {
    const { user_email, user_password } = req.body;

    if (!user_email || !user_password)
        throw new AppError('Email and password are required', 400);

    const result = await pool.query(
        'SELECT user_id, user_role, user_name, user_password FROM users WHERE user_email = $1',
        [user_email]
    );

    if (result.rows.length === 0)
        throw new AppError('Invalid credentials', 401);

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(user_password, user.user_password);

    if (!isMatch)
        throw new AppError('Invalid credentials', 401);

    const token = jwt.sign(
        { user_id: user.user_id, user_role: user.user_role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );

    res.json({
        user_id: user.user_id, user_role: user.user_role,
        user_name: user.user_name, token
    });
});