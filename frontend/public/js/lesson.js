(function () {
  let allowDevUnlock = false;
  async function checkDevEndpoints() {
    try {
      const res = await fetch('/api/payments/config');
      if (res.ok) {
        const data = await res.json();
        allowDevUnlock = Boolean(data.allowDevEndpoints);
      }
    } catch (e) {
      allowDevUnlock = false;
    }
  }

  'use strict';

  function getCurrentCourseId() {
    if (typeof window.getCourseId === 'function') return window.getCourseId();
    const params = new URLSearchParams(window.location.search);
    const queryCourse = params.get('course');
    if (queryCourse) return queryCourse;
    const savedCourse = localStorage.getItem('ls_course') || localStorage.getItem('ls_target_course') || 'it';
    return savedCourse || 'it';
  }

  function getCurrentLessonId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('lesson') || params.get('id') || window.location.hash.replace(/^#/, '') || '';
  }

  function readText(value, fallback = '', lang = typeof window.getSourceLanguage === 'function' ? window.getSourceLanguage() : 'uk') {
    if (!value) return fallback;
    if (typeof value === 'string') return value;
    if (typeof value === 'object') {
      if (typeof value[lang] !== 'undefined') return value[lang];
      if (typeof value.uk !== 'undefined') return value.uk;
      if (typeof value.en !== 'undefined') return value.en;
      const first = Object.values(value).find((item) => typeof item === 'string');
      return first || fallback;
    }
    return String(value);
  }

  function getLessonNumberLabel(lesson, lang) {
    const rawNumber = lesson.lessonNum ?? lesson.num;
    const localizedNumber = rawNumber && typeof rawNumber === 'object'
      ? readText(rawNumber, '', lang)
      : '';
    if (localizedNumber) return localizedNumber;

    const prefix = lang === 'en' ? 'Lesson' : 'Урок';
    const number = String(rawNumber || lesson.id || '').match(/(\d+)$/)?.[1];
    return `${prefix} ${number || rawNumber || lesson.id || ''}`;
  }

  function getLessonList(course) {
    return course && Array.isArray(course.paths)
      ? course.paths.flatMap((path) => (path.units || []).flatMap((unit) => (unit.lessons || []).map((lesson) => ({
        ...lesson,
        pathId: path.id,
        pathTitle: path.title,
        unitId: unit.id,
        unitTitle: unit.title,
        status: lesson.status || 'locked'
      }))))
      : [];
  }

  function normalizeLocalized(value, fallback = '') {
    if (!value) return { uk: fallback, en: fallback };
    if (typeof value === 'string') return { uk: value, en: value };
    if (typeof value === 'object') {
      return {
        uk: value.uk || value.en || fallback,
        en: value.en || value.uk || fallback
      };
    }
    return { uk: String(value), en: String(value) };
  }

  function normalizeVocabularyKey(value) {
    return String(value || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();
  }

  function getVocabularyTerm(item, courseId) {
    if (typeof item === 'string') return item.trim();
    if (!item || typeof item !== 'object') return '';
    const value = item.text || item[courseId] || item.word || item.term || item.it || item.es;
    return typeof value === 'string' ? value.trim() : '';
  }

  function normalizeSection(block, vocabMap, lessonId, courseId, missingVocabulary) {
    if (!block || !block.type) return null;

    if (block.type === 'dialogue') {
      return {
        type: 'dialogue',
        title: block.title || { uk: 'Діалог', en: 'Dialogue' },
        story: block.story || { uk: '', en: '' },
        image: block.image || '',
        imageAlt: block.imageAlt || '',
        lines: (block.lines || []).map((line) => ({
          speaker: line.speaker || 'Speaker',
          avatar: line.avatar || (line.speaker || 'U').charAt(0).toUpperCase(),
          it: line.text || line.it || line[courseId] || '',
          pronunciation: readText(line.pronunciation || line.phon || '', ''),
          translations: line.trans || line.translations || {},
          audio: line.audio !== false
        }))
      };
    }

    if (block.type === 'vocab') {
      const items = (block.items || []).map((item) => {
        if (!item) return null;
        const directItem = getVocabularyTerm(item, courseId);
        const word = vocabMap.get(normalizeVocabularyKey(directItem));
        if (!word || !(word.lessons || [word.lesson]).includes(lessonId)) {
          if (directItem) missingVocabulary.push(directItem);
          return null;
        }
        return {
          it: word.text || word.word || word[courseId] || '',
          pronunciation: word.pronunciation || word.phon || '',
          translations: word.trans || { uk: '', en: '' }
        };
      }).filter(Boolean);
      if (!items.length) return null;
      return { type: 'vocab', title: block.title || { uk: 'Нові слова', en: 'Vocabulary' }, items };
    }

    if (block.type === 'culture' || block.type === 'culture_note') {
      return {
        type: 'culture_note',
        title: block.title || { uk: 'Культурна нотатка', en: 'Culture note' },
        paragraphs: (block.paragraphs || []).map((item) => {
          if (typeof item === 'string') return item;
          return item.text || item.uk || item.en || '';
        })
      };
    }

    if (block.type === 'takeaways') {
      return {
        type: 'takeaways',
        title: block.title || { uk: 'Що варто запам’ятати', en: 'Key takeaways' },
        items: (block.items || []).map((item) => {
          if (typeof item === 'string') return item;
          return item.text || item;
        })
      };
    }

    if (block.type === 'tasks' || block.type === 'quiz') {
      const tasks = (block.items || block.tasks || []).map((task) => {
        const kind = task.kind || task.type || 'choice';
        if (kind === 'choice') {
          const options = (task.options || []).map((option) => ({
            text: option.text || option.label || { uk: '', en: '' },
            translations: option.translations || option.text || { uk: '', en: '' },
            correct: Boolean(option.correct)
          }));
          const optionCorrectIndex = options.findIndex((option) => Boolean(option.correct));
          const explicitCorrectIndex = Number.isInteger(task.correctIndex) ? task.correctIndex : -1;
          const correctIndex = explicitCorrectIndex >= 0 && explicitCorrectIndex < options.length
            ? explicitCorrectIndex
            : optionCorrectIndex;
          return {
            id: task.id || 'choice-task',
            type: 'choice',
            question: task.q || task.question || { uk: 'Question', en: 'Question' },
            options,
            correctIndex: correctIndex >= 0 ? correctIndex : 0,
            category: task.category || ''
          };
        }

        if (kind === 'truefalse' || kind === 'true_false') {
          return {
            id: task.id || 'truefalse-task',
            type: 'true_false',
            statement: task.q || task.statement || task.question || { uk: 'Question', en: 'Question' },
            correctAnswer: Boolean(task.correctAnswer ?? task.answer),
            category: task.category || ''
          };
        }

        return {
          id: task.id || 'fillblank-task',
          type: 'fill_blank',
          prefix: task.prefix || '',
          suffix: task.suffix || '',
          placeholder: task.prompt || { uk: 'введіть слово', en: 'enter word' },
          acceptableAnswers: Array.isArray(task.acceptableAnswers)
            ? task.acceptableAnswers
            : Array.isArray(task.answers)
              ? task.answers
              : [task.answer || ''],
          category: task.category || ''
        };
      });

      return { type: 'quiz', title: block.title || { uk: 'Завдання уроку', en: 'Lesson tasks' }, tasks };
    }

    return { ...block };
  }

  function normalizeLesson(rawLesson, course, lessonId, courseLessonMeta, vocabMap, missingVocabulary) {
    const lessonMeta = courseLessonMeta || {};
    const hasNextLessonMetadata = Object.prototype.hasOwnProperty.call(rawLesson || {}, 'nextLessonId')
      || Object.prototype.hasOwnProperty.call(lessonMeta, 'nextLessonId');
    const hasPreviousLessonMetadata = Object.prototype.hasOwnProperty.call(rawLesson || {}, 'prevLessonId')
      || Object.prototype.hasOwnProperty.call(lessonMeta, 'prevLessonId');
    const safeId = rawLesson?.id || lessonId || 'communication-basics-1';
    const courseId = course?.target?.code || course?.id || getCurrentCourseId();
    const sections = (rawLesson?.blocks || rawLesson?.sections || [])
      .map((block) => normalizeSection(block, vocabMap, safeId, courseId, missingVocabulary))
      .filter(Boolean);
    const title = rawLesson?.title || lessonMeta.title || { uk: 'Урок', en: 'Lesson' };
    const subtitle = rawLesson?.subtitle || lessonMeta.subtitle || { uk: '', en: '' };
    const description = rawLesson?.description || lessonMeta.description || rawLesson?.hero?.text || { uk: 'Lesson content', en: 'Lesson content' };
    const unitTitle = lessonMeta.unitTitle || { uk: 'Розділ', en: 'Unit' };

    return {
      id: safeId,
      courseId: course?.id || getCurrentCourseId(),
      pathId: lessonMeta.pathId || rawLesson?.pathId || '',
      unitId: lessonMeta.unitId || rawLesson?.unitId || 'unit-1',
      unitTitle,
      lessonNum: rawLesson?.lessonNum || lessonMeta.num || safeId,
      type: rawLesson?.type || sections[0]?.type || 'dialogue',
      title,
      subtitle,
      description,
      duration: rawLesson?.duration || lessonMeta.time || '~15 min',
      xpReward: rawLesson?.xpReward || lessonMeta.xpReward || 50,
      nextLessonId: hasNextLessonMetadata
        ? (rawLesson?.nextLessonId ?? lessonMeta.nextLessonId ?? null)
        : undefined,
      prevLessonId: hasPreviousLessonMetadata
        ? (rawLesson?.prevLessonId ?? lessonMeta.prevLessonId ?? null)
        : undefined,
      sections
    };
  }

  function renderHero(lesson, lang) {
    const titleEl = document.getElementById('heroTitle');
    const descEl = document.getElementById('heroDescription');
    const labelEl = document.getElementById('heroLabel');
    const unitEl = document.getElementById('crumbUnit');
    const lessonEl = document.getElementById('crumbLesson');
    const metaEl = document.getElementById('heroMeta');

    const titleText = readText(lesson.title, 'Lesson');
    const subtitleText = readText(lesson.subtitle, '');
    const descriptionText = readText(lesson.description, '');
    const lessonNumberLabel = getLessonNumberLabel(lesson, lang);
    const labelText = readText(lesson.hero?.label, `${readText(lesson.unitTitle, 'Unit', lang)} · ${lessonNumberLabel}`, lang);

    if (titleEl) titleEl.textContent = subtitleText ? `${titleText} — ${subtitleText}` : titleText;
    if (descEl) descEl.textContent = descriptionText;
    if (labelEl) labelEl.textContent = labelText;
    if (unitEl) unitEl.textContent = readText(lesson.unitTitle, 'Unit');
    if (lessonEl) lessonEl.textContent = lessonNumberLabel;

    if (metaEl) {
      const badge = lang === 'en' ? 'Lesson' : 'Урок';
      const durationText = typeof lesson.duration === 'object'
        ? (lesson.duration[lang] || lesson.duration.uk || lesson.duration.en || '')
        : lesson.duration;
      const details = [badge, durationText, Number(lesson.xpReward) ? `+${lesson.xpReward} XP` : ''].filter(Boolean);
      metaEl.replaceChildren(...details.map((detail) => {
        const chip = document.createElement('span');
        chip.className = 'lesson-meta-chip';
        chip.textContent = detail;
        return chip;
      }));
    }

    const title = `${titleText}${subtitleText ? ` — ${subtitleText}` : ''}`;
    document.title = `${title} — LanguageStudio`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', descriptionText || title);
  }

  function renderNavigation(lessons, currentLessonId) {
    const currentIndex = lessons.findIndex((item) => item.id === currentLessonId);
    const currentLesson = lessons[currentIndex];
    const hasPreviousMetadata = currentLesson && currentLesson.prevLessonId !== undefined;
    const hasNextMetadata = currentLesson && currentLesson.nextLessonId !== undefined;
    const prev = hasPreviousMetadata
      ? lessons.find((item) => item.id === currentLesson.prevLessonId)
      : lessons[currentIndex - 1];
    const next = hasNextMetadata
      ? lessons.find((item) => item.id === currentLesson.nextLessonId)
      : lessons[currentIndex + 1];
    const lang = typeof window.getSourceLanguage === 'function' ? window.getSourceLanguage() : 'uk';

    const prevText = lang === 'en' ? 'Back' : 'Назад';
    const prevAccessibleText = lang === 'en' ? 'Previous lesson' : 'Попередній урок';
    const nextText = lang === 'en' ? 'Next' : 'Далі';
    const nextAccessibleText = lang === 'en' ? 'Next lesson' : 'Наступний урок';
    const allLessonsText = lang === 'en' ? 'All lessons' : 'Всі уроки';

    const prevLink = document.getElementById('btnPrevLesson');
    const prevBottom = document.getElementById('btnPrevLessonBottom');
    const nextLink = document.getElementById('btnNextLesson');
    const nextBottom = document.getElementById('btnNextLessonBottom');

    const makeHref = (lessonId) => {
      if (!lessonId) return 'path.html';
      const params = new URLSearchParams(window.location.search);
      params.set('lesson', lessonId);
      params.set('course', getCurrentCourseId());
      return `${window.location.pathname}?${params.toString()}`;
    };

    if (prevLink) {
      prevLink.href = prev ? makeHref(prev.id) : 'path.html';
      prevLink.innerHTML = `${getIconSvg('arrow-left')} ${prev ? prevText : (lang === 'en' ? 'Back' : 'Назад')}`;
      const accessibleText = prev ? prevAccessibleText : (lang === 'en' ? 'Back to learning paths' : 'Повернутися до напрямків');
      prevLink.setAttribute('aria-label', accessibleText);
      prevLink.title = accessibleText;
    }
    if (prevBottom) {
      prevBottom.href = prev ? makeHref(prev.id) : 'path.html';
      prevBottom.style.display = prev ? '' : 'none';
      prevBottom.innerHTML = `${getIconSvg('arrow-left')} ${prevAccessibleText}`;
    }
    if (nextLink) {
      nextLink.href = next ? makeHref(next.id) : 'path.html';
      nextLink.innerHTML = `${next ? nextText : (lang === 'en' ? 'All' : 'Усі')} ${getIconSvg('arrow-right')}`;
      const accessibleText = next ? nextAccessibleText : allLessonsText;
      nextLink.setAttribute('aria-label', accessibleText);
      nextLink.title = accessibleText;
    }
    if (nextBottom) {
      nextBottom.href = next ? makeHref(next.id) : 'path.html';
      nextBottom.style.display = next ? '' : 'none';
      nextBottom.innerHTML = `${nextAccessibleText} ${getIconSvg('arrow-right')}`;
    }
  }

  function renderSidebar(course, lesson, lessons, lang) {
    const container = document.getElementById('sbUnitLessons');
    if (!container) return;

    const currentUnit = lesson.unitId || 'unit';
    const unitLessons = lessons.filter((item) => item.unitId === currentUnit);
    const unitTitle = readText(lesson.unitTitle, 'Unit');
    const courseTitle = course?.target?.name ? readText(course.target.name, 'Course') : 'Course';
    const courseLabel = document.getElementById('sbCourseLabel');
    if (courseLabel) courseLabel.textContent = `${courseTitle} · ${unitTitle}`;

    const items = unitLessons.map((item) => {
      const active = item.id === lesson.id;
      const isDone = typeof window.isLessonCompleted === 'function' && window.isLessonCompleted(item.id);
      const isPaid = item.access === 'paid';
      const lessonNumberLabel = getLessonNumberLabel(item, lang);
      const badge = getIconSvg(isPaid && !isDone ? 'lock' : (active ? 'lesson' : (isDone ? 'check' : 'circle')));
      return `
        <a href="${window.location.pathname}?course=${encodeURIComponent(getCurrentCourseId())}&lesson=${encodeURIComponent(item.id)}" class="sb-lesson ${active ? 'active' : ''}" aria-current="${active ? 'page' : 'false'}">
          <span class="ic">${badge}</span>
          <span>${lessonNumberLabel} · ${readText(item.title, item.id, lang)}</span>
        </a>
      `;
    }).join('');

    const otherUnits = [...new Set(lessons.filter((item) => item.unitId !== currentUnit).map((item) => item.unitId))];
    const other = otherUnits.map((unitId) => {
      const sample = lessons.find((item) => item.unitId === unitId);
      if (!sample) return '';
      return `<div class="sb-unit sb-unit-dim"><div class="sb-unit-title">${readText(sample.unitTitle, unitId)}</div></div>`;
    }).join('');

    container.innerHTML = `<div class="sb-unit">${items}</div>${other}`;
  }

  function escapeHtml(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function showLockedLesson(lessonMeta, lockError, course) {
    const lang = typeof window.getSourceLanguage === 'function' ? window.getSourceLanguage() : 'uk';
    const courseId = getCurrentCourseId();
    const lessonId = lessonMeta?.id || lockError.lessonId || getCurrentLessonId();
    const lessonTitle = lessonMeta ? readText(lessonMeta.title, lessonId, lang) : lessonId;
    const isAuthRequired = lockError.status === 401 || lockError.code === 'AUTH_REQUIRED';

    const heroLabel = document.getElementById('heroLabel');
    if (heroLabel) heroLabel.textContent = lang === 'en' ? 'Premium Lesson' : 'Преміум-урок';

    const titleEl = document.getElementById('heroTitle');
    if (titleEl) {
      titleEl.innerHTML = `<span style="display:inline-flex;align-items:center;gap:0.5rem;"><span data-icon="lock" style="color:var(--gold, #d97706);">${getIconSvg('lock')}</span> ${escapeHtml(lessonTitle)}</span>`;
    }

    const descEl = document.getElementById('heroDescription');
    if (descEl) {
      descEl.textContent = isAuthRequired
        ? (lang === 'en' ? 'This lesson requires an account with active course access.' : 'Цей урок потребує входу в акаунт з активним доступом до курсу.')
        : (lang === 'en' ? 'This lesson is part of the full paid course.' : 'Цей урок є частиною повного платного курсу.');
    }

    const index = document.getElementById('lessonIndex');
    if (index) index.hidden = true;

    const nav = document.getElementById('lessonBottomNav');
    if (nav) nav.hidden = true;

    const pricingUrl = `pricing.html?course=${encodeURIComponent(courseId)}&lesson=${encodeURIComponent(lessonId)}`;
    const authUrl = `auth.html?redirect=${encodeURIComponent(window.location.href)}`;
    const pathUrl = `path.html?course=${encodeURIComponent(courseId)}`;

    const body = document.getElementById('lessonBody');
    if (body) {
      const ctaHtml = isAuthRequired
        ? `
          <div style="display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;margin-top:1.5rem;">
            <a href="${authUrl}" class="btn-primary" style="padding:0.75rem 1.5rem;font-weight:700;">
              ${lang === 'en' ? 'Sign In / Register' : 'Увійти / Зареєструватися'}
            </a>
            <a href="${pricingUrl}" class="btn-secondary" style="padding:0.75rem 1.5rem;">
              ${lang === 'en' ? 'View Pricing & Plans' : 'Тарифи та плани'}
            </a>
          </div>
        `
        : `
          <div style="display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;margin-top:1.5rem;">
            <a href="${pricingUrl}" class="btn-primary" style="padding:0.75rem 1.75rem;font-weight:700;font-size:1.05rem;">
              <span data-icon="sparkles"></span> ${lang === 'en' ? 'Unlock Full Course' : 'Отримати повний доступ'}
            </a>
            <a href="${pathUrl}" class="btn-ghost" style="padding:0.75rem 1.25rem;">
              ${lang === 'en' ? 'Back to Learning Path' : 'Назад до розділів'}
            </a>
          </div>
        `;

      body.innerHTML = `
        <div class="locked-lesson-card" style="max-width:580px;margin:2rem auto;padding:2.5rem 2rem;background:var(--bg-card, #fff);border:2px dashed var(--border-soft, #e2e8f0);border-radius:1rem;text-align:center;box-shadow:0 10px 25px -5px rgba(0,0,0,0.05);">
          <div style="width:64px;height:64px;margin:0 auto 1.25rem;display:flex;align-items:center;justify-content:center;background:var(--gold-soft, #fef3c7);color:var(--gold, #d97706);border-radius:50%;font-size:1.75rem;">
            ${getIconSvg('lock')}
          </div>
          <h2 style="font-size:1.4rem;font-weight:800;margin-bottom:0.75rem;color:var(--ink, #1e293b);">
            ${lang === 'en' ? 'Unlock This Lesson' : 'Розблокувати цей урок'}
          </h2>
          <p style="color:var(--ink-soft, #64748b);line-height:1.6;margin-bottom:1.5rem;">
            ${lang === 'en'
              ? 'Gain lifetime access to all interactive dialogues, exercises, native audio, grammar breakdowns, and vocabulary practice for this course.'
              : 'Отримайте необмежений доступ до всіх інтерактивних діалогів, вправ, автентичного аудіо, граматики та словникових тренувань цього курсу.'}
          </p>

          <div style="background:var(--bg-soft, #f8fafc);border-radius:0.75rem;padding:1.25rem;text-align:left;margin-bottom:1.5rem;">
            <div style="font-weight:700;font-size:0.95rem;margin-bottom:0.75rem;color:var(--ink);">
              ${lang === 'en' ? 'What you get:' : 'Що входить у курс:'}
            </div>
            <ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:0.5rem;font-size:0.9rem;color:var(--ink-soft);">
              <li style="display:flex;align-items:center;gap:0.5rem;"><span data-icon="check" style="color:#10b981;"></span> ${lang === 'en' ? 'Full structured learning path with all units' : 'Повний структурований шлях з усіма розділами'}</li>
              <li style="display:flex;align-items:center;gap:0.5rem;"><span data-icon="check" style="color:#10b981;"></span> ${lang === 'en' ? 'Vocabulary trainer with spaced repetition' : 'Словниковий тренажер з інтервальним повторенням'}</li>
              <li style="display:flex;align-items:center;gap:0.5rem;"><span data-icon="check" style="color:#10b981;"></span> ${lang === 'en' ? 'Interactive quizzes & audio dialogue practice' : 'Інтерактивні тести та аудіо-діалоги'}</li>
              <li style="display:flex;align-items:center;gap:0.5rem;"><span data-icon="check" style="color:#10b981;"></span> ${lang === 'en' ? 'One-time payment, no recurring subscriptions' : 'Одноразова оплата без прихованих підписок'}</li>
            </ul>
          </div>

          ${ctaHtml}
          ${allowDevUnlock ? `
          <div style="margin-top:1.5rem;padding-top:1rem;border-top:1px dashed var(--border, #e2e8f0);">
            <button type="button" class="btn-ghost" onclick="unlockForTesting()" style="font-size:0.85rem;padding:0.4rem 0.9rem;border:1px dashed var(--accent, #c9a25b);cursor:pointer;display:inline-flex;align-items:center;gap:0.4rem;">
              <span data-icon="sparkles"></span> <span>${lang === 'en' ? 'Unlock for testing (Dev)' : 'Розблокувати для тестування (Dev)'}</span>
            </button>
          </div>` : ''}
        </div>
      `;
    }

    document.title = `${lessonTitle} (${lang === 'en' ? 'Locked' : 'Заблоковано'}) — LanguageStudio`;
  }

  function showNotFound(requestedId) {
    const lang = typeof window.getSourceLanguage === 'function' ? window.getSourceLanguage() : 'uk';
    const titleEl = document.getElementById('heroTitle');
    if (titleEl) titleEl.textContent = lang === 'en' ? 'Lesson not found' : 'Урок не знайдено';
    const descEl = document.getElementById('heroDescription');
    if (descEl) descEl.textContent = requestedId
      ? (lang === 'en' ? `No lesson was found for “${requestedId}”.` : `Урок «${requestedId}» не знайдено.`)
      : (lang === 'en' ? 'No lesson id was provided in the URL.' : 'У URL не вказано ідентифікатор уроку.');
    const body = document.getElementById('lessonBody');
    if (body) {
      body.innerHTML = `<div style="padding:2rem;text-align:center;"><p style="color:var(--ink-soft);margin-bottom:1rem;">${lang === 'en' ? 'Choose another lesson from the course path or return to the learning paths page.' : 'Оберіть інший урок зі списку або поверніться до розділів.'}</p><a href="path.html" class="btn-primary">${lang === 'en' ? 'Learning paths' : 'Розділи навчання'}</a></div>`;
    }
    const index = document.getElementById('lessonIndex');
    if (index) index.hidden = true;
    document.title = lang === 'en' ? 'Lesson not found — LanguageStudio' : 'Урок не знайдено — LanguageStudio';
  }

  function setupSidebarToggle() {
    const wrapper = document.querySelector('.lesson-layout-wrapper');
    const sidebar = document.getElementById('sidebar');
    const toggle = document.getElementById('sbToggleBtn');
    const overlay = document.getElementById('sbOverlay');
    if (!wrapper || !sidebar || !toggle || toggle.dataset.sidebarReady === 'true') return;

    const isMobile = () => window.matchMedia('(max-width: 860px)').matches;
    const setOpen = (open) => {
      toggle.setAttribute('aria-expanded', String(open));
      if (isMobile()) {
        sidebar.classList.toggle('open', open);
        if (overlay) overlay.classList.toggle('open', open);
      } else {
        wrapper.classList.toggle('sidebar-collapsed', !open);
      }
    };
    const updateLabel = () => {
      const lang = typeof window.getSourceLanguage === 'function' ? window.getSourceLanguage() : 'uk';
      const open = toggle.getAttribute('aria-expanded') === 'true';
      const label = lang === 'en'
        ? (open ? 'Hide lesson list' : 'Show lesson list')
        : (open ? 'Приховати список уроків' : 'Показати список уроків');
      toggle.setAttribute('aria-label', label);
      toggle.title = label;
    };

    toggle.addEventListener('click', () => {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
      updateLabel();
    });
    overlay?.addEventListener('click', () => {
      setOpen(false);
      updateLabel();
    });
    window.addEventListener('resize', () => {
      const open = toggle.getAttribute('aria-expanded') === 'true';
      setOpen(open);
    });
    window.addEventListener('sourceLanguageChanged', updateLabel);
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && sidebar.classList.contains('open')) {
        setOpen(false);
        updateLabel();
      }
    });

    toggle.dataset.sidebarReady = 'true';
    setOpen(!isMobile());
    updateLabel();
  }

  async function initLessonPage() {
    try {
      await checkDevEndpoints();
      const lessonId = getCurrentLessonId();
      const course = await window.loadCourse();
      const lessonList = getLessonList(course);
      const lang = typeof window.getSourceLanguage === 'function' ? window.getSourceLanguage() : 'uk';

      let lessonMeta = lessonList.find((lesson) => lesson.id === lessonId) || null;
      let rawLesson = null;
      let lockError = null;

      if (lessonId) {
        try {
          rawLesson = await window.loadCourseData(`lessons/${lessonId}`);
        } catch (error) {
          if (error.isLocked || error.status === 401 || error.status === 403 || error.code === 'AUTH_REQUIRED' || error.code === 'ENTITLEMENT_REQUIRED') {
            lockError = error;
          } else {
            console.warn(`Could not load lesson content for "${lessonId}":`, error);
          }
        }
      }

      if (lockError) {
        renderSidebar(course, lessonMeta || { id: lessonId, unitId: 'unit-1', unitTitle: '', lessonNum: lessonId, title: lessonId }, lessonList, lang);
        showLockedLesson(lessonMeta, lockError, course);
        return;
      }

      if (!rawLesson && !lessonMeta && (lessonId || lessonList.length === 0)) {
        showNotFound(lessonId);
        return;
      }

      const fallbackLessonId = lessonMeta?.id || rawLesson?.id || lessonId || (lessonList[0] && lessonList[0].id) || 'communication-basics-1';
      const vocabularyMap = new Map();
      const missingVocabulary = [];
      let vocabularyLoadError = false;
      const lessonBlocks = rawLesson?.blocks || rawLesson?.sections || [];
      if (lessonBlocks.some((block) => block && block.type === 'vocab')) {
        try {
          const vocabulary = await window.loadCourseData('vocab');
          if (!Array.isArray(vocabulary)) throw new Error('The course vocabulary response is invalid.');
          vocabulary.forEach((word) => {
            const key = normalizeVocabularyKey(word && word.word);
            if (key) vocabularyMap.set(key, word);
          });
        } catch (error) {
          vocabularyLoadError = true;
          console.error(`Could not load vocabulary for lesson "${fallbackLessonId}":`, error);
        }
      }

      const normalized = normalizeLesson(
        rawLesson || {},
        course,
        fallbackLessonId,
        lessonMeta || {},
        vocabularyMap,
        missingVocabulary
      );

      if (!normalized.sections || normalized.sections.length === 0) {
        normalized.sections = [{ type: 'takeaways', title: { uk: 'Опис уроку', en: 'Lesson summary' }, items: [readText(normalized.description, '')] }];
      }

      renderSidebar(course, normalized, lessonList.length ? lessonList : [{ ...normalized, unitId: normalized.unitId || 'unit-1', unitTitle: normalized.unitTitle, lessonNum: normalized.lessonNum || normalized.id }], lang);
      renderHero(normalized, lang);
      renderNavigation(lessonList.length ? lessonList : [{ ...normalized, unitId: normalized.unitId || 'unit-1', unitTitle: normalized.unitTitle, lessonNum: normalized.lessonNum || normalized.id }], normalized.id);

      if (typeof window.LessonEngine !== 'undefined') {
        window.LessonEngine.renderLesson(normalized, document.getElementById('lessonBody'));
      } else {
        document.getElementById('lessonBody').innerHTML = '<p style="padding:2rem;color:var(--ink-soft);">Lesson engine failed to load.</p>';
      }

      if (vocabularyLoadError || missingVocabulary.length) {
        const notice = document.createElement('p');
        notice.setAttribute('role', 'alert');
        notice.textContent = vocabularyLoadError
          ? (lang === 'en' ? 'Lesson vocabulary could not be loaded.' : 'Не вдалося завантажити словник уроку.')
          : (lang === 'en'
            ? 'Some lesson vocabulary is not available in the course word bank.'
            : 'Деякі слова уроку відсутні у словнику курсу.');
        document.getElementById('lessonBody').prepend(notice);
      }

      document.documentElement.lang = lang;
      if (typeof window.applySourceLanguageSettings === 'function') window.applySourceLanguageSettings();
    } catch (error) {
      console.warn('Could not initialize lesson page:', error);
      const lessonId = getCurrentLessonId();
      showNotFound(lessonId);
    }
  }

  window.unlockForTesting = async function () {
    try {
      const courseId = typeof window.getCourseId === 'function' ? window.getCourseId() : 'it';
      const res = await fetch('/api/payments/dev-unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId }),
        credentials: 'include'
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error || 'Dev unlock is disabled in this environment.');
        return;
      }
      localStorage.setItem(`ls_unlocked_${courseId}`, 'true');
      localStorage.setItem('ls_unlocked_all', 'true');
      window.location.reload();
    } catch (err) {
      alert('Unlock failed');
    }
  };

  setupSidebarToggle();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLessonPage);
  } else {
    initLessonPage();
  }

  window.addEventListener('sourceLanguageChanged', () => {
    initLessonPage();
  });
})();
