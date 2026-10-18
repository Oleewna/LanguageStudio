/**
 * LanguageStudio - Lessons Data Registry
 * Central repository of course lessons, structured by modular block sections.
 * Supports multiple interface & learning languages (uk, en, etc.)
 */

(function () {
  'use strict';

  /** @type {Record<string, object>} */
  const LS_LESSONS = {
    // ═══════════════════════════════════════════════════════════════════════
    // LESSON 1: Dialogue (Знайомство — Come ti chiami?)
    // ═══════════════════════════════════════════════════════════════════════
    'communication-basics-1': {
      id: 'communication-basics-1',
      unitId: 'communication-basics',
      unitTitle: {
        uk: 'Основи спілкування',
        en: 'Communication basics',
      },
      lessonNum: 1,
      type: 'dialogue',
      title: {
        uk: 'Знайомство',
        en: 'Introductions',
      },
      subtitle: {
        uk: 'Primo incontro in classe',
        en: 'First meeting in class',
      },
      description: {
        uk: 'Навчіться вітатися, називати своє ім’я та країну й підтримувати коротке знайомство.',
        en: 'Learn to greet someone, say your name and country, and start a short conversation.',
      },
      duration: '20 хв',
      xpReward: 50,
      nextLessonId: 'communication-basics-1-practice',
      prevLessonId: null,

      sections: [
        // ── Block 1: Dialogue ───────────────────────────────────────────
        {
          type: 'dialogue',
          title: {
            uk: 'Діалог',
            en: 'Dialogue'
          },
          story: {
            uk: 'Софія приходить раніше до класу і шукає вільне місце; Ґрета допомагає. Коли починається заняття, учитель просить коротко назвати ім’я і країну.',
            en: 'Sofia arrives early looking for a free seat; Greta helps. When class begins the teacher asks everyone to give a quick name-and-country introduction.'
          },
          image: '../assets/images/communication-basics.jpg',
          imageAlt: {
            uk: 'Студентки знайомляться в класі',
            en: 'Students meeting in a classroom'
          },
          lines: [
            {
              speaker: 'Sofia',
              avatar: 'S',
              it: 'Scusa, questo posto è libero?',
              pronunciation: {
                uk: '[ску-са, кве-сто по-сто е ли-бе-ро?]',
                en: '[SKOO-sa, KWESS-toh POS-toh eh lee-BEH-roh?]'
              },
              translations: {
                uk: 'Вибачте, це місце вільне?',
                en: 'Excuse me, is this seat free?'
              },
              audio: true
            },
            {
              speaker: 'Greta',
              avatar: 'G',
              it: 'Sì, certo. Anche tu sei qui per il corso d\'italiano?',
              pronunciation: {
                uk: '[сі, чер-то. ан-ке ту сей к’ю пер ил кор-со д’і-та-лі-я-но?]',
                en: '[SEE, CHAIR-toh. AHN-keh too SAY kwee pair eel KOR-soh dee-tah-lee-AH-noh?]'
              },
              translations: {
                uk: 'Так, звісно. Ти теж на курсі італійської?',
                en: 'Yes, of course. Are you here for the Italian course too?'
              },
              audio: true
            },
            {
              speaker: 'Sofia',
              avatar: 'S',
              it: 'Sì, è la mia prima lezione. Mi chiamo Sofia.',
              pronunciation: {
                uk: '[сі, е ла м’я пра-ма ле-цьо-не. мі к’я-мо Со-фі-а.]',
                en: '[SEE, eh lah MEE-ah PREE-mah leh-TZYOH-neh. mee KYAH-moh SOH-fee-ah.]'
              },
              translations: {
                uk: 'Так, це моє перше заняття. Мене звати Софія.',
                en: "Yes, it's my first lesson. My name is Sofia."
              },
              audio: true
            },
            {
              speaker: 'Greta',
              avatar: 'G',
              it: 'Piacere, Sofia. Io sono Greta.',
              pronunciation: {
                uk: '[п’я-че-ре, Со-фі-а. йо со-но Ґре-та.]',
                en: '[pyah-CHEH-reh, SOH-fee-ah. ee-OH SOH-noh GREH-tah.]'
              },
              translations: {
                uk: 'Приємно, Софіє. Я — Ґрета.',
                en: 'Nice to meet you, Sofia. I am Greta.'
              },
              audio: true
            },
            {
              speaker: 'Insegnante',
              avatar: 'I',
              it: 'Buongiorno a tutti. Cominciamo con un giro veloce: nome e paese.',
              pronunciation: {
                uk: '[буон-джор-но а ту-ті. ко-мі-ня-мо кон ун джі-ро ве-ло-че: но-ме е па-е-се.]',
                en: '[bwon-JOR-noh ah TOO-tee. koh-MEEN-yah-moh kohn oon JEE-roh veh-LOH-cheh: NOH-meh eh pah-EH-seh.]'
              },
              translations: {
                uk: 'Доброго дня всім. Розпочнемо швидкий круг: ім’я і країна.',
                en: 'Good morning everyone. Let’s start a quick round: name and country.'
              },
              audio: true
            },
            {
              speaker: 'Sofia',
              avatar: 'S',
              it: 'Sono Sofia. Vengo dall\'Ucraina.',
              pronunciation: {
                uk: '[со-но Со-фі-а. вен-го даль-украї-на.]',
                en: '[SOH-noh SOH-fee-ah. VEHN-goh dall-oo-KRAI-na.]'
              },
              translations: {
                uk: 'Я — Софія. Я з України.',
                en: 'I am Sofia. I come from Ukraine.'
              },
              audio: true
            },
            {
              speaker: 'Insegnante',
              avatar: 'I',
              it: 'Benvenuta, Sofia. Greta?',
              pronunciation: {
                uk: '[бен-ве-ну-та, Со-фі-а. Ґре-та?]',
                en: '[behn-veh-NOO-tah, SOH-fee-ah. GREH-tah?]'
              },
              translations: {
                uk: 'Ласкаво просимо, Софіє. Ґрета?',
                en: 'Welcome, Sofia. Greta?'
              },
              audio: true
            },
            {
              speaker: 'Greta',
              avatar: 'G',
              it: 'Vengo dalla Germania. Sono tedesca.',
              pronunciation: {
                uk: '[вен-го даль-ла Ґер-ма-ні-а. со-но те-дес-ка.]',
                en: '[VEHN-goh DAHL-lah jer-MAH-nee-ah. SOH-noh teh-DES-kah.]'
              },
              translations: {
                uk: 'Я з Німеччини. Я німкеня.',
                en: 'I come from Germany. I am German.'
              },
              audio: true
            },
            {
              speaker: 'Sofia',
              avatar: 'S',
              it: 'Ah, che bello!',
              pronunciation: {
                uk: '[а, ке бел-ло!]',
                en: '[ah, keh BEL-loh!]'
              },
              translations: {
                uk: 'О, як чудово!',
                en: 'Ah, how nice!'
              },
              audio: true
            },
            {
              speaker: 'Greta',
              avatar: 'G',
              it: 'E tu?',
              pronunciation: {
                uk: '[е ту?]',
                en: '[eh TOO?]'
              },
              translations: {
                uk: 'А ти?',
                en: 'And you?'
              },
              audio: true
            },
            {
              speaker: 'Sofia',
              avatar: 'S',
              it: 'Sono ucraina.',
              pronunciation: {
                uk: '[со-но у-краї-на.]',
                en: '[SOH-noh oo-KRAI-na.]'
              },
              translations: {
                uk: 'Я — українка.',
                en: 'I am Ukrainian.'
              },
              audio: true
            },
            {
              speaker: 'Insegnante',
              avatar: 'I',
              it: 'E tu, Luca?',
              pronunciation: {
                uk: '[е ту, Лу-ка?]',
                en: '[eh TOO, LOO-kah?]'
              },
              translations: {
                uk: 'А ти, Луко?',
                en: 'And you, Luca?'
              },
              audio: true
            },
            {
              speaker: 'Luca',
              avatar: 'L',
              it: 'Sono francese, vengo dalla Francia.',
              pronunciation: {
                uk: '[со-но фран-че-зе, вен-го даль-ла Фран-ча.]',
                en: '[SOH-noh frahn-CHEH-zeh, VEHN-goh DAHL-lah FRAHN-chah.]'
              },
              translations: {
                uk: 'Я — француз, я з Франції.',
                en: 'I am French, I come from France.'
              },
              audio: true
            }
          ]
        },

        // ── Block 2: Vocab ──────────────────────────────────────────────
        {
          type: 'vocab',
          title: {
            uk: 'Словник',
            en: 'Vocabulary'
          },
          items: [
            { it: "questo posto è libero?", pronunciation: { uk: '[кве-сто по-сто е лі-бе-ро]', en: '[KWEH-stoh POH-stoh eh LEE-beh-roh]' }, translations: { uk: 'це місце вільне?', en: 'is this seat free?' } },
            { it: 'certo', pronunciation: { uk: '[чер-то]', en: '[CHAIR-toh]' }, translations: { uk: 'звісно', en: 'of course' } },
            { it: 'anche tu?', pronunciation: { uk: '[ан-ке ту]', en: '[AHN-keh too]' }, translations: { uk: 'ти теж?', en: 'you too?' } },
            { it: "il corso d'italiano", pronunciation: { uk: '[іл кор-со ді-та-лі-а-но]', en: '[eel KOR-soh dee-tah-lee-AH-noh]' }, translations: { uk: 'курс італійської', en: 'Italian course' } },
            { it: 'la prima lezione', pronunciation: { uk: '[ла прі-ма ле-цьо-не]', en: '[lah PREE-mah leh-TSYOH-neh]' }, translations: { uk: 'перше заняття', en: 'the first lesson' } },
            { it: 'piacere', pronunciation: { uk: '[п’я-че-ре]', en: '[pyah-CHEH-reh]' }, translations: { uk: 'приємно познайомитися', en: 'nice to meet you' } },
            { it: 'il paese', pronunciation: { uk: '[іл па-е-зе]', en: '[eel pah-EH-zeh]' }, translations: { uk: 'країна', en: 'country' } },
            { it: 'venire da', pronunciation: { uk: '[ве-ні-ре да]', en: '[veh-NEE-reh dah]' }, translations: { uk: 'бути родом із', en: 'to come from' } },
            { it: "l'Ucraina", pronunciation: 'uk-RAI-na', translations: { uk: 'Україна', en: 'Ukraine' } },
            { it: 'la Germania', pronunciation: 'ger-MA-nee-a', translations: { uk: 'Німеччина', en: 'Germany' } },
            { it: 'la Francia', pronunciation: 'FRAN-cha', translations: { uk: 'Франція', en: 'France' } },
            { it: 'ucraino/a', pronunciation: 'uk-ra-EE-no/a', translations: { uk: 'українець/українка', en: 'Ukrainian' } },
            { it: 'tedesco/a', pronunciation: 'te-DES-ko/a', translations: { uk: 'німець/німкеня', en: 'German' } },
            { it: 'francese', pronunciation: 'fran-CHE-ze', translations: { uk: 'француз/француженка', en: 'French' } },
            { it: 'che bello!', pronunciation: { uk: '[ке бел-ло]', en: '[keh BEHL-loh]' }, translations: { uk: 'як чудово!', en: 'how nice!' } }
          ],
          notes: [
            {
              type: 'default',
              title: { uk: 'Нотатка', en: 'Note' },
              text: {
                uk: 'Про країни зверніть увагу на прийменники: «vengo dall\'Ucraina», «dalla Germania», «dalla Francia».',
                en: "Note the country prepositions: 'vengo dall\'Ucraina', 'dalla Germania', 'dalla Francia'."
              }
            }
          ]
        },

        // ── Block 3: Takeaways ──────────────────────────────────────────
        {
          type: 'takeaways',
          title: {
            uk: 'Що запам’ятати',
            en: 'Key takeaways'
          },
          items: [
            { uk: '<i>Scusa, questo posto è libero?</i> — ввічливий спосіб запитати про місце.', en: '<i>Scusa, questo posto è libero?</i> — polite way to ask about a seat.' },
            { uk: '<i>Sono ... / Vengo da ...</i> — скажіть ім’я та звідки ви.', en: '<i>Sono ... / Vengo da ...</i> — give your name and where you come from.' },
            { uk: 'Використовуйте правильний артикль при назві країни: «dall\'Ucraina», «dalla Germania».', en: 'Use the correct article for countries: "dall\'Ucraina", "dalla Germania".' }
          ]
        },

        // ── Block 4: Quiz ───────────────────────────────────────────────
        {
          type: 'quiz',
          title: {
            uk: 'Практика',
            en: 'Practice'
          },
          tasks: [
            {
              id: 'cb1_q1',
              type: 'choice',
              category: { uk: 'Множинний вибір', en: 'Multiple choice' },
              question: { uk: 'Як перекладається «questo posto è libero?»', en: 'How do you translate "questo posto è libero?"' },
              options: [
                { translations: { uk: 'Це місце вільне?', en: 'Is this seat free?' } },
                { translations: { uk: 'Це моє місце?', en: 'Is this my seat?' } },
                { translations: { uk: 'Тут тепло?', en: 'Is it warm here?' } }
              ],
              correctIndex: 0
            },
            {
              id: 'cb1_q2',
              type: 'choice',
              category: { uk: 'Множинний вибір', en: 'Multiple choice' },
              question: { uk: 'Що означає «Piacere» після знайомства?', en: 'What does "Piacere" mean after introductions?' },
              options: [ { translations: { uk: 'Приємно познайомитися', en: 'Nice to meet you' } }, { translations: { uk: 'До зустрічі', en: 'See you' } }, { translations: { uk: 'Дякую', en: 'Thank you' } } ],
              correctIndex: 0
            },
            {
              id: 'cb1_q3',
              type: 'fill_blank',
              category: { uk: 'Встав слово', en: 'Fill in the blank' },
              prefix: 'Sono',
              suffix: '.',
              placeholder: { uk: 'вставте національність', en: 'enter nationality' },
              acceptableAnswers: ['ucraina', 'ucraino', 'tedesca', 'tedesco', 'francese']
            }
          ]
        }
      ]
    },

    // ═══════════════════════════════════════════════════════════════════════
    // LESSON 2: Reading Template (Перший день у Римі — Un caffè al bar)
    // ═══════════════════════════════════════════════════════════════════════
    'communication-basics-2': {
      id: 'communication-basics-2',
      unitId: 'communication-basics',
      unitTitle: {
        uk: 'Основи спілкування',
        en: 'Communication basics',
      },
      lessonNum: 2,
      type: 'dialogue',
      title: {
        uk: 'Навчання, робота і мови',
        en: 'Study, work, and languages',
      },
      subtitle: {
        uk: 'Робота в парах',
        en: 'A pair activity',
      },
      description: {
        uk: 'Навчіться розповідати про навчання, роботу, мови й родину та ставити прості запитання.',
        en: 'Learn to talk about study, work, languages, and family, and ask simple questions.',
      },
      duration: { uk: '20 хв', en: '20 min' },
      xpReward: 50,
      nextLessonId: 'communication-basics-3',
      prevLessonId: 'communication-basics-1-practice',

      sections: [
        // ── Block 1: Pair dialogue ──────────────────────────────────────
        {
          type: 'dialogue',
          title: {
            uk: 'Діалог у парах',
            en: 'Pair-work dialogue'
          },
          story: {
            uk: 'На наступному занятті вчитель просить студентів попрацювати в парах і скласти короткий профіль. Софія вирішує показати Ґреті фотографію сестри.',
            en: 'In the next class, the teacher asks students to work in pairs and make a short profile. Sofia chooses to show Greta a photo of her sister.'
          },
          image: '../assets/images/communication-basics.jpg',
          imageAlt: {
            uk: 'Студентки обговорюють завдання в парах',
            en: 'Students discussing a pair activity'
          },
          lines: [
            {
              speaker: { uk: 'Учитель', en: 'Teacher' },
              avatar: 'I',
              it: 'Lavorate a coppie. Parlate di cosa fate, che lingue parlate e perché studiate italiano.',
              translations: {
                uk: 'Працюйте в парах. Розкажіть, чим займаєтеся, якими мовами розмовляєте і чому вивчаєте італійську.',
                en: 'Work in pairs. Talk about what you do, which languages you speak, and why you study Italian.'
              },
              audio: true
            },
            {
              speaker: 'Greta',
              avatar: 'G',
              it: 'Studi o lavori, Sofia?',
              translations: {
                uk: 'Ти навчаєшся чи працюєш, Софіє?',
                en: 'Do you study or work, Sofia?'
              },
              audio: true
            },
            {
              speaker: 'Sofia',
              avatar: 'S',
              it: 'Studio medicina. E tu?',
              translations: {
                uk: 'Я вивчаю медицину. А ти?',
                en: 'I study medicine. And you?'
              },
              audio: true
            },
            {
              speaker: 'Greta',
              avatar: 'G',
              it: 'Studio architettura e il sabato lavoro in libreria.',
              translations: {
                uk: 'Я вивчаю архітектуру, а щосуботи працюю в книгарні.',
                en: 'I study architecture, and I work in a bookshop on Saturdays.'
              },
              audio: true
            },
            {
              speaker: 'Sofia',
              avatar: 'S',
              it: 'Ti piace il lavoro?',
              translations: {
                uk: 'Тобі подобається робота?',
                en: 'Do you like the job?'
              },
              audio: true
            },
            {
              speaker: 'Greta',
              avatar: 'G',
              it: 'Sì, molto. E tu, che lingue parli?',
              translations: {
                uk: 'Так, дуже. А ти якими мовами розмовляєш?',
                en: 'Yes, very much. And you, what languages do you speak?'
              },
              audio: true
            },
            {
              speaker: 'Sofia',
              avatar: 'S',
              it: 'Ucraino e inglese. Studio italiano perché vivo qui con la mia famiglia.',
              translations: {
                uk: 'Українською та англійською. Я вивчаю італійську, бо живу тут із родиною.',
                en: 'Ukrainian and English. I study Italian because I live here with my family.'
              },
              audio: true
            },
            {
              speaker: 'Greta',
              avatar: 'G',
              it: 'Che bello! Io invece studio italiano per lavorare.',
              translations: {
                uk: 'Як чудово! А я вивчаю італійську, щоб працювати.',
                en: 'How nice! I study Italian to work.'
              },
              audio: true
            },
            {
              speaker: 'Sofia',
              avatar: 'S',
              it: 'Guarda, questa è mia sorella Olena.',
              translations: {
                uk: 'Дивись, це моя сестра Олена.',
                en: 'Look, this is my sister Olena.'
              },
              audio: true
            },
            {
              speaker: 'Greta',
              avatar: 'G',
              it: 'Che bella foto! Vive in Ucraina?',
              translations: {
                uk: 'Яке гарне фото! Вона живе в Україні?',
                en: 'What a lovely photo! Does she live in Ukraine?'
              },
              audio: true
            },
            {
              speaker: 'Sofia',
              avatar: 'S',
              it: 'No, vive anche lei qui a Milano. E tu, hai fratelli o sorelle?',
              translations: {
                uk: 'Ні, вона теж живе тут, у Мілані. А в тебе є брати чи сестри?',
                en: 'No, she lives here in Milan too. And do you have any brothers or sisters?'
              },
              audio: true
            },
            {
              speaker: 'Greta',
              avatar: 'G',
              it: 'No, sono figlia unica. Però ho una cugina qui a Milano.',
              translations: {
                uk: 'Ні, я єдина дитина в сім’ї. Але в мене є двоюрідна сестра тут, у Мілані.',
                en: 'No, I am an only child. But I have a cousin here in Milan.'
              },
              audio: true
            }
          ]
        },

        // ── Block 2: Vocabulary ────────────────────────────────────────
        {
          type: 'vocab',
          title: {
            uk: 'Словник',
            en: 'Vocabulary'
          },
          items: [
            { it: 'lavorare a coppie', translations: { uk: 'працювати в парах', en: 'to work in pairs' } },
            { it: 'studiare', translations: { uk: 'навчатися', en: 'to study' } },
            { it: 'lavorare', translations: { uk: 'працювати', en: 'to work' } },
            { it: 'studio... / lavoro...', translations: { uk: 'я навчаюся... / я працюю...', en: 'I study... / I work...' } },
            { it: 'studio e lavoro', translations: { uk: 'я навчаюся і працюю', en: 'I study and work' } },
            { it: 'non lavoro al momento', translations: { uk: 'зараз я не працюю', en: 'I am not working at the moment' } },
            { it: 'in libreria', translations: { uk: 'у книгарні', en: 'in a bookshop' } },
            { it: 'ti piace...?', translations: { uk: 'тобі подобається...?', en: 'do you like...?' } },
            { it: 'che lingue parli?', translations: { uk: 'якими мовами ти розмовляєш?', en: 'what languages do you speak?' } },
            { it: 'parlo...', translations: { uk: 'я розмовляю...', en: 'I speak...' } },
            { it: 'per lavorare', translations: { uk: 'щоб працювати', en: 'in order to work' } },
            { it: 'perché vivo qui', translations: { uk: 'бо я живу тут', en: 'because I live here' } },
            { it: 'la famiglia', translations: { uk: 'родина', en: 'family' } },
            { it: 'vivere', translations: { uk: 'жити', en: 'to live' } },
            { it: 'la sorella / il fratello', translations: { uk: 'сестра / брат', en: 'sister / brother' } },
            { it: 'la foto', translations: { uk: 'фотографія', en: 'photo' } },
            { it: 'figlia unica', translations: { uk: 'єдина дитина (про дівчину)', en: 'an only child (female)' } },
            { it: 'la cugina', translations: { uk: 'двоюрідна сестра', en: 'female cousin' } }
          ]
        },

        // ── Block 3: Takeaways ─────────────────────────────────────────
        {
          type: 'takeaways',
          title: {
            uk: 'Корисні фрази',
            en: 'Useful phrases'
          },
          items: [
            { uk: '<i>Studio...</i> — скажіть, що ви навчаєтеся; <i>Lavoro...</i> — що працюєте.', en: '<i>Studio...</i> means you study; <i>Lavoro...</i> means you work.' },
            { uk: 'Якщо ви поєднуєте навчання й роботу, скажіть: <i>Studio e lavoro.</i>', en: 'If you combine study and work, say: <i>Studio e lavoro.</i>' },
            { uk: 'Якщо зараз не працюєте: <i>Non lavoro al momento.</i> Особисті подробиці можна замінити вигаданими.', en: 'If you are not working now, say: <i>Non lavoro al momento.</i> You can use an imaginary profile instead of personal details.' },
            { uk: '<i>Perché...</i> називає причину, а <i>per + інфінітив</i> — мету: <i>perché vivo qui</i>, <i>per lavorare</i>.', en: '<i>Perché...</i> gives a reason, while <i>per + infinitive</i> gives a purpose: <i>perché vivo qui</i>, <i>per lavorare</i>.' }
          ]
        },

        // ── Block 4: Practice ──────────────────────────────────────────
        {
          type: 'quiz',
          title: {
            uk: 'Практика',
            en: 'Practice'
          },
          tasks: [
            {
              id: 'cb2_q1',
              type: 'choice',
              category: { uk: 'Множинний вибір', en: 'Multiple choice' },
              question: {
                uk: 'Що означає «Lavorate a coppie»?',
                en: 'What does "Lavorate a coppie" mean?'
              },
              options: [
                { translations: { uk: 'Працюйте в парах', en: 'Work in pairs' } },
                { translations: { uk: 'Читайте по черзі', en: 'Take turns reading' } },
                { translations: { uk: 'Працюйте самостійно', en: 'Work independently' } }
              ],
              correctIndex: 0
            },
            {
              id: 'cb2_q2',
              type: 'choice',
              category: { uk: 'Побудова фраз', en: 'Building phrases' },
              question: {
                uk: 'Як сказати «Я вивчаю медицину»?',
                en: 'How do you say “I study medicine”?'
              },
              options: [
                { translations: { uk: 'Studio medicina.', en: 'Studio medicina.' } },
                { translations: { uk: 'Lavoro medicina.', en: 'Lavoro medicina.' } },
                { translations: { uk: 'Parlo medicina.', en: 'Parlo medicina.' } }
              ],
              correctIndex: 0
            },
            {
              id: 'cb2_q3',
              type: 'fill_blank',
              category: { uk: 'Встав слово', en: 'Fill in the blank' },
              prefix: 'Studio italiano',
              suffix: 'lavorare.',
              placeholder: { uk: 'вставте прийменник', en: 'enter the preposition' },
              acceptableAnswers: ['per']
            },
          ]
        }
      ]
    },

    // ═══════════════════════════════════════════════════════════════════════
    // LESSON 3: Interests and everyday life
    // ═══════════════════════════════════════════════════════════════════════
    'communication-basics-3': {
      id: 'communication-basics-3',
      unitId: 'communication-basics',
      unitTitle: {
        uk: 'Основи спілкування',
        en: 'Communication basics',
      },
      lessonNum: 3,
      type: 'dialogue',
      title: {
        uk: 'Інтереси й повсякденне життя',
        en: 'Interests and everyday life',
      },
      subtitle: {
        uk: 'Розмова про вільний час',
        en: 'Talking about free time',
      },
      description: {
        uk: 'Навчіться говорити про захоплення та вільний час і домовлятися про зустріч.',
        en: 'Learn to talk about your interests and free time, and make plans to meet.',
      },
      duration: { uk: '20 хв', en: '20 min' },
      xpReward: 50,
      nextLessonId: null,
      prevLessonId: 'communication-basics-2',

      sections: [
        // ── Block 1: Group dialogue ─────────────────────────────────────
        {
          type: 'dialogue',
          title: {
            uk: 'Розмова в групі',
            en: 'Group conversation'
          },
          story: {
            uk: 'Учитель ділить студентів на невеликі групи й дає їм картку з темою «Вільний час». Софія, Ґрета й Лука знаходять спільні інтереси та домовляються про зустріч.',
            en: 'The teacher puts students into small groups and gives them a card about free time. Sofia, Greta, and Luca find common interests and make a plan to meet.'
          },
          image: '../assets/images/communication-basics.jpg',
          imageAlt: {
            uk: 'Студенти обговорюють захоплення в невеликій групі',
            en: 'Students discussing their interests in a small group'
          },
          lines: [
            {
              speaker: { uk: 'Учитель', en: 'Teacher' },
              avatar: 'I',
              it: 'In piccoli gruppi, parlate di cosa vi piace fare nel tempo libero.',
              translations: {
                uk: 'У невеликих групах поговоріть про те, що вам подобається робити у вільний час.',
                en: 'In small groups, talk about what you like to do in your free time.'
              },
              audio: true
            },
            {
              speaker: 'Sofia',
              avatar: 'S',
              it: 'Mi piace cucinare. E a voi?',
              translations: {
                uk: 'Мені подобається готувати. А вам?',
                en: 'I like cooking. What about you?'
              },
              audio: true
            },
            {
              speaker: 'Greta',
              avatar: 'G',
              it: 'A me piace ascoltare la musica.',
              translations: {
                uk: 'А мені подобається слухати музику.',
                en: 'As for me, I like listening to music.'
              },
              audio: true
            },
            {
              speaker: 'Luca',
              avatar: 'L',
              it: 'Anch\'io! Che musica ascolti?',
              translations: {
                uk: 'Я теж! Яку музику ти слухаєш?',
                en: 'Me too! What music do you listen to?'
              },
              audio: true
            },
            {
              speaker: 'Greta',
              avatar: 'G',
              it: 'Mi piace il pop. E tu, Sofia?',
              translations: {
                uk: 'Мені подобається попмузика. А тобі, Софіє?',
                en: 'I like pop music. What about you, Sofia?'
              },
              audio: true
            },
            {
              speaker: 'Sofia',
              avatar: 'S',
              it: 'Mi piace leggere e cucinare.',
              translations: {
                uk: 'Мені подобається читати й готувати.',
                en: 'I like reading and cooking.'
              },
              audio: true
            },
            {
              speaker: 'Greta',
              avatar: 'G',
              it: 'Davvero? Qual è il tuo piatto preferito?',
              translations: {
                uk: 'Справді? Яка твоя улюблена страва?',
                en: 'Really? What is your favorite dish?'
              },
              audio: true
            },
            {
              speaker: 'Sofia',
              avatar: 'S',
              it: 'Un piatto tradizionale ucraino: il borshch.',
              translations: {
                uk: 'Традиційна українська страва: борщ.',
                en: 'A traditional Ukrainian dish: borshch.'
              },
              audio: true
            },
            {
              speaker: 'Luca',
              avatar: 'L',
              it: 'Buono! Cosa fate di solito nel fine settimana?',
                translations: {
                  uk: 'Звучить смачно! Що ви зазвичай робите на вихідних?',
                  en: 'That sounds delicious! What do you usually do at the weekend?'
              },
              audio: true
            },
            {
              speaker: 'Greta',
              avatar: 'G',
              it: 'Il sabato incontro gli amici. La domenica resto a casa.',
              translations: {
                uk: 'У суботу я зустрічаюся з друзями. У неділю залишаюся вдома.',
                en: 'On Saturdays I meet friends. On Sundays I stay at home.'
              },
              audio: true
            },
            {
              speaker: 'Sofia',
              avatar: 'S',
              it: 'Ti va di prendere un caffè sabato?',
              translations: {
                uk: 'Хочеш випити кави в суботу?',
                en: 'Would you like to get a coffee on Saturday?'
              },
              audio: true
            },
            {
              speaker: 'Greta',
              avatar: 'G',
              it: 'Volentieri! A che ora?',
              translations: {
                uk: 'Із задоволенням! О котрій?',
                en: 'Gladly! What time?'
              },
              audio: true
            },
            {
              speaker: 'Sofia',
              avatar: 'S',
              it: 'Alle tre?',
              translations: {
                uk: 'О третій?',
                en: 'At three?'
              },
              audio: true
            },
            {
              speaker: 'Greta',
              avatar: 'G',
              it: 'Perfetto!',
              translations: {
                uk: 'Чудово!',
                en: 'Perfect!'
              },
              audio: true
            }
          ]
        },

        // ── Block 2: Vocabulary ─────────────────────────────────────────
        {
          type: 'vocab',
          title: {
            uk: 'Словник',
            en: 'Vocabulary'
          },
          items: [
            { it: 'nel tempo libero', translations: { uk: 'у вільний час', en: 'in your free time' } },
            { it: 'mi piace...', translations: { uk: 'мені подобається...', en: 'I like...' } },
            { it: 'a me piace...', translations: { uk: 'а мені подобається...', en: 'as for me, I like...' } },
            { it: 'anch\'io', translations: { uk: 'я теж', en: 'me too' } },
            { it: 'ascoltare la musica', translations: { uk: 'слухати музику', en: 'to listen to music' } },
            { it: 'il pop', translations: { uk: 'попмузика', en: 'pop music' } },
            { it: 'leggere', translations: { uk: 'читати', en: 'to read' } },
            { it: 'cucinare', translations: { uk: 'готувати', en: 'to cook' } },
            { it: 'un piatto tradizionale', translations: { uk: 'традиційна страва', en: 'a traditional dish' } },
            { it: 'il piatto preferito', translations: { uk: 'улюблена страва', en: 'favorite dish' } },
            { it: 'davvero?', translations: { uk: 'справді?', en: 'really?' } },
            { it: 'nel fine settimana', translations: { uk: 'на вихідних', en: 'at the weekend' } },
            { it: 'di solito', translations: { uk: 'зазвичай', en: 'usually' } },
            { it: 'incontrare gli amici', translations: { uk: 'зустрічатися з друзями', en: 'to meet friends' } },
            { it: 'restare a casa', translations: { uk: 'залишатися вдома', en: 'to stay at home' } },
            { it: 'ti va di...?', translations: { uk: 'хочеш...?', en: 'would you like to...?' } },
            { it: 'volentieri!', translations: { uk: 'із задоволенням!', en: 'gladly!' } },
            { it: 'a che ora?', translations: { uk: 'о котрій?', en: 'at what time?' } }
          ]
        },

        // ── Block 3: Takeaways and speaking task ────────────────────────
        {
          type: 'takeaways',
          title: {
            uk: 'Твоя черга говорити',
            en: 'Your turn to speak'
          },
          items: [
            {
              uk: 'Підготуй коротке представлення: <i>Mi chiamo...</i>, <i>Vengo da...</i>, <i>Sono...</i>, <i>Studio... / Lavoro...</i>, <i>Parlo...</i>, <i>Mi piace...</i>. Можна використати вигадані подробиці.',
              en: 'Prepare a short introduction: <i>Mi chiamo...</i>, <i>Vengo da...</i>, <i>Sono...</i>, <i>Studio... / Lavoro...</i>, <i>Parlo...</i>, <i>Mi piace...</i>. You can use fictional details.'
            },
            {
              uk: 'Представся новій групі, розкажи про одне захоплення й постав співрозмовнику запитання про те, що він або вона любить робити.',
              en: 'Introduce yourself to a new group, share one interest, and ask someone what they like to do.'
            }
          ]
        },

        // ── Block 4: Practice ──────────────────────────────────────────
        {
          type: 'quiz',
          title: {
            uk: 'Практика',
            en: 'Practice'
          },
          tasks: [
            {
              id: 'cb3_q1',
              type: 'choice',
              category: { uk: 'Розуміння фраз', en: 'Phrase comprehension' },
              question: {
                uk: 'Що означає «Anch\'io!»?',
                en: 'What does "Anch\'io!" mean?'
              },
              options: [
                { translations: { uk: 'Я теж!', en: 'Me too!' } },
                { translations: { uk: 'Мені подобається!', en: 'I like it!' } },
                { translations: { uk: 'О котрій?', en: 'At what time?' } }
              ],
              correctIndex: 0
            },
            {
              id: 'cb3_q2',
              type: 'choice',
              category: { uk: 'Побудова фраз', en: 'Building phrases' },
              question: {
                uk: 'Як сказати «Мені подобається читати й готувати»?',
                en: 'How do you say “I like reading and cooking”?'
              },
              options: [
                { translations: { uk: 'Mi piace leggere e cucinare.', en: 'Mi piace leggere e cucinare.' } },
                { translations: { uk: 'Mi piace ascoltare la musica.', en: 'Mi piace ascoltare la musica.' } },
                { translations: { uk: 'Mi piace lavorare.', en: 'Mi piace lavorare.' } }
              ],
              correctIndex: 0
            },
            {
              id: 'cb3_q3',
              type: 'fill_blank',
              category: { uk: 'Встав слово', en: 'Fill in the blank' },
              prefix: 'Mi piace',
              suffix: 'e cucinare.',
              placeholder: { uk: 'вставте дієслово', en: 'enter the verb' },
              acceptableAnswers: ['leggere']
            },
          ]
        }
      ]
    },

    // ═══════════════════════════════════════════════════════════════════════
    // ITALIAN READING 1: Vowels, consonants, and syllables
    // ═══════════════════════════════════════════════════════════════════════
    'italian-reading-1': {
      id: 'italian-reading-1',
      unitId: 'italian-reading',
      unitTitle: {
        uk: 'Шлях читання італійською',
        en: 'Italian reading path',
      },
      lessonNum: 1,
      type: 'reading',
      title: {
        uk: 'Голосні, приголосні та склади',
        en: 'Vowels, consonants, and syllables',
      },
      subtitle: {
        uk: 'Перші звуки італійського читання',
        en: 'First sounds in Italian reading',
      },
      description: {
        uk: 'Навчіться чути п’ять голосних, поєднувати прості звуки й ділити короткі слова на склади.',
        en: 'Hear the five vowels, blend simple sounds, and divide short words into syllables.',
      },
      duration: { uk: '12 хв', en: '12 min' },
      xpReward: 35,
      nextLessonId: 'italian-reading-2',
      prevLessonId: null,
      sections: [
        {
          type: 'grammar_rule',
          title: { uk: 'Починаємо читати', en: 'Getting started' },
          explanation: {
            uk: '<p>В італійській є п’ять письмових голосних: <b>a, e, i, o, u</b>. Під час читання їхні звуки чіткі й сталі. Назва літери не є окремим звуком, який треба додавати до слова.</p><p>Приголосні <b>b, d, f, l, m, n, p, r, t, v</b> мають надійні звукові значення. Поєднуйте їх із голосними: <i>ba, be, bi, bo, bu</i>. Для <b>r</b> торкніться язиком ділянки за верхніми зубами; аудіо допоможе почути італійський звук.</p><p><b>S</b> і <b>z</b> можуть звучати по-різному: порівняйте <i>sole</i> та <i>rosa</i>, а також <i>zero</i> та <i>marzo</i>. Не вважайте, що кожна з цих літер завжди має лише один звук.</p><p>Зараз читаємо прості склади й слова без правил наголосу. Звук <b>c</b> і звук <b>g</b> залежать від наступної літери; це розглянемо далі. <b>H</b> сама по собі не вимовляється, а її роль у написанні побачимо в наступних уроках.</p>',
            en: '<p>Italian has five written vowels: <b>a, e, i, o, u</b>. Their reading sounds are clear and steady. A letter name is not an extra sound to add when reading a word.</p><p>The consonants <b>b, d, f, l, m, n, p, r, t, v</b> have dependable sound values. Blend them with vowels: <i>ba, be, bi, bo, bu</i>. For <b>r</b>, tap the tongue just behind the upper teeth; the audio helps you hear the Italian sound.</p><p><b>S</b> and <b>z</b> can sound different in different words: compare <i>sole</i> with <i>rosa</i>, and <i>zero</i> with <i>marzo</i>. Do not assume either letter always has only one sound.</p><p>For now, read simple syllables and words without studying stress rules. The sound of <b>c</b> and <b>g</b> depends on the following letter; we will cover that next. <b>H</b> is not pronounced on its own; its role in spelling appears in later lessons.</p>',
          },
        },
        {
          type: 'vocab',
          title: { uk: 'Слухай і поєднуй', en: 'Listen and blend' },
          items: [
            { it: 'a, e, i, o, u', translations: { uk: 'п’ять голосних', en: 'the five vowels' } },
            { it: 'ba, be, bi, bo, bu', translations: { uk: 'поєднання B з голосними', en: 'B blended with the vowels' } },
            { it: 'da, de, di, do, du', translations: { uk: 'поєднання D з голосними', en: 'D blended with the vowels' } },
            { it: 'fa, fe, fi, fo, fu', translations: { uk: 'поєднання F з голосними', en: 'F blended with the vowels' } },
            { it: 'la, le, li, lo, lu', translations: { uk: 'поєднання L з голосними', en: 'L blended with the vowels' } },
            { it: 'ma, me, mi, mo, mu', translations: { uk: 'поєднання M з голосними', en: 'M blended with the vowels' } },
            { it: 'na, ne, ni, no, nu', translations: { uk: 'поєднання N з голосними', en: 'N blended with the vowels' } },
            { it: 'pa, pe, pi, po, pu', translations: { uk: 'поєднання P з голосними', en: 'P blended with the vowels' } },
            { it: 'ra, re, ri, ro, ru', translations: { uk: 'поєднання R з голосними', en: 'R blended with the vowels' } },
            { it: 'ta, te, ti, to, tu', translations: { uk: 'поєднання T з голосними', en: 'T blended with the vowels' } },
            { it: 'va, ve, vi, vo, vu', translations: { uk: 'поєднання V з голосними', en: 'V blended with the vowels' } },
            { it: 'Mina', translations: { uk: 'Міна', en: 'Mina' } },
            { it: 'Nino', translations: { uk: 'Ніно', en: 'Nino' } },
            { it: 'ama', translations: { uk: 'любить', en: 'loves' } },
            { it: 'luna', translations: { uk: 'місяць', en: 'moon' } },
            { it: 'rana', translations: { uk: 'жаба', en: 'frog' } },
            { it: 'sole', translations: { uk: 'сонце', en: 'sun' } },
            { it: 'rosa', translations: { uk: 'троянда', en: 'rose' } },
            { it: 'zero', translations: { uk: 'нуль', en: 'zero' } },
            { it: 'marzo', translations: { uk: 'березень', en: 'March' } },
          ],
        },
        {
          type: 'story_text',
          title: { uk: 'Мікротекст', en: 'Micro-text' },
          paragraphs: [
            {
              it: 'Mina ama la luna. Nino ama la rana.',
              translations: {
                uk: 'Міна любить місяць. Ніно любить жабу.',
                en: 'Mina loves the moon. Nino loves the frog.',
              },
            },
          ],
          vocabHints: [
            { word: 'ama', translations: { uk: 'любить', en: 'loves' } },
            { word: 'luna', translations: { uk: 'місяць', en: 'moon' } },
            { word: 'rana', translations: { uk: 'жаба', en: 'frog' } },
          ],
        },
        {
          type: 'takeaways',
          title: { uk: 'Складаймо слова', en: 'Build the words' },
          items: [
            { uk: 'Промовляйте голосні чітко, а тоді з’єднуйте приголосний і голосний: <i>ma</i>, <i>mi</i>, <i>mu</i>.', en: 'Say the vowels clearly, then blend a consonant and a vowel: <i>ma</i>, <i>mi</i>, <i>mu</i>.' },
            { uk: 'У простих словах знайдіть межу складів: <i>Mi-na</i>, <i>Ni-no</i>, <i>lu-na</i>, <i>ra-na</i>. Поки що не вивчаємо наголос.', en: 'Find the syllable boundary in simple words: <i>Mi-na</i>, <i>Ni-no</i>, <i>lu-na</i>, <i>ra-na</i>. Stress comes later.' },
            { uk: 'Слухайте <i>sole / rosa</i> та <i>zero / marzo</i>: S і Z не мають лише одного можливого звучання.', en: 'Listen to <i>sole / rosa</i> and <i>zero / marzo</i>: S and Z do not each have only one possible sound.' },
          ],
        },
        {
          type: 'quiz',
          title: { uk: 'Практика', en: 'Practice' },
          tasks: [
            {
              id: 'ir1_q1',
              type: 'choice',
              category: { uk: 'Голосні', en: 'Vowels' },
              question: { uk: 'Який ряд містить усі п’ять письмових голосних?', en: 'Which row contains all five written vowels?' },
              options: [
                { translations: { uk: 'a, e, i, o, u', en: 'a, e, i, o, u' } },
                { translations: { uk: 'a, b, e, i, o', en: 'a, b, e, i, o' } },
                { translations: { uk: 'e, i, l, o, u', en: 'e, i, l, o, u' } },
              ],
              correctIndex: 0,
            },
            {
              id: 'ir1_q2',
              type: 'choice',
              category: { uk: 'Поєднання звуків', en: 'Blending sounds' },
              question: { uk: 'Який ряд поєднує приголосний B з п’ятьма голосними?', en: 'Which row blends consonant B with the five vowels?' },
              options: [
                { translations: { uk: 'ba, be, bi, bo, bu', en: 'ba, be, bi, bo, bu' } },
                { translations: { uk: 'da, de, di, do, du', en: 'da, de, di, do, du' } },
                { translations: { uk: 'va, ve, vi, vo, vu', en: 'va, ve, vi, vo, vu' } },
              ],
              correctIndex: 0,
            },
            {
              id: 'ir1_q3',
              type: 'choice',
              category: { uk: 'Склади', en: 'Syllables' },
              question: { uk: 'Де правильно поділено слово «luna» на склади?', en: 'Which option divides “luna” into syllables correctly?' },
              options: [
                { translations: { uk: 'lu-na', en: 'lu-na' } },
                { translations: { uk: 'l-un-a', en: 'l-un-a' } },
                { translations: { uk: 'lun-a', en: 'lun-a' } },
              ],
              correctIndex: 0,
            },
            {
              id: 'ir1_q4',
              type: 'true_false',
              category: { uk: 'Літери й звуки', en: 'Letters and sounds' },
              statement: { uk: 'Назва літери завжди є окремим звуком, який додають під час читання слова.', en: 'A letter name is always an extra sound to add when reading a word.' },
              correctAnswer: false,
            },
            {
              id: 'ir1_q5',
              type: 'choice',
              category: { uk: 'Читання', en: 'Reading' },
              question: { uk: 'Яке слово завершує фразу «Nino ama la ...» у мікротексті?', en: 'Which word completes “Nino ama la ...” in the micro-text?' },
              options: [
                { translations: { uk: 'rana', en: 'rana' } },
                { translations: { uk: 'luna', en: 'luna' } },
                { translations: { uk: 'rosa', en: 'rosa' } },
              ],
              correctIndex: 0,
            },
          ],
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════════════
    // ITALIAN READING 2: Hard C
    // ═══════════════════════════════════════════════════════════════════════
    'italian-reading-2': {
      id: 'italian-reading-2',
      unitId: 'italian-reading',
      unitTitle: {
        uk: 'Шлях читання італійською',
        en: 'Italian reading path',
      },
      lessonNum: 2,
      type: 'reading',
      title: {
        uk: 'Тверда C: ca, co, cu',
        en: 'Hard C: ca, co, cu',
      },
      subtitle: {
        uk: 'Читай ca, co та cu',
        en: 'Read ca, co, and cu',
      },
      description: {
        uk: 'Почуйте твердий звук C у складах ca, co, cu та знайдіть його у знайомих словах.',
        en: 'Hear the hard C sound in ca, co, cu and find it in familiar words.',
      },
      duration: { uk: '12 хв', en: '12 min' },
      xpReward: 35,
      nextLessonId: 'italian-reading-3',
      prevLessonId: 'italian-reading-1',
      sections: [
        {
          type: 'grammar_rule',
          title: { uk: 'C перед A, O та U', en: 'C before A, O, and U' },
          explanation: {
            uk: '<p>У сполуках <b>ca, co, cu</b> літера C має твердий звук: <i>casa</i>, <i>cosa</i>, <i>cucina</i>. У словах <i>casa</i> й <i>cosa</i> це C перед A та O; у <i>cucina</i> перша C стоїть перед U.</p><p>Це правило лише для цих сполук: C перед E та I читається інакше. У слові <i>cucina</i> друга C стоїть перед I; цей звук розберемо в наступному уроці.</p>',
            en: '<p>In <b>ca, co, cu</b>, the letter C has a hard sound: <i>casa</i>, <i>cosa</i>, <i>cucina</i>. In <i>casa</i> and <i>cosa</i>, C comes before A and O; in <i>cucina</i>, the first C comes before U.</p><p>This rule applies only to these combinations: C before E and I is read differently. In <i>cucina</i>, the second C comes before I; we will study that sound in the next lesson.</p>',
          },
        },
        {
          type: 'vocab',
          title: { uk: 'Слова з твердою C', en: 'Words with hard C' },
          items: [
            { it: 'ca, co, cu', translations: { uk: 'тверда C перед A, O, U', en: 'hard C before A, O, U' } },
            { it: 'casa', translations: { uk: 'дім', en: 'house' } },
            { it: 'cosa', translations: { uk: 'річ; що', en: 'thing; what' } },
            { it: 'cucina', translations: { uk: 'кухня; готувати', en: 'kitchen; to cook' } },
            { it: 'vede', translations: { uk: 'бачить', en: 'sees' } },
            { it: 'una', translations: { uk: 'неозначений артикль перед іменником жіночого роду', en: 'a/an before a feminine noun' } },
          ],
        },
        {
          type: 'story_text',
          title: { uk: 'Читай короткий текст', en: 'Read a short text' },
          paragraphs: [
            {
              it: 'Nina vede una casa. Mina vede una cosa: una rosa.',
              translations: {
                uk: 'Ніна бачить дім. Міна бачить річ: троянду.',
                en: 'Nina sees a house. Mina sees a thing: a rose.',
              },
            },
          ],
          vocabHints: [
            { word: 'vede', translations: { uk: 'бачить', en: 'sees' } },
            { word: 'casa', translations: { uk: 'дім', en: 'house' } },
            { word: 'cosa', translations: { uk: 'річ', en: 'thing' } },
            { word: 'rosa', translations: { uk: 'троянда', en: 'rose' } },
          ],
        },
        {
          type: 'takeaways',
          title: { uk: 'Запам’ятай', en: 'Remember' },
          items: [
            { uk: 'У <i>ca, co, cu</i> літера C має твердий звук: <i>casa, cosa, cucina</i>.', en: 'In <i>ca, co, cu</i>, C has a hard sound: <i>casa, cosa, cucina</i>.' },
            { uk: 'Не поширюйте це правило на всі слова з C: сполуки <i>ce</i> та <i>ci</i> вивчимо окремо.', en: 'Do not apply this rule to every word with C: we will study <i>ce</i> and <i>ci</i> separately.' },
          ],
        },
        {
          type: 'quiz',
          title: { uk: 'Практика', en: 'Practice' },
          tasks: [
            {
              id: 'ir2_q1',
              type: 'choice',
              category: { uk: 'Склади', en: 'Syllables' },
              question: { uk: 'У яких складах C має твердий звук за правилом цього уроку?', en: 'In which syllables does C have the hard sound taught in this lesson?' },
              options: [
                { translations: { uk: 'ca, co, cu', en: 'ca, co, cu' } },
                { translations: { uk: 'ce, ci, cu', en: 'ce, ci, cu' } },
                { translations: { uk: 'ce, co, ci', en: 'ce, co, ci' } },
              ],
              correctIndex: 0,
            },
            {
              id: 'ir2_q2',
              type: 'choice',
              category: { uk: 'Слова', en: 'Words' },
              question: { uk: 'У якому слові C стоїть перед A?', en: 'In which word does C come before A?' },
              options: [
                { translations: { uk: 'casa', en: 'casa' } },
                { translations: { uk: 'cosa', en: 'cosa' } },
                { translations: { uk: 'cucina', en: 'cucina' } },
              ],
              correctIndex: 0,
            },
            {
              id: 'ir2_q3',
              type: 'choice',
              category: { uk: 'Слова', en: 'Words' },
              question: { uk: 'Яке слово означає «річ»?', en: 'Which word means “thing”?' },
              options: [
                { translations: { uk: 'cosa', en: 'cosa' } },
                { translations: { uk: 'casa', en: 'casa' } },
                { translations: { uk: 'cucina', en: 'cucina' } },
              ],
              correctIndex: 0,
            },
            {
              id: 'ir2_q4',
              type: 'true_false',
              category: { uk: 'Правило', en: 'Rule' },
              statement: { uk: 'За правилом цього уроку C має твердий звук у кожному італійському слові.', en: 'According to this lesson, C has a hard sound in every Italian word.' },
              correctAnswer: false,
            },
            {
              id: 'ir2_q5',
              type: 'choice',
              category: { uk: 'Читання', en: 'Reading' },
              question: { uk: 'Яке слово завершує фразу «Mina vede una cosa: una ...»?', en: 'Which word completes “Mina vede una cosa: una ...”?' },
              options: [
                { translations: { uk: 'rosa', en: 'rosa' } },
                { translations: { uk: 'casa', en: 'casa' } },
                { translations: { uk: 'cucina', en: 'cucina' } },
              ],
              correctIndex: 0,
            },
          ],
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════════════
    // ITALIAN READING 3: Soft C and CH
    // ═══════════════════════════════════════════════════════════════════════
    'italian-reading-3': {
      id: 'italian-reading-3',
      unitId: 'italian-reading',
      unitTitle: {
        uk: 'Шлях читання італійською',
        en: 'Italian reading path',
      },
      lessonNum: 3,
      type: 'reading',
      title: {
        uk: 'М’яка C: ce, ci, che, chi',
        en: 'Soft C: ce, ci, che, chi',
      },
      subtitle: {
        uk: 'Почуй різницю між C та CH',
        en: 'Hear the difference between C and CH',
      },
      description: {
        uk: 'Розрізняйте м’яку C у ce/ci та тверду C у che/chi.',
        en: 'Distinguish soft C in ce/ci from hard C in che/chi.',
      },
      duration: { uk: '12 хв', en: '12 min' },
      xpReward: 35,
      nextLessonId: 'italian-reading-4',
      prevLessonId: 'italian-reading-2',
      sections: [
        {
          type: 'grammar_rule',
          title: { uk: 'C перед E та I', en: 'C before E and I' },
          explanation: {
            uk: '<p>Перед <b>E</b> та <b>I</b> літера C має м’який звук: <i>ce</i>, <i>ci</i>, як у словах <i>cena</i> та <i>cinema</i>.</p><p>Літера <b>H</b> між C та E/I змінює читання: у <i>che</i> та <i>chi</i> C зберігає твердий звук. H окремо не вимовляється. Порівняйте <i>cena / che</i> та <i>cinema / chi</i>, а потім прочитайте повні слова <i>amici</i>, <i>amiche</i> й <i>chiave</i>.</p>',
            en: '<p>Before <b>E</b> and <b>I</b>, C has a soft sound: <i>ce</i>, <i>ci</i>, as in <i>cena</i> and <i>cinema</i>.</p><p>The letter <b>H</b> between C and E/I changes the reading: in <i>che</i> and <i>chi</i>, C keeps its hard sound. H is not pronounced separately. Compare <i>cena / che</i> and <i>cinema / chi</i>, then read the complete words <i>amici</i>, <i>amiche</i>, and <i>chiave</i>.</p>',
          },
        },
        {
          type: 'vocab',
          title: { uk: 'Слухай і порівнюй', en: 'Listen and compare' },
          items: [
            { it: 'ce, ci', translations: { uk: 'м’яка C перед E та I', en: 'soft C before E and I' } },
            { it: 'che, chi', translations: { uk: 'тверда C перед E та I з H', en: 'hard C before E and I with H' } },
            { it: 'cena', translations: { uk: 'вечеря; вечеряє', en: 'dinner; has dinner' } },
            { it: 'cinema', translations: { uk: 'кінотеатр; кіно', en: 'cinema; movie theater' } },
            { it: 'che', translations: { uk: 'що; який/яка (за контекстом)', en: 'what; which (depending on context)' } },
            { it: 'chi', translations: { uk: 'хто', en: 'who' } },
            { it: 'amici', translations: { uk: 'друзі', en: 'friends (masculine or mixed group)' } },
            { it: 'amiche', translations: { uk: 'подруги', en: 'friends (feminine group)' } },
            { it: 'chiave', translations: { uk: 'ключ', en: 'key' } },
            { it: 'anche', translations: { uk: 'також', en: 'also' } },
            { it: 'con', translations: { uk: 'з; із', en: 'with' } },
            { it: 'dopo', translations: { uk: 'потім; після', en: 'after; then' } },
            { it: 'va', translations: { uk: 'іде', en: 'goes' } },
          ],
        },
        {
          type: 'story_text',
          title: { uk: 'Читай короткий текст', en: 'Read a short text' },
          paragraphs: [
            {
              it: 'Nina cena con le amiche. Dopo, va al cinema.',
              translations: {
                uk: 'Ніна вечеряє з подругами. Потім вона йде в кіно.',
                en: 'Nina has dinner with her friends. Afterward, she goes to the cinema.',
              },
            },
          ],
          vocabHints: [
            { word: 'cena', translations: { uk: 'вечеряє', en: 'has dinner' } },
            { word: 'amiche', translations: { uk: 'подруги', en: 'friends (feminine group)' } },
            { word: 'dopo', translations: { uk: 'потім', en: 'afterward' } },
            { word: 'cinema', translations: { uk: 'кінотеатр; кіно', en: 'cinema' } },
          ],
        },
        {
          type: 'takeaways',
          title: { uk: 'Запам’ятай', en: 'Remember' },
          items: [
            { uk: '<i>ce</i> та <i>ci</i> мають м’який звук C: <i>cena, cinema</i>.', en: '<i>ce</i> and <i>ci</i> have the soft C sound: <i>cena, cinema</i>.' },
            { uk: 'У <i>che</i> та <i>chi</i> літера H зберігає твердий звук C; сама H не вимовляється.', en: 'In <i>che</i> and <i>chi</i>, H keeps the hard C sound; H itself is not pronounced.' },
            { uk: 'Слухайте приклади й повторюйте: не покладайтеся на приблизне написання звуків іншою мовою.', en: 'Listen and repeat; do not rely on approximating the sounds with spellings from another language.' },
          ],
        },
        {
          type: 'quiz',
          title: { uk: 'Практика', en: 'Practice' },
          tasks: [
            {
              id: 'ir3_q1',
              type: 'choice',
              category: { uk: 'Правило', en: 'Rule' },
              question: { uk: 'Які сполуки мають м’який звук C?', en: 'Which combinations have the soft C sound?' },
              options: [
                { translations: { uk: 'ce та ci', en: 'ce and ci' } },
                { translations: { uk: 'ca та co', en: 'ca and co' } },
                { translations: { uk: 'che та chi', en: 'che and chi' } },
              ],
              correctIndex: 0,
            },
            {
              id: 'ir3_q2',
              type: 'choice',
              category: { uk: 'Правило', en: 'Rule' },
              question: { uk: 'Що робить H у сполуках che та chi?', en: 'What does H do in che and chi?' },
              options: [
                { translations: { uk: 'Зберігає твердий звук C перед E та I', en: 'Keeps the hard C sound before E and I' } },
                { translations: { uk: 'Утворює окремий звук після C', en: 'Creates a separate sound after C' } },
                { translations: { uk: 'Перетворює C на м’який звук', en: 'Changes C to the soft sound' } },
              ],
              correctIndex: 0,
            },
            {
              id: 'ir3_q3',
              type: 'choice',
              category: { uk: 'Слова', en: 'Words' },
              question: { uk: 'У якому слові C має м’який звук?', en: 'In which word does C have the soft sound?' },
              options: [
                { translations: { uk: 'cena', en: 'cena' } },
                { translations: { uk: 'casa', en: 'casa' } },
                { translations: { uk: 'chiave', en: 'chiave' } },
              ],
              correctIndex: 0,
            },
            {
              id: 'ir3_q4',
              type: 'choice',
              category: { uk: 'Слова', en: 'Words' },
              question: { uk: 'Яке слово означає «ключ» і починається зі сполуки chi?', en: 'Which word means “key” and begins with chi?' },
              options: [
                { translations: { uk: 'chiave', en: 'chiave' } },
                { translations: { uk: 'cinema', en: 'cinema' } },
                { translations: { uk: 'cena', en: 'cena' } },
              ],
              correctIndex: 0,
            },
            {
              id: 'ir3_q5',
              type: 'choice',
              category: { uk: 'Написання', en: 'Spelling' },
              question: { uk: 'Як записати склад із твердим звуком C перед I?', en: 'How do you spell the syllable with hard C before I?' },
              options: [
                { translations: { uk: 'chi', en: 'chi' } },
                { translations: { uk: 'ci', en: 'ci' } },
                { translations: { uk: 'che', en: 'che' } },
              ],
              correctIndex: 0,
            },
          ],
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════════════
    // ITALIAN READING 4: Hard G
    // ═══════════════════════════════════════════════════════════════════════
    'italian-reading-4': {
      id: 'italian-reading-4',
      unitId: 'italian-reading',
      unitTitle: {
        uk: 'Шлях читання італійською',
        en: 'Italian reading path',
      },
      lessonNum: 4,
      type: 'reading',
      title: {
        uk: 'Тверда G: ga, go, gu',
        en: 'Hard G: ga, go, gu',
      },
      subtitle: {
        uk: 'Читай ga, go та gu',
        en: 'Read ga, go, and gu',
      },
      description: {
        uk: 'Почуйте твердий звук G у складах ga, go, gu та знайдіть його у знайомих словах.',
        en: 'Hear the hard G sound in ga, go, gu and find it in familiar words.',
      },
      duration: { uk: '12 хв', en: '12 min' },
      xpReward: 35,
      nextLessonId: 'italian-reading-5',
      prevLessonId: 'italian-reading-3',
      sections: [
        {
          type: 'grammar_rule',
          title: { uk: 'G перед A, O та U', en: 'G before A, O, and U' },
          explanation: {
            uk: '<p>У сполуках <b>ga, go, gu</b> літера G має твердий звук, як у словах <i>gatto</i>, <i>gomma</i> та <i>gusto</i>. Це правило стосується саме цих сполук.</p><p>Перед E та I G читається інакше. Сполуки <i>ge</i> та <i>gi</i> розглянемо в наступному уроці; поки не поширюйте правило <i>ga, go, gu</i> на всі слова з G.</p>',
            en: '<p>In <b>ga, go, gu</b>, the letter G has a hard sound, as in <i>gatto</i>, <i>gomma</i>, and <i>gusto</i>. This rule applies specifically to these combinations.</p><p>G is read differently before E and I. We will study <i>ge</i> and <i>gi</i> in the next lesson; for now, do not apply the <i>ga, go, gu</i> rule to every word with G.</p>',
          },
        },
        {
          type: 'vocab',
          title: { uk: 'Слова з твердою G', en: 'Words with hard G' },
          items: [
            { it: 'ga, go, gu', translations: { uk: 'тверда G перед A, O, U', en: 'hard G before A, O, U' } },
            { it: 'gatto', translations: { uk: 'кіт', en: 'cat' } },
            { it: 'gomma', translations: { uk: 'гумка; гума', en: 'eraser; rubber' } },
            { it: 'gusto', translations: { uk: 'смак', en: 'taste' } },
            { it: 'gamba', translations: { uk: 'нога', en: 'leg' } },
            { it: 'guarda', translations: { uk: 'дивиться на', en: 'looks at' } },
          ],
        },
        {
          type: 'story_text',
          title: { uk: 'Читай короткий текст', en: 'Read a short text' },
          paragraphs: [
            {
              it: 'Il gatto guarda una rosa.',
              translations: {
                uk: 'Кіт дивиться на троянду.',
                en: 'The cat looks at a rose.',
              },
            },
          ],
          vocabHints: [
            { word: 'gatto', translations: { uk: 'кіт', en: 'cat' } },
            { word: 'guarda', translations: { uk: 'дивиться', en: 'looks at' } },
            { word: 'rosa', translations: { uk: 'троянда', en: 'rose' } },
          ],
        },
        {
          type: 'takeaways',
          title: { uk: 'Запам’ятай', en: 'Remember' },
          items: [
            { uk: 'У <i>ga, go, gu</i> літера G має твердий звук: <i>gatto, gomma, gusto</i>.', en: 'In <i>ga, go, gu</i>, G has a hard sound: <i>gatto, gomma, gusto</i>.' },
            { uk: 'Це правило не охоплює всі слова з G: перед E та I звук змінюється.', en: 'This rule does not cover every word with G: its sound changes before E and I.' },
          ],
        },
        {
          type: 'quiz',
          title: { uk: 'Практика', en: 'Practice' },
          tasks: [
            {
              id: 'ir4_q1',
              type: 'choice',
              category: { uk: 'Склади', en: 'Syllables' },
              question: { uk: 'У яких складах G має твердий звук за правилом цього уроку?', en: 'In which syllables does G have the hard sound taught in this lesson?' },
              options: [
                { translations: { uk: 'ga, go, gu', en: 'ga, go, gu' } },
                { translations: { uk: 'ge, gi, gu', en: 'ge, gi, gu' } },
                { translations: { uk: 'ge, go, gi', en: 'ge, go, gi' } },
              ],
              correctIndex: 0,
            },
            {
              id: 'ir4_q2',
              type: 'choice',
              category: { uk: 'Слова', en: 'Words' },
              question: { uk: 'У якому слові є сполука ga?', en: 'Which word contains the combination ga?' },
              options: [
                { translations: { uk: 'gamba', en: 'gamba' } },
                { translations: { uk: 'gomma', en: 'gomma' } },
                { translations: { uk: 'gusto', en: 'gusto' } },
              ],
              correctIndex: 0,
            },
            {
              id: 'ir4_q3',
              type: 'choice',
              category: { uk: 'Словник', en: 'Vocabulary' },
              question: { uk: 'Що означає слово «gatto»?', en: 'What does “gatto” mean?' },
              options: [
                { translations: { uk: 'кіт', en: 'cat' } },
                { translations: { uk: 'гумка', en: 'eraser' } },
                { translations: { uk: 'смак', en: 'taste' } },
              ],
              correctIndex: 0,
            },
            {
              id: 'ir4_q4',
              type: 'choice',
              category: { uk: 'Читання', en: 'Reading' },
              question: { uk: 'На що дивиться кіт у тексті?', en: 'What does the cat look at in the text?' },
              options: [
                { translations: { uk: 'на троянду', en: 'a rose' } },
                { translations: { uk: 'на книжку', en: 'a book' } },
                { translations: { uk: 'на сходи', en: 'the stairs' } },
              ],
              correctIndex: 0,
            },
          ],
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════════════
    // ITALIAN READING 5: Soft G and GH
    // ═══════════════════════════════════════════════════════════════════════
    'italian-reading-5': {
      id: 'italian-reading-5',
      unitId: 'italian-reading',
      unitTitle: {
        uk: 'Шлях читання італійською',
        en: 'Italian reading path',
      },
      lessonNum: 5,
      type: 'reading',
      title: {
        uk: 'М’яка G: ge, gi, ghe, ghi',
        en: 'Soft G: ge, gi, ghe, ghi',
      },
      subtitle: {
        uk: 'Почуй різницю між G та GH',
        en: 'Hear the difference between G and GH',
      },
      description: {
        uk: 'Розрізняйте м’яку G у ge/gi та тверду G у ghe/ghi.',
        en: 'Distinguish soft G in ge/gi from hard G in ghe/ghi.',
      },
      duration: { uk: '12 хв', en: '12 min' },
      xpReward: 35,
      nextLessonId: 'italian-reading-6',
      prevLessonId: 'italian-reading-4',
      sections: [
        {
          type: 'grammar_rule',
          title: { uk: 'G перед E та I', en: 'G before E and I' },
          explanation: {
            uk: '<p>Перед <b>E</b> та <b>I</b> літера G має м’який звук: <i>ge</i>, <i>gi</i>, як у словах <i>gelato</i> та <i>giraffa</i>.</p><p>Літера <b>H</b> у сполуках <i>ghe</i> та <i>ghi</i> зберігає твердий звук G перед E та I. H окремо не вимовляється: порівняйте <i>gelato / spaghetti</i> та <i>giraffa / funghi</i>.</p>',
            en: '<p>Before <b>E</b> and <b>I</b>, G has a soft sound: <i>ge</i>, <i>gi</i>, as in <i>gelato</i> and <i>giraffa</i>.</p><p>In <i>ghe</i> and <i>ghi</i>, the letter <b>H</b> keeps the hard G sound before E and I. H is not pronounced separately: compare <i>gelato / spaghetti</i> and <i>giraffa / funghi</i>.</p>',
          },
        },
        {
          type: 'vocab',
          title: { uk: 'Слухай і порівнюй', en: 'Listen and compare' },
          items: [
            { it: 'ge, gi', translations: { uk: 'м’яка G перед E та I', en: 'soft G before E and I' } },
            { it: 'ghe, ghi', translations: { uk: 'тверда G перед E та I з H', en: 'hard G before E and I with H' } },
            { it: 'gelato', translations: { uk: 'морозиво', en: 'gelato; ice cream' } },
            { it: 'giraffa', translations: { uk: 'жирафа', en: 'giraffe' } },
            { it: 'spaghetti', translations: { uk: 'спагеті', en: 'spaghetti' } },
            { it: 'funghi', translations: { uk: 'гриби', en: 'mushrooms' } },
            { it: 'mangia', translations: { uk: 'їсть', en: 'eats' } },
            { it: 'con', translations: { uk: 'з; із', en: 'with' } },
            { it: 'dopo', translations: { uk: 'потім; після', en: 'after; then' } },
            { it: 'prende', translations: { uk: 'бере; замовляє', en: 'takes; gets' } },
          ],
        },
        {
          type: 'story_text',
          title: { uk: 'Читай короткий текст', en: 'Read a short text' },
          paragraphs: [
            {
              it: 'Gina mangia spaghetti con i funghi. Dopo, prende un gelato.',
              translations: {
                uk: 'Джина їсть спагеті з грибами. Потім бере морозиво.',
                en: 'Gina eats spaghetti with mushrooms. Then she gets an ice cream.',
              },
            },
          ],
          vocabHints: [
            { word: 'mangia', translations: { uk: 'їсть', en: 'eats' } },
            { word: 'spaghetti', translations: { uk: 'спагеті', en: 'spaghetti' } },
            { word: 'funghi', translations: { uk: 'гриби', en: 'mushrooms' } },
            { word: 'gelato', translations: { uk: 'морозиво', en: 'ice cream' } },
          ],
        },
        {
          type: 'takeaways',
          title: { uk: 'Запам’ятай', en: 'Remember' },
          items: [
            { uk: 'У <i>ge</i> та <i>gi</i> G має м’який звук: <i>gelato, giraffa</i>.', en: 'In <i>ge</i> and <i>gi</i>, G has a soft sound: <i>gelato, giraffa</i>.' },
            { uk: 'У <i>ghe</i> та <i>ghi</i> H зберігає твердий звук G; окремо H не вимовляється.', en: 'In <i>ghe</i> and <i>ghi</i>, H keeps the hard G sound; H is not pronounced separately.' },
          ],
        },
        {
          type: 'quiz',
          title: { uk: 'Практика', en: 'Practice' },
          tasks: [
            {
              id: 'ir5_q1',
              type: 'choice',
              category: { uk: 'Правило', en: 'Rule' },
              question: { uk: 'У яких сполуках G має м’який звук?', en: 'In which combinations does G have the soft sound?' },
              options: [
                { translations: { uk: 'ge та gi', en: 'ge and gi' } },
                { translations: { uk: 'ga та go', en: 'ga and go' } },
                { translations: { uk: 'ghe та ghi', en: 'ghe and ghi' } },
              ],
              correctIndex: 0,
            },
            {
              id: 'ir5_q2',
              type: 'choice',
              category: { uk: 'Правило', en: 'Rule' },
              question: { uk: 'Що робить H у сполуках ghe та ghi?', en: 'What does H do in ghe and ghi?' },
              options: [
                { translations: { uk: 'Зберігає твердий звук G перед E та I', en: 'Keeps the hard G sound before E and I' } },
                { translations: { uk: 'Утворює окремий звук після G', en: 'Creates a separate sound after G' } },
                { translations: { uk: 'Перетворює G на м’який звук', en: 'Changes G to the soft sound' } },
              ],
              correctIndex: 0,
            },
            {
              id: 'ir5_q3',
              type: 'choice',
              category: { uk: 'Слова', en: 'Words' },
              question: { uk: 'У якому слові G має м’який звук?', en: 'Which word has the soft G sound?' },
              options: [
                { translations: { uk: 'gelato', en: 'gelato' } },
                { translations: { uk: 'spaghetti', en: 'spaghetti' } },
                { translations: { uk: 'funghi', en: 'funghi' } },
              ],
              correctIndex: 0,
            },
            {
              id: 'ir5_q4',
              type: 'choice',
              category: { uk: 'Словник', en: 'Vocabulary' },
              question: { uk: 'Яке слово означає «гриби»?', en: 'Which word means “mushrooms”?' },
              options: [
                { translations: { uk: 'funghi', en: 'funghi' } },
                { translations: { uk: 'giraffa', en: 'giraffa' } },
                { translations: { uk: 'gelato', en: 'gelato' } },
              ],
              correctIndex: 0,
            },
          ],
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════════════
    // ITALIAN READING 6: The SC patterns
    // ═══════════════════════════════════════════════════════════════════════
    'italian-reading-6': {
      id: 'italian-reading-6',
      unitId: 'italian-reading',
      unitTitle: {
        uk: 'Шлях читання італійською',
        en: 'Italian reading path',
      },
      lessonNum: 6,
      type: 'reading',
      title: {
        uk: 'Звуки сполуки SC',
        en: 'The sounds of SC',
      },
      subtitle: {
        uk: 'Розрізняй sca, sce та sche',
        en: 'Distinguish sca, sce, and sche',
      },
      description: {
        uk: 'Навчіться читати SC перед різними голосними та помічати роль H.',
        en: 'Learn to read SC before different vowels and notice the role of H.',
      },
      duration: { uk: '12 хв', en: '12 min' },
      xpReward: 35,
      nextLessonId: 'italian-reading-7',
      prevLessonId: 'italian-reading-5',
      sections: [
        {
          type: 'grammar_rule',
          title: { uk: 'SC перед голосними', en: 'SC before vowels' },
          explanation: {
            uk: '<p>У сполуках <b>sca, sco, scu</b> SC позначає послідовність приголосних /sk/, як у словах <i>scala</i>, <i>scopa</i> та <i>scusa</i>.</p><p>Перед E та I сполуки <b>sce</b> та <b>sci</b> мають інший спільний звук, як у словах <i>scena</i> та <i>sci</i>. Щоб зберегти послідовність /sk/ перед E та I, пишуть H: <b>sche, schi</b>, наприклад <i>scheda</i> та <i>schiena</i>. H окремо не вимовляється.</p>',
            en: '<p>In <b>sca, sco, scu</b>, SC represents the consonant sequence /sk/, as in <i>scala</i>, <i>scopa</i>, and <i>scusa</i>.</p><p>Before E and I, <b>sce</b> and <b>sci</b> have a different shared sound, as in <i>scena</i> and <i>sci</i>. To keep the /sk/ sequence before E and I, spelling uses H: <b>sche, schi</b>, as in <i>scheda</i> and <i>schiena</i>. H is not pronounced separately.</p>',
          },
        },
        {
          type: 'vocab',
          title: { uk: 'Слухай і сортуй', en: 'Listen and sort' },
          items: [
            { it: 'sca, sco, scu', translations: { uk: 'SC плюс голосний A, O або U', en: 'SC followed by A, O, or U' } },
            { it: 'sce, sci', translations: { uk: 'SC перед E та I', en: 'SC before E and I' } },
            { it: 'sche, schi', translations: { uk: 'написання з H для звука sca/sco/scu перед E та I', en: 'H spelling for the sca/sco/scu sound before E and I' } },
            { it: 'scala', translations: { uk: 'сходи; драбина', en: 'stairs; ladder' } },
            { it: 'scopa', translations: { uk: 'мітла', en: 'broom' } },
            { it: 'scusa', translations: { uk: 'вибач; вибачте', en: 'sorry; excuse me' } },
            { it: 'scena', translations: { uk: 'сцена', en: 'scene; stage' } },
            { it: 'sci', translations: { uk: 'лижі', en: 'skis' } },
            { it: 'scheda', translations: { uk: 'картка; бланк', en: 'card; form' } },
            { it: 'schiena', translations: { uk: 'спина', en: 'back' } },
            { it: 'qui', translations: { uk: 'тут', en: 'here' } },
            { it: 'è', translations: { uk: 'є; являється', en: 'is' } },
            { it: 'bella', translations: { uk: 'гарна', en: 'beautiful; nice' } },
          ],
        },
        {
          type: 'story_text',
          title: { uk: 'Читай короткий текст', en: 'Read a short text' },
          paragraphs: [
            {
              it: 'Scusa, la scala è qui. La scena è bella.',
              translations: {
                uk: 'Вибач, сходи тут. Сцена гарна.',
                en: 'Excuse me, the stairs are here. The scene is beautiful.',
              },
            },
          ],
          vocabHints: [
            { word: 'scusa', translations: { uk: 'вибач', en: 'excuse me' } },
            { word: 'scala', translations: { uk: 'сходи', en: 'stairs' } },
            { word: 'scena', translations: { uk: 'сцена', en: 'scene' } },
          ],
        },
        {
          type: 'takeaways',
          title: { uk: 'Запам’ятай', en: 'Remember' },
          items: [
            { uk: '<i>sca, sco, scu</i> мають звук SC перед A, O, U; <i>sce, sci</i> читаються інакше.', en: '<i>sca, sco, scu</i> have the SC sound before A, O, U; <i>sce, sci</i> are read differently.' },
            { uk: 'У <i>sche, schi</i> літера H зберігає звучання <i>sca, sco, scu</i> перед E та I.', en: 'In <i>sche, schi</i>, H keeps the sound of <i>sca, sco, scu</i> before E and I.' },
          ],
        },
        {
          type: 'quiz',
          title: { uk: 'Практика', en: 'Practice' },
          tasks: [
            {
              id: 'ir6_q1',
              type: 'choice',
              category: { uk: 'Склади', en: 'Syllables' },
              question: { uk: 'Які сполуки мають звук SC перед A, O та U?', en: 'Which combinations have the SC sound before A, O, and U?' },
              options: [
                { translations: { uk: 'sca, sco, scu', en: 'sca, sco, scu' } },
                { translations: { uk: 'sce, sci', en: 'sce, sci' } },
                { translations: { uk: 'sche, schi', en: 'sche, schi' } },
              ],
              correctIndex: 0,
            },
            {
              id: 'ir6_q2',
              type: 'choice',
              category: { uk: 'Склади', en: 'Syllables' },
              question: { uk: 'У яких сполуках SC читається як у слові «scena»?', en: 'Which combinations have the SC sound heard in “scena”?' },
              options: [
                { translations: { uk: 'sce та sci', en: 'sce and sci' } },
                { translations: { uk: 'sca та scu', en: 'sca and scu' } },
                { translations: { uk: 'sche та schi', en: 'sche and schi' } },
              ],
              correctIndex: 0,
            },
            {
              id: 'ir6_q3',
              type: 'choice',
              category: { uk: 'Написання', en: 'Spelling' },
              question: { uk: 'Які сполуки зберігають звук SC зі слів scala/scopa перед E та I?', en: 'Which combinations keep the SC sound of scala/scopa before E and I?' },
              options: [
                { translations: { uk: 'sche та schi', en: 'sche and schi' } },
                { translations: { uk: 'sce та sci', en: 'sce and sci' } },
                { translations: { uk: 'sca та sco', en: 'sca and sco' } },
              ],
              correctIndex: 0,
            },
            {
              id: 'ir6_q4',
              type: 'choice',
              category: { uk: 'Словник', en: 'Vocabulary' },
              question: { uk: 'Яке слово означає «сцена»?', en: 'Which word means “scene”?' },
              options: [
                { translations: { uk: 'scena', en: 'scena' } },
                { translations: { uk: 'scala', en: 'scala' } },
                { translations: { uk: 'scopa', en: 'scopa' } },
              ],
              correctIndex: 0,
            },
          ],
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════════════
    // ITALIAN READING 7: GN
    // ═══════════════════════════════════════════════════════════════════════
    'italian-reading-7': {
      id: 'italian-reading-7',
      unitId: 'italian-reading',
      unitTitle: {
        uk: 'Шлях читання італійською',
        en: 'Italian reading path',
      },
      lessonNum: 7,
      type: 'reading',
      title: {
        uk: 'Сполука GN',
        en: 'The GN combination',
      },
      subtitle: {
        uk: 'Почуй GN як один звук',
        en: 'Hear GN as one sound',
      },
      description: {
        uk: 'Розпізнавайте GN як одну приголосну сполуку та читайте знайомі слова.',
        en: 'Recognize GN as one consonant combination and read familiar words.',
      },
      duration: { uk: '12 хв', en: '12 min' },
      xpReward: 35,
      nextLessonId: 'italian-reading-8',
      prevLessonId: 'italian-reading-6',
      sections: [
        {
          type: 'grammar_rule',
          title: { uk: 'GN читається як одна сполука', en: 'GN is read as one combination' },
          explanation: {
            uk: '<p>В італійських словах <b>gn</b> позначає один приголосний звук. Слухайте його в словах <i>bagno</i>, <i>lasagna</i> та <i>signore</i>; не читайте G і N як два окремі звуки.</p><p>Під час поділу на склади сполука GN залишається разом: <i>ba-gno</i>, <i>la-sa-gna</i>, <i>si-gno-re</i>. Повторюйте за аудіо, не замінюючи звук приблизним написанням іншою мовою.</p>',
            en: '<p>In Italian words, <b>gn</b> represents one consonant sound. Listen for it in <i>bagno</i>, <i>lasagna</i>, and <i>signore</i>; do not read G and N as two separate sounds.</p><p>When dividing these words into syllables, keep GN together: <i>ba-gno</i>, <i>la-sa-gna</i>, <i>si-gno-re</i>. Repeat after the audio without replacing the sound with an approximate spelling from another language.</p>',
          },
        },
        {
          type: 'vocab',
          title: { uk: 'Слухай і повторюй', en: 'Listen and repeat' },
          items: [
            { it: 'gn', translations: { uk: 'одна приголосна сполука', en: 'one consonant combination' } },
            { it: 'bagno', translations: { uk: 'ванна кімната; ванна', en: 'bathroom; bath' } },
            { it: 'lasagna', translations: { uk: 'лазання', en: 'a layered pasta dish' } },
            { it: 'signore', translations: { uk: 'пан; добродій', en: 'sir; gentleman' } },
            { it: 'prepara', translations: { uk: 'готує', en: 'prepares' } },
            { it: 'dopo', translations: { uk: 'потім; після', en: 'after; then' } },
            { it: 'fa un bagno', translations: { uk: 'приймає ванну', en: 'takes a bath' } },
          ],
        },
        {
          type: 'story_text',
          title: { uk: 'Читай короткий текст', en: 'Read a short text' },
          paragraphs: [
            {
              it: 'Il signore prepara la lasagna. Dopo, fa un bagno.',
              translations: {
                uk: 'Пан готує лазанню. Потім він приймає ванну.',
                en: 'The gentleman prepares lasagna. Then he takes a bath.',
              },
            },
          ],
          vocabHints: [
            { word: 'signore', translations: { uk: 'пан', en: 'gentleman' } },
            { word: 'prepara', translations: { uk: 'готує', en: 'prepares' } },
            { word: 'lasagna', translations: { uk: 'лазання', en: 'lasagna' } },
            { word: 'bagno', translations: { uk: 'ванна', en: 'bath' } },
          ],
        },
        {
          type: 'takeaways',
          title: { uk: 'Запам’ятай', en: 'Remember' },
          items: [
            { uk: '<i>gn</i> позначає одну приголосну сполуку: слухайте приклади <i>bagno, lasagna, signore</i>.', en: '<i>gn</i> represents one consonant combination: listen to <i>bagno, lasagna, signore</i>.' },
            { uk: 'У поділі на склади зберігайте GN разом: <i>ba-gno</i>, <i>la-sa-gna</i>, <i>si-gno-re</i>.', en: 'Keep GN together when dividing these words into syllables: <i>ba-gno</i>, <i>la-sa-gna</i>, <i>si-gno-re</i>.' },
          ],
        },
        {
          type: 'quiz',
          title: { uk: 'Практика', en: 'Practice' },
          tasks: [
            {
              id: 'ir7_q1',
              type: 'choice',
              category: { uk: 'Правило', en: 'Rule' },
              question: { uk: 'Як читається GN у словах цього уроку?', en: 'How is GN read in the words from this lesson?' },
              options: [
                { translations: { uk: 'Як одна приголосна сполука', en: 'As one consonant combination' } },
                { translations: { uk: 'Як два повністю окремі приголосні звуки', en: 'As two fully separate consonant sounds' } },
                { translations: { uk: 'Як окремий звук G без N', en: 'As a G sound with no N' } },
              ],
              correctIndex: 0,
            },
            {
              id: 'ir7_q2',
              type: 'choice',
              category: { uk: 'Склади', en: 'Syllables' },
              question: { uk: 'Як правильно поділити «bagno» на склади?', en: 'How is “bagno” correctly divided into syllables?' },
              options: [
                { translations: { uk: 'ba-gno', en: 'ba-gno' } },
                { translations: { uk: 'bag-no', en: 'bag-no' } },
                { translations: { uk: 'b-a-gno', en: 'b-a-gno' } },
              ],
              correctIndex: 0,
            },
            {
              id: 'ir7_q3',
              type: 'choice',
              category: { uk: 'Словник', en: 'Vocabulary' },
              question: { uk: 'Що означає «lasagna»?', en: 'What does “lasagna” mean?' },
              options: [
                { translations: { uk: 'лазання', en: 'lasagna' } },
                { translations: { uk: 'ванна кімната', en: 'bathroom' } },
                { translations: { uk: 'пан', en: 'gentleman' } },
              ],
              correctIndex: 0,
            },
            {
              id: 'ir7_q4',
              type: 'choice',
              category: { uk: 'Читання', en: 'Reading' },
              question: { uk: 'Що готує пан у тексті?', en: 'What does the gentleman prepare in the text?' },
              options: [
                { translations: { uk: 'лазання', en: 'lasagna' } },
                { translations: { uk: 'піцу', en: 'pizza' } },
                { translations: { uk: 'суп', en: 'soup' } },
              ],
              correctIndex: 0,
            },
          ],
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════════════
    // ITALIAN READING 8: GLI
    // ═══════════════════════════════════════════════════════════════════════
    'italian-reading-8': {
      id: 'italian-reading-8',
      unitId: 'italian-reading',
      unitTitle: {
        uk: 'Шлях читання італійською',
        en: 'Italian reading path',
      },
      lessonNum: 8,
      type: 'reading',
      title: {
        uk: 'Сполука GLI',
        en: 'The GLI combination',
      },
      subtitle: {
        uk: 'Слухай і повторюй знайомі слова',
        en: 'Listen and repeat familiar words',
      },
      description: {
        uk: 'Розпізнавайте GLI у поширених словах і наближайте вимову за допомогою аудіо.',
        en: 'Recognize GLI in common words and practice its sound with audio.',
      },
      duration: { uk: '12 хв', en: '12 min' },
      xpReward: 35,
      nextLessonId: 'italian-reading-9',
      prevLessonId: 'italian-reading-7',
      sections: [
        {
          type: 'grammar_rule',
          title: { uk: 'GLI у поширених словах', en: 'GLI in common words' },
          explanation: {
            uk: '<p>У поширених словах <i>famiglia</i>, <i>figlio</i> та <i>aglio</i> сполука <b>gli</b> позначає один італійський звук. Для тих, хто лише починає, він може бути незвичним.</p><p>Не намагайтеся замінити його одним точним написанням українською чи англійською. Прослухайте кожне слово й повторіть, звертаючи увагу на плавну сполуку звуків. У складах читайте: <i>fa-mi-glia</i>, <i>fi-glio</i>, <i>a-glio</i>.</p>',
            en: '<p>In common words such as <i>famiglia</i>, <i>figlio</i>, and <i>aglio</i>, the combination <b>gli</b> represents one Italian sound. It may be unfamiliar to beginners.</p><p>Do not try to replace it with one exact English spelling. Listen to each word and repeat, paying attention to the smooth sound combination. Read the syllables as: <i>fa-mi-glia</i>, <i>fi-glio</i>, <i>a-glio</i>.</p>',
          },
        },
        {
          type: 'vocab',
          title: { uk: 'Слухай і повторюй', en: 'Listen and repeat' },
          items: [
            { it: 'gli', translations: { uk: 'одна італійська звукова сполука', en: 'one Italian sound combination' } },
            { it: 'famiglia', translations: { uk: 'родина', en: 'family' } },
            { it: 'figlio', translations: { uk: 'син', en: 'son' } },
            { it: 'aglio', translations: { uk: 'часник', en: 'garlic' } },
            { it: 'prepara', translations: { uk: 'готує', en: 'prepares' } },
            { it: 'pasta', translations: { uk: 'паста; макарони', en: 'pasta' } },
            { it: 'taglia', translations: { uk: 'ріже; нарізає', en: 'cuts; chops' } },
          ],
        },
        {
          type: 'story_text',
          title: { uk: 'Читай короткий текст', en: 'Read a short text' },
          paragraphs: [
            {
              it: 'La famiglia prepara la pasta. Il figlio taglia l’aglio.',
              translations: {
                uk: 'Родина готує пасту. Син нарізає часник.',
                en: 'The family prepares pasta. The son chops the garlic.',
              },
            },
          ],
          vocabHints: [
            { word: 'famiglia', translations: { uk: 'родина', en: 'family' } },
            { word: 'prepara', translations: { uk: 'готує', en: 'prepares' } },
            { word: 'figlio', translations: { uk: 'син', en: 'son' } },
            { word: 'taglia', translations: { uk: 'нарізає', en: 'cuts; chops' } },
            { word: 'aglio', translations: { uk: 'часник', en: 'garlic' } },
          ],
        },
        {
          type: 'takeaways',
          title: { uk: 'Запам’ятай', en: 'Remember' },
          items: [
            { uk: 'У словах <i>famiglia, figlio, aglio</i> сполука <i>gli</i> позначає один звук.', en: 'In <i>famiglia, figlio, aglio</i>, the combination <i>gli</i> represents one sound.' },
            { uk: 'Звук краще засвоювати на слух: слухайте слова й повторюйте, не покладаючись на приблизні підказки з вимови.', en: 'The sound is best learned by listening: hear the words and repeat without relying on approximate pronunciation guides.' },
          ],
        },
        {
          type: 'quiz',
          title: { uk: 'Практика', en: 'Practice' },
          tasks: [
            {
              id: 'ir8_q1',
              type: 'choice',
              category: { uk: 'Правило', en: 'Rule' },
              question: { uk: 'Як читати сполуку gli у словах цього уроку?', en: 'How should gli be read in the words from this lesson?' },
              options: [
                { translations: { uk: 'Як одну італійську звукову сполуку', en: 'As one Italian sound combination' } },
                { translations: { uk: 'Як три окремі звуки G, L та I', en: 'As three separate sounds: G, L, and I' } },
                { translations: { uk: 'Як німе G', en: 'As a silent G' } },
              ],
              correctIndex: 0,
            },
            {
              id: 'ir8_q2',
              type: 'choice',
              category: { uk: 'Склади', en: 'Syllables' },
              question: { uk: 'Як правильно поділити «figlio» на склади?', en: 'How is “figlio” correctly divided into syllables?' },
              options: [
                { translations: { uk: 'fi-glio', en: 'fi-glio' } },
                { translations: { uk: 'fig-lio', en: 'fig-lio' } },
                { translations: { uk: 'f-i-glio', en: 'f-i-glio' } },
              ],
              correctIndex: 0,
            },
            {
              id: 'ir8_q3',
              type: 'choice',
              category: { uk: 'Словник', en: 'Vocabulary' },
              question: { uk: 'Що означає «aglio»?', en: 'What does “aglio” mean?' },
              options: [
                { translations: { uk: 'часник', en: 'garlic' } },
                { translations: { uk: 'родина', en: 'family' } },
                { translations: { uk: 'син', en: 'son' } },
              ],
              correctIndex: 0,
            },
            {
              id: 'ir8_q4',
              type: 'choice',
              category: { uk: 'Читання', en: 'Reading' },
              question: { uk: 'Хто нарізає часник у тексті?', en: 'Who chops the garlic in the text?' },
              options: [
                { translations: { uk: 'син', en: 'the son' } },
                { translations: { uk: 'мати', en: 'the mother' } },
                { translations: { uk: 'пан', en: 'the gentleman' } },
              ],
              correctIndex: 0,
            },
          ],
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════════════
    // ITALIAN READING 9: QU
    // ═══════════════════════════════════════════════════════════════════════
    'italian-reading-9': {
      id: 'italian-reading-9',
      unitId: 'italian-reading',
      unitTitle: {
        uk: 'Шлях читання італійською',
        en: 'Italian reading path',
      },
      lessonNum: 9,
      type: 'reading',
      title: {
        uk: 'QU в італійських словах',
        en: 'QU in Italian words',
      },
      subtitle: {
        uk: 'Почуй QU у коротких фразах',
        en: 'Hear QU in short phrases',
      },
      description: {
        uk: 'Читайте поширені слова з QU та впізнавайте цю сполуку у фразах.',
        en: 'Read common words with QU and recognize the combination in phrases.',
      },
      duration: { uk: '12 хв', en: '12 min' },
      xpReward: 35,
      nextLessonId: 'italian-reading-10',
      prevLessonId: 'italian-reading-8',
      sections: [
        {
          type: 'grammar_rule',
          title: { uk: 'Поширена сполука QU', en: 'The common QU combination' },
          explanation: {
            uk: '<p>У поширеному написанні <b>qu</b> літера Q стоїть перед U; разом вони передають звукосполучення /kw/ перед наступною голосною. Послухайте <i>quando</i>, <i>quanto</i> та <i>questo</i>.</p><p>Шукайте QU у коротких фразах: <i>Quando?</i>, <i>Quanto costa?</i>, <i>questo libro</i>. Це урок про поширену сполуку QU, а не про кожну літеру U в італійській.</p>',
            en: '<p>In the common spelling <b>qu</b>, Q comes before U; together they represent the /kw/ sound before the next vowel. Listen to <i>quando</i>, <i>quanto</i>, and <i>questo</i>.</p><p>Look for QU in short phrases: <i>Quando?</i>, <i>Quanto costa?</i>, <i>questo libro</i>. This lesson is about the common QU combination, not every written U in Italian.</p>',
          },
        },
        {
          type: 'vocab',
          title: { uk: 'Слухай слова та фрази', en: 'Listen to words and phrases' },
          items: [
            { it: 'qu', translations: { uk: 'поширена сполука Q та U', en: 'the common Q and U combination' } },
            { it: 'quando', translations: { uk: 'коли', en: 'when' } },
            { it: 'quanto', translations: { uk: 'скільки; наскільки', en: 'how much; how many' } },
            { it: 'questo', translations: { uk: 'цей; це', en: 'this' } },
            { it: 'qui', translations: { uk: 'тут', en: 'here' } },
            { it: 'Quando?', translations: { uk: 'Коли?', en: 'When?' } },
            { it: 'Quanto costa?', translations: { uk: 'Скільки це коштує?', en: 'How much does it cost?' } },
            { it: 'questo libro', translations: { uk: 'ця книжка', en: 'this book' } },
            { it: 'arriva', translations: { uk: 'приходить; прибуває', en: 'arrives' } },
            { it: 'chiede', translations: { uk: 'питає', en: 'asks' } },
          ],
        },
        {
          type: 'story_text',
          title: { uk: 'Читай короткий текст', en: 'Read a short text' },
          paragraphs: [
            {
              it: 'Quando arriva Luca, chiede: «Quanto costa questo libro?»',
              translations: {
                uk: 'Коли приходить Лука, він питає: «Скільки коштує ця книжка?»',
                en: 'When Luca arrives, he asks, “How much does this book cost?”',
              },
            },
          ],
          vocabHints: [
            { word: 'quando', translations: { uk: 'коли', en: 'when' } },
            { word: 'arriva', translations: { uk: 'приходить', en: 'arrives' } },
            { word: 'chiede', translations: { uk: 'питає', en: 'asks' } },
            { word: 'quanto', translations: { uk: 'скільки', en: 'how much' } },
            { word: 'questo libro', translations: { uk: 'ця книжка', en: 'this book' } },
          ],
        },
        {
          type: 'takeaways',
          title: { uk: 'Запам’ятай', en: 'Remember' },
          items: [
            { uk: 'У поширених словах Q стоїть перед U: <i>quando, quanto, questo, qui</i>.', en: 'In common words, Q comes before U: <i>quando, quanto, questo, qui</i>.' },
            { uk: 'Слухайте сполуку в окремих словах і фразах; це правило не описує всі випадки літери U.', en: 'Listen for the combination in words and phrases; this rule does not describe every use of the letter U.' },
          ],
        },
        {
          type: 'quiz',
          title: { uk: 'Практика', en: 'Practice' },
          tasks: [
            {
              id: 'ir9_q1',
              type: 'choice',
              category: { uk: 'Написання', en: 'Spelling' },
              question: { uk: 'Яка поширена сполука трапляється у словах цього уроку?', en: 'Which common combination appears in the words from this lesson?' },
              options: [
                { translations: { uk: 'qu', en: 'qu' } },
                { translations: { uk: 'gu', en: 'gu' } },
                { translations: { uk: 'cu', en: 'cu' } },
              ],
              correctIndex: 0,
            },
            {
              id: 'ir9_q2',
              type: 'choice',
              category: { uk: 'Словник', en: 'Vocabulary' },
              question: { uk: 'Яке слово означає «коли»?', en: 'Which word means “when”?' },
              options: [
                { translations: { uk: 'quando', en: 'quando' } },
                { translations: { uk: 'quanto', en: 'quanto' } },
                { translations: { uk: 'questo', en: 'questo' } },
              ],
              correctIndex: 0,
            },
            {
              id: 'ir9_q3',
              type: 'choice',
              category: { uk: 'Фрази', en: 'Phrases' },
              question: { uk: 'Як запитати «Скільки це коштує?»', en: 'How do you ask “How much does it cost?”' },
              options: [
                { translations: { uk: 'Quanto costa?', en: 'Quanto costa?' } },
                { translations: { uk: 'Quando?', en: 'Quando?' } },
                { translations: { uk: 'Questo libro.', en: 'Questo libro.' } },
              ],
              correctIndex: 0,
            },
            {
              id: 'ir9_q4',
              type: 'choice',
              category: { uk: 'Читання', en: 'Reading' },
              question: { uk: 'Про що Лука питає у тексті?', en: 'What does Luca ask about in the text?' },
              options: [
                { translations: { uk: 'Ціну книжки', en: 'The price of the book' } },
                { translations: { uk: 'Час прибуття', en: 'The arrival time' } },
                { translations: { uk: 'Дорогу до дому', en: 'The way home' } },
              ],
              correctIndex: 0,
            },
            {
              id: 'ir9_q5',
              type: 'choice',
              category: { uk: 'Аудіювання', en: 'Listening' },
              question: { uk: 'Прослухай «quando» та «quanto» вище. У якому слові після «quan» чути /t/?', en: 'Listen to “quando” and “quanto” above. Which word has a /t/ sound after “quan”?' },
              options: [
                { translations: { uk: 'quanto', en: 'quanto' } },
                { translations: { uk: 'quando', en: 'quando' } },
                { translations: { uk: 'questo', en: 'questo' } },
              ],
              correctIndex: 0,
            },
          ],
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════════════
    // ITALIAN READING 10: DOUBLE CONSONANTS
    // ═══════════════════════════════════════════════════════════════════════
    'italian-reading-10': {
      id: 'italian-reading-10',
      unitId: 'italian-reading',
      unitTitle: {
        uk: 'Шлях читання італійською',
        en: 'Italian reading path',
      },
      lessonNum: 10,
      type: 'reading',
      title: {
        uk: 'Подвоєні приголосні',
        en: 'Double consonants',
      },
      subtitle: {
        uk: 'Слухай різницю між коротким і довшим звуком',
        en: 'Hear the difference between a short and longer sound',
      },
      description: {
        uk: 'Навчися помічати подвоєні приголосні на письмі та чути, як вони можуть розрізняти слова.',
        en: 'Learn to notice doubled consonants in writing and hear how they can distinguish words.',
      },
      duration: { uk: '12 хв', en: '12 min' },
      xpReward: 35,
      nextLessonId: 'italian-reading-11',
      prevLessonId: 'italian-reading-9',
      sections: [
        {
          type: 'grammar_rule',
          title: { uk: 'Приголосний довший', en: 'Hold the consonant longer' },
          explanation: {
            uk: '<p>В італійському слові подвоєну приголосну вимовляють довше, ніж одинарну. Послухай і порівняй <i>pala</i> та <i>palla</i>, а також <i>casa</i> та <i>cassa</i>.</p><p>Подвоєння може розрізняти слова: <i>pala</i> — лопата, а <i>palla</i> — м’яч; <i>casa</i> — дім, а <i>cassa</i> — ящик або каса. Це приклади, а не твердження, що кожна пара слів працює однаково.</p>',
            en: '<p>In an Italian word, a doubled consonant is held longer than a single one. Listen and compare <i>pala</i> with <i>palla</i>, and <i>casa</i> with <i>cassa</i>.</p><p>Doubling can distinguish words: <i>pala</i> means “shovel,” while <i>palla</i> means “ball”; <i>casa</i> means “house,” while <i>cassa</i> means “box” or “cash desk.” These are examples, not a claim that every pair works in the same way.</p>',
          },
        },
        {
          type: 'vocab',
          title: { uk: 'Слухай і порівнюй', en: 'Listen and compare' },
          items: [
            { it: 'pala', translations: { uk: 'лопата', en: 'shovel' } },
            { it: 'palla', translations: { uk: 'м’яч', en: 'ball' } },
            { it: 'casa', translations: { uk: 'дім', en: 'house' } },
            { it: 'cassa', translations: { uk: 'ящик; каса', en: 'box; cash desk' } },
            { it: 'A casa', translations: { uk: 'удома', en: 'at home' } },
            { it: 'una cassa', translations: { uk: 'ящик', en: 'a box' } },
            { it: 'mette', translations: { uk: 'кладе', en: 'puts' } },
            { it: 'nella', translations: { uk: 'у; в (із артиклем)', en: 'in the; into the' } },
            { it: 'suo', translations: { uk: 'його; її (перед іменником)', en: 'his; her (before a noun)' } },
            { it: 'gioca', translations: { uk: 'грається', en: 'plays' } },
            { it: 'con', translations: { uk: 'з; із', en: 'with' } },
          ],
        },
        {
          type: 'story_text',
          title: { uk: 'Прочитай короткий текст', en: 'Read a short text' },
          paragraphs: [
            {
              it: 'A casa, Anna mette la pala nella cassa. Suo figlio gioca con la palla.',
              translations: {
                uk: 'Удома Анна кладе лопату в ящик. Її син грається з м’ячем.',
                en: 'At home, Anna puts the shovel in the box. Her son plays with the ball.',
              },
            },
          ],
          vocabHints: [
            { word: 'mette', translations: { uk: 'кладе', en: 'puts' } },
            { word: 'nella', translations: { uk: 'у (всередині)', en: 'in the' } },
            { word: 'suo figlio', translations: { uk: 'її син', en: 'her son' } },
            { word: 'gioca', translations: { uk: 'грається', en: 'plays' } },
          ],
        },
        {
          type: 'takeaways',
          title: { uk: 'Запам’ятай', en: 'Remember' },
          items: [
            { uk: 'Подвоєну приголосну вимовляй довше за одинарну.', en: 'Hold a doubled consonant longer than a single one.' },
            { uk: 'Порівнюй і написання, і звучання: <i>pala/palla</i>, <i>casa/cassa</i>.', en: 'Compare both spelling and sound: <i>pala/palla</i>, <i>casa/cassa</i>.' },
          ],
        },
        {
          type: 'quiz',
          title: { uk: 'Практика', en: 'Practice' },
          tasks: [
            {
              id: 'ir10_q1',
              type: 'choice',
              category: { uk: 'Слухання', en: 'Listening' },
              question: { uk: 'Прослухай <i>pala</i> і <i>palla</i>. У якому слові звук L довший?', en: 'Listen to <i>pala</i> and <i>palla</i>. In which word is the L held longer?' },
              options: [
                { translations: { uk: 'palla', en: 'palla' } },
                { translations: { uk: 'pala', en: 'pala' } },
                { translations: { uk: 'casa', en: 'casa' } },
              ],
              correctIndex: 0,
            },
            {
              id: 'ir10_q2',
              type: 'choice',
              category: { uk: 'Словник', en: 'Vocabulary' },
              question: { uk: 'Яке слово означає «м’яч»?', en: 'Which word means “ball”?' },
              options: [
                { translations: { uk: 'palla', en: 'palla' } },
                { translations: { uk: 'pala', en: 'pala' } },
                { translations: { uk: 'cassa', en: 'cassa' } },
              ],
              correctIndex: 0,
            },
            {
              id: 'ir10_q3',
              type: 'choice',
              category: { uk: 'Написання', en: 'Spelling' },
              question: { uk: 'У якому слові є подвоєна приголосна?', en: 'Which word has a doubled consonant?' },
              options: [
                { translations: { uk: 'cassa', en: 'cassa' } },
                { translations: { uk: 'casa', en: 'casa' } },
                { translations: { uk: 'pala', en: 'pala' } },
              ],
              correctIndex: 0,
            },
            {
              id: 'ir10_q4',
              type: 'choice',
              category: { uk: 'Читання', en: 'Reading' },
              question: { uk: 'Чим грається син Анни в тексті?', en: 'What does Anna’s son play with in the text?' },
              options: [
                { translations: { uk: 'м’ячем', en: 'a ball' } },
                { translations: { uk: 'лопатою', en: 'a shovel' } },
                { translations: { uk: 'ящиком', en: 'a box' } },
              ],
              correctIndex: 0,
            },
          ],
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════════════
    // ITALIAN READING 11: WORD STRESS AND WRITTEN ACCENTS
    // ═══════════════════════════════════════════════════════════════════════
    'italian-reading-11': {
      id: 'italian-reading-11',
      unitId: 'italian-reading',
      unitTitle: {
        uk: 'Шлях читання італійською',
        en: 'Italian reading path',
      },
      lessonNum: 11,
      type: 'reading',
      title: {
        uk: 'Наголос і письмові акценти',
        en: 'Word stress and written accents',
      },
      subtitle: {
        uk: 'Слухай наголос і помічай знак над голосною',
        en: 'Listen for stress and notice the accent mark',
      },
      description: {
        uk: 'Дізнайся, як чути наголошену частину слова та навіщо в деяких словах пишуть знак наголосу.',
        en: 'Learn to hear the stressed part of a word and why some words are written with an accent mark.',
      },
      duration: { uk: '12 хв', en: '12 min' },
      xpReward: 35,
      nextLessonId: 'italian-reading-12',
      prevLessonId: 'italian-reading-10',
      sections: [
        {
          type: 'grammar_rule',
          title: { uk: 'Наголос і знак акценту', en: 'Stress and the written accent' },
          explanation: {
            uk: '<p>У кожному італійському слові одна частина звучить виразніше: це наголос. Його потрібно почути й вимовити, хоча в багатьох словах на письмі його не позначають.</p><p>У поширених словах із наголосом на останньому складі ставлять письмовий акцент: <i>città</i>, <i>caffè</i>, <i>perché</i>. Послухай ці приклади: акцент указує, де слово завершується наголошеним голосним.</p>',
            en: '<p>One part of every Italian word stands out in pronunciation: this is the word stress. You need to hear and pronounce it even though it is not marked in writing in many words.</p><p>Common words stressed on the final syllable are written with an accent mark: <i>città</i>, <i>caffè</i>, <i>perché</i>. Listen to these examples: the mark shows that the word ends with the stressed vowel.</p>',
          },
        },
        {
          type: 'vocab',
          title: { uk: 'Слухай слова з акцентом', en: 'Listen to words with accents' },
          items: [
            { it: 'città', translations: { uk: 'місто', en: 'city' } },
            { it: 'caffè', translations: { uk: 'кава', en: 'coffee' } },
            { it: 'perché', translations: { uk: 'чому; тому що', en: 'why; because' } },
            { it: 'buono', translations: { uk: 'смачний; добрий', en: 'good; tasty' } },
            { it: 'È sera.', translations: { uk: 'Вечір.', en: 'It is evening.' } },
            { it: 'un caffè', translations: { uk: 'кава; чашка кави', en: 'a coffee' } },
            { it: 'ordina', translations: { uk: 'замовляє', en: 'orders' } },
            { it: 'così', translations: { uk: 'так; настільки', en: 'so' } },
            { it: 'chiede', translations: { uk: 'питає', en: 'asks' } },
          ],
        },
        {
          type: 'story_text',
          title: { uk: 'Прочитай короткий текст', en: 'Read a short text' },
          paragraphs: [
            {
              it: 'È sera. Marco è in città e ordina un caffè. «Perché è così buono?» chiede.',
              translations: {
                uk: 'Вечір. Марко в місті й замовляє каву. «Чому вона така смачна?» — питає він.',
                en: 'It is evening. Marco is in the city and orders a coffee. “Why is it so good?” he asks.',
              },
            },
          ],
          vocabHints: [
            { word: 'sera', translations: { uk: 'вечір', en: 'evening' } },
            { word: 'ordina', translations: { uk: 'замовляє', en: 'orders' } },
            { word: 'così', translations: { uk: 'так; настільки', en: 'so' } },
            { word: 'chiede', translations: { uk: 'питає', en: 'asks' } },
          ],
        },
        {
          type: 'takeaways',
          title: { uk: 'Запам’ятай', en: 'Remember' },
          items: [
            { uk: 'Наголос потрібно чути, навіть коли його не позначено на письмі.', en: 'Listen for word stress even when it is not marked in writing.' },
            { uk: 'У словах <i>città</i>, <i>caffè</i> та <i>perché</i> письмовий акцент стоїть на останній голосній.', en: 'In <i>città</i>, <i>caffè</i>, and <i>perché</i>, the written accent is on the final vowel.' },
          ],
        },
        {
          type: 'quiz',
          title: { uk: 'Практика', en: 'Practice' },
          tasks: [
            {
              id: 'ir11_q1',
              type: 'choice',
              category: { uk: 'Написання', en: 'Spelling' },
              question: { uk: 'У якому слові є письмовий акцент?', en: 'Which word has a written accent mark?' },
              options: [
                { translations: { uk: 'città', en: 'città' } },
                { translations: { uk: 'sera', en: 'sera' } },
                { translations: { uk: 'Marco', en: 'Marco' } },
              ],
              correctIndex: 0,
            },
            {
              id: 'ir11_q2',
              type: 'choice',
              category: { uk: 'Словник', en: 'Vocabulary' },
              question: { uk: 'Що означає <i>caffè</i>?', en: 'What does <i>caffè</i> mean?' },
              options: [
                { translations: { uk: 'кава', en: 'coffee' } },
                { translations: { uk: 'місто', en: 'city' } },
                { translations: { uk: 'вечір', en: 'evening' } },
              ],
              correctIndex: 0,
            },
            {
              id: 'ir11_q3',
              type: 'choice',
              category: { uk: 'Наголос', en: 'Word stress' },
              question: { uk: 'Що допомагає визначити письмовий акцент у слові <i>città</i>?', en: 'What does the written accent help identify in <i>città</i>?' },
              options: [
                { translations: { uk: 'Наголошену останню голосну', en: 'The stressed final vowel' } },
                { translations: { uk: 'Значення слова', en: 'The meaning of the word' } },
                { translations: { uk: 'Подвоєну приголосну', en: 'A doubled consonant' } },
              ],
              correctIndex: 0,
            },
            {
              id: 'ir11_q4',
              type: 'choice',
              category: { uk: 'Читання', en: 'Reading' },
              question: { uk: 'Де Марко замовляє каву?', en: 'Where does Marco order a coffee?' },
              options: [
                { translations: { uk: 'У місті', en: 'In the city' } },
                { translations: { uk: 'Удома', en: 'At home' } },
                { translations: { uk: 'У школі', en: 'At school' } },
              ],
              correctIndex: 0,
            },
          ],
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════════════
    // ITALIAN READING 12: CUMULATIVE READING
    // ═══════════════════════════════════════════════════════════════════════
    'italian-reading-12': {
      id: 'italian-reading-12',
      unitId: 'italian-reading',
      unitTitle: {
        uk: 'Шлях читання італійською',
        en: 'Italian reading path',
      },
      lessonNum: 12,
      type: 'reading',
      title: {
        uk: 'Читаємо короткий текст',
        en: 'Let’s read a short text',
      },
      subtitle: {
        uk: 'Поєднай знайомі закономірності читання',
        en: 'Bring familiar reading patterns together',
      },
      description: {
        uk: 'Прочитай історію, послухай її речення та перевір розуміння знайомих слів і закономірностей.',
        en: 'Read a story, listen to its sentences, and check your understanding of familiar words and patterns.',
      },
      duration: { uk: '18 хв', en: '18 min' },
      xpReward: 45,
      nextLessonId: null,
      prevLessonId: 'italian-reading-11',
      sections: [
        {
          type: 'grammar_rule',
          title: { uk: 'Читай знайомі сполуки в контексті', en: 'Read familiar patterns in context' },
          explanation: {
            uk: '<p>У цій історії немає нових правил. Знайди знайомі сполуки в словах: <i>chiede</i>, <i>città</i>, <i>gelato</i>, <i>escono</i>, <i>sceglie</i>, <i>figlio</i>, <i>quanto</i>, <i>spaghetti</i> та <i>funghi</i>.</p><p>Спочатку прочитай кожне речення самостійно, потім увімкни аудіо. Коли будеш готовий, відкрий переклад і відповідай на запитання за текстом.</p>',
            en: '<p>This story introduces no new rules. Look for familiar patterns in these words: <i>chiede</i>, <i>città</i>, <i>gelato</i>, <i>escono</i>, <i>sceglie</i>, <i>figlio</i>, <i>quanto</i>, <i>spaghetti</i>, and <i>funghi</i>.</p><p>First read each sentence on your own, then play the audio. When you are ready, reveal the translation and answer the questions about the text.</p>',
          },
        },
        {
          type: 'vocab',
          title: { uk: 'Корисні слова', en: 'Useful words' },
          items: [
            { it: 'figlio', translations: { uk: 'син', en: 'son' } },
            { it: 'escono', translations: { uk: 'виходять', en: 'go out' } },
            { it: 'in città', translations: { uk: 'у місті', en: 'in the city' } },
            { it: 'il mercato', translations: { uk: 'ринок', en: 'market' } },
            { it: 'il signore', translations: { uk: 'пан; чоловік', en: 'gentleman; man' } },
            { it: 'chiede', translations: { uk: 'питає', en: 'asks' } },
            { it: 'sceglie', translations: { uk: 'обирає', en: 'chooses' } },
            { it: 'pesche', translations: { uk: 'персики', en: 'peaches' } },
            { it: 'la famiglia', translations: { uk: 'родина', en: 'family' } },
            { it: 'i funghi', translations: { uk: 'гриби', en: 'mushrooms' } },
            { it: 'perché', translations: { uk: 'тому що', en: 'because' } },
            { it: 'insieme', translations: { uk: 'разом', en: 'together' } },
          ],
        },
        {
          type: 'story_text',
          title: { uk: 'Прочитай або послухай', en: 'Read or listen' },
          audio: true,
          paragraphs: [
            {
              it: 'È domenica. Giulia e suo figlio escono in città.',
              translations: {
                uk: 'Неділя. Джулія та її син виходять у місто.',
                en: 'It is Sunday. Giulia and her son go out in the city.',
              },
            },
            {
              it: 'Al mercato, il signore chiede: «Quanto costa questo libro?»',
              translations: {
                uk: 'На ринку пан питає: «Скільки коштує ця книжка?»',
                en: 'At the market, the man asks, “How much does this book cost?”',
              },
            },
            {
              it: 'Giulia sceglie le pesche e compra un gelato e una palla per suo figlio.',
              translations: {
                uk: 'Джулія обирає персики та купує морозиво й м’яч для сина.',
                en: 'Giulia chooses the peaches and buys some ice cream and a ball for her son.',
              },
            },
            {
              it: 'La sera prepara spaghetti con funghi. Sono felici perché sono insieme.',
              translations: {
                uk: 'Увечері вона готує спагеті з грибами. Вони щасливі, бо разом.',
                en: 'In the evening she makes spaghetti with mushrooms. They are happy because they are together.',
              },
            },
          ],
          vocabHints: [
            { word: 'domenica', translations: { uk: 'неділя', en: 'Sunday' } },
            { word: 'compra', translations: { uk: 'купує', en: 'buys' } },
            { word: 'prepara', translations: { uk: 'готує', en: 'makes' } },
            { word: 'sono felici', translations: { uk: 'вони щасливі', en: 'they are happy' } },
          ],
        },
        {
          type: 'takeaways',
          title: { uk: 'Перевір себе', en: 'Review' },
          items: [
            { uk: 'Читай знайомі сполуки в словах і реченнях, а не лише окремо.', en: 'Read familiar patterns in words and sentences, not only in isolation.' },
            { uk: 'Використовуй контекст і підказки до слів, а потім перевір себе запитаннями.', en: 'Use context and vocabulary hints, then check your understanding with the questions.' },
          ],
        },
        {
          type: 'quiz',
          title: { uk: 'Запитання до тексту', en: 'Comprehension questions' },
          tasks: [
            {
              id: 'ir12_q1',
              type: 'choice',
              category: { uk: 'Розуміння тексту', en: 'Reading comprehension' },
              question: { uk: 'Куди йдуть Джулія та її син?', en: 'Where do Giulia and her son go?' },
              options: [
                { translations: { uk: 'У місто', en: 'To the city' } },
                { translations: { uk: 'До школи', en: 'To school' } },
                { translations: { uk: 'На вокзал', en: 'To the station' } },
              ],
              correctIndex: 0,
            },
            {
              id: 'ir12_q2',
              type: 'choice',
              category: { uk: 'Розуміння тексту', en: 'Reading comprehension' },
              question: { uk: 'Про що питає пан на ринку?', en: 'What does the man ask about at the market?' },
              options: [
                { translations: { uk: 'Про ціну книжки', en: 'The price of the book' } },
                { translations: { uk: 'Про персики', en: 'The peaches' } },
                { translations: { uk: 'Про гриби', en: 'The mushrooms' } },
              ],
              correctIndex: 0,
            },
            {
              id: 'ir12_q3',
              type: 'choice',
              category: { uk: 'Розуміння тексту', en: 'Reading comprehension' },
              question: { uk: 'Що Джулія купує для сина?', en: 'What does Giulia buy for her son?' },
              options: [
                { translations: { uk: 'М’яч', en: 'A ball' } },
                { translations: { uk: 'Книжку', en: 'A book' } },
                { translations: { uk: 'Каву', en: 'A coffee' } },
              ],
              correctIndex: 0,
            },
            {
              id: 'ir12_q4',
              type: 'choice',
              category: { uk: 'Закономірності читання', en: 'Reading patterns' },
              question: { uk: 'У якому слові з тексту є сполука QU?', en: 'Which word from the text contains QU?' },
              options: [
                { translations: { uk: 'quanto', en: 'quanto' } },
                { translations: { uk: 'figlio', en: 'figlio' } },
                { translations: { uk: 'pesche', en: 'pesche' } },
              ],
              correctIndex: 0,
            },
            {
              id: 'ir12_q5',
              type: 'choice',
              category: { uk: 'Закономірності читання', en: 'Reading patterns' },
              question: { uk: 'У якому слові з тексту є подвоєна приголосна?', en: 'Which word from the text has a doubled consonant?' },
              options: [
                { translations: { uk: 'spaghetti', en: 'spaghetti' } },
                { translations: { uk: 'mercato', en: 'mercato' } },
                { translations: { uk: 'gelato', en: 'gelato' } },
              ],
              correctIndex: 0,
            },
          ],
        },
      ],
    }
  };

  // ═══════════════════════════════════════════════════════════════════════
  // REGISTRY HELPERS & API
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * Get all lessons belonging to a specific unit, ordered by lessonNum.
   * @param {string} unitId
   * @returns {object[]}
   */
  function getLessonsByUnit(unitId) {
    return Object.values(LS_LESSONS)
      .filter(lesson => lesson.unitId === unitId)
      .sort((a, b) => (a.lessonNum || 0) - (b.lessonNum || 0));
  }

  /**
   * Get all registered lessons.
   * @returns {object[]}
   */
  function getAllLessons() {
    return Object.values(LS_LESSONS);
  }

  /**
   * Resolve a localized string or object according to the requested language.
   * Falls back to 'uk', then first available translation, then fallback string.
   * @param {object|string} translatable
   * @param {string} lang
   * @param {string} fallback
   * @returns {string}
   */
  function resolveTranslation(translatable, lang = 'uk', fallback = '') {
    if (!translatable) return fallback;
    if (typeof translatable === 'string') return translatable;
    if (typeof translatable === 'object') {
      return translatable[lang] || translatable.uk || translatable.en || Object.values(translatable)[0] || fallback;
    }
    return String(translatable);
  }

  // ═══════════════════════════════════════════════════════════════════════
  // MULTI-COURSE ARCHITECTURE (LS_COURSES)
  // ═══════════════════════════════════════════════════════════════════════

  /** @type {Record<string, object>} */
  const LS_COURSES = {
    italian: {
      id: 'italian',
      code: 'it',
      flag: 'flag-it',
      title: {
        uk: 'Італійська мова',
        en: 'Italian',
      },
      subtitle: {
        uk: 'Курс італійської · Основи',
        en: 'Italian Course · Foundations',
      },
      defaultLessonId: 'communication-basics-1',
      lessons: LS_LESSONS
    },
  };

  /**
   * Get course by ID (defaults to 'italian')
   * @param {string} courseId
   * @returns {object}
   */
  function getCourse(courseId) {
    if (!courseId) return LS_COURSES.italian;
    return LS_COURSES[courseId] || LS_COURSES.italian;
  }

  /**
   * Get active course ID from URL query or localStorage
   * @returns {string}
   */
  function getCurrentCourseId() {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const queryCourse = params.get('course');
      if (queryCourse && LS_COURSES[queryCourse]) return queryCourse;
      const savedCourse = localStorage.getItem('ls_target_course');
      if (savedCourse && LS_COURSES[savedCourse]) return savedCourse;
    }
    return 'italian';
  }

  /**
   * Set target course ID in localStorage and notify listeners
   * @param {string} courseId
   */
  function setCurrentCourseId(courseId) {
    if (!LS_COURSES[courseId]) return;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('ls_target_course', courseId);
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('courseChanged', { detail: { courseId } }));
    }
  }

  /**
   * Look up a lesson by ID within a specific course, or search all courses
   * @param {string} lessonId
   * @param {string} [courseId]
   * @returns {object|null}
   */
  function getCourseLessonById(lessonId, courseId) {
    if (!lessonId) return null;
    const targetCourse = courseId ? getCourse(courseId) : getCourse(getCurrentCourseId());
    if (targetCourse?.lessons?.[lessonId]) {
      return targetCourse.lessons[lessonId];
    }
    // Fallback: search across all registered courses
    for (const c of Object.values(LS_COURSES)) {
      if (c.lessons && c.lessons[lessonId]) return c.lessons[lessonId];
    }
    return null;
  }

  // ═══════════════════════════════════════════════════════════════════════
  // EXPORT TO BROWSER & MODULE ENVIRONMENTS
  // ═══════════════════════════════════════════════════════════════════════

  if (typeof window !== 'undefined') {
    window.LS_LESSONS = LS_LESSONS;
    window.LS_COURSES = LS_COURSES;
    window.getLessonById = getCourseLessonById;
    window.getLessonsByUnit = getLessonsByUnit;
    window.getAllLessons = getAllLessons;
    window.resolveLessonTranslation = resolveTranslation;

    window.getCourse = getCourse;
    window.getCurrentCourseId = getCurrentCourseId;
    window.setCurrentCourseId = setCurrentCourseId;
    window.getCourseLessonById = getCourseLessonById;

    // Attach convenience getters directly on LS_LESSONS
    LS_LESSONS.get = getCourseLessonById;
    LS_LESSONS.getByUnit = getLessonsByUnit;
    LS_LESSONS.getAll = getAllLessons;
    LS_LESSONS.t = resolveTranslation;
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      LS_LESSONS,
      LS_COURSES,
      getCourse,
      getCurrentCourseId,
      setCurrentCourseId,
      getCourseLessonById,
      getLessonById: getCourseLessonById,
      getLessonsByUnit,
      getAllLessons,
      resolveTranslation
    };
  }
})();
