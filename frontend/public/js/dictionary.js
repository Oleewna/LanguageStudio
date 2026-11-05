const DICTIONARY_STORAGE_KEY = (typeof window.courseKey === 'function') ? window.courseKey('custom_dict') : 'ls_custom_dict';
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
  item.pronunciation = getLocalizedText(item.pronunciation || item.phon, item.pronunciation || item.phon || '');
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
    return Array.isArray(window.getJSON(DICTIONARY_STORAGE_KEY, [])) ? window.getJSON(DICTIONARY_STORAGE_KEY, []) : [];
  }
  try { return JSON.parse(localStorage.getItem(DICTIONARY_STORAGE_KEY) || '[]'); } catch { return []; }
}

function saveCustomWords(words) {
  if (typeof window.setJSON === 'function') {
    window.setJSON(DICTIONARY_STORAGE_KEY, words);
    return;
  }
  try { localStorage.setItem(DICTIONARY_STORAGE_KEY, JSON.stringify(words)); } catch {}
}

async function renderDictionary() {
  const grid = document.getElementById('dictGrid');
  if (!grid) return;

  const query = (document.getElementById('dictSearch')?.value || '').toLowerCase().trim();
  const all = await (async () => {
    if (typeof window.getUserVocabulary === 'function') {
      const entries = await window.getUserVocabulary();
      return entries.map((entry) => normalizeWordEntry({ ...entry, trans: entry.trans || entry.translation || '' }));
    }

    const baseWords = await getCourseDictionaryWords();
    const custom = getCustomWords().map(item => ({ ...item, custom: true, id: item.id || `custom-${Date.now()}-${Math.random().toString(16).slice(2)}` }));
    return [...baseWords, ...custom].map(normalizeWordEntry);
  })();

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
        <div class="dict-pronunciation">${w.pronunciation || ''}</div>
        <div class="dict-trans">${translation}</div>
        <div class="dict-meta">
          ${w.lesson ? `<span>${getIconSvg('paths')} ${w.lesson}</span>` : ''}
          ${w.category ? `<span>${getIconSvg('tag')} ${w.category}</span>` : ''}
        </div>
      </div>
      <div class="dict-actions">
        <button class="star-btn ${isLearned ? 'active' : ''}" onclick="toggleLearned('${w.id}', event)" title="${isLearned ? 'Вивчено' : 'Позначити як вивчене'}" aria-label="${isLearned ? 'Вивчено' : 'Позначити як вивчене'}">${getIconSvg(isLearned ? 'star-filled' : 'star')}</button>
        <button class="audio-btn" onclick="event.stopPropagation(); speak('${w.word.replace(/'/g, "\\'")}', this)" title="Аудіо" aria-label="Аудіо">${getIconSvg('audio')}</button>
        ${w.custom ? `<button class="delete-btn" onclick="event.stopPropagation(); deleteWord('${w.id}')" title="Видалити" aria-label="Видалити">${getIconSvg('delete')}</button>` : ''}
      </div>
    </div>
  `;
  }).join('');
  applyInterfaceLanguage();
}

function normalizeCatalogCourseId(courseId) {
  const rawValue = String(courseId || '').trim().toLowerCase();
  if (!rawValue) return 'it';
  if (/^[a-z]{2,3}$/.test(rawValue)) return rawValue;

  const aliases = {
    italian: 'it',
    spanish: 'es',
    ukrainian: 'uk',
    english: 'en'
  };

  return aliases[rawValue] || rawValue;
}

function getCatalogCourseId() {
  const courseId = window.getCourseId ? window.getCourseId() : (window.getCurrentCourseId ? window.getCurrentCourseId() : 'it');
  const course = window.getCourse ? window.getCourse(courseId) : null;
  if (course && course.code) return String(course.code).trim();
  return normalizeCatalogCourseId(courseId);
}

function getCatalogWordTranslation(word) {
  const sourceLanguage = typeof getSourceLanguage === 'function' ? getSourceLanguage() : 'uk';
  const translations = word && word.trans ? word.trans : {};
  const text = translations[sourceLanguage] || translations.uk || translations.en || '';
  if (text) return text;
  if (typeof word.translation === 'string') return word.translation;
  return word.word || '';
}

async function searchCatalogWords(query) {
  const input = document.getElementById('catalogSearchInput');
  const resultsContainer = document.getElementById('catalogSearchResults');
  if (!input || !resultsContainer) return;

  const normalizedQuery = String(query || '').trim();
  if (!normalizedQuery) {
    resultsContainer.innerHTML = '<div class="catalog-search-empty">Type a word or phrase to search the course catalog.</div>';
    return;
  }

  const renderResults = (items) => {
    if (!items.length) {
      resultsContainer.innerHTML = '<div class="catalog-search-empty">No matches found. Try another word.</div>';
      return;
    }

    resultsContainer.innerHTML = items.map((word) => {
      const translation = getCatalogWordTranslation(word);
      const meta = [word.category, word.topic, word.lesson].filter(Boolean).slice(0, 2).join(' · ') || 'Catalog word';
      return `
        <button type="button" class="catalog-search-result" data-word-id="${word.id}" data-word-label="${(word.word || '').replace(/"/g, '&quot;')}">
          <span class="catalog-search-word">${word.word}</span>
          <span class="catalog-search-translation">${translation}</span>
          <small>${meta}</small>
        </button>
      `;
    }).join('');

    resultsContainer.querySelectorAll('.catalog-search-result').forEach((button) => {
      button.addEventListener('click', () => {
        const selectedWord = items.find((item) => String(item.id) === button.dataset.wordId);
        if (!selectedWord) return;
        addSelectedCatalogWord(selectedWord);
      });
    });
  };

  try {
    const response = await fetch(`/api/vocab/search?course=${encodeURIComponent(getCatalogCourseId())}&q=${encodeURIComponent(normalizedQuery)}&limit=8`, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`Catalog search response was ${response.status}`);
    }

    const payload = await response.json();
    const items = Array.isArray(payload) ? payload : [];
    if (items.length) {
      renderResults(items);
      return;
    }
  } catch (error) {
    // Try the course catalog below when the search endpoint is unavailable.
  }

  try {
    if (typeof window.loadCourseData !== 'function') {
      throw new Error('Course catalog is unavailable.');
    }
    const catalog = await window.loadCourseData('vocab');
    const queryText = normalizedQuery.toLocaleLowerCase();
    const items = Array.isArray(catalog)
      ? catalog.filter((word) => {
          const sourceText = [word.word, word.category, word.topic, word.lesson, getCatalogWordTranslation(word)].join(' ').toLocaleLowerCase();
          return sourceText.includes(queryText);
        }).slice(0, 8)
      : [];
    renderResults(items);
  } catch (error) {
    console.error('Could not search the vocabulary catalog.', error);
    resultsContainer.innerHTML = '<div class="catalog-search-empty">Could not search the catalog right now.</div>';
  }
}

async function addSelectedCatalogWord(word) {
  if (!word || !word.id) return;

  try {
    if (typeof window.Progress !== 'undefined' && typeof window.Progress.addUserWord === 'function') {
      await window.Progress.addUserWord(getCatalogCourseId(), word.id, 'manual');
    } else {
      const list = getCustomWords();
      const entry = {
        id: word.id,
        word: word.word,
        trans: getCatalogWordTranslation(word),
        pronunciation: word.phon && typeof word.phon === 'object' ? Object.values(word.phon)[0] || '' : '',
        type: word.type || 'other',
        category: word.category || word.topic || '',
        lesson: word.lesson || '',
        custom: false
      };
      if (!list.some((item) => String(item.id) === String(word.id))) {
        list.unshift(entry);
        saveCustomWords(list);
      }
    }

    if (typeof addXP === 'function') addXP(5);
    closeAddModal();
    await renderDictionary();
  } catch (error) {
    console.error('Could not add catalog word to the dictionary.', error);
    const resultsContainer = document.getElementById('catalogSearchResults');
    if (resultsContainer) {
      resultsContainer.innerHTML = '<div class="catalog-search-empty" role="alert">Could not add this word. Please try again.</div>';
    }
  }
}

function openAddModal() {
  const modal = document.getElementById('addModal');
  if (!modal) return;
  modal.classList.add('open');
  const input = document.getElementById('catalogSearchInput');
  if (input) {
    setTimeout(() => input.focus(), 50);
  }
}

function closeAddModal() {
  const modal = document.getElementById('addModal');
  if (modal) modal.classList.remove('open');
  const form = document.getElementById('addWordForm');
  if (form) form.reset();
  const results = document.getElementById('catalogSearchResults');
  if (results) results.innerHTML = '<div class="catalog-search-empty">Type a word or phrase to search the course catalog.</div>';
}

function saveNewWord(e) {
  e.preventDefault();
  const input = document.getElementById('catalogSearchInput');
  if (!input) return;
  searchCatalogWords(input.value);
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

  const catalogSearchInput = document.getElementById('catalogSearchInput');
  if (catalogSearchInput) {
    catalogSearchInput.addEventListener('input', (event) => searchCatalogWords(event.target.value));
  }

  const addWordForm = document.getElementById('addWordForm');
  if (addWordForm) {
    addWordForm.addEventListener('submit', saveNewWord);
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
