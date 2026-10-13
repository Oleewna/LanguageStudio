/**
 * LanguageStudio - Dynamic Block Lesson Engine
 * Renders modular lesson sections (dialogue, story_text, vocab, grammar_rule, culture_note, takeaways, quiz)
 * Supports reactive multi-language UI (uk, en, etc.), audio playback, interactive vocab hints,
 * quiz grading, and XP awards.
 */

(function () {
  'use strict';

  // ═══════════════════════════════════════════════════════════════════════
  // 1. LANGUAGE RESOLUTION & LOCALIZATION HELPERS
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * Determine the active interface language ('uk', 'en', etc.).
   * Integrates with getSourceLanguage() from app.js.
   * @returns {string}
   */
  function getCurrentLanguage() {
    if (typeof window !== 'undefined' && typeof window.getSourceLanguage === 'function') {
      try {
        const lang = window.getSourceLanguage();
        if (lang) return lang;
      } catch (e) {
        // Fallback to localStorage or default
      }
    }
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem('ls_italian_source_language');
      if (saved && saved !== 'device') return saved;
    }
    if (typeof navigator !== 'undefined' && (navigator.language || '').toLowerCase().startsWith('uk')) {
      return 'uk';
    }
    return 'uk';
  }

  /**
   * Localized helper that extracts the text matching the current interface language.
   * Falls back to 'uk', then first available translation, then fallback string.
   * @param {object|string} translatable
   * @param {string} fallback
   * @param {string} [forcedLang]
   * @returns {string}
   */
  function t(translatable, fallback = '', forcedLang = null) {
    const lang = forcedLang || getCurrentLanguage();
    if (typeof window !== 'undefined' && typeof window.resolveLessonTranslation === 'function') {
      return window.resolveLessonTranslation(translatable, lang, fallback);
    }
    if (!translatable) return fallback;
    if (typeof translatable === 'string') return translatable;
    if (typeof translatable === 'object') {
      return translatable[lang] || translatable.uk || translatable.en || Object.values(translatable)[0] || fallback;
    }
    return String(translatable);
  }

  /**
   * UI Dictionary for lesson engine messages and controls.
   */
  const ENGINE_I18N = {
    uk: {
      checkTasks: 'Перевірити завдання',
      checkAllPrompt: 'Будь ласка, дайте відповідь на всі запитання перед перевіркою.',
      correct: '✓ Правильно',
      correctAnswer: 'Правильна відповідь:',
      scorePassed: 'Чудово! Урок успішно пройдено!',
      scoreRetry: 'Спробуйте ще раз, щоб покращити результат (необхідно від 70%).',
      xpAwarded: 'Отримано +{xp} XP!',
      alreadyCompleted: 'Урок уже пройдено раніше.',
      accuracy: 'Результат: {correct}/{total} правильних відповідей ({percent}%)',
      showTranslation: 'Показати переклад',
      hideTranslation: 'Сховати переклад',
      hintsTitle: 'Підказки до слів',
      tapForHint: 'Натисніть на підкреслене слово для підказки',
      pronoun: 'Займенник',
      form: 'Форма',
      example: 'Приклад',
      translation: 'Переклад',
      word: 'Слово',
      pronunciation: 'Вимова',
      listen: 'Прослухати',
      true: 'Так',
      false: 'Ні',
      enterWord: 'введіть слово'
    },
    en: {
      checkTasks: 'Check answers',
      checkAllPrompt: 'Please answer all questions before checking.',
      correct: '✓ Correct',
      correctAnswer: 'Correct answer:',
      scorePassed: 'Great job! Lesson completed successfully!',
      scoreRetry: 'Try again to improve your score (70%+ needed to pass).',
      xpAwarded: 'Earned +{xp} XP!',
      alreadyCompleted: 'Lesson was already completed previously.',
      accuracy: 'Result: {correct}/{total} correct ({percent}%)',
      showTranslation: 'Show translation',
      hideTranslation: 'Hide translation',
      hintsTitle: 'Vocabulary hints',
      tapForHint: 'Tap underlined words for instant hints',
      pronoun: 'Pronoun',
      form: 'Form',
      example: 'Example',
      translation: 'Translation',
      word: 'Word',
      pronunciation: 'Pronunciation',
      listen: 'Listen',
      true: 'Yes',
      false: 'No',
      enterWord: 'enter word'
    }
  };

  /**
   * Retrieve localized engine string with optional variable interpolation.
   * @param {string} key
   * @param {object} [params]
   * @param {string} [forcedLang]
   * @returns {string}
   */
  function uiText(key, params = {}, forcedLang = null) {
    const lang = forcedLang || getCurrentLanguage();
    const bundle = ENGINE_I18N[lang] || ENGINE_I18N.uk;
    let str = bundle[key] || ENGINE_I18N.uk[key] || key;
    if (params) {
      Object.keys(params).forEach(pKey => {
        str = str.replace(new RegExp(`\\{${pKey}\\}`, 'g'), params[pKey]);
      });
    }
    return str;
  }

  /**
   * Escape HTML special characters for safe insertion into HTML strings.
   * @param {string} str
   * @returns {string}
   */
  function escapeHtml(str) {
    if (str == null) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /**
   * Escape string for safe inclusion in HTML attributes.
   * @param {string} str
   * @returns {string}
   */
  function escapeAttr(str) {
    return escapeHtml(str);
  }

  // ═══════════════════════════════════════════════════════════════════════
  // 2. XP & PROGRESS MANAGEMENT
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * Award XP points to the student profile.
   * Calls app.js awardXP or addXP, or writes directly to ls_xp.
   * @param {number} amount
   * @returns {number}
   */
  function awardXP(amount) {
    const xpToAdd = Number(amount) || 0;
    if (xpToAdd <= 0) return 0;

    if (typeof window !== 'undefined') {
      if (typeof window.awardXP === 'function' && window.awardXP !== awardXP) {
        return window.awardXP(xpToAdd);
      }
      if (typeof window.addXP === 'function') {
        return window.addXP(xpToAdd);
      }
    }

    try {
      const current = parseInt(localStorage.getItem('ls_xp') || '0', 10) + xpToAdd;
      localStorage.setItem('ls_xp', String(current));
      if (typeof document !== 'undefined') {
        document.querySelectorAll('.xp-val-display').forEach(el => {
          el.textContent = String(current);
        });
      }
      return current;
    } catch (e) {
      console.warn('Could not persist XP to localStorage:', e);
      return 0;
    }
  }

  /**
   * Get list of completed lesson IDs.
   * @returns {string[]}
   */
  function getCompletedLessons() {
    try {
      const raw = localStorage.getItem('ls_completed_lessons');
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
      if (typeof parsed === 'object' && parsed !== null) return Object.keys(parsed);
      return [];
    } catch (e) {
      return [];
    }
  }

  /**
   * Check if a lesson is marked completed.
   * @param {string} lessonId
   * @returns {boolean}
   */
  function isLessonCompleted(lessonId) {
    if (!lessonId) return false;
    return getCompletedLessons().includes(String(lessonId));
  }

  /**
   * Mark lesson as completed in localStorage.
   * @param {string} lessonId
   */
  function markLessonCompleted(lessonId) {
    if (!lessonId) return;
    try {
      const list = getCompletedLessons();
      if (!list.includes(String(lessonId))) {
        list.push(String(lessonId));
        localStorage.setItem('ls_completed_lessons', JSON.stringify(list));
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('lessonCompleted', { detail: { lessonId } }));
        }
      }
    } catch (e) {
      console.warn('Could not persist lesson completion:', e);
    }
  }

  // ═══════════════════════════════════════════════════════════════════════
  // 3. BLOCK RENDERERS
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * Renders Dialogue block: scene story intro, character lines, image, audio triggers.
   * @param {object} section
   * @param {string} lang
   * @returns {string}
   */
  function renderDialogueBlock(section, lang) {
    const title = t(section.title, 'Діалог', lang);
    const story = section.story ? `<p class="story-text">${t(section.story, '', lang)}</p>` : '';

    const lines = (section.lines || []).map((line, idx) => {
      const speakerName = escapeHtml(line.speaker || `Speaker ${idx + 1}`);
      const avatarLetter = escapeHtml(line.avatar || line.speaker?.charAt(0) || '💬');
      const avatarClass = (line.avatar === 'S' || line.speaker === 'Sofia')
        ? 'av-student'
        : 'av-marco';

      const audioBtn = line.audio !== false ? `
        <button class="audio-btn" type="button" aria-label="${escapeAttr(uiText('listen', {}, lang))}" data-speak-text="${escapeAttr(line.it || '')}">
          <svg class="ls-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 9v6h4l5 4V5L8 9z"/>
            <path d="M16.5 9a4 4 0 0 1 0 6M19 6.5a7.5 7.5 0 0 1 0 11"/>
          </svg>
        </button>
      ` : '';

      const phoneticHtml = line.phonetic ? `<div class="dialogue-phon">${escapeHtml(line.phonetic)}</div>` : '';
      const translationHtml = `<div class="dialogue-ua">${t(line.translations, '', lang)}</div>`;

      return `
        <div class="dialogue-line">
          <div class="dialogue-avatar ${avatarClass}">${avatarLetter}</div>
          <div>
            <div class="dialogue-name">${speakerName}</div>
            <div class="dialogue-it">
              ${escapeHtml(line.it || '')}
              ${audioBtn}
            </div>
            ${phoneticHtml}
            ${translationHtml}
          </div>
        </div>
      `;
    }).join('');

    const imageHtml = section.image ? `
      <div class="scene-img-wrapper">
        <img src="${escapeAttr(section.image)}" alt="${escapeAttr(t(section.imageAlt, title, lang))}" class="scene-img" loading="lazy" />
      </div>
    ` : '';

    return `
      <section class="lesson-section lesson-section-dialogue" data-section-type="dialogue">
        <h2 class="section-title"><span class="ic">💬</span>${escapeHtml(title)}</h2>
        <div class="card">
          <div class="dialogue-layout">
            <div class="dialogue-copy dialogue-content">
              ${story}
              ${lines}
            </div>
            ${imageHtml}
          </div>
        </div>
      </section>
    `;
  }

  /**
   * Helper that replaces words in reading story with interactive hint tooltips.
   * @param {string} text
   * @param {object[]} vocabHints
   * @param {string} lang
   * @returns {string}
   */
  function enrichStoryWithVocabHints(text, vocabHints, lang) {
    if (!text || !vocabHints || !vocabHints.length) return escapeHtml(text || '');

    // Sort hints by length descending so multi-word hints match first
    const sorted = [...vocabHints].sort((a, b) => (b.word?.length || 0) - (a.word?.length || 0));

    // Tokenize text while escaping non-hint portions
    let result = text;
    sorted.forEach((hint, hIndex) => {
      if (!hint.word) return;
      const cleanWord = hint.word.trim();
      const escapedWordRegex = cleanWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const hintTrans = t(hint.translations, '', lang);
      const regex = new RegExp(`(^|\\b|«|")(${escapedWordRegex})([.,!?;:»"]|\\b|$)`, 'gi');

      result = result.replace(regex, (match, prefix, matchedWord, suffix) => {
        const replacement = `${prefix}__HINT_${hIndex}_${encodeURIComponent(matchedWord)}__${suffix}`;
        return replacement;
      });
    });

    // Escape raw HTML characters in the whole string
    result = escapeHtml(result);

    // Expand hint placeholders into interactive HTML
    sorted.forEach((hint, hIndex) => {
      const hintTrans = escapeHtml(t(hint.translations, '', lang));
      const placeholderRegex = new RegExp(`__HINT_${hIndex}_([^\\s_]+)__`, 'g');

      result = result.replace(placeholderRegex, (match, encodedWord) => {
        const wordText = decodeURIComponent(encodedWord);
        return `<span class="vocab-hint-term" tabindex="0" role="button" data-hint-word="${escapeAttr(hint.word)}" data-hint-trans="${escapeAttr(hintTrans)}" aria-label="${escapeAttr(hint.word)}: ${escapeAttr(hintTrans)}"><span class="vocab-hint-text">${wordText}</span><span class="vocab-hint-bubble">${hintTrans}</span></span>`;
      });
    });

    return result;
  }

  /**
   * Renders Story Text (Reading) block: paragraphs, interactive clickable word hints, translation toggles.
   * @param {object} section
   * @param {string} lang
   * @returns {string}
   */
  function renderStoryTextBlock(section, lang) {
    const title = t(section.title, 'Історія для читання', lang);
    const vocabHints = section.vocabHints || [];

    const paragraphsHtml = (section.paragraphs || []).map((p, idx) => {
      const enrichedItalian = enrichStoryWithVocabHints(p.it || '', vocabHints, lang);
      const trans = t(p.translations, '', lang);

      return `
        <div class="story-paragraph-item" data-paragraph-index="${idx}">
          <div class="story-paragraph-row">
            <p class="story-text story-it">${enrichedItalian}</p>
            ${trans ? `
              <button type="button" class="story-trans-toggle" aria-expanded="false" title="${escapeAttr(uiText('showTranslation', {}, lang))}" aria-label="${escapeAttr(uiText('showTranslation', {}, lang))}">
                🌐
              </button>
            ` : ''}
          </div>
          ${trans ? `<div class="story-trans" style="display: none;">${escapeHtml(trans)}</div>` : ''}
        </div>
      `;
    }).join('');

    // Vocab Hints chips bar
    let hintsBarHtml = '';
    if (vocabHints.length > 0) {
      const chipsHtml = vocabHints.map(hint => {
        const trans = escapeHtml(t(hint.translations, '', lang));
        return `
          <button type="button" class="vocab-hint-chip" data-hint-chip="${escapeAttr(hint.word)}" data-hint-trans="${escapeAttr(trans)}">
            <b>${escapeHtml(hint.word)}</b>
            <span>— ${trans}</span>
          </button>
        `;
      }).join('');

      hintsBarHtml = `
        <div class="vocab-hints-box">
          <div class="vocab-hints-header">
            <span class="ic">💡</span>
            <b>${escapeHtml(uiText('hintsTitle', {}, lang))}</b>
            <span class="vocab-hints-subtitle">${escapeHtml(uiText('tapForHint', {}, lang))}</span>
          </div>
          <div class="vocab-hints-chips">
            ${chipsHtml}
          </div>
        </div>
      `;
    }

    const imageHtml = section.image ? `
      <div class="scene-img-wrapper" style="margin-bottom: 1.5rem;">
        <img src="${escapeAttr(section.image)}" alt="${escapeAttr(t(section.imageAlt, title, lang))}" class="scene-img" loading="lazy" />
      </div>
    ` : '';

    return `
      <section class="lesson-section lesson-section-story" data-section-type="story_text">
        <h2 class="section-title"><span class="ic">📖</span>${escapeHtml(title)}</h2>
        <div class="card story-card">
          ${imageHtml}
          <div class="story-body">
            ${paragraphsHtml}
          </div>
          ${hintsBarHtml}
        </div>
      </section>
    `;
  }

  /**
   * Renders Vocabulary block: structured word table, audio triggers, and pedagogical notes.
   * @param {object} section
   * @param {string} lang
   * @returns {string}
   */
  function renderVocabBlock(section, lang) {
    const title = t(section.title, 'Нові слова', lang);
    const items = section.items || [];

    const rowsHtml = items.map(item => {
      const it = escapeHtml(item.it || '');
      const trans = escapeHtml(t(item.translations, '', lang));
      const phon = escapeHtml(item.transcription || '');

      return `
        <tr>
          <td>
            <div class="vocab-word-cell">
              <b>${it}</b>
              <button class="audio-btn" type="button" aria-label="${escapeAttr(uiText('listen', {}, lang))}" data-speak-text="${escapeAttr(item.it || '')}">
                <svg class="ls-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M4 9v6h4l5 4V5L8 9z"/>
                  <path d="M16.5 9a4 4 0 0 1 0 6M19 6.5a7.5 7.5 0 0 1 0 11"/>
                </svg>
              </button>
            </div>
          </td>
          <td>${trans}</td>
          <td>${phon}</td>
        </tr>
      `;
    }).join('');

    const notesHtml = (section.notes || []).map(note => {
      const isAccent = note.type === 'accent';
      const noteTitle = escapeHtml(t(note.title, 'Нотатка', lang));
      const noteText = t(note.text, '', lang);
      return `
        <div class="note ${isAccent ? 'accent' : ''}">
          <b>${noteTitle}:</b> <span>${noteText}</span>
        </div>
      `;
    }).join('');

    return `
      <section class="lesson-section lesson-section-vocab" data-section-type="vocab">
        <h2 class="section-title"><span class="ic">🔤</span>${escapeHtml(title)}</h2>
        <div class="card">
          <div class="table-responsive">
            <table class="vocab-table">
              <thead>
                <tr>
                  <th>${escapeHtml(uiText('word', {}, lang))}</th>
                  <th>${escapeHtml(uiText('translation', {}, lang))}</th>
                  <th>${escapeHtml(uiText('pronunciation', {}, lang))}</th>
                </tr>
              </thead>
              <tbody>
                ${rowsHtml}
              </tbody>
            </table>
          </div>
          ${notesHtml}
        </div>
      </section>
    `;
  }

  /**
   * Renders Grammar block: explanation and conjugation / rule table.
   * @param {object} section
   * @param {string} lang
   * @returns {string}
   */
  function renderGrammarBlock(section, lang) {
    const title = t(section.title, 'Граматичне правило', lang);
    const explanation = t(section.explanation, '', lang);

    let tableHtml = '';
    if (section.table) {
      const rawHeaders = (section.table.headers && (section.table.headers[lang] || section.table.headers.uk || section.table.headers.en)) || [
        uiText('pronoun', {}, lang),
        uiText('form', {}, lang),
        uiText('example', {}, lang),
        uiText('translation', {}, lang)
      ];

      const ths = rawHeaders.map(h => `<th>${escapeHtml(h)}</th>`).join('');
      const rows = (section.table.rows || []).map(r => {
        const pronounCell = r.pronoun != null ? `<td><b>${escapeHtml(r.pronoun)}</b></td>` : '';
        const formCell = r.form != null ? `<td><span class="grammar-highlight">${escapeHtml(r.form)}</span></td>` : '';
        const exampleCell = r.example != null ? `<td><i>${escapeHtml(r.example)}</i></td>` : '';
        const translationCell = `<td>${escapeHtml(t(r.translations, '', lang))}</td>`;
        return `<tr>${pronounCell}${formCell}${exampleCell}${translationCell}</tr>`;
      }).join('');

      tableHtml = `
        <div class="table-responsive" style="margin-top: 1rem;">
          <table class="vocab-table grammar-table">
            <thead>
              <tr>${ths}</tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
        </div>
      `;
    }

    return `
      <section class="lesson-section lesson-section-grammar" data-section-type="grammar_rule">
        <h2 class="section-title"><span class="ic">📐</span>${escapeHtml(title)}</h2>
        <div class="card grammar-card">
          ${explanation ? `<div class="grammar-explanation">${explanation}</div>` : ''}
          ${tableHtml}
        </div>
      </section>
    `;
  }

  /**
   * Renders Culture Note block: rich Italian cultural insights and customs.
   * @param {object} section
   * @param {string} lang
   * @returns {string}
   */
  function renderCultureBlock(section, lang) {
    const title = t(section.title, 'Маленька культурна нотатка', lang);

    let paragraphsHtml = '';
    if (Array.isArray(section.paragraphs)) {
      paragraphsHtml = section.paragraphs.map(p => `
        <p class="story-text">${t(p, '', lang)}</p>
      `).join('');
    } else if (section.text) {
      paragraphsHtml = `<p class="story-text">${t(section.text, '', lang)}</p>`;
    }

    return `
      <section class="lesson-section lesson-section-culture" data-section-type="culture_note">
        <h2 class="section-title"><span class="ic">🇮🇹</span>${escapeHtml(title)}</h2>
        <div class="culture-card">
          ${paragraphsHtml}
        </div>
      </section>
    `;
  }

  /**
   * Renders Takeaways block: bullet points of essential lesson concepts.
   * @param {object} section
   * @param {string} lang
   * @returns {string}
   */
  function renderTakeawaysBlock(section, lang) {
    const title = t(section.title, 'Що варто запам’ятати', lang);

    const itemsHtml = (section.items || []).map(item => `
      <li>
        <span class="ic">✔</span>
        <span>${t(item, '', lang)}</span>
      </li>
    `).join('');

    return `
      <section class="lesson-section lesson-section-takeaways" data-section-type="takeaways">
        <h2 class="section-title">
          <span class="ic">
            <svg class="ls-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 3.5l2.6 5.3 5.9.8-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.8z"/>
            </svg>
          </span>
          ${escapeHtml(title)}
        </h2>
        <div class="card">
          <ul class="takeaways">
            ${itemsHtml}
          </ul>
        </div>
      </section>
    `;
  }

  function normalizeQuizTask(task, index = 0) {
    const kind = task?.kind || task?.type || 'choice';
    const normalizedType = kind === 'truefalse' || kind === 'true_false' ? 'true_false'
      : kind === 'text' || kind === 'blank' || kind === 'fill_blank' ? 'fill_blank'
      : kind === 'choice' || kind === 'mcq' ? 'choice'
      : String(kind);

    if (normalizedType === 'choice') {
      const options = (task?.options || []).map((option, optionIndex) => {
        const optionText = typeof option?.text === 'object' ? t(option.text, '', getCurrentLanguage()) : (option?.text || option?.label || '');
        return {
          text: optionText,
          translations: option?.translations || option?.text || { uk: optionText, en: optionText },
          correct: Boolean(option?.correct)
        };
      });
      const correctIndex = Math.max(0, options.findIndex((option) => Boolean(option.correct)));
      return {
        id: task?.id || `q-${index}`,
        type: 'choice',
        question: task?.q || task?.question || '',
        options,
        correctIndex: correctIndex >= 0 ? correctIndex : 0,
        category: task?.category || ''
      };
    }

    if (normalizedType === 'true_false') {
      return {
        id: task?.id || `q-${index}`,
        type: 'true_false',
        statement: task?.q || task?.statement || '',
        correctAnswer: Boolean(task?.answer ?? task?.correctAnswer ?? false),
        category: task?.category || ''
      };
    }

    return {
      id: task?.id || `q-${index}`,
      type: 'fill_blank',
      placeholder: task?.prompt || task?.placeholder || uiText('enterWord', {}, getCurrentLanguage()),
      acceptableAnswers: Array.isArray(task?.answers) ? task.answers : [task?.answer || task?.correctAnswer || ''],
      prefix: task?.prefix || '',
      suffix: task?.suffix || '',
      category: task?.category || ''
    };
  }

  /**
   * Renders Quiz block: multiple choice, true/false, fill-in-the-blank questions.
   * @param {object} section
   * @param {string} lang
   * @returns {string}
   */
  function renderQuizBlock(section, lang) {
    const title = t(section.title, 'Завдання уроку', lang);
    const tasks = (section.tasks || section.items || []).map((task, index) => normalizeQuizTask(task, index));

    let currentCategoryKey = '';
    let taskNumber = 1;

    const tasksHtml = tasks.map((task, tIndex) => {
      let categoryHeader = '';
      const catText = task.category ? t(task.category, '', lang) : '';
      if (catText && catText !== currentCategoryKey) {
        currentCategoryKey = catText;
        categoryHeader = `<h3 class="task-cat">${escapeHtml(catText)}</h3>`;
      }

      const qNum = taskNumber++;
      let taskBody = '';

      if (task.type === 'choice') {
        const questionText = t(task.question, '', lang);
        const optionsHtml = (task.options || []).map((opt, optIdx) => {
          const optLabel = opt.translations ? t(opt.translations, '', lang) : (opt.text || '');
          return `
            <label>
              <input type="radio" name="quiz_${task.id}" value="${optIdx}">
              <span>${escapeHtml(optLabel)}</span>
            </label>
          `;
        }).join('');

        taskBody = `
          <div class="task" data-task-id="${escapeAttr(task.id)}" data-task-type="choice">
            <b>${qNum}.</b> <span>${escapeHtml(questionText)}</span>
            <div class="options">
              ${optionsHtml}
            </div>
          </div>
        `;
      } else if (task.type === 'true_false') {
        const statementText = t(task.statement, '', lang);
        taskBody = `
          <div class="task tf-row" data-task-id="${escapeAttr(task.id)}" data-task-type="true_false">
            <span><b>${qNum}.</b> <span>${escapeHtml(statementText)}</span></span>
            <div class="options">
              <label>
                <input type="radio" name="quiz_${task.id}" value="true">
                <span>${escapeHtml(uiText('true', {}, lang))}</span>
              </label>
              <label>
                <input type="radio" name="quiz_${task.id}" value="false">
                <span>${escapeHtml(uiText('false', {}, lang))}</span>
              </label>
            </div>
          </div>
        `;
      } else if (task.type === 'fill_blank') {
        const placeholder = t(task.placeholder, uiText('enterWord', {}, lang), lang);
        taskBody = `
          <div class="task" data-task-id="${escapeAttr(task.id)}" data-task-type="fill_blank">
            <b>${qNum}.</b>
            ${task.prefix ? `<span>${escapeHtml(task.prefix)}</span> ` : ''}
            <input type="text" class="quiz-blank-input" placeholder="${escapeAttr(placeholder)}" data-task-id="${escapeAttr(task.id)}" autocomplete="off" autocapitalize="off" spellcheck="false" />
            ${task.suffix ? ` <span>${escapeHtml(task.suffix)}</span>` : ''}
          </div>
        `;
      }

      return categoryHeader + taskBody;
    }).join('');

    return `
      <section class="lesson-section lesson-section-quiz" id="exercises" data-section-type="quiz">
        <h2 class="section-title">
          <span class="ic">
            <svg class="ls-icon" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="11" fill="var(--it-red, #cd212a)"/>
              <path d="M6 8l1.3 1.3L9.5 7" stroke="#fff" stroke-width="1.7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
              <line x1="11" y1="8" x2="17.2" y2="8" stroke="#fff" stroke-width="1.7" stroke-linecap="round"/>
              <path d="M6 12.3l1.3 1.3 2.2-2.3" stroke="#fff" stroke-width="1.7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
              <line x1="11" y1="12.3" x2="17.2" y2="12.3" stroke="#fff" stroke-width="1.7" stroke-linecap="round"/>
            </svg>
          </span>
          ${escapeHtml(title)}
        </h2>
        <div class="card quiz-card">
          ${tasksHtml}
          <div class="quiz-actions" style="margin-top: 1.5rem;">
            <button class="btn-primary quiz-check-btn" type="button" data-quiz-action="check">
              ${escapeHtml(uiText('checkTasks', {}, lang))}
            </button>
          </div>
          <div id="taskResult" class="task-result" role="status" aria-live="polite" style="display: none;"></div>
        </div>
      </section>
    `;
  }

  // ═══════════════════════════════════════════════════════════════════════
  // 4. BLOCK RENDERERS MAP
  // ═══════════════════════════════════════════════════════════════════════

  const BLOCK_RENDERERS = {
    dialogue: renderDialogueBlock,
    story_text: renderStoryTextBlock,
    vocab: renderVocabBlock,
    grammar_rule: renderGrammarBlock,
    culture: renderCultureBlock,
    culture_note: renderCultureBlock,
    takeaways: renderTakeawaysBlock,
    tasks: renderQuizBlock,
    quiz: renderQuizBlock
  };

  // ═══════════════════════════════════════════════════════════════════════
  // 5. QUIZ GRADING & XP AWARD LOGIC
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * Helper that displays correct / incorrect badge with correct answer hint.
   * @param {HTMLElement} taskEl
   * @param {boolean} isCorrect
   * @param {string} correctAnswerText
   * @param {string} lang
   */
  function showTaskFeedback(taskEl, isCorrect, correctAnswerText, lang) {
    taskEl.classList.remove('task-correct', 'task-incorrect');
    taskEl.classList.add(isCorrect ? 'task-correct' : 'task-incorrect');

    taskEl.querySelector('.task-feedback')?.remove();
    const feedback = document.createElement('div');
    feedback.className = 'task-feedback';

    if (isCorrect) {
      feedback.textContent = uiText('correct', {}, lang);
    } else {
      feedback.textContent = `${uiText('correctAnswer', {}, lang)} ${correctAnswerText}`;
    }
    taskEl.appendChild(feedback);
  }

  /**
   * Evaluates student answers, highlights correctness, calculates percentage,
   * awards XP on passing (>70%), and marks lesson completed in localStorage.
   * @param {object} lesson
   * @param {HTMLElement} [container]
   * @returns {object} { total, correct, percentage, passed }
   */
  function gradeQuiz(lesson, container = document) {
    const lang = getCurrentLanguage();
    const quizSection = (lesson.sections || []).find(s => s.type === 'quiz');
    if (!quizSection || !quizSection.tasks || !quizSection.tasks.length) return null;

    const tasks = (quizSection.tasks || []).map((task, index) => normalizeQuizTask(task, index));
    const taskRoot = container.querySelector('#exercises .quiz-card') || container.querySelector('.quiz-card') || container;
    const resultBox = taskRoot.querySelector('#taskResult') || container.querySelector('#taskResult');

    // 1. Check if all tasks were answered
    let unansweredFound = false;

    tasks.forEach(task => {
      const taskEl = taskRoot.querySelector(`[data-task-id="${task.id}"]`);
      if (!taskEl) return;

      if (task.type === 'choice' || task.type === 'true_false') {
        const checked = taskEl.querySelector(`input[name="quiz_${task.id}"]:checked`);
        if (!checked) unansweredFound = true;
      } else if (task.type === 'fill_blank') {
        const input = taskEl.querySelector(`input.quiz-blank-input[data-task-id="${task.id}"]`);
        if (!input || !input.value.trim()) unansweredFound = true;
      }
    });

    if (unansweredFound) {
      if (resultBox) {
        resultBox.style.display = 'block';
        resultBox.className = 'task-result task-result-warning';
        resultBox.textContent = uiText('checkAllPrompt', {}, lang);
        resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      return { total: tasks.length, correct: 0, percentage: 0, passed: false };
    }

    // 2. Grade each task
    let correctCount = 0;

    tasks.forEach(task => {
      const taskEl = taskRoot.querySelector(`[data-task-id="${task.id}"]`);
      if (!taskEl) return;

      let isCorrect = false;
      let expectedAnswerLabel = '';

      if (task.type === 'choice') {
        const checked = taskEl.querySelector(`input[name="quiz_${task.id}"]:checked`);
        const chosenIndex = checked ? parseInt(checked.value, 10) : -1;
        isCorrect = chosenIndex === task.correctIndex;

        const correctOption = task.options[task.correctIndex];
        if (correctOption) {
          expectedAnswerLabel = correctOption.translations ? t(correctOption.translations, '', lang) : (correctOption.text || '');
        }
      } else if (task.type === 'true_false') {
        const checked = taskEl.querySelector(`input[name="quiz_${task.id}"]:checked`);
        const chosenBool = checked ? checked.value === 'true' : null;
        isCorrect = chosenBool === !!task.correctAnswer;
        expectedAnswerLabel = task.correctAnswer ? uiText('true', {}, lang) : uiText('false', {}, lang);
      } else if (task.type === 'fill_blank') {
        const input = taskEl.querySelector(`input.quiz-blank-input[data-task-id="${task.id}"]`);
        const rawVal = input ? input.value.trim() : '';
        const normalized = rawVal.toLowerCase().replace(/\s+/g, ' ');

        const acceptable = (task.acceptableAnswers || []).map(a => String(a).trim().toLowerCase().replace(/\s+/g, ' '));
        isCorrect = acceptable.includes(normalized);
        expectedAnswerLabel = (task.acceptableAnswers && task.acceptableAnswers[0]) || '';
      }

      if (isCorrect) correctCount++;
      showTaskFeedback(taskEl, isCorrect, expectedAnswerLabel, lang);
    });

    // 3. Compute score and award XP
    const total = tasks.length;
    const percentage = total > 0 ? Math.round((correctCount / total) * 100) : 0;
    const isPassed = percentage >= 70;

    if (resultBox) {
      resultBox.style.display = 'block';

      if (isPassed) {
        const alreadyCompleted = isLessonCompleted(lesson.id);
        markLessonCompleted(lesson.id);

        let xpMsg = '';
        if (!alreadyCompleted) {
          const reward = Number(lesson.xpReward) || 50;
          awardXP(reward);
          xpMsg = ` ${uiText('xpAwarded', { xp: reward }, lang)}`;
        } else {
          xpMsg = ` ${uiText('alreadyCompleted', {}, lang)}`;
        }

        resultBox.className = 'task-result task-result-success';
        resultBox.innerHTML = `
          <strong>${escapeHtml(uiText('scorePassed', {}, lang))}</strong><br>
          ${escapeHtml(uiText('accuracy', { correct: correctCount, total, percent: percentage }, lang))}.${escapeHtml(xpMsg)}
        `;
      } else {
        resultBox.className = 'task-result task-result-info';
        resultBox.innerHTML = `
          <strong>${escapeHtml(uiText('scoreRetry', {}, lang))}</strong><br>
          ${escapeHtml(uiText('accuracy', { correct: correctCount, total, percent: percentage }, lang))}.
        `;
      }

      resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    return { total, correct: correctCount, percentage, passed: isPassed };
  }

  // ═══════════════════════════════════════════════════════════════════════
  // 6. MAIN ENGINE RENDERING & ACTIVE STATE
  // ═══════════════════════════════════════════════════════════════════════

  let _activeLesson = null;
  let _activeContainer = null;

  /**
   * Render a complete lesson into a container element.
   * @param {string|object} lessonOrId
   * @param {HTMLElement|string} [targetContainer]
   * @returns {boolean}
   */
  function renderLesson(lessonOrId, targetContainer) {
    let lesson = lessonOrId;
    if (typeof lessonOrId === 'string') {
      if (typeof window !== 'undefined' && window.LS_LESSONS) {
        lesson = window.LS_LESSONS[lessonOrId];
      }
    }

    if (!lesson) {
      console.warn('LessonEngine: Lesson not found for input:', lessonOrId);
      return false;
    }

    let container = targetContainer;
    if (typeof container === 'string') {
      container = document.querySelector(container);
    }
    if (!container && typeof document !== 'undefined') {
      container = document.getElementById('lessonBody') || document.querySelector('.lesson-content') || document.querySelector('main');
    }

    if (!container) {
      console.warn('LessonEngine: Target container could not be found.');
      return false;
    }

    _activeLesson = lesson;
    _activeContainer = container;

    const lang = getCurrentLanguage();
    const sections = lesson.sections || [];

    const blocksHtml = sections.map(section => {
      const renderer = BLOCK_RENDERERS[section.type];
      if (typeof renderer === 'function') {
        return renderer(section, lang);
      }
      console.warn(`LessonEngine: No renderer registered for section type "${section.type}"`);
      return '';
    }).join('\n');

    container.innerHTML = blocksHtml;

    // Attach event listeners for audio buttons, vocab hints, and quiz checking
    bindLessonInteractions(container, lesson);

    return true;
  }

  /**
   * Re-renders the current lesson (preserving input values if possible)
   * whenever the interface language changes.
   */
  function rerenderCurrentLesson() {
    if (!_activeLesson || !_activeContainer) return;

    // Save existing form state before re-render
    const savedState = {
      radios: {},
      inputs: {}
    };

    try {
      _activeContainer.querySelectorAll('input[type="radio"]:checked').forEach(r => {
        savedState.radios[r.name] = r.value;
      });
      _activeContainer.querySelectorAll('input.quiz-blank-input').forEach(i => {
        if (i.dataset.taskId) {
          savedState.inputs[i.dataset.taskId] = i.value;
        }
      });
    } catch (e) {
      // Ignore preservation errors
    }

    renderLesson(_activeLesson, _activeContainer);

    // Restore answers
    try {
      Object.keys(savedState.radios).forEach(name => {
        const val = savedState.radios[name];
        const el = _activeContainer.querySelector(`input[name="${name}"][value="${val}"]`);
        if (el) el.checked = true;
      });
      Object.keys(savedState.inputs).forEach(taskId => {
        const val = savedState.inputs[taskId];
        const el = _activeContainer.querySelector(`input.quiz-blank-input[data-task-id="${taskId}"]`);
        if (el) el.value = val;
      });
    } catch (e) {
      // Ignore restoration errors
    }
  }

  /**
   * Bind event listeners inside lesson DOM (audio, hints, quiz button, translation toggles).
   * @param {HTMLElement} container
   * @param {object} lesson
   */
  function bindLessonInteractions(container, lesson) {
    if (!container) return;

    // 1. Audio playback buttons
    container.querySelectorAll('.audio-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const textToSpeak = btn.getAttribute('data-speak-text') || '';
        if (typeof window !== 'undefined' && typeof window.speak === 'function') {
          window.speak(textToSpeak, btn);
        } else {
          btn.classList.add('audio-playing');
          setTimeout(() => btn.classList.remove('audio-playing'), 500);
        }
      });
    });

    // 2. Vocab hint chips click: scrolls to / highlights matching word in reading story
    container.querySelectorAll('.vocab-hint-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const word = chip.getAttribute('data-hint-chip');
        if (!word) return;
        const matchingTerms = container.querySelectorAll(`.vocab-hint-term[data-hint-word="${word}"]`);
        if (matchingTerms.length > 0) {
          const firstTerm = matchingTerms[0];
          firstTerm.scrollIntoView({ behavior: 'smooth', block: 'center' });
          firstTerm.classList.add('active');
          firstTerm.focus();
          setTimeout(() => firstTerm.classList.remove('active'), 2000);
        }
      });
    });

    // 3. Vocab hint terms click: toggles tooltip bubble for touch devices
    container.querySelectorAll('.vocab-hint-term').forEach(term => {
      term.addEventListener('click', (e) => {
        term.classList.toggle('active');
      });
    });

    // 4. Story translation toggles
    container.querySelectorAll('.story-trans-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const row = btn.closest('.story-paragraph-item');
        if (!row) return;
        const transBox = row.querySelector('.story-trans');
        if (!transBox) return;

        const isHidden = transBox.style.display === 'none' || getComputedStyle(transBox).display === 'none';
        transBox.style.display = isHidden ? 'block' : 'none';
        btn.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
      });
    });

    // 5. Quiz Check Button
    const checkBtn = container.querySelector('.quiz-check-btn[data-quiz-action="check"]');
    if (checkBtn) {
      checkBtn.addEventListener('click', () => {
        gradeQuiz(lesson, container);
      });
    }
  }

  // ═══════════════════════════════════════════════════════════════════════
  // 7. LISTEN FOR REACTIVE LANGUAGE SWITCHES
  // ═══════════════════════════════════════════════════════════════════════

  if (typeof window !== 'undefined') {
    window.addEventListener('sourceLanguageChanged', () => {
      rerenderCurrentLesson();
    });

    // Fallback storage event listener for cross-tab or direct localStorage updates
    window.addEventListener('storage', (e) => {
      if (e.key === 'ls_italian_source_language') {
        rerenderCurrentLesson();
      }
    });
  }

  // ═══════════════════════════════════════════════════════════════════════
  // 8. PUBLIC API EXPORT
  // ═══════════════════════════════════════════════════════════════════════

  const LessonEngine = {
    renderLesson,
    rerenderCurrentLesson,
    getCurrentLesson: () => _activeLesson,
    getActiveContainer: () => _activeContainer,
    BLOCK_RENDERERS,
    t,
    uiText,
    gradeQuiz,
    awardXP,
    isLessonCompleted,
    markLessonCompleted,
    getCompletedLessons,
    getCurrentLanguage,
    /**
     * Extend engine with custom block types
     */
    registerBlockRenderer: (type, rendererFn) => {
      BLOCK_RENDERERS[type] = rendererFn;
    }
  };

  if (typeof window !== 'undefined') {
    window.LessonEngine = LessonEngine;
    // Export aliases for backward compatibility and direct convenience
    if (!window.awardXP) window.awardXP = awardXP;
    if (!window.markLessonCompleted) window.markLessonCompleted = markLessonCompleted;
    if (!window.isLessonCompleted) window.isLessonCompleted = isLessonCompleted;
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = LessonEngine;
  }
})();
