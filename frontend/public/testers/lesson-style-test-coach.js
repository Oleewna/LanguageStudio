(function () {
  'use strict';

  const copy = {
    uk: {
      back: '← До уроку', loading: 'Завантаження уроку…', failed: 'Не вдалося завантажити урок.',
      context: 'ІТАЛІЙСЬКА · A1', stepTitle: 'Урок · 5 кроків',
      steps: ['Ситуація', 'Діалог', 'Фрази в контексті', 'Ваша відповідь', 'Перевірка'],
      situation: 'Ситуація', dialogue: 'Розмова в класі', listen: 'Слухати',
      showTranslation: 'Переклад', hideTranslation: 'Сховати переклад',
      previous: 'Попередня фраза', next: 'Наступна фраза',
      lineOf: 'Фраза {current} з {total}', phrases: 'Швидка підказка', phraseCount: '{count} фрази',
      focusTitle: 'Розберімо фразу', focusHelp: 'Вимова й приклад із цієї розмови', example: 'У діалозі', reference: 'Короткий словничок',
      replyTitle: 'А тепер ви', replyHelp: 'Представтеся за зразком у діалозі.',
      yourName: 'ваше ім’я', makeReply: 'Скласти відповідь', emptyName: 'Введіть ім’я, щоб скласти фразу.',
      quickCheck: 'Перевірте розуміння', check: 'Перевірити', choose: 'Спершу оберіть відповідь.',
      correct: 'Правильно.', wrong: 'Спробуйте ще раз.', finish: 'Готово · прогрес не зберігається',
      nextLesson: 'До наступного уроку', noAudio: 'Озвучення недоступне в цьому браузері.',
      sceneAlt: 'Знайомство студенток в італійському класі'
    },
    en: {
      back: '← Back to lesson', loading: 'Loading lesson…', failed: 'The lesson could not be loaded.',
      context: 'ITALIAN · A1', stepTitle: 'Lesson · 5 steps',
      steps: ['The situation', 'The conversation', 'Phrase focus', 'Your reply', 'Quick check'],
      situation: 'The situation', dialogue: 'Meeting in class', listen: 'Listen',
      showTranslation: 'Translation', hideTranslation: 'Hide translation',
      previous: 'Previous phrase', next: 'Next phrase',
      lineOf: 'Phrase {current} of {total}', phrases: 'Quick reference', phraseCount: '{count} phrases',
      focusTitle: 'Explore the phrase', focusHelp: 'Pronunciation and an example from this conversation', example: 'In the conversation', reference: 'Phrase reference',
      replyTitle: 'Your turn', replyHelp: 'Introduce yourself using the conversation as a model.',
      yourName: 'your name', makeReply: 'Build your reply', emptyName: 'Enter your name to build the phrase.',
      quickCheck: 'Quick check', check: 'Check answer', choose: 'Choose an answer first.',
      correct: 'Correct.', wrong: 'Try again.', finish: 'Done · progress is not saved',
      nextLesson: 'Continue to next lesson', noAudio: 'Audio is unavailable in this browser.',
      sceneAlt: 'Students meeting in an Italian classroom'
    }
  };

  const shell = document.getElementById('coachShell');
  const toggle = document.getElementById('languageToggle');
  const toast = document.getElementById('toast');
  const context = document.getElementById('courseContext');
  const backLink = document.getElementById('backLink');
  const savedLanguage = localStorage.getItem('ls_italian_source_language');
  let language = savedLanguage === 'en' ? 'en' : 'uk';
  let lesson;
  let phraseIndex = 0;
  const visibleTranslations = new Set();
  let learnerName = '';
  let replySentence = '';
  let selectedAnswer = '';
  let answerChecked = false;
  let phraseBlock;
  let dialogueBlock;
  let quizTask;

  function t(value, fallback = '') {
    if (typeof value === 'string') return value;
    if (value && typeof value === 'object') return value[language] || value.uk || value.en || fallback;
    return fallback;
  }

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, (character) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[character]);
  }

  function setHeader() {
    document.documentElement.lang = language;
    context.textContent = copy[language].context;
    backLink.textContent = copy[language].back;
    toggle.textContent = language === 'uk' ? 'EN' : 'УК';
    toggle.setAttribute('aria-label', language === 'uk' ? 'Змінити мову' : 'Change language');
  }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('is-visible');
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => toast.classList.remove('is-visible'), 2300);
  }

  function renderSteps() {
    return copy[language].steps.map((step, index) => `<a href="${['#scene', '#conversation', '#phrase-focus', '#your-turn', '#quick-check'][index]}"><span class="progress-number">0${index + 1}</span><span>${escapeHtml(step)}</span></a>`).join('');
  }

  function renderDialogue() {
    const lines = dialogueBlock?.lines || [];
    return lines.map((line, index) => {
        const speaker = t(line.speaker, language === 'uk' ? 'Співрозмовник' : 'Speaker');
        const translationVisible = visibleTranslations.has(index);
        const lineText = line.text || line.it || '';
        return `<article class="transcript-turn ${line.speaker === 'Greta' ? 'is-greta' : ''}">
          <span class="speaker-mark" aria-hidden="true">${escapeHtml(line.avatar || speaker.charAt(0))}</span>
          <div class="transcript-copy"><p class="transcript-speaker">${escapeHtml(speaker)}</p><p class="transcript-line">${escapeHtml(lineText)}</p>
            <p class="transcript-translation" ${translationVisible ? '' : 'hidden'}>${escapeHtml(t(line.trans || line.translations))}</p>
            <div class="transcript-actions"><button class="text-control speak-button" type="button" data-speak="${escapeHtml(lineText)}">${escapeHtml(copy[language].listen)}</button><button class="text-control translation-button" type="button" data-translation="${index}" aria-expanded="${translationVisible}">${escapeHtml(translationVisible ? copy[language].hideTranslation : copy[language].showTranslation)}</button></div>
          </div>
        </article>`;
      }).join('');
  }

  function renderPhraseFocus() {
    const items = phraseBlock?.items || [];
    const item = items[phraseIndex];
    if (!item) return '';
    const phrase = item.it || item.word || item.text || '';
    const exampleLine = (dialogueBlock?.lines || []).find((line) => (line.text || line.it || '').toLowerCase().includes(phrase.toLowerCase()));
    const exampleText = exampleLine?.text || exampleLine?.it || phrase;
    const exampleTranslation = t(exampleLine?.trans || exampleLine?.translations);
    const pronunciation = t(item.transcription || item.phon);
    return `<div class="focus-heading"><div><p class="section-kicker">03 / ${escapeHtml(copy[language].steps[2])}</p><h2>${escapeHtml(copy[language].focusTitle)}</h2></div><span class="session-count">${escapeHtml(copy[language].lineOf.replace('{current}', phraseIndex + 1).replace('{total}', items.length))}</span></div>
      <p class="focus-help">${escapeHtml(copy[language].focusHelp)}</p>
      <div class="phrase-focus-panel"><div class="focus-phrase-row"><div><p class="focus-phrase">${escapeHtml(phrase)}</p>${pronunciation ? `<p class="focus-pronunciation">${escapeHtml(pronunciation)}</p>` : ''}</div><button class="text-control speak-button" type="button" data-speak="${escapeHtml(phrase)}">${escapeHtml(copy[language].listen)}</button></div>
        <p class="focus-meaning">${escapeHtml(t(item.translations || item.trans))}</p>
        ${exampleLine ? `<div class="focus-example"><p class="section-kicker">${escapeHtml(copy[language].example)}</p><p>${escapeHtml(exampleText)}</p><span>${escapeHtml(exampleTranslation)}</span></div>` : ''}
      </div>
      <div class="focus-nav"><span class="focus-dots" aria-hidden="true">${items.map((_, index) => `<i class="${index === phraseIndex ? 'is-active' : ''}"></i>`).join('')}</span><button class="text-control phrase-previous" type="button" ${phraseIndex === 0 ? 'disabled' : ''}>${escapeHtml(copy[language].previous)}</button><button class="primary-button phrase-next" type="button">${escapeHtml(phraseIndex === items.length - 1 ? copy[language].replyTitle : copy[language].next)}</button></div>`;
  }

  function renderPhrases() {
    const items = phraseBlock?.items || [];
    return `<div class="phrase-heading"><div><p class="section-kicker">${escapeHtml(copy[language].reference)}</p><h2>${escapeHtml(copy[language].phrases)}</h2></div><span class="phrase-count">${escapeHtml(copy[language].phraseCount.replace('{count}', items.length))}</span></div>
      <div class="vocab-list">${items.map((item) => {
        const phrase = item.it || item.word || item.text || '';
        const index = items.indexOf(item);
        return `<div class="vocab-row"><button class="phrase-select" type="button" data-phrase-index="${index}" aria-pressed="${index === phraseIndex}"><span class="vocab-word">${escapeHtml(phrase)}</span><span class="vocab-translation">${escapeHtml(t(item.translations || item.trans))}</span></button><button class="text-control speak-button" type="button" data-speak="${escapeHtml(phrase)}">${escapeHtml(copy[language].listen)}</button></div>`;
      }).join('')}</div>`;
  }

  function renderCheck() {
    if (!quizTask) return '';
    const options = quizTask.options || [];
    const correctIndex = options.findIndex((option) => option.correct);
    const feedback = answerChecked ? (Number(selectedAnswer) === correctIndex ? copy[language].correct : copy[language].wrong) : '';
    const feedbackClass = answerChecked ? (Number(selectedAnswer) === correctIndex ? 'is-correct' : 'is-wrong') : '';
    return `<div class="check-heading"><p class="section-kicker">05 / ${escapeHtml(copy[language].steps[4])}</p><h2>${escapeHtml(copy[language].quickCheck)}</h2></div><div>
      <p class="check-question">${escapeHtml(t(quizTask.q || quizTask.question))}</p>
      <fieldset class="quiz-options" aria-label="${escapeHtml(t(quizTask.q || quizTask.question))}">${options.map((option, index) => `<label class="quiz-option"><input type="radio" name="scene-check" value="${index}" ${selectedAnswer === String(index) ? 'checked' : ''}><span>${escapeHtml(t(option.text || option.label))}</span></label>`).join('')}</fieldset>
      <button class="text-control check-button" type="button">${escapeHtml(copy[language].check)}</button><p class="quiz-feedback ${feedbackClass}" role="status">${escapeHtml(feedback)}</p>
    </div>`;
  }

  function render() {
    setHeader();
    const nextId = lesson.nextLessonId || 'communication-basics-1-practice';
    const title = t(lesson.title);
    document.title = `${title} — LanguageStudio`;
    shell.innerHTML = `<section class="lesson-intro" id="scene"><div><p class="eyebrow">${escapeHtml(t(lesson.hero?.label, copy[language].context))}</p><h1>${escapeHtml(title)}</h1><p class="lesson-subtitle">${escapeHtml(t(lesson.subtitle))}</p><p class="lesson-description">${escapeHtml(t(lesson.hero?.text || lesson.description))}</p></div><figure class="scene-figure"><img src="../assets/images/communication-basics.jpg" alt="${escapeHtml(copy[language].sceneAlt)}"><figcaption>${escapeHtml(t(dialogueBlock.story))}</figcaption></figure></section>
      <nav class="lesson-progress" aria-label="${escapeHtml(language === 'uk' ? 'Кроки уроку' : 'Lesson steps')}">${renderSteps()}</nav>
      <section class="conversation-section" id="conversation"><div class="session-heading"><div><p class="section-kicker">02 / ${escapeHtml(copy[language].steps[1])}</p><h2>${escapeHtml(t(dialogueBlock.title, copy[language].dialogue))}</h2></div></div><p class="scene-story">${escapeHtml(t(dialogueBlock.story))}</p><div class="transcript-list">${renderDialogue()}</div></section>
      <section class="phrase-focus" id="phrase-focus">${renderPhraseFocus()}</section>
      <aside class="vocabulary-block" id="vocabulary">${renderPhrases()}</aside>
      <section class="practice-band" id="your-turn"><div class="reply-heading"><p class="section-kicker">${escapeHtml(copy[language].steps[3])}</p><h2>${escapeHtml(copy[language].replyTitle)}</h2><p>${escapeHtml(copy[language].replyHelp)}</p></div><form class="practice-form" id="replyForm"><label class="sentence-frame"><span>Mi chiamo</span><input id="learnerName" autocomplete="given-name" placeholder="${escapeHtml(copy[language].yourName)}" aria-label="${escapeHtml(copy[language].yourName)}" value="${escapeHtml(learnerName)}"><span>.</span></label><button class="primary-button" type="submit">${escapeHtml(copy[language].makeReply)}</button><p class="response-output" id="replyOutput" role="status">${escapeHtml(replySentence)}</p></form></section>
      <section class="quick-check" id="quick-check">${renderCheck()}</section>
      <footer class="lesson-end"><span class="lesson-end-note">${escapeHtml(copy[language].finish)}</span><a class="next-link" href="../pages/lesson.html?course=it&amp;lesson=${encodeURIComponent(nextId)}">${escapeHtml(copy[language].nextLesson)} →</a></footer>`;
    bindInteractions();
  }

  function bindInteractions() {
    shell.querySelectorAll('.translation-button').forEach((button) => button.addEventListener('click', () => {
      const index = Number(button.dataset.translation);
      if (visibleTranslations.has(index)) visibleTranslations.delete(index);
      else visibleTranslations.add(index);
      render();
    }));
    shell.querySelectorAll('.phrase-select').forEach((button) => button.addEventListener('click', () => {
      phraseIndex = Number(button.dataset.phraseIndex);
      render();
      document.getElementById('phrase-focus').scrollIntoView({ behavior: 'smooth', block: 'center' });
    }));
    shell.querySelector('.phrase-previous').addEventListener('click', () => {
      if (phraseIndex > 0) { phraseIndex -= 1; render(); }
    });
    shell.querySelector('.phrase-next').addEventListener('click', () => {
      if (phraseIndex < phraseBlock.items.length - 1) { phraseIndex += 1; render(); }
      else document.getElementById('your-turn').scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

    shell.querySelectorAll('.speak-button').forEach((button) => button.addEventListener('click', () => {
      if (!('speechSynthesis' in window)) return showToast(copy[language].noAudio);
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(button.dataset.speak);
      utterance.lang = 'it-IT';
      window.speechSynthesis.speak(utterance);
    }));

    const nameInput = document.getElementById('learnerName');
    nameInput.addEventListener('input', () => { learnerName = nameInput.value; });
    document.getElementById('replyForm').addEventListener('submit', (event) => {
      event.preventDefault();
      learnerName = nameInput.value.trim();
      if (!learnerName) { showToast(copy[language].emptyName); nameInput.focus(); return; }
      replySentence = `Mi chiamo ${learnerName}.`;
      document.getElementById('replyOutput').textContent = replySentence;
    });

    shell.querySelectorAll('input[name="scene-check"]').forEach((input) => input.addEventListener('change', () => { selectedAnswer = input.value; answerChecked = false; render(); }));
    shell.querySelector('.check-button')?.addEventListener('click', () => {
      if (selectedAnswer === '') return showToast(copy[language].choose);
      answerChecked = true;
      const chosenOption = quizTask.options[Number(selectedAnswer)];
      const feedback = shell.querySelector('.quiz-feedback');
      const correct = Boolean(chosenOption?.correct);
      feedback.textContent = correct ? copy[language].correct : copy[language].wrong;
      feedback.classList.add(correct ? 'is-correct' : 'is-wrong');
    });
  }

  toggle.addEventListener('click', () => { language = language === 'uk' ? 'en' : 'uk'; render(); });

  fetch('/courses/it/lessons/communication-basics-1.json')
    .then((response) => { if (!response.ok) throw new Error(`Lesson request failed: ${response.status}`); return response.json(); })
    .then((data) => {
      lesson = data;
      dialogueBlock = data.blocks.find((block) => block.type === 'dialogue');
      phraseBlock = data.blocks.find((block) => block.type === 'vocab');
      const quizBlock = data.blocks.find((block) => block.type === 'tasks' || block.type === 'quiz');
      quizTask = quizBlock?.items?.find((item) => (item.kind || item.type) === 'choice');
      document.title = `${t(lesson.title)} — LanguageStudio`;
      render();
    })
    .catch((error) => {
      console.error(error);
      document.documentElement.lang = language;
      shell.innerHTML = `<p class="error-message">${escapeHtml(copy[language].failed)}</p>`;
    });
})();