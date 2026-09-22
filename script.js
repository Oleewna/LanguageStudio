/* ═══════════════════════════════════════════
   LanguageStudio — JavaScript Engine
   Ukrainian UI · Italian A1 Drills · Mini-Game
═══════════════════════════════════════════ */

/* ══════════════════════════════
   Theme Management (Light default, Dark toggle)
══════════════════════════════ */
const THEME_KEY = 'ls-theme-mode';

function getStoredTheme() {
  try {
    return localStorage.getItem(THEME_KEY);
  } catch (e) {
    return null;
  }
}

function applyTheme(isDark) {
  if (isDark) {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
  const btn = document.getElementById('theme-toggle');
  if (btn) {
    btn.innerHTML = isDark ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
    btn.title = isDark ? 'Перейти на світлу тему' : 'Перейти на темну тему';
    btn.setAttribute('aria-label', isDark ? 'Перейти на світлу тему' : 'Перейти на темну тему');
  }
}

function toggleTheme() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const nextDark = !isDark;
  applyTheme(nextDark);
  try {
    localStorage.setItem(THEME_KEY, nextDark ? 'dark' : 'light');
  } catch (e) {}
}

// Initialize theme immediately on script load
const savedTheme = getStoredTheme();
applyTheme(savedTheme === 'dark');

/* ══════════════════════════════
   Global State
══════════════════════════════ */
let xp = 0;
let completedExercises = 0;
const TOTAL_EXERCISES = 4;
let ex1Done = false;
let ex2Done = false;
let ex3Done = false;
let ex4Done = false;

/* ══════════════════════════════
   Progress Bar & XP
══════════════════════════════ */
function updateProgress() {
  const fill = document.getElementById('progress-fill');
  const count = document.getElementById('completed-count');
  if (fill && count) {
    const pct = (completedExercises / TOTAL_EXERCISES) * 100;
    fill.style.width = pct + '%';
    count.textContent = completedExercises;
  }
}

function awardXP(amount) {
  xp += amount;
  const badge = document.getElementById('xp-badge');
  const xpCount = document.getElementById('xp-count');
  if (xpCount) xpCount.textContent = xp;
  if (badge) {
    badge.classList.add('xp-pulse');
    setTimeout(() => badge.classList.remove('xp-pulse'), 500);
  }
}

/* ══════════════════════════════
   Toast Notifications
══════════════════════════════ */
function showToast(html, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const el = document.createElement('div');
  el.className = `ls-toast ${type}`;
  el.innerHTML = html;
  container.appendChild(el);
  setTimeout(() => {
    el.style.transition = 'opacity .4s, transform .4s';
    el.style.opacity = '0';
    el.style.transform = 'translateX(1.5rem)';
    setTimeout(() => el.remove(), 420);
  }, 3400);
}

function disableOptions(containerId) {
  document.querySelectorAll(`#${containerId} button`).forEach(btn => {
    btn.onclick = null;
    btn.style.cursor = 'default';
    btn.style.pointerEvents = 'none';
  });
}

/* ══════════════════════════════
   Exercise 1 — Multiple Choice
══════════════════════════════ */
function checkMC(btn, isCorrect) {
  if (ex1Done) return;

  const fb = document.getElementById('mc-feedback');

  if (isCorrect) {
    btn.classList.add('correct');
    if (fb) {
      fb.className = 'ls-feedback ok visible';
      fb.innerHTML = '<i class="fa-solid fa-circle-check"></i> Відмінно! <strong>"Buonasera"</strong> [буо-на-се-ра] — правильне ввічливе привітання у вечірній час. 🎉';
    }
    disableOptions('mc-options');
    const badge = document.getElementById('ex1-badge');
    const card = document.getElementById('ex1-card');
    if (badge) badge.classList.add('visible');
    if (card) card.classList.add('done');
    ex1Done = true;
    completedExercises++;
    updateProgress();
    awardXP(50);
    showToast('<i class="fa-solid fa-star"></i> +50 XP! Вправа 1 виконана!', 'xp');
  } else {
    btn.classList.add('incorrect');
    if (fb) {
      fb.className = 'ls-feedback err visible';
      fb.innerHTML = '<i class="fa-solid fa-circle-xmark"></i> Не зовсім! Пам\'ятайте: Buonanotte кажуть лише перед сном, а Buon pomeriggio — вдень після обіду.';
    }
  }
}

/* ══════════════════════════════
   Exercise 2 — Fill in the Blank
══════════════════════════════ */
function submitFill() {
  if (ex2Done) return;

  const input1 = document.getElementById('fill-input-1');
  const input2 = document.getElementById('fill-input-2');
  const input3 = document.getElementById('fill-input-3');
  const fb     = document.getElementById('fill-feedback');

  if (!input1 || !input2 || !input3) return;

  const v1 = input1.value.trim().toLowerCase();
  const v2 = input2.value.trim().toLowerCase();
  const v3 = input3.value.trim().toLowerCase();

  if (!v1 || !v2 || !v3) {
    if (fb) {
      fb.className = 'ls-feedback warn visible';
      fb.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Будь ласка, заповніть усі три поля.';
    }
    return;
  }

  const isOk = (v1 === 'scusi') && (v2 === 'sta') && (v3 === 'grazie');

  if (isOk) {
    input1.classList.add('input-ok');
    input2.classList.add('input-ok');
    input3.classList.add('input-ok');
    input1.disabled = true;
    input2.disabled = true;
    input3.disabled = true;
    const submitBtn = document.getElementById('fill-btn');
    if (submitBtn) submitBtn.disabled = true;

    if (fb) {
      fb.className = 'ls-feedback ok visible';
      fb.innerHTML = '<i class="fa-solid fa-circle-check"></i> Чудово! Правильні форми: <strong>Scusi</strong>, <strong>sta</strong>, <strong>grazie</strong>. 👏';
    }

    const badge = document.getElementById('ex2-badge');
    const card = document.getElementById('ex2-card');
    if (badge) badge.classList.add('visible');
    if (card) card.classList.add('done');
    ex2Done = true;
    completedExercises++;
    updateProgress();
    awardXP(50);
    showToast('<i class="fa-solid fa-star"></i> +50 XP! Вправа 2 виконана!', 'xp');
  } else {
    input1.classList.toggle('input-err', v1 !== 'scusi');
    input2.classList.toggle('input-err', v2 !== 'sta');
    input3.classList.toggle('input-err', v3 !== 'grazie');
    if (fb) {
      fb.className = 'ls-feedback err visible';
      fb.innerHTML = '<i class="fa-solid fa-circle-xmark"></i> Перевірте правильність: звернення до незнайомої людини вимагає ввічливих слів Scusi та Come sta?.';
    }
    setTimeout(() => {
      input1.classList.remove('input-err');
      input2.classList.remove('input-err');
      input3.classList.remove('input-err');
    }, 1200);
  }
}

/* ══════════════════════════════
   Exercise 3 — Reading & Translation
══════════════════════════════ */
function checkTranslation(btn, isCorrect) {
  if (ex3Done) return;

  const fb = document.getElementById('trans-feedback');

  if (isCorrect) {
    btn.classList.add('correct');
    if (fb) {
      fb.className = 'ls-feedback ok visible';
      fb.innerHTML = '<i class="fa-solid fa-circle-check"></i> Правильно! "A presto e buona giornata!" перекладається як "До швидкої зустрічі та гарного дня!". 🌟';
    }
    disableOptions('trans-options');
    const badge = document.getElementById('ex3-badge');
    const card = document.getElementById('ex3-card');
    if (badge) badge.classList.add('visible');
    if (card) card.classList.add('done');
    ex3Done = true;
    completedExercises++;
    updateProgress();
    awardXP(50);
    showToast('<i class="fa-solid fa-star"></i> +50 XP! Вправа 3 виконана!', 'xp');
  } else {
    btn.classList.add('incorrect');
    if (fb) {
      fb.className = 'ls-feedback err visible';
      fb.innerHTML = '<i class="fa-solid fa-circle-xmark"></i> Не зовсім. Пригадайте значення "a presto" (до скорої зустрічі) та "buona giornata" (гарного дня).';
    }
  }
}

/* ══════════════════════════════
   Exercise 4 — Matching Pairs
══════════════════════════════ */
let selectedLeft = null;
let matchedCount = 0;
const MATCH_PAIRS = {
  'p1': 'r1', // Grazie mille! -> Prego!
  'p2': 'r2', // Piacere! -> Piacere mio!
  'p3': 'r3', // Buona giornata! -> Grazie, anche a te!
  'p4': 'r4'  // Come stai? -> Bene, grazie! E tu?
};

function selectMatchLeft(btn, id) {
  if (ex4Done || btn.classList.contains('matched')) return;
  document.querySelectorAll('.ls-match-col-left .ls-match-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  selectedLeft = { btn, id };
}

function selectMatchRight(btn, id) {
  if (ex4Done || btn.classList.contains('matched') || !selectedLeft) return;

  const fb = document.getElementById('match-feedback');

  if (MATCH_PAIRS[selectedLeft.id] === id) {
    selectedLeft.btn.classList.remove('selected');
    selectedLeft.btn.classList.add('matched');
    btn.classList.add('matched');
    selectedLeft = null;
    matchedCount++;

    if (fb) {
      fb.className = 'ls-feedback ok visible';
      fb.innerHTML = '<i class="fa-solid fa-circle-check"></i> Правильна пара знайдена!';
    }

    if (matchedCount === 4) {
      const badge = document.getElementById('ex4-badge');
      const card = document.getElementById('ex4-card');
      if (badge) badge.classList.add('visible');
      if (card) card.classList.add('done');
      ex4Done = true;
      completedExercises++;
      updateProgress();
      awardXP(50);
      showToast('<i class="fa-solid fa-trophy"></i> +50 XP! Всі пари успішно з\'єднано!', 'xp');
    }
  } else {
    btn.classList.add('incorrect');
    if (fb) {
      fb.className = 'ls-feedback err visible';
      fb.innerHTML = '<i class="fa-solid fa-circle-xmark"></i> Ця відповідь не підходить до обраної репліки. Спробуйте іншу.';
    }
    setTimeout(() => btn.classList.remove('incorrect'), 800);
  }
}

/* ══════════════════════════════
   Mini-Game: "Il Semaforo dei Saluti"
══════════════════════════════ */
const GAME_ITEMS = [
  { text: "Buongiorno!", cat: "morning_day", hint: "Вимова: [буон-джор-но]" },
  { text: "Buon pomeriggio!", cat: "morning_day", hint: "Вимова: [буон по-ме-рід-джо]" },
  { text: "Buona giornata!", cat: "morning_day", hint: "Вимова: [буо-на джор-на-та]" },
  { text: "Buonasera!", cat: "evening_night", hint: "Вимова: [буо-на-се-ра]" },
  { text: "Buonanotte!", cat: "evening_night", hint: "Вимова: [буо-на-нот-те]" },
  { text: "Buona serata!", cat: "evening_night", hint: "Вимова: [буо-на се-ра-та]" },
  { text: "Grazie mille!", cat: "courtesy", hint: "Вимова: [гра-цьє міл-ле]" },
  { text: "Prego!", cat: "courtesy", hint: "Вимова: [пре-го]" },
  { text: "Per favore!", cat: "courtesy", hint: "Вимова: [пер фа-во-ре]" },
  { text: "Piacere!", cat: "courtesy", hint: "Вимова: [пья-че-ре]" }
];

let gameIndex = 0;
let gameScore = 0;
let gameTimer = null;
let gameTimeLeft = 45;
let gameRunning = false;

function startGreetingsGame() {
  gameIndex = 0;
  gameScore = 0;
  gameTimeLeft = 45;
  gameRunning = true;

  const startBtn = document.getElementById('game-start-btn');
  const arena = document.getElementById('game-arena');
  const scoreEl = document.getElementById('game-score');
  const winBox = document.getElementById('game-win-box');

  if (startBtn) startBtn.style.display = 'none';
  if (winBox) winBox.style.display = 'none';
  if (arena) arena.style.display = 'flex';
  if (scoreEl) scoreEl.textContent = '0 / 10';

  showNextGameCard();

  clearInterval(gameTimer);
  gameTimer = setInterval(() => {
    gameTimeLeft--;
    const timerFill = document.getElementById('game-timer-fill');
    const timerText = document.getElementById('game-timer-text');
    if (timerFill) timerFill.style.width = (gameTimeLeft / 45 * 100) + '%';
    if (timerText) timerText.textContent = gameTimeLeft + ' сек';

    if (gameTimeLeft <= 0) {
      endGreetingsGame(false);
    }
  }, 1000);
}

function showNextGameCard() {
  if (gameIndex >= GAME_ITEMS.length) {
    endGreetingsGame(true);
    return;
  }
  const item = GAME_ITEMS[gameIndex];
  const promptEl = document.getElementById('game-current-text');
  const hintEl = document.getElementById('game-current-hint');
  if (promptEl) promptEl.textContent = item.text;
  if (hintEl) hintEl.textContent = item.hint;
}

function chooseBucket(category) {
  if (!gameRunning || gameIndex >= GAME_ITEMS.length) return;

  const current = GAME_ITEMS[gameIndex];
  const arena = document.getElementById('game-arena');

  if (current.cat === category) {
    gameScore++;
    if (arena) {
      arena.style.borderColor = '#10b981';
      setTimeout(() => arena.style.borderColor = 'var(--border-base)', 300);
    }
  } else {
    if (arena) {
      arena.style.borderColor = '#ef4444';
      setTimeout(() => arena.style.borderColor = 'var(--border-base)', 300);
    }
  }

  gameIndex++;
  const scoreEl = document.getElementById('game-score');
  if (scoreEl) scoreEl.textContent = `${gameScore} / 10`;

  showNextGameCard();
}

function endGreetingsGame(finished) {
  gameRunning = false;
  clearInterval(gameTimer);

  const arena = document.getElementById('game-arena');
  const winBox = document.getElementById('game-win-box');
  const startBtn = document.getElementById('game-start-btn');

  if (arena) arena.style.display = 'none';
  if (startBtn) {
    startBtn.style.display = 'inline-flex';
    startBtn.innerHTML = '<i class="fa-solid fa-rotate-right"></i> Грати знову';
  }

  if (winBox) {
    winBox.style.display = 'block';
    if (gameScore >= 8) {
      winBox.className = 'ls-alert ls-alert-tip';
      winBox.innerHTML = `
        <i class="fa-solid fa-trophy" style="font-size:1.5rem;color:#16a34a;"></i>
        <div>
          <strong style="font-size:1rem;">🎉 Перемога! Ви справжній «Maestro del Saluto»!</strong>
          <p style="margin-top:0.25rem;">Ваш результат: <strong>${gameScore} / 10</strong> за ${45 - gameTimeLeft} сек. Отримано <strong>+50 XP</strong>!</p>
        </div>
      `;
      awardXP(50);
      showToast('<i class="fa-solid fa-medal"></i> +50 XP! Бейдж "Maestro del Saluto" розблоковано!', 'xp');
    } else {
      winBox.className = 'ls-alert ls-alert-warn';
      winBox.innerHTML = `
        <i class="fa-solid fa-circle-info" style="font-size:1.5rem;color:#d97706;"></i>
        <div>
          <strong style="font-size:1rem;">Гарна спроба!</strong>
          <p style="margin-top:0.25rem;">Ваш результат: <strong>${gameScore} / 10</strong>. Потрібно щонайменше 8 правильних відповідей для отримання нагороди.</p>
        </div>
      `;
    }
  }
}

/* ══════════════════════════════
   Init on DOM ready
══════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  // Sync theme toggle button UI
  applyTheme(getStoredTheme() === 'dark');

  // Enter key on fill inputs
  ['fill-input-1', 'fill-input-2', 'fill-input-3'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('keydown', e => { if (e.key === 'Enter') submitFill(); });
  });
});
