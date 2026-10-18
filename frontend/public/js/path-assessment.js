(function (window) {
  function getRequiredLessonIds(path) {
    const units = Array.isArray(path?.units) ? path.units : [];
    return units
      .flatMap((unit) => Array.isArray(unit.lessons) ? unit.lessons : [])
      .filter((lesson) => lesson && lesson.id && lesson.status === 'available')
      .map((lesson) => String(lesson.id));
  }

  function getState(path, progressRecords = []) {
    const requiredLessonIds = getRequiredLessonIds(path);
    const completedLessonIds = new Set(
      progressRecords
        .filter((record) => record && record.state === 'completed')
        .map((record) => String(record.lessonId))
    );
    const completedCount = requiredLessonIds.filter((lessonId) => completedLessonIds.has(lessonId)).length;

    return {
      total: requiredLessonIds.length,
      completed: completedCount,
      pathLocked: Boolean(path && path.locked),
      unlocked: Boolean(path && !path.locked && requiredLessonIds.length > 0 && completedCount === requiredLessonIds.length)
    };
  }

  window.LSPathAssessment = Object.freeze({ getState });
})(window);
