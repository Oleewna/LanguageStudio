const assert = require('node:assert/strict');
const { test } = require('node:test');
const { mergeRecord, mergePayloads } = require('../src/services/progressConflict');

test('Merge conflict policy: newer updatedAt wins for scalars', () => {
  const local = {
    userId: 'u1',
    timezone: 'Europe/Kyiv',
    sourceLanguage: 'uk',
    activeCourseId: 'it',
    dailyGoalXp: 50,
    updatedAt: '2026-10-14T12:05:00.000Z'
  };

  const server = {
    userId: 'u1',
    timezone: 'UTC',
    sourceLanguage: 'en',
    activeCourseId: 'es',
    dailyGoalXp: 100,
    updatedAt: '2026-10-14T12:10:00.000Z' // Server is newer
  };

  const merged = mergeRecord(local, server, 'profile');
  assert.equal(merged.timezone, 'UTC');
  assert.equal(merged.sourceLanguage, 'en');
  assert.equal(merged.activeCourseId, 'es');
  assert.equal(merged.dailyGoalXp, 100);
  assert.equal(merged.updatedAt, '2026-10-14T12:10:00.000Z');

  // Reverse: local is newer
  const localNewer = {
    ...local,
    sourceLanguage: 'pl',
    updatedAt: '2026-10-14T12:15:00.000Z'
  };
  const merged2 = mergeRecord(localNewer, server, 'profile');
  assert.equal(merged2.sourceLanguage, 'pl');
  assert.equal(merged2.updatedAt, '2026-10-14T12:15:00.000Z');
});

test('Merge conflict policy: counters keep max regardless of which record is newer', () => {
  const olderWithHigherCounters = {
    userId: 'u1',
    totalXp: 500,
    lastCelebratedLevel: 5,
    updatedAt: '2026-10-14T10:00:00.000Z'
  };

  const newerWithLowerCounters = {
    userId: 'u1',
    totalXp: 200,
    lastCelebratedLevel: 2,
    updatedAt: '2026-10-14T12:00:00.000Z'
  };

  const merged = mergeRecord(olderWithHigherCounters, newerWithLowerCounters, 'profile');
  assert.equal(merged.totalXp, 500, 'totalXp should keep max (500)');
  assert.equal(merged.lastCelebratedLevel, 5, 'lastCelebratedLevel should keep max (5)');
  assert.equal(merged.updatedAt, '2026-10-14T12:00:00.000Z', 'updatedAt should keep latest timestamp');
});

test('Merge conflict policy: bestScore keeps max even when older', () => {
  const olderWithBestScore = {
    courseId: 'it',
    lessonId: '1.1',
    state: 'completed',
    bestScore: 0.95,
    lastScore: 0.95,
    attempts: 4,
    bestXp: 30,
    updatedAt: '2026-10-14T10:00:00.000Z'
  };

  const newerWithLowerScore = {
    courseId: 'it',
    lessonId: '1.1',
    state: 'in_progress',
    bestScore: 0.6,
    lastScore: 0.6,
    attempts: 2,
    bestXp: 20,
    updatedAt: '2026-10-14T14:00:00.000Z'
  };

  const merged = mergeRecord(olderWithBestScore, newerWithLowerScore, 'lessonProgress');
  assert.equal(merged.bestScore, 0.95, 'bestScore keeps max');
  assert.equal(merged.attempts, 4, 'attempts keeps max');
  assert.equal(merged.bestXp, 30, 'bestXp keeps max');
  assert.equal(merged.lastScore, 0.6, 'lastScore is scalar, newer wins');
  assert.equal(merged.state, 'completed', 'state remains completed when bestScore >= 0.7');
  assert.equal(merged.updatedAt, '2026-10-14T14:00:00.000Z');
});

test('Merge conflict policy: daily counters and xpByCourse keep max', () => {
  const local = {
    date: '2026-10-14',
    xp: 80,
    xpByCourse: { it: 50, es: 30 },
    lessonsCompleted: 2,
    wordsLearned: 5,
    exercisesAnswered: 20,
    exercisesCorrect: 18,
    goalXp: 50,
    goalMet: true,
    updatedAt: '2026-10-14T11:00:00.000Z'
  };

  const server = {
    date: '2026-10-14',
    xp: 90,
    xpByCourse: { it: 40, es: 50 },
    lessonsCompleted: 3,
    wordsLearned: 4,
    exercisesAnswered: 25,
    exercisesCorrect: 22,
    goalXp: 50,
    goalMet: true,
    updatedAt: '2026-10-14T12:00:00.000Z'
  };

  const merged = mergeRecord(local, server, 'daily');
  assert.equal(merged.xp, 90);
  assert.equal(merged.lessonsCompleted, 3);
  assert.equal(merged.wordsLearned, 5); // max(5, 4)
  assert.equal(merged.exercisesAnswered, 25);
  assert.equal(merged.exercisesCorrect, 22);
  assert.deepEqual(merged.xpByCourse, { it: 50, es: 50 }, 'xpByCourse merges each course keeping max');
});

test('Merge conflict policy: wordStats correct and wrong keep max', () => {
  const local = {
    courseId: 'it',
    vocabId: 'it-001',
    learned: true,
    correct: 8,
    wrong: 1,
    correctInRow: 4,
    lastResult: 'correct',
    updatedAt: '2026-10-14T10:00:00.000Z'
  };

  const server = {
    courseId: 'it',
    vocabId: 'it-001',
    learned: false,
    correct: 5,
    wrong: 3,
    correctInRow: 1,
    lastResult: 'wrong',
    updatedAt: '2026-10-14T12:00:00.000Z'
  };

  const merged = mergeRecord(local, server, 'wordStats');
  assert.equal(merged.correct, 8, 'correct keeps max');
  assert.equal(merged.wrong, 3, 'wrong keeps max');
  assert.equal(merged.lastResult, 'wrong', 'newer scalar wins');
  assert.equal(merged.learned, false, 'newer scalar wins');
});

test('Merge conflict policy: position scalars take newer updatedAt', () => {
  const local = {
    courseId: 'it',
    type: 'lesson',
    refId: '1.1',
    url: '/lesson.html?id=1.1',
    at: '2026-10-14T12:00:00.000Z'
  };

  const server = {
    courseId: 'it',
    type: 'lesson',
    refId: '1.2',
    url: '/lesson.html?id=1.2',
    at: '2026-10-14T12:30:00.000Z'
  };

  const merged = mergeRecord(local, server, 'position');
  assert.equal(merged.refId, '1.2');
  assert.equal(merged.url, '/lesson.html?id=1.2');
  assert.equal(merged.at, '2026-10-14T12:30:00.000Z');
});

test('Merge conflict policy: mergePayloads merges all collections cleanly', () => {
  const guestPayload = {
    profile: {
      local: { userId: 'local', totalXp: 120, updatedAt: '2026-10-14T09:00:00.000Z' }
    },
    daily: {
      '2026-10-14': { date: '2026-10-14', xp: 50, updatedAt: '2026-10-14T09:00:00.000Z' }
    },
    lessonProgress: {
      'it:1.1': { courseId: 'it', lessonId: '1.1', bestScore: 0.8, attempts: 1, updatedAt: '2026-10-14T09:00:00.000Z' }
    },
    wordStats: {},
    position: {
      it: { courseId: 'it', refId: '1.1', at: '2026-10-14T09:00:00.000Z' }
    },
    customWords: {
      'it:c_1': { courseId: 'it', wordId: 'c_1', word: 'ciao', updatedAt: '2026-10-14T09:00:00.000Z' }
    }
  };

  const serverPayload = {
    profile: {
      user_123: { userId: 'user_123', totalXp: 80, updatedAt: '2026-10-14T08:00:00.000Z' }
    },
    daily: {
      '2026-10-14': { date: '2026-10-14', xp: 70, updatedAt: '2026-10-14T08:30:00.000Z' }
    },
    lessonProgress: {
      'it:1.1': { courseId: 'it', lessonId: '1.1', bestScore: 0.9, attempts: 2, updatedAt: '2026-10-14T10:00:00.000Z' },
      'it:1.2': { courseId: 'it', lessonId: '1.2', bestScore: 1.0, attempts: 1, updatedAt: '2026-10-14T10:00:00.000Z' }
    },
    wordStats: {},
    position: {},
    customWords: {}
  };

  const merged = mergePayloads(guestPayload, serverPayload);
  assert.equal(merged.daily['2026-10-14'].xp, 70, 'daily max xp');
  assert.equal(merged.lessonProgress['it:1.1'].bestScore, 0.9, 'bestScore max');
  assert.equal(merged.lessonProgress['it:1.1'].attempts, 2, 'attempts max');
  assert.ok(merged.lessonProgress['it:1.2'], 'server lesson 1.2 preserved');
  assert.ok(merged.customWords['it:c_1'], 'guest custom word preserved');
});
