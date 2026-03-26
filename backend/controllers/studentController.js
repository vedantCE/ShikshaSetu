const bcrypt = require('bcrypt');
const pool = require('../config/db');
const AppError = require('../utils/AppError');
const asyncHandler = require('../middleware/asyncHandler');

// A parent or teacher calls this to register a new student
// Example: Parent fills "Add Child" form in the app -> hits this endpoint
exports.addChild = asyncHandler(async (req, res) => {

    const { student_name, age, password, disorder_type } = req.body;
    const { user_id, user_role } = req.user;

    if (user_role !== 'parent' && user_role !== 'teacher')
        throw new AppError('Only parents and teachers can add students', 403);

    if (!student_name || !age || !password)
        throw new AppError('All fields are required', 400);


    const hashedPassword = await bcrypt.hash(password, 10);

    // If no photo uploaded -> imageUrl = null
    const imageUrl = req.file ? req.file.path : null;

    // If parent didn't specify disorder -> default to 'Unknown'
    const disorderValue = disorder_type || 'Unknown';


    // Insert new student row into "student" table
    const result = await pool.query(
        'INSERT INTO student (user_id, student_name, age, password, image_url, disorder_type) VALUES ($1, $2, $3, $4, $5, $6) RETURNING student_id, student_name, age, disorder_type, is_active, image_url',
        [user_id, student_name, age, hashedPassword, imageUrl, disorderValue]
    );

     // Send the new student data back to the app
    res.status(201).json(result.rows[0]);
});


// Called when parent opens their dashboard , Returns list of ALL their students
exports.getChildren = asyncHandler(async (req, res) => {
    const { user_id, user_role } = req.user;
// Again from JWT token — who is asking for this list?

    // Only parents and teachers can see student lists
    if (user_role !== 'parent' && user_role !== 'teacher')
        throw new AppError('Access denied', 403);

    // ORDER BY student_id DESC = newest student shown first
    const result = await pool.query(
        'SELECT student_id, student_name, age, disorder_type, is_active, image_url FROM student WHERE user_id = $1 ORDER BY student_id DESC',
        [user_id]
    );

    res.json(result.rows);
});

// req.params = from the URL itself  → /students/42/quiz (42 is student_id)
    // req.body   = from the request body → { student_id: 42 }
    // This accepts BOTH ways of sending student_id — flexible
exports.submitQuizResult = asyncHandler(async (req, res) => {
    const student_id = req.params.student_id || req.body.student_id;

     // Who is submitting this quiz? Must be a paren
    const { user_id, user_role } = req.user;

   
    if (user_role !== 'parent')
        throw new AppError('Only parents can submit quiz results', 403);

    if (!student_id)
        throw new AppError('student_id is required', 400);


    const asd  = Number(req.body.asd_percentage  ?? req.body.AUTISM ?? 0);
    const adhd = Number(req.body.adhd_percentage ?? req.body.ADHD   ?? 0);
    const id   = Number(req.body.id_percentage   ?? req.body.ID     ?? 0);
    // ?? = "nullish coalescing" — use left side if it exists, else right side
    // This handles 2 different formats the app might send:
    // Format 1: { asd_percentage: 70, adhd_percentage: 20, id_percentage: 10 }
    // Format 2: { AUTISM: 70, ADHD: 20, ID: 10 }
    // Number() converts string "70" to number 70



    // .some() = checks if ANY of the 3 values fail the condition
    // NaN = "Not a Number" — happens if someone sends "abc" instead of 70
    // v < 0 = negative percentages don't make sense
    if ([asd, adhd, id].some((v) => Number.isNaN(v) || v < 0))
        throw new AppError('Percentages must be valid non-negative numbers', 400);

    // SECURITY CHECK — Make sure this student actually belongs to THIS parent
    // Without this, parent A could update parent B's student
    const studentCheck = await pool.query(
        'SELECT * FROM student WHERE student_id = $1 AND user_id = $2',
        [student_id, user_id]
    );

    if (studentCheck.rows.length === 0)
        throw new AppError('Child not found or access denied', 404);


    // Figure out which disorder scored highest
    let disorderType = 'Unknown';
    const highest = Math.max(asd, adhd, id);
    if (highest > 0) {
        if (highest === asd)       disorderType = 'ASD';
        else if (highest === adhd) disorderType = 'ADHD';
        else                       disorderType = 'Intellectual Disability';
    }

    // NOW() = PostgreSQL function — saves current timestamp
    // RETURNING = give us back the updated row
    const result = await pool.query(
        'UPDATE student SET disorder_type = $1, updated_at = NOW() WHERE student_id = $2 RETURNING student_id, student_name, disorder_type, updated_at',
        [disorderType, student_id]
    );

    res.json(result.rows[0]);
    // Send updated student back to app
});


// Called when parent opens a student's progress/analytics screen
// Returns scores, stars, activity breakdown
exports.getStudentAnalytics = asyncHandler(async (req, res) => {

    const { student_id } = req.params;
    // From URL -> /students/42/analytics --> student_id = "42"


    if (!student_id)
        throw new AppError('student_id is required', 400);

    const result = await pool.query(
        `SELECT student_id FROM student WHERE student_id = $1`, [student_id]
    );
    if (result.rows.length === 0)
        throw new AppError('Student not found', 404);

    //all 4 fire at the same time (~50ms total) -- all fire simultaneously
    //Performance optimization:The database runs all 4 queries in parallel, response comes back 4x faster.
    const [totalActivities, totalStars, breakdown, lastActivity] = await Promise.all([
        pool.query('SELECT COUNT(*)::int AS count FROM student_progress WHERE student_id = $1', [student_id]),
        pool.query('SELECT COALESCE(SUM(stars), 0)::int AS total FROM student_progress WHERE student_id = $1', [student_id]),
        pool.query(
            `SELECT activity_type, COUNT(*)::int AS attempts,
                    COALESCE(SUM(score), 0)::int AS total_score,
                    COALESCE(SUM(stars), 0)::int AS total_stars
             FROM student_progress WHERE student_id = $1
             GROUP BY activity_type ORDER BY activity_type`, [student_id]
        ),
        pool.query('SELECT created_at FROM student_progress WHERE student_id = $1 ORDER BY created_at DESC LIMIT 1', [student_id]),
    ]);

    res.json({
        totalActivities: totalActivities.rows[0].count,
        totalStars: totalStars.rows[0].total,
        breakdown: breakdown.rows,
        lastActivityDate: lastActivity.rows[0]?.created_at || null,
    });
});