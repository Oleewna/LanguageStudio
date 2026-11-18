/**
 * LanguageStudio - Shared Helper Script
 */

const XP_KEY = 'ls_xp';
const DICT_KEY = (typeof window.courseKey === 'function') ? window.courseKey('custom_dict') : 'ls_custom_dict';
const SOURCE_LANGUAGE_KEY = 'ls_source_language';
const TARGET_COURSE_KEY = 'ls_course';
const ORIGINAL_DOCUMENT_TITLE = document.title;
const SOURCE_LANGUAGES = [
  { code: 'device', uk: 'Мова пристрою', en: 'Device language' },
  { code: 'uk', uk: 'Українська', en: 'Ukrainian' },
  { code: 'en', uk: 'Англійська', en: 'English' },
];
const LOCAL_STUDENT_PROFILE = {
  isAuthenticated: false,
  displayName: '',
  email: ''
};

window.__LS_LOCALES = window.__LS_LOCALES || {};
const I18N_LOOKUP = new Map();

function registerTranslationEntry(entry) {
  if (!entry || typeof entry !== 'object') return;
  const langs = ['en', 'uk', 'pl', 'es', 'it', 'de', 'fr'];
  langs.forEach(lang => {
    const val = entry[lang];
    if (val && typeof val === 'string') {
      const norm = val.trim().replace(/\s+/g, ' ').toLowerCase();
      if (!I18N_LOOKUP.has(norm)) {
        I18N_LOOKUP.set(norm, entry);
      }
    }
  });
}

function getAppBasePath() {
  const pathname = window.location.pathname || '';
  if (pathname.includes('/pages/') || pathname.includes('/lessons/')) return '../';
  return './';
}

async function loadLocaleData(locale) {
  if (window.__LS_LOCALES[locale]) {
    return window.__LS_LOCALES[locale];
  }
  const url = `${getAppBasePath()}locales/${encodeURIComponent(locale)}.json`;
  try {
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      window.__LS_LOCALES[locale] = data;
      // Index into I18N_LOOKUP for tree-walker HTML translations
      Object.entries(data).forEach(([key, val]) => {
        if (typeof val === 'string') {
          registerTranslationEntry({ [locale]: val, en: key });
        }
      });
      window.dispatchEvent(new CustomEvent('localeLoaded', { detail: { locale, data } }));
      return data;
    }
  } catch (err) {
    console.warn(`Could not load locale data for "${locale}":`, err);
  }
  return {};
}

function t(key, params = {}, forcedLocale = null) {
  const locale = forcedLocale || (typeof getSourceLanguage === 'function' ? getSourceLanguage() : 'uk');
  const currentBundle = window.__LS_LOCALES[locale] || {};
  const enBundle = window.__LS_LOCALES['en'] || {};

  let text = currentBundle[key];
  if (text === undefined && locale !== 'en') {
    text = enBundle[key];
  }

  if (text === undefined) {
    if (key && typeof key === 'object') {
      text = key[locale] || key.en || key.uk || '';
    } else {
      text = String(key ?? '');
    }
  }

  if (params && typeof params === 'object') {
    Object.keys(params).forEach(p => {
      text = text.replace(new RegExp(`\\{${p}\\}`, 'g'), params[p]);
    });
  }

  return text;
}

if (typeof window !== 'undefined') {
  window.t = t;
  window.loadLocaleData = loadLocaleData;
}

// Preload current locale and fallback locale
const initialLocale = typeof getSourceLanguage === 'function' ? getSourceLanguage() : 'uk';
Promise.all([
  loadLocaleData('en'),
  initialLocale !== 'en' ? loadLocaleData(initialLocale) : Promise.resolve({})
]).then(() => {
  if (typeof applyInterfaceLanguage === 'function') {
    applyInterfaceLanguage();
  }
  window.dispatchEvent(new CustomEvent('localesReady', { detail: { locale: initialLocale } }));
}).catch(() => {});

/**
 * Universal interface translation helper supporting Ukrainian and English.
 * Resolves any string irrespective of the source HTML language.
 */
function getInterfaceTranslation(text, language) {
  if (!text || typeof text !== 'string') return null;
  const clean = text.trim().replace(/\s+/g, ' ').toLowerCase();
  const entry = I18N_LOOKUP.get(clean);
  if (entry) {
    return entry[language] || null;
  }
  return null;
}

if (typeof window !== 'undefined') {
  window.getInterfaceTranslation = getInterfaceTranslation;
}

const originalInterfaceText = new WeakMap();
const originalInterfaceAttributes = new WeakMap();

function applyInterfaceLanguage() {
  const language = getSourceLanguage();
  document.documentElement.lang = language;
  const translatedTitle = getInterfaceTranslation(ORIGINAL_DOCUMENT_TITLE, language);
  if (translatedTitle) document.title = translatedTitle;

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node;

  while ((node = walker.nextNode())) {
    if (node.parentElement?.closest('[data-source-key],script,style,code,pre')) continue;
    // Don't translate Italian foreign study content or pronunciation guidance
    if (node.parentElement?.closest('.dialogue-it, .dialogue-pronunciation, .grammar-highlight, [data-speak-text] b, [data-no-translate]')) continue;

    const currentVal = node.nodeValue;
    if (!currentVal || !currentVal.trim()) continue;

    if (!originalInterfaceText.has(node)) {
      originalInterfaceText.set(node, currentVal);
    }
    const initialVal = originalInterfaceText.get(node);

    let translated = getInterfaceTranslation(currentVal, language);
    if (!translated && initialVal && initialVal !== currentVal) {
      translated = getInterfaceTranslation(initialVal, language);
    }

    if (translated) {
      const leadingWs = currentVal.match(/^\s*/)[0];
      const trailingWs = currentVal.match(/\s*$/)[0];
      node.nodeValue = leadingWs + translated + trailingWs;
    }
  }

  document.querySelectorAll('[placeholder],[title],[aria-label],[alt]').forEach(element => {
    if (element.closest('.dialogue-it, [data-no-translate]')) return;
    const originals = originalInterfaceAttributes.get(element) || {};
    ['placeholder', 'title', 'aria-label', 'alt'].forEach(attribute => {
      if (!element.hasAttribute(attribute)) return;
      if (!Object.hasOwn(originals, attribute)) originals[attribute] = element.getAttribute(attribute);
      const original = originals[attribute];
      const current = element.getAttribute(attribute);
      let translated = getInterfaceTranslation(current, language);
      if (!translated && original) {
        translated = getInterfaceTranslation(original, language);
      }
      if (translated) {
        element.setAttribute(attribute, translated);
      } else if (language === 'en' && original) {
        element.setAttribute(attribute, original);
      }
    });
    originalInterfaceAttributes.set(element, originals);
  });
}

const SOURCE_TRANSLATIONS = {
  'exercises.q1.question': { uk: 'Як перекладається італійська фраза «Come stai?»', en: 'What does the Italian phrase “Come stai?” mean?' },
  'exercises.q1.a': { uk: 'А) Як тебе звати?', en: 'A) What is your name?' },
  'exercises.q1.b': { uk: 'Б) Як справи?', en: 'B) How are you?' },
  'exercises.q1.c': { uk: 'В) Звідки ти?', en: 'C) Where are you from?' },
  'exercises.q2.question': { uk: 'Що в італійській мові означає коротке слово «anch\'io»?', en: 'What does the short Italian phrase “anch\'io” mean?' },
  'exercises.q2.a': { uk: 'А) Я теж', en: 'A) Me too' },
  'exercises.q2.b': { uk: 'Б) А ти?', en: 'B) And you?' },
  'exercises.q2.c': { uk: 'В) Будь ласка', en: 'C) Please / you are welcome' },
  'exercises.q3.question': { uk: 'Як сказати італійською «Ласкаво просимо» дівчині?', en: 'How do you say “Welcome” to a woman in Italian?' },
  'exercises.q4.question': { uk: 'Чи можна вживати «Ciao!» і для зустрічі, і для прощання?', en: 'Can “Ciao!” be used both to greet someone and to say goodbye?' },
  'exercises.q4.a': { uk: 'А) Так, це універсальне привітання', en: 'A) Yes, it is a universal greeting' },
  'exercises.q4.b': { uk: 'Б) Ні, тільки при зустрічі', en: 'B) No, only when meeting someone' },
  'exercises.hint.greeting': { uk: 'Підказка: привітання при зустрічі', en: 'Hint: a greeting used when meeting someone' },
  'exercises.hint.well': { uk: 'Підказка: протилежне до «погано»', en: 'Hint: the opposite of “badly”' },
  'exercises.hint.thanks': { uk: 'Підказка: те, що кажуть, коли дуже вдячні', en: 'Hint: what you say to show strong gratitude' },
  'exercises.hint.welcome': { uk: 'Підказка: «ласкаво просимо» у жіночому роді', en: 'Hint: “welcome” when addressing a woman' },
  'exercises.hint.building': { uk: 'Підказка: багатоповерховий будинок', en: 'Hint: an apartment building' },
  'exercises.match.title': { uk: 'Зіставте слова з перекладом', en: 'Match each Italian word with its translation' },
  'exercises.match.instruction': { uk: 'Натисніть італійське слово, а потім відповідний переклад', en: 'Select an Italian word, then select its translation' },
  'exercises.reorder.instruction': { uk: 'Натисніть слова знизу, щоб скласти речення', en: 'Select the words below to build the sentence' },
  'exercises.translate.hello': { uk: '«привіт»', en: '“hello”' },
  'exercises.translate.thanks': { uk: '«дякую»', en: '“thank you”' },
  'exercises.translate.yes': { uk: '«так»', en: '“yes”' },
  'exercises.translate.no': { uk: '«ні»', en: '“no”' },
  'exercises.translate.please': { uk: '«будь ласка»', en: '“please”' },
  'exercises.listen.instruction': { uk: 'Натисніть, щоб «прослухати», і оберіть переклад', en: 'Play the word, then choose its translation' },
  'exercises.listen.thanks': { uk: 'А) Дякую', en: 'A) Thank you' },
  'exercises.listen.welcome': { uk: 'А) Ласкаво просимо', en: 'A) Welcome' },
  'exercises.listen.please': { uk: 'Б) Будь ласка', en: 'B) Please' },
  'exercises.listen.hello': { uk: 'В) Привіт', en: 'C) Hello' },
  'exercises.listen.yes': { uk: 'Б) Так', en: 'B) Yes' },
  'exercises.listen.no': { uk: 'В) Ні', en: 'C) No' },
  'exercises.listen.new': { uk: 'Б) Новий', en: 'B) New' },
  'exercises.listen.building': { uk: 'В) Будинок', en: 'C) Building' },
  'exercises.dialogue.instruction': { uk: 'Б: оберіть репліку, якою продовжити діалог', en: 'B: choose the line that continues the conversation' }
};

function getSourceLanguage() {
  const savedLanguage = getSelectedSourceLanguage();
  if (savedLanguage !== 'device') return savedLanguage;
  const navLang = (navigator.language || '').toLowerCase();
  if (navLang.startsWith('uk')) return 'uk';
  return 'en';
}

function getSelectedSourceLanguage() {
  const savedLanguage = localStorage.getItem(SOURCE_LANGUAGE_KEY) || localStorage.getItem('ls_italian_source_language');
  if (SOURCE_LANGUAGES.some(language => language.code === savedLanguage)) {
    return savedLanguage;
  }
  return 'device';
}

function getCourseCatalog() {
  const cachedCourses = Array.isArray(window.__LS_COURSE_INDEX?.courses) ? window.__LS_COURSE_INDEX.courses : [];
  return cachedCourses;
}

async function refreshCourseCatalog() {
  try {
    const index = await window.loadCourseIndex?.();
    if (index && Array.isArray(index.courses) && index.courses.length) {
      window.__LS_COURSE_INDEX = index;
    }
    return window.__LS_COURSE_INDEX || { default: '', courses: [] };
  } catch (error) {
    console.error('Could not refresh course catalog:', error);
    return { default: '', courses: [] };
  }
}

function getCourseMeta(courseId = getTargetCourse()) {
  const courseCatalog = getCourseCatalog();
  const match = courseCatalog.find(course => course.id === courseId);
  if (match) return match;
  return { id: courseId || '', name: { uk: courseId || '', en: courseId || '' } };
}

function setCourseLabel(element, course) {
  if (!element) return;
  element.innerHTML = getIconSvg(course.flag || `flag-${course.id || 'it'}`);
  element.append(document.createTextNode(` ${L(course.name || { uk: course.id, en: course.id })}`));
  window.renderRegisteredIcons?.(element);
}

function getSourceTranslation(key, fallback = '') {
  const translations = SOURCE_TRANSLATIONS[key];
  return translations?.[getSourceLanguage()] || translations?.uk || fallback;
}

function applySourceLanguageSettings() {
  const language = getSourceLanguage();
  const selectedLanguage = getSelectedSourceLanguage();
  applyInterfaceLanguage();
  document.querySelectorAll('[data-source-language-select]').forEach(select => {
    select.innerHTML = SOURCE_LANGUAGES.map(option => `<option value="${option.code}">${option[language] || option.en || option.uk}</option>`).join('');
    select.value = selectedLanguage;
  });
  document.querySelectorAll('[data-source-key]').forEach(element => {
    element.textContent = getSourceTranslation(element.dataset.sourceKey, element.textContent);
  });
  applyTargetCourseSettings();
}

function setSourceLanguage(language) {
  if (!SOURCE_LANGUAGES.some(option => option.code === language)) return;
  localStorage.setItem(SOURCE_LANGUAGE_KEY, language);
  const effectiveLocale = getSourceLanguage();
  const apply = () => {
    applySourceLanguageSettings();
    updateThemeToggleButtons(getTheme());
    window.dispatchEvent(new CustomEvent('sourceLanguageChanged', { detail: { language } }));
  };
  if (typeof loadLocaleData === 'function') {
    loadLocaleData(effectiveLocale).finally(apply);
  } else {
    apply();
  }
}

function getTargetCourse() {
  const params = new URLSearchParams(window.location.search);
  const paramCourse = params.get('course');
  const savedCourse = localStorage.getItem(TARGET_COURSE_KEY) || localStorage.getItem('ls_target_course') || localStorage.getItem('ls_course');
  const requestedCourse = paramCourse || savedCourse || 'it';
  if (requestedCourse && typeof requestedCourse === 'string' && requestedCourse.trim()) {
    return requestedCourse.trim();
  }
  return 'it';
}

function setTargetCourse(courseId) {
  if (!courseId) return;
  localStorage.setItem(TARGET_COURSE_KEY, courseId);
  localStorage.setItem('ls_course', courseId);
  localStorage.setItem('ls_target_course', courseId);
  applyTargetCourseSettings();
  window.dispatchEvent(new CustomEvent('courseChanged', { detail: { courseId } }));

  if (typeof window.setCourseId === 'function') {
    window.setCourseId(courseId);
    return;
  }

  if (window.location.pathname.includes('lesson')) {
    const course = window.LS_COURSES && window.LS_COURSES[courseId];
    const defaultId = course?.defaultLessonId || Object.keys(course?.lessons || {})[0];
    if (defaultId) {
      window.location.href = `lesson?course=${courseId}&lesson=${defaultId}`;
    }
  }
}

function applyTargetCourseSettings() {
  const currentCourse = getTargetCourse();
  const courseMeta = getCourseMeta(currentCourse);
  const courseData = window.__LS_ACTIVE_COURSE_DATA || {};
  const target = courseData.target || {
    code: currentCourse,
    rtl: false,
    script: 'latin',
    tts: `${currentCourse}-IT`
  };

  document.documentElement.lang = target.code || courseMeta.id || currentCourse;
  document.documentElement.dir = target.rtl ? 'rtl' : 'ltr';
  document.documentElement.classList.forEach(className => {
    if (className.startsWith('script-')) {
      document.documentElement.classList.remove(className);
    }
  });
  const scriptKey = (target.script || 'latin').toString().trim();
  if (scriptKey) {
    document.documentElement.classList.add(`script-${scriptKey}`);
  }

  document.querySelectorAll('[data-target-course-select]').forEach(select => {
    const courseOptions = getCourseCatalog();
    select.innerHTML = courseOptions.map(course => {
      const label = L(course.name || { uk: course.id, en: course.id });
      const suffix = course.status && course.status !== 'active' ? ` · ${L({ uk: 'Незабаром', en: 'Soon' })}` : '';
      return `<option value="${course.id}">${label}${suffix}</option>`;
    }).join('');
    select.value = currentCourse;
  });

  document.querySelectorAll('[data-course-switcher]').forEach(select => {
    const courseOptions = getCourseCatalog();
    select.innerHTML = courseOptions.map(course => {
      const label = course.id.toUpperCase();
      return `<option value="${course.id}">${label}</option>`;
    }).join('');
    select.value = currentCourse;
  });

  const courseTitle = L(courseMeta.name || { uk: currentCourse, en: currentCourse });
  const courseBadge = document.querySelector('[data-course-badge]');
  if (courseBadge) {
    setCourseLabel(courseBadge, courseMeta);
  }

  const courseNameEl = document.querySelector('[data-course-name]');
  if (courseNameEl) {
    courseNameEl.textContent = courseTitle;
  }

  const courseRoot = document.querySelector('[data-course-root]');
  if (courseRoot) {
    courseRoot.textContent = courseTitle;
  }

  if (typeof window.setCourseId === 'function' && window.location.search.indexOf('course=') === -1) {
    window.setCourseId(currentCourse);
  }
}

async function refreshCurrentCourseConfig() {
  try {
    const course = await window.loadCourse?.();
    if (course) {
      window.__LS_ACTIVE_COURSE_DATA = course;
      applyTargetCourseSettings();
      updateProfileStats();
    }
  } catch (error) {
    console.error('Could not load the current course configuration:', error);
  }
}

function getXP() {
  if (typeof window !== 'undefined' && window.Progress && typeof window.Progress.getXP === 'function') {
    return window.Progress.getXP();
  }
  return parseInt(localStorage.getItem(XP_KEY) || '0', 10);
}

function addXP(amount) {
  const xpToAdd = Number(amount) || 0;
  if (xpToAdd <= 0) return getXP();

  if (typeof window !== 'undefined' && window.Progress && typeof window.Progress.recordXp === 'function') {
    const courseId = (typeof getCurrentCourseId === 'function' ? getCurrentCourseId() : 'it') || 'it';
    window.Progress.recordXp({ courseId, amount: xpToAdd, source: 'exercise' }).catch(() => {});
    updateXPDisplay();
    return getXP();
  }

  const current = getXP() + xpToAdd;
  localStorage.setItem(XP_KEY, current);
  updateXPDisplay();
  return current;
}

function updateXPDisplay() {
  const els = document.querySelectorAll('.xp-val-display');
  const xp = getXP();
  els.forEach(el => el.textContent = xp);
}

function openMobNav() {
  const nav = document.getElementById('mobNav');
  const overlay = document.getElementById('mobOverlay');
  if (nav) nav.classList.add('open');
  if (overlay) overlay.classList.add('open');
  document.querySelectorAll('.menu-toggle').forEach(button => button.setAttribute('aria-expanded', 'true'));
  document.body.style.overflow = 'hidden';
}

function closeMobNav() {
  const nav = document.getElementById('mobNav');
  const overlay = document.getElementById('mobOverlay');
  if (nav) nav.classList.remove('open');
  if (overlay) overlay.classList.remove('open');
  document.querySelectorAll('.menu-toggle').forEach(button => button.setAttribute('aria-expanded', 'false'));
  document.body.style.overflow = '';
}

/* ── Theme Management (Dark Mode / Light Mode) ── */
const THEME_KEY = 'ls_theme';
let systemThemeListenerBound = false;

function hasThemeOverride() {
  const saved = localStorage.getItem(THEME_KEY);
  return saved === 'dark' || saved === 'light';
}

function getTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === 'dark' || saved === 'light') return saved;
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function setTheme(themeName, persist = true) {
  const finalTheme = themeName === 'dark' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', finalTheme);
  if (persist) localStorage.setItem(THEME_KEY, finalTheme);
  updateThemeToggleButtons(finalTheme);

  if (typeof window.updateBrandLogos === 'function') {
    window.updateBrandLogos(finalTheme);
  }
  window.dispatchEvent(new Event('themeChanged'));
}

function toggleTheme() {
  const current = getTheme();
  setTheme(current === 'dark' ? 'light' : 'dark');
}

function useSystemTheme() {
  localStorage.removeItem(THEME_KEY);
  setTheme(getTheme(), false);
}

function updateThemeToggleButtons(themeName) {
  const btns = document.querySelectorAll('.theme-toggle-btn');
  const icon = getIconSvg(themeName === 'dark' ? 'sun' : 'moon');
  const isEnglish = getSourceLanguage() === 'en';
  const labelText = isEnglish
    ? (themeName === 'dark' ? 'Enable light theme' : 'Enable dark theme')
    : (themeName === 'dark' ? 'Увімкнути світлу тему' : 'Увімкнути темну тему');

  btns.forEach(btn => {
    const isMobileMenuButton = btn.closest('.mob-nav');
    btn.innerHTML = isMobileMenuButton
      ? `${icon}<span class="mob-theme-label">${labelText}</span>`
      : icon;
    btn.setAttribute('title', labelText);
    btn.setAttribute('aria-label', labelText);
  });

  window.renderRegisteredIcons?.();
}

function initTheme() {
  setTheme(getTheme(), false);
  if (systemThemeListenerBound) return;

  const mediaQuery = window.matchMedia?.('(prefers-color-scheme: dark)');
  if (!mediaQuery) return;

  const applySystemTheme = (event) => {
    if (!hasThemeOverride()) setTheme(event.matches ? 'dark' : 'light', false);
  };

  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener('change', applySystemTheme);
  } else if (mediaQuery.addListener) {
    mediaQuery.addListener(applySystemTheme);
  }
  systemThemeListenerBound = true;
}

// Immediately apply saved theme on script parse to prevent FOUC
initTheme();

function ensureTestsNavigation() {
  const currentDirectory = location.pathname.split('/').at(-2);
  const testsHref = currentDirectory === 'pages'
    ? 'tests.html'
    : currentDirectory === 'lessons'
      ? '../pages/tests.html'
      : 'pages/tests.html';
  const isTestsPage = location.pathname.endsWith('/tests.html');
  const desktopNav = document.querySelector('.nav-links');
  const mobileNav = document.querySelector('.mob-nav');

  if (desktopNav && !desktopNav.querySelector('[data-tests-link]')) {
    const link = document.createElement('a');
    link.className = `nav-dd-btn${isTestsPage ? ' active' : ''}`;
    link.href = testsHref;
    link.dataset.testsLink = '';
    link.setAttribute('aria-current', isTestsPage ? 'page' : 'false');
    link.innerHTML = `<span class="dd-icon">${getIconSvg('target')}</span>Тести`;
    desktopNav.append(link);
  }

  if (mobileNav && !mobileNav.querySelector('[data-tests-link]')) {
    const link = document.createElement('a');
    link.className = `mob-nav-link${isTestsPage ? ' active' : ''}`;
    link.href = testsHref;
    link.dataset.testsLink = '';
    link.setAttribute('aria-current', isTestsPage ? 'page' : 'false');
    link.innerHTML = `<span class="ic">${getIconSvg('target')}</span>Тести`;
    mobileNav.append(link);
  }
}

function ensureMobileThemeToggle() {
  const mobileNav = document.getElementById('mobNav');
  if (!mobileNav) return;

  const existing = mobileNav.querySelector('.theme-toggle-btn');
  if (existing) return;

  const template = document.querySelector('.nav-right .theme-toggle-btn');
  if (!template) return;

  const clone = template.cloneNode(true);
  clone.classList.add('mob-theme-toggle');
  const header = mobileNav.querySelector('.mob-nav-header');
  if (header) {
    mobileNav.insertBefore(clone, header.nextSibling);
  } else {
    mobileNav.prepend(clone);
  }
}

function bindThemeButtons() {
  document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
    btn.removeEventListener('click', toggleTheme);
    btn.addEventListener('click', toggleTheme);
  });
}

function bindNavbarInteractions() {
  bindThemeButtons();
  document.querySelectorAll('.student-widget').forEach(widget => {
    widget.removeEventListener('click', openProfileModal);
    widget.addEventListener('click', openProfileModal);
  });
}

function initTestsNavigation() {
  if (!location.pathname.endsWith('/tests.html')) return;

  document.querySelector('.menu-toggle')?.addEventListener('click', openMobNav);
  document.querySelector('.mob-close-btn')?.addEventListener('click', closeMobNav);
  document.getElementById('mobOverlay')?.addEventListener('click', closeMobNav);
}

function ensureProfileModal() {
  if (document.getElementById('profileModal') || document.querySelector('[data-component="profile-modal"]')) {
    const currentCourse = getCourseMeta(getTargetCourse());
    const profileCourse = document.querySelector('#profileModal [data-course-label]');
    setCourseLabel(profileCourse, currentCourse);
    syncCourseSwitchers();
    updateProfileStats();
    return;
  }
  const closeIcon = getIconSvg('close');
  const studentIdentity = getStudentProfilePresentation();
  const currentCourse = getCourseMeta(getTargetCourse());
  document.body.insertAdjacentHTML('beforeend', `
    <div class="profile-modal-backdrop" id="profileModal" onclick="if(event.target===this)closeProfileModal()">
      <section class="profile-modal-card" role="dialog" aria-modal="true" aria-labelledby="profile-title">
        <div class="pm-topline">
          <div class="pm-eyebrow" id="profile-title">Student Profile</div>
          <button type="button" class="pm-close" onclick="closeProfileModal()" aria-label="Закрити">${closeIcon}</button>
        </div>
        <div class="pm-header">
          <div class="pm-avatar">S</div>
          <div>
            <div class="pm-name">${studentIdentity.name}</div>
            <div class="pm-path">${studentIdentity.status}</div>
            <div class="pm-path">Learning path: <b data-course-label></b></div>
          </div>
        </div>
        <div class="pm-stats-grid">
          <div class="pm-stat-box" data-profile-stat="xp"><div class="pm-stat-val" style="color:var(--it-green);"><span class="xp-val-display">0</span></div><div class="pm-stat-lbl">XP Points</div></div>
          <div class="pm-stat-box" data-profile-stat="streak"><div class="pm-stat-val" style="color:var(--it-gold);">1 day</div><div class="pm-stat-lbl">Daily Streak</div></div>
          <div class="pm-stat-box" data-profile-stat="lessons"><div class="pm-stat-val">0</div><div class="pm-stat-lbl">Lessons Completed</div></div>
          <div class="pm-stat-box" data-profile-stat="words"><div class="pm-stat-val">0</div><div class="pm-stat-lbl">Dictionary Words</div></div>
        </div>
        <div class="pm-footer">
          <a class="btn-primary" href="${getAuthPageHref()}">Sign in or register</a>
        </div>
      </section>
    </div>`);
  const profileModal = document.getElementById('profileModal');
  setCourseLabel(profileModal?.querySelector('[data-course-label]'), currentCourse);
  window.renderRegisteredIcons?.(profileModal);
}

function ensureCourseSwitcher() {
  const navRight = document.querySelector('.nav-right');
  if (!navRight) return;

  if (navRight.querySelector('[data-course-switcher]')) {
    syncCourseSwitchers();
    return;
  }

  // Course switching remains available in dedicated UI surfaces, but the compact
  // selector is intentionally not injected into the shared navbar.
  syncCourseSwitchers();
}

function syncCourseSwitchers() {
  const current = getTargetCourse();
  const courseOptions = getCourseCatalog();
  document.querySelectorAll('[data-course-switcher]').forEach(select => {
    select.innerHTML = courseOptions.map(course => {
      const label = `${course.flag || ''} ${course.id.toUpperCase()}`;
      return `<option value="${course.id}">${label}</option>`;
    }).join('');
    select.value = current;
  });
  document.querySelectorAll('[data-target-course-select]').forEach(select => {
    const courseOptions = getCourseCatalog();
    select.innerHTML = courseOptions.map(course => {
      const label = [course.flag || '', L(course.name || { uk: course.id, en: course.id })].filter(Boolean).join(' ');
      return `<option value="${course.id}">${label}</option>`;
    }).join('');
    select.value = current;
  });
}

async function updateProfileStats() {
  const lessonStat = document.querySelector('[data-profile-stat="lessons"] .pm-stat-val');
  const wordStat = document.querySelector('[data-profile-stat="words"] .pm-stat-val');
  if (!lessonStat && !wordStat) return;

  let totalLessons = 0;
  let completedLessons = 0;
  try {
    const loadedCourse = window.__LS_ACTIVE_COURSE_DATA || await window.loadCourse?.();
    const lessonIds = [];
    if (loadedCourse?.paths) {
      loadedCourse.paths.forEach(path => {
        path.units?.forEach(unit => {
          unit.lessons?.forEach(lesson => {
            lessonIds.push(lesson.id);
            totalLessons += 1;
            const lessonBest = localStorage.getItem(`ls_${getTargetCourse()}_lesson_${lesson.id}_best_xp`);
            if (lessonBest && Number(lessonBest) > 0) {
              completedLessons += 1;
            }
          });
        });
      });
    }
    if (lessonStat) {
      lessonStat.textContent = totalLessons ? `${completedLessons}/${totalLessons}` : '0';
    }
  } catch (error) {
    if (lessonStat) lessonStat.textContent = '0';
  }

  try {
    const vocab = await window.loadCourseData?.('vocab').catch(() => []);
    const allWords = Array.isArray(vocab) ? vocab : [];
    if (wordStat) {
      wordStat.textContent = String(allWords.length);
    }
  } catch (error) {
    if (wordStat) wordStat.textContent = '0';
  }
}

function getStudentProfile() {
  return LOCAL_STUDENT_PROFILE;
}

function getStudentProfilePresentation() {
  const profile = getStudentProfile();
  if (!profile.isAuthenticated) {
    return {
      name: 'Студент',
      status: 'Гостьовий профіль · прогрес зберігається на цьому пристрої'
    };
  }

  return {
    name: profile.displayName || 'Студент',
    status: profile.email || 'Профіль студента'
  };
}

async function refreshStudentSession() {
  try {
    const response = await fetch(window.getApiUrl('auth/me'), { credentials: 'include' });
    if (response.status === 401 || response.status === 404) {
      Object.assign(LOCAL_STUDENT_PROFILE, {
        isAuthenticated: false,
        displayName: '',
        email: ''
      });
      if (typeof window !== 'undefined' && window.Progress && typeof window.Progress.initSession === 'function') {
        window.Progress.initSession(null);
      }
    } else if (response.ok) {
      const result = await response.json();
      const user = result.user || {};
      Object.assign(LOCAL_STUDENT_PROFILE, {
        isAuthenticated: result.authenticated === true || Boolean(result.user),
        displayName: user.displayName || user.name || '',
        email: user.email || ''
      });

      const userId = user.id || user._id;
      if (userId && typeof window !== 'undefined' && window.Progress) {
        const importedKey = `ls_guest_imported_${userId}`;
        const alreadyImported = typeof localStorage !== 'undefined' && localStorage.getItem(importedKey) === 'true';

        if (!alreadyImported && typeof window.Progress.mergeGuestProgress === 'function') {
          await window.Progress.mergeGuestProgress(userId);
        } else if (typeof window.Progress.initSession === 'function') {
          window.Progress.initSession(user);
        }
      }
    }
  } catch (error) {
    console.warn('Could not refresh student session:', error.message);
  }

  updateXPDisplay();

  const presentation = getStudentProfilePresentation();

  // Update navbar student avatar and tooltip
  document.querySelectorAll('.student-widget').forEach(widget => {
    widget.setAttribute('title', presentation.name);
    const avatar = widget.querySelector('.student-avatar');
    if (avatar) {
      avatar.textContent = (presentation.name || 'S').trim().charAt(0).toUpperCase() || 'S';
    }
  });

  const profileModal = document.getElementById('profileModal');
  if (!profileModal) return;
  const name = profileModal.querySelector('.pm-header .pm-name');
  const status = profileModal.querySelector('.pm-header .pm-path');
  const action = profileModal.querySelector('.pm-footer a');
  if (name) name.textContent = presentation.name;
  if (status) status.textContent = presentation.status;
  if (action) {
    action.textContent = LOCAL_STUDENT_PROFILE.isAuthenticated ? 'Sign out' : 'Sign in with Google';
    action.href = LOCAL_STUDENT_PROFILE.isAuthenticated ? '#' : getAuthPageHref();
    action.onclick = LOCAL_STUDENT_PROFILE.isAuthenticated
      ? async event => {
          event.preventDefault();
          try {
            let csrfToken = null;
            const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]+)/);
            if (match) csrfToken = decodeURIComponent(match[1]);

            const headers = { 'Content-Type': 'application/json' };
            if (csrfToken) headers['x-csrf-token'] = csrfToken;

            const logoutResponse = await fetch(window.getApiUrl('auth/logout'), {
              method: 'POST',
              headers,
              credentials: 'include'
            });
            if (!logoutResponse.ok) throw new Error(`Sign out failed (${logoutResponse.status}).`);
            await refreshStudentSession();
          } catch (error) {
            if (status) status.textContent = 'Could not sign out. Please try again.';
            console.error('Could not sign out:', error);
          }
        }
      : null;
  }
}

function getAuthPageHref() {
  const pagesMarker = '/pages/';
  const pagesIndex = location.pathname.indexOf(pagesMarker);
  if (pagesIndex < 0) return 'pages/auth.html';

  const currentRoute = location.pathname.slice(pagesIndex + pagesMarker.length);
  const directoryDepth = currentRoute.split('/').length - 1;
  return `${'../'.repeat(directoryDepth)}auth.html`;
}

let profileScrollPosition = 0;

function lockProfilePageScroll() {
  if (document.documentElement.classList.contains('profile-modal-open')) return;

  profileScrollPosition = window.scrollY;
  document.documentElement.classList.add('profile-modal-open');
  document.body.classList.add('profile-modal-open');
  document.body.style.setProperty('--profile-scroll-top', `-${profileScrollPosition}px`);
}

function unlockProfilePageScroll() {
  document.documentElement.classList.remove('profile-modal-open');
  document.body.classList.remove('profile-modal-open');
  document.body.style.removeProperty('--profile-scroll-top');
  window.scrollTo(0, profileScrollPosition);
}

function openProfileModal() {
  ensureProfileModal();
  try {
    applySourceLanguageSettings();
  } catch (e) {
    console.error('Error applying language settings:', e);
  }
  lockProfilePageScroll();
  const modal = document.getElementById('profileModal');
  if (modal) {
    modal.classList.add('open');
  }
  refreshStudentSession().catch(error => {
    const status = modal?.querySelector('.pm-header .pm-path');
    if (status) status.textContent = 'Unable to load account status.';
    console.error('Could not load account session:', error);
  });
}

function closeProfileModal() {
  document.getElementById('profileModal')?.classList.remove('open');
  unlockProfilePageScroll();
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeProfileModal();
  }
});

// Visual audio button click handler (voice synthesis deactivated as requested)
function speak(text, btnElement) {
  const spokenText = typeof text === 'string' ? text.trim() : '';
  if (!spokenText || !('speechSynthesis' in window)) {
    if (btnElement && btnElement.classList) {
      btnElement.classList.add('audio-playing');
      setTimeout(() => btnElement.classList.remove('audio-playing'), 500);
    }
    return;
  }

  const voices = window.speechSynthesis.getVoices();
  const preferredLocale = window.__LS_ACTIVE_COURSE_DATA?.target?.tts || 'it-IT';
  const selectedVoice = voices.find(voice => voice.lang && voice.lang.toLowerCase() === preferredLocale.toLowerCase())
    || voices.find(voice => voice.lang && voice.lang.toLowerCase().startsWith(preferredLocale.split('-')[0].toLowerCase()))
    || voices.find(voice => voice.lang && voice.lang.toLowerCase().startsWith('it'))
    || voices[0];

  if (!selectedVoice) {
    if (btnElement && btnElement.classList) {
      btnElement.classList.add('audio-playing');
      setTimeout(() => btnElement.classList.remove('audio-playing'), 500);
    }
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(spokenText);
  utterance.lang = preferredLocale;
  utterance.voice = selectedVoice;
  if (btnElement && btnElement.classList) {
    btnElement.classList.add('audio-playing');
    utterance.onend = () => btnElement.classList.remove('audio-playing');
  }
  window.speechSynthesis.speak(utterance);
}

function initPageHeroNotices() {
  document.querySelectorAll('.page-hero[data-dismissible]').forEach(hero => {
    const inner = hero.querySelector('.page-hero-inner');
    const description = inner?.querySelector('p');
    if (!inner || !description) return;

    const label = inner.querySelector('.page-hero-label');
    const heading = inner.querySelector('h1');
    const hasRetainedContent = Array.from(inner.children).some(child =>
      child !== label && child !== heading && child !== description
    );
    const pagePath = window.location.pathname.replace(/\/+$/, '') || '/';
    const storageKey = `ls_page_intro_seen:${pagePath}`;
    const legacyHomeKey = pagePath.endsWith('/index.html') ? 'ls_home_intro_seen' : null;
    let hasSeenNotice = false;

    hero.classList.add('page-hero--notice');
    hero.setAttribute('aria-label', 'Introduction');

    let closeButton = hero.querySelector('.page-hero-close');
    if (!closeButton) {
      closeButton = document.createElement('button');
      closeButton.className = 'page-hero-close';
      closeButton.type = 'button';
      closeButton.setAttribute('aria-label', 'Close');
      closeButton.title = 'Close';
      closeButton.innerHTML = '<span aria-hidden="true">×</span>';
      hero.append(closeButton);
    }

    const dismissNotice = () => {
      hero.classList.add('page-hero--notice-dismissed');
      if (!hasRetainedContent) hero.hidden = true;
      try {
        localStorage.setItem(storageKey, 'true');
      } catch {}
    };

    try {
      hasSeenNotice = localStorage.getItem(storageKey) === 'true'
        || (legacyHomeKey && localStorage.getItem(legacyHomeKey) === 'true');
      localStorage.setItem(storageKey, 'true');
    } catch {}

    closeButton.addEventListener('click', dismissNotice);
    if (hasSeenNotice) dismissNotice();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initPageHeroNotices();
  bindNavbarInteractions();
  ensureTestsNavigation();
  initTestsNavigation();
  ensureProfileModal();
  ensureCourseSwitcher();
  refreshCurrentCourseConfig();
  updateXPDisplay();
  applySourceLanguageSettings();
  initTheme();
  refreshStudentSession().catch(() => {});
});

window.addEventListener('componentsLoaded', () => {
  bindNavbarInteractions();
  ensureCourseSwitcher();
  applySourceLanguageSettings();
  refreshCurrentCourseConfig();
  initTheme();
});

if (typeof window !== 'undefined') {
  window.addEventListener('progress:xp', () => updateXPDisplay());
  window.addEventListener('progress:changed', (e) => {
    if (e && e.detail && (e.detail.collection === 'profile' || e.detail.collection === 'daily')) {
      updateXPDisplay();
    }
  });
  window.addEventListener('progress:adapterChanged', () => updateXPDisplay());
}

// Explicitly register all public APIs on window object
if (typeof window !== 'undefined') {
  window.getTheme = getTheme;
  window.setTheme = setTheme;
  window.toggleTheme = toggleTheme;
  window.useSystemTheme = useSystemTheme;
  window.bindThemeButtons = bindThemeButtons;
  window.openProfileModal = openProfileModal;
  window.closeProfileModal = closeProfileModal;
  window.ensureProfileModal = ensureProfileModal;
  window.setSourceLanguage = setSourceLanguage;
  window.getSourceLanguage = getSourceLanguage;
  window.setTargetCourse = setTargetCourse;
  window.getTargetCourse = getTargetCourse;
  window.refreshCourseCatalog = refreshCourseCatalog;
  window.ensureCourseSwitcher = ensureCourseSwitcher;
  window.updateProfileStats = updateProfileStats;
  window.getStudentProfile = getStudentProfile;
  window.refreshStudentSession = refreshStudentSession;
  window.applySourceLanguageSettings = applySourceLanguageSettings;
  window.applyTargetCourseSettings = applyTargetCourseSettings;
  window.applyInterfaceLanguage = applyInterfaceLanguage;
}
