/**
 * placement-test.js
 * Interactive 3-step placement test:
 *   Step 0 – Goal / path selector (Duolingo-style onboarding)
 *   Step 1 – 5-question adaptive quiz
 *   Step 2 – Results + personalised curriculum CTA
 */
(function () {
  'use strict';

  /* ─────────────────────────────────────────────
     I18N
  ───────────────────────────────────────────── */
  const i18n = {
    uk: {
      // Step 0 – Goals
      goalsEyebrow:        'КРОК 1 З 3',
      goalsHeading:        'Що ви хочете вивчити?',
      goalsDesc:           'Оберіть одну або кілька цілей — ми підберемо навчальний план саме для вас.',
      goalsHintNone:       'Оберіть хоча б одну ціль',
      goalsHintOne:        '1 ціль обрано',
      goalsHintMany:       (n) => `${n} цілі обрано`,
      goalsNextLabel:      'Далі',
      metaBeginner:        'Для початківців',
      metaSignup:          'Без реєстрації',

      // Goal cards
      goals: [
        { id: 'travel',   icon: 'travel',     label: 'Подорожі та розмови',      desc: 'Готелі, транспорт, кафе' },
        { id: 'business', icon: 'business',   label: 'Робота та бізнес',          desc: 'Офіс, зустрічі, листи' },
        { id: 'grammar',  icon: 'grammar',    label: 'Граматика та основи',       desc: 'Правила, структура, артиклі' },
        { id: 'reading',  icon: 'dictionary', label: 'Короткі історії та читання', desc: 'Тексти, словниковий запас' },
      ],

      // Step 1 – Quiz
      quizEyebrow:         'ВИЗНАЧЕННЯ РІВНЯ',
      quizHeading:         'Швидка перевірка перед початком',
      quizDesc:            'Оберіть найкращу відповідь, щоб зрозуміти свій рівень.',
      quizCounter:         (cur, total) => `Питання ${cur} з ${total}`,
      quizNextLabel:       'Наступне питання',
      quizFinishLabel:     'Завершити тест',
      quizProgressNote:    (n) => `${n} відповідей залишилось`,
      diffLabels: { A1: 'A1 · Початківець', A2: 'A2 · Елементарний', B1: 'B1 · Середній' },

      // Step 2 – Results
      resultsEyebrow:      'ВАШ РЕЗУЛЬТАТ',
      resultsHeading:      'Ваш рівень визначено!',
      resultsDesc:         'На основі ваших відповідей ми підготували персональний навчальний план.',
      resultPathsLabel:    'Обрані напрямки навчання:',
      resultCtaLabel:      'Розблокувати мій навчальний план',
      restartLabel:        'Пройти тест знову',
      resultScore:         (correct, total) => `Правильних відповідей: ${correct} з ${total}`,
      levels: {
        A1: { label: 'Початківець', desc: 'A1 — Elementary' },
        A2: { label: 'Елементарний', desc: 'A2 — Pre-Intermediate' },
        B1: { label: 'Середній', desc: 'B1 — Intermediate' },
      },
    },

    en: {
      goalsEyebrow:        'STEP 1 OF 3',
      goalsHeading:        'What do you want to learn?',
      goalsDesc:           "Pick one or more goals — we'll build a personalised plan just for you.",
      goalsHintNone:       'Select at least one goal',
      goalsHintOne:        '1 goal selected',
      goalsHintMany:       (n) => `${n} goals selected`,
      goalsNextLabel:      'Next',
      metaBeginner:        'Beginner-friendly',
      metaSignup:          'No account needed',

      goals: [
        { id: 'travel',   icon: 'travel',     label: 'Travel & Conversation',   desc: 'Hotels, transport, cafés' },
        { id: 'business', icon: 'business',   label: 'Work & Business',          desc: 'Office, meetings, emails' },
        { id: 'grammar',  icon: 'grammar',    label: 'Grammar & Fundamentals',   desc: 'Rules, structure, articles' },
        { id: 'reading',  icon: 'dictionary', label: 'Short Stories & Reading',  desc: 'Texts, vocabulary building' },
      ],

      quizEyebrow:         'PLACEMENT TEST',
      quizHeading:         'Quick check before you begin',
      quizDesc:            'Pick the best answer to estimate your starting point.',
      quizCounter:         (cur, total) => `Question ${cur} of ${total}`,
      quizNextLabel:       'Next question',
      quizFinishLabel:     'Finish test',
      quizProgressNote:    (n) => `${n} answer(s) remaining`,
      diffLabels: { A1: 'A1 · Beginner', A2: 'A2 · Elementary', B1: 'B1 · Intermediate' },

      resultsEyebrow:      'YOUR RESULT',
      resultsHeading:      'Your level has been assessed!',
      resultsDesc:         "Based on your answers, we've built a personalised curriculum for you.",
      resultPathsLabel:    'Your chosen learning paths:',
      resultCtaLabel:      'Unlock My Curriculum',
      restartLabel:        'Retake the test',
      resultScore:         (correct, total) => `Correct answers: ${correct} of ${total}`,
      levels: {
        A1: { label: 'Beginner', desc: 'A1 — Elementary' },
        A2: { label: 'Elementary', desc: 'A2 — Pre-Intermediate' },
        B1: { label: 'Intermediate', desc: 'B1 — Intermediate' },
      },
    },
  };

  /* ─────────────────────────────────────────────
     QUESTIONS DATABASE
     5 questions, A1 to B1, for Italian (it) and
     Spanish (es). Structure:
       { id, level, question:{uk,en}, options:[{text,correct}] }
  ───────────────────────────────────────────── */
  const QUESTIONS = {
    it: [
      {
        id: 'it-1', level: 'A1',
        question: {
          uk: 'Як сказати «Доброго ранку» італійською?',
          en: 'How do you say "Good morning" in Italian?',
        },
        options: [
          { text: 'Buongiorno', correct: true },
          { text: 'Buona sera', correct: false },
          { text: 'Arrivederci', correct: false },
          { text: 'Grazie', correct: false },
        ],
      },
      {
        id: 'it-2', level: 'A1',
        question: {
          uk: 'Як правильно сказати «Мене звати Анна» по-італійськи?',
          en: 'Which phrase means "My name is Anna" in Italian?',
        },
        options: [
          { text: 'Mi chiamo Anna', correct: true },
          { text: 'Io sono Anna bella', correct: false },
          { text: 'Anna è brava', correct: false },
          { text: 'Come stai, Anna?', correct: false },
        ],
      },
      {
        id: 'it-3', level: 'A2',
        question: {
          uk: 'Яка форма дієслова «essere» правильна для «noi»?',
          en: 'Which is the correct form of "essere" for "noi"?',
        },
        options: [
          { text: 'siamo', correct: true },
          { text: 'sono', correct: false },
          { text: 'sei', correct: false },
          { text: 'è', correct: false },
        ],
      },
      {
        id: 'it-4', level: 'A2',
        question: {
          uk: 'Оберіть правильний артикль для слова «libro» (книга):',
          en: 'Choose the correct definite article for "libro" (book):',
        },
        options: [
          { text: 'il', correct: true },
          { text: 'la', correct: false },
          { text: 'le', correct: false },
          { text: 'lo', correct: false },
        ],
      },
      {
        id: 'it-5', level: 'B1',
        question: {
          uk: 'Яке речення правильно виражає «Я їв піцу вчора» в минулому часі?',
          en: 'Which sentence correctly expresses "I ate pizza yesterday" in Italian?',
        },
        options: [
          { text: 'Ieri ho mangiato la pizza', correct: true },
          { text: 'Ieri mangio la pizza', correct: false },
          { text: 'Ieri avevo mangiato la pizza', correct: false },
          { text: 'Domani mangerò la pizza', correct: false },
        ],
      },
    ],
    es: [
      {
        id: 'es-1', level: 'A1',
        question: {
          uk: 'Як сказати «Добрий ранок» іспанською?',
          en: 'How do you say "Good morning" in Spanish?',
        },
        options: [
          { text: 'Buenos días', correct: true },
          { text: 'Buenas noches', correct: false },
          { text: 'Hasta luego', correct: false },
          { text: 'Gracias', correct: false },
        ],
      },
      {
        id: 'es-2', level: 'A1',
        question: {
          uk: 'Як правильно сказати «Мене звати Карлос» іспанською?',
          en: 'Which phrase means "My name is Carlos" in Spanish?',
        },
        options: [
          { text: 'Me llamo Carlos', correct: true },
          { text: 'Yo soy Carlos bien', correct: false },
          { text: 'Carlos está aquí', correct: false },
          { text: '¿Cómo estás, Carlos?', correct: false },
        ],
      },
      {
        id: 'es-3', level: 'A2',
        question: {
          uk: 'Яка форма дієслова «ser» правильна для «nosotros»?',
          en: 'Which is the correct form of "ser" for "nosotros"?',
        },
        options: [
          { text: 'somos', correct: true },
          { text: 'son', correct: false },
          { text: 'eres', correct: false },
          { text: 'es', correct: false },
        ],
      },
      {
        id: 'es-4', level: 'A2',
        question: {
          uk: 'Оберіть правильний артикль для слова «libro» (книга):',
          en: 'Choose the correct definite article for "libro" (book) in Spanish:',
        },
        options: [
          { text: 'el', correct: true },
          { text: 'la', correct: false },
          { text: 'las', correct: false },
          { text: 'los', correct: false },
        ],
      },
      {
        id: 'es-5', level: 'B1',
        question: {
          uk: 'Яке речення правильно виражає «Я їв піцу вчора» іспанською?',
          en: 'Which sentence correctly expresses "I ate pizza yesterday" in Spanish?',
        },
        options: [
          { text: 'Ayer comí la pizza', correct: true },
          { text: 'Ayer como la pizza', correct: false },
          { text: 'Ayer había comido la pizza', correct: false },
          { text: 'Mañana comeré la pizza', correct: false },
        ],
      },
    ],
  };

  /* ─────────────────────────────────────────────
     STATE
  ───────────────────────────────────────────── */
  let lang = 'uk';
  let course = 'it';
  let selectedGoals = [];
  let currentQ = 0;
  let answers = []; // { questionId, correct }
  const TOTAL_QUESTIONS = 5;

  /* ─────────────────────────────────────────────
     HELPERS
  ───────────────────────────────────────────── */
  function getLang() {
    if (typeof window.getSourceLanguage === 'function') {
      const sl = window.getSourceLanguage();
      return sl === 'en' ? 'en' : 'uk';
    }
    const saved = localStorage.getItem('ls_source_language') || localStorage.getItem('ls_italian_source_language');
    if (saved === 'en') return 'en';
    if (saved === 'uk') return 'uk';
    return (navigator.language || '').toLowerCase().startsWith('uk') ? 'uk' : 'en';
  }

  function getCourse() {
    // Check URL param first, then localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const urlCourse = urlParams.get('course');
    if (urlCourse && QUESTIONS[urlCourse]) return urlCourse;
    const saved = localStorage.getItem('ls_course') || localStorage.getItem('ls_active_course');
    return saved && QUESTIONS[saved] ? saved : 'it';
  }

  function t(key, ...args) {
    const dict = i18n[lang] || i18n.uk;
    const val = dict[key];
    if (typeof val === 'function') return val(...args);
    return val || key;
  }

  function el(id) { return document.getElementById(id); }

  function setTextIds(map) {
    for (const [id, text] of Object.entries(map)) {
      const node = el(id);
      if (node) node.textContent = text;
    }
  }

  function showStep(stepId) {
    ['stepGoals', 'stepQuiz', 'stepResults'].forEach((s) => {
      const node = el(s);
      if (!node) return;
      if (s === stepId) {
        node.hidden = false;
        node.removeAttribute('aria-hidden');
      } else {
        node.hidden = true;
        node.setAttribute('aria-hidden', 'true');
      }
    });
  }

  function calcLevel(correctCount) {
    if (correctCount >= 4) return 'B1';
    if (correctCount >= 2) return 'A2';
    return 'A1';
  }

  /* ─────────────────────────────────────────────
     STEP 0 — GOAL SELECTOR
  ───────────────────────────────────────────── */
  function renderGoals() {
    const grid = el('goalGrid');
    if (!grid) return;

    const goals = t('goals');
    grid.innerHTML = goals.map((goal) => {
      const isSelected = selectedGoals.includes(goal.id);
      return `
        <button
          type="button"
          class="pt-goal-card${isSelected ? ' is-selected' : ''}"
          data-goal="${goal.id}"
          aria-pressed="${isSelected}"
        >
          <span class="pt-goal-icon"><span data-icon="${goal.icon}" aria-hidden="true"></span></span>
          <span class="pt-goal-label">${goal.label}</span>
          <span class="pt-goal-desc">${goal.desc}</span>
          <span class="pt-goal-check" aria-hidden="true"></span>
        </button>
      `;
    }).join('');

    // Bind click
    grid.querySelectorAll('.pt-goal-card').forEach((btn) => {
      btn.addEventListener('click', () => toggleGoal(btn.dataset.goal));
    });

    updateGoalsHint();

    // Render icons if available
    window.renderRegisteredIcons?.(grid);
  }

  function toggleGoal(goalId) {
    const idx = selectedGoals.indexOf(goalId);
    if (idx === -1) {
      selectedGoals.push(goalId);
    } else {
      selectedGoals.splice(idx, 1);
    }
    renderGoals();
  }

  function updateGoalsHint() {
    const hintEl = el('goalsHint');
    const nextBtn = el('goalsNextBtn');
    const n = selectedGoals.length;

    let hint = '';
    if (n === 0) hint = t('goalsHintNone');
    else if (n === 1) hint = t('goalsHintOne');
    else hint = t('goalsHintMany', n);

    if (hintEl) hintEl.textContent = hint;
    if (nextBtn) nextBtn.disabled = n === 0;
  }

  function initStepGoals() {
    setTextIds({
      goalsEyebrow: t('goalsEyebrow'),
      goalsHeading: t('goalsHeading'),
      goalsDesc: t('goalsDesc'),
      goalsNextLabel: t('goalsNextLabel'),
      metaBeginner: t('metaBeginner'),
      metaSignup: t('metaSignup'),
    });
    renderGoals();

    el('goalsNextBtn')?.addEventListener('click', () => {
      if (selectedGoals.length === 0) return;
      // Persist goals
      try {
        sessionStorage.setItem('ls_pt_goals', JSON.stringify(selectedGoals));
        sessionStorage.setItem('ls_pt_course', course);
        localStorage.setItem('ls_pt_goals', JSON.stringify(selectedGoals));
        localStorage.setItem('ls_pt_course', course);
      } catch (e) { /* storage unavailable */ }
      startQuiz();
    });
  }

  /* ─────────────────────────────────────────────
     STEP 1 — QUIZ ENGINE
  ───────────────────────────────────────────── */
  function startQuiz() {
    currentQ = 0;
    answers = [];
    showStep('stepQuiz');
    renderQuestion();
  }

  function renderQuestion() {
    const questions = QUESTIONS[course];
    const q = questions[currentQ];
    if (!q) return;

    // Header
    setTextIds({
      quizEyebrow: t('quizEyebrow'),
      quizHeading: t('quizHeading'),
      quizDesc: t('quizDesc'),
      quizFlag: course === 'it' ? 'Italiano' : 'Español',
    });

    // Counter
    const counterEl = el('quizCounter');
    if (counterEl) counterEl.textContent = t('quizCounter', currentQ + 1, TOTAL_QUESTIONS);

    // Difficulty badge
    const diffEl = el('quizDifficulty');
    if (diffEl) diffEl.textContent = (t('diffLabels') || {})[q.level] || q.level;

    // Question text
    const qTextEl = el('quizQuestionText');
    if (qTextEl) qTextEl.textContent = (q.question[lang] || q.question.en);

    // Options
    const optionsEl = el('quizOptions');
    if (optionsEl) {
      optionsEl.innerHTML = q.options.map((opt, i) => `
        <button
          type="button"
          class="placement-option"
          data-index="${i}"
          data-correct="${opt.correct}"
        >${opt.text}</button>
      `).join('');

      optionsEl.querySelectorAll('.placement-option').forEach((btn) => {
        btn.addEventListener('click', () => selectOption(btn));
      });
    }

    // Next button
    const nextBtn = el('quizNextBtn');
    if (nextBtn) {
      nextBtn.disabled = true;
      const isLast = currentQ === TOTAL_QUESTIONS - 1;
      el('quizNextLabel').textContent = isLast ? t('quizFinishLabel') : t('quizNextLabel');
    }

    // Progress note
    const progressEl = el('quizProgressNote');
    if (progressEl) progressEl.textContent = '';

    // Icons
    window.renderRegisteredIcons?.(document.getElementById('stepQuiz'));
  }

  function selectOption(btn) {
    const optionsEl = el('quizOptions');
    // Deselect all
    optionsEl.querySelectorAll('.placement-option').forEach((b) => {
      b.classList.remove('is-selected');
      b.setAttribute('aria-pressed', 'false');
    });
    // Select clicked
    btn.classList.add('is-selected');
    btn.setAttribute('aria-pressed', 'true');
    el('quizNextBtn').disabled = false;
  }

  function advanceQuiz() {
    // Record answer
    const optionsEl = el('quizOptions');
    const selectedBtn = optionsEl.querySelector('.placement-option.is-selected');
    const questions = QUESTIONS[course];
    const q = questions[currentQ];

    answers.push({
      questionId: q.id,
      correct: selectedBtn ? selectedBtn.dataset.correct === 'true' : false,
    });

    currentQ += 1;
    if (currentQ < TOTAL_QUESTIONS) {
      renderQuestion();
    } else {
      showResults();
    }
  }

  function initStepQuiz() {
    el('quizNextBtn')?.addEventListener('click', () => {
      if (el('quizNextBtn').disabled) return;
      advanceQuiz();
    });
  }

  /* ─────────────────────────────────────────────
     STEP 2 — RESULTS
  ───────────────────────────────────────────── */
  function showResults() {
    const correctCount = answers.filter((a) => a.correct).length;
    const level = calcLevel(correctCount);
    const levels = t('levels');
    const levelInfo = levels[level] || { label: level, desc: level };

    // Build CTA URL
    const goalsParam = selectedGoals.join(',');
    const ctaUrl = `/pricing?paths=${encodeURIComponent(goalsParam)}&course=${encodeURIComponent(course)}&level=${encodeURIComponent(level.toLowerCase())}`;

    // Persist result
    try {
      sessionStorage.setItem('ls_pt_level', level);
      sessionStorage.setItem('ls_pt_correct', correctCount);
      localStorage.setItem('ls_pt_level', level);
    } catch (e) { /* storage unavailable */ }

    showStep('stepResults');

    // Render texts
    setTextIds({
      resultsEyebrow: t('resultsEyebrow'),
      resultsHeading: t('resultsHeading'),
      resultsDesc: t('resultsDesc'),
      resultBadge: level,
      resultLevelLabel: levelInfo.label,
      resultLevelDesc: levelInfo.desc,
      resultPathsLabel: t('resultPathsLabel'),
      resultCtaLabel: t('resultCtaLabel'),
      restartLabel: t('restartLabel'),
      resultScore: t('resultScore', correctCount, TOTAL_QUESTIONS),
    });

    // CTA href
    const ctaBtn = el('resultCtaBtn');
    if (ctaBtn) ctaBtn.href = ctaUrl;

    // Chosen paths chips
    const pathsList = el('resultPathsList');
    if (pathsList) {
      const goals = t('goals');
      const goalMap = Object.fromEntries(goals.map((g) => [g.id, g]));
      pathsList.innerHTML = selectedGoals.map((gid) => {
        const g = goalMap[gid];
        return g
          ? `<span class="pt-result-path-chip"><span data-icon="${g.icon}" aria-hidden="true"></span> ${g.label}</span>`
          : '';
      }).join('');
    }

    // Restart
    el('restartBtn')?.addEventListener('click', restartTest, { once: true });

    // Icons
    window.renderRegisteredIcons?.(document.getElementById('stepResults'));
  }

  function initStepResults() {
    // Listener is attached dynamically in showResults() with { once: true }
  }

  function restartTest() {
    selectedGoals = [];
    currentQ = 0;
    answers = [];
    lang = getLang();
    course = getCourse();
    showStep('stepGoals');
    initStepGoals();
  }

  /* ─────────────────────────────────────────────
     BOOTSTRAP
  ───────────────────────────────────────────── */
  function init() {
    lang = getLang();
    course = getCourse();

    showStep('stepGoals');
    initStepGoals();
    initStepQuiz();
    initStepResults();

    // Re-apply language on external lang change event
    window.addEventListener('sourceLanguageChanged', () => {
      lang = getLang();
      // Decide which step is active and re-render
      if (!el('stepGoals')?.hidden) {
        initStepGoals();
      } else if (!el('stepQuiz')?.hidden) {
        renderQuestion();
      } else if (!el('stepResults')?.hidden) {
        // Re-render results with new language
        const correctCount = answers.filter((a) => a.correct).length;
        const level = calcLevel(correctCount);
        const levels = t('levels');
        const levelInfo = levels[level] || { label: level, desc: level };
        setTextIds({
          resultsEyebrow: t('resultsEyebrow'),
          resultsHeading: t('resultsHeading'),
          resultsDesc: t('resultsDesc'),
          resultBadge: level,
          resultLevelLabel: levelInfo.label,
          resultLevelDesc: levelInfo.desc,
          resultPathsLabel: t('resultPathsLabel'),
          resultCtaLabel: t('resultCtaLabel'),
          restartLabel: t('restartLabel'),
          resultScore: t('resultScore', correctCount, TOTAL_QUESTIONS),
        });
        // Re-render path chips in new language
        const pathsList = el('resultPathsList');
        if (pathsList) {
          const goals = t('goals');
          const goalMap = Object.fromEntries(goals.map((g) => [g.id, g]));
          pathsList.innerHTML = selectedGoals.map((gid) => {
            const g = goalMap[gid];
            return g
              ? `<span class="pt-result-path-chip"><span data-icon="${g.icon}" aria-hidden="true"></span> ${g.label}</span>`
              : '';
          }).join('');
        }
        window.renderRegisteredIcons?.(document.getElementById('stepResults'));
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
