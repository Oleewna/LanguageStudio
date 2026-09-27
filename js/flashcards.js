const FC_DATA = [
  { word: 'ciao', phon: '[ча-о]', trans: 'привіт / бувай', ex: 'Ciao! Come stai?', track: 'foundations', topic: 'greetings' },
  { word: 'come stai?', phon: '[ко-ме стай]', trans: 'як справи?', ex: 'Ciao Marco, come stai?', track: 'foundations', topic: 'greetings' },
  { word: 'bene', phon: '[бе-не]', trans: 'добре', ex: 'Bene, grazie! E tu?', track: 'foundations', topic: 'basic' },
  { word: 'grazie', phon: '[гра-цьє]', trans: 'дякую', ex: 'Grazie mille!', track: 'foundations', topic: 'basic' },
  { word: 'prego', phon: '[пре-го]', trans: 'будь ласка / нема за що', ex: '— Grazie! — Prego!', track: 'foundations', topic: 'basic' },
  { word: 'sì', phon: '[сі]', trans: 'так', ex: 'Sì, sono nuova.', track: 'foundations', topic: 'basic' },
  { word: 'no', phon: '[но]', trans: 'ні', ex: 'No, grazie.', track: 'foundations', topic: 'basic' },
  { word: 'anch\'io', phon: '[ан-кі-о]', trans: 'я теж', ex: 'Anch\'io sto bene, grazie!', track: 'foundations', topic: 'basic' },
  { word: 'nuovo/a', phon: '[ну-о-во/ва]', trans: 'новий / нова', ex: 'Sei nuova qui?', track: 'foundations', topic: 'basic' },
  { word: 'primo giorno', phon: '[прі-мо джор-но]', trans: 'перший день', ex: 'È il mio primo giorno.', track: 'foundations', topic: 'basic' },
  { word: 'benvenuto/a', phon: '[бен-ве-ну-то/та]', trans: 'ласкаво просимо', ex: 'Benvenuta nel palazzo!', track: 'foundations', topic: 'greetings' },
  { word: 'palazzo', phon: '[па-лац-цо]', trans: 'будинок (багатоповерховий)', ex: 'Abito in questo palazzo.', track: 'foundations', topic: 'basic' },
  { word: 'grazie mille', phon: '[гра-цьє міл-ле]', trans: 'дуже дякую', ex: 'Grazie mille per l\'aiuto!', track: 'foundations', topic: 'basic' }
];

const TRACK_LABELS = {
  foundations: 'Основи',
  tourist: 'Турист',
  business: 'Бізнес'
};
const TRACK_ICONS = { foundations: 'handshake', tourist: 'suitcase', business: 'briefcase' };

let selectedTopic = 'all';
let cards = [...FC_DATA];
let currentIndex = 0;
let isFlipped = false;

function getCustomWords() {
  try { return JSON.parse(localStorage.getItem(DICT_KEY) || '[]'); } catch { return []; }
}

function applyFilters() {
  const t = document.getElementById('filterTrack').value;
  // Custom words follow the person across every track, tagged as 'foundations' by default
  // so they still show up when no dedicated track content exists yet.
  const custom = getCustomWords().map(w => ({ ...w, track: 'foundations', topic: 'custom' }));
  let list = [...FC_DATA, ...custom];

  if (t !== 'all') {
    list = list.filter(item => item.track === t || item.topic === 'custom');
  }
  if (selectedTopic !== 'all') {
    list = list.filter(item => item.topic === selectedTopic);
  }

  cards = list;
  currentIndex = 0;
  updateCardDisplay();
}

function setTopicChip(topic, btn) {
  document.querySelectorAll('.topic-chip').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  selectedTopic = topic;
  applyFilters();
}

function updateCardDisplay() {
  const emptyNote = document.getElementById('fcEmptyNote');
  if (!cards.length) {
    document.getElementById('fcWord').textContent = 'Слів не знайдено';
    document.getElementById('fcPhon').textContent = '';
    document.getElementById('fcTrans').textContent = 'Спробуйте змінити фільтри вище';
    document.getElementById('fcExample').textContent = '';
    document.getElementById('fcCounter').textContent = '0 / 0';
    document.getElementById('fcUnitTag').textContent = '—';
    document.getElementById('fcTopicTag').textContent = '—';
    applyInterfaceLanguage();
    emptyNote.style.display = 'block';
    return;
  }
  emptyNote.style.display = 'none';
  const item = cards[currentIndex];
  const inner = document.getElementById('fcInner');
  if (isFlipped) {
    isFlipped = false;
    inner.style.transform = 'rotateY(0deg)';
  }
  document.getElementById('fcUnitTag').innerHTML = `${getIconSvg(TRACK_ICONS[item.track] || 'handshake')}<span>${TRACK_LABELS[item.track] || 'Основи'}</span>`;
  const topicIcon = item.topic === 'greetings' ? 'handshake' : item.topic === 'custom' ? 'star' : 'type';
  const topicLabel = item.topic === 'greetings' ? 'Привітання' : item.topic === 'custom' ? 'Власне' : 'Базове';
  document.getElementById('fcTopicTag').innerHTML = `${getIconSvg(topicIcon)}<span>${topicLabel}</span>`;
  document.getElementById('fcWord').textContent = item.word;
  document.getElementById('fcPhon').textContent = item.phon || '';
  document.getElementById('fcTrans').textContent = getSourceTranslation(`flashcards.${item.word}`, item.trans);
  document.getElementById('fcExample').textContent = item.ex ? `«${item.ex}»` : '';
  document.getElementById('fcCounter').textContent = `${currentIndex + 1} / ${cards.length}`;
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
location.href='units.html'
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
  var target = event.target.closest('[data-external-handler-flashcards-7]');
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
