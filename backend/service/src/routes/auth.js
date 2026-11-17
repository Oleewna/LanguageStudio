const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { csrfProtection } = require('../middleware/csrf');
const { authLimiter, strictAuthLimiter } = require('../middleware/rateLimiter');

// Rate limiting across auth routes
router.use(authLimiter);

// CSRF token retrieval
router.get('/csrf-token', authController.getCsrf);
router.get('/csrf', authController.getCsrf);

// User profile & session
router.get('/me', authController.getMe);
router.get('/session', authController.getMe); // Backward-compatibility alias

// Registration & Login
router.post('/register', strictAuthLimiter, csrfProtection, authController.register);
router.post('/login', strictAuthLimiter, csrfProtection, authController.login);
router.post('/logout', csrfProtection, authController.logout);

// Password Reset Flow
router.post('/forgot-password', strictAuthLimiter, csrfProtection, authController.forgotPassword);
router.post('/reset-password', strictAuthLimiter, csrfProtection, authController.resetPassword);

// Email Verification Flow
router.post('/verify-email', csrfProtection, authController.verifyEmail);
router.get('/verify-email', authController.verifyEmail);
router.post('/resend-verification', strictAuthLimiter, csrfProtection, authController.resendVerification);

module.exports = router;
