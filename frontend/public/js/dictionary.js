const DICT_KEY = (typeof window.courseKey === 'function') ? window.courseKey('custom_dict') : 'ls_custom_dict';
const LEARNED_KEY = (typeof window.courseKey === 'function') ? window.courseKey('dict_learned') : 'ls_dict_learned';

function getLocalizedText(value, fallback = '') {
  if (typeof value === 'string') return value;
  if (value && typeof value === 'object') {
    const lang = (typeof getSourceLanguage === 'function') ? getSourceLanguage() : 'uk';
    return value[lang] || value.uk || value.en || fallback;
  }
  return fallback;
}

function normalizeWordEntry(word) {
  const item = { ...word };
  item.word = item.word || '';
  item.id = item.id || `${item.word}-${Math.random().toString(36).slice(2, 8)}`;
  item.lesson = item.lesson || '1.1';
  item.category = item.category || item.topic || 'general';
  item.type = item.type || 'other';
  item.trans = item.trans || '';
  item.phon = getLocalizedText(item.phon, item.phon || '');
  item.custom = Boolean(item.custom);
  return item;
}

async function getCourseDictionaryWords() {
  if (typeof window.loadCourseData !== 'function') return [];
  try {
    const data = await window.loadCourseData('vocab');
    return Array.isArray(data) ? data.map(normalizeWordEntry) : [];
  } catch (error) {
    return [];
  }
}

function getLearnedIds() {
  if (typeof window.getJSON === 'function') {
    return Array.isArray(window.getJSON(LEARNED_KEY, [])) ? window.getJSON(LEARNED_KEY, []) : [];
  }
  try { return JSON.parse(localStorage.getItem(LEARNED_KEY) || '[]'); } catch { return []; }
}

function toggleLearned(id, evt) {
  if (evt) evt.stopPropagation();
  let learned = getLearnedIds();
  if (learned.includes(id)) {
    learned = learned.filter(x => x !== id);
  } else {
    learned.push(id);
    addXP(5);
  }
  if (typeof window.setJSON === 'function') {
    window.setJSON(LEARNED_KEY, learned);
  } else {
    try { localStorage.setItem(LEARNED_KEY, JSON.stringify(learned)); } catch {}
  }
  renderDictionary();
}

function populateFilters(all) {
  const lessonSel = document.getElementById('filterLesson');
  const catSel = document.getElementById('filterCategory');
  const typeSel = document.getElementById('filterType');
  if (!lessonSel || !catSel || !typeSel) return;

  const prevLesson = lessonSel.value, prevCat = catSel.value, prevType = typeSel.value;

  const lessons = [...new Set(all.map(w => w.lesson).filter(Boolean))].sort();
  const cats = [...new Set(all.map(w => w.category).filter(Boolean))].sort();
  const types = [...new Set(all.map(w => w.type).filter(Boolean))].sort();

  const typeLabels = { phrase: 'Фраза', noun: 'Іменник', verb: 'Дієслово', adjective: 'Прикметник', greeting: 'Привітання', other: 'Інше' };

  lessonSel.innerHTML = '<option value="">Усі уроки</option>' + lessons.map(l => `<option value="${l}">${l}</option>`).join('');
  catSel.innerHTML = '<option value="">Усі теми й ситуації</option>' + cats.map(c => `<option value="${c}">${c}</option>`).join('');
  typeSel.innerHTML = '<option value="">Усі типи</option>' + types.map(t => `<option value="${t}">${typeLabels[t] || t}</option>`).join('');

  lessonSel.value = prevLesson; catSel.value = prevCat; typeSel.value = prevType;
}

function getCustomWords() {
  if (typeof window.getJSON === 'function') {
    return Array.isArray(window.getJSON(DICT_KEY, [])) ? window.getJSON(DICT_KEY, []) : [];
  }
  try { return JSON.parse(localStorage.getItem(DICT_KEY) || '[]'); } catch { return []; }
}

function saveCustomWords(words) {
  if (typeof window.setJSON === 'function') {
    window.setJSON(DICT_KEY, words);
    return;
  }
  try { localStorage.setItem(DICT_KEY, JSON.stringify(words)); } catch {}
}

async function renderDictionary() {
  const grid = document.getElementById('dictGrid');
  if (!grid) return;

  const query = (document.getElementById('dictSearch')?.value || '').toLowerCase().trim();
  const baseWords = await getCourseDictionaryWords();
  const custom = getCustomWords().map(item => ({ ...item, custom: true, id: item.id || `custom-${Date.now()}-${Math.random().toString(16).slice(2)}` }));
  const all = [...baseWords, ...custom].map(normalizeWordEntry);

  populateFilters(all);
  const lessonFilter = document.getElementById('filterLesson').value;
  const catFilter = document.getElementById('filterCategory').value;
  const typeFilter = document.getElementById('filterType').value;
  const learned = getLearnedIds();

  const filtered = all.filter(w => {
    const text = [w.word, getLocalizedText(w.trans, '')].join(' ').toLowerCase();
    const matchesQuery = !query || text.includes(query);
    const matchesLesson = !lessonFilter || w.lesson === lessonFilter;
    const matchesCat = !catFilter || w.category === catFilter;
    const matchesType = !typeFilter || w.type === typeFilter;
    return matchesQuery && matchesLesson && matchesCat && matchesType;
  });

  if (!filtered.length) {
    grid.innerHTML = '<div class="no-results">Слів не знайдено</div>';
    applyInterfaceLanguage();
    return;
  }

  const typeLabels = { phrase: 'Фраза', noun: 'Іменник', verb: 'Дієслово', adjective: 'Прикметник', greeting: 'Привітання', other: 'Інше' };

  grid.innerHTML = filtered.map(w => {
    const isLearned = learned.includes(w.id);
    const translation = getLocalizedText(w.trans, w.trans || '');
    return `
    <div class="dict-card ${isLearned ? 'learned' : ''}" onclick="toggleLearned('${w.id}')" title="Натисніть, щоб позначити як вивчене">
      <div>
        <div class="dict-word-title">
          ${w.word}
          ${w.custom ? '<span class="custom-tag">власне</span>' : ''}
          ${w.type ? `<span class="type-tag">${typeLabels[w.type] || w.type}</span>` : ''}
        </div>
        <div class="dict-phon">${w.phon || ''}</div>
        <div class="dict-trans">${translation}</div>
        <div class="dict-meta">
          ${w.lesson ? `<span>${getIconSvg('path')} ${w.lesson}</span>` : ''}
          ${w.category ? `<span>${getIconSvg('tag')} ${w.category}</span>` : ''}
        </div>
      </div>
      <div class="dict-actions">
        <button class="star-btn ${isLearned ? 'active' : ''}" onclick="toggleLearned('${w.id}', event)" title="${isLearned ? 'Вивчено' : 'Позначити як вивчене'}"><svg class="ls-icon" viewBox="0 0 24 24" fill="${isLearned ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3.5l2.6 5.3 5.9.8-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.8z"/></svg></button>
        <button class="audio-btn" onclick="event.stopPropagation(); speak('${w.word.replace(/'/g, "\\'")}', this)" title="Аудіо"><svg class="ls-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16.5 9a4 4 0 0 1 0 6M19 6.5a7.5 7.5 0 0 1 0 11"/></svg></button>
        ${w.custom ? `<button class="delete-btn" onclick="event.stopPropagation(); deleteWord('${w.id}')" title="Видалити">${getIconSvg('trash')}</button>` : ''}
      </div>
    </div>
  `;
  }).join('');
  applyInterfaceLanguage();
}

function openAddModal() {
  document.getElementById('addModal').classList.add('open');
  document.getElementById('wIt').focus();
}

function closeAddModal() {
  document.getElementById('addModal').classList.remove('open');
  document.getElementById('addWordForm').reset();
}

function saveNewWord(e) {
  e.preventDefault();
  const word = document.getElementById('wIt').value.trim();
  const trans = document.getElementById('wUa').value.trim();
  const phon = document.getElementById('wPhon').value.trim();
  const type = document.getElementById('wType').value;
  const category = document.getElementById('wCategory').value.trim();
  const lesson = document.getElementById('wLesson').value.trim();
  if (!word || !trans) return;

  const list = getCustomWords();
  list.unshift({
    id: 'c_' + Date.now(),
    word,
    trans,
    phon: phon ? `[${phon.replace(/[\[\]]/g, '')}]` : '',
    type: type || 'other',
    category: category || '',
    lesson: lesson || '',
    custom: true
  });
  saveCustomWords(list);
  addXP(25);
  closeAddModal();
  renderDictionary();
}

function deleteWord(id) {
  const list = getCustomWords().filter(w => w.id !== id);
  saveCustomWords(list);
  renderDictionary();
}

document.addEventListener('DOMContentLoaded', () => {
  const filterToggle = document.querySelector('[data-filter-toggle="dictionary"]');
  const dictionaryFiltersPanel = document.getElementById('dictionaryFiltersPanel');
  if (filterToggle && dictionaryFiltersPanel) {
    filterToggle.addEventListener('click', () => {
      const isOpen = filterToggle.getAttribute('aria-expanded') === 'true';
      filterToggle.setAttribute('aria-expanded', String(!isOpen));
      dictionaryFiltersPanel.classList.toggle('hidden', isOpen);
    });
  }

  renderDictionary();
  const params = new URLSearchParams(window.location.search);
  if (params.get('add') === '1') {
    openAddModal();
  }
});
window.addEventListener('sourceLanguageChanged', renderDictionary);

document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-dictionary-1]');
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
  var target = event.target.closest('[data-external-handler-dictionary-2]');
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
  var target = event.target.closest('[data-external-handler-dictionary-3]');
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
  var target = event.target.closest('[data-external-handler-dictionary-4]');
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
  var target = event.target.closest('[data-external-handler-dictionary-5]');
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
  var target = event.target.closest('[data-external-handler-dictionary-6]');
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
  var target = event.target.closest('[data-external-handler-dictionary-8]');
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
  var target = event.target.closest('[data-external-handler-dictionary-9]');
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
  var target = event.target.closest('[data-external-handler-dictionary-10]');
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
  var target = event.target.closest('[data-external-handler-dictionary-11]');
  if (!target) return;
  var result = (function(event) {
openMobNav()
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('input', function(event) {
  var target = event.target.closest('[data-external-handler-dictionary-12]');
  if (!target) return;
  var result = (function(event) {
renderDictionary()
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('change', function(event) {
  var target = event.target.closest('[data-external-handler-dictionary-13]');
  if (!target) return;
  var result = (function(event) {
renderDictionary()
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('change', function(event) {
  var target = event.target.closest('[data-external-handler-dictionary-14]');
  if (!target) return;
  var result = (function(event) {
renderDictionary()
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('change', function(event) {
  var target = event.target.closest('[data-external-handler-dictionary-15]');
  if (!target) return;
  var result = (function(event) {
renderDictionary()
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-dictionary-16]');
  if (!target) return;
  var result = (function(event) {
openAddModal()
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-dictionary-17]');
  if (!target) return;
  var result = (function(event) {
if(event.target===this)closeAddModal()
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-dictionary-18]');
  if (!target) return;
  var result = (function(event) {
closeAddModal()
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('submit', function(event) {
  var target = event.target.closest('[data-external-handler-dictionary-19]');
  if (!target) return;
  var result = (function(event) {
saveNewWord(event)
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-dictionary-20]');
  if (!target) return;
  var result = (function(event) {
closeAddModal()
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});
