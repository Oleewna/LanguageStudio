(function () {
  const pathAssessmentList = document.getElementById('pathAssessmentList');
  const sourceLanguage = () => (
    typeof window.getSourceLanguage === 'function' && window.getSourceLanguage() === 'en' ? 'en' : 'uk'
  );
  let pageData = null;

  function text(uk, en) {
    return sourceLanguage() === 'en' ? en : uk;
  }

  function localized(value) {
    if (typeof window.L === 'function') return window.L(value);
    if (value && typeof value === 'object') return value[sourceLanguage()] || value.uk || value.en || '';
    return value || '';
  }

  function escapeHtml(value) {
    const element = document.createElement('div');
    element.textContent = String(value ?? '');
    return element.innerHTML;
  }

  function renderPathAssessments() {
    if (!pathAssessmentList || !pageData) return;

    const { courseId, paths, progressRecords } = pageData;
    if (paths.length === 0) {
      pathAssessmentList.innerHTML = `<p class="path-assessment-message" role="status">${text('Для цього курсу поки немає напрямків навчання.', 'There are no learning paths for this course yet.')}</p>`;
      pathAssessmentList.setAttribute('aria-busy', 'false');
      return;
    }

    const requestedPathId = new URLSearchParams(window.location.search).get('path');
    pathAssessmentList.innerHTML = paths.map((path) => {
      const state = window.LSPathAssessment.getState(path, progressRecords);
      const pathId = String(path.id || '');
      const title = escapeHtml(localized(path.title));
      const pathUrl = `path.html?course=${encodeURIComponent(courseId)}#path-${encodeURIComponent(pathId)}`;
      const selectedClass = pathId === requestedPathId ? ' is-selected' : '';
      let statusText;
      let actionText;
      if (state.total === 0) {
        statusText = text('Для фінального тесту ще немає доступних уроків.', 'No lessons are available for a final assessment yet.');
        actionText = text('Тест поки недоступний', 'Assessment unavailable');
      } else if (state.pathLocked) {
        statusText = text('Цей напрямок поки недоступний.', 'This learning path is not available yet.');
        actionText = text('Напрямок поки заблокований', 'Learning path is locked');
      } else if (state.unlocked) {
        statusText = text('Напрямок завершено · фінальний тест незабаром', 'Path complete · final assessment coming soon');
        actionText = text('Тест буде доступний пізніше', 'Assessment coming soon');
      } else {
        statusText = text(`Завершено ${state.completed} із ${state.total} основних уроків`, `${state.completed} of ${state.total} required lessons completed`);
        actionText = text('Завершіть напрямок, щоб розблокувати', 'Complete the path to unlock');
      }
      const statusIcon = state.unlocked ? 'status-dot' : 'lock';

      return `
        <article class="path-assessment-card${state.unlocked ? ' is-unlocked' : ' is-locked'}${selectedClass}" id="assessment-${escapeHtml(pathId)}">
          <div class="path-assessment-icon"><span data-icon="paths"></span></div>
          <div class="path-assessment-copy">
            <span class="assessment-path-kicker">${text('ФІНАЛЬНИЙ ТЕСТ', 'FINAL ASSESSMENT')}</span>
            <h3>${title}</h3>
            <p>${text('Фінальне оцінювання знань після проходження цього напрямку.', 'A final check of your knowledge after completing this learning path.')}</p>
          </div>
          <div class="path-assessment-actions">
            <span class="assessment-progress"><span data-icon="${statusIcon}"></span>${escapeHtml(statusText)}</span>
            <button class="test-action" type="button" disabled aria-label="${escapeHtml(actionText)}">
              <span data-icon="${state.unlocked ? 'clock' : 'lock'}"></span>${escapeHtml(actionText)}
            </button>
            <a class="assessment-path-link" href="${escapeHtml(pathUrl)}">${text('Переглянути напрямок', 'View learning path')} <span data-icon="arrow-right" aria-hidden="true"></span></a>
          </div>
        </article>
      `;
    }).join('');

    pathAssessmentList.setAttribute('aria-busy', 'false');
    window.renderRegisteredIcons?.(pathAssessmentList);
  }

  async function initializePathAssessments() {
    if (!pathAssessmentList) return;

    try {
      const courseId = typeof window.getCourseId === 'function' ? window.getCourseId() : 'it';
      if (typeof window.loadCourse !== 'function') {
        throw new Error('Course data loader is unavailable.');
      }
      const courseData = await window.loadCourse();
      if (!window.Progress || typeof window.Progress.list !== 'function') {
        throw new Error('Lesson progress is unavailable.');
      }
      const progressRecords = await window.Progress.list('lessonProgress', { courseId });
      pageData = {
        courseId,
        paths: Array.isArray(courseData.paths) ? courseData.paths : [],
        progressRecords
      };
      renderPathAssessments();
    } catch (error) {
      console.error('Could not load final assessment paths:', error);
      pathAssessmentList.innerHTML = `<p class="path-assessment-message" role="alert">${text('Не вдалося завантажити напрямки тестів. Перевірте з’єднання та спробуйте ще раз.', 'Could not load assessment paths. Check your connection and try again.')}</p>`;
      pathAssessmentList.setAttribute('aria-busy', 'false');
    }
  }

  window.addEventListener('sourceLanguageChanged', renderPathAssessments);
  document.addEventListener('DOMContentLoaded', initializePathAssessments);
})();
