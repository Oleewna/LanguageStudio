(function (window) {
  function getSequentialUnits(path, progressRecords = []) {
    const completedLessonIds = new Set(
      progressRecords
        .filter((record) => record && record.state === 'completed')
        .map((record) => String(record.lessonId))
    );
    let blocked = Boolean(path.locked);

    return (path.units || []).map((unit) => ({
      ...unit,
      lessons: (unit.lessons || []).map((lesson) => {
        const contentAvailable = lesson.status === 'available';
        const completed = contentAvailable && completedLessonIds.has(String(lesson.id));
        const isAvailable = !blocked && contentAvailable;
        const result = {
          ...lesson,
          status: isAvailable ? 'available' : 'locked',
          completed: isAvailable && completed,
          blockedByProgress: blocked && contentAvailable && !path.locked
        };

        if (!completed || !contentAvailable) blocked = true;
        return result;
      })
    }));
  }

  window.LSPathProgress = Object.freeze({ getSequentialUnits });
})(window);
