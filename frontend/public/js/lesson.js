(function () {
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

  function getCourseBasePath() {
    const path = window.location.pathname || '';
    if (path.includes('/frontend/public/pages') || path.includes('/frontend/public/lessons')) return '../../../';
    if (path.includes('/pages/') || path.includes('/lessons/')) return '../../';
    if (path.includes('/frontend/public') || path.includes('/public/')) return '../../';
    return './';
  }

  function getLessonFileUrl(courseId, lessonId) {
    return `${getCourseBasePath()}courses/${encodeURIComponent(courseId)}/lessons/${encodeURIComponent(lessonId)}.json`;
  }

  function getCourseFileUrl(courseId) {
    return `${getCourseBasePath()}courses/${encodeURIComponent(courseId)}/course.json`;
  }

  function getLessonList(course) {
    const courseLessons = course && Array.isArray(course.paths)
      ? course.paths.flatMap((path) => (path.units || []).flatMap((unit) => (unit.lessons || []).flatMap((lesson) => {
        const sharedMetadata = {
          pathId: path.id,
          pathTitle: path.title,
          unitId: unit.id,
          unitTitle: unit.title
        };
        return [
          { ...lesson, ...sharedMetadata, parentLessonId: null, status: lesson.status || 'locked' },
          ...(lesson.sublessons || []).map((sublesson) => ({
            ...sublesson,
            ...sharedMetadata,
            parentLessonId: lesson.id,
            parentLessonTitle: lesson.title,
            status: sublesson.status || 'locked'
          }))
        ];
      })))
      : [];
    const existingIds = new Set(courseLessons.map((lesson) => lesson.id));
    const readingLessons = (course?.id || getCurrentCourseId()) === 'it'
      ? Object.values(window.LS_LESSONS || {})
        .filter((lesson) => lesson && lesson.unitId === 'italian-reading' && lesson.id && !existingIds.has(lesson.id))
        .sort((first, second) => Number(first.lessonNum) - Number(second.lessonNum))
        .map((lesson) => ({
          ...lesson,
          pathId: 'italian-reading',
          pathTitle: lesson.unitTitle,
          status: 'available'
        }))
      : [];

    return [...courseLessons, ...readingLessons];
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

  function normalizeSection(block, vocabMap) {
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
          it: line.text || line.it || '',
          phonetic: typeof line.phon === 'object' ? readText(line.phon, '') : (line.phon || line.phonetic || ''),
          translations: line.trans || line.translations || {},
          audio: line.audio !== false
        }))
      };
    }

    if (block.type === 'vocab') {
      const items = (block.items || []).map((item) => {
        if (!item) return null;
        const directItem = item.it || item.word || item.text || '';
        return {
          it: directItem,
          transcription: item.transcription || item.phon || '',
          translations: item.translations || item.trans || { uk: '', en: '' }
        };
      }).filter(Boolean);
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
          return item.text || item.uk || item.en || '';
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

  function normalizeLesson(rawLesson, course, lessonId, courseLessonMeta) {
    const lessonMeta = courseLessonMeta || {};
    const hasNextLessonMetadata = Object.prototype.hasOwnProperty.call(rawLesson || {}, 'nextLessonId')
      || Object.prototype.hasOwnProperty.call(lessonMeta, 'nextLessonId');
    const hasPreviousLessonMetadata = Object.prototype.hasOwnProperty.call(rawLesson || {}, 'prevLessonId')
      || Object.prototype.hasOwnProperty.call(lessonMeta, 'prevLessonId');
    const safeId = rawLesson?.id || lessonId || 'communication-basics-1';
    const sections = (rawLesson?.blocks || rawLesson?.sections || []).map((block) => normalizeSection(block, {})).filter(Boolean);
    const title = rawLesson?.title || lessonMeta.title || { uk: 'Урок', en: 'Lesson' };
    const subtitle = rawLesson?.subtitle || lessonMeta.subtitle || { uk: '', en: '' };
    const description = rawLesson?.description || lessonMeta.description || rawLesson?.hero?.text || { uk: 'Lesson content', en: 'Lesson content' };
    const unitTitle = lessonMeta.unitTitle || { uk: 'Розділ', en: 'Unit' };

    return {
      id: safeId,
      courseId: course?.id || getCurrentCourseId(),
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
      const badge = (lang === 'en' ? 'Lesson' : 'Урок');
      const xpText = Number(lesson.xpReward) ? `+${lesson.xpReward} XP` : '';
      const durationText = typeof lesson.duration === 'object'
        ? (lesson.duration[lang] || lesson.duration.uk || lesson.duration.en || '')
        : lesson.duration;
      metaEl.innerHTML = `
        <div style="display:inline-flex;align-items:center;gap:0.4rem;background:rgba(255,255,255,0.18);border:1px solid rgba(255,255,255,0.25);color:#FFFFFF;font-size:0.75rem;font-weight:700;letter-spacing:.05em;text-transform:uppercase;padding:.3rem .75rem;border-radius:999px;">${badge}</div>
        ${durationText ? `<div style="font-size:0.8rem;color:rgba(255,255,255,.75);display:flex;align-items:center;gap:.3rem;">${durationText}</div>` : ''}
        ${xpText ? `<div style="font-size:0.8rem;color:rgba(255,255,255,.75);display:flex;align-items:center;gap:.3rem;">${xpText}</div>` : ''}
      `;
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

  function updateRulesButtonState() {
    const button = document.getElementById('btnLessonRules');
    if (!button || button.hidden) return;

    const lang = typeof window.getSourceLanguage === 'function' ? window.getSourceLanguage() : 'uk';
    const completed = typeof window.LessonEngine?.isLessonCompleted === 'function'
      && window.LessonEngine.isLessonCompleted(button.dataset.lessonId);
    const label = lang === 'en' ? 'Rules' : 'Правила';
    const labelElement = document.getElementById('btnLessonRulesLabel');

    if (labelElement) labelElement.textContent = label;
    button.disabled = !completed;
    button.setAttribute('aria-label', completed
      ? (lang === 'en' ? 'Rules reference planned' : 'Довідник правил заплановано')
      : (lang === 'en' ? 'Rules reference, locked until lesson completion' : 'Довідник правил заблоковано до завершення уроку'));
    button.title = completed
      ? (lang === 'en' ? 'Rules reference planned' : 'Довідник правил заплановано')
      : (lang === 'en' ? 'Available after you complete this lesson' : 'Стане доступним після завершення уроку');
  }

  function setupRulesButton(lesson) {
    const button = document.getElementById('btnLessonRules');
    if (!button) return;

    const isRulesLesson = lesson.unitId === 'italian-reading'
      && /^italian-reading-(?:[2-9]|1[01])$/.test(lesson.id);
    button.hidden = !isRulesLesson;
    button.dataset.lessonId = isRulesLesson ? lesson.id : '';
    if (!isRulesLesson) return;

    if (!button.dataset.listenersReady) {
      button.dataset.listenersReady = 'true';
      button.addEventListener('click', () => {
        if (!window.LessonEngine?.isLessonCompleted(button.dataset.lessonId)) return;
        const lang = typeof window.getSourceLanguage === 'function' ? window.getSourceLanguage() : 'uk';
        window.alert(lang === 'en' ? 'The rules reference is planned.' : 'Довідник правил заплановано.');
      });
      window.addEventListener('lessonCompleted', (event) => {
        if (event.detail?.lessonId === button.dataset.lessonId) updateRulesButtonState();
      });
    }

    updateRulesButtonState();
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
      const isSublesson = Boolean(item.parentLessonId);
      const isDone = typeof window.isLessonCompleted === 'function' && window.isLessonCompleted(item.id);
      const lessonNumberLabel = getLessonNumberLabel(item, lang);
      const badge = getIconSvg(active ? 'lesson' : (isDone ? 'check' : 'circle'));
      return `
        <a href="${window.location.pathname}?course=${encodeURIComponent(getCurrentCourseId())}&lesson=${encodeURIComponent(item.id)}" class="sb-lesson${isSublesson ? ' sb-sublesson' : ''} ${active ? 'active' : ''}" aria-current="${active ? 'page' : 'false'}">
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
      const courseId = getCurrentCourseId();
      const lessonId = getCurrentLessonId();
      const course = await window.loadCourse();
      const lessonList = getLessonList(course);

      let lessonMeta = lessonList.find((lesson) => lesson.id === lessonId) || null;
      let rawLesson = null;

      if (lessonId) {
        rawLesson = courseId === 'it' ? window.LS_LESSONS?.[lessonId] || null : null;
        if (!rawLesson) {
          try {
            rawLesson = await window.loadCourseData(`lessons/${lessonId}`);
          } catch (error) {
            rawLesson = null;
          }
        }
      }

      if (!rawLesson && !lessonMeta && lessonId) {
        showNotFound(lessonId);
        return;
      }

      const fallbackLessonId = lessonMeta?.id || rawLesson?.id || lessonId || (lessonList[0] && lessonList[0].id) || 'communication-basics-1';
      const normalized = normalizeLesson(rawLesson || {}, course, fallbackLessonId, lessonMeta || {});
      const lang = typeof window.getSourceLanguage === 'function' ? window.getSourceLanguage() : 'uk';

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

      document.documentElement.lang = lang;
      if (typeof window.applySourceLanguageSettings === 'function') window.applySourceLanguageSettings();
      setupRulesButton(normalized);
    } catch (error) {
      console.warn('Could not initialize lesson page:', error);
      const lessonId = getCurrentLessonId();
      showNotFound(lessonId);
    }
  }

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
