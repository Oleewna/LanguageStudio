/**
 * LanguageStudio - Shared Helper Script
 */

const XP_KEY = 'ls_xp';
const DICT_KEY = 'ls_custom_dict';
const SOURCE_LANGUAGE_KEY = 'ls_italian_source_language';
const SOURCE_LANGUAGES = [
  { code: 'uk', label: 'Українська' },
  { code: 'en', label: 'English' }
];

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
  const savedLanguage = localStorage.getItem(SOURCE_LANGUAGE_KEY);
  return SOURCE_LANGUAGES.some(language => language.code === savedLanguage) ? savedLanguage : 'uk';
}

function getSourceTranslation(key, fallback = '') {
  const translations = SOURCE_TRANSLATIONS[key];
  return translations?.[getSourceLanguage()] || translations?.uk || fallback;
}

function applySourceLanguageSettings() {
  const language = getSourceLanguage();
  document.querySelectorAll('[data-source-language-select]').forEach(select => {
    select.innerHTML = SOURCE_LANGUAGES.map(option => `<option value="${option.code}">${option.label}</option>`).join('');
    select.value = language;
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

// Visual audio button click handler (voice synthesis deactivated as requested)
function speak(text, btnElement) {
  // Visual pulse / indicator for future audio playback
  if (btnElement && btnElement.classList) {
    btnElement.classList.add('audio-playing');
    setTimeout(() => btnElement.classList.remove('audio-playing'), 500);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  updateXPDisplay();
  applySourceLanguageSettings();
});
