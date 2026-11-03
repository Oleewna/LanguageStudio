#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const dbPath = path.join(repoRoot, 'backend', 'service', 'data', 'vocab.db');

const args = process.argv.slice(2);
const fileIndex = args.findIndex((arg) => !arg.startsWith('-'));
const csvPathArg = fileIndex >= 0 ? args[fileIndex] : null;
const dryRun = args.includes('--dry-run');
const requireListArg = (args.find((arg) => arg.startsWith('--require=')) || '--require=uk,en').slice('--require='.length);
const requireLanguages = requireListArg.split(',').map((value) => value.trim()).filter(Boolean);

function normalizeText(value = '') {
  return String(value || '')
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function detectDelimiter(sample) {
  const lines = sample.split(/\r?\n/).filter((line) => line.trim());
  const candidates = [';', ',', '\t'];
  const scored = candidates.map((delimiter) => {
    const counts = lines.map((line) => (line.match(new RegExp(delimiter.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length);
    const length = counts.reduce((sum, count) => sum + count, 0);
    return { delimiter, length };
  });
  const winner = scored.sort((left, right) => right.length - left.length)[0];
  return winner && winner.length > 0 ? winner.delimiter : ',';
}

function parseCsvText(text) {
  const rows = [];
  let current = [];
  let value = '';
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const nextChar = text[index + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        value += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === ',' && !inQuotes) {
      current.push(value);
      value = '';
      continue;
    }

    if ((char === ';' || char === '\t') && !inQuotes) {
      current.push(value);
      value = '';
      continue;
    }

    if (char === '\n' && !inQuotes) {
      current.push(value);
      rows.push(current);
      current = [];
      value = '';
      continue;
    }

    if (char === '\r' && !inQuotes) {
      if (nextChar === '\n') {
        index += 1;
      }
      current.push(value);
      rows.push(current);
      current = [];
      value = '';
      continue;
    }

    value += char;
  }

  if (value.length || current.length) {
    current.push(value);
    rows.push(current);
  }

  return rows.filter((row) => row.some((cell) => String(cell).trim() !== ''));
}

function recordValue(row, key, fallback = '') {
  if (!Object.prototype.hasOwnProperty.call(row, key)) return fallback;
  return String(row[key] ?? fallback).trim();
}

function parseCsvFile(filePath) {
  const source = fs.readFileSync(filePath, 'utf8');
  const bomFree = source.replace(/^\uFEFF/, '');
  const rows = parseCsvText(bomFree);
  if (!rows.length) {
    throw new Error('CSV file is empty.');
  }

  const firstLine = rows[0];
  const delimiter = detectDelimiter(bomFree);
  const normalizedRows = rows.map((row) => row.map((cell) => cell.replace(/\r/g, '')));
  const header = normalizedRows[0].map((heading) => heading.trim());
  const dataRows = normalizedRows.slice(1);

  const entries = dataRows.map((values, rowIndex) => {
    const entry = {};
    header.forEach((key, index) => {
      entry[key] = values[index] ?? '';
    });
    entry.__rowNumber = rowIndex + 2;
    return entry;
  });

  if (!header.length) {
    throw new Error('CSV file has no header row.');
  }

  if (delimiter && delimiter !== ',') {
    // Re-parse with detected delimiter for consistent field separation on Excel exports.
    const fallback = parseCsvText(bomFree.replace(/;/g, delimiter));
    if (fallback.length > 1) {
      return { header: fallback[0], entries: fallback.slice(1).map((values, index) => ({ __rowNumber: index + 2, ...Object.fromEntries(fallback[0].map((key, idx) => [key, values[idx] ?? ''])) })) };
    }
  }

  return { header, entries };
}

function ensureLanguage(database, languageCode, nameNative = languageCode) {
  const existing = database.prepare('SELECT code FROM languages WHERE code = ?').get(languageCode);
  if (existing) return;
  database.prepare('INSERT INTO languages(code, name_native, is_target, is_interface) VALUES (?, ?, 0, 1)').run(languageCode, nameNative || languageCode);
}

function insertWord(database, row, transactionStats) {
  const wordId = String(row.id || '').trim();
  const langCode = String(row.lang || '').trim();
  const wordText = String(row.word || '').trim();
  const lessonValue = String(row.lesson || '').trim();
  const lessonIds = lessonValue ? lessonValue.split('|').map((entry) => entry.trim()).filter(Boolean) : [];
  const pathValue = String(row.path || '').trim();
  const topicValue = String(row.topic || '').trim();
  const categoryValue = String(row.category || '').trim();
  const typeValue = String(row.type || '').trim();
  const now = new Date().toISOString();
  const translations = {};
  const phonetics = {};
  const examples = [];

  Object.entries(row).forEach(([key, value]) => {
    if (key.startsWith('trans_')) {
      const code = key.replace(/^trans_/, '').trim();
      const text = String(value || '').trim();
      if (code && text) translations[code] = text;
    }
    if (key.startsWith('phon_')) {
      const code = key.replace(/^phon_/, '').trim();
      const text = String(value || '').trim();
      if (code && text) phonetics[code] = text;
    }
  });

  const exampleKeys = [...new Set(Object.keys(row).filter((key) => /^ex\d+_text$/.test(key)))].sort((left, right) => {
    const leftIndex = Number(left.match(/^(?:ex)(\d+)_text$/)[1]);
    const rightIndex = Number(right.match(/^(?:ex)(\d+)_text$/)[1]);
    return leftIndex - rightIndex;
  });

  exampleKeys.forEach((key) => {
    const index = Number(key.match(/^(?:ex)(\d+)_text$/)[1]);
    const text = String(row[key] || '').trim();
    if (!text) return;
    const entry = { position: index, text, trans: {} };
    Object.entries(row).forEach(([translationKey, translationValue]) => {
      const match = translationKey.match(new RegExp(`^ex${index}_trans_([^]+)$`));
      if (!match) return;
      const code = match[1];
      const textValue = String(translationValue || '').trim();
      if (code && textValue) entry.trans[code] = textValue;
    });
    examples.push(entry);
  });

  const previous = database.prepare('SELECT id FROM words WHERE id = ?').get(wordId);
  const searchText = [
    wordText,
    langCode,
    ...lessonIds,
    pathValue,
    topicValue,
    categoryValue,
    typeValue,
    ...Object.values(translations),
    ...Object.values(phonetics),
    ...examples.map((example) => example.text),
    ...examples.flatMap((example) => Object.values(example.trans))
  ].join(' ');

  database.prepare(`
    INSERT INTO words(id, lang_code, word, lesson, path, topic, category, type, created_at, updated_at, normalized_search)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'), ?)
    ON CONFLICT(id) DO UPDATE SET
      lang_code = excluded.lang_code,
      word = excluded.word,
      lesson = excluded.lesson,
      path = excluded.path,
      topic = excluded.topic,
      category = excluded.category,
      type = excluded.type,
      updated_at = datetime('now'),
      normalized_search = excluded.normalized_search
  `).run(wordId, langCode, wordText, lessonIds[0] || '', pathValue, topicValue, categoryValue, typeValue, normalizeText(searchText));

  database.prepare('DELETE FROM word_lessons WHERE word_id = ?').run(wordId);
  if (lessonIds.length) {
    const lessonInsert = database.prepare('INSERT INTO word_lessons(word_id, lesson_id) VALUES (?, ?)');
    lessonIds.forEach((lessonId) => lessonInsert.run(wordId, lessonId));
  }

  database.prepare('DELETE FROM word_translations WHERE word_id = ?').run(wordId);
  if (Object.keys(translations).length) {
    const insertTranslation = database.prepare('INSERT INTO word_translations(word_id, lang_code, text) VALUES (?, ?, ?)');
    Object.entries(translations).forEach(([code, text]) => insertTranslation.run(wordId, code, text));
  }

  database.prepare('DELETE FROM word_phonetics WHERE word_id = ?').run(wordId);
  if (Object.keys(phonetics).length) {
    const insertPhonetics = database.prepare('INSERT INTO word_phonetics(word_id, lang_code, text) VALUES (?, ?, ?)');
    Object.entries(phonetics).forEach(([code, text]) => insertPhonetics.run(wordId, code, text));
  }

  database.prepare('DELETE FROM examples WHERE word_id = ?').run(wordId);
  if (examples.length) {
    const insertExample = database.prepare('INSERT INTO examples(word_id, position, text) VALUES (?, ?, ?)');
    const exampleIds = [];
    examples.forEach((example) => {
      const result = insertExample.run(wordId, example.position, example.text);
      exampleIds.push(result.lastInsertRowid);
    });

    const insertExampleTranslation = database.prepare('INSERT INTO example_translations(example_id, lang_code, text) VALUES (?, ?, ?)');
    examples.forEach((example, index) => {
      Object.entries(example.trans || {}).forEach(([code, text]) => {
        insertExampleTranslation.run(exampleIds[index], code, text);
      });
    });
  }

  transactionStats[previous ? 'updated' : 'inserted'] += 1;
}

function main() {
  if (!csvPathArg) {
    console.error('Usage: node scripts/import-vocab.mjs path/to/file.csv [--dry-run] [--require=uk,en]');
    process.exit(1);
  }

  const csvPath = path.resolve(repoRoot, csvPathArg);
  if (!fs.existsSync(csvPath)) {
    console.error(`CSV file not found: ${csvPath}`);
    process.exit(1);
  }

  const database = new Database(dbPath);
  database.pragma('foreign_keys = ON');
  const schema = fs.readFileSync(path.join(repoRoot, 'backend', 'service', 'src', 'db', 'schema.sql'), 'utf8');
  database.exec(schema);

  try {
    const { header, entries } = parseCsvFile(csvPath);
    const requiredFields = ['id', 'lang', 'word', 'lesson', 'path', 'topic', 'category', 'type'];
    const missingRequired = requiredFields.filter((field) => !header.includes(field));
    if (missingRequired.length) {
      throw new Error(`Missing required CSV columns: ${missingRequired.join(', ')}`);
    }

    const seenIds = new Map();
    const errors = [];
    const stats = { inserted: 0, updated: 0, skipped: 0 };

    const languageCodes = new Set(['it', 'es', 'uk', 'en']);
    const activeLangs = database.prepare('SELECT code FROM languages').all().map((language) => language.code);
    activeLangs.forEach((languageCode) => languageCodes.add(languageCode));

    for (const headerKey of header) {
      if (headerKey.startsWith('trans_')) {
        const code = headerKey.slice('trans_'.length).trim();
        if (code && !languageCodes.has(code)) {
          ensureLanguage(database, code, code);
          languageCodes.add(code);
          console.log(`Auto-created interface language: ${code}`);
        }
      }
    }

    for (const entry of entries) {
      const rowNumber = entry.__rowNumber || 0;
      const row = { ...entry };
      delete row.__rowNumber;

      const id = String(row.id || '').trim();
      const lang = String(row.lang || '').trim();
      const word = String(row.word || '').trim();
      if (!id || !lang || !word) {
        errors.push({ rowNumber, message: 'Missing required id/lang/word values.' });
        continue;
      }

      if (seenIds.has(id)) {
        errors.push({ rowNumber, message: `Duplicate id in file: ${id}` });
        continue;
      }
      seenIds.set(id, true);

      if (!languageCodes.has(lang)) {
        errors.push({ rowNumber, message: `Unknown language code: ${lang}` });
        continue;
      }

      const missingRequiredTranslations = requireLanguages.filter((requiredLanguage) => {
        const value = String(row[`trans_${requiredLanguage}`] || '').trim();
        return !value;
      });
      if (missingRequiredTranslations.length) {
        errors.push({ rowNumber, message: `Missing required translation(s): ${missingRequiredTranslations.join(', ')}` });
        continue;
      }

      const allowedRows = Object.keys(row).filter((key) => key && key.trim());
      const hasAnyData = allowedRows.length > 0 && (header.some((headerCell) => headerCell && String(row[headerCell] || '').trim()));
      if (!hasAnyData) {
        stats.skipped += 1;
        continue;
      }

      if (!dryRun) {
        database.transaction(() => insertWord(database, row, stats))();
      } else {
        const existing = database.prepare('SELECT id FROM words WHERE id = ?').get(id);
        stats[existing ? 'updated' : 'inserted'] += 1;
      }
    }

    if (dryRun) {
      console.log(`Dry run: ${stats.inserted} insert(s), ${stats.updated} update(s), ${stats.skipped} skipped.`);
    } else {
      console.log(`Imported: ${stats.inserted} insert(s), ${stats.updated} update(s), ${stats.skipped} skipped.`);
    }

    if (errors.length) {
      console.error(`Errors (${errors.length}):`);
      errors.forEach((error) => console.error(`Row ${error.rowNumber}: ${error.message}`));
      process.exitCode = 1;
    }
  } finally {
    database.close();
  }
}

main();
