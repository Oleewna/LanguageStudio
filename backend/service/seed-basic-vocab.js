const { getDb, closeDatabase, normalizeText } = require('./src/db/init');

const words = [
  {
    id: 'it-basic-ciao',
    word: 'ciao',
    lesson: 'basic-phrases',
    path: 'communication-basics',
    topic: 'greetings',
    category: 'greeting',
    type: 'greeting',
    translations: {
      uk: 'привіт',
      en: 'hello / hi'
    }
  },
  {
    id: 'it-basic-buongiorno',
    word: 'buongiorno',
    lesson: 'basic-phrases',
    path: 'communication-basics',
    topic: 'greetings',
    category: 'greeting',
    type: 'greeting',
    translations: {
      uk: 'доброго дня',
      en: 'good morning'
    }
  },
  {
    id: 'it-basic-grazie',
    word: 'grazie',
    lesson: 'basic-phrases',
    path: 'communication-basics',
    topic: 'politeness',
    category: 'phrase',
    type: 'phrase',
    translations: {
      uk: 'дякую',
      en: 'thank you'
    }
  },
  {
    id: 'it-basic-per-favore',
    word: 'per favore',
    lesson: 'basic-phrases',
    path: 'communication-basics',
    topic: 'politeness',
    category: 'phrase',
    type: 'phrase',
    translations: {
      uk: 'будь ласка',
      en: 'please'
    }
  },
  {
    id: 'it-basic-acqua',
    word: 'acqua',
    lesson: 'basic-words',
    path: 'communication-basics',
    topic: 'daily life',
    category: 'noun',
    type: 'noun',
    translations: {
      uk: 'вода',
      en: 'water'
    }
  },
  {
    id: 'it-basic-casa',
    word: 'casa',
    lesson: 'basic-words',
    path: 'communication-basics',
    topic: 'daily life',
    category: 'noun',
    type: 'noun',
    translations: {
      uk: 'дім',
      en: 'house'
    }
  },
  {
    id: 'it-basic-pane',
    word: 'pane',
    lesson: 'basic-words',
    path: 'communication-basics',
    topic: 'food',
    category: 'noun',
    type: 'noun',
    translations: {
      uk: 'хліб',
      en: 'bread'
    }
  },
  {
    id: 'it-basic-mangiare',
    word: 'mangiare',
    lesson: 'basic-words',
    path: 'communication-basics',
    topic: 'food',
    category: 'verb',
    type: 'verb',
    translations: {
      uk: 'їсти',
      en: 'to eat'
    }
  },
  {
    id: 'it-basic-parlare',
    word: 'parlare',
    lesson: 'basic-words',
    path: 'communication-basics',
    topic: 'communication',
    category: 'verb',
    type: 'verb',
    translations: {
      uk: 'говорити',
      en: 'to speak'
    }
  },
  {
    id: 'it-basic-uomo',
    word: 'uomo',
    lesson: 'basic-words',
    path: 'communication-basics',
    topic: 'people',
    category: 'noun',
    type: 'noun',
    translations: {
      uk: 'чоловік',
      en: 'man'
    }
  }
];

const database = getDb();

const insertWord = database.prepare(`
  INSERT OR IGNORE INTO words(id, lang_code, word, lesson, path, topic, category, type, normalized_search)
  VALUES (?, 'it', ?, ?, ?, ?, ?, ?, ?)
`);

const insertTranslation = database.prepare(`
  INSERT OR IGNORE INTO word_translations(word_id, lang_code, text)
  VALUES (?, ?, ?)
`);

const insertLesson = database.prepare(`
  INSERT OR IGNORE INTO word_lessons(word_id, lesson_id)
  VALUES (?, ?)
`);

const transaction = database.transaction(() => {
  for (const entry of words) {
    insertWord.run(
      entry.id,
      entry.word,
      entry.lesson,
      entry.path,
      entry.topic,
      entry.category,
      entry.type,
      normalizeText(entry.word)
    );

    for (const [langCode, text] of Object.entries(entry.translations)) {
      insertTranslation.run(entry.id, langCode, text);
    }

    insertLesson.run(entry.id, entry.lesson);
  }
});

transaction();
const total = database.prepare('SELECT COUNT(*) AS count FROM words WHERE lang_code = ?').get('it').count;
console.log(`Seeded ${total} basic Italian vocabulary entries into ${require('./src/db/init').dbPath}`);
closeDatabase();
