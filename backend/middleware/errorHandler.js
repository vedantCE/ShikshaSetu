const errorHandler = (err, req, res, next) => {
    // Default to 500 if no status code set
    const statusCode = err.statusCode || 500;
    const message = err.isOperational
        ? err.message                // our own AppError — safe to show
        : 'Something went wrong';    // unknown crash — hide details

    // Always log the real error on server
    console.error(`[${req.method}] ${req.path} → ${err.message}`);

    res.status(statusCode).json({ error: message });
};

module.exports = errorHandler;