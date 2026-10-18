const FLASHCARDS_STORAGE_KEY = (typeof window.courseKey === 'function') ? window.courseKey('custom_dict') : 'ls_custom_dict';

let selectedTopic = 'all';
let cards = [];
let currentIndex = 0;
let isFlipped = false;

function getLocalizedText(value, fallback = '') {
  if (typeof value === 'string') return value;
  if (value && typeof value === 'object') {
    const lang = (typeof getSourceLanguage === 'function') ? getSourceLanguage() : 'uk';
    return value[lang] || value.uk || value.en || fallback;
  }
  return fallback;
}

function normalizeFlashcard(item) {
  const track = item.path || item.track || 'general';
  const topic = item.topic || 'general';
  const exampleText = item.example && typeof item.example === 'object' ? item.example.text : item.ex || item.example || '';
  return {
    ...item,
    track,
    topic,
    word: item.word || '',
    pronunciation: getLocalizedText(item.pronunciation || item.phon, item.pronunciation || item.phon || ''),
    trans: getLocalizedText(item.trans, item.trans || ''),
    ex: exampleText,
    custom: Boolean(item.custom)
  };
}

function getCustomWords() {
  if (typeof window.getJSON === 'function') {
    return Array.isArray(window.getJSON(FLASHCARDS_STORAGE_KEY, [])) ? window.getJSON(FLASHCARDS_STORAGE_KEY, []) : [];
  }
  try { return JSON.parse(localStorage.getItem(FLASHCARDS_STORAGE_KEY) || '[]'); } catch { return []; }
}

function buildTopicChips(allWords) {
  const chipContainer = document.querySelector('.topic-chips');
  if (!chipContainer) return;

  const topics = ['all', ...new Set(allWords.map(item => item.topic).filter(Boolean))];
  chipContainer.innerHTML = topics.map(topic => {
    const label = topic === 'all' ? 'Усі' : topic.replace(/[-_]/g, ' ');
    return `<button type="button" class="topic-chip ${selectedTopic === topic ? 'active' : ''}" data-topic="${topic}" onclick="setTopicChip('${topic}', this)">${label}</button>`;
  }).join('');

  const activeBtn = chipContainer.querySelector(`[data-topic="${selectedTopic}"]`);
  if (activeBtn) {
    chipContainer.querySelectorAll('.topic-chip').forEach(btn => btn.classList.toggle('active', btn === activeBtn));
  }
}

function buildTrackOptions(allWords) {
  const select = document.getElementById('filterTrack');
  if (!select) return;

  const tracks = ['all', ...new Set(allWords.map(item => item.path || item.track || 'general').filter(Boolean))];
  const previous = select.value || 'all';
  select.innerHTML = tracks.map(track => `<option value="${track}">${track === 'all' ? 'Усі' : track}</option>`).join('');
  if (tracks.includes(previous)) select.value = previous;
  else select.value = 'all';
}

async function applyFilters() {
  const allCoursesWords = (typeof window.loadCourseData === 'function')
    ? await window.loadCourseData('vocab').catch(() => [])
    : [];
  const baseWords = Array.isArray(allCoursesWords) ? allCoursesWords.map(normalizeFlashcard) : [];
  const custom = getCustomWords().map(w => normalizeFlashcard({ ...w, path: 'custom', track: 'custom', topic: w.topic || 'custom' }));
  let list = [...baseWords, ...custom];

  const trackSelect = document.getElementById('filterTrack');
  const activeTrack = trackSelect ? trackSelect.value : 'all';
  if (activeTrack !== 'all') {
    list = list.filter(item => item.track === activeTrack || item.topic === 'custom');
  }
  if (selectedTopic !== 'all') {
    list = list.filter(item => item.topic === selectedTopic);
  }

  buildTrackOptions([...baseWords, ...custom]);
  buildTopicChips([...baseWords, ...custom]);
  cards = list;
  currentIndex = 0;
  updateCardDisplay();
}

function setTopicChip(topic, btn) {
  document.querySelectorAll('.topic-chip').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  selectedTopic = topic;
  applyFilters();
}

function updateCardDisplay() {
  const emptyNote = document.getElementById('fcEmptyNote');
  const wordEl = document.getElementById('fcWord');
  const pronunciationEl = document.getElementById('fcPronunciation');
  const transEl = document.getElementById('fcTrans');
  const exampleEl = document.getElementById('fcExample');
  const counterEl = document.getElementById('fcCounter');
  const unitTagEl = document.getElementById('fcUnitTag');
  const topicTagEl = document.getElementById('fcTopicTag');

  if (!cards.length) {
    if (wordEl) wordEl.textContent = 'Слів не знайдено';
    if (pronunciationEl) pronunciationEl.textContent = '';
    if (transEl) transEl.textContent = 'Спробуйте змінити фільтри вище';
    if (exampleEl) exampleEl.textContent = '';
    if (counterEl) counterEl.textContent = '0 / 0';
    if (unitTagEl) unitTagEl.textContent = '—';
    if (topicTagEl) topicTagEl.textContent = '—';
    applyInterfaceLanguage();
    if (emptyNote) emptyNote.style.display = 'block';
    return;
  }
  if (emptyNote) emptyNote.style.display = 'none';

  const item = cards[currentIndex];
  const inner = document.getElementById('fcInner');
  if (isFlipped) {
    isFlipped = false;
    if (inner) inner.style.transform = 'rotateY(0deg)';
  }

  const trackLabel = item.track === 'custom' ? 'Власне' : (item.track || 'general').replace(/[-_]/g, ' ');
  const topicLabel = item.topic === 'custom' ? 'Власне' : (item.topic || 'general').replace(/[-_]/g, ' ');

  if (unitTagEl) unitTagEl.innerHTML = `${getIconSvg('greeting')}<span>${trackLabel}</span>`;
  if (topicTagEl) topicTagEl.innerHTML = `${getIconSvg('type')}<span>${topicLabel}</span>`;
  if (wordEl) wordEl.textContent = item.word;
  if (pronunciationEl) pronunciationEl.textContent = item.pronunciation || '';
  if (transEl) transEl.textContent = item.trans || '';
  if (exampleEl) exampleEl.textContent = item.ex ? `«${item.ex}»` : '';
  if (counterEl) counterEl.textContent = `${currentIndex + 1} / ${cards.length}`;
  applyInterfaceLanguage();
}

function toggleFlip() {
  isFlipped = !isFlipped;
  document.getElementById('fcInner').style.transform = isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)';
}

function nextCard() {
  if (!cards.length) return;
  currentIndex = (currentIndex + 1) % cards.length;
  updateCardDisplay();
}

function prevCard() {
  if (!cards.length) return;
  currentIndex = (currentIndex - 1 + cards.length) % cards.length;
  updateCardDisplay();
}

function speakCurrent(btn) {
  speak(cards[currentIndex]?.word || '', btn);
}

function shuffleCards() {
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  currentIndex = 0;
  updateCardDisplay();
}

document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const requestedTopic = urlParams.get('topic');
  if (requestedTopic === 'custom') {
    document.getElementById('filterTrack').value = 'all';
    const customChip = document.querySelectorAll('.topic-chip')[3];
    if (customChip) setTopicChip('custom', customChip);
  } else {
    applyFilters();
  }
});
window.addEventListener('sourceLanguageChanged', updateCardDisplay);

document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-flashcards-1]');
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
  var target = event.target.closest('[data-external-handler-flashcards-2]');
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
  var target = event.target.closest('[data-external-handler-flashcards-3]');
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
  var target = event.target.closest('[data-external-handler-flashcards-4]');
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
  var target = event.target.closest('[data-external-handler-flashcards-5]');
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
  var target = event.target.closest('[data-external-handler-flashcards-6]');
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
  var target = event.target.closest('[data-external-handler-flashcards-8]');
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
  var target = event.target.closest('[data-external-handler-flashcards-9]');
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
  var target = event.target.closest('[data-external-handler-flashcards-10]');
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
  var target = event.target.closest('[data-external-handler-flashcards-11]');
  if (!target) return;
  var result = (function(event) {
openMobNav()
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('change', function(event) {
  var target = event.target.closest('[data-external-handler-flashcards-12]');
  if (!target) return;
  var result = (function(event) {
applyFilters()
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-flashcards-13]');
  if (!target) return;
  var result = (function(event) {
setTopicChip('all', this)
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-flashcards-14]');
  if (!target) return;
  var result = (function(event) {
setTopicChip('greetings', this)
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-flashcards-15]');
  if (!target) return;
  var result = (function(event) {
setTopicChip('basic', this)
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-flashcards-16]');
  if (!target) return;
  var result = (function(event) {
setTopicChip('custom', this)
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-flashcards-17]');
  if (!target) return;
  var result = (function(event) {
toggleFlip()
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-flashcards-18]');
  if (!target) return;
  var result = (function(event) {
prevCard()
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-flashcards-19]');
  if (!target) return;
  var result = (function(event) {
nextCard()
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-flashcards-20]');
  if (!target) return;
  var result = (function(event) {
speakCurrent(this)
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-flashcards-21]');
  if (!target) return;
  var result = (function(event) {
shuffleCards()
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});
