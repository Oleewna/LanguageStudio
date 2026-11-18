const fs = require('fs');
const path = 'frontend/public/pages/pricing.html';
let c = fs.readFileSync(path, 'utf8');

// The source file has a literal & (not &amp;) in the title and feature rows
const remaining = [
  [
    '<title>Pricing \u0026 Plans \u2014 LanguageStudio</title>',
    '<title data-i18n="pricing.pageTitle">Pricing \u0026 Plans \u2014 LanguageStudio</title>'
  ],
  [
    '<span id="feat2">Interactive dialogues \u0026 native audio</span>',
    '<span id="feat2" data-i18n="pricing.starterFeat2">Interactive dialogues \u0026 native audio</span>'
  ],
  [
    '<span id="proFeat2">Full vocabulary trainer \u0026 spaced repetition</span>',
    '<span id="proFeat2" data-i18n="pricing.proFeat2">Full vocabulary trainer \u0026 spaced repetition</span>'
  ],
  [
    '<span id="proFeat4">Interactive quizzes, audio \u0026 story texts</span>',
    '<span id="proFeat4" data-i18n="pricing.proFeat4">Interactive quizzes, audio \u0026 story texts</span>'
  ],
];

let count = 0;
for (const [from, to] of remaining) {
  if (c.includes(from)) { c = c.split(from).join(to); count++; }
  else console.log('NOT FOUND:', from.substring(0, 70));
}
fs.writeFileSync(path, c, 'utf8');
console.log('Applied', count, '/', remaining.length, 'remaining patches to pricing.html');
