function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str == null ? '' : String(str);
  return div.innerHTML;
}

function getLocalizedText(value) {
  if (typeof window.L === 'function') return window.L(value);
  if (value && typeof value === 'object') return value.uk || value.en || '';
  return value || '';
}

let homeProgressRecords = [];

function renderRoadmap(course, progressRecords = homeProgressRecords) {
  const roadmapRoot = document.getElementById('roadmapRoot');
  if (!roadmapRoot || !course || !Array.isArray(course.paths)) return;
  const lessonsPerRow = 3;
  const pagesPrefix = window.LSComponents?.prefix || '';

  roadmapRoot.innerHTML = course.paths.map((path) => {
    const isLocked = Boolean(path.locked);
    const units = window.LSPathProgress.getSequentialUnits(path, progressRecords);
    const totalLessons = units.reduce((sum, unit) => sum + (unit.lessons || []).length, 0);
    const availableLessons = units.reduce((sum, unit) => sum + (unit.lessons || []).filter((lesson) => lesson.status === 'available').length, 0);
    const title = getLocalizedText(path.title);
    const subtitle = getLocalizedText(path.subtitle);
    const badgeClass = isLocked ? 'ub-locked' : 'ub-active';
    const badgeText = isLocked
      ? getLocalizedText({ uk: 'Заблоковано', en: 'Locked' })
      : `${title} · ${getLocalizedText({ uk: 'Активний', en: 'Active' })}`;
    const summary = isLocked
      ? getLocalizedText({ uk: 'Незабаром', en: 'Coming soon' })
      : `${availableLessons}/${totalLessons} ${getLocalizedText({ uk: 'уроків доступно', en: 'lessons available' })}`;

    let hasCurrentLesson = false;
    const unitsHtml = units.map((unit) => {
      const lessonRows = (unit.lessons || []).map((lesson, index) => {
        const lessonTitle = getLocalizedText(lesson.title);
        const lessonDescription = getLocalizedText(lesson.description);
        const lessonNum = getLocalizedText(lesson.num) || '';
        const row = Math.floor(index / lessonsPerRow);
        const positionInRow = index % lessonsPerRow;
        const column = row % 2 === 0
          ? positionInRow
          : lessonsPerRow - positionInRow - 1;
        const isAvailable = Boolean(lesson.status === 'available');
        const isCurrent = isAvailable && !lesson.completed && !hasCurrentLesson;
        if (isCurrent) hasCurrentLesson = true;
        const nodeState = isCurrent ? 'current' : isAvailable ? 'upcoming' : 'locked';
        const markerIcon = isCurrent ? 'sparkles' : lesson.completed ? 'status-dot' : isAvailable ? 'play' : 'lock';
        const nodeLabel = lesson.completed
          ? getLocalizedText({ uk: 'Завершено', en: 'Completed' })
          : isCurrent
            ? getLocalizedText({ uk: 'Почніть тут', en: 'Start here' })
            : isAvailable
            ? getLocalizedText({ uk: 'Далі', en: 'Up next' })
            : getLocalizedText({ uk: 'Заблоковано', en: 'Locked' });
        const lessonHref = lesson.href || `${pagesPrefix}pages/lesson.html?course=${encodeURIComponent(course.id || 'it')}&lesson=${encodeURIComponent(lesson.id || '')}`;
        const item = `
          <div class="tree-node-item tree-node-${nodeState}" style="grid-area: ${row + 1} / ${column + 1}">
            <div class="node-bullet ${isCurrent ? 'nb-current' : isAvailable ? 'nb-upcoming' : 'nb-locked'}">${getIconSvg(markerIcon)}</div>
            ${isAvailable ? `<a href="${escapeHtml(lessonHref)}" class="node-content-card">` : `<div class="node-content-card locked-card">`}
              <div>
                <div class="node-tag">${escapeHtml(lessonNum)}</div>
                <div class="node-title">${escapeHtml(lessonTitle)}</div>
                <div class="node-sub">${escapeHtml(lessonDescription || '')}</div>
              </div>
              <span class="node-btn ${isCurrent ? 'nb-btn-active' : isAvailable ? 'nb-btn-upcoming' : 'nb-btn-locked'}">${escapeHtml(nodeLabel)}</span>
            ${isAvailable ? '</a>' : '</div>'}
          </div>
        `;
        return item;
      }).join('');

      return `<div class="tree-path">${lessonRows}</div>`;
    }).join('');

    return `
      <div class="unit-tree-card">
        <div class="unit-tree-header">
          <div>
            <span class="unit-badge-main ${badgeClass}">${getIconSvg(isLocked ? 'lock' : 'status-dot')} ${escapeHtml(badgeText)}</span>
            <div class="unit-tree-title">${getIconSvg(path.icon || 'paths')} ${escapeHtml(title)}</div>
            <div class="unit-tree-desc">${escapeHtml(subtitle)}</div>
          </div>
          ${!isLocked ? `<a href="${pagesPrefix}pages/path.html" class="btn-ghost" id="external-style-index-1">${getLocalizedText({ uk: 'Усі напрямки', en: 'All paths' })} ${getIconSvg('arrow-right')}</a>` : ''}
        </div>
        ${unitsHtml}
      </div>
    `;
  }).join('');
  window.renderLessonPathConnectors?.();
}

function renderHubCards(course) {
  const hubGrid = document.getElementById('hubGrid');
  if (!hubGrid || !course || !course.features) return;

  const featureCards = ['flashcards', 'dictionary', 'exercises', 'grammar', 'tests'];
  featureCards.forEach((key) => {
    const card = hubGrid.querySelector(`[data-feature="${key}"]`);
    if (card && course.features[key] === false) {
      card.style.display = 'none';
    }
  });
}

async function refreshHomePage() {
  try {
    const course = typeof window.loadCourse === 'function' ? await window.loadCourse() : null;
    if (course) {
      if (!window.Progress || typeof window.Progress.list !== 'function') {
        throw new Error('Lesson progress is unavailable.');
      }
      const courseId = typeof window.getCourseId === 'function' ? window.getCourseId() : 'it';
      homeProgressRecords = await window.Progress.list('lessonProgress', { courseId });
      window.__LS_COURSE_DATA = course;
      renderHubCards(course);
      renderRoadmap(course, homeProgressRecords);
    }
  } catch (error) {
    console.error('Could not refresh home page and lesson progress:', error);
    const roadmapRoot = document.getElementById('roadmapRoot');
    const lang = typeof window.getSourceLanguage === 'function' && window.getSourceLanguage() === 'en' ? 'en' : 'uk';
    if (roadmapRoot) {
      roadmapRoot.innerHTML = `<p class="path-message" role="alert">${lang === 'en' ? 'Learning paths could not be loaded. Please try again.' : 'Не вдалося завантажити напрямки навчання. Спробуйте ще раз.'}</p>`;
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  refreshHomePage();
});

window.addEventListener('sourceLanguageChanged', () => {
  if (window.__LS_COURSE_DATA) {
    renderRoadmap(window.__LS_COURSE_DATA, homeProgressRecords);
  }
});

document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-index-1]');
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
  var target = event.target.closest('[data-external-handler-index-2]');
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
  var target = event.target.closest('[data-external-handler-index-3]');
  if (!target) return;
  var result = (function(event) {
location.href='pages/path.html'
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-index-4]');
  if (!target) return;
  var result = (function(event) {
location.href='pages/flashcards.html'
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-index-5]');
  if (!target) return;
  var result = (function(event) {
location.href='pages/exercises.html'
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-index-6]');
  if (!target) return;
  var result = (function(event) {
location.href='pages/dictionary.html'
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});


document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-index-8]');
  if (!target) return;
  var result = (function(event) {
location.href='pages/grammar.html'
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-index-9]');
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
  var target = event.target.closest('[data-external-handler-index-10]');
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
  var target = event.target.closest('[data-external-handler-index-11]');
  if (!target) return;
  var result = (function(event) {
openMobNav()
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});
