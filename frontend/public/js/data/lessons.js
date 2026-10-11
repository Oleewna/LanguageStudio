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
        pl: 'Podstawy komunikacji'
      },
      lessonNum: 1,
      type: 'dialogue',
      title: {
        uk: 'Знайомство',
        en: 'Introductions',
        pl: 'Poznawanie się'
      },
      subtitle: {
        uk: 'Come ti chiami?',
        en: 'Come ti chiami?',
        pl: 'Come ti chiami?'
      },
      description: {
        uk: 'Софія приходить на свій перший урок італійської. У класі вона вітається, представляється та знайомиться з Оленою.',
        en: 'Emily arrives for her first Italian lesson. In class, she greets Jessica, introduces herself, and gets to know her.',
        pl: 'Sara przychodzi na swoją pierwszą lekcję włoskiego. W klasie wita się, przedstawia i poznaje Annę.'
      },
      duration: '15 хв',
      xpReward: 50,
      nextLessonId: 'communication-basics-2',
      prevLessonId: null,

      sections: [
        // ── Block 1: Dialogue ───────────────────────────────────────────
        {
          type: 'dialogue',
          title: {
            uk: 'Діалог у класі',
            en: 'Classroom dialogue'
          },
          story: {
            uk: 'Сара вперше заходить до мовної школи в Мілані. На рецепції її зустрічає Анна — час привітатися й назвати своє ім’я.',
            en: 'Emily arrives at a language school in Milan for the first time. In class, Jessica greets her. It is time to say hello and introduce herself.'
          },
          image: '../assets/images/communication-basics.jpg',
          imageAlt: {
            uk: 'Студенти в італійському класі знайомляться',
            en: 'Students in an Italian classroom getting to know each other'
          },
          lines: [
            {
              speaker: 'Sara',
              avatar: 'S',
              it: 'Buongiorno!',
              phonetic: '[буон-джор-но]',
              translations: {
                uk: 'Доброго дня!',
                en: 'Good morning!',
                pl: 'Dzień dobry!'
              },
              audio: true
            },
            {
              speaker: 'Anna',
              avatar: 'A',
              it: 'Buongiorno! Come ti chiami?',
              phonetic: '[ко-ме ті к’я-мі]',
              translations: {
                uk: 'Доброго дня! Як тебе звати?',
                en: 'Good morning! What is your name?',
                pl: 'Dzień dobry! Jak masz na imię?'
              },
              audio: true
            },
            {
              speaker: 'Sara',
              avatar: 'S',
              it: 'Mi chiamo Sara. E tu?',
              phonetic: '[мі к’я-мо Са-ра. е ту]',
              translations: {
                uk: 'Мене звати Сара. А тебе?',
                en: 'My name is Sara. And you?',
                pl: 'Nazywam się Sara. A ty?'
              },
              audio: true
            },
            {
              speaker: 'Anna',
              avatar: 'A',
              it: 'Io sono Anna. Piacere!',
              phonetic: '[і-о со-но Ан-на. п’я-че-ре]',
              translations: {
                uk: 'Я Анна. Приємно познайомитися!',
                en: "I'm Anna. Nice to meet you!",
                pl: 'Jestem Anna. Miło cię poznać!'
              },
              audio: true
            },
            {
              speaker: 'Sara',
              avatar: 'S',
              it: 'Piacere, Anna!',
              phonetic: '[п’я-че-ре, Ан-на]',
              translations: {
                uk: 'Приємно, Анно!',
                en: 'Nice to meet you, Anna!',
                pl: 'Miło mi, Anno!'
              },
              audio: true
            },
            {
              speaker: 'Anna',
              avatar: 'A',
              it: 'Sei nuova qui?',
              phonetic: '[сей ну-о-ва куі]',
              translations: {
                uk: 'Ти тут новенька?',
                en: 'Are you new here?',
                pl: 'Jesteś tu nowa?'
              },
              audio: true
            },
            {
              speaker: 'Sara',
              avatar: 'S',
              it: 'Sì, sono nuova.',
              phonetic: '[сі, со-но ну-о-ва]',
              translations: {
                uk: 'Так, я новенька.',
                en: "Yes, I'm new here."
              },
              audio: false
            },
            {
              speaker: 'Anna',
              avatar: 'A',
              it: 'Benvenuta al corso di italiano!',
              phonetic: '[бен-ве-ну-та аль кор-со ді іта-лья-но]',
              translations: {
                uk: 'Ласкаво просимо на курс італійської!',
                en: 'Welcome to the Italian course!'
              },
              audio: false
            },
            {
              speaker: 'Sara',
              avatar: 'S',
              it: 'Grazie mille!',
              phonetic: '[гра-цьє міл-ле]',
              translations: {
                uk: 'Дуже дякую!',
                en: 'Thank you very much!'
              },
              audio: false
            },
            {
              speaker: 'Anna',
              avatar: 'A',
              it: 'Prego. Buona lezione!',
              phonetic: '[пре-го. буо-на ле-цьо-не]',
              translations: {
                uk: 'Будь ласка. Гарного уроку!',
                en: 'You are welcome. Have a good lesson!'
              },
              audio: false
            },
            {
              speaker: 'Sara',
              avatar: 'S',
              it: 'Grazie, buona giornata!',
              phonetic: '[гра-цьє, буо-на джор-на-та]',
              translations: {
                uk: 'Дякую, гарного дня!',
                en: 'Thank you. Have a nice day!'
              },
              audio: false
            }
          ]
        },

        // ── Block 2: Vocab ──────────────────────────────────────────────
        {
          type: 'vocab',
          title: {
            uk: 'Нові слова',
            en: 'Vocabulary'
          },
          items: [
            {
              it: 'buongiorno',
              transcription: '[буон-джор-но]',
              translations: {
                uk: 'доброго дня',
                en: 'good morning / hello'
              }
            },
            {
              it: 'come ti chiami?',
              transcription: '[ко-ме ті к’я-мі]',
              translations: {
                uk: 'як тебе звати?',
                en: 'what is your name?'
              }
            },
            {
              it: 'mi chiamo',
              transcription: '[мі к’я-мо]',
              translations: {
                uk: 'мене звати',
                en: 'my name is'
              }
            },
            {
              it: 'io sono',
              transcription: '[і-о со-но]',
              translations: {
                uk: 'я є / я',
                en: 'I am'
              }
            },
            {
              it: 'piacere',
              transcription: '[п’я-че-ре]',
              translations: {
                uk: 'приємно познайомитися',
                en: 'nice to meet you'
              }
            },
            {
              it: 'sei nuova?',
              transcription: '[сей ну-о-ва]',
              translations: {
                uk: 'ти новенька?',
                en: 'are you new? (fem.)'
              }
            },
            {
              it: 'benvenuta',
              transcription: '[бен-ве-ну-та]',
              translations: {
                uk: 'ласкаво просимо (жінці)',
                en: 'welcome (fem.)'
              }
            },
            {
              it: 'grazie',
              transcription: '[гра-цьє]',
              translations: {
                uk: 'дякую',
                en: 'thank you'
              }
            },
            {
              it: 'prego',
              transcription: '[пре-го]',
              translations: {
                uk: 'будь ласка',
                en: "you're welcome"
              }
            },
            {
              it: 'buona lezione',
              transcription: '[буо-на ле-цьо-не]',
              translations: {
                uk: 'гарного уроку',
                en: 'have a good lesson'
              }
            }
          ],
          notes: [
            {
              type: 'default',
              title: { uk: 'Нотатка', en: 'Note' },
              text: {
                uk: 'Щоб назвати ім’я, можна сказати <i>Mi chiamo Sara</i> або <i>Io sono Sara</i>. Обидва варіанти правильні.',
                en: 'To state your name, you can say <i>Mi chiamo Sara</i> or <i>Io sono Sara</i>. Both options are correct.'
              }
            },
            {
              type: 'accent',
              title: { uk: 'Нотатка', en: 'Note' },
              text: {
                uk: '<i>Piacere</i> кажуть одразу після знайомства.',
                en: '<i>Piacere</i> is said right after introductions.'
              }
            }
          ]
        },

        // ── Block 3: Cultural Note ───────────────────────────────────────
        {
          type: 'culture_note',
          title: {
            uk: 'Маленька культурна нотатка',
            en: 'Cultural note'
          },
          paragraphs: [
            {
              uk: 'На рецепції, у школі чи магазині доречно починати розмову з <i>Buongiorno</i> — це просте й ввічливе «доброго дня».',
              en: "At reception, at school or in a shop, it's polite to start a conversation with <i>Buongiorno</i> — a simple and polite 'good day'."
            },
            {
              uk: 'Після знайомства італійці часто кажуть <i>Piacere</i>. У відповідь можна повторити: <i>Piacere!</i>',
              en: 'After introductions, Italians often say <i>Piacere</i>. In response, you can repeat: <i>Piacere!</i>'
            }
          ]
        },

        // ── Block 4: Takeaways ──────────────────────────────────────────
        {
          type: 'takeaways',
          title: {
            uk: 'Що варто запам’ятати',
            en: 'Key takeaways'
          },
          items: [
            {
              uk: '<i>Come ti chiami?</i> — «Як тебе звати?».',
              en: '<i>Come ti chiami?</i> — "What is your name?".'
            },
            {
              uk: '<i>Mi chiamo…</i> — «Мене звати…».',
              en: '<i>Mi chiamo…</i> — "My name is…".'
            },
            {
              uk: 'Після знайомства скажіть <i>Piacere!</i>.',
              en: 'After introductions, say <i>Piacere!</i>.'
            },
            {
              uk: '<i>Grazie</i> — «дякую», <i>Prego</i> — «будь ласка».',
              en: '<i>Grazie</i> — "thank you", <i>Prego</i> — "you\'re welcome".'
            }
          ]
        },

        // ── Block 5: Quiz ───────────────────────────────────────────────
        {
          type: 'quiz',
          title: {
            uk: 'Завдання уроку',
            en: 'Lesson practice'
          },
          tasks: [
            // Multiple choice tasks
            {
              id: 'q1',
              type: 'choice',
              category: { uk: 'Множинний вибір', en: 'Multiple choice' },
              question: {
                uk: 'Як перекладається «Come ti chiami?»?',
                en: "How do you translate 'Come ti chiami?'?"
              },
              options: [
                { translations: { uk: 'Як тебе звати?', en: 'What is your name?' } },
                { translations: { uk: 'Як справи?', en: 'How are you?' } },
                { translations: { uk: 'Де курс?', en: 'Where is the course?' } }
              ],
              correctIndex: 0
            },
            {
              id: 'q2',
              type: 'choice',
              category: { uk: 'Множинний вибір', en: 'Multiple choice' },
              question: {
                uk: 'Що означає «Mi chiamo Sara»?',
                en: "What does 'Mi chiamo Sara' mean?"
              },
              options: [
                { translations: { uk: 'Мене звати Сара', en: 'My name is Sara' } },
                { translations: { uk: 'Це Сара', en: 'This is Sara' } },
                { translations: { uk: 'До побачення, Сара', en: 'Goodbye, Sara' } }
              ],
              correctIndex: 0
            },
            {
              id: 'q3',
              type: 'choice',
              category: { uk: 'Множинний вибір', en: 'Multiple choice' },
              question: {
                uk: 'Що кажуть після знайомства?',
                en: 'What do you say after introductions?'
              },
              options: [
                { text: 'Piacere' },
                { text: 'Prego' },
                { text: 'Buona notte' }
              ],
              correctIndex: 0
            },
            {
              id: 'q4',
              type: 'choice',
              category: { uk: 'Множинний вибір', en: 'Multiple choice' },
              question: {
                uk: 'Що означає «Benvenuta»?',
                en: "What does 'Benvenuta' mean?"
              },
              options: [
                { translations: { uk: 'Ласкаво просимо (жінці)', en: 'Welcome (feminine)' } },
                { translations: { uk: 'Гарного дня', en: 'Have a good day' } },
                { translations: { uk: 'До побачення', en: 'Goodbye' } }
              ],
              correctIndex: 0
            },
            {
              id: 'q5',
              type: 'choice',
              category: { uk: 'Множинний вибір', en: 'Multiple choice' },
              question: {
                uk: 'Як відповісти на «Grazie»?',
                en: "How do you reply to 'Grazie'?"
              },
              options: [
                { text: 'Prego' },
                { text: 'Piacere' },
                { text: 'Sì' }
              ],
              correctIndex: 0
            },

            // True / False tasks
            {
              id: 'q6',
              type: 'true_false',
              category: { uk: 'Правда чи ні', en: 'True or False' },
              statement: {
                uk: '«Buongiorno» — ввічливе привітання вдень.',
                en: "'Buongiorno' is a polite daytime greeting."
              },
              correctAnswer: true
            },
            {
              id: 'q7',
              type: 'true_false',
              category: { uk: 'Правда чи ні', en: 'True or False' },
              statement: {
                uk: 'Анна — нова студентка на курсі.',
                en: 'Anna is a new student in the course.'
              },
              correctAnswer: false
            },
            {
              id: 'q8',
              type: 'true_false',
              category: { uk: 'Правда чи ні', en: 'True or False' },
              statement: {
                uk: 'Сара вперше прийшла на курс.',
                en: 'Sara has come to the course for the first time.'
              },
              correctAnswer: true
            },

            // Fill blank tasks
            {
              id: 'q9',
              type: 'fill_blank',
              category: { uk: 'Встав слово', en: 'Fill in the blank' },
              prefix: 'Mi chiamo',
              suffix: '.',
              placeholder: {
                uk: 'встав ім’я',
                en: 'enter name'
              },
              acceptableAnswers: ['Sara', 'Сара', 'Sofia', 'Emily']
            },
            {
              id: 'q10',
              type: 'fill_blank',
              category: { uk: 'Встав слово', en: 'Fill in the blank' },
              prefix: 'Io',
              suffix: 'Anna.',
              placeholder: {
                uk: 'встав слово',
                en: 'enter word'
              },
              acceptableAnswers: ['sono']
            },
            {
              id: 'q11',
              type: 'fill_blank',
              category: { uk: 'Встав слово', en: 'Fill in the blank' },
              prefix: '',
              suffix: 'al corso di italiano!',
              placeholder: {
                uk: 'встав слово',
                en: 'enter word'
              },
              acceptableAnswers: ['Benvenuta', 'benvenuta']
            },
            {
              id: 'q12',
              type: 'fill_blank',
              category: { uk: 'Встав слово', en: 'Fill in the blank' },
              prefix: 'Grazie! —',
              suffix: '.',
              placeholder: {
                uk: 'встав слово',
                en: 'enter word'
              },
              acceptableAnswers: ['Prego', 'prego']
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
        pl: 'Podstawy komunikacji'
      },
      lessonNum: 2,
      type: 'reading',
      title: {
        uk: 'Перший день у Римі',
        en: 'First Day in Rome',
        pl: 'Pierwszy dzień w Rzymie'
      },
      subtitle: {
        uk: 'Un caffè al bar — розуміння тексту',
        en: 'Un caffè al bar — reading comprehension',
        pl: 'Un caffè al bar — czytanie ze zrozumieniem'
      },
      description: {
        uk: 'Марко прибуває до Рима, знайомиться з ранковою атмосферою міста та замовляє свій перший еспресо в барі.',
        en: 'Marco arrives in Rome, experiences the morning city atmosphere, and orders his first espresso at the bar.',
        pl: 'Marco przybywa do Rzymu, poznaje poranną atmosferę miasta i zamawia swoje pierwsze espresso w barze.'
      },
      duration: '20 хв',
      xpReward: 50,
      nextLessonId: 'communication-basics-3',
      prevLessonId: 'communication-basics-1',

      sections: [
        // ── Block 1: Story Text (Reading) ───────────────────────────────
        {
          type: 'story_text',
          title: {
            uk: 'Історія для читання',
            en: 'Reading story'
          },
          image: '../assets/images/communication-basics.jpg',
          imageAlt: {
            uk: 'Ранкова кав’ярня в Римі',
            en: 'Morning café in Rome'
          },
          paragraphs: [
            {
              it: 'Marco arriva a Roma per lavoro. È mattina presto e il sole splende sul Colosseo.',
              translations: {
                uk: 'Марко прибуває до Рима по роботі. Рано-вранці, і сонце світить над Колізеєм.',
                en: 'Marco arrives in Rome for work. It is early morning and the sun shines over the Colosseum.'
              }
            },
            {
              it: 'Lui ha fame ed entra in un piccolo bar tipico vicino alla stazione.',
              translations: {
                uk: 'Він голодний і заходить у невеликий типовий бар біля вокзалу.',
                en: 'He is hungry and enters a small typical bar near the station.'
              }
            },
            {
              it: '«Buongiorno!» dice il barista con un grande sorriso. «Buongiorno! Un caffè e un cornetto, per favore», risponde Marco.',
              translations: {
                uk: '«Доброго дня!» каже бариста з великою посмішкою. «Доброго дня! Каву та круасан, будь ласка», відповідає Марко.',
                en: '"Good morning!" says the barista with a big smile. "Good morning! A coffee and a croissant, please", Marco replies.'
              }
            },
            {
              it: '«Subito! Ecco a Lei. Buona giornata a Roma!» — «Grazie mille, arrivederci!»',
              translations: {
                uk: '«Зараз буде! Ось, прошу. Гарного дня в Римі!» — «Дуже дякую, до побачення!»',
                en: '"Right away! Here you are. Have a great day in Rome!" — "Thank you very much, goodbye!"'
              }
            }
          ],
          vocabHints: [
            {
              word: 'arriva',
              translations: { uk: 'прибуває', en: 'arrives' }
            },
            {
              word: 'splende',
              translations: { uk: 'світить / сяє', en: 'shines' }
            },
            {
              word: 'cornetto',
              translations: { uk: 'італійський круасан', en: 'Italian croissant' }
            },
            {
              word: 'per favore',
              translations: { uk: 'будь ласка (прохання)', en: 'please' }
            },
            {
              word: 'subito',
              translations: { uk: 'зараз / миттєво', en: 'right away' }
            },
            {
              word: 'ecco a Lei',
              translations: { uk: 'ось, тримайте (ввічливо)', en: 'here you are (formal)' }
            }
          ]
        },

        // ── Block 2: Vocab ──────────────────────────────────────────────
        {
          type: 'vocab',
          title: {
            uk: 'Словничок до історії',
            en: 'Story vocabulary'
          },
          items: [
            {
              it: 'il bar',
              transcription: '[іль бар]',
              translations: {
                uk: 'бар, кав’ярня',
                en: 'café, bar'
              }
            },
            {
              it: 'il caffè',
              transcription: '[іль каф-фе]',
              translations: {
                uk: 'кава (еспресо)',
                en: 'coffee (espresso)'
              }
            },
            {
              it: 'il cornetto',
              transcription: '[іль кор-нет-то]',
              translations: {
                uk: 'рогалик, круасан',
                en: 'croissant'
              }
            },
            {
              it: 'per favore',
              transcription: '[пер фа-во-ре]',
              translations: {
                uk: 'будь ласка',
                en: 'please'
              }
            },
            {
              it: 'arrivederci',
              transcription: '[ар-рі-ве-дер-чі]',
              translations: {
                uk: 'до побачення',
                en: 'goodbye'
              }
            }
          ],
          notes: [
            {
              type: 'default',
              title: { uk: 'Нотатка', en: 'Note' },
              text: {
                uk: 'В Італії «un caffè» завжди означає класичне еспресо. Якщо потрібна інша кава, треба уточнити (напр., cappuccino, caffè americano).',
                en: "In Italy, 'un caffè' always refers to a classic espresso. Specify if you want cappuccino or caffè americano."
              }
            }
          ]
        },

        // ── Block 3: Cultural Note ───────────────────────────────────────
        {
          type: 'culture_note',
          title: {
            uk: 'Кавова традиція Італії',
            en: 'Italian coffee culture'
          },
          paragraphs: [
            {
              uk: 'Італійці зазвичай замовляють і випивають ранкову каву стоячи біля барної стійки (al banco). Це швидко, дешево та автентично.',
              en: 'Italians usually drink morning coffee standing at the counter (al banco). It is fast, affordable, and authentic.'
            },
            {
              uk: 'Капучино в Італії п’ють переважно до 11:00 ранку разом із солодкою випічкою (cornetto).',
              en: 'Cappuccino is typically consumed before 11:00 AM together with sweet pastries (cornetto).'
            }
          ]
        },

        // ── Block 4: Takeaways ──────────────────────────────────────────
        {
          type: 'takeaways',
          title: {
            uk: 'Що запам’ятати з тексту',
            en: 'Reading takeaways'
          },
          items: [
            {
              uk: '<i>Un caffè, per favore</i> — «Каву, будь ласка».',
              en: '<i>Un caffè, per favore</i> — "A coffee, please".'
            },
            {
              uk: '<i>Ecco a Lei</i> — ввічливе «ось, прошу» при передачі замовлення.',
              en: '<i>Ecco a Lei</i> — polite "here you are" when handing an order.'
            },
            {
              uk: '<i>Arrivederci</i> — універсальне ввічливе прощання «до побачення».',
              en: '<i>Arrivederci</i> — universal polite farewell "goodbye".'
            }
          ]
        },

        // ── Block 5: Quiz ───────────────────────────────────────────────
        {
          type: 'quiz',
          title: {
            uk: 'Перевірка розуміння тексту',
            en: 'Reading comprehension check'
          },
          tasks: [
            {
              id: 'r_q1',
              type: 'choice',
              category: { uk: 'Розуміння тексту', en: 'Text comprehension' },
              question: {
                uk: 'Куди і навіщо приїхав Марко?',
                en: 'Where and why did Marco arrive?'
              },
              options: [
                { translations: { uk: 'До Рима по роботі', en: 'To Rome for work' } },
                { translations: { uk: 'До Мілана на відпочинок', en: 'To Milan on vacation' } },
                { translations: { uk: 'До Неаполя на навчання', en: 'To Naples to study' } }
              ],
              correctIndex: 0
            },
            {
              id: 'r_q2',
              type: 'choice',
              category: { uk: 'Розуміння тексту', en: 'Text comprehension' },
              question: {
                uk: 'Що замовив Марко в барі?',
                en: 'What did Marco order at the bar?'
              },
              options: [
                { translations: { uk: 'Каву та круасан', en: 'Coffee and a croissant' } },
                { translations: { uk: 'Чай та піцу', en: 'Tea and pizza' } },
                { translations: { uk: 'Лише склянку води', en: 'Only a glass of water' } }
              ],
              correctIndex: 0
            },
            {
              id: 'r_q3',
              type: 'true_false',
              category: { uk: 'Правда чи ні', en: 'True or False' },
              statement: {
                uk: 'Марко прибув до міста пізно ввечері під час дощу.',
                en: 'Marco arrived late at night in the rain.'
              },
              correctAnswer: false
            },
            {
              id: 'r_q4',
              type: 'true_false',
              category: { uk: 'Правда чи ні', en: 'True or False' },
              statement: {
                uk: 'Бариста побажав Маркові гарного дня в Римі.',
                en: 'The barista wished Marco a good day in Rome.'
              },
              correctAnswer: true
            },
            {
              id: 'r_q5',
              type: 'fill_blank',
              category: { uk: 'Встав слово', en: 'Fill in the blank' },
              prefix: 'Un caffè e un cornetto,',
              suffix: '!',
              placeholder: {
                uk: 'вставте "per favore"',
                en: 'enter "per favore"'
              },
              acceptableAnswers: ['per favore']
            }
          ]
        }
      ]
    },

    // ═══════════════════════════════════════════════════════════════════════
    // LESSON 3: Grammar Template (Дієслово Essere — Відмінювання та вживання)
    // ═══════════════════════════════════════════════════════════════════════
    'communication-basics-3': {
      id: 'communication-basics-3',
      unitId: 'communication-basics',
      unitTitle: {
        uk: 'Основи спілкування',
        en: 'Communication basics',
        pl: 'Podstawy komunikacji'
      },
      lessonNum: 3,
      type: 'grammar',
      title: {
        uk: 'Дієслово Essere (Бути)',
        en: 'The Verb Essere (To Be)',
        pl: 'Czasownik Essere (Być)'
      },
      subtitle: {
        uk: 'Теперішній час (Presente indicativo)',
        en: 'Present tense (Presente indicativo)',
        pl: 'Czas teraźniejszy (Presente indicativo)'
      },
      description: {
        uk: 'Фундаментальне дієслово італійської мови. Вчимося описувати себе, співрозмовника та предмети навколо.',
        en: 'A foundational Italian verb. Learn to describe yourself, others, and things around you.',
        pl: 'Podstawowy czasownik języka włoskiego. Uczymy się opisywać siebie, rozmówcę oraz otaczające nas przedmioty.'
      },
      duration: '15 хв',
      xpReward: 50,
      nextLessonId: null,
      prevLessonId: 'communication-basics-2',

      sections: [
        // ── Block 1: Grammar Rule & Conjugation Table ────────────────────
        {
          type: 'grammar_rule',
          title: {
            uk: 'Відмінювання дієслова essere',
            en: 'Conjugation of the verb essere'
          },
          explanation: {
            uk: 'Дієслово <b>essere</b> (бути) є неправильним. Воно вживається для назви імені, професії, національності, місця перебування та якостей людини або предмета.',
            en: 'The verb <b>essere</b> (to be) is irregular. It is used to express names, professions, nationalities, location, and characteristics.'
          },
          table: {
            headers: {
              uk: ['Займенник', 'Форма essere', 'Приклад', 'Переклад'],
              en: ['Pronoun', 'Form of essere', 'Example', 'Translation']
            },
            rows: [
              {
                pronoun: 'io',
                form: 'sono',
                example: 'Io sono studente',
                translations: {
                  uk: 'Я студент',
                  en: 'I am a student'
                }
              },
              {
                pronoun: 'tu',
                form: 'sei',
                example: 'Tu sei italiano',
                translations: {
                  uk: 'Ти італієць',
                  en: 'You are Italian'
                }
              },
              {
                pronoun: 'lui / lei / Lei',
                form: 'è',
                example: 'Lei è dottoressa',
                translations: {
                  uk: 'Вона лікарка / Ви лікарка',
                  en: 'She is a doctor / You are a doctor'
                }
              },
              {
                pronoun: 'noi',
                form: 'siamo',
                example: 'Noi siamo a Roma',
                translations: {
                  uk: 'Ми в Римі',
                  en: 'We are in Rome'
                }
              },
              {
                pronoun: 'voi',
                form: 'siete',
                example: 'Voi siete pronti?',
                translations: {
                  uk: 'Ви готові?',
                  en: 'Are you ready?'
                }
              },
              {
                pronoun: 'loro',
                form: 'sono',
                example: 'Loro sono amici',
                translations: {
                  uk: 'Вони друзі',
                  en: 'They are friends'
                }
              }
            ]
          }
        },

        // ── Block 2: Vocab (Useful Adjectives) ──────────────────────────
        {
          type: 'vocab',
          title: {
            uk: 'Прикметники для тренування',
            en: 'Practice adjectives'
          },
          items: [
            {
              it: 'felice',
              transcription: '[фе-лі-че]',
              translations: {
                uk: 'щасливий / щаслива',
                en: 'happy'
              }
            },
            {
              it: 'stanco / stanca',
              transcription: '[стан-ко / стан-ка]',
              translations: {
                uk: 'втомлений / втомлена',
                en: 'tired'
              }
            },
            {
              it: 'pronto / pronta',
              transcription: '[прон-то / прон-та]',
              translations: {
                uk: 'готовий / готова',
                en: 'ready'
              }
            },
            {
              it: 'italiano / italiana',
              transcription: '[іта-лья-но / іта-лья-на]',
              translations: {
                uk: 'італієць / італійка',
                en: 'Italian'
              }
            }
          ],
          notes: [
            {
              type: 'accent',
              title: { uk: 'Зверніть увагу', en: 'Note' },
              text: {
                uk: 'В італійській мові особові займенники (io, tu, noi...) зазвичай пропускаються, адже форма дієслова вже вказує на особу: <i>Sono a Roma</i> замість <i>Io sono a Roma</i>.',
                en: "In Italian, subject pronouns (io, tu, noi...) are usually omitted because the verb ending clarifies the subject: <i>Sono a Roma</i> instead of <i>Io sono a Roma</i>."
              }
            }
          ]
        },

        // ── Block 3: Takeaways ──────────────────────────────────────────
        {
          type: 'takeaways',
          title: {
            uk: 'Ключові висновки',
            en: 'Grammar takeaways'
          },
          items: [
            {
              uk: 'Форми для <i>io</i> та <i>loro</i> звучать однаково: <b>sono</b>. Значення розрізняють за контекстом.',
              en: 'Forms for <i>io</i> and <i>loro</i> are identical: <b>sono</b>. Context clarifies the meaning.'
            },
            {
              uk: 'Звертання на «Ви» (ввічлива форма) використовує форму 3-ї особи: <i>Lei è…</i>.',
              en: 'Formal "You" (polite address) uses the 3rd person form: <i>Lei è…</i>.'
            },
            {
              uk: 'Дієслово <i>essere</i> не викидається з речення, як це іноді буває в українській: «Я студент» = «Io <b>sono</b> studente».',
              en: "The verb <i>essere</i> cannot be dropped: 'I am a student' = 'Io <b>sono</b> studente'."
            }
          ]
        },

        // ── Block 4: Quiz ───────────────────────────────────────────────
        {
          type: 'quiz',
          title: {
            uk: 'Граматичний практикум',
            en: 'Grammar exercise'
          },
          tasks: [
            {
              id: 'g_q1',
              type: 'choice',
              category: { uk: 'Вибір правильної форми', en: 'Choose the correct form' },
              question: {
                uk: 'Оберіть правильну форму: Noi ___ felici.',
                en: 'Choose the correct form: Noi ___ felici.'
              },
              options: [
                { text: 'siamo' },
                { text: 'siete' },
                { text: 'sono' }
              ],
              correctIndex: 0
            },
            {
              id: 'g_q2',
              type: 'choice',
              category: { uk: 'Вибір правильної форми', en: 'Choose the correct form' },
              question: {
                uk: 'Оберіть правильну форму: Tu ___ pronto?',
                en: 'Choose the correct form: Tu ___ pronto?'
              },
              options: [
                { text: 'sei' },
                { text: 'è' },
                { text: 'siamo' }
              ],
              correctIndex: 0
            },
            {
              id: 'g_q3',
              type: 'true_false',
              category: { uk: 'Правда чи ні', en: 'True or False' },
              statement: {
                uk: 'Форма дієслова essere для «lui / lei» — «è».',
                en: "The form of the verb essere for 'lui / lei' is 'è'."
              },
              correctAnswer: true
            },
            {
              id: 'g_q4',
              type: 'true_false',
              category: { uk: 'Правда чи ні', en: 'True or False' },
              statement: {
                uk: 'В італійській мові завжди обов’язково говорити займенник «io» перед «sono».',
                en: "In Italian it is strictly required to say the pronoun 'io' before 'sono'."
              },
              correctAnswer: false
            },
            {
              id: 'g_q5',
              type: 'fill_blank',
              category: { uk: 'Встав слово', en: 'Fill in the blank' },
              prefix: 'Lei',
              suffix: 'italiana.',
              placeholder: {
                uk: 'вставте форму essere',
                en: 'enter form of essere'
              },
              acceptableAnswers: ['è']
            },
            {
              id: 'g_q6',
              type: 'fill_blank',
              category: { uk: 'Встав слово', en: 'Fill in the blank' },
              prefix: 'Voi',
              suffix: 'a Milano?',
              placeholder: {
                uk: 'вставте форму essere',
                en: 'enter form of essere'
              },
              acceptableAnswers: ['siete']
            }
          ]
        }
      ]
    }
  };

  // ═══════════════════════════════════════════════════════════════════════
  // REGISTRY HELPERS & API
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * Get a lesson by its unique ID.
   * @param {string} id
   * @returns {object|null}
   */
  function getLessonById(id) {
    if (!id) return null;
    return LS_LESSONS[id] || null;
  }

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
      flag: '🇮🇹',
      title: {
        uk: 'Італійська мова',
        en: 'Italian',
        pl: 'Język włoski'
      },
      subtitle: {
        uk: 'Курс італійської · Основи',
        en: 'Italian Course · Foundations',
        pl: 'Kurs włoskiego · Podstawy'
      },
      defaultLessonId: 'communication-basics-1',
      lessons: LS_LESSONS
    },
    spanish: {
      id: 'spanish',
      code: 'es',
      flag: '🇪🇸',
      title: {
        uk: 'Іспанська мова',
        en: 'Spanish',
        pl: 'Język hiszpański'
      },
      subtitle: {
        uk: 'Курс іспанської · Основи',
        en: 'Spanish Course · Foundations',
        pl: 'Kurs hiszpańskiego · Podstawy'
      },
      defaultLessonId: 'spanish-basics-1',
      lessons: {
        'spanish-basics-1': {
          id: 'spanish-basics-1',
          courseId: 'spanish',
          unitId: 'spanish-basics',
          unitTitle: {
            uk: 'Основи спілкування',
            en: 'Communication basics',
            pl: 'Podstawy komunikacji'
          },
          lessonNum: 1,
          type: 'dialogue',
          title: {
            uk: 'Знайомство',
            en: 'Introductions',
            pl: 'Poznawanie się'
          },
          subtitle: {
            uk: '¿Cómo te llamas?',
            en: '¿Cómo te llamas?',
            pl: '¿Cómo te llamas?'
          },
          description: {
            uk: 'Карлос та Елена знайомляться на першому уроці іспанської в Мадриді.',
            en: 'Carlos and Elena introduce themselves in their first Spanish class in Madrid.',
            pl: 'Carlos i Elena poznają się na pierwszej lekcji hiszpańskiego w Madrycie.'
          },
          duration: '15 хв',
          xpReward: 50,
          nextLessonId: null,
          prevLessonId: null,

          sections: [
            {
              type: 'dialogue',
              title: {
                uk: 'Діалог у класі',
                en: 'Classroom dialogue',
                pl: 'Dialog w klasie'
              },
              story: {
                uk: 'Карлос приходить на перший урок іспанської в Мадриді та вітається з Еленою.',
                en: 'Carlos arrives for his first Spanish lesson in Madrid and greets Elena.',
                pl: 'Carlos przychodzi na pierwszą lekcję hiszpańskiego w Madrycie i wita się z Eleną.'
              },
              image: '../assets/images/communication-basics.jpg',
              imageAlt: {
                uk: 'Студенти на уроці іспанської мови',
                en: 'Students in a Spanish language classroom',
                pl: 'Uczniowie na lekcji języka hiszpańskiego'
              },
              lines: [
                {
                  speaker: 'Elena',
                  avatar: 'E',
                  it: '¡Hola! ¡Buenos días!',
                  phonetic: '[о-ла! бу-е-нос ді-ас]',
                  translations: {
                    uk: 'Привіт! Доброго ранку!',
                    en: 'Hello! Good morning!',
                    pl: 'Cześć! Dzień dobry!'
                  },
                  audio: true
                },
                {
                  speaker: 'Carlos',
                  avatar: 'C',
                  it: '¡Buenos días! ¿Cómo te llamas?',
                  phonetic: '[бу-е-нос ді-ас! ко-мо те льа-мас]',
                  translations: {
                    uk: 'Доброго ранку! Як тебе звати?',
                    en: 'Good morning! What is your name?',
                    pl: 'Dzień dobry! Jak masz na imię?'
                  },
                  audio: true
                },
                {
                  speaker: 'Elena',
                  avatar: 'E',
                  it: 'Me llamo Elena. ¿Y tú?',
                  phonetic: '[ме льа-мо Е-ле-на. і ту]',
                  translations: {
                    uk: 'Мене звати Елена. А тебе?',
                    en: 'My name is Elena. And you?',
                    pl: 'Nazywam się Elena. A ty?'
                  },
                  audio: true
                },
                {
                  speaker: 'Carlos',
                  avatar: 'C',
                  it: 'Yo soy Carlos. ¡Mucho gusto!',
                  phonetic: '[йо сой Кар-лос. му-чо гус-то]',
                  translations: {
                    uk: 'Я Карлос. Дуже приємно!',
                    en: "I'm Carlos. Nice to meet you!",
                    pl: 'Jestem Carlos. Bardzo mi miło!'
                  },
                  audio: true
                }
              ]
            },
            {
              type: 'vocab',
              title: {
                uk: 'Словничок уроку',
                en: 'Lesson vocabulary',
                pl: 'Słowniczek lekcji'
              },
              items: [
                {
                  it: '¡Hola!',
                  phonetic: '[о-ла]',
                  translations: { uk: 'Привіт!', en: 'Hello!', pl: 'Cześć!' }
                },
                {
                  it: 'Buenos días',
                  phonetic: '[бу-е-нос ді-ас]',
                  translations: { uk: 'Доброго ранку / Доброго дня', en: 'Good morning', pl: 'Dzień dobry' }
                },
                {
                  it: '¿Cómo te llamas?',
                  phonetic: '[ко-мо те льа-мас]',
                  translations: { uk: 'Як тебе звати?', en: 'What is your name?', pl: 'Jak masz na imię?' }
                },
                {
                  it: 'Me llamo...',
                  phonetic: '[ме льа-мо]',
                  translations: { uk: 'Мене звати...', en: 'My name is...', pl: 'Nazywam się...' }
                },
                {
                  it: '¡Mucho gusto!',
                  phonetic: '[му-чо гус-то]',
                  translations: { uk: 'Дуже приємно!', en: 'Nice to meet you!', pl: 'Bardzo mi miło!' }
                }
              ]
            },
            {
              type: 'takeaways',
              title: {
                uk: 'Підсумки уроку',
                en: 'Key takeaways',
                pl: 'Podsumowanie lekcji'
              },
              items: [
                {
                  bold: '¡Hola! / Buenos días',
                  text: {
                    uk: 'Універсальні вітання в іспанській мові.',
                    en: 'Universal greetings in Spanish.',
                    pl: 'Uniwersalne powitania w języku hiszpańskim.'
                  }
                },
                {
                  bold: '¿Cómo te llamas? — Me llamo...',
                  text: {
                    uk: 'Основна конструкція знайомства та повідомлення свого імені.',
                    en: 'Core pattern for introducing yourself and asking someone’s name.',
                    pl: 'Podstawowa konstrukcja przedstawiania się i pytania o imię.'
                  }
                }
              ]
            }
          ]
        }
      }
    }
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
