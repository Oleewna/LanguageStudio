const express = require('express');
const router = express.Router();
const {
    googleRedirect,
    googleCallback,
    getSession,
    logout
} = require('../controllers/authController');

// Google OAuth routes
router.get('/google', googleRedirect);
router.get('/google/callback', googleCallback);

// Session checks (support both /session and /me)
router.get('/session', getSession);
router.get('/me', getSession);

// Logout
router.post('/logout', logout);

module.exports = router;
