PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS languages (
  code TEXT PRIMARY KEY,
  name_native TEXT NOT NULL,
  is_target INTEGER NOT NULL DEFAULT 0,
  is_interface INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS vocab_words (
  id TEXT PRIMARY KEY,
  courseId TEXT NOT NULL,
  word TEXT NOT NULL,
  normalizedWord TEXT NOT NULL,
  translation TEXT NOT NULL DEFAULT '',
  language TEXT NOT NULL DEFAULT 'it',
  lesson TEXT,
  category TEXT,
  type TEXT,
  source TEXT NOT NULL DEFAULT 'course',
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS user_words (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL DEFAULT 'anonymous',
  courseId TEXT NOT NULL,
  wordId TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'manual',
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS custom_words (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL DEFAULT 'anonymous',
  courseId TEXT NOT NULL,
  word TEXT NOT NULL,
  normalizedWord TEXT NOT NULL,
  translation TEXT NOT NULL DEFAULT '',
  language TEXT NOT NULL DEFAULT 'it',
  lesson TEXT,
  category TEXT,
  type TEXT,
  source TEXT NOT NULL DEFAULT 'custom',
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS word_examples_cache (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  courseId TEXT,
  wordId TEXT,
  word TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'it',
  response_json TEXT NOT NULL CHECK (json_valid(response_json)),
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  updatedAt TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(courseId, wordId, word, language)
);

CREATE TABLE IF NOT EXISTS words (
  id TEXT PRIMARY KEY,
  lang_code TEXT NOT NULL,
  word TEXT NOT NULL,
  lesson TEXT,
  path TEXT,
  topic TEXT,
  category TEXT,
  type TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  normalized_search TEXT,
  FOREIGN KEY (lang_code) REFERENCES languages(code) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS word_lessons (
  word_id TEXT NOT NULL,
  lesson_id TEXT NOT NULL,
  PRIMARY KEY (word_id, lesson_id),
  FOREIGN KEY (word_id) REFERENCES words(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS word_translations (
  word_id TEXT NOT NULL,
  lang_code TEXT NOT NULL,
  text TEXT NOT NULL,
  PRIMARY KEY (word_id, lang_code),
  FOREIGN KEY (word_id) REFERENCES words(id) ON DELETE CASCADE,
  FOREIGN KEY (lang_code) REFERENCES languages(code) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS word_phonetics (
  word_id TEXT NOT NULL,
  lang_code TEXT NOT NULL,
  text TEXT NOT NULL,
  PRIMARY KEY (word_id, lang_code),
  FOREIGN KEY (word_id) REFERENCES words(id) ON DELETE CASCADE,
  FOREIGN KEY (lang_code) REFERENCES languages(code) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS examples (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  word_id TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  text TEXT NOT NULL,
  FOREIGN KEY (word_id) REFERENCES words(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS example_translations (
  example_id INTEGER NOT NULL,
  lang_code TEXT NOT NULL,
  text TEXT NOT NULL,
  PRIMARY KEY (example_id, lang_code),
  FOREIGN KEY (example_id) REFERENCES examples(id) ON DELETE CASCADE,
  FOREIGN KEY (lang_code) REFERENCES languages(code) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_words_lang ON words(lang_code);
CREATE INDEX IF NOT EXISTS idx_words_normalized ON words(normalized_search);
CREATE INDEX IF NOT EXISTS idx_word_lessons_lesson ON word_lessons(lesson_id);
CREATE INDEX IF NOT EXISTS idx_word_translations_lookup ON word_translations(word_id, lang_code);
CREATE INDEX IF NOT EXISTS idx_example_word ON examples(word_id, position);

INSERT OR IGNORE INTO languages(code, name_native, is_target, is_interface) VALUES
  ('it', 'Italian', 1, 0),
  ('es', 'Español', 1, 0),
  ('uk', 'Українська', 0, 1),
  ('en', 'English', 0, 1);
