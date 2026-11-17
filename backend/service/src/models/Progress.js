const mongoose = require('mongoose');

function shouldUseMemory() {
  return mongoose.connection.readyState !== 1;
}

// -------------------------------------------------------------
// 1. Profile Schema & Model
// Primary key: userId
// -------------------------------------------------------------
const profileSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    timezone: { type: String, default: 'UTC' },
    sourceLanguage: { type: String, default: 'device' },
    activeCourseId: { type: String, default: '' },
    dailyGoalXp: { type: Number, default: 50 },
    effectsEnabled: { type: Boolean, default: true },
    totalXp: { type: Number, default: 0 },
    lastCelebratedLevel: { type: Number, default: 0 },
    schemaVersion: { type: Number, default: 1 },
    createdAt: { type: String, default: () => new Date().toISOString() },
    updatedAt: { type: String, default: () => new Date().toISOString() }
  },
  { timestamps: false, collection: 'profiles' }
);

const MongooseProfile = mongoose.models.Profile || mongoose.model('Profile', profileSchema);

// -------------------------------------------------------------
// 2. Daily Activity Schema & Model
// Primary key: (userId, date)
// -------------------------------------------------------------
const dailySchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    date: { type: String, required: true },
    xp: { type: Number, default: 0 },
    xpByCourse: { type: mongoose.Schema.Types.Mixed, default: () => ({}) },
    lessonsCompleted: { type: Number, default: 0 },
    wordsLearned: { type: Number, default: 0 },
    exercisesAnswered: { type: Number, default: 0 },
    exercisesCorrect: { type: Number, default: 0 },
    goalXp: { type: Number, default: 50 },
    goalMet: { type: Boolean, default: false },
    updatedAt: { type: String, default: () => new Date().toISOString() }
  },
  { timestamps: false, collection: 'daily_activity' }
);
dailySchema.index({ userId: 1, date: 1 }, { unique: true });

const MongooseDaily = mongoose.models.DailyActivity || mongoose.model('DailyActivity', dailySchema);

// -------------------------------------------------------------
// 3. Lesson Progress Schema & Model
// Primary key: (userId, courseId, lessonId)
// -------------------------------------------------------------
const lessonProgressSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    courseId: { type: String, required: true },
    lessonId: { type: String, required: true },
    state: { type: String, default: 'not_started' },
    bestScore: { type: Number, default: 0 },
    lastScore: { type: Number, default: 0 },
    attempts: { type: Number, default: 0 },
    bestXp: { type: Number, default: 0 },
    firstOpenedAt: { type: String, default: null },
    lastOpenedAt: { type: String, default: null },
    completedAt: { type: String, default: null },
    updatedAt: { type: String, default: () => new Date().toISOString() }
  },
  { timestamps: false, collection: 'lesson_progress' }
);
lessonProgressSchema.index({ userId: 1, courseId: 1, lessonId: 1 }, { unique: true });

const MongooseLessonProgress = mongoose.models.LessonProgress || mongoose.model('LessonProgress', lessonProgressSchema);

// -------------------------------------------------------------
// 4. Word Stats Schema & Model
// Primary key: (userId, courseId, vocabId)
// -------------------------------------------------------------
const wordStatsSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    courseId: { type: String, required: true },
    vocabId: { type: String, required: true },
    learned: { type: Boolean, default: false },
    correct: { type: Number, default: 0 },
    wrong: { type: Number, default: 0 },
    correctInRow: { type: Number, default: 0 },
    lastResult: { type: String, default: null },
    lastSeenAt: { type: String, default: null },
    lastWrongAt: { type: String, default: null },
    updatedAt: { type: String, default: () => new Date().toISOString() }
  },
  { timestamps: false, collection: 'word_stats' }
);
wordStatsSchema.index({ userId: 1, courseId: 1, vocabId: 1 }, { unique: true });

const MongooseWordStats = mongoose.models.WordStats || mongoose.model('WordStats', wordStatsSchema);

// -------------------------------------------------------------
// 5. Position Schema & Model
// Primary key: (userId, courseId)
// -------------------------------------------------------------
const positionSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    courseId: { type: String, required: true },
    type: { type: String, default: 'lesson' },
    refId: { type: String, default: '' },
    url: { type: String, default: '' },
    at: { type: String, default: () => new Date().toISOString() },
    updatedAt: { type: String, default: () => new Date().toISOString() }
  },
  { timestamps: false, collection: 'last_position' }
);
positionSchema.index({ userId: 1, courseId: 1 }, { unique: true });

const MongoosePosition = mongoose.models.LastPosition || mongoose.model('LastPosition', positionSchema);

// -------------------------------------------------------------
// 6. Custom Words Schema & Model
// Primary key: (userId, courseId, wordId)
// -------------------------------------------------------------
const customWordsSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    courseId: { type: String, required: true },
    wordId: { type: String, required: true },
    id: { type: String },
    word: { type: String, default: '' },
    translation: { type: mongoose.Schema.Types.Mixed, default: '' },
    trans: { type: mongoose.Schema.Types.Mixed, default: '' },
    example: { type: mongoose.Schema.Types.Mixed, default: null },
    createdAt: { type: String, default: () => new Date().toISOString() },
    updatedAt: { type: String, default: () => new Date().toISOString() }
  },
  { timestamps: false, strict: false, collection: 'custom_words' }
);
customWordsSchema.index({ userId: 1, courseId: 1, wordId: 1 }, { unique: true });

const MongooseCustomWords = mongoose.models.CustomWords || mongoose.model('CustomWords', customWordsSchema);

// -------------------------------------------------------------
// In-Memory store for offline/test environments
// -------------------------------------------------------------
const memoryStores = {
  profile: new Map(),
  daily: new Map(),
  lessonProgress: new Map(),
  wordStats: new Map(),
  position: new Map(),
  customWords: new Map()
};

function normalizeEntityKey(collection, query = {}) {
  const userId = String(query.userId || '');
  switch (collection) {
    case 'profile':
      return `${userId}`;
    case 'daily':
      return `${userId}__${query.date || ''}`;
    case 'lessonProgress':
      return `${userId}__${query.courseId || ''}__${query.lessonId || ''}`;
    case 'wordStats':
      return `${userId}__${query.courseId || ''}__${query.vocabId || ''}`;
    case 'position':
      return `${userId}__${query.courseId || ''}`;
    case 'customWords':
      return `${userId}__${query.courseId || ''}__${query.wordId || query.id || ''}`;
    default:
      return `${userId}__${query.id || ''}`;
  }
}

function matchesFilter(record, filter = {}) {
  if (!record) return false;
  return Object.entries(filter).every(([key, val]) => {
    if (val === undefined) return true;
    return record[key] === val;
  });
}

function createModelWrapper(collectionName, MongooseModel) {
  return {
    async find(filter = {}) {
      if (!shouldUseMemory()) {
        const docs = await MongooseModel.find(filter).lean();
        return docs.map(cleanMongoDoc);
      }
      const store = memoryStores[collectionName];
      const results = [];
      for (const rec of store.values()) {
        if (matchesFilter(rec, filter)) {
          results.push({ ...rec });
        }
      }
      return results;
    },

    async findOne(filter = {}) {
      if (!shouldUseMemory()) {
        const doc = await MongooseModel.findOne(filter).lean();
        return doc ? cleanMongoDoc(doc) : null;
      }
      const store = memoryStores[collectionName];
      for (const rec of store.values()) {
        if (matchesFilter(rec, filter)) {
          return { ...rec };
        }
      }
      return null;
    },

    async upsert(filter, updateData) {
      const dataToSave = { ...filter, ...updateData };
      if (!shouldUseMemory()) {
        const doc = await MongooseModel.findOneAndUpdate(
          filter,
          { $set: dataToSave },
          { new: true, upsert: true, runValidators: true }
        ).lean();
        return cleanMongoDoc(doc);
      }
      const store = memoryStores[collectionName];
      const key = normalizeEntityKey(collectionName, dataToSave);
      const existing = store.get(key) || {};
      const saved = { ...existing, ...dataToSave };
      store.set(key, saved);
      return { ...saved };
    },

    async deleteOne(filter = {}) {
      if (!shouldUseMemory()) {
        const res = await MongooseModel.deleteOne(filter);
        return { acknowledged: true, deletedCount: res.deletedCount || 0 };
      }
      const store = memoryStores[collectionName];
      for (const [key, rec] of store.entries()) {
        if (matchesFilter(rec, filter)) {
          store.delete(key);
          return { acknowledged: true, deletedCount: 1 };
        }
      }
      return { acknowledged: true, deletedCount: 0 };
    },

    async deleteMany(filter = {}) {
      if (!shouldUseMemory()) {
        const res = await MongooseModel.deleteMany(filter);
        return { acknowledged: true, deletedCount: res.deletedCount || 0 };
      }
      const store = memoryStores[collectionName];
      let count = 0;
      for (const [key, rec] of store.entries()) {
        if (matchesFilter(rec, filter)) {
          store.delete(key);
          count += 1;
        }
      }
      return { acknowledged: true, deletedCount: count };
    }
  };
}

function cleanMongoDoc(doc) {
  if (!doc) return null;
  const clone = { ...doc };
  delete clone._id;
  delete clone.__v;
  return clone;
}

const Profile = createModelWrapper('profile', MongooseProfile);
const Daily = createModelWrapper('daily', MongooseDaily);
const LessonProgress = createModelWrapper('lessonProgress', MongooseLessonProgress);
const WordStats = createModelWrapper('wordStats', MongooseWordStats);
const Position = createModelWrapper('position', MongoosePosition);
const CustomWords = createModelWrapper('customWords', MongooseCustomWords);

const PROGRESS_MODELS = {
  profile: Profile,
  daily: Daily,
  lessonProgress: LessonProgress,
  wordStats: WordStats,
  position: Position,
  customWords: CustomWords
};

module.exports = {
  Profile,
  Daily,
  LessonProgress,
  WordStats,
  Position,
  CustomWords,
  PROGRESS_MODELS,
  memoryStores
};
