const DICT_BASE = [
  { id: 'b1', word: 'ciao', phon: '[ча-о]', trans: 'привіт / бувай', custom: false, lesson: 'Урок 1.1', category: 'привітання та знайомство', type: 'greeting' },
  { id: 'b2', word: 'come stai?', phon: '[ко-ме стай]', trans: 'як справи?', custom: false, lesson: 'Урок 1.1', category: 'привітання та знайомство', type: 'phrase' },
  { id: 'b3', word: 'bene', phon: '[бе-не]', trans: 'добре', custom: false, lesson: 'Урок 1.1', category: 'привітання та знайомство', type: 'adjective' },
  { id: 'b4', word: 'grazie', phon: '[гра-цьє]', trans: 'дякую', custom: false, lesson: 'Урок 1.1', category: 'ввічливість', type: 'phrase' },
  { id: 'b5', word: 'prego', phon: '[пре-го]', trans: 'будь ласка / нема за що', custom: false, lesson: 'Урок 1.1', category: 'ввічливість', type: 'phrase' },
  { id: 'b6', word: 'sì', phon: '[сі]', trans: 'так', custom: false, lesson: 'Урок 1.1', category: 'короткі відповіді', type: 'other' },
  { id: 'b7', word: 'no', phon: '[но]', trans: 'ні', custom: false, lesson: 'Урок 1.1', category: 'короткі відповіді', type: 'other' },
  { id: 'b8', word: 'anch\'io', phon: '[ан-кі-о]', trans: 'я теж', custom: false, lesson: 'Урок 1.1', category: 'короткі відповіді', type: 'phrase' },
  { id: 'b9', word: 'nuovo/a', phon: '[ну-о-во/ва]', trans: 'новий / нова', custom: false, lesson: 'Урок 1.1', category: 'перший день', type: 'adjective' },
  { id: 'b10', word: 'primo giorno', phon: '[прі-мо джор-но]', trans: 'перший день', custom: false, lesson: 'Урок 1.1', category: 'перший день', type: 'noun' },
  { id: 'b11', word: 'benvenuto/a', phon: '[бен-ве-ну-то/та]', trans: 'ласкаво просимо', custom: false, lesson: 'Урок 1.1', category: 'привітання та знайомство', type: 'greeting' },
  { id: 'b12', word: 'palazzo', phon: '[па-лац-цо]', trans: 'будинок (багатоповерховий)', custom: false, lesson: 'Урок 1.1', category: 'житло й будинок', type: 'noun' },
  { id: 'b13', word: 'grazie mille', phon: '[гра-цьє міл-ле]', trans: 'дуже дякую', custom: false, lesson: 'Урок 1.1', category: 'ввічливість', type: 'phrase' }
];

const LEARNED_KEY = 'ls_dict_learned';

function getLearnedIds() {
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
  try { localStorage.setItem(LEARNED_KEY, JSON.stringify(learned)); } catch {}
  renderDictionary();
}

function populateFilters(all) {
  const lessonSel = document.getElementById('filterLesson');
  const catSel = document.getElementById('filterCategory');
  const typeSel = document.getElementById('filterType');
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
  try { return JSON.parse(localStorage.getItem(DICT_KEY) || '[]'); } catch { return []; }
}

function saveCustomWords(words) {
  try { localStorage.setItem(DICT_KEY, JSON.stringify(words)); } catch {}
}

function renderDictionary() {
  const grid = document.getElementById('dictGrid');
  const query = (document.getElementById('dictSearch')?.value || '').toLowerCase().trim();
  const custom = getCustomWords();
  const all = [...DICT_BASE, ...custom];

  populateFilters(all);
  const lessonFilter = document.getElementById('filterLesson').value;
  const catFilter = document.getElementById('filterCategory').value;
  const typeFilter = document.getElementById('filterType').value;
  const learned = getLearnedIds();

  const filtered = all.filter(w => {
    const matchesQuery = !query || w.word.toLowerCase().includes(query) || w.trans.toLowerCase().includes(query);
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
    const translation = w.custom ? w.trans : getSourceTranslation(`flashcards.${w.word}`, w.trans);
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
