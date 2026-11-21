import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const OUT_DIR = path.join(projectRoot, 'lessons', 'it');
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

// 1. Read course metadata
const courseJsonPath = path.join(projectRoot, 'courses', 'it', 'course.json');
const courseUkPath = path.join(projectRoot, 'courses', 'it', 'i18n', 'uk', 'course.json');

const courseData = JSON.parse(fs.readFileSync(courseJsonPath, 'utf8'));
const courseUk = JSON.parse(fs.readFileSync(courseUkPath, 'utf8'));

// Reading rules data
const readingRulesJsonPath = path.join(__dirname, 'data', 'reading-rules.json');
const readingRuleData = fs.existsSync(readingRulesJsonPath)
  ? JSON.parse(fs.readFileSync(readingRulesJsonPath, 'utf8'))
  : {};

// Helper to find path and unit info
function getLessonMetadata(lessonId) {
  for (const p of courseData.paths || []) {
    for (const u of p.units || []) {
      for (const l of u.lessons || []) {
        if (l.id === lessonId) {
          const pathTitle = courseUk.paths?.[p.id]?.title || (p.id === 'italian-reading' ? 'Правила читання' : p.id);
          const unitTitle = courseUk.units?.[u.id]?.title || (u.id === 'italian-reading-basics' ? 'Основи читання' : u.id);
          return {
            pathId: p.id,
            pathTitle,
            unitId: u.id,
            unitTitle,
            access: l.access || (p.id === 'italian-reading' ? 'paid' : 'free'),
            xp: l.xp || 10
          };
        }
      }
    }
  }
  return {
    pathId: 'communication-basics',
    pathTitle: 'Основи спілкування',
    unitId: 'communication-basics-roadmap',
    unitTitle: 'План курсу',
    access: 'draft',
    xp: 10
  };
}

// Active lessons from code
const activeLessons = [
  { id: 'communication-basics-1', dir: 'courses/it', num: 'Урок 1' },
  { id: 'communication-basics-1-greetings', dir: 'courses/it', num: 'Урок 2' },
  { id: 'communication-basics-1-practice', dir: 'courses/it', num: 'Урок 3' },
  { id: 'italian-reading-2', dir: 'paid-content/courses/it', num: 'Правило 1' },
  { id: 'italian-reading-3', dir: 'paid-content/courses/it', num: 'Правило 2' },
  { id: 'italian-reading-4', dir: 'paid-content/courses/it', num: 'Правило 3' },
  { id: 'italian-reading-5', dir: 'paid-content/courses/it', num: 'Правило 4' },
  { id: 'italian-reading-6', dir: 'paid-content/courses/it', num: 'Правило 5' },
  { id: 'italian-reading-7', dir: 'paid-content/courses/it', num: 'Правило 6' },
  { id: 'italian-reading-8', dir: 'paid-content/courses/it', num: 'Правило 7' },
  { id: 'italian-reading-9', dir: 'paid-content/courses/it', num: 'Правило 8' },
  { id: 'italian-reading-10', dir: 'paid-content/courses/it', num: 'Правило 9' },
  { id: 'italian-reading-11', dir: 'paid-content/courses/it', num: 'Правило 10' },
  { id: 'italian-reading-12', dir: 'paid-content/courses/it', num: 'Урок 12' }
];

function formatLessonFromCode(lessonInfo) {
  const { id, dir, num } = lessonInfo;
  const baseJsonPath = path.join(projectRoot, dir, 'lessons', `${id}.json`);
  const i18nJsonPath = path.join(projectRoot, dir, 'i18n', 'uk', 'lessons', `${id}.json`);

  const base = JSON.parse(fs.readFileSync(baseJsonPath, 'utf8'));
  const i18n = JSON.parse(fs.readFileSync(i18nJsonPath, 'utf8'));

  const meta = getLessonMetadata(id);
  const head = i18n[id] || {};
  const title = head.title || id;
  const subtitle = head.subtitle || '';
  const description = head.description || '';
  const duration = head.duration || '2-5 хв';
  const xp = base.xpReward || meta.xp || 10;
  const nextId = base.nextLessonId || null;
  const prevId = base.prevLessonId || null;

  const md = [];

  // Title
  md.push(`# ${num}: ${title}${subtitle ? ` — *${subtitle}*` : ''}`);
  md.push('');

  // Metadata block
  md.push('## ℹ️ Інформація про урок');
  md.push('');
  md.push(`- **Ідентифікатор:** \`${id}\``);
  md.push(`- **Тема / Шлях:** ${meta.pathTitle} (\`${meta.pathId}\`)`);
  md.push(`- **Розділ:** ${meta.unitTitle}`);
  md.push(`- **Орієнтовний час:** ⏱️ ${duration}`);
  md.push(`- **Нагорода:** 🏆 ${xp} XP`);
  md.push(`- **Статус у додатку:** ✅ Активний (${meta.access === 'paid' ? 'Преміум доступ' : 'Безкоштовно'})`);
  
  const nav = [];
  if (prevId) {
    nav.push(`[← Попередній урок: \`${prevId}\`](./${prevId}.md)`);
  }
  if (nextId) {
    nav.push(`[Наступний урок: \`${nextId}\` →](./${nextId}.md)`);
  }
  if (nav.length > 0) {
    md.push(`- **Навігація:** ${nav.join(' | ')}`);
  }
  md.push('');
  if (description) {
    md.push(`> **Мета уроку:** ${description}`);
    md.push('');
  }

  // Pronunciation rule and word bank if present
  const extraReading = readingRuleData[id];
  if (extraReading && extraReading.ruleText) {
    md.push('## 📏 Правило вимови');
    md.push('');
    md.push(`> **Вимова:** ${extraReading.ruleText}`);
    md.push('');
  }

  if (extraReading && extraReading.words && extraReading.words.length > 0) {
    md.push('## 🎧 Словниковий банк уроку');
    md.push('');
    md.push('| Італійська | Значення / коментар українською |');
    md.push('|---|---|');
    for (const w of extraReading.words) {
      md.push(`| **${w.it}** | ${w.uk} |`);
    }
    md.push('');
  }

  md.push('---');
  md.push('');

  // Process blocks
  for (const block of base.blocks || []) {
    const bId = block.id;
    const bI18n = i18n[bId] || {};

    if (block.type === 'dialogue') {
      const blockTitle = bI18n.title || 'Діалог';
      md.push(`## 🗣️ Діалог: ${blockTitle}`);
      md.push('');
      if (bI18n.story) {
        md.push(`*${bI18n.story}*`);
        md.push('');
      }

      md.push('| Учасник | Італійська | Транскрипція | Переклад українською |');
      md.push('|---|---|---|---|');
      for (const line of block.lines || []) {
        const lI18n = i18n[line.id] || {};
        const speaker = line.speaker || '';
        const itText = line.text || line.it || '';
        const pron = lI18n.pronunciation ? `\`${lI18n.pronunciation}\`` : '-';
        const trans = lI18n.trans || '';
        md.push(`| **${speaker}** | ${itText} | ${pron} | ${trans} |`);
      }
      md.push('');
    } else if (block.type === 'vocab') {
      const blockTitle = bI18n.title || 'Словник';
      md.push(`## 📚 ${blockTitle}`);
      md.push('');
      md.push('| Італійська | Транскрипція | Переклад українською |');
      md.push('|---|---|---|');
      for (const item of block.items || []) {
        const vI18n = i18n[item.id] || {};
        const itText = item.text || item.it || item.word || '';
        const pron = vI18n.pronunciation ? `\`${vI18n.pronunciation}\`` : '-';
        const trans = vI18n.trans || vI18n.translation || '';
        md.push(`| **${itText}** | ${pron} | ${trans} |`);
      }
      md.push('');
    } else if (block.type === 'story_text') {
      const blockTitle = bI18n.title || 'Читання тексту';
      md.push(`## 📖 ${blockTitle}`);
      md.push('');
      for (const p of block.paragraphs || []) {
        const pI18n = i18n[p.id] || {};
        const itText = p.text || '';
        const trans = pI18n.translations || pI18n.translation || pI18n.text || '';
        md.push(`> 🇮🇹 **Італійська:** ${itText}`);
        if (trans) {
          md.push(`>`);
          md.push(`> 🇺🇦 **Переклад:** *${trans}*`);
        }
        md.push('');
      }

      if (block.vocabHints && block.vocabHints.length > 0) {
        md.push('### 🔍 Підказки до слів');
        md.push('');
        md.push('| Слово | Значення українською |');
        md.push('|---|---|');
        for (const hint of block.vocabHints) {
          const hI18n = i18n[hint.id] || {};
          const trans = hI18n.translations || hI18n.translation || hI18n.trans || '';
          md.push(`| **${hint.word}** | ${trans} |`);
        }
        md.push('');
      }
    } else if (block.type === 'takeaways') {
      const blockTitle = bI18n.title || 'Запам’ятайте';
      md.push(`## 💡 ${blockTitle}`);
      md.push('');
      for (const item of block.items || []) {
        const tI18n = i18n[item.id] || {};
        const text = tI18n.text || item.text || '';
        if (text) {
          md.push(`- ${text}`);
        }
      }
      md.push('');
    } else if (block.type === 'tasks') {
      const blockTitle = bI18n.title || 'Швидка практика';
      md.push(`## ✍️ ${blockTitle}`);
      md.push('');
      let qNum = 1;
      for (const item of block.items || []) {
        const tI18n = i18n[item.id] || {};
        const question = tI18n.question || item.question || `Питання ${qNum}`;
        md.push(`### ${qNum}. ${question}`);
        md.push('');
        for (const opt of item.options || []) {
          const optText = tI18n.options?.[opt.id] || opt.text || opt.id;
          const isCorrect = Boolean(opt.correct);
          if (isCorrect) {
            md.push(`- [x] **${optText}** *(Правильна відповідь)*`);
          } else {
            md.push(`- [ ] ${optText}`);
          }
        }
        if (tI18n.explanation) {
          md.push('');
          md.push(`> 💡 **Пояснення:** ${tI18n.explanation}`);
        }
        md.push('');
        qNum++;
      }
    }
  }

  // Footer navigation
  md.push('---');
  md.push('');
  md.push('[← Повернутися до списку уроків](./README.md)');

  return {
    id,
    num,
    title,
    subtitle,
    pathTitle: meta.pathTitle,
    content: md.join('\n')
  };
}

// Load roadmap lessons
function loadRoadmapLessons() {
  const roadmapPath = path.join(__dirname, 'data', 'roadmap-lessons.json');
  if (!fs.existsSync(roadmapPath)) return { lessons: [], summaryContent: null };

  const data = JSON.parse(fs.readFileSync(roadmapPath, 'utf8'));
  const results = [];

  for (const l of data.lessons || []) {
    const md = [];
    md.push(`# ${l.num}: ${l.title}`);
    md.push('');
    md.push('## ℹ️ Інформація про урок');
    md.push('');
    md.push(`- **Ідентифікатор:** \`${l.id}\``);
    md.push(`- **Тема / Шлях:** Основи спілкування (\`communication-basics\`)`);
    md.push(`- **Орієнтовний час:** ⏱️ ${l.time}`);
    md.push(`- **Нагорода:** 🏆 ${l.reward}`);
    md.push(`- **Статус у додатку:** 📋 Чернетка / План курсу (Roadmap)`);

    const nav = [];
    if (l.prevId) nav.push(`[← Попередній урок: \`${l.prevId}\`](./${l.prevId}.md)`);
    if (l.nextId) nav.push(`[Наступний урок: \`${l.nextId}\` →](./${l.nextId}.md)`);
    if (nav.length > 0) md.push(`- **Навігація:** ${nav.join(' | ')}`);
    md.push('');
    if (l.goal) {
      md.push(`> **Мета уроку:** ${l.goal}`);
      md.push('');
    }
    md.push('---');
    md.push('');

    if (l.phrases && l.phrases.length > 0) {
      md.push('## 🗣️ Навчальні фрази та діалог');
      md.push('');
      md.push('| Учасник / Ситуація | Італійська | Переклад українською |');
      md.push('|---|---|---|');
      for (const p of l.phrases) {
        md.push(`| **${p.speaker}** | ${p.it} | ${p.uk} |`);
      }
      md.push('');
    }

    if (l.remember && l.remember.length > 0) {
      md.push('## 💡 Запам’ятайте');
      md.push('');
      for (const r of l.remember) {
        md.push(`- ${r}`);
      }
      md.push('');
    }

    if (l.practice && l.practice.length > 0) {
      md.push('## ✍️ Швидка практика');
      md.push('');
      let qNum = 1;
      for (const pr of l.practice) {
        md.push(`### ${qNum}. ${pr.prompt}`);
        md.push('');
        if (pr.options && pr.options.length > 0) {
          for (const opt of pr.options) {
            if (opt.isCorrect) {
              md.push(`- [x] **${opt.letter}. ${opt.text}** *(Правильна відповідь)*`);
            } else {
              md.push(`- [ ] ${opt.letter}. ${opt.text}`);
            }
          }
        } else if (pr.answer) {
          md.push(`> 🎯 **Очікувана відповідь:** **${pr.answer}**`);
        }
        md.push('');
        qNum++;
      }
    }

    md.push('---');
    md.push('');
    md.push('[← Повернутися до списку уроків](./README.md)');

    results.push({
      id: l.id,
      num: l.num,
      title: l.title,
      pathTitle: 'Основи спілкування',
      content: md.join('\n')
    });
  }

  let summaryContent = null;
  if (data.summary && data.summary.length > 0) {
    const sMd = [];
    sMd.push('# 🎯 Підсумкове повторення: Основи спілкування');
    sMd.push('');
    sMd.push('Спробуйте згадати та відповісти італійською, перш ніж перевіряти себе.');
    sMd.push('');
    sMd.push('| Підказка / Ситуація (Українською) | Очікувана фраза італійською |');
    sMd.push('|---|---|');
    for (const item of data.summary) {
      sMd.push(`| ${item.uk} | **${item.it}** |`);
    }
    sMd.push('');
    sMd.push('---');
    sMd.push('');
    sMd.push('[← Повернутися до списку уроків](./README.md)');
    summaryContent = sMd.join('\n');
  }

  return { lessons: results, summaryContent };
}

// Main execution
console.log('Extracting lessons into markdown files in:', OUT_DIR);

const allLessonSummaries = [];

// 1. Process active lessons
for (const lessonInfo of activeLessons) {
  const result = formatLessonFromCode(lessonInfo);
  const outPath = path.join(OUT_DIR, `${result.id}.md`);
  fs.writeFileSync(outPath, result.content, 'utf8');
  console.log(`Saved: lessons/it/${result.id}.md`);
  allLessonSummaries.push({
    num: result.num,
    id: result.id,
    title: result.title,
    pathTitle: result.pathTitle,
    status: '✅ В додатку'
  });
}

// 2. Process roadmap lessons
const { lessons: roadmapLessons, summaryContent } = loadRoadmapLessons();
for (const result of roadmapLessons) {
  const outPath = path.join(OUT_DIR, `${result.id}.md`);
  fs.writeFileSync(outPath, result.content, 'utf8');
  console.log(`Saved (Roadmap): lessons/it/${result.id}.md`);
  allLessonSummaries.push({
    num: result.num,
    id: result.id,
    title: result.title,
    pathTitle: result.pathTitle,
    status: '📋 План курсу'
  });
}

if (summaryContent) {
  fs.writeFileSync(path.join(OUT_DIR, 'communication-basics-summary.md'), summaryContent, 'utf8');
  console.log('Saved: lessons/it/communication-basics-summary.md');
}

// 3. Generate README.md index
const readme = [];
readme.push('# 🇮🇹 Уроки італійської мови — Текстова база (Markdown)');
readme.push('');
readme.push('У цій папці зібрано всі уроки італійської мови, витягнуті з вихідного коду (JSON та i18n файлів). Вони відформатовані за принципом «один файл — один урок» для швидкого читання та перегляду без необхідності дивитися вихідний код.');
readme.push('');
readme.push('## 📚 Зміст та швидка навігація');
readme.push('');
readme.push('### Розділ 1: Основи спілкування (`communication-basics`)');
readme.push('');
readme.push('| № | Назва уроку | Файл | Статус у додатку |');
readme.push('|---|---|---|---|');
for (const l of allLessonSummaries.filter(x => x.pathTitle === 'Основи спілкування')) {
  readme.push(`| ${l.num} | ${l.title} | [${l.id}.md](./${l.id}.md) | ${l.status} |`);
}
readme.push(`| Підсумок | Підсумкове повторення курсу | [communication-basics-summary.md](./communication-basics-summary.md) | 🎯 Самоперевірка |`);
readme.push('');
readme.push('### Розділ 2: Правила читання (`italian-reading`)');
readme.push('');
readme.push('| № | Назва правила / уроку | Файл | Статус у додатку |');
readme.push('|---|---|---|---|');
for (const l of allLessonSummaries.filter(x => x.pathTitle === 'Правила читання')) {
  readme.push(`| ${l.num} | ${l.title} | [${l.id}.md](./${l.id}.md) | ${l.status} |`);
}
readme.push('');
readme.push('---');
readme.push('');
readme.push('## 🔄 Як оновити ці файли');
readme.push('');
readme.push('Якщо ви редагуєте або додаєте уроки в `courses/it/` чи `paid-content/courses/it/`, ви можете будь-коли повторно оновити Markdown-файли однією командою з кореня репозиторію:');
readme.push('');
readme.push('```bash');
readme.push('node scripts/extract-lessons-md.mjs');
readme.push('```');

fs.writeFileSync(path.join(OUT_DIR, 'README.md'), readme.join('\n'), 'utf8');
console.log('Saved index: lessons/it/README.md');
console.log(`Successfully extracted ${allLessonSummaries.length} lessons!`);
