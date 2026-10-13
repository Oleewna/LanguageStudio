(function () {
  const DEFAULT_COURSE_ID = 'it';
  const FALLBACK_SOURCE_LANGUAGE = 'uk';
  let resolvedDefaultCourseId = null;

  function getBasePath() {
    const pathname = window.location.pathname || '';
    if (pathname.includes('/pages/')) return '../';
    if (pathname.includes('/lessons/')) return '../../';
    return './';
  }

  function getCourseIndexPath() {
    return `${getBasePath()}courses/index.json`;
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
      const response = await fetch(getCourseIndexPath(), { cache: 'no-store' });
      if (!response.ok) {
        return { default: DEFAULT_COURSE_ID, courses: [{ id: DEFAULT_COURSE_ID }] };
      }
      const data = await response.json();
      const resolved = data || { default: DEFAULT_COURSE_ID, courses: [{ id: DEFAULT_COURSE_ID }] };
      const nextDefault = resolved.default || resolved.courses?.[0]?.id || DEFAULT_COURSE_ID;
      resolvedDefaultCourseId = nextDefault;
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

  async function loadCourse() {
    const id = getCourseId();
    const response = await fetch(`${getBasePath()}courses/${id}/course.json`, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`Course not found: ${id}`);
    }
    return await response.json();
  }

  function resolveCourseDataPath(name) {
    const rawName = String(name || '').trim();
    const normalizedName = rawName ? (rawName.endsWith('.json') ? rawName : `${rawName}.json`) : 'course.json';
    return `${getBasePath()}courses/${getCourseId()}/${normalizedName}`;
  }

  async function loadCourseData(name) {
    const url = resolveCourseDataPath(name);
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`Course data not found: ${name}`);
    }
    return await response.json();
  }

  function L(value) {
    const sourceLanguage = (typeof window.getSourceLanguage === 'function') ? window.getSourceLanguage() : FALLBACK_SOURCE_LANGUAGE;

    if (value && typeof value === 'object' && !Array.isArray(value)) {
      if (typeof value[sourceLanguage] !== 'undefined') return value[sourceLanguage];
      if (typeof value.uk !== 'undefined') return value.uk;
      if (typeof value.en !== 'undefined') return value.en;
      const firstString = Object.values(value).find(item => typeof item === 'string');
      if (typeof firstString === 'string') return firstString;
      return '';
    }

    return value ?? '';
  }

  function courseKey(name) {
    return `ls_${getCourseId()}_${name}`;
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

  loadCourseIndex().catch(() => {});
})();
