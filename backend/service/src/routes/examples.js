const express = require('express');
const { getDb } = require('../db/init');

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

function tableExists(database, tableName) {
  return Boolean(database.prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = ?").get(tableName));
}

function normalizeExamplesResponse(payload) {
  if (Array.isArray(payload)) return payload.map((entry) => ({
    text: (entry && entry.text) || '',
    trans: entry && entry.trans ? entry.trans : (entry && entry.translation ? { en: entry.translation } : {}),
    source: entry && entry.source ? entry.source : 'external'
  })).filter((entry) => entry.text || Object.keys(entry.trans || {}).length);

  if (payload && Array.isArray(payload.examples)) return normalizeExamplesResponse(payload.examples);
  if (payload && Array.isArray(payload.results)) return normalizeExamplesResponse(payload.results);
  if (payload && Array.isArray(payload.sentences)) return normalizeExamplesResponse(payload.sentences);
  return [];
}

async function fetchExternalExamples({ word, courseId, language }) {
  const baseUrl = process.env.EXAMPLE_API_URL || process.env.EXAMPLES_API_URL || '';
  if (!baseUrl || !word) return [];

  try {
    const url = new URL(baseUrl);
    url.searchParams.set('q', word);
    url.searchParams.set('lang', language || 'it');
    if (courseId) url.searchParams.set('course', courseId);

    const response = await fetch(url.toString(), {
      headers: { Accept: 'application/json' }
    });

    if (!response.ok) return [];
    const payload = await response.json();
    return normalizeExamplesResponse(payload);
  } catch (error) {
    return [];
  }
}

router.get('/', async (req, res) => {
  const database = getDb();
  const word = String(req.query.word || '').trim();
  const courseId = normalizeCourseCode(req.query.course || req.query.courseId || 'it');
  const language = String(req.query.language || req.query.lang || courseId || 'it').trim();

  if (!word) return res.json([]);

  if (tableExists(database, 'word_examples_cache')) {
    const cached = database.prepare('SELECT response_json FROM word_examples_cache WHERE word = ? AND language = ? AND (courseId = ? OR courseId IS NULL) ORDER BY updatedAt DESC LIMIT 1').get(word, language, courseId);
    if (cached) {
      try {
        return res.json(JSON.parse(cached.response_json));
      } catch (error) {
        // ignore malformed cache entry
      }
    }
  }

  const examples = await fetchExternalExamples({ word, courseId, language });

  if (tableExists(database, 'word_examples_cache')) {
    const serialized = JSON.stringify(examples);
    database.prepare(`
      INSERT INTO word_examples_cache (courseId, wordId, word, language, response_json, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))
      ON CONFLICT(courseId, wordId, word, language)
      DO UPDATE SET response_json = excluded.response_json, updatedAt = datetime('now')
    `).run(courseId, '', word, language, serialized);
  }

  return res.json(examples);
});

module.exports = router;
