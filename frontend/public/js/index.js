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

function renderRoadmap(course) {
  const roadmapRoot = document.getElementById('roadmapRoot');
  if (!roadmapRoot || !course || !Array.isArray(course.paths)) return;

  roadmapRoot.innerHTML = course.paths.map((path) => {
    const isLocked = Boolean(path.locked);
    const totalLessons = (path.units || []).reduce((sum, unit) => sum + (unit.lessons || []).length, 0);
    const availableLessons = (path.units || []).reduce((sum, unit) => sum + (unit.lessons || []).filter((lesson) => lesson.status === 'available').length, 0);
    const title = getLocalizedText(path.title);
    const subtitle = getLocalizedText(path.subtitle);
    const badgeClass = isLocked ? 'ub-locked' : 'ub-active';
    const badgeText = isLocked ? '🔒 Заблоковано' : `🟢 ${title} · Активний`;
    const summary = isLocked ? 'Незабаром' : `${availableLessons}/${totalLessons} уроків доступно`;

    const unitsHtml = (path.units || []).map((unit) => {
      const lessonRows = (unit.lessons || []).map((lesson) => {
        const lessonTitle = getLocalizedText(lesson.title);
        const lessonDescription = getLocalizedText(lesson.description);
        const lessonNum = getLocalizedText(lesson.num) || '';
        const isAvailable = Boolean(lesson.status === 'available');
        const lessonHref = lesson.href || `pages/lesson.html?course=${encodeURIComponent(course.id || 'it')}&lesson=${encodeURIComponent(lesson.id || '')}`;
        const badge = isAvailable ? 'Почати' : 'Незабаром';
        const item = `
          <div class="tree-node-item">
            <div class="node-bullet ${isAvailable ? 'nb-current' : 'nb-locked'}">${escapeHtml(lessonNum || lesson.id || '')}</div>
            ${isAvailable ? `<a href="${escapeHtml(lessonHref)}" class="node-content-card">` : `<div class="node-content-card locked-card">`}
              <div>
                <div class="node-tag">${escapeHtml(lessonNum ? `${lessonNum} · ${badge}` : `${badge}`)}</div>
                <div class="node-title">${escapeHtml(lessonTitle)}</div>
                <div class="node-sub">${escapeHtml(lessonDescription || '')}</div>
              </div>
              <span class="node-btn ${isAvailable ? 'nb-btn-active' : 'nb-btn-locked'}">${isAvailable ? `Почати <svg class="ls-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M10 9l5 3-5 3z" fill="currentColor" stroke="none"/></svg>` : '<svg class="ls-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> Незабаром'}</span>
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
            <span class="unit-badge-main ${badgeClass}">${escapeHtml(badgeText)}</span>
            <div class="unit-tree-title">${escapeHtml(path.icon || '')} ${escapeHtml(title)}</div>
            <div class="unit-tree-desc">${escapeHtml(subtitle)}</div>
          </div>
          ${!isLocked ? '<a href="pages/path.html" class="btn-ghost" id="external-style-index-1">Усі напрямки →</a>' : ''}
        </div>
        ${unitsHtml}
      </div>
    `;
  }).join('');
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
      window.__LS_COURSE_DATA = course;
      renderHubCards(course);
      renderRoadmap(course);
    }
  } catch (error) {
    console.warn('Could not refresh home page from course data:', error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  refreshHomePage();
});

window.addEventListener('sourceLanguageChanged', () => {
  if (window.__LS_COURSE_DATA) {
    renderRoadmap(window.__LS_COURSE_DATA);
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
