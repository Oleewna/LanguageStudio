(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.__LSProgressConflict = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  const COUNTER_FIELDS = new Set([
    'totalXp',
    'lastCelebratedLevel',
    'xp',
    'lessonsCompleted',
    'wordsLearned',
    'exercisesAnswered',
    'exercisesCorrect',
    'attempts',
    'bestXp',
    'correct',
    'wrong',
    'correctInRow'
  ]);

  function parseTime(value) {
    if (!value) return 0;
    const time = Date.parse(value);
    return Number.isFinite(time) ? time : 0;
  }

  function toNumber(val, fallback = 0) {
    const num = Number(val);
    return Number.isFinite(num) ? num : fallback;
  }

  function getEntityKey(collection, record) {
    if (!record || typeof record !== 'object') return null;
    switch (collection) {
      case 'profile':
        return record.userId || 'profile';
      case 'daily':
        return record.date || null;
      case 'lessonProgress':
        return record.courseId && record.lessonId ? `${record.courseId}:${record.lessonId}` : record.id || null;
      case 'wordStats':
        return record.courseId && record.vocabId ? `${record.courseId}:${record.vocabId}` : record.id || null;
      case 'position':
        return record.courseId || 'position';
      case 'customWords':
        return record.courseId && (record.wordId || record.id)
          ? `${record.courseId}:${record.wordId || record.id}`
          : record.id || record.wordId || null;
      default:
        return record.id || null;
    }
  }

  function mergeRecord(local, server, collection) {
    if (!local && !server) return null;
    if (!local) return JSON.parse(JSON.stringify(server));
    if (!server) return JSON.parse(JSON.stringify(local));

    const timeLocal = parseTime(local.updatedAt || local.at);
    const timeServer = parseTime(server.updatedAt || server.at);

    // Rule 1: newer updatedAt wins for scalars.
    // When local is strictly newer, local scalar fields win; otherwise server scalar fields win.
    const isLocalNewer = timeLocal > timeServer;
    const newer = isLocalNewer ? local : server;
    const older = isLocalNewer ? server : local;

    const merged = { ...older, ...newer };

    // Resolve max updatedAt timestamp
    const maxTime = Math.max(timeLocal, timeServer);
    if (maxTime > 0) {
      merged.updatedAt = new Date(maxTime).toISOString();
      if (newer.at || older.at) {
        merged.at = merged.updatedAt;
      }
    }

    // Preserve earliest createdAt if present
    const createdLocal = parseTime(local.createdAt);
    const createdServer = parseTime(server.createdAt);
    if (createdLocal > 0 && createdServer > 0) {
      merged.createdAt = new Date(Math.min(createdLocal, createdServer)).toISOString();
    } else if (createdLocal > 0) {
      merged.createdAt = new Date(createdLocal).toISOString();
    } else if (createdServer > 0) {
      merged.createdAt = new Date(createdServer).toISOString();
    }

    // Rule 2: bestScore keeps max
    if (Object.prototype.hasOwnProperty.call(local, 'bestScore') || Object.prototype.hasOwnProperty.call(server, 'bestScore')) {
      merged.bestScore = Math.max(toNumber(local.bestScore, 0), toNumber(server.bestScore, 0));
      // If passing score was achieved in either, maintain completed state and completedAt
      if (merged.bestScore >= 0.7 || local.state === 'completed' || server.state === 'completed') {
        merged.state = 'completed';
        merged.completedAt = newer.completedAt || older.completedAt || merged.updatedAt;
      }
    }

    // Rule 3: counters keep max
    for (const field of COUNTER_FIELDS) {
      if (Object.prototype.hasOwnProperty.call(local, field) || Object.prototype.hasOwnProperty.call(server, field)) {
        merged[field] = Math.max(toNumber(local[field], 0), toNumber(server[field], 0));
      }
    }

    // Special dictionary counter map: xpByCourse in daily
    if (collection === 'daily' || local.xpByCourse || server.xpByCourse) {
      const mergedCourses = {};
      const allCourses = new Set([
        ...Object.keys(local.xpByCourse || {}),
        ...Object.keys(server.xpByCourse || {})
      ]);
      allCourses.forEach((c) => {
        mergedCourses[c] = Math.max(
          toNumber(local.xpByCourse?.[c], 0),
          toNumber(server.xpByCourse?.[c], 0)
        );
      });
      merged.xpByCourse = mergedCourses;
    }

    return merged;
  }

  function mergePayloads(localPayload = {}, serverPayload = {}) {
    const collections = ['profile', 'daily', 'lessonProgress', 'wordStats', 'position', 'customWords'];
    const mergedSnapshot = {};

    collections.forEach((collection) => {
      const localRecords = localPayload[collection] || {};
      const serverRecords = serverPayload[collection] || {};

      // Normalize into maps of [key -> record]
      const localMap = new Map();
      const serverMap = new Map();

      function addToMap(source, targetMap) {
        if (!source) return;
        if (Array.isArray(source)) {
          source.forEach((rec) => {
            const key = getEntityKey(collection, rec);
            if (key) targetMap.set(String(key), rec);
          });
        } else if (typeof source === 'object') {
          Object.entries(source).forEach(([k, rec]) => {
            if (!rec || typeof rec !== 'object') return;
            const key = getEntityKey(collection, rec) || k;
            targetMap.set(String(key), rec);
          });
        }
      }

      addToMap(localRecords, localMap);
      addToMap(serverRecords, serverMap);

      const allKeys = new Set([...localMap.keys(), ...serverMap.keys()]);
      const mergedCollection = {};

      allKeys.forEach((key) => {
        const loc = localMap.get(key);
        const srv = serverMap.get(key);
        mergedCollection[key] = mergeRecord(loc, srv, collection);
      });

      mergedSnapshot[collection] = mergedCollection;
    });

    return mergedSnapshot;
  }

  return {
    COUNTER_FIELDS,
    mergeRecord,
    mergePayloads,
    getEntityKey
  };
});
