let pathProgressRecords = [];
const LESSONS_PER_ROW = 3;

function toggleUnit(card) {
  card.classList.toggle('open');
}

function toggleUnitGroup(groupEl, event) {
  if (event) event.stopPropagation();
  if (groupEl) groupEl.classList.toggle('open');
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str == null ? '' : String(str);
  return div.innerHTML;
}

function getCoursePaths() {
  const courseData = window.__LS_COURSE_DATA || {};
  return Array.isArray(courseData.paths) ? courseData.paths : [];
}

function getLocalizedText(value) {
  if (typeof window.L === 'function') {
    return window.L(value);
  }
  if (value && typeof value === 'object') {
    return value.uk || value.en || '';
  }
  return value || '';
}

function getPathLanguage() {
  return typeof window.getSourceLanguage === 'function' && window.getSourceLanguage() === 'en'
    ? 'en'
    : 'uk';
}

function getPathBadgeText(total, available, locked = false) {
  const lang = getPathLanguage();
  if (locked) return lang === 'en' ? 'Locked' : 'Заблоковано';
  return lang === 'en'
    ? `${available}/${total} lessons available`
    : `${available}/${total} уроків доступно`;
}

function getLessonHref(lesson) {
  if (!lesson) return '#';
  if (lesson.href) return lesson.href;

  const courseId = typeof window.getCourseId === 'function' ? window.getCourseId() : 'it';
  const pagePath = `${window.LSComponents?.prefix || '../'}pages/lesson.html`;
  const lessonId = lesson.id || '';
  return `${pagePath}?course=${encodeURIComponent(courseId)}&lesson=${encodeURIComponent(lessonId)}`;
}

function getLessonStatusLabel(lesson) {
  const isAvailable = (lesson && lesson.status) === 'available';
  if (lesson && lesson.blockedByProgress) {
    return getLocalizedText({ uk: 'Заблоковано', en: 'Locked' });
  }
  const lang = typeof window.getSourceLanguage === 'function' ? window.getSourceLanguage() : 'uk';
  const openLabel = typeof window.getInterfaceTranslation === 'function'
    ? (window.getInterfaceTranslation('Open', lang) || (lang === 'uk' ? 'Почати' : 'Open'))
    : (lang === 'uk' ? 'Почати' : 'Open');
  const soonLabel = typeof window.getInterfaceTranslation === 'function'
    ? (window.getInterfaceTranslation('Soon', lang) || (lang === 'uk' ? 'Незабаром' : 'Soon'))
    : (lang === 'uk' ? 'Незабаром' : 'Soon');
  return isAvailable ? openLabel : soonLabel;
}

function buildBadgeText(category) {
  const lessons = (category.units || []).flatMap((unit) => unit.lessons || []);
  const total = lessons.length;
  const available = lessons.filter((lesson) => lesson.status === 'available').length;
  return getPathBadgeText(total, available, category.locked);
}

function renderLessonRow(lesson, nodeState = 'upcoming') {
  const isAvailable = lesson.status === 'available';
  const rowClass = `lesson-row ${isAvailable ? 'active-lesson' : 'locked'}`;
  const statusClass = isAvailable ? 'lesson-status ls-available' : 'lesson-status ls-soon';
  const title = getLocalizedText(lesson.title);
  const description = getLocalizedText(lesson.description);
  const lessonNum = getLocalizedText(lesson.num);
  const time = getLocalizedText(lesson.time);
  const lang = getPathLanguage();
  const statusLabel = lesson.completed
    ? lang === 'en' ? 'Completed' : 'Завершено'
    : isAvailable
      ? nodeState === 'current'
        ? lang === 'en' ? 'Start here' : 'Почніть тут'
        : lang === 'en' ? 'Up next' : 'Далі'
      : getLessonStatusLabel(lesson);
  const statusIcon = !isAvailable ? 'lock' : lesson.completed ? 'status-dot' : nodeState === 'current' ? 'sparkles' : 'play';
  const statusText = `${getIconSvg(statusIcon)} ${escapeHtml(statusLabel)}`;

  const numHtml = lessonNum ? `<div class="lesson-num">${escapeHtml(lessonNum)}</div>` : '';
  const descHtml = description ? `<div class="lesson-it">${escapeHtml(description)}</div>` : '';
  const timeHtml = time ? `<span class="lesson-time">${escapeHtml(time)}</span>` : '';

  const inner = `
        <span class="lesson-node-marker">${getIconSvg(statusIcon)}</span>
        <div class="lesson-node-copy">
          ${numHtml}
          <div class="lesson-name">${escapeHtml(title)}</div>
          ${descHtml}
          <div class="lesson-right">
            <span class="${statusClass}">${statusText}</span>
            ${timeHtml}
          </div>
        </div>
  `;

  const href = getLessonHref(lesson);
  const row = isAvailable && href && href !== '#'
    ? `<a href="${escapeHtml(href)}" class="${rowClass}">${inner}</a>`
    : `<div class="${rowClass}"${isAvailable ? '' : ' aria-disabled="true"'}>${inner}</div>`;

  return row;
}

function renderUnitGroup(unit, totalUnitsInCategory) {
  let hasCurrentLesson = false;
  const lessonsHtml = (unit.lessons || []).map((lesson, index) => {
    const nodeState = lesson.status !== 'available'
      ? 'locked'
      : lesson.completed
        ? 'upcoming'
      : hasCurrentLesson
        ? 'upcoming'
        : 'current';
    if (nodeState === 'current') hasCurrentLesson = true;
    const row = Math.floor(index / LESSONS_PER_ROW);
    const positionInRow = index % LESSONS_PER_ROW;
    const column = row % 2 === 0
      ? positionInRow
      : LESSONS_PER_ROW - positionInRow - 1;
    return `<div class="lesson-node lesson-node-${nodeState}" style="grid-area: ${row + 1} / ${column + 1}">${renderLessonRow(lesson, nodeState)}</div>`;
  }).join('');
  const singleUnit = totalUnitsInCategory === 1;

  if (singleUnit) {
    return `
      <div class="unit-group open" data-unit-id="${escapeHtml(unit.id)}">
        <div class="lessons-list">
          ${lessonsHtml}
        </div>
      </div>
    `;
  }

  return `
    <div class="unit-group" data-unit-id="${escapeHtml(unit.id)}">
      <div class="unit-group-header" onclick="toggleUnitGroup(this.closest('.unit-group'), event)">
        <div class="unit-group-title">${escapeHtml(getLocalizedText(unit.title))}</div>
        <div class="unit-group-meta">
          ${unit.badgeText ? `<span class="unit-group-badge${unit.locked ? '' : ' active-badge'}">${escapeHtml(unit.badgeText)}</span>` : ''}
          <span class="unit-group-chevron">${getIconSvg('chevron-down')}</span>
        </div>
      </div>
      <div class="lessons-list">
        ${lessonsHtml}
      </div>
    </div>
  `;
}

function renderCategoryCard(category, index) {
  const numClass = `u${index + 1}`;
  const openClass = category.defaultOpen ? ' open' : '';
  const badgeClass = category.locked ? 'unit-badge' : 'unit-badge active-badge';
  const unitsHtml = (category.units || []).map((unit) => renderUnitGroup(unit, (category.units || []).length)).join('');
  const assessment = category.assessment;
  const lang = getPathLanguage();
  let assessmentStatus;
  let assessmentAction;
  if (assessment.total === 0) {
    assessmentStatus = lang === 'en' ? 'No required lessons are available yet.' : 'Поки немає доступних основних уроків.';
    assessmentAction = lang === 'en' ? 'Assessment unavailable' : 'Тест поки недоступний';
  } else if (assessment.pathLocked) {
    assessmentStatus = lang === 'en' ? 'This learning path is not available yet.' : 'Цей напрямок поки недоступний.';
    assessmentAction = lang === 'en' ? 'Learning path is locked' : 'Напрямок поки заблокований';
  } else if (assessment.unlocked) {
    assessmentStatus = lang === 'en' ? 'Path complete · final assessment coming soon' : 'Напрямок завершено · фінальний тест незабаром';
    assessmentAction = lang === 'en' ? 'Final assessment coming soon' : 'Фінальний тест незабаром';
  } else {
    assessmentStatus = lang === 'en'
      ? `${assessment.completed}/${assessment.total} required lessons completed`
      : `Завершено ${assessment.completed} із ${assessment.total} основних уроків`;
    assessmentAction = lang === 'en' ? 'Complete the path to unlock' : 'Завершіть напрямок, щоб розблокувати';
  }
  const title = getLocalizedText(category.title);
  const subtitle = getLocalizedText(category.subtitle);
  const badgeText = category.badgeText || buildBadgeText(category);

  return `
    <div class="unit-card${openClass}" id="path-${escapeHtml(category.id)}" data-category-id="${escapeHtml(category.id)}" onclick="toggleUnit(this)">
      <div class="unit-header">
        <div class="unit-header-left">
          <div class="unit-num ${numClass}">${getIconSvg(category.icon || 'paths')}</div>
          <div>
            <div class="unit-title">${escapeHtml(title)}</div>
            <div class="unit-sub">${escapeHtml(subtitle)}</div>
          </div>
        </div>
        <div class="unit-meta">
          <span class="${badgeClass}">${getIconSvg(category.locked ? 'lock' : 'status-dot')} ${escapeHtml(badgeText)}</span>
          <span class="unit-chevron">${getIconSvg('chevron-down')}</span>
        </div>
      </div>
      <div class="category-body" onclick="event.stopPropagation()">
        ${unitsHtml}
        <section class="path-assessment-checkpoint${assessment.unlocked ? ' is-unlocked' : ' is-locked'}" aria-label="${lang === 'en' ? 'Final learning path assessment' : 'Фінальний тест напрямку навчання'}">
          <div class="path-assessment-checkpoint-icon">${getIconSvg('tests')}</div>
          <div class="path-assessment-checkpoint-copy">
            <span class="path-assessment-checkpoint-label">${lang === 'en' ? 'FINAL CHECKPOINT' : 'ФІНАЛЬНА ПЕРЕВІРКА'}</span>
            <h3>${lang === 'en' ? 'Final assessment' : 'Фінальний тест'}</h3>
            <p>${lang === 'en' ? 'Review what you have learned at the end of this path.' : 'Перевірте, чого ви навчилися, наприкінці цього напрямку.'}</p>
            <span class="path-assessment-checkpoint-status">${getIconSvg(assessment.unlocked ? 'status-dot' : 'lock')} ${escapeHtml(assessmentStatus)}</span>
          </div>
          <button type="button" class="path-assessment-checkpoint-action" disabled aria-label="${escapeHtml(assessmentAction)}">
            ${getIconSvg(assessment.unlocked ? 'clock' : 'lock')} ${escapeHtml(assessmentAction)}
          </button>
        </section>
      </div>
    </div>
  `;
}

function renderCategories(progressRecords = []) {
  const container = document.getElementById('pathContainer');
  if (!container) return;

  const categories = getCoursePaths().map((path) => {
    const units = window.LSPathProgress.getSequentialUnits(path, progressRecords).map((unit) => ({
      ...unit,
      lessons: unit.lessons.map((lesson) => ({
        ...lesson,
        href: getLessonHref(lesson)
      }))
    }));
    const pathWithProgress = { ...path, units };

    return {
      id: path.id,
      icon: path.icon || 'paths',
      title: path.title,
      subtitle: path.subtitle,
      locked: Boolean(path.locked),
      defaultOpen: Boolean(path.defaultOpen),
      badgeText: buildBadgeText(pathWithProgress),
      assessment: window.LSPathAssessment.getState(path, progressRecords),
      units
    };
  });

  if (!categories.length) {
    const lang = getPathLanguage();
    container.innerHTML = `<p class="path-message" role="status">${lang === 'en' ? 'No learning paths are available for this course yet.' : 'Для цього курсу поки немає доступних напрямків навчання.'}</p>`;
    return;
  }

  container.innerHTML = categories.map(renderCategoryCard).join('');
  applySourceLanguageSettings();
  window.renderRegisteredIcons?.(container);
  window.renderLessonPathConnectors?.();
}

document.addEventListener('DOMContentLoaded', async () => {
  try {
    if (typeof window.loadCourse === 'function') {
      window.__LS_COURSE_DATA = await window.loadCourse();
    }
  } catch (error) {
    console.warn('Could not load course data for paths:', error);
    const container = document.getElementById('pathContainer');
    const lang = getPathLanguage();
    if (container) {
      container.innerHTML = `<p class="path-message" role="alert">${lang === 'en' ? 'Learning paths could not be loaded. Please check your connection and try again.' : 'Не вдалося завантажити напрямки навчання. Перевірте з’єднання та спробуйте ще раз.'}</p>`;
    }
    return;
  }

  try {
    if (!window.Progress || typeof window.Progress.list !== 'function') {
      throw new Error('Lesson progress is unavailable.');
    }
    const courseId = typeof window.getCourseId === 'function' ? window.getCourseId() : 'it';
    pathProgressRecords = await window.Progress.list('lessonProgress', { courseId });
    renderCategories(pathProgressRecords);
  } catch (error) {
    console.error('Could not load learning path progress:', error);
    const container = document.getElementById('pathContainer');
    const lang = getPathLanguage();
    if (container) {
      container.innerHTML = `<p class="path-message" role="alert">${lang === 'en' ? 'Learning path completion could not be loaded. Please check your connection and try again.' : 'Не вдалося завантажити прогрес напрямків. Перевірте з’єднання та спробуйте ще раз.'}</p>`;
    }
  }
});

window.addEventListener('sourceLanguageChanged', () => {
  renderCategories(pathProgressRecords);
});

document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-path-1]');
  if (!target) return;
  var result = (function(event) {
closeMobNav()
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-path-2]');
  if (!target) return;
  var result = (function(event) {
closeMobNav()
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-path-3]');
  if (!target) return;
  var result = (function(event) {
location.href='path.html'
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-path-4]');
  if (!target) return;
  var result = (function(event) {
location.href='flashcards.html'
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-path-5]');
  if (!target) return;
  var result = (function(event) {
location.href='exercises.html'
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-path-6]');
  if (!target) return;
  var result = (function(event) {
location.href='dictionary.html'
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});


document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-path-8]');
  if (!target) return;
  var result = (function(event) {
location.href='grammar.html'
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-path-9]');
  if (!target) return;
  var result = (function(event) {
toggleTheme()
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-path-10]');
  if (!target) return;
  var result = (function(event) {
openProfileModal()
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-path-11]');
  if (!target) return;
  var result = (function(event) {
openMobNav()
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});
