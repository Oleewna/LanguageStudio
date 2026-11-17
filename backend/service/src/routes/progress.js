const express = require('express');
const { PROGRESS_MODELS } = require('../models/Progress');
const { mergeRecord, mergePayloads, getEntityKey } = require('../services/progressConflict');

const router = express.Router();

// Canonical collection names mapping
const COLLECTION_ALIASES = {
  profile: 'profile',
  profiles: 'profile',
  daily: 'daily',
  daily_activity: 'daily',
  lessonprogress: 'lessonProgress',
  lesson_progress: 'lessonProgress',
  wordstats: 'wordStats',
  word_stats: 'wordStats',
  position: 'position',
  last_position: 'position',
  positions: 'position',
  customwords: 'customWords',
  custom_words: 'customWords'
};

function normalizeCollection(name) {
  if (!name) return null;
  const key = String(name).toLowerCase();
  return COLLECTION_ALIASES[key] || null;
}

// Authentication middleware for /api/progress
function requireAuth(req, res, next) {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ error: 'Not authenticated.' });
  }
  next();
}

router.use(requireAuth);

function parsePrimaryKey(collection, id, body = {}, userId) {
  const safeId = decodeURIComponent(String(id || '').trim());
  switch (collection) {
    case 'profile':
      return { userId };
    case 'daily':
      return { userId, date: safeId || body.date };
    case 'lessonProgress': {
      if (safeId.includes(':')) {
        const [courseId, ...rest] = safeId.split(':');
        return { userId, courseId, lessonId: rest.join(':') };
      }
      return {
        userId,
        courseId: body.courseId || 'it',
        lessonId: safeId || body.lessonId
      };
    }
    case 'wordStats': {
      if (safeId.includes(':')) {
        const [courseId, ...rest] = safeId.split(':');
        return { userId, courseId, vocabId: rest.join(':') };
      }
      return {
        userId,
        courseId: body.courseId || 'it',
        vocabId: safeId || body.vocabId
      };
    }
    case 'position':
      return { userId, courseId: safeId || body.courseId || 'it' };
    case 'customWords': {
      if (safeId.includes(':')) {
        const [courseId, ...rest] = safeId.split(':');
        return { userId, courseId, wordId: rest.join(':') };
      }
      return {
        userId,
        courseId: body.courseId || 'it',
        wordId: safeId || body.wordId || body.id
      };
    }
    default:
      return { userId, id: safeId };
  }
}

// GET /api/progress - Returns complete snapshot across all 6 collections
router.get('/', async (req, res, next) => {
  try {
    const userId = req.session.userId;
    const collections = ['profile', 'daily', 'lessonProgress', 'wordStats', 'position', 'customWords'];
    const snapshot = {};

    for (const coll of collections) {
      const model = PROGRESS_MODELS[coll];
      const records = await model.find({ userId });
      const collectionMap = {};
      records.forEach((rec) => {
        const key = getEntityKey(coll, rec);
        if (key) {
          collectionMap[key] = rec;
        }
      });
      snapshot[coll] = collectionMap;
    }

    return res.json(snapshot);
  } catch (error) {
    return next(error);
  }
});

// POST /api/progress/merge - Merge an entire guest snapshot payload into user's progress
router.post('/merge', async (req, res, next) => {
  try {
    const userId = req.session.userId;
    const incomingPayload = req.body || {};
    const collections = ['profile', 'daily', 'lessonProgress', 'wordStats', 'position', 'customWords'];

    // 1. Load current server data for user
    const currentServerPayload = {};
    for (const coll of collections) {
      const model = PROGRESS_MODELS[coll];
      const records = await model.find({ userId });
      const map = {};
      records.forEach((rec) => {
        const key = getEntityKey(coll, rec);
        if (key) map[key] = rec;
      });
      currentServerPayload[coll] = map;
    }

    // 2. Merge local + server with conflict policy
    const mergedSnapshot = mergePayloads(incomingPayload, currentServerPayload);

    // 3. Persist merged records to database
    for (const coll of collections) {
      const model = PROGRESS_MODELS[coll];
      const recordsMap = mergedSnapshot[coll] || {};
      for (const [key, record] of Object.entries(recordsMap)) {
        if (!record || typeof record !== 'object') continue;
        const pkFilter = parsePrimaryKey(coll, key, record, userId);
        const toSave = { ...record, ...pkFilter, userId };
        await model.upsert(pkFilter, toSave);
      }
    }

    // Return the resulting snapshot
    return res.json({
      success: true,
      merged: mergedSnapshot
    });
  } catch (error) {
    return next(error);
  }
});

// GET /api/progress/:collection - List all records for collection
router.get('/:collection', async (req, res, next) => {
  try {
    const coll = normalizeCollection(req.params.collection);
    if (!coll || !PROGRESS_MODELS[coll]) {
      return res.status(404).json({ error: `Unknown collection: ${req.params.collection}` });
    }

    const userId = req.session.userId;
    const filter = { userId };
    if (req.query.courseId) filter.courseId = req.query.courseId;
    if (req.query.date) filter.date = req.query.date;

    const records = await PROGRESS_MODELS[coll].find(filter);
    return res.json(records);
  } catch (error) {
    return next(error);
  }
});

// GET /api/progress/:collection/:id - Get a single record
router.get('/:collection/:id', async (req, res, next) => {
  try {
    const coll = normalizeCollection(req.params.collection);
    if (!coll || !PROGRESS_MODELS[coll]) {
      return res.status(404).json({ error: `Unknown collection: ${req.params.collection}` });
    }

    const userId = req.session.userId;
    const pk = parsePrimaryKey(coll, req.params.id, {}, userId);
    const record = await PROGRESS_MODELS[coll].findOne(pk);
    if (!record) {
      return res.status(404).json({ error: 'Record not found.' });
    }

    return res.json(record);
  } catch (error) {
    return next(error);
  }
});

// PUT /api/progress/:collection/:id - Set / Upsert with conflict policy
router.put('/:collection/:id', async (req, res, next) => {
  try {
    const coll = normalizeCollection(req.params.collection);
    if (!coll || !PROGRESS_MODELS[coll]) {
      return res.status(404).json({ error: `Unknown collection: ${req.params.collection}` });
    }

    const userId = req.session.userId;
    const body = req.body || {};
    const pk = parsePrimaryKey(coll, req.params.id, body, userId);

    const existing = await PROGRESS_MODELS[coll].findOne(pk);
    const merged = existing ? mergeRecord(body, existing, coll) : { ...body, ...pk };
    merged.userId = userId;
    if (!merged.updatedAt) {
      merged.updatedAt = new Date().toISOString();
    }

    const saved = await PROGRESS_MODELS[coll].upsert(pk, merged);
    return res.json(saved);
  } catch (error) {
    return next(error);
  }
});

// PATCH /api/progress/:collection/:id - Update with conflict policy
router.patch('/:collection/:id', async (req, res, next) => {
  try {
    const coll = normalizeCollection(req.params.collection);
    if (!coll || !PROGRESS_MODELS[coll]) {
      return res.status(404).json({ error: `Unknown collection: ${req.params.collection}` });
    }

    const userId = req.session.userId;
    const body = req.body || {};
    const pk = parsePrimaryKey(coll, req.params.id, body, userId);

    const existing = await PROGRESS_MODELS[coll].findOne(pk);
    const patched = existing ? { ...existing, ...body } : { ...body, ...pk };
    const merged = existing ? mergeRecord(patched, existing, coll) : patched;
    merged.userId = userId;
    merged.updatedAt = new Date().toISOString();

    const saved = await PROGRESS_MODELS[coll].upsert(pk, merged);
    return res.json(saved);
  } catch (error) {
    return next(error);
  }
});

// DELETE /api/progress/:collection/:id - Delete record
router.delete('/:collection/:id', async (req, res, next) => {
  try {
    const coll = normalizeCollection(req.params.collection);
    if (!coll || !PROGRESS_MODELS[coll]) {
      return res.status(404).json({ error: `Unknown collection: ${req.params.collection}` });
    }

    const userId = req.session.userId;
    const pk = parsePrimaryKey(coll, req.params.id, {}, userId);
    await PROGRESS_MODELS[coll].deleteOne(pk);

    return res.json({ success: true });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
