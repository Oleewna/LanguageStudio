(function () {
  const translations = {
    en: {
      'page.title': 'LanguageStudio — A little Italian, every day',
      'page.description': 'Build a daily Italian learning habit with short, practical lessons from LanguageStudio.',
      signIn: 'Sign in',
      startLearning: 'Start learning',
      placementTest: 'Take a placement test',
      languagePickerLabel: 'Choose what you want to learn',
      languageOptionItalian: 'Italian',
      languagePickerButton: 'Go',
      'hero.eyebrow': 'YOUR ITALIAN JOURNEY',
      'hero.titleFirst': 'A little Italian,',
      'hero.titleSecond': 'every day.',
      'hero.description': 'Real conversations start with small steps. Learn useful Italian in short, friendly lessons that fit your day.',
      'hero.noSignup': 'Free to explore · no account needed',
      'hero.note': 'Start speaking from lesson one',
      'illustration.language': 'ITALIAN · 01',
      'illustration.meaning': 'Good morning',
      'illustration.note': 'A new word every day',
      'benefits.label': 'A better way to learn',
      'benefits.timeTitle': 'Just a few minutes',
      'benefits.timeDescription': 'Small lessons that fit your day',
      'benefits.realLifeTitle': 'Made for real life',
      'benefits.realLifeDescription': 'Useful words and everyday situations',
      'benefits.pathTitle': 'Your pace, your path',
      'benefits.pathDescription': 'Keep track as you learn',
      'preview.eyebrow': 'LESSON ONE · PRIMO INCONTRO',
      'preview.artHeading': 'FIRST MEETING',
      'preview.artTranslation': 'Hi! How are you?',
      'preview.answerTranslation': 'I’m good, thanks!',
      'preview.titleFirst': 'Start with a simple',
      'preview.titleSecond': '“Ciao!”',
      'preview.description': 'Meet someone new, learn a few natural greetings, and try your first Italian conversation. No long grammar chapters before you get started.',
      'preview.link': 'Take a look inside',
      'steps.eyebrow': 'A LITTLE PRACTICE GOES A LONG WAY',
      'steps.heading': 'Your Italian, one small win at a time.',
      'steps.learnTitle': 'Learn something useful',
      'steps.learnDescription': 'Pick up everyday phrases with clear examples and friendly explanations.',
      'steps.practiceTitle': 'Try it for yourself',
      'steps.practiceDescription': 'Practice with quick exercises and flashcards whenever you have a moment.',
      'steps.progressTitle': 'See how far you go',
      'steps.progressDescription': 'Follow your learning path and celebrate every little bit of progress.',
      'cta.eyebrow': 'PRONTO? LET’S GO!',
      'cta.heading': 'Your first “Ciao!” is waiting.',
      'cta.description': 'Step into your learning space and start with lesson one.',
      'footer.tagline': 'A little Italian, every day.'
    },
    uk: {
      'page.title': 'LanguageStudio — Трохи італійської щодня',
      'page.description': 'Вивчайте італійську щодня з короткими практичними уроками LanguageStudio.',
      signIn: 'Увійти',
      startLearning: 'Почати навчання',
      placementTest: 'Пройти тест на визначення рівня',
      languagePickerLabel: 'Оберіть, що хочете вивчати',
      languageOptionItalian: 'Італійська',
      languagePickerButton: 'Перейти',
      'hero.eyebrow': 'ВАША ПОДОРОЖ ІТАЛІЙСЬКОЮ',
      'hero.titleFirst': 'Трохи італійської,',
      'hero.titleSecond': 'щодня.',
      'hero.description': 'Справжні розмови починаються з маленьких кроків. Вивчайте корисну італійську на коротких уроках, які легко вписати у свій день.',
      'hero.noSignup': 'Можна спробувати без реєстрації',
      'hero.note': 'Заговоріть уже з першого уроку',
      'illustration.language': 'ІТАЛІЙСЬКА · 01',
      'illustration.meaning': 'Доброго ранку',
      'illustration.note': 'Нове слово щодня',
      'benefits.label': 'Зручний спосіб навчатися',
      'benefits.timeTitle': 'Усього кілька хвилин',
      'benefits.timeDescription': 'Короткі уроки, які легко вписати у день',
      'benefits.realLifeTitle': 'Для справжнього життя',
      'benefits.realLifeDescription': 'Корисні слова та щоденні ситуації',
      'benefits.pathTitle': 'Ваш темп і ваш напрям',
      'benefits.pathDescription': 'Стежте за своїм прогресом',
      'preview.eyebrow': 'УРОК ПЕРШИЙ · PRIMO INCONTRO',
      'preview.artHeading': 'ПЕРШЕ ЗНАЙОМСТВО',
      'preview.artTranslation': 'Привіт! Як справи?',
      'preview.answerTranslation': 'Я в порядку, дякую!',
      'preview.titleFirst': 'Почніть із простого',
      'preview.titleSecond': '«Чао!»',
      'preview.description': 'Познайомтеся, вивчіть кілька природних привітань і спробуйте свою першу розмову італійською. Без довгих розділів граматики перед початком.',
      'preview.link': 'Зазирнути всередину',
      'steps.eyebrow': 'МАЛЕНЬКІ КРОКИ ДАЮТЬ ВЕЛИКИЙ РЕЗУЛЬТАТ',
      'steps.heading': 'Італійська — крок за кроком.',
      'steps.learnTitle': 'Вивчайте корисне',
      'steps.learnDescription': 'Запам’ятовуйте щоденні фрази з наочними прикладами та простими поясненнями.',
      'steps.practiceTitle': 'Практикуйтеся самостійно',
      'steps.practiceDescription': 'Виконуйте короткі вправи та повторюйте слова на картках, коли маєте вільну хвилину.',
      'steps.progressTitle': 'Бачте свій прогрес',
      'steps.progressDescription': 'Рухайтеся своїм навчальним напрямом і радійте кожному маленькому досягненню.',
      'cta.eyebrow': 'ГОТОВІ? ПОЧНІМО!',
      'cta.heading': 'На вас чекає перше «Чао!»',
      'cta.description': 'Заходьте до навчального простору та починайте з першого уроку.',
      'footer.tagline': 'Трохи італійської щодня.'
    }
  };

  function getDeviceLanguage() {
    return (navigator.language || '').toLowerCase().startsWith('uk') ? 'uk' : 'en';
  }

  function getPreferredLanguage() {
    const savedLanguage = localStorage.getItem('ls_source_language')
      || localStorage.getItem('ls_italian_source_language');
    if (savedLanguage === 'uk' || savedLanguage === 'en') return savedLanguage;
    return getDeviceLanguage();
  }

  function setPreferredLanguage(language) {
    const nextLanguage = language === 'uk' ? 'uk' : 'en';
    localStorage.setItem('ls_source_language', nextLanguage);
    localStorage.setItem('ls_italian_source_language', nextLanguage);
    applyLanguage(nextLanguage);
    applyTheme(getCurrentTheme());
    window.dispatchEvent(new CustomEvent('sourceLanguageChanged', { detail: { language: nextLanguage } }));
  }

  function getCurrentTheme() {
    const savedTheme = localStorage.getItem('ls_theme');
    if (savedTheme === 'dark' || savedTheme === 'light') return savedTheme;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function syncThemeButtonLabel() {
    const themeButton = document.getElementById('landingThemeToggle');
    if (!themeButton) return;

    const currentLanguage = getPreferredLanguage();
    const isDark = getCurrentTheme() === 'dark';
    const label = currentLanguage === 'uk'
      ? (isDark ? 'Світла' : 'Темна')
      : (isDark ? 'Light' : 'Dark');

    themeButton.textContent = label;
    themeButton.setAttribute('aria-label', currentLanguage === 'uk'
      ? (isDark ? 'Переключити на світлу тему' : 'Переключити на темну тему')
      : (isDark ? 'Switch to light theme' : 'Switch to dark theme'));
  }

  function applyTheme(nextTheme) {
    const normalizedTheme = nextTheme === 'dark' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', normalizedTheme);
    localStorage.setItem('ls_theme', normalizedTheme);
    syncThemeButtonLabel();
  }

  function applyLanguage(language) {
    const dictionary = translations[language] || translations.en;
    document.documentElement.lang = language;

    document.querySelectorAll('[data-i18n]').forEach((element) => {
      const translation = dictionary[element.dataset.i18n];
      if (translation !== undefined) element.textContent = translation;
    });

    document.querySelectorAll('[data-i18n-aria]').forEach((element) => {
      const translation = dictionary[element.dataset.i18nAria];
      if (translation !== undefined) element.setAttribute('aria-label', translation);
    });

    document.querySelectorAll('[data-i18n-content]').forEach((element) => {
      const translation = dictionary[element.dataset.i18nContent];
      if (translation !== undefined) element.setAttribute('content', translation);
    });

    const languageButton = document.getElementById('landingLanguageToggle');
    if (languageButton) {
      const label = language === 'uk' ? 'Українська' : 'English';
      languageButton.textContent = label;
      languageButton.setAttribute('aria-label', language === 'uk' ? 'Switch language to English' : 'Switch language to Ukrainian');
    }

    syncThemeButtonLabel();

    const select = document.getElementById('landingLanguageSelect');
    const button = document.querySelector('.language-picker-button');

    if (select && button) {
      const syncLanguageTarget = () => {
        button.href = select.value;
      };
      select.addEventListener('change', syncLanguageTarget);
      syncLanguageTarget();
    }
  }

  const languageButton = document.getElementById('landingLanguageToggle');
  if (languageButton) {
    languageButton.addEventListener('click', () => {
      const activeLanguage = getPreferredLanguage();
      setPreferredLanguage(activeLanguage === 'uk' ? 'en' : 'uk');
    });
  }

  const themeButton = document.getElementById('landingThemeToggle');
  if (themeButton) {
    themeButton.addEventListener('click', () => {
      const nextTheme = getCurrentTheme() === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme);
    });
  }

  window.addEventListener('sourceLanguageChanged', () => {
    applyLanguage(getPreferredLanguage());
  });

  applyTheme(getCurrentTheme());
  applyLanguage(getPreferredLanguage());
})();
