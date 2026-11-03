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

function getWordRows(database, wordIds) {
  if (!wordIds.length) return [];
  const placeholders = wordIds.map(() => '?').join(',');
  if (tableExists(database, 'vocab_words')) {
    return database.prepare(`SELECT * FROM vocab_words WHERE id IN (${placeholders})`).all(...wordIds);
  }
  return database.prepare(`SELECT * FROM words WHERE id IN (${placeholders})`).all(...wordIds);
}

router.get('/', (req, res) => {
  const database = getDb();
  const courseCode = normalizeCourseCode(req.query.course);
  const userId = String(req.query.userId || 'anonymous').trim();

  if (!courseCode) return res.status(400).json({ error: 'Missing course query parameter.' });

  const filteredRecords = [];
  if (tableExists(database, 'user_words')) {
    const rows = database.prepare('SELECT * FROM user_words WHERE userId = ? AND courseId = ? ORDER BY updatedAt DESC').all(userId, courseCode);
    filteredRecords.push(...rows);
  }

  if (tableExists(database, 'custom_words')) {
    const customRows = database.prepare('SELECT * FROM custom_words WHERE userId = ? AND courseId = ? ORDER BY updatedAt DESC').all(userId, courseCode);
    filteredRecords.push(...customRows.map((row) => ({
      id: row.id,
      userId: row.userId,
      courseId: row.courseId,
      wordId: row.id,
      source: row.source,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      word: row.word,
      custom: true
    })));
  }

  const unique = new Map();
  filteredRecords.forEach((record) => {
    const key = record.wordId || record.id;
    if (!key) return;
    if (!unique.has(String(key))) unique.set(String(key), record);
  });

  const records = Array.from(unique.values());
  const wordIds = records
    .map((record) => record.wordId || record.id)
    .filter(Boolean);

  if (!wordIds.length) return res.json([]);

  const catalog = new Map(getWordRows(database, wordIds).map((word) => [String(word.id), word]));

  return res.json(records.map((record) => {
    const key = String(record.wordId || record.id);
    const baseWord = catalog.get(key) || {
      id: key,
      word: record.word || key,
      translation: record.translation || '',
      lesson: record.lesson || '',
      category: record.category || '',
      type: record.type || 'other',
      source: record.source || 'custom'
    };

    return {
      id: baseWord.id || key,
      wordId: key,
      word: baseWord.word || record.word || key,
      translation: baseWord.translation || record.translation || '',
      lesson: baseWord.lesson || record.lesson || '',
      category: baseWord.category || record.category || '',
      type: baseWord.type || record.type || 'other',
      source: baseWord.source || record.source || 'custom',
      custom: Boolean(record.custom || baseWord.source === 'custom'),
      courseId: courseCode,
      createdAt: record.createdAt || baseWord.createdAt || null,
      updatedAt: record.updatedAt || baseWord.updatedAt || null
    };
  }));
});

module.exports = router;
