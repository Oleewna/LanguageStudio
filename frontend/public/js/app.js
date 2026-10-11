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
const LOCAL_STUDENT_PROFILE = {
  isAuthenticated: false,
  displayName: '',
  email: ''
};

const UI_TRANSLATIONS = {
  'Тести': 'Tests',
  'Тести — LanguageStudio': 'Tests — LanguageStudio',
  'Ситуації та теми': 'Situations & topics',
  'Оцініть свої знання італійської та оберіть наступний крок. Короткі тематичні тести допоможуть побачити, що вже виходить, а над чим варто попрацювати.': 'Check your Italian and choose your next step. Short topic tests help you see what is going well and what to work on next.',
  'ТЕСТИ': 'TESTS',
  '3 категорії': '3 categories',
  '10–20 хв': '10–20 min',
  'Ситуації з життя': 'Everyday situations',
  'ОБЕРІТЬ СИТУАЦІЮ': 'CHOOSE A SITUATION',
  'З чого почнемо сьогодні?': 'Where shall we start today?',
  'Оберіть тему, яка потрібна зараз: знайомство, замовлення в кафе чи орієнтування в місті.': 'Choose the situation you need now: introductions, ordering at a cafe, or finding your way around town.',
  '25 запитань': '25 questions',
  'Близько 15 хвилин': 'About 15 minutes',
  'Поки що недоступно': 'Coming soon',
  'Тематичні тести': 'TOPIC TESTS',
  'Перевірте окремі навички': 'Explore a situation',
  'Незабаром': 'Coming soon',
  'Ваші результати': 'YOUR RESULTS',
  'Тут з’явиться ваша історія тестів': 'Your test history will appear here',
  'Коли тести стануть доступними, тут зберігатимуться результати та прогрес за темами.': 'When tests become available, your results and progress by situation will appear here.',
  '0 пройдено': '0 completed',
  'План навчання': 'Learning plan',
  'Почніть із тесту на визначення рівня': 'Start with a placement test',
  'Після оцінювання ми підкажемо, який напрямок варто обрати далі.': 'After the assessment, we’ll suggest which learning path to take next.',
  'Переглянути напрямки': 'Browse learning paths',
  'ОБЕРІТЬ ПОТРІБНУ ТЕМУ': 'PICK A TOPIC',
  'Оберіть потрібну тему': 'Pick a topic',
  'Тести згруповані за повсякденними ситуаціями': 'Tests are grouped by everyday situations',
  'Категорії тестів': 'Test categories',
  'РОЗМОВА': 'CONVERSATION',
  'ЇЖА ТА НАПОЇ': 'FOOD & DRINK',
  'У МІСТІ': 'AROUND TOWN',
  'Знайомство': 'Introductions',
  'Кафе': 'Cafe',
  'Подорожі': 'Travel',
  'Знайомство та привітання': 'Introductions and greetings',
  'Почніть розмову, привітайтеся та розкажіть трохи про себе.': 'Start a conversation, greet someone, and share a little about yourself.',
  'У кафе та ресторані': 'At a cafe or restaurant',
  'Замовляйте улюблене, уточнюйте ціну та спілкуйтеся ввічливо.': 'Order what you like, ask about prices, and keep the conversation polite.',
  'Подорожі містом': 'Getting around town',
  'Запитуйте дорогу, знаходьте потрібне місце та орієнтуйтеся у місті.': 'Ask for directions, find places, and get around town.',
  'Тест зі знайомства та привітань скоро буде доступний': 'Introductions and greetings test coming soon',
  'Тест для кафе та ресторанів скоро буде доступний': 'Cafe and restaurant test coming soon',
  'Тест про подорожі містом скоро буде доступний': 'Getting-around-town test coming soon',
  'ТЕМАТИЧНІ ТЕСТИ': 'TOPIC TESTS',
  'ФОРМАТИ': 'FORMATS',
  'МАЙБУТНІ РЕЗУЛЬТАТИ': 'YOUR RESULTS',
  'ПЛАН ПІДГОТОВКИ': 'PREPARATION PLAN',
  '10 хв': '10 min',
  '15 хв': '15 min',
  '20 хв': '20 min',
  'пройдено': 'completed',
  'БЕТА · ПОПЕРЕДНІЙ ПЕРЕГЛЯД': 'BETA · PREVIEW',
  'Огляд тестів': 'Test overview',
  'Результати та наступні кроки': 'Results and next steps',
  'Оберіть тему для тесту': 'Choose a topic to explore',
  'Майбутні результати': 'YOUR RESULTS',
  'Історія тестів з’явиться тут': 'Your test history will appear here',
  'План підготовки': 'A good next step',
  'Оберіть напрямок навчання': 'Choose a learning path',
  'Повторіть основи, а потім перевірте себе на коротких тестах.': 'Review the basics, then check your skills with short tests.',
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
  'Навчальні юніти': 'Learning path',
  'Уроки напрямку «Основи»': 'Lessons in “Basics”',
  'Активний': 'Active',
  'Переглянути всі 4 розділи': 'View all 4 path',
  'Тренажер слів': 'Vocabulary trainer',
  'Привітання та база (13 слів)': 'Greetings and basics (13 words)',
  'Мої власні збережені слова': 'My saved words',
  'Практичні тести': 'Practice quizzes',
  'Щоденний бліц-тест': 'Daily quick quiz',
  'Вправи до цього уроку': 'Exercises for this lesson',
  'Пошук по базі слів': 'Search vocabulary',
  'Додати власне слово': 'Add a custom word',
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
  'Особистий кабінет': 'Your account',
  'Вхід та реєстрація': 'Sign in or create an account',
  'Ця демо-сторінка показує майбутній вхід і реєстрацію. Поки що профіль та прогрес зберігаються лише на цьому пристрої.': 'This demo shows the planned sign-in and registration flow. For now, your profile and progress stay on this device only.',
  '🔑 Вхід': '🔑 Sign in',
  '✨ Реєстрація': '✨ Create account',
  'Раді бачити вас знову. Введіть дані, щоб продовжити навчання.': 'Welcome back. Enter your details to continue learning.',
  'Електронна пошта': 'Email address',
  'Ваш пароль': 'Your password',
  "Запам'ятати мене": 'Remember me',
  'Забули пароль?': 'Forgot password?',
  'Увійти': 'Sign in',
  'Змінити тему': 'Switch theme',
  'Ще немає акаунта?': 'New here?',
  'Зареєструватися': 'Create an account',
  'Форма реєстрації поки демонстраційна. Дані нікуди не надсилаються.': 'Registration is a demo for now. No data is sent.',
  "Ім'я": 'Name',
  'Як до вас звертатися?': 'What should we call you?',
  'Пароль': 'Password',
  'Мінімум 8 символів': 'At least 8 characters',
  'Використайте літери та цифри для надійності.': 'Use a mix of letters and numbers for a stronger password.',
  'Повторіть пароль': 'Confirm password',
  'Ще раз той самий пароль': 'Enter the same password again',
  'Погоджуюся з умовами використання та політикою конфіденційності': 'I agree to the terms of use and privacy policy',
  'Створити акаунт': 'Create account',
  'Вже маєте акаунт?': 'Already have an account?',
  '💡 Важливо:': '💡 Note:',
  'Демо-профіль: акаунти ще не підключені; прогрес зберігається лише в цьому браузері.': 'Demo profile: accounts are not connected yet; progress is saved in this browser only.',
  'Увійти або зареєструватися': 'Sign in or create an account',
  'Студент': 'Student',
  'Гостьовий профіль · прогрес зберігається на цьому пристрої': 'Guest profile · progress is saved on this device',
  'Профіль студента': 'Student profile',
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
  'Напрямки навчання — LanguageStudio': 'Learning paths — LanguageStudio',
  'Флешкартки — LanguageStudio': 'Flashcards — LanguageStudio',
  'Завдання — LanguageStudio': 'Exercises — LanguageStudio',
  'Власний словник — LanguageStudio': 'My dictionary — LanguageStudio',
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
  'Довідник граматики': 'Grammar guide',
  'Напрямки': 'Learning paths',
  'Словник': 'Dictionary',
  'Довідник': 'Grammar guide',
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
  'Всі розділи курсу': 'All course path',
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
  'Напрямок': 'Learning path',
  'Усі напрямки': 'All learning paths',
  'Всі тематики': 'All topics',
  '👋 Основи': '👋 Basics',
  'Основи': 'Basics',
  '👋 Основи спілкування': '👋 Communication basics',
  '🧳 Туристична італійська': '🧳 Italian for travel',
  '💼 Робота та бізнес': '💼 Work and business',
  'Робота та бізнес': 'Work and business',
  'Турист': 'Travel',
  'Бізнес': 'Business',
  '👋 Привітання': '👋 Greetings',
  '🔤 Базові фрази': '🔤 Basic phrases',
  'Базові фрази': 'Basic phrases',
  '⭐ Власні збережені': '⭐ Saved words',
  'Власні збережені': 'Saved words',
  '🔤 Базове': '🔤 Basics',
  'Базове': 'Basics',
  '⭐ Власне': '⭐ Custom',
  'Власне': 'Custom',
  '👆 Натисніть, щоб побачити переклад': '👆 Tap to reveal the translation',
  'Натисніть, щоб побачити переклад': 'Tap to reveal the translation',
  '👆 Натисніть знову для звороту': '👆 Tap again to flip back',
  'Натисніть знову для звороту': 'Tap again to flip back',
  '← Назад': '← Previous',
  'Вперед →': 'Next →',
  'Для цього напрямку слова ще готуються — спробуйте «Основи спілкування» або власні збережені слова.': 'Words for this path are coming soon. Try Communication basics or your saved words.',
  'Практика & Перевірка': 'Practice & Review',
  'Практичні вправи': 'Exercises',
  'Практика & Перевірка знань': 'Practice & Knowledge Review',
  'Завдання та Вправи': 'Exercises and Practice',
  'Тренуйте граматику та реальні ситуації спілкування. Обирайте тему й зручний формат вправ.': 'Practice grammar and real-life conversations. Choose a topic and exercise format.',
  '7 форматів вправ': '7 exercise formats',
  'Група': 'Group',
  'Усі теми (Граматика + Ситуації)': 'All topics (Grammar + Situations)',
  'Сортування': 'Sorting',
  'За замовчуванням': 'Default',
  'Пошук за словом': 'Search by word',
  'Пошук фрази або правила...': 'Search phrases or grammar rules...',
  'Персоналізований тест генерується з вашого «Власного словника» та базового запасу.': 'A personalized quiz is generated from your saved dictionary and core vocabulary.',
  'Тема інтерфейсу': 'Interface theme',
  'Переключити тему': 'Switch theme',
  'Завдання та Тести': 'Exercises & Quizzes',
  'Практикуйте італійську в конкретних ситуаціях. Почніть із першого знайомства в будинку та закріпіть потрібні фрази в різних форматах.': 'Practice Italian in real situations. Start with a first meeting in an apartment building and review useful phrases in different formats.',
  'Ситуація · Основи спілкування': 'Situation · Communication basics',
  'Перший день у будинку': 'First day in the apartment building',
  'Привітання, коротке знайомство та ввічливі відповіді під час зустрічі з сусідами.': 'Greetings, a brief introduction, and polite replies when meeting your neighbors.',
  'Вправи за ситуацією': 'Exercises by situation',
  '40+': '40+',
  'Вправ у базі': 'Exercises in the bank',
  '8': '8',
  'Категорій знань': 'Knowledge categories',
  'Категорії та Фільтри': 'Categories & Filters',
  'Всі категорії': 'All categories',
  'Іменники & Артиклі': 'Nouns & Articles',
  'Дієслова (Essere/Avere)': 'Verbs (Essere/Avere)',
  'Займенники & Прийменники': 'Pronouns & Prepositions',
  'Структура речення': 'Sentence Structure',
  'Знайомство & Сусіди': 'Introductions & Neighbors',
  'У кафе та барі': 'At the Cafe & Bar',
  'Орієнтування в місті': 'Asking Directions',
  'Покупки та ціни': 'Shopping & Prices',
  'Тільки Граматика': 'Grammar Only',
  'Тільки Ситуації': 'Situations Only',
  'Формати вправ': 'Exercise Formats',
  'Вибір відповіді': 'Multiple Choice',
  'Заповни пропуск': 'Fill in the blank',
  'Зіставлення слів': 'Word Matching',
  'Порядок слів': 'Word Order',
  'Діалог': 'Dialogue',
  'Зі словника': 'From Dictionary',
  'Згенерувати новий тест': 'Generate a new quiz',
  'Переглянути всі розділи': 'View all path',
  'Привітання та база (13 слів)': 'Greetings and basics (13 words)',
  'Усі вправи та тести': 'All exercises and quizzes',
  'Граматичний тренажер': 'Grammar trainer',
  'Ситуативні завдання': 'Situational exercises',
  'Означені артиклі': 'Definite articles',
  'Essere та Avere': 'Essere and Avere',
  'Tu vs Lei (Етикет)': 'Tu vs Lei (Etiquette)',
  '🧠 Вибір відповіді': '🧠 Multiple choice',
  '✍️ Заповни пропуск': '✍️ Fill in the blank',
  '🔗 Зіставлення': '🔗 Matching',
  '🔀 Порядок слів': '🔀 Word order',
  '🌐 Переклад': '🌐 Translation',
  '📖 Зі словника': '📖 Dictionary quiz',
  '🔊 Аудіювання': '🔊 Listening',
  'Аудіювання': 'Listening',
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
  'Незабаром': 'Coming soon',
  'Граматичні шпаргалки': 'Grammar quick reference',
  'Швидкий доступ до основних правил італійської мови: артиклі, форми дієслів та етикетні вирази.': 'Quick access to practical Italian grammar: articles, verb forms, and polite expressions.',
  '☀️ Привітання': '☀️ Greetings',
  '📰 Артиклі': '📰 Articles',
  'Артиклі': 'Articles',
  '🤝 Tu vs Lei': '🤝 Tu vs Lei',
  'Зверніть увагу:': 'Note:',
  'Вік в італійській мові:': 'Age in Italian:',
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
  'Курс італійської · Основи': 'Italian foundations',
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
  '· Італійська для реальних ситуацій': '· Italian for real-life situations',
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

const REVERSE_UI_TRANSLATIONS = Object.fromEntries(
  Object.entries(UI_TRANSLATIONS).map(([ukrainian, english]) => [english, ukrainian])
);

const UK_INTERFACE_TRANSLATIONS = {
  'Italian for real-life situations': 'Італійська для реальних ситуацій',
  'Learning paths': 'Напрямки навчання',
  'Choose your goal': 'Оберіть свою мету',
  'Quick drills': 'Швидкі вправи',
  'Rules reference': 'Довідник правил',
  'Check your progress': 'Перевірте свій прогрес',
  'Greetings, your first Milanese dialogue, introductions, and basic verbs — the foundation that supports every path below.': 'Привітання, ваш перший діалог у Мілані, знайомство та базові дієслова — основа для всіх подальших напрямків.',
  'All paths →': 'Усі напрямки →',
  'Introduction — “Come ti chiami?”': 'Знайомство — «Come ti chiami?»',
  'Your first Milan classroom dialogue, new words, and conversational culture': 'Ваш перший діалог у міланському класі, нові слова та культура спілкування',
  'Start': 'Почати',
  'Lesson 1.2 · Soon': 'Урок 1.2 · Незабаром',
  'How to ask someone’s name, the verb chiamarsi, and polite formulas': 'Як запитати ім’я, дієслово chiamarsi та ввічливі вислови',
  'Soon': 'Незабаром',
  'Lesson 1.3 · Soon': 'Урок 1.3 · Незабаром',
  'Countries, nationalities, and conjugation of essere': 'Країни, національності та відмінювання дієслова essere',
  'Lesson 1.4 · Soon': 'Урок 1.4 · Незабаром',
  "I numeri e l'età (Numbers and age)": "I numeri e l'età (Числа та вік)",
  'Counting 0–100, the verb avere, and phone numbers': 'Рахунок від 0 до 100, дієслово avere та номери телефонів',
  'Lesson 1.5 · Soon': 'Урок 1.5 · Незабаром',
  'La mia scena · Path recap': 'La mia scena · Підсумок напрямку',
  'A final quiz and your own mini-dialogue scene': 'Підсумковий тест і власний мінідіалог',
  '🎓 Summary': '🎓 Підсумок',
  'Travel Italian': 'Італійська для подорожей',
  'Hotels, restaurants, transport, shopping, and emergency phrases for your trip.': 'Готелі, ресторани, транспорт, покупки та фрази на випадок надзвичайних ситуацій у подорожі.',
  'Business Italian': 'Італійська для роботи та бізнесу',
  'Meetings, email, workplace small talk, and professional vocabulary.': 'Зустрічі, електронне листування, неформальне спілкування на роботі та професійна лексика.',
  'Paths': 'Напрямки',
  'Each path builds vocabulary and phrases around a real-life situation — from travel to office conversations. Start with the basics, then move into your chosen path.': 'Кожен напрямок допомагає вивчати лексику й фрази для реальних ситуацій — від подорожей до розмов в офісі. Почніть з основ, а потім переходьте до обраного напрямку.',
  'Greetings, introductions, numbers 0–100, and the verbs essere & avere — the foundation for every path': 'Привітання, знайомство, числа від 0 до 100 та дієслова essere й avere — основа для будь-якого напрямку',
  'Your first Milan dialogue, new words, and conversational culture': 'Ваш перший діалог у Мілані, нові слова та культура спілкування',
  'Open': 'Відкрити',
  'Introductions, the verb chiamarsi, and polite expressions': 'Знайомство, дієслово chiamarsi та ввічливі вислови',
  'Countries, nationalities, and conjugating essere': 'Країни, національності та відмінювання дієслова essere',
  'A review quiz and creating your own dialogue': 'Підсумковий тест і створення власного діалогу',
  'Hotels, restaurants, transport, shopping, and emergency phrases for travel': 'Готелі, ресторани, транспорт, покупки та фрази на випадок надзвичайних ситуацій у подорожі',
  'Office communication, meetings, emails, and small talk with colleagues': 'Спілкування в офісі, зустрічі, електронні листи та невимушені розмови з колегами',
  'LanguageStudio home': 'На головну LanguageStudio',
    'XP points': 'Бали досвіду',
      'Очок XP': 'Бали досвіду',
    'Essere and Avere': 'Essere й Avere',
    'Tu vs Lei (Etiquette)': 'Tu чи Lei (етикет)',
  'Mobile menu': 'Мобільне меню',
    'Guide': 'Довідник',
  'Exercises and practice — LanguageStudio': 'Вправи та практика — LanguageStudio',
  'Exercises and practice': 'Вправи та практика',
  'Filters': 'Фільтри',
    'Зберегти (+25 XP)': 'Зберегти (+25 балів)',
  'Lessons in the Basics track': 'Уроки напрямку «Основи»',
  'Lesson track': 'Уроки курсу',
  'Lesson 1 · Introduction': 'Урок 1 · Знайомство',
  'Lesson 4 · Consolidation': 'Урок 4 · Повторення',
    'Lesson 4 · Consolidazione': 'Урок 4 · Consolidazione',
  'Lesson 5 · Practice recap': 'Урок 5 · Підсумкова практика',
  'Browse all paths': 'Переглянути всі напрямки',
  'Word trainer': 'Тренажер слів',
  'Practice drills': 'Практичні вправи',
  'Your word bank': 'Власний словник',
  'Search the word base': 'Пошук у словнику',
  'Add your own word': 'Додати власне слово',
  'Grammar cheat sheets': 'Граматичні шпаргалки',
  'Ударний темп (Streak)': 'Серія днів',
  'Розділи (Units)': 'Напрямки навчання',
  'Essere та Avere': 'Essere й Avere',
  'Essere & Avere': 'Essere й Avere',
  'Tu vs Lei (Етикет)': 'Tu чи Lei (етикет)',
  'Tu vs Lei': 'Tu чи Lei'
};

const SOURCE_TRANSLATIONS = {
  'lesson.greeting.1': { uk: 'Доброго дня!', en: 'Good morning!' },
  'lesson.greeting.2': { uk: 'Доброго дня! Як тебе звати?', en: 'Good morning! What is your name?' },
  'lesson.greeting.3': { uk: 'Мене звати Софія. А тебе?', en: 'My name is Emily. And you?' },
  'lesson.greeting.4': { uk: 'Я Олена. Приємно познайомитися!', en: "I'm Jessica. Nice to meet you!" },
  'lesson.greeting.5': { uk: 'Приємно, Олено!', en: 'Nice to meet you, Jessica!' },
  'lesson.greeting.6': { uk: 'Ти тут новенька?', en: 'Are you new here?' },
  'lesson.greeting.7': { uk: 'Так, я новенька.', en: "Yes, I'm new here." },
  'lesson.greeting.8': { uk: 'Ласкаво просимо на курс італійської!', en: 'Welcome to the Italian course!' },
  'lesson.greeting.9': { uk: 'Дуже дякую!', en: 'Thank you very much!' },
  'lesson.greeting.10': { uk: 'Будь ласка. Гарного уроку!', en: 'You are welcome. Have a good lesson!' },
  'lesson.greeting.11': { uk: 'Дякую, гарного дня!', en: 'Thank you. Have a nice day!' },
  'lesson.scene.intro': { uk: 'Софія приходить на свій перший урок італійської. У класі вона вітається, представляється та знайомиться з Оленою.', en: 'Emily arrives for her first Italian lesson. In class, she greets Jessica, introduces herself, and gets to know her.' },
  'lesson.section.dialogue': { uk: 'Діалог у класі', en: 'Classroom dialogue' },
  'lesson.character.student': { uk: 'Софія', en: 'Emily' },
  'lesson.character.student.italian': { uk: 'Sofia', en: 'Emily' },
  'lesson.character.teacher': { uk: 'Олена', en: 'Jessica' },
  'lesson.character.teacher.italian': { uk: 'Olena', en: 'Jessica' },
  'lesson.story.reception': { uk: 'Софія вперше приходить до мовної школи в Мілані. У класі її зустрічає Олена — час привітатися й назвати своє ім’я.', en: 'Emily arrives at a language school in Milan for the first time. In class, Jessica greets her. It is time to say hello and introduce herself.' },
  'lesson.note.name': { uk: 'Щоб назвати ім’я, можна сказати Mi chiamo Sofia або Io sono Sofia. Обидва варіанти правильні.', en: 'To give your name, you can say Mi chiamo Emily or Io sono Emily. Both are correct.' },
  'lesson.note.piacere': { uk: 'Piacere кажуть одразу після знайомства.', en: 'Say Piacere just after meeting someone.' },
  'lesson.culture.greeting': { uk: 'У класі, в школі чи в магазині доречно починати розмову з Buongiorno — це просте й ввічливе «доброго дня».', en: 'In class, at school, or in a shop, it is polite to start with Buongiorno, a simple greeting for the daytime.' },
  'lesson.culture.piacere': { uk: 'Після знайомства італійці часто кажуть Piacere. У відповідь можна повторити: Piacere!', en: 'After meeting someone, Italians often say Piacere. You can reply by saying Piacere too!' },
  'lesson.takeaway.1': { uk: 'Come ti chiami? — «Як тебе звати?».', en: 'Come ti chiami? means “What is your name?”' },
  'lesson.takeaway.2': { uk: 'Mi chiamo… — «Мене звати…».', en: 'Mi chiamo… means “My name is…”' },
  'lesson.takeaway.3': { uk: 'Після знайомства скажіть Piacere!', en: 'Say Piacere! after meeting someone.' },
  'lesson.takeaway.4': { uk: 'Grazie — «дякую», Prego — «будь ласка».', en: 'Grazie means “thank you”; Prego means “you are welcome”.' },
  'lesson.exercise.q1': { uk: 'Як перекладається «Come ti chiami?»?', en: 'What does “Come ti chiami?” mean?' },
  'lesson.exercise.q1.a': { uk: 'Як тебе звати?', en: 'What is your name?' },
  'lesson.exercise.q1.b': { uk: 'Як справи?', en: 'How are you?' },
  'lesson.exercise.q1.c': { uk: 'Де курс?', en: 'Where is the course?' },
  'lesson.exercise.q2': { uk: 'Що означає «Mi chiamo Sofia»?', en: 'What does “Mi chiamo Emily” mean?' },
  'lesson.exercise.q2.a': { uk: 'Мене звати Софія', en: 'My name is Emily' },
  'lesson.exercise.q2.b': { uk: 'Це Софія', en: 'This is Emily' },
  'lesson.exercise.q2.c': { uk: 'До побачення, Софіє', en: 'Goodbye, Emily' },
  'lesson.exercise.q3': { uk: 'Що кажуть після знайомства?', en: 'What do you say after meeting someone?' },
  'lesson.exercise.q4': { uk: 'Що означає «Benvenuta»?', en: 'What does “Benvenuta” mean?' },
  'lesson.exercise.q4.a': { uk: 'Ласкаво просимо (жінці)', en: 'Welcome (to a woman)' },
  'lesson.exercise.q4.b': { uk: 'Гарного дня', en: 'Have a good day' },
  'lesson.exercise.q4.c': { uk: 'До побачення', en: 'Goodbye' },
  'lesson.exercise.q5': { uk: 'Як відповісти на «Grazie»?', en: 'How do you reply to “Grazie”?' },
  'lesson.exercise.q6': { uk: '«Buongiorno» — ввічливе привітання вдень.', en: '“Buongiorno” is a polite daytime greeting.' },
  'lesson.exercise.q7': { uk: 'Олена — нова студентка на курсі.', en: 'Jessica is a new student on the course.' },
  'lesson.exercise.q8': { uk: 'Софія вперше прийшла на курс.', en: 'Emily is attending the course for the first time.' },
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
  'exercises.dialogue.instruction': { uk: '👤 Б: оберіть репліку, якою продовжити діалог', en: '👤 B: choose the line that continues the conversation' },
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

function getInterfaceTranslation(text, language) {
  if (language === 'en') return UI_TRANSLATIONS[text];
  return UK_INTERFACE_TRANSLATIONS[text] || REVERSE_UI_TRANSLATIONS[text];
}

function applyInterfaceLanguage() {
  const language = getSourceLanguage();
  document.documentElement.lang = language;
  document.title = getInterfaceTranslation(ORIGINAL_DOCUMENT_TITLE, language) || ORIGINAL_DOCUMENT_TITLE;
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node;

  while ((node = walker.nextNode())) {
    if (node.parentElement?.closest('[data-source-key],script,style')) continue;
    if (!originalInterfaceText.has(node)) originalInterfaceText.set(node, node.nodeValue);
    const original = originalInterfaceText.get(node);
    const trimmed = original.trim();
    const translated = getInterfaceTranslation(trimmed.replace(/\s+/g, ' '), language);
    node.nodeValue = translated ? original.replace(trimmed, translated) : original;
  }

  document.querySelectorAll('[placeholder],[title],[aria-label],[alt]').forEach(element => {
    const originals = originalInterfaceAttributes.get(element) || {};
    ['placeholder', 'title', 'aria-label', 'alt'].forEach(attribute => {
      if (!element.hasAttribute(attribute)) return;
      if (!Object.hasOwn(originals, attribute)) originals[attribute] = element.getAttribute(attribute);
      const original = originals[attribute];
      element.setAttribute(attribute, getInterfaceTranslation(original, language) || original);
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

  if (typeof window.updateBrandLogos === 'function') {
    window.updateBrandLogos(finalTheme);
  }
}

function toggleTheme() {
  const current = getTheme();
  setTheme(current === 'dark' ? 'light' : 'dark');
}

function updateThemeToggleButtons(themeName) {
  const btns = document.querySelectorAll('.theme-toggle-btn');
  const icon = (typeof LS_ICONS !== 'undefined' && LS_ICONS) ? (themeName === 'dark' ? LS_ICONS.sun : LS_ICONS.moon) : (themeName === 'dark' ? '☀️' : '🌙');
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
}

function initTheme() {
  setTheme(getTheme());
}

// Immediately apply saved theme on script parse to prevent FOUC
initTheme();

function renderRegisteredIcons(root = document) {
  if (typeof getIconSvg !== 'function') return;
  root.querySelectorAll('[data-icon]').forEach(element => {
    element.innerHTML = getIconSvg(element.dataset.icon);
  });
}

renderRegisteredIcons();

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

function initTestsNavigation() {
  if (!location.pathname.endsWith('/tests.html')) return;

  document.querySelector('.menu-toggle')?.addEventListener('click', openMobNav);
  document.querySelector('.mob-close-btn')?.addEventListener('click', closeMobNav);
  document.getElementById('mobOverlay')?.addEventListener('click', closeMobNav);
  bindThemeButtons();
  document.querySelector('.student-widget')?.addEventListener('click', openProfileModal);
}

function ensureProfileModal() {
  if (document.getElementById('profileModal')) return;
  const themeIcon = (typeof LS_ICONS !== 'undefined' && LS_ICONS) ? LS_ICONS.sun : '🌓';
  const closeIcon = (typeof LS_ICONS !== 'undefined' && LS_ICONS) ? LS_ICONS.close : '✕';
  const studentIdentity = getStudentProfilePresentation();
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
            <div class="pm-name">${studentIdentity.name}</div>
            <div class="pm-path">${studentIdentity.status}</div>
            <div class="pm-path">Напрямок: <b>Основи спілкування</b></div>
          </div>
        </div>
        <section class="pm-settings" aria-labelledby="source-language-title">
          <h3 class="pm-settings-title" id="source-language-title">Налаштування навчання італійської</h3>
          <div class="pm-settings-grid">
            <div class="pm-setting">
              <label class="pm-setting-label" for="sourceLanguage">Мова перекладу та пояснень</label>
              <select class="pm-setting-select" id="sourceLanguage" data-source-language-select onchange="setSourceLanguage(this.value)"></select>
            </div>
            <div class="pm-setting">
              <div class="pm-setting-label">Тема інтерфейсу</div>
              <button type="button" class="btn-ghost pm-theme-button" onclick="toggleTheme()">
                ${themeIcon} Переключити тему
              </button>
            </div>
          </div>
        </section>
        <div class="pm-stats-grid">
          <div class="pm-stat-box"><div class="pm-stat-val" style="color:var(--it-green);"><span class="xp-val-display">0</span></div><div class="pm-stat-lbl">Очок XP</div></div>
          <div class="pm-stat-box"><div class="pm-stat-val" style="color:var(--it-gold);">1 день</div><div class="pm-stat-lbl">Ударний темп (Streak)</div></div>
          <div class="pm-stat-box"><div class="pm-stat-val">1/16</div><div class="pm-stat-lbl">Пройдено уроків</div></div>
          <div class="pm-stat-box"><div class="pm-stat-val">13</div><div class="pm-stat-lbl">Слів у словнику</div></div>
        </div>
        <div class="pm-footer">
          <a class="btn-primary" href="${getAuthPageHref()}">Увійти або зареєструватися</a>
        </div>
      </section>
    </div>`);
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
  lockProfilePageScroll();
  document.getElementById('profileModal').classList.add('open');
}

function closeProfileModal() {
  document.getElementById('profileModal')?.classList.remove('open');
  unlockProfilePageScroll();
}

// Visual audio button click handler (voice synthesis deactivated as requested)
function speak(text, btnElement) {
  if (btnElement && btnElement.classList) {
    btnElement.classList.add('audio-playing');
    setTimeout(() => btnElement.classList.remove('audio-playing'), 500);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  ensureTestsNavigation();
  bindThemeButtons();
  initTestsNavigation();
  ensureProfileModal();
  updateXPDisplay();
  applySourceLanguageSettings();
  initTheme();
});
