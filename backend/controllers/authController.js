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

const NON_EDITABLE_FIELDS = new Set([
    'user_id',
    'user_role',
    'user_password',
    'created_at',
    'updated_at',
]);

const toInputType = (columnName, dataType) => {
    if (columnName.includes('email')) return 'email';
    if (columnName.includes('avatar') || columnName.includes('image')) return 'image';
    if (dataType.includes('int') || dataType.includes('numeric') || dataType.includes('double')) return 'number';
    if (dataType === 'boolean') return 'boolean';
    return 'text';
};

const toLabel = (columnName) =>
    columnName
        .replace(/^user_/, '')
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());

const sanitizeUserRow = (row) => {
    if (!row) return null;
    const { user_password, ...safeRow } = row;
    return safeRow;
};

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

exports.getProfileSchema = asyncHandler(async (req, res) => {
    if (!req.user?.user_id)
        throw new AppError('Unauthorized', 401);

    const result = await pool.query(
        `SELECT column_name, data_type, is_nullable
         FROM information_schema.columns
         WHERE table_schema = 'public' AND table_name = 'users'
         ORDER BY ordinal_position`
    );

    const fields = result.rows.map((column) => {
        const key = column.column_name;
        const editable = !NON_EDITABLE_FIELDS.has(key);

        return {
            key,
            label: toLabel(key),
            type: toInputType(key, column.data_type),
            editable,
            required: column.is_nullable === 'NO' && editable,
        };
    });

    res.json({ fields });
});

exports.getProfile = asyncHandler(async (req, res) => {
    const { user_id } = req.user;

    const result = await pool.query(
        'SELECT * FROM users WHERE user_id = $1 LIMIT 1',
        [user_id]
    );

    if (result.rows.length === 0)
        throw new AppError('User not found', 404);

    res.json({ user: sanitizeUserRow(result.rows[0]) });
});

exports.updateParentProfile = asyncHandler(async (req, res) => {
    const { user_id, user_role } = req.user;
    const updatedFields = req.body?.updatedFields;

    if (user_role !== 'parent')
        throw new AppError('Only parent users can update this profile', 403);

    if (!updatedFields || typeof updatedFields !== 'object')
        throw new AppError('updatedFields object is required', 400);

    const columnsResult = await pool.query(
        `SELECT column_name, data_type, is_nullable
         FROM information_schema.columns
         WHERE table_schema = 'public' AND table_name = 'users'`
    );

    const columnsMap = new Map(
        columnsResult.rows.map((column) => [column.column_name, column])
    );

    const changes = [];
    const values = [];
    const changedKeys = [];

    for (const [key, rawValue] of Object.entries(updatedFields)) {
        const column = columnsMap.get(key);
        if (!column || NON_EDITABLE_FIELDS.has(key)) continue;

        const value = typeof rawValue === 'string' ? rawValue.trim() : rawValue;

        if (column.is_nullable === 'NO' && (value === '' || value === null || value === undefined)) {
            throw new AppError(`${toLabel(key)} cannot be empty`, 400);
        }

        if (key.includes('email') && typeof value === 'string') {
            const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            if (!isValidEmail)
                throw new AppError('Please enter a valid email address', 400);
        }

        values.push(value);
        changes.push(`${key} = $${values.length}`);
        changedKeys.push(key);
    }

    if (changes.length === 0)
        throw new AppError('No editable fields provided', 400);

    const hasUpdatedAt = columnsMap.has('updated_at');
    if (hasUpdatedAt) {
        changes.push('updated_at = NOW()');
    }

    values.push(user_id);

    const result = await pool.query(
        `UPDATE users
         SET ${changes.join(', ')}
         WHERE user_id = $${values.length}
         RETURNING *`,
        values
    );

    if (result.rows.length === 0)
        throw new AppError('User not found', 404);

    res.json({
        user: sanitizeUserRow(result.rows[0]),
        updatedKeys: changedKeys,
    });
});

exports.changePassword = asyncHandler(async (req, res) => {
    const { user_id } = req.user;
    const { userId, newPassword } = req.body;

    if (!newPassword || typeof newPassword !== 'string')
        throw new AppError('New password is required', 400);

    if (newPassword.length < 6)
        throw new AppError('Password must be at least 6 characters', 400);

    if (userId && Number(userId) !== Number(user_id))
        throw new AppError('You can only change your own password', 403);

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const result = await pool.query(
        'UPDATE users SET user_password = $1 WHERE user_id = $2 RETURNING user_id',
        [hashedPassword, user_id]
    );

    if (result.rows.length === 0)
        throw new AppError('User not found', 404);

    res.json({ message: 'Password updated successfully' });
});