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
        uk: 'Софія приходить раніше на урок і не впевнена, яке місце вільне. Ґрета допомагає і вони дізнаються, що обидві нові в курсі. Вчитель проводить коротке представлення: ім’я і країна.',
        en: 'Sofia arrives early and is unsure which seat is free. Greta helps her and they learn they are both new to the course. The teacher leads a short introduction round: name and country.',
      },
      duration: '20 хв',
      xpReward: 50,
      nextLessonId: 'communication-basics-2',
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
            { it: "questo posto è libero?", translations: { uk: 'це місце вільне?', en: 'is this seat free?' } },
            { it: 'certo', translations: { uk: 'звісно', en: 'of course' } },
            { it: 'anche tu?', translations: { uk: 'ти теж?', en: 'you too?' } },
            { it: "il corso d'italiano", translations: { uk: 'курс італійської', en: 'Italian course' } },
            { it: 'la prima lezione', translations: { uk: 'перше заняття', en: 'the first lesson' } },
            { it: 'piacere', translations: { uk: 'приємно познайомитися', en: 'nice to meet you' } },
            { it: 'il paese', translations: { uk: 'країна', en: 'country' } },
            { it: 'venire da', translations: { uk: 'бути родом із', en: 'to come from' } },
            { it: "l'Ucraina, la Germania, la Francia", translations: { uk: 'Україна, Німеччина, Франція', en: 'Ukraine, Germany, France' } },
            { it: 'ucraino/a, tedesco/a, francese', translations: { uk: 'українець/українка, німець/німкеня, француз/француженка', en: 'Ukrainian, German, French' } },
            { it: 'che bello!', translations: { uk: 'як чудово!', en: 'how nice!' } }
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
      type: 'reading',
      title: {
        uk: 'Перший день у Римі',
        en: 'First Day in Rome',
      },
      subtitle: {
        uk: 'Un caffè al bar — розуміння тексту',
        en: 'Un caffè al bar — reading comprehension',
      },
      description: {
        uk: 'Марко прибуває до Рима, знайомиться з ранковою атмосферою міста та замовляє свій перший еспресо в барі.',
        en: 'Marco arrives in Rome, experiences the morning city atmosphere, and orders his first espresso at the bar.',
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
      },
      lessonNum: 3,
      type: 'grammar',
      title: {
        uk: 'Дієслово Essere (Бути)',
        en: 'The Verb Essere (To Be)',
      },
      subtitle: {
        uk: 'Теперішній час (Presente indicativo)',
        en: 'Present tense (Presente indicativo)',
      },
      description: {
        uk: 'Фундаментальне дієслово італійської мови. Вчимося описувати себе, співрозмовника та предмети навколо.',
        en: 'A foundational Italian verb. Learn to describe yourself, others, and things around you.',
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
