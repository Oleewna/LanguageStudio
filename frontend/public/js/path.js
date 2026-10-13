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

function getLessonHref(lesson) {
  if (!lesson) return '#';
  if (lesson.href) return lesson.href;

  const courseId = typeof window.getCourseId === 'function' ? window.getCourseId() : 'it';
  // Canonical lesson route is extensionless so the static server preserves the course/lesson
  // query parameters instead of forcing a redirect that drops them.
  const pagePath = 'pages/lesson';
  const lessonId = lesson.id || '';
  return `${pagePath}?course=${encodeURIComponent(courseId)}&lesson=${encodeURIComponent(lessonId)}`;
}

function getLessonStatusLabel(lesson) {
  const isAvailable = (lesson && lesson.status) === 'available';
  const lang = typeof window.getSourceLanguage === 'function' ? window.getSourceLanguage() : 'uk';
  const openLabel = typeof window.getInterfaceTranslation === 'function' ? (window.getInterfaceTranslation('Open', lang) || 'Open') : 'Open';
  const soonLabel = typeof window.getInterfaceTranslation === 'function' ? (window.getInterfaceTranslation('Soon', lang) || 'Soon') : 'Soon';
  return isAvailable ? openLabel : soonLabel;
}

function buildBadgeText(category) {
  const total = (category.units || []).reduce((sum, unit) => sum + (unit.lessons || []).length, 0);
  const available = (category.units || []).reduce((sum, unit) => sum + (unit.lessons || []).filter((lesson) => lesson.status === 'available').length, 0);

  if (category.locked) {
    return '🔒 Locked';
  }

  return `${available}/${total} lessons available`;
}

function renderLessonRow(lesson) {
  const isAvailable = lesson.status === 'available';
  const rowClass = isAvailable ? 'lesson-row active-lesson' : 'lesson-row locked';
  const statusClass = isAvailable ? 'lesson-status ls-available' : 'lesson-status ls-soon';
  const title = getLocalizedText(lesson.title);
  const description = getLocalizedText(lesson.description);
  const lessonNum = getLocalizedText(lesson.num);
  const statusText = isAvailable ? `<svg class="ls-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M10 9l5 3-5 3z" fill="currentColor" stroke="none"/></svg> ${escapeHtml(getLessonStatusLabel(lesson))}` : escapeHtml(getLessonStatusLabel(lesson));

  const numHtml = lessonNum ? `<div class="lesson-num">${escapeHtml(lessonNum)}</div>` : '';
  const descHtml = description ? `<div class="lesson-it">${escapeHtml(description)}</div>` : '';
  const timeHtml = lesson.time ? `<span class="lesson-time">${escapeHtml(lesson.time)}</span>` : '';

  const inner = `
        <div>
          ${numHtml}
          <div class="lesson-name">${escapeHtml(title)}</div>
          ${descHtml}
        </div>
        <div class="lesson-right">
          <span class="${statusClass}">${statusText}</span>
          ${timeHtml}
        </div>
  `;

  const href = getLessonHref(lesson);
  if (href && href !== '#') {
    return `<a href="${escapeHtml(href)}" class="${rowClass}">${inner}</a>`;
  }

  return `<div class="${rowClass}">${inner}</div>`;
}

function renderUnitGroup(unit, totalUnitsInCategory) {
  const lessonsHtml = (unit.lessons || []).map(renderLessonRow).join('');
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
          <span class="unit-group-chevron"><svg class="ls-icon ls-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg></span>
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
  const title = getLocalizedText(category.title);
  const subtitle = getLocalizedText(category.subtitle);
  const badgeText = category.badgeText || buildBadgeText(category);

  return `
    <div class="unit-card${openClass}" data-category-id="${escapeHtml(category.id)}" onclick="toggleUnit(this)">
      <div class="unit-header">
        <div class="unit-header-left">
          <div class="unit-num ${numClass}">${escapeHtml(category.icon || '')}</div>
          <div>
            <div class="unit-title">${escapeHtml(title)}</div>
            <div class="unit-sub">${escapeHtml(subtitle)}</div>
          </div>
        </div>
        <div class="unit-meta">
          <span class="${badgeClass}">${escapeHtml(badgeText)}</span>
          <span class="unit-chevron"><svg class="ls-icon ls-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg></span>
        </div>
      </div>
      <div class="category-body" onclick="event.stopPropagation()">
        ${unitsHtml}
      </div>
    </div>
  `;
}

function renderCategories() {
  const container = document.getElementById('pathContainer');
  if (!container) return;

  const categories = getCoursePaths().map((path) => ({
    id: path.id,
    icon: path.icon || '📚',
    title: path.title,
    subtitle: path.subtitle,
    locked: Boolean(path.locked),
    defaultOpen: Boolean(path.defaultOpen),
    badgeText: path.locked ? '🔒 Locked' : `${(path.units || []).reduce((sum, unit) => sum + (unit.lessons || []).filter((lesson) => lesson.status === 'available').length, 0)}/${(path.units || []).reduce((sum, unit) => sum + (unit.lessons || []).length, 0)} lessons available`,
    units: (path.units || []).map((unit) => ({
      ...unit,
      lessons: (unit.lessons || []).map((lesson) => ({
        ...lesson,
        href: getLessonHref(lesson)
      }))
    }))
  }));

  container.innerHTML = categories.map(renderCategoryCard).join('');
  applySourceLanguageSettings();
}

document.addEventListener('DOMContentLoaded', async () => {
  try {
    if (typeof window.loadCourse === 'function') {
      window.__LS_COURSE_DATA = await window.loadCourse();
    }
  } catch (error) {
    console.warn('Could not load course data for paths:', error);
  }
  renderCategories();
});

window.addEventListener('sourceLanguageChanged', () => {
  renderCategories();
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
