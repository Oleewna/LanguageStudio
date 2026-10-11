// Collection of page routes for serving static HTML pages
// All GET routes for pages are gathered here

const express = require('express');
const router = express.Router();
const path = require('path');

// GET Home page
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../../../frontend/public/index.html'));
});

// GET Login / Auth page
router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../../../../frontend/public/pages/auth.html'));
});

router.get('/auth', (req, res) => {
    res.sendFile(path.join(__dirname, '../../../../frontend/public/pages/auth.html'));
});

// GET Learning path page
router.get('/path', (req, res) => {
    res.sendFile(path.join(__dirname, '../../../../frontend/public/pages/path.html'));
});

// GET Flashcards page
router.get('/flashcards', (req, res) => {
    res.sendFile(path.join(__dirname, '../../../../frontend/public/pages/flashcards.html'));
});

// GET Exercises page
router.get('/exercises', (req, res) => {
    res.sendFile(path.join(__dirname, '../../../../frontend/public/pages/exercises.html'));
});

// GET Dictionary page
router.get('/dictionary', (req, res) => {
    res.sendFile(path.join(__dirname, '../../../../frontend/public/pages/dictionary.html'));
});

// GET Grammar page
router.get('/grammar', (req, res) => {
    res.sendFile(path.join(__dirname, '../../../../frontend/public/pages/grammar.html'));
});

// GET Tests page
router.get('/tests', (req, res) => {
    res.sendFile(path.join(__dirname, '../../../../frontend/public/pages/tests.html'));
});

module.exports = router;
