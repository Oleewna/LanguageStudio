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
    ex: exampleText
  };
}

function getFlashcardFilterLabel(value, fallback = '') {
  const language = typeof getSourceLanguage === 'function' ? getSourceLanguage() : 'uk';
  const label = String(value || '').replace(/[-_]/g, ' ');
  const translated = typeof window.getInterfaceTranslation === 'function'
    ? window.getInterfaceTranslation(label, language)
    : null;
  return translated || fallback || label;
}

function buildTopicChips(allWords) {
  const chipContainer = document.querySelector('.topic-chips');
  if (!chipContainer) return;

  const topics = ['all', ...new Set(allWords.map(item => item.topic).filter(Boolean))];
  const language = typeof getSourceLanguage === 'function' ? getSourceLanguage() : 'uk';
  chipContainer.replaceChildren(...topics.map(topic => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `topic-chip ${selectedTopic === topic ? 'active' : ''}`;
    button.dataset.topic = topic;
    button.textContent = topic === 'all'
      ? getFlashcardFilterLabel('all', language === 'en' ? 'All' : 'Усі')
      : getFlashcardFilterLabel(topic);
    button.addEventListener('click', () => setTopicChip(topic, button));
    return button;
  }));
}

function buildTrackOptions(allWords, paths = []) {
  const select = document.getElementById('filterTrack');
  if (!select) return;

  const tracks = ['all', ...new Set(allWords.map(item => item.path || item.track || 'general').filter(Boolean))];
  const previous = select.value || 'all';
  const language = typeof getSourceLanguage === 'function' ? getSourceLanguage() : 'uk';
  const pathTitles = new Map(paths.map(path => [
    path.id,
    getLocalizedText(path.title, path.id)
  ]));
  select.replaceChildren(...tracks.map(track => {
    const option = document.createElement('option');
    option.value = track;
    option.textContent = track === 'all'
      ? getFlashcardFilterLabel('all paths', language === 'en' ? 'All learning paths' : 'Усі напрямки')
      : getFlashcardFilterLabel(pathTitles.get(track) || track);
    return option;
  }));
  if (tracks.includes(previous)) select.value = previous;
  else select.value = 'all';
}

async function applyFilters() {
  let list = [];
  let courseWords = [];
  let coursePaths = [];
  const status = document.getElementById('fcReviewStatus');
  if (status) status.textContent = '';

  if (typeof window.loadCourseData === 'function') {
    try {
      const allCourseWords = await window.loadCourseData('vocab');
      courseWords = Array.isArray(allCourseWords) ? allCourseWords.map(normalizeFlashcard) : [];
    } catch (error) {
      console.error('Could not load course vocabulary for flashcards:', error);
      if (status) {
        status.textContent = typeof getSourceLanguage === 'function' && getSourceLanguage() === 'en'
          ? 'Course vocabulary could not be loaded. Please try again.'
          : 'Не вдалося завантажити словник курсу. Спробуйте ще раз.';
      }
    }
  }

  if (typeof window.loadCourse === 'function') {
    try {
      const course = await window.loadCourse();
      coursePaths = Array.isArray(course.paths) ? course.paths : [];
    } catch (error) {
      console.error('Could not load learning path labels for flashcards:', error);
    }
  }

  const lessonId = new URLSearchParams(window.location.search).get('lesson');
  list = lessonId
    ? courseWords.filter((word) => (word.lessons || [word.lesson]).includes(lessonId))
    : courseWords;

  const trackSelect = document.getElementById('filterTrack');
  const activeTrack = trackSelect ? trackSelect.value : 'all';
  if (activeTrack !== 'all') {
    list = list.filter(item => item.track === activeTrack);
  }
  if (selectedTopic !== 'all') {
    list = list.filter(item => item.topic === selectedTopic);
  }

  buildTrackOptions(courseWords, coursePaths);
  buildTopicChips(courseWords);
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
    const learnedButton = document.getElementById('fcMarkLearned');
    if (learnedButton) learnedButton.disabled = true;
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

  const trackLabel = (item.track || 'general').replace(/[-_]/g, ' ');
  const topicLabel = (item.topic || 'general').replace(/[-_]/g, ' ');

  if (unitTagEl) unitTagEl.innerHTML = `${getIconSvg('greeting')}<span>${trackLabel}</span>`;
  if (topicTagEl) topicTagEl.innerHTML = `${getIconSvg('type')}<span>${topicLabel}</span>`;
  if (wordEl) wordEl.textContent = item.word;
  if (pronunciationEl) pronunciationEl.textContent = item.pronunciation || '';
  if (transEl) transEl.textContent = item.trans || '';
  if (exampleEl) exampleEl.textContent = item.ex ? `«${item.ex}»` : '';
  if (counterEl) counterEl.textContent = `${currentIndex + 1} / ${cards.length}`;
  const stage = document.querySelector('.fc-stage');
  if (stage) {
    stage.setAttribute('aria-label', `${item.word}: ${getLocalizedText({ uk: 'показати переклад', en: 'show translation' })}`);
    stage.setAttribute('aria-pressed', 'false');
  }
  syncLearnedButton(item);
  applyInterfaceLanguage();
}

function syncLearnedButton(item) {
  const button = document.getElementById('fcMarkLearned');
  if (!button) return;

  const vocabId = item && (item.vocabId || item.id || item.wordId);
  const language = typeof getSourceLanguage === 'function' ? getSourceLanguage() : 'uk';
  const markLabel = language === 'en' ? 'Mark as learned' : 'Позначити як вивчене';
  button.disabled = !vocabId;
  button.setAttribute('aria-pressed', 'false');
  button.textContent = markLabel;
  if (!vocabId || !window.Progress || typeof window.Progress.list !== 'function') return;

  const courseId = typeof window.getCourseId === 'function' ? window.getCourseId() : 'it';
  window.Progress.list('wordStats', { courseId, vocabId: String(vocabId) }).then((records) => {
    if (cards[currentIndex] !== item) return;
    const learned = Boolean(Array.isArray(records) && records[0] && records[0].learned);
    button.setAttribute('aria-pressed', String(learned));
    button.textContent = learned
      ? (language === 'en' ? 'Learned' : 'Вивчене')
      : markLabel;
  }).catch((error) => {
    console.error('Could not load saved vocabulary progress:', error);
  });
}

async function toggleLearnedState() {
  const item = cards[currentIndex];
  const vocabId = item && (item.vocabId || item.id || item.wordId);
  const status = document.getElementById('fcReviewStatus');
  const button = document.getElementById('fcMarkLearned');
  if (!item || !vocabId || !window.Progress || typeof window.Progress.setWordLearned !== 'function') return;

  const learned = button ? button.getAttribute('aria-pressed') !== 'true' : true;
  const courseId = typeof window.getCourseId === 'function' ? window.getCourseId() : 'it';
  try {
    await window.Progress.setWordLearned(courseId, vocabId, learned);
    syncLearnedButton(item);
    if (status) {
      const language = typeof getSourceLanguage === 'function' ? getSourceLanguage() : 'uk';
      status.textContent = learned
        ? (language === 'en' ? `${item.word} marked as learned on this device.` : `${item.word} збережено як вивчене на цьому пристрої.`)
        : (language === 'en' ? `${item.word} moved back to your review list.` : `${item.word} повернуто до повторення.`);
    }
  } catch (error) {
    console.error('Could not save vocabulary progress:', error);
    if (status) {
      status.textContent = typeof getSourceLanguage === 'function' && getSourceLanguage() === 'en'
        ? 'Could not save this word. Please try again.'
        : 'Не вдалося зберегти слово. Спробуйте ще раз.';
    }
  }
}

function toggleFlip() {
  if (!cards.length) return;
  isFlipped = !isFlipped;
  const inner = document.getElementById('fcInner');
  const stage = document.querySelector('.fc-stage');
  if (inner) inner.style.transform = isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)';
  if (stage) {
    stage.setAttribute('aria-pressed', String(isFlipped));
    const language = typeof getSourceLanguage === 'function' ? getSourceLanguage() : 'uk';
    const action = isFlipped
      ? (language === 'en' ? 'show word' : 'показати слово')
      : (language === 'en' ? 'show translation' : 'показати переклад');
    stage.setAttribute('aria-label', `${cards[currentIndex].word}: ${action}`);
  }
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
  if (requestedTopic) selectedTopic = requestedTopic;
  applyFilters();

  const learnedButton = document.getElementById('fcMarkLearned');
  if (learnedButton) learnedButton.addEventListener('click', toggleLearnedState);

  document.addEventListener('keydown', (event) => {
    const target = event.target;
    if (target instanceof HTMLElement && (
      target.isContentEditable ||
      target.matches('input, textarea, select, button, a')
    )) return;

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      nextCard();
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      prevCard();
    } else if (event.key === ' ' || (event.key === 'Enter' && target instanceof HTMLElement && target.classList.contains('fc-stage'))) {
      event.preventDefault();
      toggleFlip();
    }
  });
});
window.addEventListener('sourceLanguageChanged', applyFilters);

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
