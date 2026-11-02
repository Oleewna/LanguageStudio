const express = require('express');
const router = express.Router();
const {
    getSession,
    login,
    logout,
    register
} = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.get('/session', getSession);
router.post('/logout', logout);

module.exports = router;
