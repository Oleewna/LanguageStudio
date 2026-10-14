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
  const paths = Array.isArray(courseData.paths) ? courseData.paths : [];
  const courseId = typeof window.getCourseId === 'function' ? window.getCourseId() : 'it';

  if (courseId !== 'it') return paths;

  return paths.concat({
    id: 'italian-reading',
    icon: 'paths',
    locked: false,
    defaultOpen: false,
    title: { uk: 'Читання італійською', en: 'Italian reading' },
    subtitle: {
      uk: 'Від перших звуків до коротких текстів',
      en: 'From first sounds to short texts'
    },
    units: [{
      id: 'italian-reading',
      title: { uk: 'Шлях читання італійською', en: 'Italian reading path' },
      lessons: [
        {
          id: 'italian-reading-1',
          num: { uk: 'Урок 1', en: 'Lesson 1' },
          title: { uk: 'Голосні, приголосні та склади', en: 'Vowels, consonants, and syllables' },
          description: {
            uk: 'Поєднуй прості звуки та діли слова на склади.',
            en: 'Blend simple sounds and divide words into syllables.'
          },
          time: { uk: '12 хв', en: '12 min' },
          status: 'available'
        },
        {
          id: 'italian-reading-2',
          num: { uk: 'Урок 2', en: 'Lesson 2' },
          title: { uk: 'Тверда C: ca, co, cu', en: 'Hard C: ca, co, cu' },
          description: {
            uk: 'Читай слова з твердим звуком C перед A, O та U.',
            en: 'Read words with hard C before A, O, and U.'
          },
          time: { uk: '12 хв', en: '12 min' },
          status: 'available'
        },
        {
          id: 'italian-reading-3',
          num: { uk: 'Урок 3', en: 'Lesson 3' },
          title: { uk: 'М’яка C і CH: ce, ci, che, chi', en: 'Soft C and CH: ce, ci, che, chi' },
          description: {
            uk: 'Розрізняй м’яку C та написання CH із твердим звуком.',
            en: 'Distinguish soft C from CH spellings with the hard sound.'
          },
          time: { uk: '12 хв', en: '12 min' },
          status: 'available'
        },
        {
          id: 'italian-reading-4',
          num: { uk: 'Урок 4', en: 'Lesson 4' },
          title: { uk: 'Тверда G: ga, go, gu', en: 'Hard G: ga, go, gu' },
          description: {
            uk: 'Читай слова з твердим звуком G перед A, O та U.',
            en: 'Read words with hard G before A, O, and U.'
          },
          time: { uk: '12 хв', en: '12 min' },
          status: 'available'
        },
        {
          id: 'italian-reading-5',
          num: { uk: 'Урок 5', en: 'Lesson 5' },
          title: { uk: 'М’яка G і GH: ge, gi, ghe, ghi', en: 'Soft G and GH: ge, gi, ghe, ghi' },
          description: {
            uk: 'Порівнюй м’який звук G із твердим звуком у сполуках GH.',
            en: 'Compare soft G with the hard sound in GH spellings.'
          },
          time: { uk: '12 хв', en: '12 min' },
          status: 'available'
        },
        {
          id: 'italian-reading-6',
          num: { uk: 'Урок 6', en: 'Lesson 6' },
          title: { uk: 'Звуки сполуки SC', en: 'The sounds of SC' },
          description: {
            uk: 'Слухай і розрізняй основні написання SC.',
            en: 'Listen for and distinguish the main SC spellings.'
          },
          time: { uk: '12 хв', en: '12 min' },
          status: 'available'
        },
        {
          id: 'italian-reading-7',
          num: { uk: 'Урок 7', en: 'Lesson 7' },
          title: { uk: 'Сполука GN', en: 'The GN combination' },
          description: {
            uk: 'Розпізнавай GN як одну звукову сполуку в словах.',
            en: 'Recognize GN as a single sound pattern in words.'
          },
          time: { uk: '12 хв', en: '12 min' },
          status: 'available'
        },
        {
          id: 'italian-reading-8',
          num: { uk: 'Урок 8', en: 'Lesson 8' },
          title: { uk: 'Сполука GLI', en: 'The GLI combination' },
          description: {
            uk: 'Слухай і повторюй слова зі сполукою GLI.',
            en: 'Listen and repeat words with the GLI combination.'
          },
          time: { uk: '12 хв', en: '12 min' },
          status: 'available'
        },
        {
          id: 'italian-reading-9',
          num: { uk: 'Урок 9', en: 'Lesson 9' },
          title: { uk: 'QU в італійських словах', en: 'QU in Italian words' },
          description: {
            uk: 'Читай поширені слова та короткі фрази зі сполукою QU.',
            en: 'Read common words and short phrases with QU.'
          },
          time: { uk: '12 хв', en: '12 min' },
          status: 'available'
        },
        {
          id: 'italian-reading-10',
          num: { uk: 'Урок 10', en: 'Lesson 10' },
          title: { uk: 'Подвоєні приголосні', en: 'Double consonants' },
          description: {
            uk: 'Помічай подвоєні приголосні та чуй різницю у вимові.',
            en: 'Notice doubled consonants and hear the pronunciation contrast.'
          },
          time: { uk: '12 хв', en: '12 min' },
          status: 'available'
        },
        {
          id: 'italian-reading-11',
          num: { uk: 'Урок 11', en: 'Lesson 11' },
          title: { uk: 'Наголос і письмові акценти', en: 'Word stress and written accents' },
          description: {
            uk: 'Звертай увагу на наголос і письмові акценти у словах.',
            en: 'Notice word stress and written accents in Italian words.'
          },
          time: { uk: '12 хв', en: '12 min' },
          status: 'available'
        },
        {
          id: 'italian-reading-12',
          num: { uk: 'Урок 12', en: 'Lesson 12' },
          title: { uk: 'Читаємо короткий текст', en: 'Let’s read a short text' },
          description: {
            uk: 'Поєднуй знайомі закономірності читання в короткій історії.',
            en: 'Bring familiar reading patterns together in a short story.'
          },
          time: { uk: '18 хв', en: '18 min' },
          status: 'available'
        }
      ]
    }]
  });
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
  const lessons = (category.units || []).flatMap((unit) => (unit.lessons || []).flatMap((lesson) => [
    lesson,
    ...(lesson.sublessons || [])
  ]));
  const total = lessons.length;
  const available = lessons.filter((lesson) => lesson.status === 'available').length;
  return getPathBadgeText(total, available, category.locked);
}

function renderLessonRow(lesson, isSublesson = false) {
  const isAvailable = lesson.status === 'available';
  const rowClass = `lesson-row${isSublesson ? ' lesson-row-sublesson' : ''} ${isAvailable ? 'active-lesson' : 'locked'}`;
  const statusClass = isAvailable ? 'lesson-status ls-available' : 'lesson-status ls-soon';
  const title = getLocalizedText(lesson.title);
  const description = getLocalizedText(lesson.description);
  const lessonNum = getLocalizedText(lesson.num);
  const time = getLocalizedText(lesson.time);
  const statusText = `${getIconSvg(isAvailable ? 'lesson' : 'lock')} ${escapeHtml(getLessonStatusLabel(lesson))}`;

  const numHtml = lessonNum ? `<div class="lesson-num">${escapeHtml(lessonNum)}</div>` : '';
  const descHtml = description ? `<div class="lesson-it">${escapeHtml(description)}</div>` : '';
  const timeHtml = time ? `<span class="lesson-time">${escapeHtml(time)}</span>` : '';

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
  const row = href && href !== '#'
    ? `<a href="${escapeHtml(href)}" class="${rowClass}">${inner}</a>`
    : `<div class="${rowClass}">${inner}</div>`;

  if (isSublesson || !Array.isArray(lesson.sublessons) || lesson.sublessons.length === 0) {
    return row;
  }

  const lang = getPathLanguage();
  const sublessonCount = lesson.sublessons.length;
  const toggleLabel = lang === 'en'
    ? `Extra practice (${sublessonCount})`
    : `Додаткова практика (${sublessonCount})`;
  const accessibleLabel = lang === 'en'
    ? `Show ${sublessonCount} sublesson${sublessonCount === 1 ? '' : 's'}`
    : `Показати додаткові уроки: ${sublessonCount}`;
  const expandedLabel = lang === 'en'
    ? `Hide ${sublessonCount} sublesson${sublessonCount === 1 ? '' : 's'}`
    : `Сховати додаткові уроки: ${sublessonCount}`;
  const sublessonsHtml = lesson.sublessons.map((sublesson) => renderLessonRow(sublesson, true)).join('');

  return `
    <div class="lesson-tree-node" data-parent-lesson="${escapeHtml(lesson.id)}">
      ${row}
      <button type="button" class="sublessons-toggle" aria-expanded="false" aria-label="${escapeHtml(accessibleLabel)}" data-collapsed-label="${escapeHtml(accessibleLabel)}" data-expanded-label="${escapeHtml(expandedLabel)}" onclick="toggleSublessons(this)">
        <span class="sublessons-chevron">${getIconSvg('chevron-down')}</span>
        <span>${escapeHtml(toggleLabel)}</span>
      </button>
      <div class="lesson-sublist" hidden>${sublessonsHtml}</div>
    </div>
  `;
}

function toggleSublessons(button) {
  const sublessonList = button.nextElementSibling;
  if (!sublessonList) return;

  const expanded = button.getAttribute('aria-expanded') === 'true';
  button.setAttribute('aria-expanded', String(!expanded));
  button.setAttribute('aria-label', expanded ? button.dataset.collapsedLabel : button.dataset.expandedLabel);
  sublessonList.hidden = expanded;
}

function renderUnitGroup(unit, totalUnitsInCategory) {
  const lessonsHtml = (unit.lessons || []).map((lesson) => renderLessonRow(lesson)).join('');
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
  const title = getLocalizedText(category.title);
  const subtitle = getLocalizedText(category.subtitle);
  const badgeText = category.badgeText || buildBadgeText(category);

  return `
    <div class="unit-card${openClass}" data-category-id="${escapeHtml(category.id)}" onclick="toggleUnit(this)">
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
      </div>
    </div>
  `;
}

function renderCategories() {
  const container = document.getElementById('pathContainer');
  if (!container) return;

  const categories = getCoursePaths().map((path) => ({
    id: path.id,
    icon: path.icon || 'paths',
    title: path.title,
    subtitle: path.subtitle,
    locked: Boolean(path.locked),
    defaultOpen: Boolean(path.defaultOpen),
    badgeText: buildBadgeText(path),
    units: (path.units || []).map((unit) => ({
      ...unit,
      lessons: (unit.lessons || []).map((lesson) => ({
        ...lesson,
        href: getLessonHref(lesson),
        sublessons: (lesson.sublessons || []).map((sublesson) => ({
          ...sublesson,
          href: getLessonHref(sublesson)
        }))
      }))
    }))
  }));

  if (!categories.length) {
    const lang = getPathLanguage();
    container.innerHTML = `<p class="path-message" role="status">${lang === 'en' ? 'No learning paths are available for this course yet.' : 'Для цього курсу поки немає доступних напрямків навчання.'}</p>`;
    return;
  }

  container.innerHTML = categories.map(renderCategoryCard).join('');
  applySourceLanguageSettings();
}

document.addEventListener('DOMContentLoaded', async () => {
  try {
    if (typeof window.loadCourse === 'function') {
      try {
        window.__LS_COURSE_DATA = await window.loadCourse();
      } catch (error) {
        const courseId = typeof window.getCourseId === 'function' ? window.getCourseId() : 'it';
        const response = await fetch(`/courses/${encodeURIComponent(courseId)}/course.json`, { cache: 'no-store' });
        if (!response.ok) throw error;
        window.__LS_COURSE_DATA = await response.json();
      }
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
