// Wraps any async controller so errors auto-flow to errorHandler
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;



// This tiny wrapper means you never need try/catch in controllers again. Any thrown error automatically goes to errorHandler.
