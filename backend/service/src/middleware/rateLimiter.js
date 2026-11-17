const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: process.env.NODE_ENV === 'test' ? 1000 : 50, // Limit each IP to 50 requests per windowMs
    standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
    legacyHeaders: false, // Disable `X-RateLimit-*` headers
    message: {
        error: 'Too many authentication attempts, please try again in 15 minutes.'
    },
    skip: () => process.env.NODE_ENV === 'test' && process.env.ENABLE_RATE_LIMIT !== 'true'
});

const strictAuthLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: process.env.NODE_ENV === 'test' ? 1000 : 15, // Stricter limit for login/register
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: 'Too many login attempts, please try again in 15 minutes.'
    },
    skip: () => process.env.NODE_ENV === 'test' && process.env.ENABLE_RATE_LIMIT !== 'true'
});

module.exports = {
    authLimiter,
    strictAuthLimiter
};
