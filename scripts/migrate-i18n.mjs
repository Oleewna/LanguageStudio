#!/usr/bin/env node

/**
 * Migration script: migrate-i18n.mjs
 * Converts existing inline {uk, en} localization into:
 *  1. Base course files holding ONLY target-language content + stable ids with neutral `text` fields.
 *  2. Separate translation files in courses/<id>/i18n/<locale>/<relative path>.json.
 * 
 * Supports --dry-run flag and is completely idempotent.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const coursesDir = path.join(projectRoot, 'courses');

const isDryRun = process.argv.includes('--dry-run');
const LOCALES = ['uk', 'en'];

function readJsonSafe(filePath) {
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (err) {
    return null;
  }
}

function writeJson(filePath, data) {
  if (isDryRun) {
    console.log(`[DRY-RUN] Would write ${path.relative(projectRoot, filePath)}`);
    return;
  }
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
  console.log(`Wrote ${path.relative(projectRoot, filePath)}`);
}

function isLocalizedObject(obj) {
  return obj && typeof obj === 'object' && !Array.isArray(obj) && ('uk' in obj || 'en' in obj);
}

function getLocalized(obj, locale, fallback = '') {
  if (!obj) return fallback;
  if (typeof obj === 'string') return obj;
  if (isLocalizedObject(obj)) {
    return obj[locale] || obj.en || obj.uk || fallback;
  }
  return fallback;
}

/**
 * Migrate course.json
 */
function migrateCourseJson(courseId) {
  const coursePath = path.join(coursesDir, courseId, 'course.json');
  if (!fs.existsSync(coursePath)) return;

  const raw = readJsonSafe(coursePath);
  if (!raw) return;

  const targetCode = raw.target?.code || courseId;
  const tts = raw.target?.tts || raw.tts || (targetCode === 'it' ? 'it-IT' : `${targetCode}-${targetCode.toUpperCase()}`);
  const script = raw.target?.script || raw.script || 'latin';
  const rtl = raw.target?.rtl ?? raw.rtl ?? false;
  const availableLocales = Array.isArray(raw.availableLocales) ? raw.availableLocales : [...LOCALES];

  LOCALES.forEach(locale => {
    const localePath = path.join(coursesDir, courseId, 'i18n', locale, 'course.json');
    const existing = readJsonSafe(localePath) || {};

    const i18n = {
      tagline: getLocalized(raw.tagline, locale) || existing.tagline || '',
      target: {
        name: getLocalized(raw.target?.name, locale) || existing.target?.name || ''
      },
      exerciseCategories: existing.exerciseCategories || {},
      paths: existing.paths || {},
      units: existing.units || {},
      lessons: existing.lessons || {}
    };

    if (Array.isArray(raw.exerciseCategories)) {
      raw.exerciseCategories.forEach(cat => {
        if (cat.id) {
          i18n.exerciseCategories[cat.id] = {
            name: getLocalized(cat.name, locale) || existing.exerciseCategories?.[cat.id]?.name || ''
          };
        }
      });
    }

    if (Array.isArray(raw.paths)) {
      raw.paths.forEach(p => {
        if (p.id) {
          i18n.paths[p.id] = {
            title: getLocalized(p.title, locale) || existing.paths?.[p.id]?.title || '',
            subtitle: getLocalized(p.subtitle, locale) || existing.paths?.[p.id]?.subtitle || ''
          };
        }
        if (Array.isArray(p.units)) {
          p.units.forEach(u => {
            if (u.id) {
              i18n.units[u.id] = {
                title: getLocalized(u.title, locale) || existing.units?.[u.id]?.title || ''
              };
            }
            if (Array.isArray(u.lessons)) {
              u.lessons.forEach(l => {
                if (l.id) {
                  i18n.lessons[l.id] = {
                    num: getLocalized(l.num, locale) || existing.lessons?.[l.id]?.num || '',
                    title: getLocalized(l.title, locale) || existing.lessons?.[l.id]?.title || '',
                    description: getLocalized(l.description, locale) || existing.lessons?.[l.id]?.description || '',
                    time: getLocalized(l.time, locale) || existing.lessons?.[l.id]?.time || ''
                  };
                }
              });
            }
          });
        }
      });
    }

    writeJson(localePath, i18n);
  });

  // Base course.json
  const base = {
    ...raw,
    id: courseId,
    target: {
      ...raw.target,
      code: targetCode,
      tts,
      script,
      rtl
    },
    tts,
    script,
    rtl,
    availableLocales
  };

  if (isLocalizedObject(base.tagline)) {
    base.tagline = base.tagline.en || base.tagline.uk || '';
  }
  if (base.target && isLocalizedObject(base.target.name)) {
    base.target.name = base.target.name.en || base.target.name.uk || '';
  }

  writeJson(coursePath, base);
}

/**
 * Migrate vocab.json
 */
function migrateVocabJson(courseId) {
  const vocabPath = path.join(coursesDir, courseId, 'vocab.json');
  if (!fs.existsSync(vocabPath)) return;

  const raw = readJsonSafe(vocabPath);
  if (!Array.isArray(raw)) return;

  LOCALES.forEach(locale => {
    const localePath = path.join(coursesDir, courseId, 'i18n', locale, 'vocab.json');
    const existing = readJsonSafe(localePath) || {};
    const i18n = { ...existing };

    raw.forEach(item => {
      const wordId = item.id;
      const trans = getLocalized(item.trans, locale) || existing[wordId]?.trans || '';
      const pronunciation = getLocalized(item.pronunciation || item.phon, locale) || existing[wordId]?.pronunciation || '';
      const exTrans = (item.example?.trans ? getLocalized(item.example.trans, locale) : '') || existing[wordId]?.example?.trans || '';

      i18n[wordId] = {
        trans,
        pronunciation,
        ...(exTrans ? { example: { trans: exTrans } } : {})
      };
    });

    writeJson(localePath, i18n);
  });

  const base = raw.map(item => {
    const wordText = item.text || item.word || item[courseId] || '';
    return {
      id: item.id,
      text: wordText,
      word: wordText,
      [courseId]: wordText,
      ...(item.example?.text ? { example: { text: item.example.text } } : {}),
      lesson: item.lesson,
      path: item.path,
      topic: item.topic,
      category: item.category,
      type: item.type
    };
  });

  writeJson(vocabPath, base);
}

/**
 * Migrate exercises.json
 */
function migrateExercisesJson(courseId) {
  const exercisesPath = path.join(coursesDir, courseId, 'exercises.json');
  if (!fs.existsSync(exercisesPath)) return;

  const raw = readJsonSafe(exercisesPath);
  if (!Array.isArray(raw)) return;

  LOCALES.forEach(locale => {
    const localePath = path.join(coursesDir, courseId, 'i18n', locale, 'exercises.json');
    const existing = readJsonSafe(localePath) || {};
    const i18n = { ...existing };

    raw.forEach(ex => {
      const exId = ex.id;
      const prev = existing[exId] || {};
      const entry = { ...prev };

      if (ex.question) entry.question = getLocalized(ex.question, locale) || prev.question || '';
      if (ex.explanation) entry.explanation = getLocalized(ex.explanation, locale) || prev.explanation || '';
      if (ex.hint) entry.hint = getLocalized(ex.hint, locale) || prev.hint || '';
      if (ex.clue) entry.clue = getLocalized(ex.clue, locale) || prev.clue || '';
      if (ex.instruction) entry.instruction = getLocalized(ex.instruction, locale) || prev.instruction || '';
      if (ex.title) entry.title = getLocalized(ex.title, locale) || prev.title || '';

      if (Array.isArray(ex.options)) {
        const localizedOptions = ex.options.map(opt => ({
          text: getLocalized(opt.text, locale)
        }));
        if (localizedOptions.some(opt => opt.text)) {
          entry.options = localizedOptions;
        }
      }

      if (Array.isArray(ex.pairs)) {
        entry.pairs = entry.pairs || {};
        ex.pairs.forEach((pair, idx) => {
          const pairId = pair.id || `m${idx + 1}`;
          entry.pairs[pairId] = {
            trans: getLocalized(pair.trans, locale) || prev.pairs?.[pairId]?.trans || ''
          };
        });
      }

      i18n[exId] = entry;
    });

    writeJson(localePath, i18n);
  });

  const base = raw.map(ex => {
    const baseEx = {
      id: ex.id,
      format: ex.format,
      category: ex.category,
      ...(ex.pathId ? { pathId: ex.pathId } : {}),
      ...(ex.lessonId ? { lessonId: ex.lessonId } : {}),
      ...(ex.audioWord ? { audioWord: ex.audioWord } : {}),
      ...(ex.lineA ? { lineA: ex.lineA } : {}),
      ...(ex.words ? { words: ex.words } : {}),
      ...(ex.answers ? { answers: ex.answers } : {}),
      ...(typeof ex.xp === 'number' ? { xp: ex.xp } : {})
    };

    if (Array.isArray(ex.options)) {
      baseEx.options = ex.options.map((opt, idx) => {
        const optText = typeof opt.text === 'string' ? opt.text : (opt.text?.[courseId] || '');
        return {
          id: opt.id || `opt-${idx + 1}`,
          ...(optText ? { text: optText } : {}),
          correct: Boolean(opt.correct)
        };
      });
    }

    if (Array.isArray(ex.pairs)) {
      baseEx.pairs = ex.pairs.map((pair, idx) => {
        const pairId = pair.id || `m${idx + 1}`;
        const pairText = pair.text || pair[courseId] || pair.word || '';
        return {
          id: pairId,
          text: pairText,
          [courseId]: pairText
        };
      });
    }

    return baseEx;
  });

  writeJson(exercisesPath, base);
}

/**
 * Migrate grammar.json
 */
function migrateGrammarJson(courseId) {
  const grammarPath = path.join(coursesDir, courseId, 'grammar.json');
  if (!fs.existsSync(grammarPath)) return;

  const raw = readJsonSafe(grammarPath);
  if (!raw) return;
  const topics = Array.isArray(raw.topics) ? raw.topics : [];

  LOCALES.forEach(locale => {
    const localePath = path.join(coursesDir, courseId, 'i18n', locale, 'grammar.json');
    const existing = readJsonSafe(localePath) || {};
    const i18n = { ...existing };

    topics.forEach(topic => {
      const topicId = topic.id;
      const prevTopic = existing[topicId] || {};
      const topicI18n = {
        title: getLocalized(topic.title, locale) || prevTopic.title || '',
        blocks: prevTopic.blocks || {}
      };

      (topic.blocks || []).forEach((block, bIdx) => {
        const blockId = block.id || `${topicId}-block-${bIdx + 1}`;
        const prevBlock = topicI18n.blocks[blockId] || {};
        const blockI18n = { ...prevBlock };

        if (block.title) blockI18n.title = getLocalized(block.title, locale) || prevBlock.title || '';
        if (block.text) blockI18n.text = getLocalized(block.text, locale) || prevBlock.text || '';

        if (block.type === 'table') {
          if (Array.isArray(block.head)) {
            blockI18n.head = block.head.map(h => isLocalizedObject(h) ? getLocalized(h, locale) : h);
          }
          if (Array.isArray(block.rows)) {
            blockI18n.rows = block.rows.map(row =>
              row.map(cell => isLocalizedObject(cell) ? getLocalized(cell, locale) : cell)
            );
          }
        }

        if (block.type === 'examples' && Array.isArray(block.items)) {
          blockI18n.items = blockI18n.items || {};
          block.items.forEach((item, itemIdx) => {
            const itemId = item.id || `ex-${itemIdx + 1}`;
            blockI18n.items[itemId] = {
              trans: getLocalized(item.trans, locale) || prevBlock.items?.[itemId]?.trans || ''
            };
          });
        }

        if (block.type === 'rules' && Array.isArray(block.items)) {
          blockI18n.items = blockI18n.items || {};
          block.items.forEach((item, itemIdx) => {
            const itemId = item.id || `rule-${itemIdx + 1}`;
            blockI18n.items[itemId] = {
              title: getLocalized(item.title, locale) || prevBlock.items?.[itemId]?.title || '',
              text: getLocalized(item.text, locale) || prevBlock.items?.[itemId]?.text || ''
            };
          });
        }

        topicI18n.blocks[blockId] = blockI18n;
      });

      i18n[topicId] = topicI18n;
    });

    writeJson(localePath, i18n);
  });

  const baseTopics = topics.map(topic => {
    const topicId = topic.id;
    const baseBlocks = (topic.blocks || []).map((block, bIdx) => {
      const blockId = block.id || `${topicId}-block-${bIdx + 1}`;
      const baseBlock = {
        id: blockId,
        type: block.type,
        ...(block.icon ? { icon: block.icon } : {})
      };

      if (block.type === 'table') {
        baseBlock.head = (block.head || []).map(h => isLocalizedObject(h) ? '' : h);
        baseBlock.rows = (block.rows || []).map(row =>
          row.map(cell => isLocalizedObject(cell) ? '' : cell)
        );
      }

      if (block.type === 'examples' && Array.isArray(block.items)) {
        baseBlock.items = block.items.map((item, itemIdx) => {
          const itemText = item.text || item[courseId] || '';
          return {
            id: item.id || `ex-${itemIdx + 1}`,
            text: itemText,
            [courseId]: itemText
          };
        });
      }

      if (block.type === 'rules' && Array.isArray(block.items)) {
        baseBlock.items = block.items.map((item, itemIdx) => ({
          id: item.id || `rule-${itemIdx + 1}`
        }));
      }

      return baseBlock;
    });

    return {
      id: topicId,
      icon: topic.icon,
      blocks: baseBlocks
    };
  });

  writeJson(grammarPath, { topics: baseTopics });
}

/**
 * Migrate lessons/<lessonId>.json
 */
function migrateLessons(courseId) {
  const lessonsDir = path.join(coursesDir, courseId, 'lessons');
  if (!fs.existsSync(lessonsDir)) return;

  const files = fs.readdirSync(lessonsDir).filter(f => f.endsWith('.json'));

  files.forEach(fileName => {
    const lessonPath = path.join(lessonsDir, fileName);
    const raw = readJsonSafe(lessonPath);
    if (!raw) return;
    const lessonId = raw.id || fileName.replace(/\.json$/, '');

    LOCALES.forEach(locale => {
      const localePath = path.join(coursesDir, courseId, 'i18n', locale, 'lessons', fileName);
      const existing = readJsonSafe(localePath) || {};
      const i18n = { ...existing };

      const prevLesson = existing[lessonId] || {};
      i18n[lessonId] = {
        title: getLocalized(raw.title, locale) || prevLesson.title || '',
        subtitle: getLocalized(raw.subtitle, locale) || prevLesson.subtitle || '',
        description: getLocalized(raw.description, locale) || prevLesson.description || '',
        duration: getLocalized(raw.duration, locale) || prevLesson.duration || ''
      };

      let lineCounter = 1;
      let vocabCounter = 1;
      let takeawayCounter = 1;
      let paraCounter = 1;
      let blockCounter = 1;

      (raw.blocks || []).forEach(block => {
        const blockId = block.id || `${block.type}-${blockCounter++}`;
        const prevBlock = existing[blockId] || {};

        i18n[blockId] = {
          title: getLocalized(block.title, locale) || prevBlock.title || '',
          ...((block.story || prevBlock.story) ? { story: getLocalized(block.story, locale) || prevBlock.story || '' } : {})
        };

        if (block.type === 'dialogue') {
          (block.lines || []).forEach(line => {
            const lineId = line.id || `line-${lineCounter++}`;
            const prevLine = existing[lineId] || {};
            i18n[lineId] = {
              trans: getLocalized(line.trans || line.translations, locale) || prevLine.trans || '',
              pronunciation: getLocalized(line.pronunciation || line.phon, locale) || prevLine.pronunciation || ''
            };
          });
        }

        if (block.type === 'vocab') {
          (block.items || []).forEach(item => {
            const itemId = item.id || `v-${vocabCounter++}`;
            const prevItem = existing[itemId] || {};
            i18n[itemId] = {
              trans: getLocalized(item.translations || item.trans, locale) || prevItem.trans || '',
              pronunciation: getLocalized(item.pronunciation || item.phon, locale) || prevItem.pronunciation || ''
            };
          });
        }

        if (block.type === 'culture' || block.type === 'culture_note') {
          (block.paragraphs || []).forEach(para => {
            const paraId = para.id || `p-${paraCounter++}`;
            const prevPara = existing[paraId] || {};
            const textVal = isLocalizedObject(para)
              ? getLocalized(para, locale)
              : (para?.text ? getLocalized(para.text, locale) : (typeof para === 'string' ? para : prevPara.text || ''));

            i18n[paraId] = {
              text: textVal || prevPara.text || ''
            };
          });
        }

        if (block.type === 'takeaways') {
          (block.items || []).map(item => {
            const takeawayId = item.id || `t-${takeawayCounter++}`;
            const prevTakeaway = existing[takeawayId] || {};
            const textVal = isLocalizedObject(item)
              ? getLocalized(item, locale)
              : (item?.text ? getLocalized(item.text, locale) : (typeof item === 'string' ? item : prevTakeaway.text || ''));

            i18n[takeawayId] = {
              text: textVal || prevTakeaway.text || ''
            };
          });
        }

        if (block.type === 'tasks' || block.type === 'quiz') {
          (block.items || block.tasks || []).forEach((task, tIdx) => {
            const taskId = task.id || `task-${tIdx + 1}`;
            const prevTask = existing[taskId] || {};
            const taskI18n = {
              question: getLocalized(task.q || task.question, locale) || prevTask.question || '',
              ...((task.explanation || prevTask.explanation) ? { explanation: getLocalized(task.explanation, locale) || prevTask.explanation || '' } : {})
            };

            if (Array.isArray(task.options)) {
              const optTexts = prevTask.options ? { ...prevTask.options } : {};
              task.options.forEach((opt, oIdx) => {
                const optId = opt.id || `opt-${oIdx + 1}`;
                if (isLocalizedObject(opt.text)) {
                  optTexts[optId] = getLocalized(opt.text, locale);
                }
              });
              if (Object.keys(optTexts).length) {
                taskI18n.options = optTexts;
              }
            }

            i18n[taskId] = taskI18n;
          });
        }
      });

      writeJson(localePath, i18n);
    });

    let lineCounter = 1;
    let vocabCounter = 1;
    let takeawayCounter = 1;
    let paraCounter = 1;
    let blockCounter = 1;

    const baseBlocks = (raw.blocks || []).map(block => {
      const blockId = block.id || `${block.type}-${blockCounter++}`;

      if (block.type === 'dialogue') {
        const lines = (block.lines || []).map(line => {
          const lineId = line.id || `line-${lineCounter++}`;
          const lineText = line.text || line[courseId] || '';
          return {
            id: lineId,
            speaker: line.speaker || 'Speaker',
            avatar: line.avatar || (line.speaker || 'U').charAt(0).toUpperCase(),
            text: lineText,
            [courseId]: lineText,
            audio: line.audio !== false
          };
        });

        return {
          id: blockId,
          type: 'dialogue',
          lines
        };
      }

      if (block.type === 'vocab') {
        const items = (block.items || []).map(item => {
          const itemId = item.id || `v-${vocabCounter++}`;
          const itemText = item.text || item[courseId] || item.word || '';
          return {
            id: itemId,
            text: itemText,
            [courseId]: itemText
          };
        });

        return {
          id: blockId,
          type: 'vocab',
          items
        };
      }

      if (block.type === 'culture' || block.type === 'culture_note') {
        const paragraphs = (block.paragraphs || []).map(para => {
          const paraId = para.id || `p-${paraCounter++}`;
          return { id: paraId };
        });

        return {
          id: blockId,
          type: 'culture',
          paragraphs
        };
      }

      if (block.type === 'takeaways') {
        const items = (block.items || []).map(item => {
          const takeawayId = item.id || `t-${takeawayCounter++}`;
          return { id: takeawayId };
        });

        return {
          id: blockId,
          type: 'takeaways',
          items
        };
      }

      if (block.type === 'tasks' || block.type === 'quiz') {
        const items = (block.items || block.tasks || []).map((task, tIdx) => {
          const taskId = task.id || `task-${tIdx + 1}`;
          const baseTask = {
            id: taskId,
            kind: task.kind || task.type || 'choice',
            ...(task.category ? { category: task.category } : {})
          };

          if (Array.isArray(task.options)) {
            baseTask.options = task.options.map((opt, oIdx) => {
              const optId = opt.id || `opt-${oIdx + 1}`;
              const optText = isLocalizedObject(opt.text)
                ? (opt.text[courseId] || '')
                : (typeof opt.text === 'string' ? opt.text : '');
              return {
                id: optId,
                ...(optText ? { text: optText } : {}),
                correct: Boolean(opt.correct)
              };
            });
          }

          return baseTask;
        });

        return {
          id: blockId,
          type: 'tasks',
          items
        };
      }

      return block;
    });

    const baseLesson = {
      id: lessonId,
      ...(raw.xpReward ? { xpReward: raw.xpReward } : {}),
      ...(raw.nextLessonId !== undefined ? { nextLessonId: raw.nextLessonId } : {}),
      ...(raw.prevLessonId !== undefined ? { prevLessonId: raw.prevLessonId } : {}),
      blocks: baseBlocks
    };

    writeJson(lessonPath, baseLesson);
  });
}

function migrateCourse(courseId) {
  console.log(`\n=== Migrating course: ${courseId} ===`);
  migrateCourseJson(courseId);
  migrateVocabJson(courseId);
  migrateExercisesJson(courseId);
  migrateGrammarJson(courseId);
  migrateLessons(courseId);
}

function main() {
  const courses = ['it', 'es'].filter(id => fs.existsSync(path.join(coursesDir, id)));
  for (const courseId of courses) {
    migrateCourse(courseId);
  }
  console.log(`\nMigration completed${isDryRun ? ' (dry-run)' : ''}.`);
}

main();
