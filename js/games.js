const QUESTIONS = [
  {
    icon: 'sun',
    sit: "09:30 ранку, зустріч із сусідом у під'їзді",
    sitEn: '9:30 a.m., meeting a neighbor in the apartment building',
    options: ['Buongiorno', 'Buonanotte', 'Buonasera', 'Arrivederci'],
    correct: 0
  },
  {
    icon: 'moon',
    sit: '23:00, ви йдете спати і кажете рідним:',
    sitEn: '11:00 p.m., you are going to bed and say to your family:',
    options: ['Buon pomeriggio', 'Buonanotte', 'Ciao', 'Buongiorno'],
    correct: 1
  },
  {
    icon: 'sun',
    sit: '19:30 вечора, ви заходите у ресторан:',
    sitEn: '7:30 p.m., you enter a restaurant:',
    options: ['Buonasera', 'Buongiorno', 'Buonanotte', 'Prego'],
    correct: 0
  },
  {
    icon: 'handshake',
    sit: 'Ви випадково зустріли давнього друга на вулиці:',
    sitEn: 'You run into an old friend on the street:',
    options: ['Arrivederla', 'Scusi', 'Ciao!', 'Buonanotte'],
    correct: 2
  },
  {
    icon: 'handshake',
    sit: 'Вам сказали «Grazie mille!», що ви відповідаєте?',
    sitEn: 'Someone says “Grazie mille!” What do you reply?',
    options: ['Prego!', 'Sì', 'Anch\'io', 'Grazie'],
    correct: 0
  }
];

let round = 0;
let score = 0;

function loadGameRound() {
  if (round >= QUESTIONS.length) {
    const english = getSourceLanguage() === 'en';
    document.getElementById('gameSit').innerHTML = `${getIconSvg('trophy')}<span>${english ? 'Game complete!' : 'Гра завершена!'}</span>`;
    document.getElementById('gameChoices').innerHTML = `<button class="btn-primary" onclick="restartGame()" id="external-style-games-11">${english ? 'Play again' : 'Грати знову'}</button>`;
    document.getElementById('gameFeedback').innerHTML = `<span id="external-style-games-12">${english ? `You scored ${score} points and earned +50 XP!` : `Ви набрали ${score} очок і заробили +50 XP!`}</span>`;
    addXP(50);
    return;
  }
  const q = QUESTIONS[round];
  document.getElementById('gameSit').innerHTML = `${getIconSvg(q.icon)}<span>${getSourceLanguage() === 'en' ? q.sitEn : q.sit}</span>`;
  document.getElementById('gRound').textContent = `${round + 1}/${QUESTIONS.length}`;
  document.getElementById('gScore').textContent = score;
  document.getElementById('gameFeedback').textContent = '';

  const choiceHtml = q.options.map((opt, idx) => `
    <button class="game-btn" onclick="answerGame(${idx})">${opt}</button>
  `).join('');
  document.getElementById('gameChoices').innerHTML = choiceHtml;
}

function answerGame(idx) {
  const q = QUESTIONS[round];
  const btns = document.querySelectorAll('.game-btn');
  btns.forEach(b => b.style.pointerEvents = 'none');

  const fb = document.getElementById('gameFeedback');
  if (idx === q.correct) {
    btns[idx].classList.add('is-correct');
    fb.innerHTML = `<span id="external-style-games-13">${getIconSvg('sparkles')} ${getSourceLanguage() === 'en' ? 'Correct! (+20 points)' : 'Правильно! (+20 очок)'}</span>`;
    score += 20;
    speak(q.options[idx]);
  } else {
    btns[idx].classList.add('is-wrong');
    btns[q.correct].classList.add('is-correct');
    fb.innerHTML = `<span id="external-style-games-14">${getSourceLanguage() === 'en' ? 'Incorrect! Correct answer:' : 'Помилка! Правильно:'} ${q.options[q.correct]}</span>`;
  }

  setTimeout(() => {
    round++;
    loadGameRound();
  }, 1400);
}

function restartGame() {
  round = 0;
  score = 0;
  loadGameRound();
}

document.addEventListener('DOMContentLoaded', loadGameRound);

document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-games-1]');
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
  var target = event.target.closest('[data-external-handler-games-2]');
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
  var target = event.target.closest('[data-external-handler-games-3]');
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
  var target = event.target.closest('[data-external-handler-games-4]');
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
  var target = event.target.closest('[data-external-handler-games-5]');
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
  var target = event.target.closest('[data-external-handler-games-6]');
  if (!target) return;
  var result = (function(event) {
openMobNav()
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-games-7]');
  if (!target) return;
  var result = (function(event) {
answerGame(0)
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-games-8]');
  if (!target) return;
  var result = (function(event) {
answerGame(1)
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-games-9]');
  if (!target) return;
  var result = (function(event) {
answerGame(2)
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-games-10]');
  if (!target) return;
  var result = (function(event) {
answerGame(3)
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});
