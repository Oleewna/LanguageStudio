// The auth route handles login POST requests

const express = require('express');
const router = express.Router();
const { authController } = require('../controllers/authController.js'); // Import auth controller that contains the login logic

router.post('/login', authController);

module.exports = router;
