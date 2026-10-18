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

const UI_TRANSLATIONS = {
  'Тести': 'Tests',
  'Тести — LanguageStudio': 'Tests — LanguageStudio',
  'Типи тестів': 'Test types',
  'ПЕРЕД НАВЧАННЯМ': 'BEFORE LEARNING',
  'Тест на визначення рівня': 'Placement assessment',
  'Пройдіть початкове оцінювання, щоб зрозуміти свій поточний рівень і з чого почати.': 'Take an initial assessment to understand your current level and where to start.',
  'Незабаром': 'Coming soon',
  'Тест буде доступний пізніше': 'Assessment coming soon',
  'ФІНАЛЬНА ПЕРЕВІРКА': 'FINAL CHECKPOINT',
  'Фінальні тести напрямків': 'Learning path final tests',
  'Завантажуємо напрямки…': 'Loading learning paths…',
  'Для цього курсу поки немає напрямків навчання.': 'There are no learning paths for this course yet.',
  'Не вдалося завантажити напрямки тестів. Перевірте з’єднання та спробуйте ще раз.': 'Could not load assessment paths. Check your connection and try again.',
  'Фінальний тест': 'Final assessment',
  'Напрямок завершено · фінальний тест незабаром': 'Path complete · final assessment coming soon',
  'Завершіть напрямок, щоб розблокувати': 'Complete the path to unlock',
  'Завершіть напрямок': 'Complete the path',
  'Переглянути напрямок': 'View learning path',
  'Для тесту ще немає доступних уроків.': 'No lessons are available for this assessment yet.',
  'Фінальний тест незабаром': 'Final assessment coming soon',
  'Основи · Урок 1 · Знайомство': 'Basics · Lesson 1 · Introductions',
  'Основи спілкування · Урок 1': 'Communication basics · Lesson 1',
  'Основи спілкування · Урок 1 — LanguageStudio, Італійська': 'Communication basics · Lesson 1 — LanguageStudio, Italian',
  'Знайомство — Come ti chiami?': 'Introductions — Come ti chiami?',
  'Софія приходить на перший урок італійської в Мілані. Вона знайомиться з Ґретою, студенткою того самого курсу.': 'Sofia arrives for her first Italian lesson in Milan and meets Greta, a student in the same course.',
  'Студенти в італійському класі знайомляться': 'Students meeting in an Italian classroom',
  'Переглянути всі напрямки': 'View all learning paths',
  'Вправи до Уроку 1': 'Lesson 1 exercises',
  'Банк завдань': 'Question bank',
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
  'LanguageStudio — Італійська для реальних ситуацій': 'LanguageStudio — Italian for real-life situations',
  'Мій профіль студента': 'My student profile',
  'Особистий кабінет': 'Your account',
  'Вхід та реєстрація': 'Sign in or create an account',
  'Ця демо-сторінка показує майбутній вхід і реєстрацію. Поки що профіль та прогрес зберігаються лише на цьому пристрої.': 'This demo shows the planned sign-in and registration flow. For now, your profile and progress stay on this device only.',
  'Вхід': 'Sign in',
  'Реєстрація': 'Create account',
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
  'Важливо:': 'Note:',
  'Демо-профіль: акаунти ще не підключені; прогрес зберігається лише в цьому браузері.': 'Demo profile: accounts are not connected yet; progress is saved in this browser only.',
  'Увійти або зареєструватися': 'Sign in or create an account',
  'Студент': 'Student',
  'Гостьовий профіль · прогрес зберігається на цьому пристрої': 'Guest profile · progress is saved on this device',
  'Профіль студента': 'Student profile',
  'Розділи': 'Learning paths',
  'Головна': 'Home',
  'Розділ 1 · Урок 1': 'Unit 1 · Lesson 1',
  'РОЗДІЛ 1 · УРОК 1': 'UNIT 1 · LESSON 1',
  'Софія приходить на перший урок італійської в Мілані та знайомиться з Ґретою, однокурсницею.': 'Sofia arrives for her first Italian lesson in Milan and meets Greta, her classmate.',
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
  'Італійська для реальних ситуацій': 'Italian for real-life situations',
  'Оберіть напрямок, що відповідає вашій меті — подорожі, робота чи бізнес — і вивчайте саме ту італійську, яка вам справді потрібна.': 'Choose a path that fits your goals, from travel to work and business, and learn the Italian you actually need.',
  'Оберіть свою мету': 'Choose your goal',
  '3D тренажер': '3D practice deck',
  'Бліц-тести': 'Quick quizzes',
  'Власні слова': 'Your saved words',
  'Таблиці правил': 'Grammar reference',
  'Розпочати': 'Start',
  'Обрати свою мету': 'Choose your goal',
  'Оберіть свою мету': 'Choose your goal',
  'Кожен напрямок будує словниковий запас і фрази навколо конкретної ситуації — від подорожі до перемовин в офісі. Почніть з основ, а тоді переходьте до свого напрямку.': 'Each learning path builds vocabulary and phrases around a real situation, from travel to office meetings. Start with the basics, then choose your path.',
  'Основи спілкування · Активний': 'Communication basics · Active',
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
  '1/5 уроків відкрито': '1/5 lessons available',
  'LanguageStudio · Італійська для реальних ситуацій': 'LanguageStudio · Italian for real-life situations',
  'Всі розділи курсу': 'All course path',
  'Відкрити': 'Open',
  'Туристична італійська': 'Italian for travel',
  'Готелі, ресторани, транспорт, шопінг та фрази на випадок форс-мажору в подорожі': 'Hotels, restaurants, transport, shopping, and phrases for travel emergencies.',
  'Італійська для роботи та бізнесу': 'Italian for work and business',
  'Офісне спілкування, зустрічі, електронні листи та small talk з колегами': 'Office conversations, meetings, emails, and small talk with colleagues.',
  'Ділові зустрічі, електронні листи, small talk з колегами та професійна лексика': 'Business meetings, emails, small talk with colleagues, and professional vocabulary.',
  'Словниковий тренажер': 'Vocabulary trainer',
  'Фільтруйте слова за напрямком навчання чи тематикою. Перевертайте картку та тренуйте пам\'ять.': 'Filter words by learning path or topic. Flip each card to practice recall.',
  'Напрямок': 'Learning path',
  'Усі напрямки': 'All learning paths',
  'Всі тематики': 'All topics',
  'Основи': 'Basics',
  'Робота та бізнес': 'Work and business',
  'Турист': 'Travel',
  'Бізнес': 'Business',
  'Базові фрази': 'Basic phrases',
  'Власні збережені': 'Saved words',
  'Базове': 'Basics',
  'Власне': 'Custom',
  'Натисніть, щоб побачити переклад': 'Tap to reveal the translation',
  'Натисніть знову для звороту': 'Tap again to flip back',
  'Назад': 'Previous',
  'Вперед': 'Next',
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
  'Аудіювання': 'Listening',
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
  'Слів не знайдено': 'No words found',
  'Позначити як вивчене': 'Mark as learned',
  'Вивчено': 'Learned',
  'Нове слово': 'New word',
  'Італійське слово чи фраза *': 'Italian word or phrase *',
  'Український переклад *': 'Translation *',
  'Вимова (необов\'язково)': 'Pronunciation (optional)',
  'Тип слова': 'Part of speech',
  'Категорія': 'Category'
};

const UI_I18N = [
  // Navigation & Core links
  { en: 'Home', uk: 'Головна' },
  { en: 'Learning paths', uk: 'Напрямки навчання' },
  { en: 'Learning path', uk: 'Напрямок навчання' },
  { en: 'Learning path:', uk: 'Напрямок навчання:' },
  { en: 'All paths', uk: 'Усі напрямки' },
  { en: 'Browse all paths', uk: 'Всі напрямки' },
  { en: 'Paths', uk: 'Напрямки' },
  { en: 'Main', uk: 'Головне' },
  { en: 'Practice', uk: 'Практика' },
  { en: 'Flashcards', uk: 'Картки слів' },
  { en: 'Exercises', uk: 'Вправи' },
  { en: 'Dictionary', uk: 'Словник' },
  { en: 'My dictionary', uk: 'Мій словник' },
  { en: 'Grammar guide', uk: 'Граматика' },
  { en: 'Guide', uk: 'Довідник' },
  { en: 'Tests', uk: 'Тести' },
  { en: 'Basics · Lesson 1', uk: 'Основи · Урок 1' },
  { en: 'Lesson 1 · Introduction', uk: 'Урок 1 · Знайомство' },
  { en: 'Lesson 2 · Come ti chiami?', uk: 'Урок 2 · Come ti chiami?' },
  { en: 'Lesson 3 · Di dove sei?', uk: 'Урок 3 · Di dove sei?' },
  { en: 'Lesson 4 · Consolidation', uk: 'Урок 4 · Повторення' },
  { en: 'Lesson 4 · Consolidazione', uk: 'Урок 4 · Consolidazione' },
  { en: 'Lesson 5 · Practice recap', uk: 'Урок 5 · Підсумкова практика' },
  { en: 'Lesson track', uk: 'Уроки курсу' },
  { en: 'Lessons in the Basics track', uk: 'Уроки напрямку «Основи»' },
  { en: 'Word trainer', uk: 'Тренажер слів' },
  { en: 'Practice drills', uk: 'Тренувальні вправи' },
  { en: 'Your word bank', uk: 'Ваш банк слів' },
  { en: 'Grammar cheat sheets', uk: 'Шпаргалки з граматики' },
  { en: 'Switch theme', uk: 'Змінити тему' },
  { en: 'Settings', uk: 'Налаштування' },
  { en: 'Preferences', uk: 'Налаштування' },
  { en: 'Guest profile', uk: 'Гостьовий профіль' },
  { en: 'Progress is saved on this device.', uk: 'Прогрес зберігається на цьому пристрої.' },
  { en: 'Target course', uk: 'Цільовий курс' },
  { en: 'Language for translations & explanations', uk: 'Мова перекладів та пояснень' },
  { en: 'Interface theme', uk: 'Тема інтерфейсу' },
  { en: 'Interface Theme', uk: 'Тема інтерфейсу' },
  { en: 'Greetings and basics (13 words)', uk: 'Привітання та основи (13 слів)' },
  { en: 'My saved words', uk: 'Мої збережені слова' },
  { en: 'All exercises and quizzes', uk: 'Усі вправи та тести' },
  { en: 'Grammar trainer', uk: 'Тренажер граматики' },
  { en: 'Situational exercises', uk: 'Ситуативні вправи' },
  { en: 'Search the word base', uk: 'Пошук у базі слів' },
  { en: 'Add your own word', uk: 'Додати власне слово' },
  { en: 'Definite articles', uk: 'Означені артиклі' },
  { en: 'Essere and Avere', uk: 'Дієслова Essere та Avere' },
  { en: 'Essere & Avere', uk: 'Essere й Avere' },
  { en: 'Essere та Avere', uk: 'Essere й Avere' },
  { en: 'Active', uk: 'Активний' },
  { en: 'Soon', uk: 'Незабаром' },
  { en: 'Start', uk: 'Почати' },
  { en: 'Open', uk: 'Відкрити' },
  { en: 'Close', uk: 'Закрити' },
  { en: 'Introduction', uk: 'Вступ' },
  { en: 'Filters', uk: 'Фільтри' },
  { en: 'LanguageStudio home', uk: 'На головну LanguageStudio' },
  { en: 'Mobile menu', uk: 'Мобільне меню' },

  // Profile modal & Settings
  { en: 'Student Profile', uk: 'Профіль студента' },
  { en: 'Student', uk: 'Студент' },
  { en: 'Guest profile · progress is saved on this device', uk: 'Гість · прогрес зберігається на цьому пристрої' },
  { en: 'Learning path: Communication basics', uk: 'Напрямок: Основи спілкування' },
  { en: 'Italian Learning Settings', uk: 'Налаштування навчання' },
  { en: 'Target Course', uk: 'Курс для вивчення' },
  { en: 'Language for translations & explanations', uk: 'Мова перекладів та пояснень' },
  { en: 'XP Points', uk: 'Бали досвіду' },
  { en: 'XP points', uk: 'Бали досвіду' },
  { en: 'Daily Streak', uk: 'Щоденна серія' },
  { en: 'Lessons Completed', uk: 'Пройдено уроків' },
  { en: 'Dictionary Words', uk: 'Слів у словнику' },
  { en: 'Sign in or register', uk: 'Увійти або зареєструватися' },
  { en: '1 day', uk: '1 день' },

  // Hub cards (index.html)
  { en: '3D practice deck', uk: '3D тренажер карток' },
  { en: 'Quick drills', uk: 'Швидкі вправи' },
  { en: 'Your saved words', uk: 'Збережені слова' },
  { en: 'Rules reference', uk: 'Довідник правил' },
  { en: 'Quick access to essential Italian grammar rules: articles, verb forms, and polite expressions.', uk: 'Швидкий доступ до основних правил італійської мови: артиклі, форми дієслів та етикетні вирази.' },
  { en: 'Check your progress', uk: 'Перевірте свій прогрес' },
  { en: 'Italian for real-life situations', uk: 'Італійська для реальних ситуацій' },
  { en: 'Choose your goal', uk: 'Оберіть свою мету' },

  // Roadmap & units
  { en: 'Communication basics', uk: 'Основи спілкування' },
  { en: 'Communication basics · Active', uk: 'Основи спілкування · Активний' },
  { en: 'Greetings, your first Milanese dialogue, introductions, and basic verbs — the foundation that supports every path below.', uk: 'Привітання, ваш перший діалог у Мілані, знайомство та базові дієслова — основа для всіх подальших напрямків.' },
  { en: 'Lesson 1.1 · Available', uk: 'Урок 1.1 · Доступно' },
  { en: 'Introduction — “Come ti chiami?”', uk: 'Знайомство — «Come ti chiami?»' },
  { en: 'Your first Milan classroom dialogue, new words, and conversational culture', uk: 'Ваш перший діалог у міланському класі, нові слова та культура спілкування' },
  { en: 'Lesson 1.2 · Soon', uk: 'Урок 1.2 · Незабаром' },
  { en: 'Come ti chiami? (Introductions)', uk: 'Come ti chiami? (Знайомство)' },
  { en: 'How to ask someone’s name, the verb chiamarsi, and polite formulas', uk: 'Як запитати ім’я, дієслово chiamarsi та ввічливі вислови' },
  { en: 'Lesson 1.3 · Soon', uk: 'Урок 1.3 · Незабаром' },
  { en: 'Di dove sei? (Where are you from?)', uk: 'Di dove sei? (Звідки ти?)' },
  { en: 'Countries, nationalities, and conjugation of essere', uk: 'Країни, національності та відмінювання дієслова essere' },
  { en: 'Lesson 1.4 · Soon', uk: 'Урок 1.4 · Незабаром' },
  { en: "I numeri e l'età (Numbers and age)", uk: "I numeri e l'età (Числа та вік)" },
  { en: 'Counting 0–100, the verb avere, and phone numbers', uk: 'Рахунок від 0 до 100, дієслово avere та номери телефонів' },
  { en: 'Lesson 1.5 · Soon', uk: 'Урок 1.5 · Незабаром' },
  { en: 'La mia scena · Path recap', uk: 'La mia scena · Підсумок напрямку' },
  { en: 'A final quiz and your own mini-dialogue scene', uk: 'Підсумковий тест і власний мінідіалог' },
  { en: 'Travel Italian', uk: 'Італійська для подорожей' },
  { en: 'Hotels, restaurants, transport, shopping, and emergency phrases for travel', uk: 'Готелі, ресторани, транспорт, покупки та фрази на випадок надзвичайних ситуацій у подорожі' },
  { en: 'Hotels, restaurants, transport, shopping, and emergency phrases for your trip.', uk: 'Готелі, ресторани, транспорт, покупки та фрази на випадок надзвичайних ситуацій у подорожі.' },
  { en: 'Business Italian', uk: 'Італійська для роботи та бізнесу' },
  { en: 'Office communication, meetings, emails, and small talk with colleagues', uk: 'Спілкування в офісі, зустрічі, електронні листи та невимушені розмови з колегами' },
  { en: 'Meetings, email, workplace small talk, and professional vocabulary.', uk: 'Зустрічі, електронне листування, неформальне спілкування на роботі та професійна лексика.' },
  { en: '1/5 lessons available', uk: '1/5 уроків доступно' },
  { en: 'Locked', uk: 'Заблоковано' },
  { en: 'Each path builds vocabulary and phrases around a real-life situation — from travel to office conversations. Start with the basics, then move into your chosen path.', uk: 'Кожен напрямок допомагає вивчати лексику й фрази для реальних ситуацій — від подорожей до розмов в офісі. Почніть з основ, а потім переходьте до обраного напрямку.' },
  { en: 'Greetings, introductions, numbers 0–100, and the verbs essere & avere — the foundation for every path', uk: 'Привітання, знайомство, числа від 0 до 100 та дієслова essere й avere — основа для будь-якого напрямку' },
  { en: 'Your first Milan dialogue, new words, and conversational culture', uk: 'Ваш перший діалог у Мілані, нові слова та культура спілкування' },
  { en: 'Introductions, the verb chiamarsi, and polite expressions', uk: 'Знайомство, дієслово chiamarsi та ввічливі вислови' },
  { en: 'A review quiz and creating your own dialogue', uk: 'Підсумковий тест і створення власного діалогу' },

  // Lesson page elements
  { en: 'All course units', uk: 'Всі розділи курсу' },
  { en: 'All learning paths', uk: 'Всі розділи курсу' },
  { en: 'Всі розділи курсу', uk: 'Всі розділи курсу', en: 'All course units' },
  { en: 'Table of contents', uk: 'Зміст розділу' },
  { en: 'Navigation', uk: 'Навігація' },
  { en: 'Lesson', uk: 'Урок' },
  { en: 'Previous lesson', uk: 'Попередній урок' },
  { en: 'Next lesson', uk: 'Наступний урок' },
  { en: 'Back', uk: 'Назад' },
  { en: 'All lessons', uk: 'Всі уроки' },
  { en: 'Check answers', uk: 'Перевірити завдання' },
  { en: 'Show translation', uk: 'Показати переклад' },
  { en: 'Hide translation', uk: 'Сховати переклад' },
  { en: 'Key takeaways', uk: 'Підсумки уроку' },
  { en: 'Lesson vocabulary', uk: 'Словничок уроку' },
  { en: 'Classroom dialogue', uk: 'Діалог у класі' },
  { en: 'Reading story', uk: 'Історія для читання' },
  { en: 'Cultural note', uk: 'Культурна нотатка' },
  { en: 'Word', uk: 'Слово' },
  { en: 'Translation', uk: 'Переклад' },
  { en: 'Pronunciation', uk: 'Вимова' }
];

const I18N_LOOKUP = new Map();

function registerTranslationEntry(entry) {
  if (!entry || typeof entry !== 'object') return;
  const langs = ['en', 'uk', 'pl'];
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

// Index all UI_I18N entries
UI_I18N.forEach(registerTranslationEntry);

// Index legacy UI_TRANSLATIONS
Object.entries(UI_TRANSLATIONS).forEach(([uk, en]) => {
  registerTranslationEntry({ uk, en });
});

/**
 * Universal interface translation helper supporting Ukrainian and English.
 * Resolves any string irrespective of the source HTML language.
 */
function getInterfaceTranslation(text, language) {
  if (!text || typeof text !== 'string') return null;
  const clean = text.trim().replace(/\s+/g, ' ').toLowerCase();
  const entry = I18N_LOOKUP.get(clean);
  if (entry) {
    return entry[language] || entry.uk || entry.en || null;
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

  const navLang = (navigator.language || '').toLowerCase();
  if (navLang.startsWith('uk')) return 'uk';
  return 'uk';
}

function getCourseCatalog() {
  const fallbackCourse = {
    id: 'it',
    flag: 'flag-it',
    name: { uk: 'Італійська', en: 'Italian' },
    native: 'Italiano',
    status: 'active'
  };

  const cachedCourses = Array.isArray(window.__LS_COURSE_INDEX?.courses) ? window.__LS_COURSE_INDEX.courses : [];
  if (cachedCourses.length) return cachedCourses;
  return [fallbackCourse];
}

async function refreshCourseCatalog() {
  try {
    const index = await window.loadCourseIndex?.();
    if (index && Array.isArray(index.courses) && index.courses.length) {
      window.__LS_COURSE_INDEX = index;
    }
    return window.__LS_COURSE_INDEX || { default: 'it', courses: getCourseCatalog() };
  } catch (error) {
    return { default: 'it', courses: getCourseCatalog() };
  }
}

function getCourseMeta(courseId = getTargetCourse()) {
  const courseCatalog = getCourseCatalog();
  const match = courseCatalog.find(course => course.id === courseId);
  if (match) return match;
  const fallback = courseCatalog[0] || { id: 'it', flag: 'flag-it', name: { uk: 'Італійська', en: 'Italian' }, status: 'active' };
  return { ...fallback, id: courseId || fallback.id };
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
  applySourceLanguageSettings();
  updateThemeToggleButtons(getTheme());
  window.dispatchEvent(new CustomEvent('sourceLanguageChanged', { detail: { language } }));
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
    // Silent fallback for pages without a course JSON or while loading the default course.
  }
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
  document.querySelectorAll('.page-hero').forEach(hero => {
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
});

window.addEventListener('componentsLoaded', () => {
  bindNavbarInteractions();
  ensureCourseSwitcher();
  applySourceLanguageSettings();
  refreshCurrentCourseConfig();
  initTheme();
});

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
  window.applySourceLanguageSettings = applySourceLanguageSettings;
  window.applyTargetCourseSettings = applyTargetCourseSettings;
  window.applyInterfaceLanguage = applyInterfaceLanguage;
}
