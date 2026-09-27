/* ════════════════════════════════════════════════════════════════════
  EXERCISE BANK DATA MODEL (Categories, Formats, Explanations)
   ════════════════════════════════════════════════════════════════════ */

const CATEGORIES_MAP = {
  articles:   { group: 'grammar', icon: 'pin', nameUk: 'Іменники & Артиклі', nameEn: 'Nouns & Articles' },
  verbs:      { group: 'grammar', icon: 'verb', nameUk: 'Відмінювання дієслів', nameEn: 'Verb Conjugation' },
  pronouns:   { group: 'grammar', icon: 'chat', nameUk: 'Займенники & Прийменники', nameEn: 'Pronouns & Prepositions' },
  sentence:   { group: 'grammar', icon: 'type', nameUk: 'Структура речення', nameEn: 'Sentence Structure' },
  greetings:  { group: 'situational', nameUk: '<svg class="ls-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M9 20v-6h6v6"/></svg> Знайомство & Сусіди', nameEn: '<svg class="ls-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M9 20v-6h6v6"/></svg> Greetings & Meeting Neighbors' },
  cafe:       { group: 'situational', nameUk: '<svg class="ls-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" x2="6" y1="2" y2="4"/><line x1="10" x2="10" y1="2" y2="4"/><line x1="14" x2="14" y1="2" y2="4"/></svg> У кафе та барі', nameEn: '<svg class="ls-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" x2="6" y1="2" y2="4"/><line x1="10" x2="10" y1="2" y2="4"/><line x1="14" x2="14" y1="2" y2="4"/></svg> At the Cafe & Bar' },
  directions: { group: 'situational', icon: 'compass', nameUk: 'Орієнтування в місті', nameEn: 'Asking Directions' },
  shopping:   { group: 'situational', icon: 'shopping', nameUk: 'Покупки та ціни', nameEn: 'Shopping & Prices' }
};

const TASK_BANK = [
  /* ──────────────── MULTIPLE CHOICE (MCQ) ──────────────── */
  {
    id: 'mcq-g1', format: 'mcq', category: 'greetings',
    question: { uk: 'Як перекладається італійська фраза «Come stai?»', en: 'What does the Italian phrase “Come stai?” mean?' },
    options: [
      { text: { uk: 'А) Як тебе звати?', en: 'A) What is your name?' }, correct: false },
      { text: { uk: 'Б) Як справи?', en: 'B) How are you?' }, correct: true },
      { text: { uk: 'В) Звідки ти?', en: 'C) Where are you from?' }, correct: false }
    ],
    explanation: { uk: '«Come stai?» використовується для неформального запитання «Як справи?» (до однієї людини).', en: '“Come stai?” is used to informally ask “How are you?” to one person.' }
  },
  {
    id: 'mcq-g2', format: 'mcq', category: 'greetings',
    question: { uk: 'Чи можна вживати «Ciao!» і для зустрічі, і для прощання?', en: 'Can “Ciao!” be used both when greeting and saying goodbye?' },
    options: [
      { text: { uk: 'А) Так, це універсальне неформальне привітання', en: 'A) Yes, it is a universal informal greeting' }, correct: true },
      { text: { uk: 'Б) Ні, тільки при зустрічі', en: 'B) No, only when meeting someone' }, correct: false }
    ],
    explanation: { uk: '«Ciao!» є універсальним словом для "Привіт" та "Бувай" серед друзів та знайомих.', en: '“Ciao!” is universally used for both “Hello” and “Goodbye” among acquaintances.' }
  },
  {
    id: 'mcq-art1', format: 'mcq', category: 'articles',
    question: { uk: 'Який визначений артикль чоловічого роду вживається зі словом «ragazzo»?', en: 'Which masculine definite article is used with the word “ragazzo”?' },
    options: [
      { text: { uk: 'А) la', en: 'A) la' }, correct: false },
      { text: { uk: 'Б) il', en: 'B) il' }, correct: true },
      { text: { uk: 'В) lo', en: 'C) lo' }, correct: false }
    ],
    explanation: { uk: 'Для іменників чоловічого роду, що починаються на більшість приголосних, вживається артикль «il» (il ragazzo).', en: 'Nouns starting with standard consonants take “il” in the masculine singular.' }
  },
  {
    id: 'mcq-art2', format: 'mcq', category: 'articles',
    question: { uk: 'Який артикль слід вжити перед іменником «zaino» (рюкзак)?', en: 'Which article should be placed before “zaino” (backpack)?' },
    options: [
      { text: { uk: 'А) il', en: 'A) il' }, correct: false },
      { text: { uk: 'Б) lo', en: 'B) lo' }, correct: true },
      { text: { uk: 'В) l\'', en: 'C) l\'' }, correct: false }
    ],
    explanation: { uk: 'Перед z, s+приголосна, gn, ps у чоловічому роді використовується артикль «lo» (lo zaino, lo studente).', en: 'Masculine nouns starting with Z or S+consonant take the article “lo”.' }
  },
  {
    id: 'mcq-verb1', format: 'mcq', category: 'verbs',
    question: { uk: 'Оберіть правильну форму дієслова «essere» для займенника «noi» (ми):', en: 'Choose the correct form of “essere” for “noi” (we):' },
    options: [
      { text: { uk: 'А) siamo', en: 'A) siamo' }, correct: true },
      { text: { uk: 'Б) siete', en: 'B) siete' }, correct: false },
      { text: { uk: 'В) sono', en: 'C) sono' }, correct: false }
    ],
    explanation: { uk: 'Форми дієслова essere: io sono, tu sei, lui/lei è, noi siamo, voi siete, loro sono.', en: 'Conjugation of essere: io sono, tu sei, lui/lei è, noi siamo, voi siete, loro sono.' }
  },
  {
    id: 'mcq-verb2', format: 'mcq', category: 'verbs',
    question: { uk: 'Яка форма дієслова «avere» (мати) відповідає займеннику «loro» (вони)?', en: 'Which form of “avere” (to have) corresponds to “loro” (they)?' },
    options: [
      { text: { uk: 'А) abbiamo', en: 'A) abbiamo' }, correct: false },
      { text: { uk: 'Б) avete', en: 'B) avete' }, correct: false },
      { text: { uk: 'В) hanno', en: 'C) hanno' }, correct: true }
    ],
    explanation: { uk: 'Форми дієслова avere: io ho, tu hai, lui/lei ha, noi abbiamo, voi avete, loro hanno.', en: 'Conjugation of avere: io ho, tu hai, lui/lei ha, noi abbiamo, voi avete, loro hanno.' }
  },
  {
    id: 'mcq-cafe1', format: 'mcq', category: 'cafe',
    question: { uk: 'Як ввічливо попросити чашку кави в італійському барі?', en: 'How do you politely order a cup of coffee in an Italian bar?' },
    options: [
      { text: { uk: 'А) Un caffè, per favore', en: 'A) Un caffè, per favore' }, correct: true },
      { text: { uk: 'Б) Vostro caffè', en: 'B) Vostro caffè' }, correct: false },
      { text: { uk: 'В) Ciao caffè', en: 'C) Ciao caffè' }, correct: false }
    ],
    explanation: { uk: '«Per favore» або «per piacere» означає «будь ласка» при замовленні.', en: '“Per favore” or “per piacere” is the standard polite phrase for “please”.' }
  },
  {
    id: 'mcq-dir1', format: 'mcq', category: 'directions',
    question: { uk: 'Що означає італійська фраза «Dov\'è la stazione?»', en: 'What does “Dov\'è la stazione?” mean?' },
    options: [
      { text: { uk: 'А) Коли прибуває потяг?', en: 'A) When does the train arrive?' }, correct: false },
      { text: { uk: 'Б) Де знаходиться вокзал / станція?', en: 'B) Where is the train station?' }, correct: true },
      { text: { uk: 'В) Скільки коштує квиток?', en: 'C) How much is the ticket?' }, correct: false }
    ],
    explanation: { uk: '«Dov\'è...» скорочено від «Dove è...» означає «Де є...?».', en: '“Dov\'è...” is a contraction of “Dove è...” meaning “Where is...?”.' }
  },
  {
    id: 'mcq-shop1', format: 'mcq', category: 'shopping',
    question: { uk: 'Як правильно запитати про вартість товару італійською мовою?', en: 'How do you ask for the price of an item in Italian?' },
    options: [
      { text: { uk: 'А) Quanto costa?', en: 'A) Quanto costa?' }, correct: true },
      { text: { uk: 'Б) Che ora è?', en: 'B) Che ora è?' }, correct: false },
      { text: { uk: 'В) Chi sei?', en: 'C) Chi sei?' }, correct: false }
    ],
    explanation: { uk: '«Quanto costa?» (однина) та «Quanto costano?» (множина) — фрази для запитання про ціну.', en: '“Quanto costa?” is used to ask the price of a single item.' }
  },
  {
    id: 'mcq-pro1', format: 'mcq', category: 'pronouns',
    question: { uk: 'Оберіть правильний прямий займенник: «Vedi Marco?» — «Sì, ___ vedo.»', en: 'Choose the direct pronoun: “Vedi Marco?” — “Sì, ___ vedo.”' },
    options: [
      { text: { uk: 'А) lo', en: 'A) lo' }, correct: true },
      { text: { uk: 'Б) la', en: 'B) la' }, correct: false },
      { text: { uk: 'В) li', en: 'C) li' }, correct: false }
    ],
    explanation: { uk: 'Marco є іменником чоловічого роду однини, тому прямий займенник — «lo».', en: 'Marco is a singular masculine noun, replaced by the direct pronoun “lo”.' }
  },

  /* ──────────────── FILL IN THE BLANK (BLANK) ──────────────── */
  {
    id: 'blk-g1', format: 'blank', category: 'greetings',
    question: { uk: '«___, come stai?»', en: '“___, come stai?”' },
    hint: { uk: 'Підказка: неформальне привітання при зустрічі', en: 'Hint: informal greeting' },
    answers: ['ciao'],
    explanation: { uk: 'Слово «Ciao» вставляється на початку неформального привітання.', en: '“Ciao” goes at the start of an informal greeting.' }
  },
  {
    id: 'blk-g2', format: 'blank', category: 'greetings',
    question: { uk: '«Sto molto ___!»', en: '“Sto molto ___!”' },
    hint: { uk: 'Підказка: протилежне до «погано» (male)', en: 'Hint: opposite of “male” (badly)' },
    answers: ['bene'],
    explanation: { uk: '«Sto molto bene» означає «У мене все дуже добре».', en: '“Sto molto bene” means “I am doing very well”.' }
  },
  {
    id: 'blk-v1', format: 'blank', category: 'verbs',
    question: { uk: '«Io ___ studente di italiano.»', en: '“Io ___ studente di italiano.”' },
    hint: { uk: 'Підказка: форма дієслова essere (я є)', en: 'Hint: form of essere for “I am”' },
    answers: ['sono'],
    explanation: { uk: 'Перша особа однини дієслова essere: «Io sono».', en: 'First person singular of essere: “Io sono”.' }
  },
  {
    id: 'blk-v2', format: 'blank', category: 'verbs',
    question: { uk: '«Noi ___ una bella casa in Italia.»', en: '“Noi ___ una bella casa in Italia.”' },
    hint: { uk: 'Підказка: ми маємо (дієслово avere)', en: 'Hint: we have (verb avere)' },
    answers: ['abbiamo'],
    explanation: { uk: 'Форма дієслова avere для noi: «abbiamo».', en: 'Form of avere for noi: “abbiamo”.' }
  },
  {
    id: 'blk-art1', format: 'blank', category: 'articles',
    question: { uk: '«___ casa è grande e luminosa.»', en: '“___ casa è grande e luminosa.”' },
    hint: { uk: 'Підказка: жіночий артикль однини', en: 'Hint: feminine singular article' },
    answers: ['la'],
    explanation: { uk: 'Casa є іменником жіночого роду, тому артикль «la».', en: 'Casa is feminine singular, so the article is “la”.' }
  },
  {
    id: 'blk-cafe1', format: 'blank', category: 'cafe',
    question: { uk: '«Un espresso e un cornetto, per ___!»', en: '“Un espresso e un cornetto, per ___!”' },
    hint: { uk: 'Підказка: слово "будь ласка" (favore)', en: 'Hint: word for “please”' },
    answers: ['favore', 'piacere'],
    explanation: { uk: '«Per favore» або «per piacere» означає «будь ласка».', en: '“Per favore” means “please”.' }
  },
  {
    id: 'blk-dir1', format: 'blank', category: 'directions',
    question: { uk: '«Gira a ___ dopo la farmacia!»', en: '“Gira a ___ dopo la farmacia!”' },
    hint: { uk: 'Підказка: праворуч (destra)', en: 'Hint: to the right (destra)' },
    answers: ['destra'],
    explanation: { uk: '«A destra» означає «праворуч», «a sinistra» — «ліворуч».', en: '“A destra” means “to the right”.' }
  },

  /* ──────────────── MATCHING PAIRS (MATCH) ──────────────── */
  {
    id: 'match-greetings', format: 'match', category: 'greetings',
    title: { uk: 'Привітання та Базові фрази', en: 'Greetings & Basic Phrases' },
    pairs: [
      { id: 'm1', it: 'ciao', ua: 'привіт / бувай', en: 'hello / goodbye' },
      { id: 'm2', it: 'grazie', ua: 'дякую', en: 'thank you' },
      { id: 'm3', it: 'prego', ua: 'будь ласка', en: 'you are welcome' },
      { id: 'm4', it: 'benvenuto', ua: 'ласкаво просимо', en: 'welcome' },
      { id: 'm5', it: 'buongiorno', ua: 'Доброго дня', en: 'good morning' },
      { id: 'm6', it: 'arrivederci', ua: 'до побачення', en: 'goodbye' }
    ]
  },
  {
    id: 'match-verbs', format: 'match', category: 'verbs',
    title: { uk: 'Дієслова та займенники', en: 'Verbs & Pronouns' },
    pairs: [
      { id: 'mv1', it: 'io sono', ua: 'я є', en: 'I am' },
      { id: 'mv2', it: 'tu hai', ua: 'ти маєш', en: 'you have' },
      { id: 'mv3', it: 'noi siamo', ua: 'ми є', en: 'we are' },
      { id: 'mv4', it: 'parlare', ua: 'говорити', en: 'to speak' },
      { id: 'mv5', it: 'prendere', ua: 'брати / замовляти', en: 'to take / order' },
      { id: 'mv6', it: 'capire', ua: 'розуміти', en: 'to understand' }
    ]
  },
  {
    id: 'match-cafe', format: 'match', category: 'cafe',
    title: { uk: 'У кафе та барі', en: 'At the Cafe & Bar' },
    pairs: [
      { id: 'mc1', it: 'il conto', ua: 'рахунок', en: 'the bill' },
      { id: 'mc2', it: 'la colazione', ua: 'сніданок', en: 'breakfast' },
      { id: 'mc3', it: 'il tavolo', ua: 'стіл', en: 'table' },
      { id: 'mc4', it: 'l\'acqua', ua: 'вода', en: 'water' },
      { id: 'mc5', it: 'il cornetto', ua: 'круасан', en: 'croissant' },
      { id: 'mc6', it: 'ordinare', ua: 'замовляти', en: 'to order' }
    ]
  },

  /* ──────────────── SENTENCE BUILDER (REORDER) ──────────────── */
  {
    id: 'reorder-g1', format: 'reorder', category: 'greetings',
    clue: { uk: 'Привіт, як справи?', en: 'Hello, how are you?' },
    words: ['Ciao,', 'come', 'stai?'],
    explanation: { uk: 'Порядок слів у питанні привітання: Ciao, come stai?', en: 'Word order for greeting: Ciao, come stai?' }
  },
  {
    id: 'reorder-cafe1', format: 'reorder', category: 'cafe',
    clue: { uk: 'Я хочу каву, будь ласка', en: 'I would like a coffee, please' },
    words: ['Vorrei', 'un', 'caffè,', 'per', 'favore.'],
    explanation: { uk: '«Vorrei» (я б хотів) є ввічливою формою для замовлення.', en: '“Vorrei” (I would like) is the polite way to order.' }
  },
  {
    id: 'reorder-verbs1', format: 'reorder', category: 'verbs',
    clue: { uk: 'Ми новачки у цьому будинку', en: 'We are new in this building' },
    words: ['Noi', 'siamo', 'nuovi', 'in', 'questo', 'palazzo.'],
    explanation: { uk: 'Займенник + дієслово + прикметник + прийменник.', en: 'Pronoun + verb + adjective + preposition.' }
  },
  {
    id: 'reorder-dir1', format: 'reorder', category: 'directions',
    clue: { uk: 'Де знаходиться найближча станція?', en: 'Where is the nearest station?' },
    words: ['Dov\'è', 'la', 'stazione', 'più', 'vicina?'],
    explanation: { uk: '«Dov\'è» завжди стоїть на початку питального речення про місце знаходження.', en: '“Dov\'è” always starts a question about location.' }
  },

  /* ──────────────── AUDIO LISTENING (LISTEN) ──────────────── */
  {
    id: 'listen-g1', format: 'listen', category: 'greetings',
    audioWord: 'prego',
    instruction: { uk: 'Прослухайте аудіо та оберіть переклад слова', en: 'Listen to the audio and pick the translation' },
    options: [
      { text: { uk: 'А) Дякую', en: 'A) Thank you' }, correct: false },
      { text: { uk: 'Б) Будь ласка / Нема за що', en: 'B) You are welcome' }, correct: true },
      { text: { uk: 'В) Привіт', en: 'C) Hello' }, correct: false }
    ],
    explanation: { uk: 'Озвучене слово: «Prego» (Будь ласка / Нема за що).', en: 'Audio spoken: “Prego” (You are welcome).' }
  },
  {
    id: 'listen-g2', format: 'listen', category: 'greetings',
    audioWord: 'grazie',
    instruction: { uk: 'Прослухайте аудіо та оберіть переклад слова', en: 'Listen to the audio and pick the translation' },
    options: [
      { text: { uk: 'А) Дякую', en: 'A) Thank you' }, correct: true },
      { text: { uk: 'Б) Так', en: 'B) Yes' }, correct: false },
      { text: { uk: 'В) Ні', en: 'C) No' }, correct: false }
    ],
    explanation: { uk: 'Озвучене слово: «Grazie» (Дякую).', en: 'Audio spoken: “Grazie” (Thank you).' }
  },
  {
    id: 'listen-cafe1', format: 'listen', category: 'cafe',
    audioWord: 'cappuccino',
    instruction: { uk: 'Прослухайте аудіо та оберіть правильно записане слово', en: 'Listen to the audio and select the matching word' },
    options: [
      { text: { uk: 'А) Capuchino', en: 'A) Capuchino' }, correct: false },
      { text: { uk: 'Б) Cappuccino', en: 'B) Cappuccino' }, correct: true },
      { text: { uk: 'В) Capucino', en: 'C) Capucino' }, correct: false }
    ],
    explanation: { uk: 'В італійській мові слово пишеться з подвійними `pp` та `cc`: Cappuccino.', en: 'Spelled with double `pp` and `cc`: Cappuccino.' }
  },

  /* ──────────────── DIALOGUE CONTINUATION (DIALOGUE) ──────────────── */
  {
    id: 'dlg-g1', format: 'dialogue', category: 'greetings',
    lineA: 'А: «Ciao! Come ti chiami?»',
    instruction: { uk: 'Б: оберіть репліку, якою продовжити знайомство', en: 'B: choose the line that continues the introduction' },
    options: [
      { text: 'Mi chiamo Sara. E tu?', correct: true },
      { text: 'Grazie mille per l\'aiuto!', correct: false },
      { text: 'Un caffè per favore.', correct: false }
    ],
    explanation: { uk: 'На питання «Come ti chiami?» відповідь починається з «Mi chiamo...».', en: 'To answer “Come ti chiami?”, start with “Mi chiamo...”.' }
  },
  {
    id: 'dlg-cafe1', format: 'dialogue', category: 'cafe',
    lineA: 'А: «Buongiorno! Cosa desidera?»',
    instruction: { uk: 'Б: оберіть репліку для замовлення в барі', en: 'B: choose the line to order at the cafe bar' },
    options: [
      { text: 'Un cappuccino e una brioche, per favore.', correct: true },
      { text: 'Piacere di conoscerti!', correct: false },
      { text: 'Sto molto bene, grazie.', correct: false }
    ],
    explanation: { uk: 'В барі на питання «Cosa desidera?» замовляють їжу або напої.', en: 'When asked “Cosa desidera?”, specify what you want to order.' }
  },
  {
    id: 'dlg-dir1', format: 'dialogue', category: 'directions',
    lineA: 'А: «Scusi, dov\'è il museo?»',
    instruction: { uk: 'Б: оберіть репліку для пояснення дороги', en: 'B: choose the line to give directions' },
    options: [
      { text: 'Vada sempre diritto e poi a destra.', correct: true },
      { text: 'Mi chiamo Marco.', correct: false },
      { text: 'Sono venti euro.', correct: false }
    ],
    explanation: { uk: 'Вказівка дороги містить фрази напрямку: «sempre diritto» (прямо) та «a destra» (праворуч).', en: 'Giving directions involves phrases like “sempre diritto” and “a destra”.' }
  },
  {
    id: 'dlg-shop1', format: 'dialogue', category: 'shopping',
    lineA: 'А: «Quanto costa questa maglietta?»',
    instruction: { uk: 'Б: оберіть відповідь продавця про ціну', en: 'B: choose the seller\'s response showing price' },
    options: [
      { text: 'Costa venticinque euro.', correct: true },
      { text: 'Buona giornata!', correct: false },
      { text: 'No, non parlo inglese.', correct: false }
    ],
    explanation: { uk: 'На питання про ціну «Quanto costa...?» називають вартість «Costa... euro».', en: 'When asked “Quanto costa...?”, state the price in euros.' }
  }
];

/* ════════════════════════════════════════════════════════════════════
   STATE MANAGEMENT & FILTERING ENGINE
   ════════════════════════════════════════════════════════════════════ */

let activeCategoryFilter = 'all';
let currentTab = 'mcq';
const answeredState = {};

function getLang() {
  return typeof getSourceLanguage === 'function' ? getSourceLanguage() : 'uk';
}

function getText(obj) {
  if (!obj) return '';
  if (typeof obj === 'string') return obj;
  const lang = getLang();
  return obj[lang] || obj['uk'] || obj['en'] || '';
}

function setCategoryFilter(cat) {
  activeCategoryFilter = cat;
  document.querySelectorAll('.cat-pill').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.cat === cat);
  });
  applyFiltersAndSort();
}

function showTaskTab(name) {
  currentTab = name;
  document.querySelectorAll('.task-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.task-tab').forEach(t => t.classList.remove('active'));
  document.getElementById('panel-' + name).classList.add('active');
  document.querySelector(`.task-tab[data-tab="${name}"]`).classList.add('active');

  if (name === 'match') {
    renderMatchingPanel();
  } else if (name === 'reorder') {
    renderReorderPanel();
  } else if (name === 'dict') {
    generateDictQuiz();
  } else {
    applyFiltersAndSort();
  }
}

function applyFiltersAndSort() {
  const groupVal = document.getElementById('groupFilterSelect').value;
  const searchVal = document.getElementById('searchInput').value.trim().toLowerCase();

  // Filter exercises for current format tab
  let filtered = TASK_BANK.filter(t => {
    if (t.format !== currentTab) return false;
    
    // Category pill filter
    if (activeCategoryFilter !== 'all' && t.category !== activeCategoryFilter) return false;

    // Group filter (grammar vs. situational)
    const catInfo = CATEGORIES_MAP[t.category];
    if (groupVal !== 'all' && catInfo && catInfo.group !== groupVal) return false;

    // Search filter
    if (searchVal) {
      const qText = getText(t.question || t.title || t.lineA).toLowerCase();
      const catText = getText(catInfo ? catInfo.nameUk : '').toLowerCase();
      if (!qText.includes(searchVal) && !catText.includes(searchVal)) return false;
    }

    return true;
  });

  // Update summary badge
  const summaryEl = document.getElementById('activeFilterSummary');
  if (summaryEl) {
    summaryEl.textContent = `${getLang() === 'en' ? 'Showing' : 'Знайдено'}: ${filtered.length} ${getLang() === 'en' ? 'exercises' : 'вправ'}`;
  }

  // Render format specific container
  if (currentTab === 'mcq') renderMCQPanel(filtered);
  else if (currentTab === 'blank') renderBlankPanel(filtered);
  else if (currentTab === 'listen') renderListenPanel(filtered);
  else if (currentTab === 'dialogue') renderDialoguePanel(filtered);
  else if (currentTab === 'match') renderMatchingPanel(filtered);
  else if (currentTab === 'reorder') renderReorderPanel(filtered);
}

/* ════════════════════════════════════════════════════════════════════
   RENDERERS FOR EXERCISE TYPES
   ════════════════════════════════════════════════════════════════════ */

function groupByCategory(items) {
  const groups = {};
  items.forEach(item => {
    const cat = item.category || 'general';
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(item);
  });
  return groups;
}

function getCategoryLabel(catKey) {
  const info = CATEGORIES_MAP[catKey] || { icon: 'layers', nameUk: 'Загальні вправи', nameEn: 'General Exercises' };
  const label = getLang() === 'en' ? info.nameEn : info.nameUk;
  return `${info.icon ? `${getIconSvg(info.icon)} ` : ''}${label}`;
}

function renderCategoryHeader(catKey, count) {
  const name = getCategoryLabel(catKey);
  return `
    <div class="category-section-title">
      <span>${name}</span>
      <span class="category-section-count">${count} ${getLang() === 'en' ? 'exercises' : 'завдань'}</span>
    </div>
  `;
}

function renderEmptyState() {
  return `
    <div class="empty-state">
      <div class="empty-state-icon"><svg class="ls-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M20 20l-4.8-4.8"/></svg></div>
      <h3>${getLang() === 'en' ? 'No exercises found' : 'Вправ не знайдено'}</h3>
      <p>${getLang() === 'en' ? 'Try adjusting your filters or search keywords.' : 'Спробуйте змінити категорії або скинути фільтри.'}</p>
    </div>
  `;
}

/* ── 1. Multiple Choice Renderer ── */
function renderMCQPanel(items) {
  const container = document.getElementById('container-mcq');
  if (!items.length) { container.innerHTML = renderEmptyState(); return; }

  const groups = groupByCategory(items);
  let html = '';

  for (const catKey in groups) {
    html += renderCategoryHeader(catKey, groups[catKey].length);
    groups[catKey].forEach((task, idx) => {
      const catName = getCategoryLabel(task.category);
      
      html += `
        <div class="quiz-card" id="card-${task.id}">
          <div class="card-meta-header">
            <div class="card-tags">
              <span class="badge-cat">${catName}</span>
            </div>
            <div class="quiz-q-num">${getLang() === 'en' ? 'Question' : 'Питання'} ${idx + 1}</div>
          </div>
          <div class="quiz-question">${getText(task.question)}</div>
          <div class="quiz-options">
            ${task.options.map((opt, oIdx) => `
              <div class="quiz-opt" data-correct="${opt.correct}" onclick="handleMCQClick('${task.id}', ${oIdx}, ${opt.correct}, this)">
                ${getText(opt.text)}
              </div>
            `).join('')}
          </div>
          <div class="quiz-feedback" id="fb-${task.id}"></div>
        </div>
      `;
    });
  }
  container.innerHTML = html;
}

function handleMCQClick(taskId, optIdx, isCorrect, el) {
  if (answeredState[taskId]) return;
  answeredState[taskId] = true;

  const card = document.getElementById(`card-${taskId}`);
  const task = TASK_BANK.find(t => t.id === taskId);
  const opts = card.querySelectorAll('.quiz-opt');
  const fb = document.getElementById(`fb-${taskId}`);

  opts.forEach(o => o.style.pointerEvents = 'none');

  if (isCorrect) {
    el.classList.add('correct');
    fb.className = 'quiz-feedback show-correct';
    fb.innerHTML = `${getIconSvg('sparkles')} <b>${getLang() === 'en' ? 'Great!' : 'Чудово!'}</b> ${getLang() === 'en' ? 'Correct answer.' : 'Правильна відповідь.'} (+15 XP)`;
    if (typeof addXP === 'function') addXP(15);
  } else {
    el.classList.add('wrong');
    const correctOpt = [...opts].find(o => o.dataset.correct === 'true');
    if (correctOpt) correctOpt.classList.add('correct');
    fb.className = 'quiz-feedback show-wrong';
    fb.innerHTML = `${getIconSvg('close')} <b>${getLang() === 'en' ? 'Not quite.' : 'Не зовсім.'}</b> ${getLang() === 'en' ? 'The correct answer is highlighted.' : 'Подивіться правильний варіант вище.'}`;
  }

  if (task && task.explanation) {
    fb.innerHTML += `<div class="quiz-explanation">${getIconSvg('lightbulb')} <b>${getLang() === 'en' ? 'Explanation:' : 'Пояснення:'}</b> ${getText(task.explanation)}</div>`;
  }
}

/* ── 2. Fill in the Blank Renderer ── */
function renderBlankPanel(items) {
  const container = document.getElementById('container-blank');
  if (!items.length) { container.innerHTML = renderEmptyState(); return; }

  const groups = groupByCategory(items);
  let html = '';

  for (const catKey in groups) {
    html += renderCategoryHeader(catKey, groups[catKey].length);
    groups[catKey].forEach(task => {
      const catName = getCategoryLabel(task.category);

      html += `
        <div class="quiz-card" id="card-${task.id}">
          <div class="card-meta-header">
            <div class="card-tags">
              <span class="badge-cat">${catName}</span>
            </div>
            <div class="quiz-q-num">${getLang() === 'en' ? 'Fill in the blank' : 'Заповніть пропуск'}</div>
          </div>
          <div class="quiz-question">${getText(task.question)}</div>
          ${task.hint ? `<div id="external-style-exercises-4">${getText(task.hint)}</div>` : ''}
          <div id="external-style-exercises-5">
            <input type="text" class="text-answer-input" id="input-${task.id}" placeholder="${getLang() === 'en' ? 'Type answer...' : 'Впишіть слово...'}" />
            <button class="btn-primary" onclick="handleBlankCheck('${task.id}')">${getLang() === 'en' ? 'Check' : 'Перевірити'}</button>
          </div>
          <div class="quiz-feedback" id="fb-${task.id}"></div>
        </div>
      `;
    });
  }
  container.innerHTML = html;
}

function handleBlankCheck(taskId) {
  if (answeredState[taskId]) return;
  const task = TASK_BANK.find(t => t.id === taskId);
  const input = document.getElementById(`input-${taskId}`);
  const fb = document.getElementById(`fb-${taskId}`);
  const val = input.value.trim().toLowerCase();
  const validAnswers = task.answers.map(a => a.toLowerCase());

  if (validAnswers.includes(val)) {
    answeredState[taskId] = true;
    input.disabled = true;
    fb.className = 'quiz-feedback show-correct';
    fb.innerHTML = `${getIconSvg('sparkles')} <b>${getLang() === 'en' ? 'Correct!' : 'Правильно!'}</b> (+10 XP)`;
    if (typeof addXP === 'function') addXP(10);
  } else {
    fb.className = 'quiz-feedback show-wrong';
    fb.innerHTML = `${getIconSvg('close')} <b>${getLang() === 'en' ? 'Try again.' : 'Спробуйте ще раз.'}</b> (${getLang() === 'en' ? 'Correct:' : 'Правильна відповідь:'} <b>${task.answers[0]}</b>)`;
  }

  if (task && task.explanation) {
    fb.innerHTML += `<div class="quiz-explanation">${getIconSvg('lightbulb')} <b>${getLang() === 'en' ? 'Explanation:' : 'Пояснення:'}</b> ${getText(task.explanation)}</div>`;
  }
}

/* ── 3. Audio Listening Renderer ── */
function renderListenPanel(items) {
  const container = document.getElementById('container-listen');
  if (!items.length) { container.innerHTML = renderEmptyState(); return; }

  const groups = groupByCategory(items);
  let html = '';

  for (const catKey in groups) {
    html += renderCategoryHeader(catKey, groups[catKey].length);
    groups[catKey].forEach(task => {
      const catName = getCategoryLabel(task.category);

      html += `
        <div class="quiz-card" id="card-${task.id}">
          <div class="card-meta-header">
            <div class="card-tags">
              <span class="badge-cat">${catName}</span>
            </div>
            <div class="quiz-q-num">${getLang() === 'en' ? 'Listening Practice' : 'Аудіювання'}</div>
          </div>
          <div class="quiz-question" id="external-style-exercises-6">
            <button class="audio-btn" onclick="speak('${task.audioWord}', this)" title="Listen to Italian word" id="external-style-exercises-7"><svg class="ls-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16.5 9a4 4 0 0 1 0 6M19 6.5a7.5 7.5 0 0 1 0 11"/></svg></button>
            <span>${getText(task.instruction)}</span>
          </div>
          <div class="quiz-options">
            ${task.options.map((opt, oIdx) => `
              <div class="quiz-opt" data-correct="${opt.correct}" onclick="handleMCQClick('${task.id}', ${oIdx}, ${opt.correct}, this)">
                ${getText(opt.text)}
              </div>
            `).join('')}
          </div>
          <div class="quiz-feedback" id="fb-${task.id}"></div>
        </div>
      `;
    });
  }
  container.innerHTML = html;
}

/* ── 4. Dialogue Renderer ── */
function renderDialoguePanel(items) {
  const container = document.getElementById('container-dialogue');
  if (!items.length) { container.innerHTML = renderEmptyState(); return; }

  const groups = groupByCategory(items);
  let html = '';

  for (const catKey in groups) {
    html += renderCategoryHeader(catKey, groups[catKey].length);
    groups[catKey].forEach(task => {
      const catName = getCategoryLabel(task.category);

      html += `
        <div class="quiz-card" id="card-${task.id}">
          <div class="card-meta-header">
            <div class="card-tags">
              <span class="badge-cat">${catName}</span>
            </div>
            <div class="quiz-q-num">${getLang() === 'en' ? 'Interactive Dialogue' : 'Практика діалогу'}</div>
          </div>
          <div class="quiz-question">
            <div>${getIconSvg('user')} ${task.lineA}</div>
            <div id="external-style-exercises-8">${getIconSvg('user')} ${getText(task.instruction)}</div>
          </div>
          <div class="quiz-options">
            ${task.options.map((opt, oIdx) => `
              <div class="quiz-opt" data-correct="${opt.correct}" onclick="handleMCQClick('${task.id}', ${oIdx}, ${opt.correct}, this)">
                ${getIconSvg('chat')} ${opt.text}
              </div>
            `).join('')}
          </div>
          <div class="quiz-feedback" id="fb-${task.id}"></div>
        </div>
      `;
    });
  }
  container.innerHTML = html;
}

/* ── 5. Matching Pairs Renderer ── */
let currentMatchData = [];
let matchSelected = { it: null, target: null };
let matchFoundCount = 0;

function renderMatchingPanel(filteredItems) {
  const container = document.getElementById('container-match');
  const matchTasks = (filteredItems || TASK_BANK).filter(t => t.format === 'match');

  if (!matchTasks.length) { container.innerHTML = renderEmptyState(); return; }

  const task = matchTasks[0];
  currentMatchData = task.pairs;
  matchSelected = { it: null, target: null };
  matchFoundCount = 0;

  const shuffledIt = [...currentMatchData].sort(() => Math.random() - 0.5);
  const shuffledTarget = [...currentMatchData].sort(() => Math.random() - 0.5);

  container.innerHTML = `
    <div class="quiz-card">
      <div class="card-meta-header">
        <div class="card-tags">
          <span class="badge-cat">${getLang() === 'en' ? 'Word Matching' : 'Зіставлення слів'}</span>
        </div>
        <div class="quiz-q-num">${getText(task.title)}</div>
      </div>
      <div class="quiz-question">${getLang() === 'en' ? 'Select an Italian word, then select its translation' : 'Натисніть італійське слово, а потім відповідний переклад'}</div>
      
      <div class="match-wrap">
        <div class="match-col" id="matchColIt">
          ${shuffledIt.map(m => `<div class="match-item" data-id="${m.id}" data-side="it" onclick="selectMatchItem(this)">${m.it}</div>`).join('')}
        </div>
        <div class="match-col" id="matchColTarget">
          ${shuffledTarget.map(m => `<div class="match-item" data-id="${m.id}" data-side="target" onclick="selectMatchItem(this)">${getLang() === 'en' ? m.en : m.ua}</div>`).join('')}
        </div>
      </div>

      <div class="match-status" id="matchStatus">${getLang() === 'en' ? 'Pairs found' : 'Знайдено пар'}: 0/${currentMatchData.length}</div>
      <div id="external-style-exercises-9">
        <button class="btn-ghost" onclick="renderMatchingPanel()">${getIconSvg('shuffle')} ${getLang() === 'en' ? 'Shuffle again' : 'Перемішати заново'}</button>
      </div>
    </div>
  `;
}

function selectMatchItem(el) {
  const side = el.dataset.side;
  if (el.classList.contains('matched')) return;

  if (matchSelected[side]) matchSelected[side].classList.remove('selected');
  el.classList.add('selected');
  matchSelected[side] = el;

  if (matchSelected.it && matchSelected.target) {
    const itEl = matchSelected.it, targetEl = matchSelected.target;
    if (itEl.dataset.id === targetEl.dataset.id) {
      itEl.classList.remove('selected');
      targetEl.classList.remove('selected');
      itEl.classList.add('matched');
      targetEl.classList.add('matched');
      matchFoundCount++;
      
      document.getElementById('matchStatus').textContent = `${getLang() === 'en' ? 'Pairs found' : 'Знайдено пар'}: ${matchFoundCount}/${currentMatchData.length}`;
      matchSelected = { it: null, target: null };

      if (matchFoundCount === currentMatchData.length) {
        if (typeof addXP === 'function') addXP(20);
        document.getElementById('matchStatus').innerHTML += ` ${getIconSvg('sparkles')} <b>${getLang() === 'en' ? 'All pairs matched!' : 'Всі пари знайдено!'}</b> (+20 XP)`;
      }
    } else {
      itEl.classList.add('wrong');
      targetEl.classList.add('wrong');
      setTimeout(() => {
        itEl.classList.remove('selected', 'wrong');
        targetEl.classList.remove('selected', 'wrong');
        matchSelected = { it: null, target: null };
      }, 600);
    }
  }
}

/* ── 6. Sentence Builder / Reorder Renderer ── */
const reorderStateMap = {};

function renderReorderPanel(filteredItems) {
  const container = document.getElementById('container-reorder');
  const items = (filteredItems || TASK_BANK).filter(t => t.format === 'reorder');

  if (!items.length) { container.innerHTML = renderEmptyState(); return; }

  container.innerHTML = items.map(task => {
    if (!reorderStateMap[task.id]) {
      reorderStateMap[task.id] = {
        pool: [...task.words].sort(() => Math.random() - 0.5),
        answer: []
      };
    }
    const catName = getCategoryLabel(task.category);

    return `
      <div class="quiz-card" id="card-${task.id}">
        <div class="card-meta-header">
          <div class="card-tags">
            <span class="badge-cat">${catName}</span>
          </div>
          <div class="quiz-q-num">${getLang() === 'en' ? 'Build the sentence' : 'Складіть речення'}</div>
        </div>
        <div class="quiz-question">${getIconSvg('chat')} «${getText(task.clue)}»</div>
        <div class="reorder-answer" id="ans-${task.id}"></div>
        <div class="reorder-pool" id="pool-${task.id}"></div>
        <div id="external-style-exercises-10">
          <button class="btn-primary" onclick="checkReorderSentence('${task.id}')">${getLang() === 'en' ? 'Check' : 'Перевірити'}</button>
          <button class="btn-ghost" onclick="resetReorderSentence('${task.id}')">${getLang() === 'en' ? 'Reset' : 'Скинути'}</button>
        </div>
        <div class="quiz-feedback" id="fb-${task.id}"></div>
      </div>
    `;
  }).join('');

  items.forEach(task => drawReorderChips(task.id));
}

function drawReorderChips(id) {
  const st = reorderStateMap[id];
  if (!st) return;
  const poolEl = document.getElementById(`pool-${id}`);
  const ansEl = document.getElementById(`ans-${id}`);
  if (!poolEl || !ansEl) return;

  poolEl.innerHTML = st.pool.map((w, i) => `<span class="reorder-chip" onclick="moveChipToAnswer('${id}',${i})">${w}</span>`).join('');
  ansEl.innerHTML = st.answer.length
    ? st.answer.map((w, i) => `<span class="reorder-chip answer-chip" onclick="moveChipToPool('${id}',${i})">${w}</span>`).join('')
    : `<span id="external-style-exercises-11">${getLang() === 'en' ? 'Click words below to assemble sentence' : 'Натисніть слова знизу, щоб скласти речення'}</span>`;
}

function moveChipToAnswer(id, idx) {
  const st = reorderStateMap[id];
  const [w] = st.pool.splice(idx, 1);
  st.answer.push(w);
  drawReorderChips(id);
}

function moveChipToPool(id, idx) {
  const st = reorderStateMap[id];
  const [w] = st.answer.splice(idx, 1);
  st.pool.push(w);
  drawReorderChips(id);
}

function resetReorderSentence(id) {
  const task = TASK_BANK.find(x => x.id === id);
  reorderStateMap[id] = { pool: [...task.words].sort(() => Math.random() - 0.5), answer: [] };
  const fb = document.getElementById(`fb-${id}`);
  if (fb) { fb.className = 'quiz-feedback'; fb.innerHTML = ''; }
  delete answeredState[id];
  drawReorderChips(id);
}

function checkReorderSentence(id) {
  if (answeredState[id]) return;
  const task = TASK_BANK.find(x => x.id === id);
  const st = reorderStateMap[id];
  const fb = document.getElementById(`fb-${id}`);

  if (st.answer.join(' ') === task.words.join(' ')) {
    answeredState[id] = true;
    fb.className = 'quiz-feedback show-correct';
    fb.innerHTML = `${getIconSvg('sparkles')} <b>${getLang() === 'en' ? 'Correct!' : 'Правильно!'}</b> (+10 XP)`;
    if (typeof addXP === 'function') addXP(10);
  } else {
    fb.className = 'quiz-feedback show-wrong';
    fb.innerHTML = `${getIconSvg('close')} <b>${getLang() === 'en' ? 'Not quite right.' : 'Ще не так.'}</b> ${getLang() === 'en' ? 'Check the word order.' : 'Спробуйте ще раз.'}`;
  }

  if (task && task.explanation) {
    fb.innerHTML += `<div class="quiz-explanation">${getIconSvg('lightbulb')} <b>${getLang() === 'en' ? 'Explanation:' : 'Пояснення:'}</b> ${getText(task.explanation)}</div>`;
  }
}

/* ── 7. Custom Dictionary Quiz Generator ── */
const DICT_BASE_TASKS = [
  { word: 'ciao', trans: 'привіт / бувай' },
  { word: 'come stai?', trans: 'як справи?' },
  { word: 'bene', trans: 'добре' },
  { word: 'grazie', trans: 'дякую' },
  { word: 'prego', trans: 'будь ласка / нема за що' },
  { word: 'sì', trans: 'так' },
  { word: 'no', trans: 'ні' },
  { word: "anch'io", trans: 'я теж' },
  { word: 'nuovo/a', trans: 'новий / нова' },
  { word: 'benvenuto/a', trans: 'ласкаво просимо' },
  { word: 'palazzo', trans: 'будинок (багатоповерховий)' },
  { word: 'grazie mille', trans: 'дуже дякую' }
];

function getAllDictWords() {
  let custom = [];
  try { custom = JSON.parse(localStorage.getItem(DICT_KEY) || '[]'); } catch {}
  const baseWords = DICT_BASE_TASKS.map(w => ({
    ...w,
    trans: typeof getSourceTranslation === 'function' ? getSourceTranslation(`flashcards.${w.word}`, w.trans) : w.trans
  }));
  return [...baseWords, ...custom.map(c => ({ word: c.word, trans: c.trans }))];
}

function generateDictQuiz() {
  const pool = getAllDictWords();
  const container = document.getElementById('dictQuizContainer');

  if (pool.length < 3) {
    container.textContent = getLang() === 'en' ? 'Add more words to your dictionary to generate a quiz (at least 3).' : 'Додайте більше слів у словник, щоб згенерувати тест (мінімум 3).';
    return;
  }

  const qCount = Math.min(5, pool.length);
  const chosen = [...pool].sort(() => Math.random() - 0.5).slice(0, qCount);

  container.innerHTML = chosen.map((q, i) => {
    const distractors = [...pool.filter(w => w.word !== q.word)].sort(() => Math.random() - 0.5).slice(0, 2);
    const options = [...[{ ...q, correct: true }], ...distractors.map(d => ({ ...d, correct: false }))].sort(() => Math.random() - 0.5);
    const qid = `dq_${Date.now()}_${i}`;
    return `
      <div class="quiz-card" id="card-${qid}">
        <div class="quiz-q-num">${getLang() === 'en' ? 'Question' : 'Питання'} ${i + 1} ${getLang() === 'en' ? 'of' : 'з'} ${qCount}</div>
        <div class="quiz-question">${getLang() === 'en' ? 'What does' : 'Що означає'} «<b>${q.word}</b>»${getLang() === 'en' ? ' mean?' : '?'}</div>
        <div class="quiz-options">
          ${options.map((o, idx) => `
            <div class="quiz-opt" data-correct="${o.correct}" onclick="handleMCQClick('${qid}', ${idx}, ${o.correct}, this)">
              ${o.trans}
            </div>
          `).join('')}
        </div>
        <div class="quiz-feedback" id="fb-${qid}"></div>
      </div>
    `;
  }).join('');
}

/* ════════════════════════════════════════════════════════════════════
   INITIALIZATION
   ════════════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const requestedGroup = urlParams.get('group');
  if (requestedGroup && ['grammar', 'situational'].includes(requestedGroup)) {
    const groupSelect = document.getElementById('groupFilterSelect');
    if (groupSelect) groupSelect.value = requestedGroup;
  }

  const filterToggle = document.querySelector('[data-filter-toggle="exercises"]');
  const exerciseFiltersPanel = document.getElementById('exerciseFiltersPanel');
  if (filterToggle && exerciseFiltersPanel) {
    filterToggle.addEventListener('click', () => {
      const isOpen = filterToggle.getAttribute('aria-expanded') === 'true';
      filterToggle.setAttribute('aria-expanded', String(!isOpen));
      exerciseFiltersPanel.classList.toggle('hidden', isOpen);
    });
  }

  applyFiltersAndSort();
});

document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-exercises-1]');
  if (!target) return;
  var result = (function(event) {
closeMobNav()
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-exercises-2]');
  if (!target) return;
  var result = (function(event) {
closeMobNav()
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-exercises-3]');
  if (!target) return;
  var result = (function(event) {
location.href='units.html'
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-exercises-4]');
  if (!target) return;
  var result = (function(event) {
location.href='flashcards.html'
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-exercises-5]');
  if (!target) return;
  var result = (function(event) {
location.href='exercises.html'
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-exercises-6]');
  if (!target) return;
  var result = (function(event) {
location.href='dictionary.html'
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-exercises-7]');
  if (!target) return;
  var result = (function(event) {
location.href='games.html'
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-exercises-8]');
  if (!target) return;
  var result = (function(event) {
location.href='grammar.html'
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-exercises-9]');
  if (!target) return;
  var result = (function(event) {
toggleTheme()
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-exercises-10]');
  if (!target) return;
  var result = (function(event) {
openProfileModal()
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-exercises-11]');
  if (!target) return;
  var result = (function(event) {
openMobNav()
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-exercises-12]');
  if (!target) return;
  var result = (function(event) {
setCategoryFilter('all')
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-exercises-13]');
  if (!target) return;
  var result = (function(event) {
setCategoryFilter('articles')
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-exercises-14]');
  if (!target) return;
  var result = (function(event) {
setCategoryFilter('verbs')
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-exercises-15]');
  if (!target) return;
  var result = (function(event) {
setCategoryFilter('pronouns')
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-exercises-16]');
  if (!target) return;
  var result = (function(event) {
setCategoryFilter('sentence')
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-exercises-17]');
  if (!target) return;
  var result = (function(event) {
setCategoryFilter('greetings')
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-exercises-18]');
  if (!target) return;
  var result = (function(event) {
setCategoryFilter('cafe')
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-exercises-19]');
  if (!target) return;
  var result = (function(event) {
setCategoryFilter('directions')
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-exercises-20]');
  if (!target) return;
  var result = (function(event) {
setCategoryFilter('shopping')
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('change', function(event) {
  var target = event.target.closest('[data-external-handler-exercises-21]');
  if (!target) return;
  var result = (function(event) {
applyFiltersAndSort()
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('change', function(event) {
  var target = event.target.closest('[data-external-handler-exercises-22]');
  if (!target) return;
  var result = (function(event) {
applyFiltersAndSort()
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('change', function(event) {
  var target = event.target.closest('[data-external-handler-exercises-23]');
  if (!target) return;
  var result = (function(event) {
applyFiltersAndSort()
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('input', function(event) {
  var target = event.target.closest('[data-external-handler-exercises-24]');
  if (!target) return;
  var result = (function(event) {
applyFiltersAndSort()
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-exercises-25]');
  if (!target) return;
  var result = (function(event) {
showTaskTab('mcq')
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-exercises-26]');
  if (!target) return;
  var result = (function(event) {
showTaskTab('blank')
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-exercises-27]');
  if (!target) return;
  var result = (function(event) {
showTaskTab('match')
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-exercises-28]');
  if (!target) return;
  var result = (function(event) {
showTaskTab('reorder')
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-exercises-29]');
  if (!target) return;
  var result = (function(event) {
showTaskTab('listen')
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-exercises-30]');
  if (!target) return;
  var result = (function(event) {
showTaskTab('dialogue')
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-exercises-31]');
  if (!target) return;
  var result = (function(event) {
showTaskTab('dict')
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-exercises-32]');
  if (!target) return;
  var result = (function(event) {
generateDictQuiz()
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});
