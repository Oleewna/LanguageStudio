const express = require('express');
const { normalizeText } = require('../db/init');
const contentRepository = require('language-studio-content-db');

const router = express.Router();

function normalizeCourseCode(courseCode) {
  const rawValue = String(courseCode || '').trim();
  if (!rawValue) return '';
  const normalized = rawValue.toLowerCase();
  const aliases = {
    italian: 'it',
    spanish: 'es',
    ukrainian: 'uk',
    english: 'en'
  };
  return aliases[normalized] || normalized;
}

function buildSearchScore(query, value) {
  const haystack = normalizeText(value || '');
  const needle = normalizeText(query || '');
  if (!needle) return 3;
  if (haystack === needle) return 0;
  if (haystack.startsWith(needle)) return 1;
  if (haystack.includes(needle)) return 2;
  return 3;
}

function getCourseVocabulary(courseCode, res) {
  const words = contentRepository.getCourseVocabulary(courseCode);
  if (!words) {
    res.status(400).json({ error: `Unknown course: ${courseCode}` });
    return null;
  }
  return words;
}

router.get('/', (req, res) => {
  const courseCode = normalizeCourseCode(req.query.course);
  if (!courseCode) return res.status(400).json({ error: 'Missing course query parameter.' });

  const words = getCourseVocabulary(courseCode, res);
  if (!words) return undefined;
  const ids = String(req.query.ids || '').split(',').map((id) => id.trim()).filter(Boolean);
  if (ids.length) {
    const wordsById = new Map(words.map((word) => [word.id, word]));
    return res.json(ids.filter((id) => wordsById.has(id)).map((id) => wordsById.get(id)));
  }
  return res.json(words);
});

router.get('/search', (req, res) => {
  const courseCode = normalizeCourseCode(req.query.course);
  const query = String(req.query.q || '').trim();
  const limit = Math.max(1, Math.min(Number(req.query.limit) || 20, 100));

  if (!courseCode) return res.status(400).json({ error: 'Missing course query parameter.' });
  if (!query) return res.json([]);

  const words = getCourseVocabulary(courseCode, res);
  if (!words) return undefined;
  const matches = words
    .map((word) => {
      const targets = [
        word.word,
        word.lesson,
        ...(word.lessons || []),
        word.path,
        word.topic,
        word.category,
        word.type,
        ...Object.values(word.trans || {}),
        word.example && word.example.text,
        ...(word.examples || []).map((example) => example.text)
      ];
      return { word, score: Math.min(...targets.map((target) => buildSearchScore(query, target))) };
    })
    .filter((entry) => entry.score < 3)
    .sort((left, right) => left.score - right.score
      || left.word.word.localeCompare(right.word.word, undefined, { sensitivity: 'base' }))
    .slice(0, limit)
    .map((entry) => entry.word);

  return res.json(matches);
});

router.get('/by-lesson', (req, res) => {
  const courseCode = normalizeCourseCode(req.query.course);
  const lessonId = String(req.query.lesson || '').trim();

  if (!courseCode) return res.status(400).json({ error: 'Missing course query parameter.' });
  if (!lessonId) return res.status(400).json({ error: 'Missing lesson query parameter.' });

  const words = getCourseVocabulary(courseCode, res);
  if (!words) return undefined;
  return res.json(words.filter((word) => (word.lessons || [word.lesson]).includes(lessonId)));
});

module.exports = router;
