const express = require('express');
const { getDb, normalizeText } = require('../db/init');

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

function parseIds(rawValue) {
  if (rawValue === undefined || rawValue === null || rawValue === '') return [];
  return String(rawValue)
    .split(',')
    .map((value) => String(value).trim())
    .filter(Boolean);
}

function getCourseRecord(database, courseCode) {
  if (!courseCode) return null;
  return database.prepare('SELECT code, name_native, is_target, is_interface FROM languages WHERE code = ?').get(courseCode);
}

function getWordLookup(database, wordIds) {
  if (!wordIds.length) return new Map();
  const placeholders = wordIds.map(() => '?').join(',');
  const sourceTable = tableExists(database, 'vocab_words') ? 'vocab_words' : 'words';
  const query = sourceTable === 'vocab_words'
    ? `SELECT * FROM ${sourceTable} WHERE id IN (${placeholders})`
    : `SELECT * FROM ${sourceTable} WHERE id IN (${placeholders})`;
  const rows = database.prepare(query).all(...wordIds);
  return new Map(rows.map((row) => [row.id, row]));
}

function getWordTranslations(database, wordIds) {
  if (!wordIds.length) return new Map();
  const placeholders = wordIds.map(() => '?').join(',');
  const rows = database.prepare(`SELECT word_id, lang_code, text FROM word_translations WHERE word_id IN (${placeholders})`).all(...wordIds);
  const byWord = new Map();
  rows.forEach((row) => {
    if (!byWord.has(row.word_id)) byWord.set(row.word_id, {});
    byWord.get(row.word_id)[row.lang_code] = row.text;
  });
  return byWord;
}

function getWordPhonetics(database, wordIds) {
  if (!wordIds.length) return new Map();
  const placeholders = wordIds.map(() => '?').join(',');
  const rows = database.prepare(`SELECT word_id, lang_code, text FROM word_phonetics WHERE word_id IN (${placeholders})`).all(...wordIds);
  const byWord = new Map();
  rows.forEach((row) => {
    if (!byWord.has(row.word_id)) byWord.set(row.word_id, {});
    byWord.get(row.word_id)[row.lang_code] = row.text;
  });
  return byWord;
}

function getWordLessons(database, wordIds) {
  if (!wordIds.length) return new Map();
  const placeholders = wordIds.map(() => '?').join(',');
  const rows = database.prepare(`SELECT word_id, lesson_id FROM word_lessons WHERE word_id IN (${placeholders}) ORDER BY lesson_id`).all(...wordIds);
  const byWord = new Map();
  rows.forEach((row) => {
    if (!byWord.has(row.word_id)) byWord.set(row.word_id, []);
    byWord.get(row.word_id).push(row.lesson_id);
  });
  return byWord;
}

function getExamples(database, wordIds) {
  if (!wordIds.length) return new Map();
  const placeholders = wordIds.map(() => '?').join(',');
  const rows = database.prepare(`SELECT id, word_id, position, text FROM examples WHERE word_id IN (${placeholders}) ORDER BY position, id`).all(...wordIds);
  const byWord = new Map();
  rows.forEach((row) => {
    if (!byWord.has(row.word_id)) byWord.set(row.word_id, []);
    byWord.get(row.word_id).push(row);
  });
  return byWord;
}

function getExampleTranslations(database, exampleIds) {
  if (!exampleIds.length) return new Map();
  const placeholders = exampleIds.map(() => '?').join(',');
  const rows = database.prepare(`SELECT example_id, lang_code, text FROM example_translations WHERE example_id IN (${placeholders})`).all(...exampleIds);
  const byExample = new Map();
  rows.forEach((row) => {
    if (!byExample.has(row.example_id)) byExample.set(row.example_id, {});
    byExample.get(row.example_id)[row.lang_code] = row.text;
  });
  return byExample;
}

function getCanonicalWordRows(database, courseCode) {
  if (tableExists(database, 'vocab_words')) {
    return database.prepare('SELECT * FROM vocab_words WHERE courseId = ? ORDER BY word COLLATE NOCASE').all(courseCode);
  }
  return database.prepare('SELECT * FROM words WHERE lang_code = ? ORDER BY word COLLATE NOCASE').all(courseCode);
}

function collectWordPayload(database, wordRow) {
  const translationMap = getWordTranslations(database, [wordRow.id]);
  const phoneticMap = getWordPhonetics(database, [wordRow.id]);
  const lessons = getWordLessons(database, [wordRow.id]).get(wordRow.id) || [];
  const exampleRows = getExamples(database, [wordRow.id]).get(wordRow.id) || [];
  const exampleTranslations = getExampleTranslations(database, exampleRows.map((example) => example.id));

  const examples = exampleRows.map((example) => {
    const translations = exampleTranslations.get(example.id) || {};
    return {
      text: example.text,
      trans: translations,
      position: example.position
    };
  });

  const trans = translationMap.get(wordRow.id) || {};
  const phon = phoneticMap.get(wordRow.id) || {};
  const firstExample = examples[0] || { text: '', trans: {} };

  return {
    id: wordRow.id,
    word: wordRow.word,
    phon,
    trans,
    example: {
      text: firstExample.text || '',
      trans: firstExample.trans || {}
    },
    examples,
    lesson: wordRow.lesson || (lessons[0] || ''),
    lessons,
    path: wordRow.path || '',
    topic: wordRow.topic || '',
    category: wordRow.category || '',
    type: wordRow.type || '',
    source: wordRow.source || 'course',
    courseId: wordRow.courseId || wordRow.lang_code || ''
  };
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

function normalizeSearchTargets(word, definitions, examples, lessonList) {
  const targets = [
    word.word,
    word.lesson,
    ...lessonList,
    ...(word.path ? [word.path] : []),
    ...(word.topic ? [word.topic] : []),
    ...(word.category ? [word.category] : []),
    ...(word.type ? [word.type] : [])
  ];

  Object.values(definitions || {}).forEach((translation) => {
    if (translation) targets.push(translation);
  });
  (examples || []).forEach((entry) => {
    targets.push(entry.text || '');
    Object.values(entry.trans || {}).forEach((value) => targets.push(value || ''));
  });
  return targets;
}

router.get('/', (req, res) => {
  const database = getDb();
  const courseCode = normalizeCourseCode(req.query.course);
  if (!courseCode) return res.status(400).json({ error: 'Missing course query parameter.' });

  const courseRecord = getCourseRecord(database, courseCode);
  if (!courseRecord) return res.status(400).json({ error: `Unknown course: ${courseCode}` });

  const ids = parseIds(req.query.ids);
  if (ids.length) {
    const payload = getWordLookup(database, ids);
    const orderedIds = ids.filter((id) => payload.has(id));
    return res.json(orderedIds.map((id) => collectWordPayload(database, payload.get(id))));
  }

  const rows = getCanonicalWordRows(database, courseCode);
  return res.json(rows.map((row) => collectWordPayload(database, row)));
});

router.get('/search', (req, res) => {
  const database = getDb();
  const courseCode = normalizeCourseCode(req.query.course);
  const query = String(req.query.q || '').trim();
  const limit = Math.max(1, Math.min(Number(req.query.limit) || 20, 100));

  if (!courseCode) return res.status(400).json({ error: 'Missing course query parameter.' });
  if (!query) return res.json([]);

  const rows = getCanonicalWordRows(database, courseCode);
  const translations = getWordTranslations(database, rows.map((row) => row.id));
  const examples = getExamples(database, rows.map((row) => row.id));
  const exampleTranslations = getExampleTranslations(database, (rows.flatMap((row) => (examples.get(row.id) || []).map((example) => example.id))));

  const matches = rows
    .map((row) => {
      const rowTranslations = translations.get(row.id) || {};
      const rowExamples = (examples.get(row.id) || []).map((example) => ({
        text: example.text,
        trans: exampleTranslations.get(example.id) || {}
      }));
      const normalizedTargets = normalizeSearchTargets(row, rowTranslations, rowExamples, (getWordLessons(database, [row.id]).get(row.id) || []));
      const bestScore = Math.min(...normalizedTargets.map((target) => buildSearchScore(query, target)));
      return { row, bestScore, normalizedTargets };
    })
    .filter((entry) => entry.bestScore < 3)
    .sort((left, right) => {
      if (left.bestScore !== right.bestScore) return left.bestScore - right.bestScore;
      return left.row.word.localeCompare(right.row.word, undefined, { sensitivity: 'base' });
    })
    .slice(0, limit)
    .map((entry) => collectWordPayload(database, entry.row));

  return res.json(matches);
});

router.get('/by-lesson', (req, res) => {
  const database = getDb();
  const courseCode = normalizeCourseCode(req.query.course);
  const lessonId = String(req.query.lesson || '').trim();

  if (!courseCode) return res.status(400).json({ error: 'Missing course query parameter.' });
  if (!lessonId) return res.status(400).json({ error: 'Missing lesson query parameter.' });

  const rows = tableExists(database, 'vocab_words')
    ? database.prepare('SELECT * FROM vocab_words WHERE courseId = ? AND lesson = ? ORDER BY word COLLATE NOCASE').all(courseCode, lessonId)
    : database.prepare('SELECT words.* FROM words INNER JOIN word_lessons ON word_lessons.word_id = words.id WHERE words.lang_code = ? AND word_lessons.lesson_id = ? ORDER BY words.word COLLATE NOCASE').all(courseCode, lessonId);

  return res.json(rows.map((row) => collectWordPayload(database, row)));
});

module.exports = router;
