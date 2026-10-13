(function () {
  function safeParse(rawValue, fallback) {
    if (rawValue === null || typeof rawValue === 'undefined') return fallback;
    try {
      return JSON.parse(rawValue);
    } catch (error) {
      return fallback;
    }
  }

  function getJSON(key, fallback = null) {
    if (typeof localStorage === 'undefined') return fallback;
    return safeParse(localStorage.getItem(key), fallback);
  }

  function setJSON(key, value) {
    if (typeof localStorage === 'undefined') return false;
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      return false;
    }
  }

  function buildCourseKey(name) {
    const courseId = (typeof window.getCourseId === 'function') ? window.getCourseId() : 'it';
    return `ls_${courseId}_${String(name ?? '')}`;
  }

  function isRecursiveCourseKey(candidate) {
    if (typeof candidate !== 'function') return false;
    const source = Function.prototype.toString.call(candidate);
    return source.includes('return window.courseKey(name)');
  }

  if (isRecursiveCourseKey(window.courseKey)) {
    window.courseKey = buildCourseKey;
  }

  function courseKey(name) {
    const safeGlobalCourseKey = window.courseKey;
    if (typeof safeGlobalCourseKey === 'function' && safeGlobalCourseKey !== courseKey && !isRecursiveCourseKey(safeGlobalCourseKey)) {
      return safeGlobalCourseKey(name);
    }
    return buildCourseKey(name);
  }

  function migrateLegacyStorage() {
    if (typeof localStorage === 'undefined') return;

    const legacyMappings = {
      ls_custom_dict: 'custom_dict',
      ls_dict_learned: 'dict_learned',
      ls_unit_1_lesson_1_best_xp: 'lesson_1.1_best_xp'
    };

    const activeCourseId = (typeof window.getCourseId === 'function') ? window.getCourseId() : 'it';

    Object.entries(legacyMappings).forEach(([legacyKey, scopedKey]) => {
      if (localStorage.getItem(legacyKey) !== null && localStorage.getItem(`ls_${activeCourseId}_${scopedKey}`) === null) {
        localStorage.setItem(`ls_${activeCourseId}_${scopedKey}`, localStorage.getItem(legacyKey));
      }
    });

    const legacySourceKey = 'ls_italian_source_language';
    const currentSourceKey = 'ls_source_language';
    if (!localStorage.getItem(currentSourceKey) && localStorage.getItem(legacySourceKey) !== null) {
      localStorage.setItem(currentSourceKey, localStorage.getItem(legacySourceKey));
    }
  }

  Object.assign(window, {
    getJSON,
    setJSON,
    migrateLegacyStorage
  });

  migrateLegacyStorage();
})();
