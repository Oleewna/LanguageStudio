/**
 * LanguageStudio - Shared Helper Script
 */

const XP_KEY = 'ls_xp';
const DICT_KEY = 'ls_custom_dict';
const SOURCE_LANGUAGE_KEY = 'ls_italian_source_language';
const ORIGINAL_DOCUMENT_TITLE = document.title;
const SOURCE_LANGUAGES = [
  { code: 'device', uk: 'Мова пристрою', en: 'Device language' },
  { code: 'uk', uk: 'Українська', en: 'Ukrainian' },
  { code: 'en', uk: 'Англійська', en: 'English' }
];

const UI_TRANSLATIONS = {
  'Основи · Урок 1 · Знайомство': 'Basics · Lesson 1 · Introductions',
  'Основи спілкування · Урок 1': 'Communication basics · Lesson 1',
  'Основи спілкування ›': 'Communication basics ›',
  'Основи спілкування · Урок 1 — LanguageStudio, Італійська': 'Communication basics · Lesson 1 — LanguageStudio, Italian',
  'Знайомство — Come ti chiami?': 'Introductions — Come ti chiami?',
  'Сара приходить на свій перший урок італійської. У класі вона вітається, представляється та знайомиться з Анною.': 'Sara arrives for her first Italian lesson. In class, she greets Anna, introduces herself, and gets to know her.',
  'Студенти в італійському класі знайомляться': 'Students meeting in an Italian classroom',
  '📚 Розділи': '📚 Learning paths',
  '🃏 Флешкартки': '🃏 Flashcards',
  '✏️ Завдання': '✏️ Exercises',
  '📖 Словник': '📖 Dictionary',
  '🎮 Ігри': '🎮 Games',
  '📋 Довідник': '📋 Grammar guide',
  '🧭 Напрямки': '🧭 Learning paths',
  'Переглянути всі напрямки': 'View all learning paths',
  'Вправи до Уроку 1': 'Lesson 1 exercises',
  'Банк завдань': 'Question bank',
  '➕ Нове слово': '➕ New word',
  'Essere та Avere': 'Essere and Avere',
  'Alla stazione (На вокзалі та в аеропорту)': 'Alla stazione (At the train station and airport)',
  'In albergo (Заселення в готель)': 'In albergo (Checking into a hotel)',
  'Un caffè, per favore (У барі та кафе)': 'Un caffè, per favore (At the bar and café)',
  'Al ristorante (Замовлення в ресторані)': 'Al ristorante (Ordering at a restaurant)',
  'Lo shopping e i prezzi (Шопінг та ціни)': 'Lo shopping e i prezzi (Shopping and prices)',
  'In ufficio (Перший день в офісі)': 'In ufficio (First day at the office)',
  'Riunioni e appuntamenti (Зустрічі та домовленості)': 'Riunioni e appuntamenti (Meetings and appointments)',
  'Email e comunicazione scritta (Ділові листи)': 'Email e comunicazione scritta (Business emails)',
  'Networking e small talk (Спілкування з колегами)': 'Networking e small talk (Talking with colleagues)',
  'Навчальні юніти': 'Learning units',
  'Уроки напрямку «Основи»': 'Lessons in “Basics”',
  'Активний': 'Active',
  'Переглянути всі 4 розділи': 'View all 4 units',
  'Тренажер слів': 'Vocabulary trainer',
  'Привітання та база (13 слів)': 'Greetings and basics (13 words)',
  'Мої власні збережені слова': 'My saved words',
  'Практичні тести': 'Practice quizzes',
  'Щоденний бліц-тест': 'Daily quick quiz',
  'Вправи до цього уроку': 'Exercises for this lesson',
  'Пошук по базі слів': 'Search vocabulary',
  'Додати власне слово': 'Add a custom word',
  'Міні-ігри': 'Mini-games',
  'Світлофор привітань': 'Greeting traffic light',
  'Привітання за часом доби': 'Greetings by time of day',
  'Означені артиклі': 'Definite articles',
  'Привітання, знайомство, числа 0–100, дієслова essere & avere — база для будь-якого напрямку': 'Greetings, introductions, numbers 0–100, and the verbs essere & avere: a foundation for every learning path.',
  'Множинний вибір': 'Multiple choice',
  'Правда чи ні': 'True or false',
  'Встав слово': 'Fill in the word',
  'Перевірити завдання': 'Check answers',
  'Напрямок:': 'Learning path:',
  '1 день': '1 day',
  '[буон-джор-но]': '[bwon-JOR-no]',
  'ГОЛОВНЕ': 'MAIN',
  'Головне': 'Main',
  'Головна': 'Home',
  'LanguageStudio — Італійська для реальних ситуацій': 'LanguageStudio — Italian for real-life situations',
  'Мій профіль студента': 'My student profile',
  'Розділи': 'Learning paths',
  '← Головна': '← Home',
  'Розділ 1 · Урок 1': 'Unit 1 · Lesson 1',
  'РОЗДІЛ 1 · УРОК 1': 'UNIT 1 · LESSON 1',
  'Сара приходить на свій перший урок італійської. На рецепції вона вітається, представляється та знайомиться з Анною.': 'Sara arrives for her first Italian lesson. At reception, she greets Anna, introduces herself, and gets to know her.',
  'Слово': 'Word',
  'Нотатка:': 'Note:',
  '[ко-ме ті к’я-мі]': '[KOH-meh tee KYAH-mee]',
  '[мі к’я-мо Са-ра. е ту]': '[mee KYAH-moh SAH-rah. eh too]',
  '[і-о со-но Ан-на. п’я-че-ре]': '[EE-oh SOH-noh AHN-nah. pyah-CHEH-reh]',
  '[п’я-че-ре, Ан-на]': '[pyah-CHEH-reh, AHN-nah]',
  '[сей ну-о-ва куі]': '[say noo-OH-vah kwee]',
  '[сі, со-но ну-о-ва]': '[see, SOH-noh noo-OH-vah]',
  '[бен-ве-ну-та аль кор-со ді іта-лья-но]': '[ben-veh-NOO-tah al KOR-soh dee ee-tah-LYAH-noh]',
  '[пре-го. буо-на ле-цьо-не]': '[PREH-goh. BWOH-nah leh-CHOH-neh]',
  '[гра-цьє, буо-на джор-на-та]': '[GRAHTS-yeh, BWOH-nah JOR-nah-tah]',
  '[ко-ме ті к’я-мі]': '[KOH-meh tee KYAH-mee]',
  '[мі к’я-мо]': '[mee KYAH-moh]',
  '[і-о со-но]': '[EE-oh SOH-noh]',
  '[п’я-че-ре]': '[pyah-CHEH-reh]',
  '[сей ну-о-ва]': '[say noo-OH-vah]',
  '[бен-ве-ну-та]': '[ben-veh-NOO-tah]',
  '[гра-цьє]': '[GRAHTS-yeh]',
  '[пре-го]': '[PREH-goh]',
  '[буо-на ле-цьо-не]': '[BWOH-nah leh-CHOH-neh]',
  'Раунд:': 'Round:',
  'Рахунок:': 'Score:',
  'очок': 'points',
  'Гра завершена!': 'Game complete!',
  'Ви набрали': 'You scored',
  'і заробили +50 XP!': 'and earned +50 XP!',
  'Грати знову': 'Play again',
  '✨ Правильно! (+20 очок)': '✨ Correct! (+20 points)',
  'Помилка! Правильно:': 'Incorrect! Correct answer:',
  '· Corso di Italiano A0–A1': '· Italian for real-life situations',
  'Напрямки навчання — LanguageStudio': 'Learning paths — LanguageStudio',
  'Флешкартки — LanguageStudio': 'Flashcards — LanguageStudio',
  'Завдання — LanguageStudio': 'Exercises — LanguageStudio',
  'Власний словник — LanguageStudio': 'My dictionary — LanguageStudio',
  'Ігри — LanguageStudio': 'Games — LanguageStudio',
  'Довідник граматики — LanguageStudio': 'Grammar guide — LanguageStudio',
  'Розділ 1 · Урок 1 — LanguageStudio, Італійська': 'Unit 1 · Lesson 1 — LanguageStudio, Italian',
  '· Італійська для реальних ситуацій': '· Italian for real-life situations',
  'Напрямки навчання': 'Learning paths',
  'Основи · Урок 1': 'Basics · Lesson 1',
  'ПРАКТИКА': 'PRACTICE',
  'Практика': 'Practice',
  'Флешкартки': 'Flashcards',
  'Завдання': 'Exercises',
  'Власний словник': 'My dictionary',
  'Ігри': 'Games',
  'Довідник граматики': 'Grammar guide',
  'Напрямки': 'Learning paths',
  'Словник': 'Dictionary',
  'Довідник': 'Grammar guide',
  'Профіль студента': 'Student profile',
  'Студент LanguageStudio': 'LanguageStudio student',
  'Рівень:': 'Level:',
  'Налаштування навчання італійської': 'Italian learning settings',
  'Мова перекладу та пояснень': 'Interface and translation language',
  'Мова пристрою': 'Device language',
  'Очок XP': 'XP points',
  'Ударний темп (Streak)': 'Streak',
  'Пройдено уроків': 'Lessons completed',
  'Слів у словнику': 'Words in dictionary',
  'Закрити': 'Close',
  'Мобільне меню': 'Mobile navigation',
  'Головна навігація': 'Main navigation',
  'Меню': 'Menu',
  'Зміст розділу': 'Unit contents',
  'Аудіо (візуальний режим)': 'Audio (visual mode)',
  'Перемішати': 'Shuffle',
  'Натисніть, щоб позначити як вивчене': 'Click to mark as learned',
  'Аудіо': 'Audio',
  '🇮🇹 Італійська для реальних ситуацій': '🇮🇹 Italian for real-life situations',
  'Оберіть напрямок, що відповідає вашій меті — подорожі, робота чи бізнес — і вивчайте саме ту італійську, яка вам справді потрібна.': 'Choose a path that fits your goals, from travel to work and business, and learn the Italian you actually need.',
  'Оберіть свою мету': 'Choose your goal',
  '3D тренажер': '3D practice deck',
  'Бліц-тести': 'Quick quizzes',
  'Власні слова': 'Your saved words',
  'Міні-тренажер': 'Mini-game',
  'Таблиці правил': 'Grammar reference',
  'Усі напрямки →': 'All learning paths →',
  'Розпочати ▶': 'Start ▶',
  'Обрати свою мету': 'Choose your goal',
  'Оберіть свою мету': 'Choose your goal',
  'Кожен напрямок будує словниковий запас і фрази навколо конкретної ситуації — від подорожі до перемовин в офісі. Почніть з основ, а тоді переходьте до свого напрямку.': 'Each learning path builds vocabulary and phrases around a real situation, from travel to office meetings. Start with the basics, then choose your path.',
  '🟢 Основи спілкування · Активний': '🟢 Communication basics · Active',
  'Основи спілкування': 'Communication basics',
  'Привітання, знайомство, числа 0–100, дієслова essere & avere — база для будь-якого напрямку': 'Greetings, introductions, numbers 0–100, and the verbs essere & avere: a foundation for every path.',
  'Привітання, перший діалог у Мілані, знайомство та базові дієслова — фундамент, потрібний для будь-якого напрямку нижче': 'Greetings, your first dialogue in Milan, introductions, and essential verbs: a foundation for every path below.',
  'Урок 1.1 · Доступно': 'Lesson 1.1 · Available',
  'Урок 1': 'Lesson 1',
  'Урок 2': 'Lesson 2',
  'Урок 3': 'Lesson 3',
  'Урок 4': 'Lesson 4',
  'Урок 5': 'Lesson 5',
  'Знайомство — «Come ti chiami?»': 'Introductions — “Come ti chiami?”',
  'Перший діалог у міланському класі, нові слова, культура розмови': 'Your first dialogue in a Milan classroom, new words, and conversation customs.',
  '~15 хв': '~15 min',
  'Урок 1.2 · Скоро': 'Lesson 1.2 · Coming soon',
  'Come ti chiami? (Знайомство)': 'Come ti chiami? (Introductions)',
  'Come ti chiami? (Як тебе звати?)': 'Come ti chiami? (What is your name?)',
  'Як запитати ім\'я, дієслово chiamarsi, формули ввічливості': 'How to ask someone’s name, the verb chiamarsi, and polite expressions.',
  'Знайомство, дієслово chiamarsi, формули ввічливості': 'Introductions, the verb chiamarsi, and polite expressions.',
  'Скоро': 'Coming soon',
  'Урок 1.3 · Скоро': 'Lesson 1.3 · Coming soon',
  'Di dove sei? (Звідки ти?)': 'Di dove sei? (Where are you from?)',
  'Країни, національності, відмінювання дієслова essere': 'Countries, nationalities, and conjugating essere.',
  'Урок 1.4 · Скоро': 'Lesson 1.4 · Coming soon',
  'I numeri e l\'età (Числа та вік)': 'I numeri e l’età (Numbers and age)',
  'Рахунок 0–100, дієслово avere, номер телефону': 'Counting from 0 to 100, the verb avere, and phone numbers.',
  '~20 хв': '~20 min',
  'Урок 1.5 · Скоро': 'Lesson 1.5 · Coming soon',
  'La mia scena · Підсумок напрямку': 'La mia scena · Path review',
  'La mia scena · Підсумкова практика': 'La mia scena · Final practice',
  'Комплексний тест та створення власної сценки діалогу': 'A review quiz and creating your own dialogue scene.',
  'Комплексний тест та створення власного діалогу': 'A review quiz and creating your own dialogue.',
  '~25 хв': '~25 min',
  '🔒 Скоро': '🔒 Coming soon',
  '🎓 Підсумок': '🎓 Review',
  '🔒 Незабаром': '🔒 Coming soon',
  '1/5 уроків відкрито': '1/5 lessons available',
  'LanguageStudio · Італійська для реальних ситуацій': 'LanguageStudio · Italian for real-life situations',
  'Всі розділи курсу': 'All course units',
  '▶ Відкрити': '▶ Open',
  'Туристична італійська': 'Italian for travel',
  'Готелі, ресторани, транспорт, шопінг та фрази на випадок форс-мажору в подорожі': 'Hotels, restaurants, transport, shopping, and phrases for travel emergencies.',
  '🔒 Заблоковано': '🔒 Locked',
  'Італійська для роботи та бізнесу': 'Italian for work and business',
  '💼 Італійська для роботи та бізнесу': '💼 Italian for work and business',
  'Офісне спілкування, зустрічі, електронні листи та small talk з колегами': 'Office conversations, meetings, emails, and small talk with colleagues.',
  'Ділові зустрічі, електронні листи, small talk з колегами та професійна лексика': 'Business meetings, emails, small talk with colleagues, and professional vocabulary.',
  'Словниковий тренажер': 'Vocabulary trainer',
  'Фільтруйте слова за напрямком навчання чи тематикою. Перевертайте картку та тренуйте пам\'ять.': 'Filter words by learning path or topic. Flip each card to practice recall.',
  '🧭 Напрямок': '🧭 Learning path',
  'Усі напрямки': 'All learning paths',
  'Всі тематики': 'All topics',
  '👋 Основи': '👋 Basics',
  '👋 Основи спілкування': '👋 Communication basics',
  '🧳 Туристична італійська': '🧳 Italian for travel',
  '💼 Робота та бізнес': '💼 Work and business',
  '👋 Привітання': '👋 Greetings',
  '🔤 Базові фрази': '🔤 Basic phrases',
  '⭐ Власні збережені': '⭐ Saved words',
  '🔤 Базове': '🔤 Basics',
  '⭐ Власне': '⭐ Custom',
  '👆 Натисніть, щоб побачити переклад': '👆 Tap to reveal the translation',
  '👆 Натисніть знову для звороту': '👆 Tap again to flip back',
  '← Назад': '← Previous',
  'Вперед →': 'Next →',
  'Для цього напрямку слова ще готуються — спробуйте «Основи спілкування» або власні збережені слова.': 'Words for this path are coming soon. Try Communication basics or your saved words.',
  'Практика & Перевірка': 'Practice & Review',
  'Завдання та Тести': 'Exercises & Quizzes',
  'Практикуйте італійську в конкретних ситуаціях. Почніть із першого знайомства в будинку та закріпіть потрібні фрази в різних форматах.': 'Practice Italian in real situations. Start with a first meeting in an apartment building and review useful phrases in different formats.',
  'Ситуація · Основи спілкування': 'Situation · Communication basics',
  'Перший день у будинку': 'First day in the apartment building',
  'Привітання, коротке знайомство та ввічливі відповіді під час зустрічі з сусідами.': 'Greetings, a brief introduction, and polite replies when meeting your neighbors.',
  'Вправи за ситуацією': 'Exercises by situation',
  '🧠 Вибір відповіді': '🧠 Multiple choice',
  '✍️ Заповни пропуск': '✍️ Fill in the blank',
  '🔗 Зіставлення': '🔗 Matching',
  '🔀 Порядок слів': '🔀 Word order',
  '🌐 Переклад': '🌐 Translation',
  '📖 Зі словника': '📖 Dictionary quiz',
  '🔊 Аудіювання': '🔊 Listening',
  '💬 Діалог': '💬 Dialogue',
  'Питання 1 з 4': 'Question 1 of 4',
  'Питання 2 з 4': 'Question 2 of 4',
  'Питання 3 з 4': 'Question 3 of 4',
  'Питання 4 з 4': 'Question 4 of 4',
  'Заповніть пропуск': 'Fill in the blank',
  'Перекладіть італійською': 'Translate into Italian',
  'Зіставте слова з перекладом': 'Match the words with their translations',
  'Складіть речення': 'Build the sentence',
  'Перевірити': 'Check',
  'Скинути': 'Reset',
  'Перевірте себе': 'Check yourself',
  'Словник за темами й ситуаціями': 'Words by topic and situation',
  'Слова за темами й ситуаціями': 'Words by topic and situation',
  'Знаходьте слова за темою чи ситуацією, зберігайте нову лексику з уроків і власного життя та тренуйте її у флешкартках.': 'Find words by topic or situation, save vocabulary from lessons and daily life, and practice it with flashcards.',
  'Пошук слова чи перекладу...': 'Search for a word or translation...',
  'Впишіть слово...': 'Enter a word...',
  'Італійською...': 'In Italian...',
  'встав ім’я': 'enter a name',
  'встав слово': 'enter a word',
  'напр. arrivederci': 'e.g. arrivederci',
  'напр. до побачення': 'e.g. goodbye',
  'напр. ар-рі-ве-дер-чі': 'e.g. ah-ree-veh-der-chee',
  'напр. привітання, їжа, числа': 'e.g. greetings, food, numbers',
  'напр. Урок 1.1': 'e.g. Lesson 1.1',
  'Усі теми й ситуації': 'All topics and situations',
  'Усі уроки': 'All lessons',
  'Усі типи': 'All types',
  'ввічливість': 'politeness',
  'житло й будинок': 'housing and home',
  'короткі відповіді': 'short answers',
  'перший день': 'first day',
  'привітання та знайомство': 'greetings and introductions',
  'Привітання': 'Greeting',
  'Фраза': 'Phrase',
  'Іменник': 'Noun',
  'Дієслово': 'Verb',
  'Прикметник': 'Adjective',
  'Інше': 'Other',
  '➕ Додати нове слово': '➕ Add a word',
  'Слів не знайдено': 'No words found',
  'Позначити як вивчене': 'Mark as learned',
  'Вивчено': 'Learned',
  'Нове слово': 'New word',
  'Італійське слово чи фраза *': 'Italian word or phrase *',
  'Український переклад *': 'Translation *',
  'Транскрипція (необов\'язково)': 'Pronunciation (optional)',
  'Тип слова': 'Part of speech',
  'Категорія': 'Category',
  'Урок (необов\'язково)': 'Lesson (optional)',
  'Скасувати': 'Cancel',
  'Зберегти (+25 XP)': 'Save (+25 XP)',
  '(до дівчини)': '(addressing a woman)',
  '«Piacere di conoscerti, ___!» (до дівчини)': '“Piacere di conoscerti, ___!” (addressing a woman)',
  '🔄 Перемішати заново': '🔄 Shuffle again',
  'Тест генерується з базових слів і ваших власних слів із «Власного словника».': 'The quiz uses built-in words and your saved dictionary words.',
  '🎲 Згенерувати тест': '🎲 Generate quiz',
  'Питання 1 з 5': 'Question 1 of 5',
  'Питання 2 з 5': 'Question 2 of 5',
  'Питання 3 з 5': 'Question 3 of 5',
  'Питання 4 з 5': 'Question 4 of 5',
  'Питання 5 з 5': 'Question 5 of 5',
  'Аудіювання 1 з 3': 'Listening 1 of 3',
  'Аудіювання 2 з 3': 'Listening 2 of 3',
  'Аудіювання 3 з 3': 'Listening 3 of 3',
  'Діалог 1': 'Dialogue 1',
  'Діалог 2': 'Dialogue 2',
  '👤 А: «Ciao! Come stai?»': '👤 A: “Ciao! Come stai?”',
  '👤 А: «Benvenuto nel nostro palazzo!»': '👤 A: “Benvenuto nel nostro palazzo!”',
  'Ігровий тренажер': 'Game practice',
  'Мовні Ігри': 'Language games',
  'Тренуйте швидкість реакції, інтуїтивне розуміння ситуацій та поповнюйте свій словниковий запас.': 'Practice quick reactions, understand situations intuitively, and build your vocabulary.',
  '🚦 Міні-гра на швидкість': '🚦 Speed mini-game',
  'Оберіть відповідне італійське привітання для ситуації:': 'Choose the Italian greeting that fits the situation:',
  '☀️ 09:30 ранку, зустріч із сусідом у під\'їзді': '☀️ 9:30 a.m., meeting a neighbor in the apartment building',
  'Раунд: 1/5': 'Round: 1/5',
  'Рахунок: 0 очок': 'Score: 0 points',
  'Незабаром': 'Coming soon',
  'Знаходьте пари італійських та українських слів на полі карток.': 'Find matching Italian and English word pairs on the cards.',
  'Симулятор замовлення кави та круасанів у міланському барі на час.': 'A timed simulation of ordering coffee and croissants at a Milanese bar.',
  'Граматичні шпаргалки': 'Grammar quick reference',
  'Швидкий доступ до ключових правил італійської мови рівня A1: артиклі, форми дієслів та етикетні вирази.': 'Quick access to essential Italian grammar: articles, verb forms, and polite expressions.',
  '☀️ Привітання': '☀️ Greetings',
  '📰 Артиклі': '📰 Articles',
  '🤝 Tu vs Lei': '🤝 Tu vs Lei',
  'Фраза': 'Phrase',
  'Вимова': 'Pronunciation',
  'Переклад': 'Translation',
  'Коли вживати': 'When to use',
  'Добрий ранок / Добрий день': 'Good morning / Good day',
  'Зранку до ~13:00–14:00': 'From the morning until about 1–2 p.m.',
  'Добрий день (після обіду)': 'Good afternoon',
  'З 14:00 до ~17:00': 'From 2 p.m. to about 5 p.m.',
  'Добрий вечір': 'Good evening',
  'Після 17:00': 'After 5 p.m.',
  'Добраніч': 'Good night',
  'Тільки перед сном (прощання)': 'Only before going to sleep (as a farewell)',
  'Привіт / Бувай': 'Hello / Goodbye',
  'Універсально для друзів та знайомих': 'Informal; used with friends and acquaintances',
  'Вітаю!': 'Hello!',
  'Нейтральне вітання в будь-який час': 'A neutral greeting for any time of day',
  '💡 Важливо: «Buonanotte» кажуть виключно тоді, коли хтось іде спати. Якщо ви просто прощаєтесь ввечері на вулиці, кажіть «Buonasera» або «Arrivederci!».': '💡 Note: Say “Buonanotte” only when someone is going to bed. For an evening farewell, use “Buonasera” or “Arrivederci!”.',
  'РІД / ЧИСЛО': 'GENDER / NUMBER',
  'ПЕРЕД ПРИГОЛОСНИМИ': 'BEFORE CONSONANTS',
  'ПЕРЕД S+ПРИГОЛ., Z, GN, PS': 'BEFORE S+CONSONANT, Z, GN, PS',
  'ПЕРЕД ГОЛОСНИМИ': 'BEFORE VOWELS',
  'Чоловічий (однина)': 'Masculine (singular)',
  'Чоловічий (множина)': 'Masculine (plural)',
  'Жіночий (однина)': 'Feminine (singular)',
  'Жіночий (множина)': 'Feminine (plural)',
  '💡 Зверніть увагу: Перед голосними в однині артиклі lo та la скорочуються до l\' (l\'albergo, l\'ora).': '💡 Note: Before a vowel in the singular, lo and la shorten to l’ (l’albergo, l’ora).',
  'ОСОБА': 'PERSON',
  'ESSERE (БУТИ)': 'ESSERE (TO BE)',
  'AVERE (МАТИ)': 'AVERE (TO HAVE)',
  'ПРИКЛАД ВИКОРИСТАННЯ': 'EXAMPLE',
  'io (я)': 'io (I)',
  'tu (ти)': 'tu (you, informal)',
  'lui / lei (він / вона)': 'lui / lei (he / she)',
  'noi (ми)': 'noi (we)',
  'voi (ви)': 'voi (you, plural)',
  'loro (вони)': 'loro (they)',
  '💡 Вік в італійській мові: Вік виражається через дієслово avere (мати): «Ho 25 anni» (Мені 25 років, дослівно «Я маю 25 років»).': '💡 Age in Italian: Use avere (to have) to state age: “Ho 25 anni” literally means “I have 25 years.”',
  'СИТУАЦІЯ': 'SITUATION',
  'НЕФОРМАЛЬНО (НА «ТИ» — TU)': 'INFORMAL (TU)',
  'ВВІЧЛИВО (НА «ВИ» — LEI)': 'FORMAL (LEI)',
  'Як справи?': 'How are you?',
  'Як звати?': 'What is your name?',
  'Звідки ви?': 'Where are you from?',
  'Вибачте': 'Excuse me',
  'Прощання': 'Farewell',
  'Діалог на рецепції': 'Reception desk dialogue',
  'Нові слова': 'New words',
  'Маленька культурна нотатка': 'Culture note',
  'Що варто запам’ятати': 'Key takeaways',
  'Завдання уроку': 'Lesson exercises',
  'Множинний вибір': 'Multiple choice',
  'Правда чи ні': 'True or false',
  'Встав слово': 'Fill in the word',
  'Перевірити завдання': 'Check answers',
  'Тільки': 'Only',
  'перед сном (прощання)': 'before bedtime (farewell)',
  '💡 Важливо:': '💡 Note:',
  '«Buonanotte» кажуть виключно тоді, коли хтось іде спати. Якщо ви просто прощаєтесь ввечері на вулиці, кажіть «Buonasera» або «Arrivederci!».': '“Buonanotte” is only said when someone is going to bed. For an evening farewell, use “Buonasera” or “Arrivederci!”.',
  'Рід / Число': 'Gender / Number',
  'Перед приголосними': 'Before consonants',
  'Перед s+пригол., z, gn, ps': 'Before s+consonant, z, gn, ps',
  'Перед голосними': 'Before vowels',
  'Чоловічий': 'Masculine',
  'Жіночий': 'Feminine',
  '(однина)': '(singular)',
  '(множина)': '(plural)',
  '💡 Зверніть увагу:': '💡 Note:',
  'Перед голосними в однині артиклі': 'In the singular, before a vowel, the articles',
  'скорочуються до': 'shorten to',
  'Особа': 'Person',
  'Essere (бути)': 'Essere (to be)',
  'Avere (мати)': 'Avere (to have)',
  'Приклад використання': 'Example',
  '(я)': '(I)',
  '(ти)': '(you, informal)',
  '(він / вона)': '(he / she)',
  '(ми)': '(we)',
  '(ви)': '(you, plural)',
  '(вони)': '(they)',
  '💡 Вік в італійській мові:': '💡 Age in Italian:',
  'Вік виражається через дієслово': 'Age is expressed using the verb',
  '(мати):': '(to have):',
  ' (Мені 25 років, дослівно «Я маю 25 років»).': ' (I am 25 years old, literally “I have 25 years.”)',
  'Ситуація': 'Situation',
  'Неформально (на «ти» — tu)': 'Informal (tu)',
  'Ввічливо (на «Ви» — Lei)': 'Formal (Lei)',
  '[буон-джор-но]': '[bwon-JOR-no]',
  '[буон по-ме-рід-джо]': '[bwon po-me-RID-jo]',
  '[буо-на-се-ра]': '[bwo-na-SEH-ra]',
  '[буо-на-нот-те]': '[bwo-na-NOT-teh]',
  '[ча-о]': '[chow]',
  '[саль-ве]': '[SAHL-veh]',
  'Corso di Italiano · A0–A1': 'Italian course · Foundations',
  'Розділ 1 · Il primo giorno': 'Unit 1 · Il primo giorno',
  'Урок 1 · Знайомство': 'Lesson 1 · Introductions',
  'Урок 2 · Come ti chiami?': 'Lesson 2 · Come ti chiami?',
  'Урок 3 · Di dove sei?': 'Lesson 3 · Di dove sei?',
  'Урок 4 · Consolidazione': 'Lesson 4 · Review',
  'Урок 5 · La mia scena': 'Lesson 5 · La mia scena',
  'Розділ 2 · Al bar': 'Unit 2 · Al bar',
  'Розділ 3 · In città': 'Unit 3 · In città',
  'Розділ 4 · La mia famiglia': 'Unit 4 · La mia famiglia',
  'Розділ 1': 'Unit 1',
  'Розділ 1 ›': 'Unit 1 ›',
  'Урок 1.1 · Знайомство': 'Lesson 1.1 · Introductions',
  'Усі уроки →': 'All lessons →',
  '☕ LanguageStudio · Corso di Italiano A0–A1': '☕ LanguageStudio · Italian for real-life situations',
  '· Corso di Italiano A0–A1': '· Italian for real-life situations',
  '☕ LanguageStudio · Італійська для реальних ситуацій': '☕ LanguageStudio · Italian for real-life situations',
  'Розділи (Units)': 'Learning paths',
  '📘 Урок 1.1': '📘 Lesson 1.1',
  'Урок 1.1': 'Lesson 1.1',
  '🏷 привітання та знайомство': '🏷 greetings and introductions',
  '🏷 ввічливість': '🏷 politeness',
  '🏷 короткі відповіді': '🏷 short answers',
  '🏷 перший день': '🏷 first day',
  '🏷 житло й будинок': '🏷 housing and home',
  'А) Benvenuto': 'A) Benvenuto',
  'Б) Benvenuta': 'B) Benvenuta',
  'В) Buonasera': 'C) Buonasera',
  '[ко-ме стай]': '[KOH-meh sty]',
  '[бе-не]': '[BEH-neh]',
  '[гра-цьє]': '[GRAHTS-yeh]',
  '[пре-го]': '[PREH-go]',
  '[сі]': '[see]',
  '[но]': '[noh]',
  '[ан-кі-о]': '[ahn-KEE-oh]',
  '[ну-о-во/ва]': '[noo-OH-voh/vah]',
  '[прі-мо джор-но]': '[PREE-mo JOR-no]',
  '[бен-ве-ну-то/та]': '[ben-veh-NOO-toh/tah]',
  '[па-лац-цо]': '[pah-LAHTS-tsoh]',
  '[гра-цьє міл-ле]': '[GRAHTS-yeh MEEL-leh]'
};

const originalInterfaceText = new WeakMap();
const originalInterfaceAttributes = new WeakMap();

const SOURCE_TRANSLATIONS = {
  'lesson.greeting.1': { uk: 'Доброго дня!', en: 'Good morning!' },
  'lesson.greeting.2': { uk: 'Доброго дня! Як тебе звати?', en: 'Good morning! What is your name?' },
  'lesson.greeting.3': { uk: 'Мене звати Сара. А тебе?', en: 'My name is Sara. And you?' },
  'lesson.greeting.4': { uk: 'Я Анна. Приємно познайомитися!', en: "I'm Anna. Nice to meet you!" },
  'lesson.greeting.5': { uk: 'Приємно, Анно!', en: 'Nice to meet you, Anna!' },
  'lesson.greeting.6': { uk: 'Ти тут новенька?', en: 'Are you new here?' },
  'lesson.greeting.7': { uk: 'Так, я новенька.', en: "Yes, I'm new here." },
  'lesson.greeting.8': { uk: 'Ласкаво просимо на курс італійської!', en: 'Welcome to the Italian course!' },
  'lesson.greeting.9': { uk: 'Дуже дякую!', en: 'Thank you very much!' },
  'lesson.greeting.10': { uk: 'Будь ласка. Гарного уроку!', en: 'You are welcome. Have a good lesson!' },
  'lesson.greeting.11': { uk: 'Дякую, гарного дня!', en: 'Thank you. Have a nice day!' },
  'lesson.story.reception': { uk: 'Сара вперше заходить до мовної школи в Мілані. На рецепції її зустрічає Анна — час привітатися й назвати своє ім’я.', en: 'Sara enters a language school in Milan for the first time. Anna greets her at reception. It is time to say hello and introduce herself.' },
  'lesson.note.name': { uk: 'Щоб назвати ім’я, можна сказати Mi chiamo Sara або Io sono Sara. Обидва варіанти правильні.', en: 'To give your name, you can say Mi chiamo Sara or Io sono Sara. Both are correct.' },
  'lesson.note.piacere': { uk: 'Piacere кажуть одразу після знайомства.', en: 'Say Piacere just after meeting someone.' },
  'lesson.culture.greeting': { uk: 'На рецепції, у школі чи магазині доречно починати розмову з Buongiorno — це просте й ввічливе «доброго дня».', en: 'At reception, at school, or in a shop, it is polite to start with Buongiorno, a simple greeting for the daytime.' },
  'lesson.culture.piacere': { uk: 'Після знайомства італійці часто кажуть Piacere. У відповідь можна повторити: Piacere!', en: 'After meeting someone, Italians often say Piacere. You can reply by saying Piacere too!' },
  'lesson.takeaway.1': { uk: 'Come ti chiami? — «Як тебе звати?».', en: 'Come ti chiami? means “What is your name?”' },
  'lesson.takeaway.2': { uk: 'Mi chiamo… — «Мене звати…».', en: 'Mi chiamo… means “My name is…”' },
  'lesson.takeaway.3': { uk: 'Після знайомства скажіть Piacere!', en: 'Say Piacere! after meeting someone.' },
  'lesson.takeaway.4': { uk: 'Grazie — «дякую», Prego — «будь ласка».', en: 'Grazie means “thank you”; Prego means “you are welcome”.' },
  'lesson.exercise.q1': { uk: 'Як перекладається «Come ti chiami?»?', en: 'What does “Come ti chiami?” mean?' },
  'lesson.exercise.q1.a': { uk: 'Як тебе звати?', en: 'What is your name?' },
  'lesson.exercise.q1.b': { uk: 'Як справи?', en: 'How are you?' },
  'lesson.exercise.q1.c': { uk: 'Де курс?', en: 'Where is the course?' },
  'lesson.exercise.q2': { uk: 'Що означає «Mi chiamo Sara»?', en: 'What does “Mi chiamo Sara” mean?' },
  'lesson.exercise.q2.a': { uk: 'Мене звати Сара', en: 'My name is Sara' },
  'lesson.exercise.q2.b': { uk: 'Це Сара', en: 'This is Sara' },
  'lesson.exercise.q2.c': { uk: 'До побачення, Сара', en: 'Goodbye, Sara' },
  'lesson.exercise.q3': { uk: 'Що кажуть після знайомства?', en: 'What do you say after meeting someone?' },
  'lesson.exercise.q4': { uk: 'Що означає «Benvenuta»?', en: 'What does “Benvenuta” mean?' },
  'lesson.exercise.q4.a': { uk: 'Ласкаво просимо (жінці)', en: 'Welcome (to a woman)' },
  'lesson.exercise.q4.b': { uk: 'Гарного дня', en: 'Have a good day' },
  'lesson.exercise.q4.c': { uk: 'До побачення', en: 'Goodbye' },
  'lesson.exercise.q5': { uk: 'Як відповісти на «Grazie»?', en: 'How do you reply to “Grazie”?' },
  'lesson.exercise.q6': { uk: '«Buongiorno» — ввічливе привітання вдень.', en: '“Buongiorno” is a polite daytime greeting.' },
  'lesson.exercise.q7': { uk: 'Анна — нова студентка на курсі.', en: 'Anna is a new student on the course.' },
  'lesson.exercise.q8': { uk: 'Сара вперше прийшла на курс.', en: 'Sara is attending the course for the first time.' },
  'lesson.yes': { uk: 'Так', en: 'Yes' },
  'lesson.no': { uk: 'Ні', en: 'No' },
  'lesson.vocab.buongiorno': { uk: 'доброго дня', en: 'good morning / good day' },
  'lesson.vocab.come-ti-chiami': { uk: 'як тебе звати?', en: 'what is your name?' },
  'lesson.vocab.mi-chiamo': { uk: 'мене звати', en: 'my name is' },
  'lesson.vocab.io-sono': { uk: 'я є / я', en: 'I am' },
  'lesson.vocab.piacere': { uk: 'приємно познайомитися', en: 'nice to meet you' },
  'lesson.vocab.sei-nuova': { uk: 'ти новенька?', en: 'are you new here?' },
  'lesson.vocab.benvenuta': { uk: 'ласкаво просимо (жінці)', en: 'welcome (to a woman)' },
  'lesson.vocab.grazie': { uk: 'дякую', en: 'thank you' },
  'lesson.vocab.prego': { uk: 'будь ласка', en: 'you are welcome' },
  'lesson.vocab.buona-lezione': { uk: 'гарного уроку', en: 'have a good lesson' },
  'tasks.q1.question': { uk: 'Як перекладається італійська фраза «Come stai?»', en: 'What does the Italian phrase “Come stai?” mean?' },
  'tasks.q1.a': { uk: 'А) Як тебе звати?', en: 'A) What is your name?' },
  'tasks.q1.b': { uk: 'Б) Як справи?', en: 'B) How are you?' },
  'tasks.q1.c': { uk: 'В) Звідки ти?', en: 'C) Where are you from?' },
  'tasks.q2.question': { uk: 'Що в італійській мові означає коротке слово «anch\'io»?', en: 'What does the short Italian phrase “anch\'io” mean?' },
  'tasks.q2.a': { uk: 'А) Я теж', en: 'A) Me too' },
  'tasks.q2.b': { uk: 'Б) А ти?', en: 'B) And you?' },
  'tasks.q2.c': { uk: 'В) Будь ласка', en: 'C) Please / you are welcome' },
  'tasks.q3.question': { uk: 'Як сказати італійською «Ласкаво просимо» дівчині?', en: 'How do you say “Welcome” to a woman in Italian?' },
  'tasks.q4.question': { uk: 'Чи можна вживати «Ciao!» і для зустрічі, і для прощання?', en: 'Can “Ciao!” be used both to greet someone and to say goodbye?' },
  'tasks.q4.a': { uk: 'А) Так, це універсальне привітання', en: 'A) Yes, it is a universal greeting' },
  'tasks.q4.b': { uk: 'Б) Ні, тільки при зустрічі', en: 'B) No, only when meeting someone' },
  'tasks.hint.greeting': { uk: 'Підказка: привітання при зустрічі', en: 'Hint: a greeting used when meeting someone' },
  'tasks.hint.well': { uk: 'Підказка: протилежне до «погано»', en: 'Hint: the opposite of “badly”' },
  'tasks.hint.thanks': { uk: 'Підказка: те, що кажуть, коли дуже вдячні', en: 'Hint: what you say to show strong gratitude' },
  'tasks.hint.welcome': { uk: 'Підказка: «ласкаво просимо» у жіночому роді', en: 'Hint: “welcome” when addressing a woman' },
  'tasks.hint.building': { uk: 'Підказка: багатоповерховий будинок', en: 'Hint: an apartment building' },
  'tasks.match.title': { uk: 'Зіставте слова з перекладом', en: 'Match each Italian word with its translation' },
  'tasks.match.instruction': { uk: 'Натисніть італійське слово, а потім відповідний переклад', en: 'Select an Italian word, then select its translation' },
  'tasks.reorder.instruction': { uk: 'Натисніть слова знизу, щоб скласти речення', en: 'Select the words below to build the sentence' },
  'tasks.translate.hello': { uk: '«привіт»', en: '“hello”' },
  'tasks.translate.thanks': { uk: '«дякую»', en: '“thank you”' },
  'tasks.translate.yes': { uk: '«так»', en: '“yes”' },
  'tasks.translate.no': { uk: '«ні»', en: '“no”' },
  'tasks.translate.please': { uk: '«будь ласка»', en: '“please”' },
  'tasks.listen.instruction': { uk: 'Натисніть, щоб «прослухати», і оберіть переклад', en: 'Play the word, then choose its translation' },
  'tasks.listen.thanks': { uk: 'А) Дякую', en: 'A) Thank you' },
  'tasks.listen.welcome': { uk: 'А) Ласкаво просимо', en: 'A) Welcome' },
  'tasks.listen.please': { uk: 'Б) Будь ласка', en: 'B) Please' },
  'tasks.listen.hello': { uk: 'В) Привіт', en: 'C) Hello' },
  'tasks.listen.yes': { uk: 'Б) Так', en: 'B) Yes' },
  'tasks.listen.no': { uk: 'В) Ні', en: 'C) No' },
  'tasks.listen.new': { uk: 'Б) Новий', en: 'B) New' },
  'tasks.listen.building': { uk: 'В) Будинок', en: 'C) Building' },
  'tasks.dialogue.instruction': { uk: '👤 Б: оберіть репліку, якою продовжити діалог', en: '👤 B: choose the line that continues the conversation' },
  'flashcards.ciao': { uk: 'привіт / бувай', en: 'hello / goodbye' },
  'flashcards.come stai?': { uk: 'як справи?', en: 'how are you?' },
  'flashcards.bene': { uk: 'добре', en: 'well / good' },
  'flashcards.grazie': { uk: 'дякую', en: 'thank you' },
  'flashcards.prego': { uk: 'будь ласка / нема за що', en: 'please / you are welcome' },
  'flashcards.sì': { uk: 'так', en: 'yes' },
  'flashcards.no': { uk: 'ні', en: 'no' },
  "flashcards.anch'io": { uk: 'я теж', en: 'me too' },
  'flashcards.nuovo/a': { uk: 'новий / нова', en: 'new (masculine / feminine)' },
  'flashcards.primo giorno': { uk: 'перший день', en: 'first day' },
  'flashcards.benvenuto/a': { uk: 'ласкаво просимо', en: 'welcome' },
  'flashcards.palazzo': { uk: 'будинок (багатоповерховий)', en: 'apartment building' },
  'flashcards.grazie mille': { uk: 'дуже дякую', en: 'thank you very much' }
};

function getSourceLanguage() {
  const savedLanguage = getSelectedSourceLanguage();
  if (savedLanguage !== 'device') return savedLanguage;
  return (navigator.language || '').toLowerCase().startsWith('uk') ? 'uk' : 'en';
}

function getSelectedSourceLanguage() {
  const savedLanguage = localStorage.getItem(SOURCE_LANGUAGE_KEY);
  return SOURCE_LANGUAGES.some(language => language.code === savedLanguage) ? savedLanguage : 'device';
}

function applyInterfaceLanguage() {
  const language = getSourceLanguage();
  document.documentElement.lang = language;
  document.title = language === 'en' ? UI_TRANSLATIONS[ORIGINAL_DOCUMENT_TITLE] || ORIGINAL_DOCUMENT_TITLE : ORIGINAL_DOCUMENT_TITLE;
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node;

  while ((node = walker.nextNode())) {
    if (node.parentElement?.closest('[data-source-key],script,style')) continue;
    if (!originalInterfaceText.has(node)) originalInterfaceText.set(node, node.nodeValue);
    const original = originalInterfaceText.get(node);
    const trimmed = original.trim();
    const translated = language === 'en' ? UI_TRANSLATIONS[trimmed.replace(/\s+/g, ' ')] : null;
    node.nodeValue = translated ? original.replace(trimmed, translated) : original;
  }

  document.querySelectorAll('[placeholder],[title],[aria-label],[alt]').forEach(element => {
    const originals = originalInterfaceAttributes.get(element) || {};
    ['placeholder', 'title', 'aria-label', 'alt'].forEach(attribute => {
      if (!element.hasAttribute(attribute)) return;
      if (!Object.hasOwn(originals, attribute)) originals[attribute] = element.getAttribute(attribute);
      const original = originals[attribute];
      element.setAttribute(attribute, language === 'en' ? UI_TRANSLATIONS[original] || original : original);
    });
    originalInterfaceAttributes.set(element, originals);
  });
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
    select.innerHTML = SOURCE_LANGUAGES.map(option => `<option value="${option.code}">${option[language]}</option>`).join('');
    select.value = selectedLanguage;
  });
  document.querySelectorAll('[data-source-key]').forEach(element => {
    element.textContent = getSourceTranslation(element.dataset.sourceKey, element.textContent);
  });
}

function setSourceLanguage(language) {
  if (!SOURCE_LANGUAGES.some(option => option.code === language)) return;
  localStorage.setItem(SOURCE_LANGUAGE_KEY, language);
  applySourceLanguageSettings();
  window.dispatchEvent(new CustomEvent('sourceLanguageChanged', { detail: { language } }));
}

function getXP() {
  return parseInt(localStorage.getItem(XP_KEY) || '0', 10);
}

function addXP(amount) {
  const current = getXP() + amount;
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
  document.body.style.overflow = 'hidden';
}

function closeMobNav() {
  const nav = document.getElementById('mobNav');
  const overlay = document.getElementById('mobOverlay');
  if (nav) nav.classList.remove('open');
  if (overlay) overlay.classList.remove('open');
  document.body.style.overflow = '';
}

/* ── Theme Management (Dark Mode / Light Mode) ── */
const THEME_KEY = 'ls_theme';

function getTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === 'dark' || saved === 'light') return saved;
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function setTheme(themeName) {
  const finalTheme = themeName === 'dark' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', finalTheme);
  localStorage.setItem(THEME_KEY, finalTheme);
  updateThemeToggleButtons(finalTheme);
}

function toggleTheme() {
  const current = getTheme();
  setTheme(current === 'dark' ? 'light' : 'dark');
}

function updateThemeToggleButtons(themeName) {
  const btns = document.querySelectorAll('.theme-toggle-btn');
  const icon = (typeof LS_ICONS !== 'undefined' && LS_ICONS) ? (themeName === 'dark' ? LS_ICONS.sun : LS_ICONS.moon) : (themeName === 'dark' ? '☀️' : '🌙');
  btns.forEach(btn => {
    btn.innerHTML = icon;
    btn.setAttribute('title', themeName === 'dark' ? 'Увімкнути світлу тему' : 'Увімкнути темну тему');
  });
}

function initTheme() {
  setTheme(getTheme());
}

// Immediately apply saved theme on script parse to prevent FOUC
initTheme();

function ensureProfileModal() {
  if (document.getElementById('profileModal')) return;
  const themeIcon = (typeof LS_ICONS !== 'undefined' && LS_ICONS) ? LS_ICONS.sun : '🌓';
  const closeIcon = (typeof LS_ICONS !== 'undefined' && LS_ICONS) ? LS_ICONS.close : '✕';
  document.body.insertAdjacentHTML('beforeend', `
    <div class="profile-modal-backdrop" id="profileModal" onclick="if(event.target===this)closeProfileModal()">
      <section class="profile-modal-card" role="dialog" aria-modal="true" aria-labelledby="profile-title">
        <div class="pm-topline">
          <div class="pm-eyebrow" id="profile-title">Профіль студента</div>
          <button type="button" class="pm-close" onclick="closeProfileModal()" aria-label="Закрити">${closeIcon}</button>
        </div>
        <div class="pm-header">
          <div class="pm-avatar">S</div>
          <div>
            <div class="pm-name">Студент LanguageStudio</div>
            <div class="pm-path">Напрямок: <b>Основи спілкування</b></div>
          </div>
        </div>
        <section class="pm-settings" aria-labelledby="source-language-title">
          <h3 class="pm-settings-title" id="source-language-title">Налаштування навчання італійської</h3>
          <label class="pm-setting-label" for="sourceLanguage">Мова перекладу та пояснень</label>
          <select class="pm-setting-select" id="sourceLanguage" data-source-language-select onchange="setSourceLanguage(this.value)"></select>
          
          <label class="pm-setting-label" style="margin-top:1rem;display:block;">Тема інтерфейсу</label>
          <button type="button" class="btn-ghost" onclick="toggleTheme()" style="width:100%;margin-top:0.3rem;display:inline-flex;align-items:center;justify-content:center;gap:0.5rem;">
            ${themeIcon} Переключити тему
          </button>
        </section>
        <div class="pm-stats-grid">
          <div class="pm-stat-box"><div class="pm-stat-val" style="color:var(--it-green);"><span class="xp-val-display">0</span></div><div class="pm-stat-lbl">Очок XP</div></div>
          <div class="pm-stat-box"><div class="pm-stat-val" style="color:#D97706;">1 день</div><div class="pm-stat-lbl">Ударний темп (Streak)</div></div>
          <div class="pm-stat-box"><div class="pm-stat-val">1/16</div><div class="pm-stat-lbl">Пройдено уроків</div></div>
          <div class="pm-stat-box"><div class="pm-stat-val">13</div><div class="pm-stat-lbl">Слів у словнику</div></div>
        </div>
        <div class="pm-footer"><button class="btn-ghost" onclick="closeProfileModal()">Закрити</button></div>
      </section>
    </div>`);
}

function openProfileModal() {
  ensureProfileModal();
  document.getElementById('profileModal').classList.add('open');
}

function closeProfileModal() {
  document.getElementById('profileModal')?.classList.remove('open');
}

// Visual audio button click handler (voice synthesis deactivated as requested)
function speak(text, btnElement) {
  if (btnElement && btnElement.classList) {
    btnElement.classList.add('audio-playing');
    setTimeout(() => btnElement.classList.remove('audio-playing'), 500);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  ensureProfileModal();
  updateXPDisplay();
  applySourceLanguageSettings();
  initTheme();
});
