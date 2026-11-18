(function () {
  const DEFAULT_COURSE_ID = 'it';
  const FALLBACK_SOURCE_LANGUAGE = 'en';
  let resolvedDefaultCourseId = null;
  const jsonRequests = new Map();
  const apiBaseUrl = (() => {
    if (window.location.port !== '5500') return '/api/v1';
    const gatewayOrigin = new URL(window.location.origin);
    gatewayOrigin.port = '3005';
    return `${gatewayOrigin.origin}/api/v1`;
  })();

  window.getApiUrl = resourcePath => `${apiBaseUrl}/${String(resourcePath).replace(/^\/+/, '')}`;

  function getBasePath() {
    const pathname = window.location.pathname || '';

    if (pathname.includes('/frontend/public/pages') || pathname.includes('/frontend/public/lessons')) {
      return '../../../';
    }

    if (pathname.includes('/pages/') || pathname.includes('/lessons/')) {
      return '../../';
    }

    if (pathname.includes('/frontend/public') || pathname.includes('/public/')) {
      return '../../';
    }

    return './';
  }

  function loadJson(url, errorMessage, allowNotFound = false) {
    if (jsonRequests.has(url)) return jsonRequests.get(url);

    let request;
    request = fetch(url, { cache: 'no-store' })
      .then(response => {
        if (!response.ok) {
          if (allowNotFound) {
            jsonRequests.delete(url);
            return null;
          }
          throw new Error(errorMessage);
        }
        return response.json();
      })
      .catch(error => {
        if (jsonRequests.get(url) === request) jsonRequests.delete(url);
        if (allowNotFound) return null;
        throw error;
      });

    jsonRequests.set(url, request);
    return request;
  }

  function getContentApiPath(resourcePath) {
    const clean = String(resourcePath || '').replace(/^\/+/, '');
    if (clean === 'course-index') {
      return window.getApiUrl('courses');
    }
    return window.getApiUrl(clean.startsWith('courses/') ? clean : `courses/${clean}`);
  }

  function getCourseId() {
    const params = new URLSearchParams(window.location.search);
    const queryCourse = params.get('course');
    const savedCourse = localStorage.getItem('ls_course') || localStorage.getItem('ls_target_course');
    const fallbackCourse = resolvedDefaultCourseId || window.__LS_DEFAULT_COURSE_ID || DEFAULT_COURSE_ID;

    if (queryCourse && queryCourse.trim()) return queryCourse;
    if (savedCourse && savedCourse.trim()) return savedCourse;
    return fallbackCourse;
  }

  async function loadCourseIndex() {
    try {
      // Try API first
      let resolved = await loadJson(getContentApiPath('course-index'), 'Course index not found', true);

      // Fallback to static course index if API is unreachable
      if (!resolved || !Array.isArray(resolved.courses)) {
        const staticUrl = `${getBasePath()}courses/index.json`;
        resolved = await loadJson(staticUrl, 'Course index not found', true);
      }

      if (!resolved || !Array.isArray(resolved.courses) || resolved.courses.length === 0) {
        resolved = { default: DEFAULT_COURSE_ID, courses: [{ id: DEFAULT_COURSE_ID }] };
      }

      const nextDefault = resolved.default || resolved.courses?.[0]?.id || DEFAULT_COURSE_ID;
      resolvedDefaultCourseId = nextDefault;
      window.__LS_COURSE_INDEX = resolved;
      window.__LS_DEFAULT_COURSE_ID = nextDefault;
      if (!localStorage.getItem('ls_course') && !localStorage.getItem('ls_target_course')) {
        localStorage.setItem('ls_course', nextDefault);
      }
      return resolved;
    } catch (error) {
      console.warn('Could not load course index:', error);
      resolvedDefaultCourseId = DEFAULT_COURSE_ID;
      window.__LS_DEFAULT_COURSE_ID = DEFAULT_COURSE_ID;
      return { default: DEFAULT_COURSE_ID, courses: [{ id: DEFAULT_COURSE_ID }] };
    }
  }

  function deepMerge(target, source) {
    if (!source || typeof source !== 'object') return target;
    for (const key of Object.keys(source)) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        if (!target[key] || typeof target[key] !== 'object' || Array.isArray(target[key])) {
          target[key] = {};
        }
        deepMerge(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    }
    return target;
  }

  /**
   * Fallback chain: selected locale -> en -> first available
   */
  async function loadI18nWithFallback(courseId, relativePath, availableLocales = ['uk', 'en']) {
    const selectedLocale = typeof window.getSourceLanguage === 'function' ? window.getSourceLanguage() : 'uk';
    const candidates = [selectedLocale];
    if (!candidates.includes('en')) candidates.push('en');
    for (const loc of availableLocales) {
      if (!candidates.includes(loc)) candidates.push(loc);
    }

    let mergedTranslations = null;

    // Load in reverse order so selected locale overrides 'en', which overrides first available
    const order = [...candidates].reverse();
    for (const loc of order) {
      const cleanRel = relativePath.replace(/\.json$/, '');
      const apiI18nUrl = `/api/courses/${encodeURIComponent(courseId)}/i18n/${encodeURIComponent(loc)}/${cleanRel}`;
      try {
        let data = await loadJson(apiI18nUrl, '', true);
        if (!data) {
          const staticUrl = `${getBasePath()}courses/${encodeURIComponent(courseId)}/i18n/${encodeURIComponent(loc)}/${relativePath}`;
          data = await loadJson(staticUrl, '', true);
        }
        if (data && typeof data === 'object') {
          if (!mergedTranslations) mergedTranslations = {};
          deepMerge(mergedTranslations, data);
        }
      } catch (err) {
        // Ignore fallback errors
      }
    }

    return mergedTranslations;
  }

  function mergeI18n(baseData, translations, locale, courseId) {
    if (!baseData || !translations || typeof translations !== 'object') {
      return baseData;
    }

    function applyCompat(item) {
      if (!item || typeof item !== 'object') return;
      const targetText = item.text || item[courseId] || item.word || '';
      if (targetText) {
        item.text = targetText;
        item[courseId] = targetText;
        if (item.word === undefined) item.word = targetText;
      }
      if (item.trans) {
        item.translations = item.translations || {};
        if (typeof item.trans === 'string') {
          item.translations[locale] = item.trans;
        } else if (typeof item.trans === 'object') {
          Object.assign(item.translations, item.trans);
        }
      }
      if (item.pronunciation && !item.phon) {
        item.phon = item.pronunciation;
      }
    }

    // Array data: vocab.json, exercises.json
    if (Array.isArray(baseData)) {
      baseData.forEach(item => {
        if (item && item.id && translations[item.id]) {
          const tr = translations[item.id];
          if (typeof tr === 'object') {
            Object.assign(item, tr);
            if (Array.isArray(item.pairs) && tr.pairs && typeof tr.pairs === 'object') {
              item.pairs.forEach(pair => {
                const pTr = tr.pairs[pair.id];
                if (pTr) {
                  Object.assign(pair, pTr);
                  applyCompat(pair);
                }
              });
            }
            if (Array.isArray(item.options) && Array.isArray(tr.options)) {
              tr.options.forEach((optTr, idx) => {
                if (item.options[idx]) Object.assign(item.options[idx], optTr);
              });
            } else if (Array.isArray(item.options) && tr.options && typeof tr.options === 'object') {
              item.options.forEach(opt => {
                if (opt.id && tr.options[opt.id]) {
                  opt.text = tr.options[opt.id];
                }
              });
            }
          }
        }
        applyCompat(item);
      });
      return baseData;
    }

    // Object data
    if (baseData.id && translations[baseData.id]) {
      const tr = translations[baseData.id];
      if (typeof tr === 'object') Object.assign(baseData, tr);
    }

    // Course metadata
    if (translations.tagline) baseData.tagline = translations.tagline;
    if (translations.target?.name && baseData.target) baseData.target.name = translations.target.name;
    if (Array.isArray(baseData.exerciseCategories) && translations.exerciseCategories) {
      baseData.exerciseCategories.forEach(cat => {
        if (cat.id && translations.exerciseCategories[cat.id]) {
          Object.assign(cat, translations.exerciseCategories[cat.id]);
        }
      });
    }
    if (Array.isArray(baseData.paths) && translations.paths) {
      baseData.paths.forEach(p => {
        if (p.id && translations.paths[p.id]) {
          Object.assign(p, translations.paths[p.id]);
        }
        if (Array.isArray(p.units)) {
          p.units.forEach(u => {
            if (u.id && translations.units?.[u.id]) {
              Object.assign(u, translations.units[u.id]);
            }
            if (Array.isArray(u.lessons)) {
              u.lessons.forEach(l => {
                if (l.id && translations.lessons?.[l.id]) {
                  Object.assign(l, translations.lessons[l.id]);
                }
              });
            }
          });
        }
      });
    }

    // Lesson blocks
    if (Array.isArray(baseData.blocks)) {
      baseData.blocks.forEach(block => {
        if (block.id && translations[block.id]) {
          const bTr = translations[block.id];
          if (typeof bTr === 'object') Object.assign(block, bTr);
        }
        if (Array.isArray(block.lines)) {
          block.lines.forEach(line => {
            if (line.id && translations[line.id]) {
              Object.assign(line, translations[line.id]);
            }
            applyCompat(line);
          });
        }
        if (Array.isArray(block.items) && block.type === 'vocab') {
          block.items.forEach(item => {
            if (item.id && translations[item.id]) {
              Object.assign(item, translations[item.id]);
            }
            applyCompat(item);
          });
        }
        if (Array.isArray(block.paragraphs)) {
          block.paragraphs.forEach(para => {
            if (para && para.id && translations[para.id]) {
              const pTr = translations[para.id];
              if (block.type === 'story_text') {
                para.translations = pTr.translations || pTr.text || pTr;
              } else {
                para.text = pTr.text || pTr;
              }
            }
          });
        }
        if (Array.isArray(block.vocabHints) && block.type === 'story_text') {
          block.vocabHints.forEach(hint => {
            if (hint && hint.id && translations[hint.id]) {
              const hTr = translations[hint.id];
              hint.translations = hTr.translations || hTr.text || hTr;
            }
          });
        }
        if (Array.isArray(block.items) && block.type === 'takeaways') {
          block.items.forEach(item => {
            if (item && item.id && translations[item.id]) {
              const tTr = translations[item.id];
              item.text = tTr.text || tTr;
              item[locale] = item.text;
            }
          });
        }
        if (Array.isArray(block.items) && (block.type === 'tasks' || block.type === 'quiz')) {
          block.items.forEach(task => {
            if (task && task.id && translations[task.id]) {
              const taskTr = translations[task.id];
              if (taskTr.question) {
                task.q = taskTr.question;
                task.question = taskTr.question;
              }
              if (taskTr.explanation) task.explanation = taskTr.explanation;
              if (taskTr.options && Array.isArray(task.options)) {
                task.options.forEach(opt => {
                  if (opt.id && taskTr.options[opt.id]) {
                    opt.text = taskTr.options[opt.id];
                  }
                });
              }
            }
          });
        }
      });
    }

    // Grammar topics
    if (Array.isArray(baseData.topics)) {
      baseData.topics.forEach(topic => {
        const topTr = translations[topic.id];
        if (topTr) {
          if (topTr.title) topic.title = topTr.title;
          if (Array.isArray(topic.blocks)) {
            topic.blocks.forEach(b => {
              const bTr = topTr.blocks?.[b.id] || translations[b.id];
              if (bTr) {
                if (bTr.title) b.title = bTr.title;
                if (bTr.text) b.text = bTr.text;
                if (bTr.head) b.head = bTr.head;
                if (bTr.rows) b.rows = bTr.rows;
                if (bTr.items && Array.isArray(b.items)) {
                  b.items.forEach(item => {
                    if (item.id && bTr.items[item.id]) {
                      Object.assign(item, bTr.items[item.id]);
                      applyCompat(item);
                    }
                  });
                }
              }
            });
          }
        }
      });
    }

    return baseData;
  }

  async function loadCourse() {
    const id = getCourseId();
    // Try API first
    let rawCourse = await loadJson(getContentApiPath(`courses/${encodeURIComponent(id)}`), '', true);

    // Fallback to static if API did not return data
    if (!rawCourse) {
      const staticUrl = `${getBasePath()}courses/${encodeURIComponent(id)}/course.json`;
      rawCourse = await loadJson(staticUrl, `Course not found: ${id}`, true);
    }

    if (!rawCourse) {
      throw new Error(`Course not found: ${id}`);
    }

    const availableLocales = Array.isArray(rawCourse.availableLocales) ? rawCourse.availableLocales : ['uk', 'en'];
    const locale = typeof window.getSourceLanguage === 'function' ? window.getSourceLanguage() : 'uk';

    const translations = await loadI18nWithFallback(id, 'course.json', availableLocales);
    if (translations) {
      mergeI18n(rawCourse, translations, locale, id);
    }

    return rawCourse;
  }

  function resolveCourseDataPath(name) {
    const rawName = String(name || '').trim();
    const normalizedName = rawName.endsWith('.json') ? rawName : `${rawName}.json`;
    const courseId = encodeURIComponent(getCourseId());

    return `${getBasePath()}courses/${courseId}/${normalizedName}`;
  }

  async function loadCourseData(name) {
    const rawName = String(name || '').trim();
    const normalizedName = rawName.endsWith('.json') ? rawName : `${rawName}.json`;
    const courseId = getCourseId();

    let rawData = null;

    if (rawName === 'vocab') {
      rawData = await loadJson(`/api/vocab?course=${encodeURIComponent(courseId)}`, '', true);
      if (!rawData) {
        rawData = await loadJson(getContentApiPath(`courses/${encodeURIComponent(courseId)}/vocab`), '', true);
      }
    } else if (rawName.startsWith('lessons/')) {
      const lessonId = rawName.slice('lessons/'.length).replace(/\.json$/, '');
      const apiLessonUrl = `/api/courses/${encodeURIComponent(courseId)}/lessons/${encodeURIComponent(lessonId)}`;
      const response = await fetch(apiLessonUrl, { cache: 'no-store', credentials: 'include' });

      if (response.status === 401 || response.status === 403) {
        const errorData = await response.json().catch(() => ({}));
        const lockError = new Error(errorData.error || (response.status === 401 ? 'Authentication required' : 'Entitlement required'));
        lockError.status = response.status;
        lockError.code = errorData.code || (response.status === 401 ? 'AUTH_REQUIRED' : 'ENTITLEMENT_REQUIRED');
        lockError.courseId = courseId;
        lockError.lessonId = lessonId;
        lockError.requiresPath = errorData.requiresPath;
        lockError.priceId = errorData.priceId;
        lockError.isLocked = true;
        throw lockError;
      }

      if (response.ok) {
        rawData = await response.json();
      } else {
        rawData = await loadJson(getContentApiPath(`courses/${encodeURIComponent(courseId)}/lessons/${encodeURIComponent(lessonId)}`), '', true);
      }
    } else {
      rawData = await loadJson(getContentApiPath(`courses/${encodeURIComponent(courseId)}/${rawName}`), '', true);
    }

    // Fallback to static URL if API did not return data
    if (!rawData) {
      const url = resolveCourseDataPath(name);
      try {
        rawData = await loadJson(url, `Course data not found: ${name}`, true);
      } catch (err) {
        // Ignore static network errors
      }
    }

    if (!rawData) {
      throw new Error(`Course data not found: ${name}`);
    }

    const locale = typeof window.getSourceLanguage === 'function' ? window.getSourceLanguage() : 'uk';
    const availableLocales = window.__LS_COURSE?.availableLocales || ['uk', 'en'];

    const translations = await loadI18nWithFallback(courseId, normalizedName, availableLocales);
    if (translations) {
      mergeI18n(rawData, translations, locale, courseId);
    }

    return rawData;
  }

  function L(value) {
    const sourceLanguage = typeof window.getSourceLanguage === 'function'
      ? window.getSourceLanguage()
      : (typeof navigator !== 'undefined' && (navigator.language || '').toLowerCase().startsWith('uk')
        ? 'uk'
        : FALLBACK_SOURCE_LANGUAGE);

    if (value && typeof value === 'object' && !Array.isArray(value)) {
      if (typeof value[sourceLanguage] !== 'undefined') return value[sourceLanguage];
      if (typeof value.en !== 'undefined') return value.en;
      if (typeof value.uk !== 'undefined') return value.uk;
      const first = Object.values(value).find((item) => typeof item === 'string');
      return first || '';
    }

    if (typeof value === 'string' && typeof window.t === 'function') {
      const translated = window.t(value);
      if (translated && translated !== value) return translated;
    }

    return value ?? '';
  }

  function courseKey(name) {
    const id = getCourseId();
    return `ls_${id}_${String(name ?? '')}`;
  }

  function isRecursiveCourseKey(candidate) {
    if (typeof candidate !== 'function') return false;
    const source = Function.prototype.toString.call(candidate);
    return source.includes('return window.courseKey(name)');
  }

  if (isRecursiveCourseKey(window.courseKey)) {
    window.courseKey = courseKey;
  }

  function setCourseId(id) {
    const safeId = String(id || 'it');
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('ls_course', safeId);
      localStorage.setItem('ls_target_course', safeId);
    }

    const nextUrl = new URL(window.location.href);
    nextUrl.searchParams.set('course', safeId);

    if (window.location.href !== nextUrl.href) {
      window.location.assign(nextUrl.href);
    }

    return safeId;
  }

  Object.assign(window, {
    getCourseId,
    setCourseId,
    loadCourseIndex,
    loadCourse,
    loadCourseData,
    resolveCourseDataPath,
    getBasePath,
    mergeI18n,
    courseKey,
    L
  });

  loadCourseIndex().catch(error => {
    console.error('Could not initialize the course catalog:', error);
  });
})();
