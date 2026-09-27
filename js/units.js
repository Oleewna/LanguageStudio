function toggleUnit(card) {
  card.classList.toggle('open');
}

function toggleUnitGroup(groupEl, event) {
  if (event) event.stopPropagation();
  if (groupEl) groupEl.classList.toggle('open');
}

const categories = [
  {
    id: 'foundations',
    icon: '👋',
    title: 'Communication basics',
    subtitle: 'Greetings, introductions, numbers 0–100, and the verbs essere & avere — the foundation for every path',
    locked: false,
    defaultOpen: true,
    badgeText: '1/5 lessons available',
    units: [
      {
        id: 'foundations-unit-1',
        title: 'Communication basics',
        lessons: [
          { num: 'Lesson 1', title: 'Introductions — “Come ti chiami?”', description: 'Your first Milan dialogue, new words, and conversational culture', href: '../lessons/communication-basics-lesson-1.html', status: 'available', time: '~15 min' },
          { num: 'Lesson 2', title: 'Come ti chiami? (What is your name?)', description: 'Introductions, the verb chiamarsi, and polite expressions', href: null, status: 'soon', time: '~15 min' },
          { num: 'Lesson 3', title: 'Di dove sei? (Where are you from?)', description: 'Countries, nationalities, and conjugating essere', href: null, status: 'soon', time: '~15 min' },
          { num: 'Lesson 4', title: "I numeri e l'età (Numbers and age)", description: 'Counting 0–100, the verb avere, and phone numbers', href: null, status: 'soon', time: '~20 min' },
          { num: 'Lesson 5', title: 'La mia scena · Final practice', description: 'A review quiz and creating your own dialogue', href: null, status: 'soon', time: '~25 min' }
        ]
      }
    ]
  },
  {
    id: 'tourist',
    icon: '🧳',
    title: 'Travel Italian',
    subtitle: 'Hotels, restaurants, transport, shopping, and emergency phrases for travel',
    locked: true,
    defaultOpen: false,
    badgeText: '🔒 Locked',
    units: [
      {
        id: 'tourist-unit-1',
        title: 'Travel Italian',
        lessons: [
          { title: 'Alla stazione (At the station and airport)', href: null, status: 'soon' },
          { title: 'In albergo (Checking into a hotel)', href: null, status: 'soon' },
          { title: 'Un caffè, per favore (At the bar and café)', href: null, status: 'soon' },
          { title: 'Al ristorante (Ordering at a restaurant)', href: null, status: 'soon' },
          { title: 'Lo shopping e i prezzi (Shopping and prices)', href: null, status: 'soon' }
        ]
      }
    ]
  },
  {
    id: 'business',
    icon: '💼',
    title: 'Business Italian',
    subtitle: 'Office communication, meetings, emails, and small talk with colleagues',
    locked: true,
    defaultOpen: false,
    badgeText: '🔒 Locked',
    units: [
      {
        id: 'business-unit-1',
        title: 'Business Italian',
        lessons: [
          { title: 'In ufficio (First day at the office)', href: null, status: 'soon' },
          { title: 'Riunioni e appuntamenti (Meetings and appointments)', href: null, status: 'soon' },
          { title: 'Email e comunicazione scritta (Business emails)', href: null, status: 'soon' },
          { title: 'Networking e small talk (Talking with colleagues)', href: null, status: 'soon' }
        ]
      }
    ]
  }
];

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str == null ? '' : String(str);
  return div.innerHTML;
}

function renderLessonRow(lesson) {
  const isAvailable = lesson.status === 'available';
  const rowClass = isAvailable ? 'lesson-row active-lesson' : 'lesson-row locked';
  const statusClass = isAvailable ? 'lesson-status ls-available' : 'lesson-status ls-soon';
  const statusText = isAvailable ? '<svg class="ls-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M10 9l5 3-5 3z" fill="currentColor" stroke="none"/></svg> Open' : 'Soon';

  const numHtml = lesson.num ? `<div class="lesson-num">${escapeHtml(lesson.num)}</div>` : '';
  const descHtml = lesson.description ? `<div class="lesson-it">${escapeHtml(lesson.description)}</div>` : '';
  const timeHtml = lesson.time ? `<span class="lesson-time">${escapeHtml(lesson.time)}</span>` : '';

  const inner = `
        <div>
          ${numHtml}
          <div class="lesson-name">${escapeHtml(lesson.title)}</div>
          ${descHtml}
        </div>
        <div class="lesson-right">
          <span class="${statusClass}">${statusText}</span>
          ${timeHtml}
        </div>
  `;

  if (lesson.href) {
    return `<a href="${escapeHtml(lesson.href)}" class="${rowClass}">${inner}</a>`;
  }
  return `<div class="${rowClass}">${inner}</div>`;
}

function renderUnitGroup(unit, totalUnitsInCategory) {
  const lessonsHtml = unit.lessons.map(renderLessonRow).join('');
  const singleUnit = totalUnitsInCategory === 1;

  if (singleUnit) {
    // Only unit in this category — auto-expand and skip the collapsible
    // header entirely, so no redundant bar appears above the lessons.
    return `
      <div class="unit-group open" data-unit-id="${escapeHtml(unit.id)}">
        <div class="lessons-list">
          ${lessonsHtml}
        </div>
      </div>
    `;
  }

  const badgeHtml = unit.badgeText
    ? `<span class="unit-group-badge${unit.locked ? '' : ' active-badge'}">${escapeHtml(unit.badgeText)}</span>`
    : '';

  return `
    <div class="unit-group" data-unit-id="${escapeHtml(unit.id)}">
      <div class="unit-group-header" onclick="toggleUnitGroup(this.closest('.unit-group'), event)">
        <div class="unit-group-title">${escapeHtml(unit.title)}</div>
        <div class="unit-group-meta">
          ${badgeHtml}
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
  const unitsHtml = category.units.map(u => renderUnitGroup(u, category.units.length)).join('');

  return `
    <div class="unit-card${openClass}" data-category-id="${escapeHtml(category.id)}" onclick="toggleUnit(this)">
      <div class="unit-header">
        <div class="unit-header-left">
          <div class="unit-num ${numClass}">${category.icon}</div>
          <div>
            <div class="unit-title">${escapeHtml(category.title)}</div>
            <div class="unit-sub">${escapeHtml(category.subtitle)}</div>
          </div>
        </div>
        <div class="unit-meta">
          <span class="${badgeClass}">${escapeHtml(category.badgeText)}</span>
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
  const container = document.getElementById('unitsContainer');
  if (!container) return;
  container.innerHTML = categories.map(renderCategoryCard).join('');
  applySourceLanguageSettings();
}

document.addEventListener('DOMContentLoaded', () => {
  renderCategories();
  console.log(categories);
});

document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-units-1]');
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
  var target = event.target.closest('[data-external-handler-units-2]');
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
  var target = event.target.closest('[data-external-handler-units-3]');
  if (!target) return;
  var result = (function(event) {
location.href='units.html'
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-units-4]');
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
  var target = event.target.closest('[data-external-handler-units-5]');
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
  var target = event.target.closest('[data-external-handler-units-6]');
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
  var target = event.target.closest('[data-external-handler-units-7]');
  if (!target) return;
  var result = (function(event) {
location.href='games.html'
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-units-8]');
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
  var target = event.target.closest('[data-external-handler-units-9]');
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
  var target = event.target.closest('[data-external-handler-units-10]');
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
  var target = event.target.closest('[data-external-handler-units-11]');
  if (!target) return;
  var result = (function(event) {
openMobNav()
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});
