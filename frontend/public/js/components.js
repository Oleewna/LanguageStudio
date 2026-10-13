(function () {
  'use strict';

  const pathname = window.location.pathname.replace(/\\/g, '/');
  const pagesIndex = pathname.indexOf('/pages/');
  const PREFIX = pagesIndex === -1 ? '' : '../'.repeat(pathname.slice(pagesIndex + 7).split('/').length);
  const icon = name => `<span data-icon="${name}"></span>`;
  let loadingComponents;

  function localizeEmbeddedTemplate(template) {
    const replacements = [
      ['Learning paths', 'Напрями навчання'],
      ['Dictionary', 'Словник'],
      ['Basics · Lesson 1', 'Основи · Урок 1'],
      ['Communication basics', 'Основи спілкування'],
      ['Lesson 1 · Introduction', 'Урок 1 · Знайомство'],
      ['Browse all paths', 'Переглянути всі напрями'],
      ['Flashcards', 'Флешкартки'],
      ['Exercises', 'Вправи'],
      ['My dictionary', 'Мій словник'],
      ['Grammar guide', 'Довідник граматики'],
      ['Tests', 'Тести'],
      ['Main', 'Головне'],
      ['Practice', 'Практика'],
      ['Switch theme', 'Змінити тему'],
      ['Student profile', 'Профіль студента'],
      ['Student Profile', 'Профіль студента'],
      ['LanguageStudio home', 'Головна LanguageStudio'],
      ['Guest profile · progress is saved on this device', 'Гостьовий профіль · прогрес зберігається на цьому пристрої'],
      ['Learning path: ', 'Напрям навчання: '],
      ['Learning & Interface Settings', 'Налаштування навчання та інтерфейсу'],
      ['Language for translations & explanations', 'Мова перекладів та пояснень'],
      ['Target Course', 'Цільовий курс'],
      ['Interface Theme', 'Тема інтерфейсу'],
      ['XP Points', 'Очки XP'],
      ['Daily Streak', 'Щоденна серія'],
      ['Lessons Completed', 'Уроків пройдено'],
      ['Dictionary Words', 'Слів у словнику'],
      ['Sign in or register', 'Увійти або зареєструватися'],
      ['Close', 'Закрити'],
      ['Paths', 'Напрямки'],
      ['Grammar trainer', 'Тренажер граматики'],
      ['Situational exercises', 'Ситуаційні вправи'],
      ['All exercises and quizzes', 'Усі вправи та тести'],
      ['Greetings and basics (13 words)', 'Привітання та база (13 слів)'],
      ['My saved words', 'Мої збережені слова'],
      ['Your word bank', 'Ваш словниковий банк'],
      ['Grammar cheat sheets', 'Шпаргалки з граматики'],
      ['Search the word base', 'Пошук у базі слів'],
      ['Add your own word', 'Додати власне слово'],
      ['Definite articles', 'Означені артиклі'],
      ['Essere and Avere', 'Essere та Avere'],
      ['Tu vs Lei (Etiquette)', 'Tu vs Lei (Етикет)'],
      ['Active', 'Активний'],
      ['Menu', 'Меню'],
      ['Home', 'Головна']
    ];
    return replacements.reduce((result, [from, to]) => result.split(from).join(to), template);
  }

  const mobileLinks = [
    ['index.html', 'home', 'home', 'Home'],
    ['pages/path.html', 'path', 'paths', 'Learning paths'],
    ['pages/lesson.html?course=it&lesson=1.1', 'lesson-1', 'lesson', 'Basics · Lesson 1'],
    ['pages/flashcards.html', 'flashcards', 'flashcards', 'Flashcards'],
    ['pages/exercises.html', 'exercises', 'exercises', 'Exercises'],
    ['pages/dictionary.html', 'dictionary', 'dictionary', 'My dictionary'],
    ['pages/grammar.html', 'grammar', 'grammar', 'Grammar guide'],
    ['pages/tests.html', 'tests', 'tests', 'Tests']
  ];

  function mobileNavigation() {
    const links = mobileLinks.map(([href, key, iconName, label]) =>
      `<a href="${href}" class="mob-nav-link" data-nav="${key}"${key === 'tests' ? ' data-tests-link' : ''}><span class="ic">${icon(iconName)}</span>${label}</a>`
    );

    return `<div class="mob-overlay" id="mobOverlay"></div>
      <nav class="mob-nav" id="mobNav" aria-label="Mobile navigation">
        <div class="mob-nav-header"><a href="index.html" class="mob-nav-brand" aria-label="LanguageStudio home"><img src="assets/images/light_theme_logo.png" alt="LanguageStudio" class="brand-logo" /></a><button class="mob-close-btn" type="button" aria-label="Close">${icon('close')}</button></div>
        <button class="theme-toggle-btn" type="button" title="Switch theme" aria-label="Switch theme">${icon('moon')}<span class="mob-theme-label">Switch theme</span></button>
        <div class="mob-section-label">Main</div>${links.slice(0, 3).join('')}
        <div class="mob-section-label">Practice</div>${links.slice(3).join('')}
      </nav>`;
  }

  const dropdowns = [
    ['path', 'paths', 'Learning paths', [
      ['pages/lesson.html?course=it&lesson=1.1', 'lesson-1', 'lesson', 'Lesson 1 · Introduction'],
      ['pages/path.html', 'path', 'layers', 'Browse all paths']
    ]],
    ['flashcards', 'flashcards', 'Flashcards', [
      ['pages/flashcards.html', 'flashcards', 'greeting', 'Greetings and basics (13 words)'],
      ['pages/flashcards.html?topic=custom', '', 'star', 'My saved words']
    ]],
    ['exercises', 'exercises', 'Exercises', [
      ['pages/exercises.html', 'exercises', 'target', 'All exercises and quizzes'],
      ['pages/exercises.html?group=grammar', '', 'grammar', 'Grammar trainer'],
      ['pages/exercises.html?group=situational', '', 'chat', 'Situational exercises']
    ]],
    ['dictionary', 'dictionary', 'Dictionary', [
      ['pages/dictionary.html', 'dictionary', 'search', 'Search the word base'],
      ['pages/dictionary.html?add=1', '', 'add', 'Add your own word']
    ]],
    ['grammar', 'grammar', 'Grammar guide', [
      ['pages/grammar.html?tab=articoli', '', 'article', 'Definite articles'],
      ['pages/grammar.html?tab=verbi', '', 'verb', 'Essere and Avere'],
      ['pages/grammar.html?tab=cortesia', '', 'greeting', 'Tu vs Lei (Etiquette)']
    ]]
  ];

  function desktopNavigation() {
    const groups = dropdowns.map(([key, iconName, label, items]) => {
      const menuItems = items.map(([href, navKey, itemIcon, itemLabel]) =>
        `<a href="${href}" class="nav-dd-item"${navKey ? ` data-nav="${navKey}"` : ''}><span class="dd-icon">${icon(itemIcon)}</span>${itemLabel}</a>`
      ).join('');
      return `<div class="nav-dd"><a href="pages/${key}.html" class="nav-dd-btn" data-nav-btn="${key}">${icon(iconName)} ${label} ${icon('chevron-down')}</a><div class="nav-dd-menu">${menuItems}</div></div>`;
    }).join('');

    return `${groups}<a href="pages/tests.html" class="nav-dd-btn" data-nav-btn="tests" data-tests-link><span class="dd-icon">${icon('tests')}</span> Tests</a>`;
  }

  const EMBEDDED_COMPONENTS = {
    navbar: `${mobileNavigation()}<header class="topnav">
      <a href="index.html" class="nav-brand" aria-label="LanguageStudio home"><img src="assets/images/light_theme_logo.png" alt="LanguageStudio" class="brand-logo" /></a>
      <nav class="nav-links" aria-label="Main navigation">${desktopNavigation()}</nav>
      <div class="nav-right"><button class="theme-toggle-btn" type="button" title="Switch theme" aria-label="Switch theme">${icon('moon')}</button>
        <button type="button" class="student-widget" title="Student profile" aria-label="Student profile"><div class="student-stats"><div class="streak-badge">${icon('streak')}<span>1</span></div><div class="xp-badge">${icon('xp')}<span class="xp-val-display">0</span><span>XP</span></div></div><div class="student-avatar">S</div></button>
        <button class="menu-toggle" type="button" aria-label="Menu">${icon('menu')}</button>
      </div></header>`,
    'mobile-nav': mobileNavigation(),
    footer: `<footer class="site-footer"><div class="footer-inner"><div>${icon('cafe')} <b>LanguageStudio</b> · Italian for real-life situations</div><div class="footer-links">${mobileLinks.filter(([, key]) => key !== 'lesson-1').map(([href, key, , label]) => `<a href="${href}" data-nav="${key}">${label}</a>`).join('')}</div></div></footer>`,
    'profile-modal': `<div class="profile-modal-backdrop" id="profileModal" onclick="if(event.target===this)closeProfileModal()"><section class="profile-modal-card" role="dialog" aria-modal="true" aria-labelledby="profile-title"><div class="pm-topline"><div class="pm-eyebrow" id="profile-title">Student Profile</div><button type="button" class="pm-close" onclick="closeProfileModal()" aria-label="Close">${icon('close')}</button></div><div class="pm-header"><div class="pm-avatar">S</div><div><div class="pm-name">Student</div><div class="pm-path">Guest profile · progress is saved on this device</div><div class="pm-path">Learning path: <b data-course-label>Communication basics</b></div></div></div><section class="pm-settings" aria-labelledby="source-language-title"><h3 class="pm-settings-title" id="source-language-title">Learning & Interface Settings</h3><div class="pm-settings-grid"><div class="pm-setting"><label class="pm-setting-label" for="targetCourse">Target Course</label><select class="pm-setting-select" id="targetCourse" data-target-course-select onchange="setTargetCourse(this.value)"></select></div><div class="pm-setting"><label class="pm-setting-label" for="sourceLanguage">Language for translations & explanations</label><select class="pm-setting-select" id="sourceLanguage" data-source-language-select onchange="setSourceLanguage(this.value)"></select></div><div class="pm-setting"><div class="pm-setting-label">Interface Theme</div><button type="button" class="btn-ghost pm-theme-button" onclick="toggleTheme()">${icon('sun')} Switch theme</button></div></div></section><div class="pm-stats-grid"><div class="pm-stat-box" data-profile-stat="xp"><div class="pm-stat-val"><span class="xp-val-display">0</span></div><div class="pm-stat-lbl">XP Points</div></div><div class="pm-stat-box" data-profile-stat="streak"><div class="pm-stat-val">1 day</div><div class="pm-stat-lbl">Daily Streak</div></div><div class="pm-stat-box" data-profile-stat="lessons"><div class="pm-stat-val">0</div><div class="pm-stat-lbl">Lessons Completed</div></div><div class="pm-stat-box" data-profile-stat="words"><div class="pm-stat-val">0</div><div class="pm-stat-lbl">Dictionary Words</div></div></div><div class="pm-footer"><a class="btn-primary" href="pages/auth.html" data-nav="auth">Sign in or register</a></div></section></div>`,
    'auth-header': `<header class="auth-topbar"><a href="index.html" class="auth-brand" aria-label="LanguageStudio home"><img src="assets/images/light_theme_logo.png" alt="LanguageStudio" class="brand-logo" /></a><div class="auth-actions"><button class="theme-toggle-btn" type="button" title="Switch theme" aria-label="Switch theme">${icon('moon')}</button><a class="btn-ghost auth-home" href="index.html">${icon('arrow-left')} Home</a></div></header>`
  };

  function adaptPaths(html) {
    if (!PREFIX) return html;
    return html.replace(/(href|src)="([^"#:]+)"/g, (match, attr, url) => {
      if (/^(https?:|\/\/|javascript:)/.test(url)) return match;
      return `${attr}="${PREFIX}${url}"`;
    });
  }

  function getCurrentPageKey() {
    const path = window.location.pathname.toLowerCase().replace(/\\/g, '/');
    if (path.endsWith('/index.html') || path.endsWith('/')) return 'home';
    for (const key of ['lesson', 'flashcards', 'exercises', 'dictionary', 'grammar', 'tests', 'path', 'auth']) {
      if (path.includes(`${key}.html`)) return key === 'lesson' ? 'lesson' : key;
    }
    return '';
  }

  function highlightActiveLinks() {
    const pageKey = getCurrentPageKey();
    if (!pageKey) return;
    document.querySelectorAll(`[data-nav="${pageKey}"]`).forEach(link => link.classList.add('active'));
    document.querySelector(`[data-nav-btn="${pageKey}"]`)?.classList.add('active');
    if (pageKey === 'lesson') {
      document.querySelectorAll('[data-nav="lesson-1"]').forEach(link => link.classList.add('active'));
      document.querySelector('[data-nav-btn="path"]')?.classList.add('active');
    }
  }

  async function fetchComponent(name) {
    if (window.location.protocol !== 'file:') {
      try {
        const response = await fetch(`${PREFIX}components/${name}.html`);
        if (response.ok) return await response.text();
      } catch (error) {
        // Fall through to the embedded template when the component request fails.
      }
    }
    return EMBEDDED_COMPONENTS[name] ? localizeEmbeddedTemplate(EMBEDDED_COMPONENTS[name]) : '';
  }

  function ensureComponentTarget(id, name) {
    const target = document.getElementById(id);
    if (target && !target.querySelector('[data-component]')) {
      target.innerHTML = `<div data-component="${name}"></div>`;
    }
  }

  function bindEvents() {
    highlightActiveLinks();
    window.renderRegisteredIcons?.();
    window.updateXPDisplay?.();
    window.applySourceLanguageSettings?.();
    document.querySelectorAll('.menu-toggle').forEach(button => {
      button.removeEventListener('click', openMobNavProxy);
      button.addEventListener('click', openMobNavProxy);
    });
    document.querySelectorAll('.mob-close-btn').forEach(button => {
      button.removeEventListener('click', closeMobNavProxy);
      button.addEventListener('click', closeMobNavProxy);
    });
    const overlay = document.getElementById('mobOverlay');
    if (overlay) {
      overlay.removeEventListener('click', closeMobNavProxy);
      overlay.addEventListener('click', closeMobNavProxy);
    }
    document.querySelectorAll('[data-nav-btn]').forEach(button => {
      if (button.tagName !== 'BUTTON') return;
      button.addEventListener('click', () => {
        const key = button.getAttribute('data-nav-btn');
        window.location.href = `${PREFIX}${key === 'home' ? 'index.html' : `pages/${key}.html`}`;
      });
    });
    window.dispatchEvent(new CustomEvent('componentsLoaded'));
  }

  function openMobNavProxy() {
    if (typeof window.openMobNav === 'function') window.openMobNav();
    else {
      document.getElementById('mobNav')?.classList.add('open');
      document.getElementById('mobOverlay')?.classList.add('open');
    }
  }

  function closeMobNavProxy() {
    if (typeof window.closeMobNav === 'function') window.closeMobNav();
    else {
      document.getElementById('mobNav')?.classList.remove('open');
      document.getElementById('mobOverlay')?.classList.remove('open');
    }
  }

  async function loadComponents() {
    if (loadingComponents) await loadingComponents;
    const currentLoad = (async () => {
      await window.loadIconRegistry?.();
      ensureComponentTarget('app-nav', 'navbar');
      ensureComponentTarget('app-footer', 'footer');
      ensureComponentTarget('app-profile', 'profile-modal');

      if (!document.getElementById('profileModal') && !document.querySelector('[data-component="profile-modal"]')) {
        const profileHolder = document.createElement('div');
        profileHolder.dataset.component = 'profile-modal';
        document.body.appendChild(profileHolder);
      }

      const holders = Array.from(document.querySelectorAll('[data-component]'));
      await Promise.all(holders.map(async holder => {
        const name = holder.dataset.component;
        const html = await fetchComponent(name);
        if (html) holder.outerHTML = adaptPaths(html);
      }));
      bindEvents();
    })();
    loadingComponents = currentLoad;
    try {
      await currentLoad;
    } finally {
      if (loadingComponents === currentLoad) loadingComponents = null;
    }
  }

  window.LSComponents = { load: loadComponents, fetch: fetchComponent, prefix: PREFIX };

  if (document.querySelector('[data-component]')) loadComponents();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadComponents, { once: true });
  }
})();