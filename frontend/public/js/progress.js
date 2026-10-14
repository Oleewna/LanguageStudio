(function (window) {
  const { LocalStorageAdapter } = window.__LSProgressAdapters || {};

  if (!LocalStorageAdapter) {
    return;
  }

  const DEFAULT_USER_ID = 'local';
  const DEFAULT_PROGRESSION = Object.freeze({
    dailyGoalDefault: 50,
    dailyGoalOptions: [20, 50, 100],
    passScore: 0.7,
    levels: { type: 'linear', xpPerLevel: 100 },
    xp: {
      mcq: 15,
      blank: 10,
      reorder: 10,
      match: 20,
      gameComplete: 50,
      wordLearned: 5,
      customWordAdded: 25
    },
    weakWords: { weakMinWrong: 2, weakClearStreak: 2 }
  });

  function dispatchProgressEvent(eventName, detail) {
    if (typeof window === 'undefined' || typeof window.dispatchEvent !== 'function') {
      return;
    }

    try {
      window.dispatchEvent(new CustomEvent(eventName, { detail }));
    } catch (error) {
      // CustomEvent may not exist in older browser environments; ignore gracefully.
    }
  }

  function getProgressionConfig() {
    const globalConfig = (window && window.__LSProgressConfig) || {};
    return buildProgressionConfig(globalConfig);
  }

  async function hydrateProgressionConfig() {
    if (typeof window === 'undefined' || typeof fetch !== 'function') {
      return getProgressionConfig();
    }

    const candidatePaths = [
      '/config/progression.json',
      '/frontend/public/config/progression.json',
      '../config/progression.json',
      './config/progression.json'
    ];

    for (const candidatePath of candidatePaths) {
      try {
        const response = await fetch(candidatePath, { cache: 'no-store' });
        if (!response.ok) continue;
        const nextConfig = await response.json();
        window.__LSProgressConfig = buildProgressionConfig(nextConfig);
        return getProgressionConfig();
      } catch (error) {
        // Ignore missing config files and fall back to defaults.
      }
    }

    return getProgressionConfig();
  }

  function loadLegacyDataSnapshot() {
    if (typeof localStorage === 'undefined') {
      return {};
    }

    const snapshot = {};
    const keys = Object.keys(localStorage).filter((key) => key && key.startsWith('ls_'));
    keys.forEach((key) => {
      try {
        snapshot[key] = localStorage.getItem(key);
      } catch (error) {
        snapshot[key] = null;
      }
    });
    return snapshot;
  }

  function migrateLegacyProgress() {
    if (typeof localStorage === 'undefined') {
      return false;
    }

    const profile = store.get('profile', DEFAULT_USER_ID) || createDefaultProfile(DEFAULT_USER_ID);
    const legacy = loadLegacyDataSnapshot();
    const hasLegacyXp = Object.prototype.hasOwnProperty.call(legacy, 'ls_xp');
    const hasLegacyStreak = Object.prototype.hasOwnProperty.call(legacy, 'ls_streak');
    const hasLegacyLearned = Object.prototype.hasOwnProperty.call(legacy, 'ls_dict_learned');
    const hasLegacyBestLesson = Object.prototype.hasOwnProperty.call(legacy, 'ls_unit_1_lesson_1_best_xp');

    if (profile && Number(profile.schemaVersion) >= 1 && !hasLegacyXp && !hasLegacyStreak && !hasLegacyLearned && !hasLegacyBestLesson) {
      return false;
    }

    if (hasLegacyXp) {
      const totalXp = Number(legacy.ls_xp);
      if (Number.isFinite(totalXp)) {
        profile.totalXp = totalXp;
      }
    }

    if (hasLegacyStreak) {
      const streakValue = Number(legacy.ls_streak);
      if (Number.isFinite(streakValue) && streakValue > 0) {
        const today = todayKey();
        const daily = store.get('daily', today) || createDefaultDaily(today);
        daily.xp = Math.max(toNumber(daily.xp, 0), streakValue);
        daily.updatedAt = currentIso();
        store.set('daily', today, daily);
      }
    }

    if (hasLegacyLearned) {
      const learnedWords = JSON.parse(legacy.ls_dict_learned || '[]');
      (Array.isArray(learnedWords) ? learnedWords : []).forEach((wordId) => {
        const pair = String(wordId || '').split(':');
        const courseId = pair[0] || 'it';
        const vocabId = pair[1] || wordId;
        const stats = store.get('wordStats', `${courseId}:${vocabId}`) || createDefaultWordStats(courseId, vocabId);
        stats.learned = true;
        stats.updatedAt = currentIso();
        store.set('wordStats', `${courseId}:${vocabId}`, stats);
      });
    }

    if (hasLegacyBestLesson) {
      const bestXp = Number(legacy.ls_unit_1_lesson_1_best_xp);
      if (Number.isFinite(bestXp) && bestXp > 0) {
        const lesson = store.get('lessonProgress', 'it:1.1') || createDefaultLessonProgress('it', '1.1');
        lesson.bestXp = Math.max(toNumber(lesson.bestXp, 0), bestXp);
        lesson.updatedAt = currentIso();
        store.set('lessonProgress', 'it:1.1', lesson);
      }
    }

    profile.schemaVersion = 1;
    profile.updatedAt = currentIso();
    store.set('profile', DEFAULT_USER_ID, profile);

    return hasLegacyXp || hasLegacyStreak || hasLegacyLearned || hasLegacyBestLesson;
  }

  function exportProgress() {
    const snapshot = {};
    const collections = ['profile', 'daily', 'lessonProgress', 'wordStats', 'position', 'customWords'];

    collections.forEach((collection) => {
      const entries = store.list(collection);
      snapshot[collection] = entries.reduce((accumulator, record) => {
        let id = record && record.id ? record.id : null;
        if (!id) {
          if (collection === 'profile') id = record.userId || DEFAULT_USER_ID;
          else if (collection === 'daily') id = record.date || todayKey();
          else if (collection === 'lessonProgress') id = `${record.courseId || ''}:${record.lessonId || ''}`;
          else if (collection === 'wordStats') id = `${record.courseId || ''}:${record.vocabId || ''}`;
          else if (collection === 'position') id = record.courseId || DEFAULT_USER_ID;
          else id = `${record.courseId || ''}:${record.id || ''}`;
        }
        accumulator[id] = record;
        return accumulator;
      }, {});
    });

    return snapshot;
  }

  function importProgress(payload = {}) {
    const collections = payload && typeof payload === 'object' ? Object.keys(payload) : [];

    collections.forEach((collection) => {
      const records = payload[collection] || {};
      Object.entries(records).forEach(([id, record]) => {
        if (!record || typeof record !== 'object') return;
        store.set(collection, id, record);
      });
    });

    return true;
  }

  function currentIso() {
    return new Date().toISOString();
  }

  function todayKey(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function toNumber(value, fallback = 0) {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : fallback;
  }

  function isSameDayKey(dateKey, candidateKey) {
    return String(dateKey || '') === String(candidateKey || '');
  }

  function createDefaultProfile(userId = DEFAULT_USER_ID) {
    const config = getProgressionConfig();
    return {
      userId: String(userId || DEFAULT_USER_ID),
      createdAt: currentIso(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
      sourceLanguage: 'device',
      activeCourseId: '',
      dailyGoalXp: config.dailyGoalDefault,
      effectsEnabled: true,
      totalXp: 0,
      lastCelebratedLevel: 0,
      schemaVersion: 1,
      updatedAt: currentIso()
    };
  }

  function createDefaultDaily(dateKey) {
    const config = getProgressionConfig();
    return {
      date: String(dateKey || todayKey()),
      xp: 0,
      xpByCourse: {},
      lessonsCompleted: 0,
      wordsLearned: 0,
      exercisesAnswered: 0,
      exercisesCorrect: 0,
      goalXp: config.dailyGoalDefault,
      goalMet: false,
      updatedAt: currentIso()
    };
  }

  function createDefaultLessonProgress(courseId, lessonId) {
    return {
      courseId: String(courseId || ''),
      lessonId: String(lessonId || ''),
      state: 'not_started',
      bestScore: 0,
      lastScore: 0,
      attempts: 0,
      bestXp: 0,
      firstOpenedAt: null,
      lastOpenedAt: null,
      completedAt: null,
      updatedAt: currentIso()
    };
  }

  function createDefaultWordStats(courseId, vocabId) {
    return {
      courseId: String(courseId || ''),
      vocabId: String(vocabId || ''),
      learned: false,
      correct: 0,
      wrong: 0,
      correctInRow: 0,
      lastResult: null,
      lastSeenAt: null,
      lastWrongAt: null,
      updatedAt: currentIso()
    };
  }

  function createDefaultPosition(courseId) {
    return {
      type: 'lesson',
      refId: '',
      url: '',
      at: currentIso(),
      courseId: String(courseId || '')
    };
  }

  function createDefaultRecord(collection, id) {
    switch (collection) {
      case 'profile':
        return createDefaultProfile(id || DEFAULT_USER_ID);
      case 'daily':
        return createDefaultDaily(id || todayKey());
      case 'lessonProgress': {
        const [courseId, lessonId] = String(id || '').split(':');
        return createDefaultLessonProgress(courseId, lessonId);
      }
      case 'wordStats': {
        const [courseId, vocabId] = String(id || '').split(':');
        return createDefaultWordStats(courseId, vocabId);
      }
      case 'position':
        return createDefaultPosition(id || '');
      case 'customWords':
        return {
          id: String(id || ''),
          createdAt: currentIso(),
          updatedAt: currentIso()
        };
      default:
        return null;
    }
  }

  function buildProgressionConfig(overrides = {}) {
    return {
      ...DEFAULT_PROGRESSION,
      ...overrides,
      levels: {
        ...DEFAULT_PROGRESSION.levels,
        ...(overrides.levels || {})
      },
      xp: {
        ...DEFAULT_PROGRESSION.xp,
        ...(overrides.xp || {})
      },
      weakWords: {
        ...DEFAULT_PROGRESSION.weakWords,
        ...(overrides.weakWords || {})
      }
    };
  }

  function dateKeyFromDate(value = new Date()) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return todayKey();
    }
    return todayKey(date);
  }

  function getLevelInfo(totalXp, config = DEFAULT_PROGRESSION) {
    const nextConfig = buildProgressionConfig(config);
    const xpPerLevel = toNumber(nextConfig.levels.xpPerLevel, 100);
    const numericTotal = Math.max(0, toNumber(totalXp, 0));
    const level = Math.floor(numericTotal / xpPerLevel) + 1;
    const xpIntoLevel = numericTotal - ((level - 1) * xpPerLevel);
    const xpForNextLevel = xpPerLevel;
    return {
      level,
      xpIntoLevel,
      xpForNextLevel,
      xpTotal: numericTotal,
      progress: xpForNextLevel > 0 ? xpIntoLevel / xpForNextLevel : 0,
      nextLevelAt: level * xpPerLevel
    };
  }

  function getDailyGoal(daily, profile = null, config = DEFAULT_PROGRESSION) {
    const nextConfig = buildProgressionConfig(config);
    const profileGoal = profile && profile.dailyGoalXp ? toNumber(profile.dailyGoalXp, nextConfig.dailyGoalDefault) : nextConfig.dailyGoalDefault;
    const safeDaily = daily || {};
    const goal = toNumber(safeDaily.goalXp, profileGoal);
    const todayXp = toNumber(safeDaily.xp, 0);
    const fill = goal > 0 ? Math.min(todayXp / goal, 1) : 0;
    return {
      goal,
      todayXp,
      fill,
      goalMet: Boolean(safeDaily.goalMet) || todayXp >= goal,
      remaining: Math.max(goal - todayXp, 0)
    };
  }

  function getStreak(dailyRecords = [], today = new Date()) {
    const byDate = new Map();
    (Array.isArray(dailyRecords) ? dailyRecords : []).forEach((entry) => {
      const record = entry || {};
      if (!record.date) return;
      byDate.set(String(record.date), record);
    });

    function isActiveOn(dateObject) {
      const key = dateKeyFromDate(dateObject);
      const record = byDate.get(key) || null;
      return Boolean(record && toNumber(record.xp, 0) > 0);
    }

    const currentDate = new Date(today);
    let currentStreak = 0;
    let streakCursor = new Date(currentDate);
    let activeToday = isActiveOn(streakCursor);

    if (activeToday) {
      while (isActiveOn(streakCursor)) {
        currentStreak += 1;
        streakCursor.setDate(streakCursor.getDate() - 1);
      }
    } else {
      const yesterday = new Date(currentDate);
      yesterday.setDate(yesterday.getDate() - 1);
      if (isActiveOn(yesterday)) {
        currentStreak = 1;
        streakCursor = new Date(yesterday);
        while (isActiveOn(streakCursor)) {
          currentStreak += 1;
          streakCursor.setDate(streakCursor.getDate() - 1);
        }
      }
    }

    let longestStreak = 0;
    let running = 0;
    const dates = Array.from(byDate.keys()).sort();
    dates.forEach((dateKey) => {
      const record = byDate.get(dateKey) || {};
      if (toNumber(record.xp, 0) > 0) {
        running += 1;
        longestStreak = Math.max(longestStreak, running);
      } else {
        running = 0;
      }
    });

    return {
      currentStreak,
      longestStreak,
      activeToday,
      atRisk: !activeToday && currentStreak > 0
    };
  }

  function getLessonDisplayState(contentStatus, learnerState, config = DEFAULT_PROGRESSION) {
    const passScore = toNumber((config && config.passScore) || DEFAULT_PROGRESSION.passScore, DEFAULT_PROGRESSION.passScore);
    const normalizedStatus = String(contentStatus || 'available');
    const normalizedState = String(learnerState || 'not_started');

    if (normalizedStatus !== 'available') {
      return 'locked';
    }

    if (normalizedState === 'completed' || normalizedState === 'passed') {
      return 'completed';
    }

    if (normalizedState === 'in_progress') {
      return 'in_progress';
    }

    if (normalizedState === 'not_started' || normalizedState === 'none') {
      return 'available';
    }

    return normalizedState === 'completed' ? 'completed' : 'available';
  }

  function getWeakWords(courseId, options = [], config = DEFAULT_PROGRESSION) {
    const nextConfig = buildProgressionConfig(config);
    const weakMinWrong = toNumber(nextConfig.weakWords.weakMinWrong, 2);
    const weakClearStreak = toNumber(nextConfig.weakWords.weakClearStreak, 2);
    const normalizedOptions = Array.isArray(options) ? { limit: null } : (options || {});
    const wordStatsCollection = Array.isArray(options)
      ? options
      : (typeof store !== 'undefined' && store && typeof store.list === 'function'
        ? store.list('wordStats', { courseId })
        : []);

    const records = (Array.isArray(wordStatsCollection) ? wordStatsCollection : [])
      .filter((record) => record && record.courseId === courseId)
      .filter((record) => {
        const lastResult = record.lastResult;
        const wrongCount = toNumber(record.wrong, 0);
        const correctInRow = toNumber(record.correctInRow, 0);
        const isWeakByLastWrong = lastResult === 'wrong';
        const isWeakByThreshold = wrongCount >= weakMinWrong && correctInRow < weakClearStreak;
        return isWeakByLastWrong || isWeakByThreshold;
      })
      .sort((left, right) => {
        const leftWrong = toNumber(left.lastResult === 'wrong' ? Date.parse(left.lastSeenAt || left.updatedAt) : 0, 0);
        const rightWrong = toNumber(right.lastResult === 'wrong' ? Date.parse(right.lastSeenAt || right.updatedAt) : 0, 0);
        if (rightWrong !== leftWrong) return rightWrong - leftWrong;
        return toNumber(right.wrong, 0) - toNumber(left.wrong, 0);
      });

    const limit = normalizedOptions && Number.isFinite(Number(normalizedOptions.limit)) ? Number(normalizedOptions.limit) : null;
    return limit === null ? records : records.slice(0, Math.max(0, limit));
  }

  // Recording points:
  // - recordXp({ courseId, amount, source, refId })
  // - recordLessonOpened(courseId, lessonId)
  // - recordLessonResult(courseId, lessonId, { score, xp })
  // - setWordLearned(courseId, vocabId, bool)
  // - recordWordResult(courseId, vocabId, isCorrect)
  // - setPosition(courseId, { type, refId, url })

  async function ensureProfile(userId = DEFAULT_USER_ID) {
    return getOrCreateRecord('profile', userId);
  }

  async function ensureDaily(dateKey = todayKey()) {
    return getOrCreateRecord('daily', dateKey);
  }

  async function ensureLessonProgress(courseId, lessonId) {
    return getOrCreateRecord('lessonProgress', `${courseId}:${lessonId}`);
  }

  async function ensureWordStats(courseId, vocabId) {
    return getOrCreateRecord('wordStats', `${courseId}:${vocabId}`);
  }

  async function recordXp({ courseId, amount = 0, source = 'lesson', refId = '' } = {}) {
    const profile = await ensureProfile(DEFAULT_USER_ID);
    const dateKey = todayKey();
    const daily = await ensureDaily(dateKey);
    const xpAmount = toNumber(amount, 0);
    const previousTotalXp = toNumber(profile.totalXp, 0);

    if (xpAmount <= 0) {
      return { profile, daily, amount: 0 };
    }

    profile.totalXp = previousTotalXp + xpAmount;
    daily.xp = toNumber(daily.xp, 0) + xpAmount;
    daily.goalXp = toNumber(daily.goalXp, toNumber(profile.dailyGoalXp, getProgressionConfig().dailyGoalDefault));
    daily.xpByCourse = daily.xpByCourse || {};
    daily.xpByCourse[courseId] = toNumber(daily.xpByCourse[courseId], 0) + xpAmount;
    daily.updatedAt = currentIso();
    profile.updatedAt = currentIso();

    if (daily.xp >= daily.goalXp && !daily.goalMet) {
      daily.goalMet = true;
      dispatchProgressEvent('progress:goalReached', { date: dateKey, goalXp: daily.goalXp });
    }

    const previousLevel = getLevelInfo(previousTotalXp).level;
    const nextLevel = getLevelInfo(profile.totalXp).level;
    if (nextLevel > previousLevel && nextLevel > toNumber(profile.lastCelebratedLevel, 0)) {
      profile.lastCelebratedLevel = nextLevel;
      dispatchProgressEvent('progress:levelUp', { level: nextLevel });
    }

    dispatchProgressEvent('progress:xp', { amount: xpAmount, totalXp: profile.totalXp, source, refId });
    dispatchProgressEvent('progress:changed', { collection: 'profile', id: DEFAULT_USER_ID });
    dispatchProgressEvent('progress:changed', { collection: 'daily', id: dateKey });

    store.set('profile', DEFAULT_USER_ID, profile);
    store.set('daily', dateKey, daily);

    return { profile, daily, amount: xpAmount, source, refId };
  }

  async function recordLessonOpened(courseId, lessonId) {
    const entry = await ensureLessonProgress(courseId, lessonId);
    const now = currentIso();

    entry.state = entry.state === 'completed' ? 'completed' : 'in_progress';
    entry.firstOpenedAt = entry.firstOpenedAt || now;
    entry.lastOpenedAt = now;
    entry.updatedAt = now;

    store.set('lessonProgress', `${courseId}:${lessonId}`, entry);
    dispatchProgressEvent('progress:changed', { collection: 'lessonProgress', id: `${courseId}:${lessonId}` });
    await setPosition(courseId, { type: 'lesson', refId: lessonId, url: `lesson.html?id=${encodeURIComponent(lessonId)}` });
    return entry;
  }

  async function recordLessonResult(courseId, lessonId, { score = 0, xp = 0 } = {}) {
    const entry = await ensureLessonProgress(courseId, lessonId);
    const now = currentIso();
    const numericScore = Math.min(Math.max(toNumber(score, 0), 0), 1);
    const wasCompleted = entry.state === 'completed';

    entry.attempts = toNumber(entry.attempts, 0) + 1;
    entry.lastScore = numericScore;
    entry.bestScore = Math.max(toNumber(entry.bestScore, 0), numericScore);
    entry.lastOpenedAt = now;
    entry.updatedAt = now;

    if (numericScore >= toNumber(getProgressionConfig().passScore, 0.7)) {
      entry.state = 'completed';
      entry.completedAt = entry.completedAt || now;
      entry.bestXp = Math.max(toNumber(entry.bestXp, 0), toNumber(xp, 0));
    } else {
      entry.state = 'in_progress';
    }

    if (toNumber(xp, 0) > 0) {
      await recordXp({ courseId, amount: toNumber(xp, 0), source: 'lesson', refId: lessonId });
    }

    store.set('lessonProgress', `${courseId}:${lessonId}`, entry);
    dispatchProgressEvent('progress:changed', { collection: 'lessonProgress', id: `${courseId}:${lessonId}` });
    if (!wasCompleted && entry.state === 'completed') {
      dispatchProgressEvent('progress:lessonCompleted', { courseId, lessonId, score: numericScore });
    }
    return entry;
  }

  async function setWordLearned(courseId, vocabId, learned = true) {
    const stats = await ensureWordStats(courseId, vocabId);
    const wasLearned = Boolean(stats.learned);
    stats.learned = Boolean(learned);
    stats.updatedAt = currentIso();
    store.set('wordStats', `${courseId}:${vocabId}`, stats);
    dispatchProgressEvent('progress:changed', { collection: 'wordStats', id: `${courseId}:${vocabId}` });
    if (!wasLearned && stats.learned) {
      dispatchProgressEvent('progress:wordLearned', { courseId, vocabId });
    }
    return stats;
  }

  async function recordWordResult(courseId, vocabId, isCorrect = false) {
    const stats = await ensureWordStats(courseId, vocabId);
    const now = currentIso();
    const correct = Boolean(isCorrect);

    stats.correct = toNumber(stats.correct, 0) + (correct ? 1 : 0);
    stats.wrong = toNumber(stats.wrong, 0) + (correct ? 0 : 1);
    stats.correctInRow = correct ? toNumber(stats.correctInRow, 0) + 1 : 0;
    stats.lastResult = correct ? 'correct' : 'wrong';
    stats.lastSeenAt = now;
    if (!correct) {
      stats.lastWrongAt = now;
    }
    stats.updatedAt = now;

    store.set('wordStats', `${courseId}:${vocabId}`, stats);
    dispatchProgressEvent('progress:changed', { collection: 'wordStats', id: `${courseId}:${vocabId}` });
    return stats;
  }

  async function setPosition(courseId, { type = 'lesson', refId = '', url = '' } = {}) {
    const position = await getOrCreateRecord('position', courseId);
    const nextPosition = {
      ...position,
      courseId: String(courseId || position.courseId || ''),
      type: String(type || 'lesson'),
      refId: String(refId || ''),
      url: String(url || ''),
      at: currentIso()
    };
    store.set('position', courseId, nextPosition);
    dispatchProgressEvent('progress:changed', { collection: 'position', id: courseId });
    return nextPosition;
  }

  function normalizeCourseId(courseId) {
    return String(courseId || '').trim();
  }

  // Replace this adapter construction with ApiAdapter when a server-backed store is added.
  const store = new LocalStorageAdapter(DEFAULT_USER_ID);

  async function getOrCreateRecord(collection, id) {
    const existing = store.get(collection, id);
    if (existing && typeof existing === 'object') {
      return existing;
    }

    const defaults = createDefaultRecord(collection, id);
    if (!defaults) {
      return null;
    }

    return store.set(collection, id, defaults);
  }

  window.Progress = Object.freeze({
    async get(collection, id) {
      return getOrCreateRecord(collection, id);
    },
    async set(collection, id, record) {
      return store.set(collection, id, record);
    },
    async update(collection, id, patch) {
      return store.update(collection, id, patch);
    },
    async list(collection, filter) {
      return store.list(collection, filter);
    },
    async remove(collection, id) {
      return store.remove(collection, id);
    },
    async getProfile(userId = DEFAULT_USER_ID) {
      return getOrCreateRecord('profile', userId);
    },
    async getDaily(dateKey = todayKey()) {
      return getOrCreateRecord('daily', dateKey);
    },
    async getLessonProgress(courseId, lessonId) {
      return getOrCreateRecord('lessonProgress', `${courseId}:${lessonId}`);
    },
    async getWordStats(courseId, vocabId) {
      return getOrCreateRecord('wordStats', `${courseId}:${vocabId}`);
    },
    async getPosition(courseId) {
      return getOrCreateRecord('position', courseId);
    },
    async loadProgressionConfig() {
      return hydrateProgressionConfig();
    },
    async migrate() {
      return migrateLegacyProgress();
    },
    exportProgress,
    importProgress,
    getLevelInfo,
    getDailyGoal,
    getStreak,
    getLessonDisplayState,
    getWeakWords,
    recordXp,
    recordLessonOpened,
    recordLessonResult,
    setWordLearned,
    recordWordResult,
    setPosition,
    normalizeCourseId
  });

  hydrateProgressionConfig();
  migrateLegacyProgress();
})(window);