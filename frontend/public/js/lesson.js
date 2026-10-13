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

  function readText(value, fallback = '') {
    if (!value) return fallback;
    if (typeof value === 'string') return value;
    if (typeof value === 'object') {
      if (typeof value.uk !== 'undefined') return value.uk;
      if (typeof value.en !== 'undefined') return value.en;
      const first = Object.values(value).find((item) => typeof item === 'string');
      return first || fallback;
    }
    return String(value);
  }

  function getCourseBasePath() {
    const path = window.location.pathname || '';
    if (path.includes('/pages/')) return '../';
    if (path.includes('/lessons/')) return '../';
    return './';
  }

  function getLessonFileUrl(courseId, lessonId) {
    return `${getCourseBasePath()}courses/${encodeURIComponent(courseId)}/lessons/${encodeURIComponent(lessonId)}.json`;
  }

  function getCourseFileUrl(courseId) {
    return `${getCourseBasePath()}courses/${encodeURIComponent(courseId)}/course.json`;
  }

  function getLessonList(course) {
    if (!course || !Array.isArray(course.paths)) return [];
    return course.paths.flatMap((path) => (path.units || []).flatMap((unit) => (unit.lessons || []).map((lesson) => ({
      ...lesson,
      pathId: path.id,
      pathTitle: path.title,
      unitId: unit.id,
      unitTitle: unit.title,
      status: lesson.status || 'locked'
    }))));
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
        lines: (block.lines || []).map((line) => ({
          speaker: line.speaker || 'Speaker',
          avatar: line.avatar || (line.speaker || '').charAt(0).toUpperCase() || '💬',
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
      const tasks = (block.items || []).map((task) => {
        const kind = task.kind || task.type || 'choice';
        if (kind === 'choice') {
          const options = (task.options || []).map((option) => ({
            text: option.text || option.label || { uk: '', en: '' },
            translations: option.translations || option.text || { uk: '', en: '' },
            correct: Boolean(option.correct)
          }));
          const correctIndex = options.findIndex((option) => Boolean(option.correct));
          return {
            id: task.id || 'choice-task',
            type: 'choice',
            question: task.q || task.question || { uk: 'Question', en: 'Question' },
            options,
            correctIndex: correctIndex >= 0 ? correctIndex : 0
          };
        }

        if (kind === 'truefalse') {
          return {
            id: task.id || 'truefalse-task',
            type: 'true_false',
            statement: task.q || task.statement || { uk: 'Question', en: 'Question' },
            correctAnswer: Boolean(task.answer)
          };
        }

        return {
          id: task.id || 'fillblank-task',
          type: 'fill_blank',
          prefix: '',
          suffix: '',
          placeholder: task.prompt || { uk: 'введіть слово', en: 'enter word' },
          acceptableAnswers: Array.isArray(task.answers) ? task.answers : [task.answer || '']
        };
      });

      return { type: 'quiz', title: block.title || { uk: 'Завдання уроку', en: 'Lesson tasks' }, tasks };
    }

    return { ...block };
  }

  function normalizeLesson(rawLesson, course, lessonId, courseLessonMeta) {
    const lessonMeta = courseLessonMeta || {};
    const safeId = rawLesson?.id || lessonId || '1.1';
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
      nextLessonId: rawLesson?.nextLessonId || lessonMeta.nextLessonId || null,
      prevLessonId: rawLesson?.prevLessonId || lessonMeta.prevLessonId || null,
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
    const labelText = readText(lesson.hero?.label || { uk: `${readText(lesson.unitTitle, 'Unit')} · ${lang === 'en' ? 'Lesson' : 'Урок'} ${lesson.lessonNum || lesson.id}`, en: `${readText(lesson.unitTitle, 'Unit')} · Lesson ${lesson.lessonNum || lesson.id}` }, '');

    if (titleEl) titleEl.textContent = subtitleText ? `${titleText} — ${subtitleText}` : titleText;
    if (descEl) descEl.textContent = descriptionText;
    if (labelEl) labelEl.textContent = labelText;
    if (unitEl) unitEl.textContent = readText(lesson.unitTitle, 'Unit');
    if (lessonEl) lessonEl.textContent = `${lang === 'en' ? 'Lesson' : 'Урок'} ${lesson.lessonNum || lesson.id}`;

    if (metaEl) {
      const badge = (lang === 'en' ? 'Lesson' : 'Урок');
      const xpText = Number(lesson.xpReward) ? `+${lesson.xpReward} XP` : '';
      metaEl.innerHTML = `
        <div style="display:inline-flex;align-items:center;gap:0.4rem;background:rgba(0,140,69,.12);color:#008c45;font-size:0.75rem;font-weight:700;letter-spacing:.05em;text-transform:uppercase;padding:.3rem .75rem;border-radius:999px;">${badge}</div>
        ${lesson.duration ? `<div style="font-size:0.8rem;color:rgba(255,255,255,.75);display:flex;align-items:center;gap:.3rem;">${lesson.duration}</div>` : ''}
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
    const prev = lessons[currentIndex - 1];
    const next = lessons[currentIndex + 1];
    const lang = typeof window.getSourceLanguage === 'function' ? window.getSourceLanguage() : 'uk';

    const prevText = lang === 'en' ? '← Previous lesson' : '← Попередній урок';
    const nextText = lang === 'en' ? 'Next lesson →' : 'Наступний урок →';

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
      prevLink.textContent = prev ? prevText : (lang === 'en' ? '← Back' : '← Назад');
    }
    if (prevBottom) {
      prevBottom.href = prev ? makeHref(prev.id) : 'path.html';
      prevBottom.style.display = prev ? '' : 'none';
      prevBottom.textContent = prevText;
    }
    if (nextLink) {
      nextLink.href = next ? makeHref(next.id) : 'path.html';
      nextLink.textContent = next ? nextText : (lang === 'en' ? 'All lessons →' : 'Всі уроки →');
    }
    if (nextBottom) {
      nextBottom.href = next ? makeHref(next.id) : 'path.html';
      nextBottom.style.display = next ? '' : 'none';
      nextBottom.textContent = nextText;
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
      const prefix = lang === 'en' ? 'Lesson' : 'Урок';
      const badge = active ? '<span class="ic">▶</span>' : (isDone ? '<span class="ic">✓</span>' : '<span class="ic">○</span>');
      return `
        <a href="${window.location.pathname}?course=${encodeURIComponent(getCurrentCourseId())}&lesson=${encodeURIComponent(item.id)}" class="sb-lesson ${active ? 'active' : ''}" aria-current="${active ? 'page' : 'false'}">
          <span class="ic">${badge}</span>
          <span>${prefix} ${item.lessonNum || item.id} · ${readText(item.title, item.id)}</span>
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
    document.title = lang === 'en' ? 'Lesson not found — LanguageStudio' : 'Урок не знайдено — LanguageStudio';
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
        try {
          rawLesson = await window.loadCourseData(`lessons/${lessonId}`);
        } catch (error) {
          rawLesson = null;
        }
      }

      if (!rawLesson && !lessonMeta && lessonId) {
        showNotFound(lessonId);
        return;
      }

      const fallbackLessonId = lessonMeta?.id || rawLesson?.id || lessonId || (lessonList[0] && lessonList[0].id) || '1.1';
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
    } catch (error) {
      console.warn('Could not initialize lesson page:', error);
      const lessonId = getCurrentLessonId();
      showNotFound(lessonId);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLessonPage);
  } else {
    initLessonPage();
  }

  window.addEventListener('sourceLanguageChanged', () => {
    initLessonPage();
  });
})();
