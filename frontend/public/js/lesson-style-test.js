(function () {
  'use strict';

  const copy = {
    uk: {
      back: '← До поточного уроку', loading: 'Завантаження уроку…',
      failed: 'Не вдалося завантажити урок. Оновіть сторінку й спробуйте ще раз.',
      language: 'Змінити мову', imageAlt: 'Дві студентки знайомляться в італійському класі', unit: 'ІТАЛІЙСЬКА · ПЕРШІ КРОКИ', scene: 'Перше знайомство в класі',
      listen: 'Слухати', show: 'Переклад', hide: 'Сховати',
      stages: ['Слухайте', 'Помічайте', 'Скажіть про себе', 'Перевірте себе'],
      practiceKicker: 'Ваша черга', practiceTitle: 'Представтеся',
      practiceDescription: 'Використайте фразу з діалогу, щоб сказати своє ім’я.',
      namePlaceholder: 'ваше ім’я', sayIt: 'Скласти фразу', emptyName: 'Спершу введіть ім’я.',
      cultureKicker: 'Мова в контексті', vocabKicker: 'Ключові фрази', checkKicker: 'Наостанок',
      checkTitle: 'Швидка перевірка', checkButton: 'Перевірити',
      chooseAnswer: 'Оберіть відповідь.', correct: 'Так, саме так.', wrong: 'Не зовсім. Спробуйте ще раз.',
      next: 'Далі за маршрутом', preview: 'Тестовий вигляд · прогрес уроку не змінюється',
      notAvailable: 'Озвучення недоступне в цьому браузері.'
    },
    en: {
      back: '← Original lesson', loading: 'Loading lesson…',
      failed: 'The lesson could not be loaded. Refresh the page and try again.',
      language: 'Change language', imageAlt: 'Two students meeting in an Italian classroom', unit: 'ITALIAN · FIRST STEPS', scene: 'First introductions in class',
      listen: 'Listen', show: 'Translation', hide: 'Hide',
      stages: ['Listen', 'Notice', 'Say it yourself', 'Check yourself'],
      practiceKicker: 'Your turn', practiceTitle: 'Introduce yourself',
      practiceDescription: 'Use a phrase from the dialogue to say your name.',
      namePlaceholder: 'your name', sayIt: 'Build the phrase', emptyName: 'Enter your name first.',
      cultureKicker: 'Language in context', vocabKicker: 'Key phrases', checkKicker: 'To finish',
      checkTitle: 'Quick check', checkButton: 'Check answer',
      chooseAnswer: 'Choose an answer.', correct: 'That’s right.', wrong: 'Not quite. Try again.',
      next: 'Continue learning', preview: 'Style preview · lesson progress is unchanged',
      notAvailable: 'Audio is unavailable in this browser.'
    }
  };

  const app = document.getElementById('lessonApp');
  const languageToggle = document.getElementById('languageToggle');
  const toast = document.getElementById('toast');
  let lang = localStorage.getItem('ls_italian_source_language') || 'uk';
  if (lang !== 'en' && lang !== 'uk') lang = 'uk';
  let lesson;
  let nameValue = '';
  let selectedAnswer = '';
  let answerChecked = false;
  const visibleTranslations = new Set();

  function text(value, fallback = '') {
    if (typeof value === 'string') return value;
    if (value && typeof value === 'object') return value[lang] || value.uk || value.en || fallback;
    return fallback;
  }

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, (character) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[character]);
  }

  function setStaticCopy() {
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-copy]').forEach((element) => {
      element.textContent = copy[lang][element.dataset.copy];
    });
    languageToggle.textContent = lang === 'uk' ? 'EN' : 'УК';
    languageToggle.setAttribute('aria-label', copy[lang].language);
  }

  function findBlock(type) {
    return lesson.blocks.find((block) => block.type === type || (type === 'culture' && block.type === 'culture_note'));
  }

  function renderDialogue(block) {
    return (block?.lines || []).map((line, index) => {
      const translationVisible = visibleTranslations.has(index);
      const speaker = text(line.speaker, lang === 'uk' ? 'Співрозмовник' : 'Speaker');
      const translation = text(line.trans || line.translations);
      return `<article class="dialogue-turn ${line.speaker === 'Greta' ? 'is-greta' : ''}">
        <span class="speaker-mark" aria-hidden="true">${escapeHtml(line.avatar || speaker.charAt(0))}</span>
        <div class="turn-copy">
          <p class="speaker-name">${escapeHtml(speaker)}</p>
          <div class="turn-line">
            <span class="italian-line">${escapeHtml(line.text || line.it || '')}</span>
            <button class="text-control speak-button" type="button" data-speak="${escapeHtml(line.text || line.it || '')}">${escapeHtml(copy[lang].listen)}</button>
            <button class="text-control translation-button" type="button" data-translation="${index}" aria-expanded="${translationVisible}">${escapeHtml(translationVisible ? copy[lang].hide : copy[lang].show)}</button>
          </div>
          <p class="turn-translation" ${translationVisible ? '' : 'hidden'}>${escapeHtml(translation)}</p>
        </div>
      </article>`;
    }).join('');
  }

  function renderVocabulary(block) {
    return (block?.items || []).map((item) => {
      const phrase = item.it || item.word || item.text || '';
      const translation = text(item.translations || item.trans);
      return `<div class="vocab-row">
        <span class="vocab-word">${escapeHtml(phrase)}</span>
        <span class="vocab-translation">${escapeHtml(translation)}</span>
        <button class="text-control vocab-speak speak-button" type="button" data-speak="${escapeHtml(phrase)}">${escapeHtml(copy[lang].listen)}</button>
      </div>`;
    }).join('');
  }

  function renderQuiz(block) {
    const task = block?.items?.find((item) => (item.kind || item.type) === 'choice');
    if (!task) return '';
    const options = task.options || [];
    const correctIndex = options.findIndex((option) => option.correct);
    const resultClass = answerChecked ? (Number(selectedAnswer) === correctIndex ? 'is-correct' : 'is-wrong') : '';
    const resultText = answerChecked
      ? (Number(selectedAnswer) === correctIndex ? copy[lang].correct : copy[lang].wrong)
      : '';
    return `<div class="check-content">
      <p class="check-question">${escapeHtml(text(task.q || task.question))}</p>
      <fieldset class="quiz-options" aria-label="${escapeHtml(text(task.q || task.question))}">
        ${options.map((option, index) => `<label class="quiz-option">
          <input type="radio" name="lesson-check" value="${index}" ${selectedAnswer === String(index) ? 'checked' : ''}>
          <span>${escapeHtml(text(option.text || option.label))}</span>
        </label>`).join('')}
      </fieldset>
      <button class="primary-button check-button" type="button">${escapeHtml(copy[lang].checkButton)}</button>
      <p class="quiz-feedback ${resultClass}" role="status">${escapeHtml(resultText)}</p>
    </div>`;
  }

  function render() {
    setStaticCopy();
    const dialogue = findBlock('dialogue');
    const vocabulary = findBlock('vocab');
    const culture = findBlock('culture');
    const quiz = findBlock('tasks') || findBlock('quiz');
    const title = text(lesson.title);
    const description = text(lesson.hero?.text || lesson.description);
    const subtitle = text(lesson.subtitle);
    const story = text(dialogue?.story);
    const cultureText = text(culture?.paragraphs?.[0]?.text || culture?.paragraphs?.[0]);
    const nextId = lesson.nextLessonId || 'communication-basics-1-practice';
    const lessonPage = window.location.pathname.startsWith('/testers/') ? '../pages/lesson.html' : 'lesson.html';

    app.innerHTML = `<div class="lesson-intro">
      <div class="intro-copy">
        <p class="eyebrow">${escapeHtml(text(lesson.hero?.label, copy[lang].unit))}</p>
        <h1>${escapeHtml(title)}</h1>
        <p class="lesson-subtitle">${escapeHtml(subtitle)}</p>
        <p class="lesson-description">${escapeHtml(description)}</p>
      </div>
      <figure class="scene-figure">
        <img src="../assets/images/communication-basics.jpg" alt="${escapeHtml(copy[lang].imageAlt)}" />
        <figcaption>${escapeHtml(copy[lang].scene)}</figcaption>
      </figure>
    </div>

    <nav class="lesson-progress" aria-label="${escapeHtml(lang === 'uk' ? 'Етапи уроку' : 'Lesson steps')}">
      ${copy[lang].stages.map((stage, index) => `<a href="${['#conversation', '#vocabulary', '#your-turn', '#quick-check'][index]}"><span class="progress-number">0${index + 1}</span><span>${escapeHtml(stage)}</span></a>`).join('')}
    </nav>

    <section class="conversation-section" id="conversation">
      <div class="section-heading"><div><p class="section-kicker">01 / ${escapeHtml(copy[lang].stages[0])}</p><h2>${escapeHtml(text(dialogue?.title, lang === 'uk' ? 'Діалог' : 'Dialogue'))}</h2></div></div>
      <p class="scene-story">${escapeHtml(story)}</p>
      <div class="conversation">${renderDialogue(dialogue)}</div>
    </section>

    <section class="practice-band" id="your-turn">
      <div class="practice-heading"><p class="section-kicker">02 / ${escapeHtml(copy[lang].practiceKicker)}</p><h2>${escapeHtml(copy[lang].practiceTitle)}</h2><p>${escapeHtml(copy[lang].practiceDescription)}</p></div>
      <form class="practice-form" id="practiceForm">
        <label class="sentence-frame"><span>Mi chiamo</span><input id="learnerName" name="name" autocomplete="given-name" placeholder="${escapeHtml(copy[lang].namePlaceholder)}" value="${escapeHtml(nameValue)}" aria-label="${escapeHtml(copy[lang].namePlaceholder)}"><span>.</span></label>
        <button class="primary-button" type="submit">${escapeHtml(copy[lang].sayIt)}</button>
        <p class="response-output" id="responseOutput" role="status"></p>
      </form>
    </section>

    <section class="study-notes" id="vocabulary">
      <div class="vocabulary-block"><div class="vocab-heading"><p class="section-kicker">03 / ${escapeHtml(copy[lang].vocabKicker)}</p><h2>${escapeHtml(text(vocabulary?.title, lang === 'uk' ? 'Нові слова' : 'Vocabulary'))}</h2></div><div class="vocab-list">${renderVocabulary(vocabulary)}</div></div>
      <aside class="culture-note"><p class="section-kicker">${escapeHtml(copy[lang].cultureKicker)}</p><h3>${escapeHtml(text(culture?.title, lang === 'uk' ? 'Культурна нотатка' : 'Culture note'))}</h3><p>${escapeHtml(cultureText)}</p></aside>
    </section>

    <section class="quick-check" id="quick-check">
      <div class="check-heading"><p class="section-kicker">04 / ${escapeHtml(copy[lang].checkKicker)}</p><h2>${escapeHtml(copy[lang].checkTitle)}</h2></div>
      ${renderQuiz(quiz)}
    </section>

    <footer class="lesson-end"><span class="lesson-end-note">${escapeHtml(copy[lang].preview)}</span><a class="next-link" href="${lessonPage}?course=it&amp;lesson=${encodeURIComponent(nextId)}">${escapeHtml(copy[lang].next)} →</a></footer>`;

    bindInteractions();
  }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('is-visible');
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => toast.classList.remove('is-visible'), 2500);
  }

  function bindInteractions() {
    app.querySelectorAll('.translation-button').forEach((button) => {
      button.addEventListener('click', () => {
        const index = Number(button.dataset.translation);
        if (visibleTranslations.has(index)) visibleTranslations.delete(index);
        else visibleTranslations.add(index);
        render();
      });
    });

    app.querySelectorAll('.speak-button').forEach((button) => {
      button.addEventListener('click', () => {
        if (!('speechSynthesis' in window)) return showToast(copy[lang].notAvailable);
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(button.dataset.speak);
        utterance.lang = 'it-IT';
        window.speechSynthesis.speak(utterance);
      });
    });

    const nameInput = document.getElementById('learnerName');
    nameInput.addEventListener('input', () => { nameValue = nameInput.value; });
    document.getElementById('practiceForm').addEventListener('submit', (event) => {
      event.preventDefault();
      nameValue = nameInput.value.trim();
      if (!nameValue) {
        showToast(copy[lang].emptyName);
        nameInput.focus();
        return;
      }
      document.getElementById('responseOutput').textContent = `Mi chiamo ${nameValue}.`;
    });

    app.querySelectorAll('input[name="lesson-check"]').forEach((input) => {
      input.addEventListener('change', () => {
        selectedAnswer = input.value;
        answerChecked = false;
        const feedback = app.querySelector('.quiz-feedback');
        if (feedback) {
          feedback.textContent = '';
          feedback.classList.remove('is-correct', 'is-wrong');
        }
      });
    });

    const checkButton = app.querySelector('.check-button');
    checkButton?.addEventListener('click', () => {
      if (selectedAnswer === '') {
        showToast(copy[lang].chooseAnswer);
        return;
      }
      answerChecked = true;
      const feedback = app.querySelector('.quiz-feedback');
      const correctIndex = findBlock('tasks')?.items?.find((item) => (item.kind || item.type) === 'choice')?.options?.findIndex((option) => option.correct) ?? -1;
      const correct = Number(selectedAnswer) === correctIndex;
      feedback.textContent = correct ? copy[lang].correct : copy[lang].wrong;
      feedback.classList.toggle('is-correct', correct);
      feedback.classList.toggle('is-wrong', !correct);
    });
  }

  languageToggle.addEventListener('click', () => {
    lang = lang === 'uk' ? 'en' : 'uk';
    render();
  });

  fetch('/courses/it/lessons/communication-basics-1.json')
    .then((response) => {
      if (!response.ok) throw new Error(`Lesson request failed: ${response.status}`);
      return response.json();
    })
    .then((data) => {
      lesson = data;
      render();
    })
    .catch((error) => {
      console.error(error);
      setStaticCopy();
      app.innerHTML = `<p class="error-message">${escapeHtml(copy[lang].failed)}</p>`;
    });
})();