(function (window) {
  function toArray(value) {
    return Array.isArray(value) ? value : [];
  }

  function getCustomWordsKey() {
    if (typeof window.courseKey === 'function') {
      return window.courseKey('custom_dict');
    }
    return 'ls_custom_dict';
  }

  function normalizeCourseId(courseId) {
    const value = String(courseId || '').trim();
    if (!value) return 'it';
    if (/^[a-z]{2,3}$/.test(value.toLowerCase())) return value.toLowerCase();

    const aliases = {
      italian: 'it',
      spanish: 'es',
      ukrainian: 'uk',
      english: 'en'
    };

    return aliases[value.toLowerCase()] || value.toLowerCase();
  }

  function getCurrentCourseId() {
    const sources = [
      window.currentCourseId,
      window.activeCourseId,
      window.courseId,
      window.__LSApp && window.__LSApp.currentCourseId,
      window.__LSApp && window.__LSApp.courseId
    ];

    for (const candidate of sources) {
      if (candidate && String(candidate).trim()) {
        return String(candidate).trim();
      }
    }

    return 'it';
  }

  function readCustomWords() {
    const key = getCustomWordsKey();
    if (typeof window.getJSON === 'function') {
      return toArray(window.getJSON(key, []));
    }

    try {
      return toArray(JSON.parse(localStorage.getItem(key) || '[]'));
    } catch (error) {
      return [];
    }
  }

  function uniqueById(items) {
    const map = new Map();
    items.forEach((item) => {
      if (!item || !item.id) return;
      map.set(String(item.id), item);
    });
    return Array.from(map.values());
  }

  function getLocalUserWords(courseId) {
    const normalizedCourse = normalizeCourseId(courseId);
    const stored = (() => {
      try {
        return JSON.parse(localStorage.getItem('ls_user_words') || '{}');
      } catch (error) {
        return {};
      }
    })();

    const entries = toArray(Array.isArray(stored) ? stored : Object.values(stored));
    return entries
      .filter((record) => record && String(record.courseId || '') === normalizedCourse)
      .map((record) => ({
        ...record,
        wordId: record.wordId || record.id,
        source: record.source || 'manual'
      }));
  }

  async function fetchCatalogWords(courseId) {
    const normalizedCourse = normalizeCourseId(courseId);
    try {
      const response = await fetch(`/api/vocab?course=${encodeURIComponent(normalizedCourse)}`, { cache: 'no-store' });
      if (!response.ok) {
        throw new Error(`Vocab API response was ${response.status}`);
      }
      const payload = await response.json();
      return toArray(payload);
    } catch (error) {
      if (typeof window.loadCourseData === 'function') {
        try {
          const data = await window.loadCourseData('vocab');
          return toArray(data).filter((entry) => !entry || String(entry.courseId || entry.lang_code || normalizedCourse) === normalizedCourse || String(entry.course || '').toLowerCase() === normalizedCourse || !entry.courseId);
        } catch (fallbackError) {
          return [];
        }
      }
      return [];
    }
  }

  async function fetchUserWords(courseId) {
    const normalizedCourse = normalizeCourseId(courseId);
    try {
      const response = await fetch(`/api/user-words?course=${encodeURIComponent(normalizedCourse)}`, { cache: 'no-store' });
      if (!response.ok) {
        throw new Error(`User words API response was ${response.status}`);
      }
      const payload = await response.json();
      return toArray(payload);
    } catch (error) {
      if (window.Progress && typeof window.Progress.listUserWords === 'function') {
        try {
          const records = await window.Progress.listUserWords(normalizedCourse);
          if (records && records.length) return records;
        } catch (progressError) {
          // Fall through to localStorage fallback.
        }
      }

      return getLocalUserWords(normalizedCourse);
    }
  }

  async function getUserWordIds(courseId) {
    const normalizedCourse = normalizeCourseId(courseId);
    if (window.Progress && typeof window.Progress.listUserWords === 'function') {
      try {
        const records = await window.Progress.listUserWords(normalizedCourse);
        return records.map((record) => String(record && (record.wordId || record.id) || '')).filter(Boolean);
      } catch (error) {
        // Fall through to localStorage if the progress API is unavailable.
      }
    }

    try {
      const userRecords = await fetchUserWords(normalizedCourse);
      return userRecords
        .map((record) => String(record && (record.wordId || record.id) || ''))
        .filter(Boolean);
    } catch (error) {
      // Fall through to localStorage for legacy behavior.
    }

    const stored = (() => {
      try {
        return JSON.parse(localStorage.getItem('ls_user_words') || '{}');
      } catch (error) {
        return {};
      }
    })();

    const entries = toArray(Array.isArray(stored) ? stored : Object.values(stored));
    return entries
      .filter((record) => record && String(record.courseId || '') === normalizedCourse)
      .map((record) => String(record.wordId || ''))
      .filter(Boolean);
  }

  function normalizeCatalogWord(word) {
    if (!word || !word.id) return null;
    return {
      id: String(word.id),
      word: word.word || '',
      trans: word.trans || {},
      translation: word.translation || word.trans || '',
      pronunciation: word.phon || word.pronunciation || '',
      phon: word.phon || {},
      lesson: word.lesson || '',
      lessons: toArray(word.lessons),
      path: word.path || '',
      topic: word.topic || '',
      category: word.category || '',
      type: word.type || '',
      example: word.example || '',
      custom: false
    };
  }

  function normalizeCustomWord(word) {
    if (!word || !word.word) return null;
    return {
      id: String(word.id || `custom-${Date.now()}-${Math.random().toString(16).slice(2)}`),
      word: word.word,
      trans: word.trans || word.translation || {},
      translation: word.translation || word.trans || '',
      pronunciation: word.pronunciation || word.phon || '',
      phon: word.phon || {},
      lesson: word.lesson || '',
      lessons: [],
      path: word.path || '',
      topic: word.topic || '',
      category: word.category || '',
      type: word.type || 'other',
      example: word.example || '',
      custom: true
    };
  }

  async function getUserVocabulary(courseId = getCurrentCourseId()) {
    const normalizedCourse = normalizeCourseId(courseId);
    const userWordRecords = await fetchUserWords(normalizedCourse);
    const userIds = new Set((userWordRecords || []).map((record) => String(record && (record.wordId || record.id) || '')).filter(Boolean));

    const customWords = readCustomWords().map((entry) => normalizeCustomWord(entry)).filter(Boolean);
    const catalogWords = await fetchCatalogWords(normalizedCourse);

    const catalogMatches = catalogWords
      .map((word) => normalizeCatalogWord(word))
      .filter(Boolean)
      .filter((word) => userIds.has(String(word.id)) || userWordRecords.some((entry) => String(entry && (entry.wordId || entry.id) || '') === String(word.id)));

    const mergedWords = [...catalogMatches, ...customWords];
    return uniqueById(mergedWords);
  }

  async function fetchWordExamples(word, courseId = getCurrentCourseId()) {
    const normalizedCourse = normalizeCourseId(courseId);
    const safeWord = String(word || '').trim();
    if (!safeWord) return [];

    try {
      const response = await fetch(`/api/examples?course=${encodeURIComponent(normalizedCourse)}&word=${encodeURIComponent(safeWord)}`, { cache: 'no-store' });
      if (!response.ok) return [];
      const payload = await response.json();
      return Array.isArray(payload) ? payload : [];
    } catch (error) {
      return [];
    }
  }

  Object.assign(window, {
    getUserVocabulary,
    getUserVocabularyEntries: getUserVocabulary,
    getCurrentCourseId,
    getCustomWordsKey,
    fetchWordExamples,
    getWordExamples: fetchWordExamples
  });
})(window);
