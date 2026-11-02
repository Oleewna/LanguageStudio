(function () {
  'use strict';

  const LS_LESSONS = Object.create(null);
  const LS_COURSES = {
    italian: {
      id: 'italian',
      code: 'it',
      flag: 'flag-it',
      title: { uk: 'Італійська мова', en: 'Italian' },
      subtitle: { uk: 'Курс італійської', en: 'Italian course' },
      lessons: LS_LESSONS
    }
  };

  function getLessonsByUnit(unitId) {
    return Object.values(LS_LESSONS)
      .filter(lesson => lesson.unitId === unitId)
      .sort((a, b) => (a.lessonNum || 0) - (b.lessonNum || 0));
  }

  function getAllLessons() {
    return Object.values(LS_LESSONS);
  }

  function resolveTranslation(translatable, lang = 'uk', fallback = '') {
    if (!translatable) return fallback;
    if (typeof translatable === 'string') return translatable;
    if (typeof translatable === 'object') {
      return translatable[lang] || translatable.uk || translatable.en || Object.values(translatable)[0] || fallback;
    }
    return String(translatable);
  }

  function getCourse(courseId) {
    return LS_COURSES[courseId] || LS_COURSES.italian;
  }

  function getCurrentCourseId() {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const queryCourse = params.get('course');
      if (queryCourse && LS_COURSES[queryCourse]) return queryCourse;
      const savedCourse = localStorage.getItem('ls_target_course');
      if (savedCourse && LS_COURSES[savedCourse]) return savedCourse;
    }
    return 'italian';
  }

  function setCurrentCourseId(courseId) {
    if (!LS_COURSES[courseId]) return;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('ls_target_course', courseId);
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('courseChanged', { detail: { courseId } }));
    }
  }

  function getCourseLessonById(lessonId, courseId) {
    if (!lessonId) return null;
    const targetCourse = courseId ? getCourse(courseId) : getCourse(getCurrentCourseId());
    if (targetCourse?.lessons?.[lessonId]) {
      return targetCourse.lessons[lessonId];
    }
    for (const course of Object.values(LS_COURSES)) {
      if (course.lessons && course.lessons[lessonId]) return course.lessons[lessonId];
    }
    return null;
  }

  Object.defineProperties(LS_LESSONS, {
    get: { value: getCourseLessonById },
    getByUnit: { value: getLessonsByUnit },
    getAll: { value: getAllLessons },
    t: { value: resolveTranslation }
  });

  if (typeof window !== 'undefined') {
    window.LS_LESSONS = LS_LESSONS;
    window.LS_COURSES = LS_COURSES;
    window.getLessonById = getCourseLessonById;
    window.getLessonsByUnit = getLessonsByUnit;
    window.getAllLessons = getAllLessons;
    window.resolveLessonTranslation = resolveTranslation;
    window.getCourse = getCourse;
    window.getCurrentCourseId = getCurrentCourseId;
    window.setCurrentCourseId = setCurrentCourseId;
    window.getCourseLessonById = getCourseLessonById;
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      LS_LESSONS,
      LS_COURSES,
      getCourse,
      getCurrentCourseId,
      setCurrentCourseId,
      getCourseLessonById,
      getLessonById: getCourseLessonById,
      getLessonsByUnit,
      getAllLessons,
      resolveTranslation
    };
  }
})();
