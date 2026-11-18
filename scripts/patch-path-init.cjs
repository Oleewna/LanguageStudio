// Patch path.js: replace DOMContentLoaded init with localesReady-based init
const fs = require('fs');
const path = 'frontend/public/js/path.js';
let c = fs.readFileSync(path, 'utf8');

// Find the block starting at the DOMContentLoaded listener up to the sourceLanguageChanged listener
const startMarker = "document.addEventListener('DOMContentLoaded', async () => {";
const endMarker = "window.addEventListener('sourceLanguageChanged', () => {";

const startIdx = c.indexOf(startMarker);
const endIdx = c.indexOf(endMarker);

if (startIdx === -1 || endIdx === -1) {
  console.error('Markers not found!', 'start:', startIdx, 'end:', endIdx);
  process.exit(1);
}

const before = c.substring(0, startIdx);
const domBlock = c.substring(startIdx, endIdx); // the old DOMContentLoaded block

console.log('Replacing DOMContentLoaded block of', domBlock.length, 'chars');

const replacement = `async function initPathPage() {
  const courseId = typeof window.getCourseId === 'function' ? window.getCourseId() : 'it';

  try {
    if (typeof window.loadCourse === 'function') {
      window.__LS_COURSE_DATA = await window.loadCourse();
    }
  } catch (error) {
    console.warn('Could not load course data for paths:', error);
    const container = document.getElementById('pathContainer');
    const lang = getPathLanguage();
    if (container) {
      container.innerHTML = \`<p class="path-message" role="alert">\${lang === 'en' ? 'Learning paths could not be loaded. Please check your connection and try again.' : 'Не вдалося завантажити напрямки навчання. Перевірте з\u2019\u0454\u0434\u043d\u0430\u043d\u043d\u044f \u0442\u0430 \u0441\u043f\u0440\u043e\u0431\u0443\u0439\u0442\u0435 \u0449\u0435 \u0440\u0430\u0437.'}</p>\`;
    }
    return;
  }

  try {
    await loadEntitlements(courseId);
    if (!window.Progress || typeof window.Progress.list !== 'function') {
      throw new Error('Lesson progress is unavailable.');
    }
    pathProgressRecords = await window.Progress.list('lessonProgress', { courseId });
    renderCategories(pathProgressRecords);
  } catch (error) {
    console.error('Could not load learning path progress:', error);
    const container = document.getElementById('pathContainer');
    const lang = getPathLanguage();
    if (container) {
      container.innerHTML = \`<p class="path-message" role="alert">\${lang === 'en' ? 'Learning path completion could not be loaded. Please check your connection and try again.' : 'Не вдалося завантажити прогрес напрямків. Перевірте з\u2019\u0454\u0434\u043d\u0430\u043d\u043d\u044f \u0442\u0430 \u0441\u043f\u0440\u043e\u0431\u0443\u0439\u0442\u0435 \u0449\u0435 \u0440\u0430\u0437.'}</p>\`;
    }
  }
}

// Wait for localesReady (fired by app.js after all core modules initialise).
// This guarantees window.Progress, window.loadCourse, and window.getSourceLanguage are ready.
let _pathInited = false;
function _startPathOnce() {
  if (_pathInited) return;
  _pathInited = true;
  initPathPage();
}

window.addEventListener('localesReady', _startPathOnce, { once: true });

// Safety net: if localesReady never fires (locale fetch fails / offline),
// start after a short delay so the page is never permanently blank.
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => _startPathOnce(), 900);
});

`;

const after = c.substring(endIdx);
fs.writeFileSync(path, before + replacement + after, 'utf8');
console.log('Done. path.js patched successfully.');
