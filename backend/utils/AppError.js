class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true; // our own known errors
    }
}

module.exports = AppError;


// This is a custom error class. Now we can throw errors like throw new AppError('Email already exists', 409) from anywhere and the global handler catches it automatically.
