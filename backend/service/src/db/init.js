const fs = require('node:fs');
const path = require('node:path');
const Database = require('better-sqlite3');

const serviceRoot = path.resolve(__dirname, '../..');
const dataDirectory = path.join(serviceRoot, 'data');
const defaultDbPath = path.join(dataDirectory, 'vocab.db');
const dbPath = process.env.VOCAB_DB_PATH || defaultDbPath;
const schemaPath = path.join(__dirname, 'schema.sql');

function ensureDirectory(targetPath) {
  fs.mkdirSync(targetPath, { recursive: true });
}

function normalizeText(value = '') {
  return String(value || '')
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function openDatabase() {
  ensureDirectory(path.dirname(dbPath));
  const database = new Database(dbPath, { fileMustExist: false });
  database.pragma('foreign_keys = ON');
  database.pragma('journal_mode = WAL');
  return database;
}

function ensureCanonicalVocabularyTables(database) {
  const hasVocabWords = database.prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'vocab_words'").get();
  if (!hasVocabWords) return;

  const existing = database.prepare('SELECT COUNT(*) AS count FROM vocab_words').get().count;
  if (existing > 0) return;

  const rows = database.prepare('SELECT * FROM words ORDER BY id').all();
  const upsert = database.prepare(`
    INSERT OR REPLACE INTO vocab_words (
      id, courseId, word, normalizedWord, translation, language, lesson, category, type, source, createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const row of rows) {
    const translations = database.prepare('SELECT lang_code, text FROM word_translations WHERE word_id = ? ORDER BY lang_code').all(row.id);
    const primaryTranslation = translations.find((entry) => ['uk', 'en', 'it'].includes(entry.lang_code)) || translations[0] || { text: '' };
    upsert.run(
      row.id,
      row.lang_code,
      row.word,
      row.normalized_search || normalizeText(row.word),
      primaryTranslation.text || '',
      row.lang_code,
      row.lesson || '',
      row.category || '',
      row.type || '',
      'course',
      row.created_at || new Date().toISOString(),
      row.updated_at || new Date().toISOString()
    );
  }
}

let sharedDatabase = null;
function initDatabase() {
  if (sharedDatabase && sharedDatabase.open) {
    return sharedDatabase;
  }

  ensureDirectory(path.dirname(dbPath));
  const database = openDatabase();
  const schema = fs.readFileSync(schemaPath, 'utf8');
  database.exec(schema);
  ensureCanonicalVocabularyTables(database);
  sharedDatabase = database;
  return sharedDatabase;
}

function closeDatabase() {
  if (sharedDatabase && typeof sharedDatabase.close === 'function') {
    sharedDatabase.close();
  }
  sharedDatabase = null;
}

function getDb() {
  return initDatabase();
}

module.exports = {
  dbPath,
  getDb,
  initDatabase,
  closeDatabase,
  normalizeText,
  openDatabase,
  ensureDirectory
};
