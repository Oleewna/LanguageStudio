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

  function loadJson(url, errorMessage) {
    if (jsonRequests.has(url)) return jsonRequests.get(url);

    let request;
    request = fetch(url, { cache: 'no-store' })
      .then(response => {
        if (!response.ok) {
          throw new Error(errorMessage);
        }
        return response.json();
      })
      .catch(error => {
        if (jsonRequests.get(url) === request) jsonRequests.delete(url);
        throw error;
      });

    jsonRequests.set(url, request);
    return request;
  }

  function getContentApiPath(resourcePath) {
    return window.getApiUrl(`content/${resourcePath}`);
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
      const resolved = await loadJson(getContentApiPath('course-index'), 'Course index not found');
      if (!resolved || !Array.isArray(resolved.courses) || resolved.courses.length === 0) {
        throw new Error('Course index is empty or invalid.');
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
      console.error('Could not load course index:', error);
      throw error;
    }
  }

  async function loadCourse() {
    const id = getCourseId();
    return await loadJson(getContentApiPath(`courses/${encodeURIComponent(id)}`), `Course not found: ${id}`);
  }

  function resolveCourseDataPath(name) {
    const rawName = String(name || '').trim();
    const normalizedName = rawName.replace(/\.json$/, '');
    const courseId = encodeURIComponent(getCourseId());
    if (normalizedName === 'vocab') {
      return `/api/vocab?course=${courseId}`;
    }

    if (normalizedName.startsWith('lessons/')) {
      const lessonId = encodeURIComponent(normalizedName.slice('lessons/'.length));
      return getContentApiPath(`courses/${courseId}/lessons/${lessonId}`);
    }

    if (normalizedName === 'course') {
      return getContentApiPath(`courses/${courseId}`);
    }

    if (!['vocab', 'grammar', 'exercises'].includes(normalizedName)) {
      throw new Error(`Unknown course data resource: ${name}`);
    }

    return getContentApiPath(`courses/${courseId}/${normalizedName}`);
  }

  async function loadCourseData(name) {
    const url = resolveCourseDataPath(name);
    return await loadJson(url, `Course data not found: ${name}`);
  }

  function L(value) {
    const sourceLanguage = typeof window.getSourceLanguage === 'function'
      ? window.getSourceLanguage()
      : (typeof navigator !== 'undefined' && (navigator.language || '').toLowerCase().startsWith('uk')
        ? 'uk'
        : FALLBACK_SOURCE_LANGUAGE);

    if (value && typeof value === 'object' && !Array.isArray(value)) {
      if (typeof value[sourceLanguage] !== 'undefined') return value[sourceLanguage];
      return '';
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
    courseKey,
    L
  });

  loadCourseIndex().catch(error => {
    console.error('Could not initialize the course catalog:', error);
  });
})();
