const fs = require('fs');

// ── pricing.html ─────────────────────────────────────────────────────────────
const pricingPath = 'frontend/public/pages/pricing.html';
let c = fs.readFileSync(pricingPath, 'utf8');

const patches = [
  ['<title>Pricing &amp; Plans \u2014 LanguageStudio</title>',
   '<title data-i18n="pricing.pageTitle">Pricing &amp; Plans \u2014 LanguageStudio</title>'],
  ['<p class="eyebrow" id="courseSubtitle">LanguageStudio Courses</p>',
   '<p class="eyebrow" id="courseSubtitle" data-i18n="pricing.courseSubtitle">LanguageStudio Courses</p>'],
  ['<h1 id="pricingHeading">Choose your learning plan</h1>',
   '<h1 id="pricingHeading" data-i18n="pricing.heroTitle">Choose your learning plan</h1>'],
  ['<p id="pricingSubheading">Start for free with introductory lessons, or upgrade once for unlimited lifetime access. No subscriptions or hidden fees.</p>',
   '<p id="pricingSubheading" data-i18n="pricing.heroDesc">Start for free with introductory lessons, or upgrade once for unlimited lifetime access. No subscriptions or hidden fees.</p>'],
  ['<span data-icon="sparkles"></span> Recommended Plan',
   '<span data-icon="sparkles"></span> <span data-i18n="pricing.recPlan">Recommended Plan</span>'],
  ['<div class="pricing-plan-title" id="starterTitle">Free Starter</div>',
   '<div class="pricing-plan-title" id="starterTitle" data-i18n="pricing.starterTitle">Free Starter</div>'],
  ['<div class="pricing-plan-desc" id="starterDesc">Try introductory lessons and essential vocabulary at zero cost.</div>',
   '<div class="pricing-plan-desc" id="starterDesc" data-i18n="pricing.starterDesc">Try introductory lessons and essential vocabulary at zero cost.</div>'],
  ['<span class="period">forever</span>',
   '<span class="period" data-i18n="pricing.starterPricePeriod">forever</span>'],
  ['<span id="feat1">First lesson and basics included</span>',
   '<span id="feat1" data-i18n="pricing.starterFeat1">First lesson and basics included</span>'],
  ['<span id="feat2">Interactive dialogues &amp; native audio</span>',
   '<span id="feat2" data-i18n="pricing.starterFeat2">Interactive dialogues &amp; native audio</span>'],
  ['<span id="feat3">Basic vocabulary word bank</span>',
   '<span id="feat3" data-i18n="pricing.starterFeat3">Basic vocabulary word bank</span>'],
  ['<span id="feat4">Progress synchronization</span>',
   '<span id="feat4" data-i18n="pricing.starterFeat4">Progress synchronization</span>'],
  ['<div class="pricing-badge" id="popularBadge">Most Popular</div>',
   '<div class="pricing-badge" id="popularBadge" data-i18n="pricing.popularBadge">Most Popular</div>'],
  ['<div class="pricing-plan-title" id="proTitle">Lifetime Course Pass</div>',
   '<div class="pricing-plan-title" id="proTitle" data-i18n="pricing.proTitle">Lifetime Course Pass</div>'],
  ['<div class="pricing-plan-desc" id="proDesc">Complete structured path from beginner to conversational fluency.</div>',
   '<div class="pricing-plan-desc" id="proDesc" data-i18n="pricing.proDesc">Complete structured path from beginner to conversational fluency.</div>'],
  ['<span class="period">one-time</span>',
   '<span class="period" data-i18n="pricing.proPricePeriod">one-time</span>'],
  ['<span id="proFeat1">All units and reading lessons</span>',
   '<span id="proFeat1" data-i18n="pricing.proFeat1">All units and reading lessons</span>'],
  ['<span id="proFeat2">Full vocabulary trainer &amp; spaced repetition</span>',
   '<span id="proFeat2" data-i18n="pricing.proFeat2">Full vocabulary trainer &amp; spaced repetition</span>'],
  ['<span id="proFeat3">Grammar handbook and cultural notes</span>',
   '<span id="proFeat3" data-i18n="pricing.proFeat3">Grammar handbook and cultural notes</span>'],
  ['<span id="proFeat4">Interactive quizzes, audio &amp; story texts</span>',
   '<span id="proFeat4" data-i18n="pricing.proFeat4">Interactive quizzes, audio &amp; story texts</span>'],
  ['<span id="proFeat5">Lifetime updates with no recurring fees</span>',
   '<span id="proFeat5" data-i18n="pricing.proFeat5">Lifetime updates with no recurring fees</span>'],
  ['<span id="btnCheckoutLabel">Pay with Mock Checkout</span>',
   '<span id="btnCheckoutLabel" data-i18n="pricing.proBtn">Pay with Mock Checkout</span>'],
  ['<h4 id="secHeading">No real card data ever touches our server</h4>',
   '<h4 id="secHeading" data-i18n="pricing.securityHeading">No real card data ever touches our server</h4>'],
];

let count = 0;
for (const [from, to] of patches) {
  if (c.includes(from)) { c = c.split(from).join(to); count++; }
  else console.log('NOT FOUND:', from.substring(0, 70));
}
fs.writeFileSync(pricingPath, c, 'utf8');
console.log('Patched', count, '/', patches.length, 'in pricing.html');

// ── locale files ──────────────────────────────────────────────────────────────
const enPath = 'frontend/public/locales/en.json';
const ukPath = 'frontend/public/locales/uk.json';
const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const uk = JSON.parse(fs.readFileSync(ukPath, 'utf8'));

const enNew = {
  'pricing.pageTitle':          'Pricing & Plans \u2014 LanguageStudio',
  'pricing.courseSubtitle':     'LanguageStudio Courses',
  'pricing.heroTitle':          'Choose your learning plan',
  'pricing.heroDesc':           'Start for free with introductory lessons, or upgrade once for unlimited lifetime access. No subscriptions or hidden fees.',
  'pricing.recPlan':            'Recommended Plan',
  'pricing.personalizedHeading':'Personalized Learning Plan',
  'pricing.personalizedDesc':   'Based on your placement test, we have tailored your path to focus on your specific goals:',
  'pricing.starterTitle':       'Free Starter',
  'pricing.starterDesc':        'Try introductory lessons and essential vocabulary at zero cost.',
  'pricing.starterPricePeriod': 'forever',
  'pricing.starterFeat1':       'First lesson and basics included',
  'pricing.starterFeat2':       'Interactive dialogues & native audio',
  'pricing.starterFeat3':       'Basic vocabulary word bank',
  'pricing.starterFeat4':       'Progress synchronization',
  'pricing.starterBtn':         'Continue Learning Free',
  'pricing.popularBadge':       'Most Popular',
  'pricing.proTitle':           'Lifetime Course Pass',
  'pricing.proDesc':            'Complete structured path from beginner to conversational fluency.',
  'pricing.proPricePeriod':     'one-time',
  'pricing.proFeat1':           'All units and reading lessons',
  'pricing.proFeat2':           'Full vocabulary trainer & spaced repetition',
  'pricing.proFeat3':           'Grammar handbook and cultural notes',
  'pricing.proFeat4':           'Interactive quizzes, audio & story texts',
  'pricing.proFeat5':           'Lifetime updates with no recurring fees',
  'pricing.proBtn':             'Pay with Mock Checkout',
  'pricing.securityHeading':    'No real card data ever touches our server',
  'pricing.securityDesc':       'LanguageStudio never collects, handles, or stores your credit card numbers or banking credentials. All transactions are handled off-site through certified, compliant payment infrastructure via encrypted sessions.',
  'flashcards.pageTitle':       'Flashcards \u2014 LanguageStudio',
  'flashcards.heroLabel':       'Vocabulary trainer',
  'flashcards.heroTitle':       'Flashcards',
  'flashcards.heroDesc':        'Filter words by learning path or topic. Flip the card and train your memory.',
  'flashcards.track':           'Learning path',
  'flashcards.allTracks':       'All learning paths',
  'flashcards.loadingWords':    'Loading words\u2026',
  'flashcards.tapHint':         'Tap to see translation',
  'flashcards.tapAgainHint':    'Tap again to flip back',
  'flashcards.emptyNote':       'No words in the database for this course or lesson yet.',
  'flashcards.prev':            'Back',
  'flashcards.next':            'Next',
  'flashcards.audioTitle':      'Audio (visual mode)',
  'flashcards.shuffleTitle':    'Shuffle',
  'flashcards.markLearned':     'Mark as learned',
  'grammar.pageTitle':          'Grammar guide \u2014 LanguageStudio',
  'grammar.heroLabel':          'Grammar cheatsheets',
  'grammar.heroTitle':          'Grammar guide',
  'grammar.heroDesc':           'Quick access to core rules, verb forms, and essential expressions.',
};

const ukNew = {
  'pricing.pageTitle':          '\u0426\u0456\u043d\u0438 \u0442\u0430 \u043f\u043b\u0430\u043d\u0438 \u2014 LanguageStudio',
  'pricing.courseSubtitle':     '\u041a\u0443\u0440\u0441\u0438 LanguageStudio',
  'pricing.heroTitle':          '\u041e\u0431\u0435\u0440\u0456\u0442\u044c \u043d\u0430\u0432\u0447\u0430\u043b\u044c\u043d\u0438\u0439 \u043f\u043b\u0430\u043d',
  'pricing.heroDesc':           '\u0420\u043e\u0437\u043f\u043e\u0447\u043d\u0456\u0442\u044c \u0431\u0435\u0437\u043a\u043e\u0448\u0442\u043e\u0432\u043d\u043e \u0437 \u0432\u0441\u0442\u0443\u043f\u043d\u0438\u0445 \u0443\u0440\u043e\u043a\u0456\u0432 \u0430\u0431\u043e \u043f\u0440\u0438\u0434\u0431\u0430\u0439\u0442\u0435 \u043f\u043e\u0432\u043d\u0438\u0439 \u0434\u043e\u0441\u0442\u0443\u043f \u043d\u0430\u0437\u0430\u0432\u0436\u0434\u0438. \u0411\u0435\u0437 \u043f\u0456\u0434\u043f\u0438\u0441\u043e\u043a \u0442\u0430 \u043f\u0440\u0438\u0445\u043e\u0432\u0430\u043d\u0438\u0445 \u043f\u043b\u0430\u0442\u0435\u0436\u0456\u0432.',
  'pricing.recPlan':            '\u0420\u0435\u043a\u043e\u043c\u0435\u043d\u0434\u043e\u0432\u0430\u043d\u0438\u0439 \u043f\u043b\u0430\u043d',
  'pricing.personalizedHeading':'\u041f\u0435\u0440\u0441\u043e\u043d\u0430\u043b\u0456\u0437\u043e\u0432\u0430\u043d\u0438\u0439 \u043d\u0430\u0432\u0447\u0430\u043b\u044c\u043d\u0438\u0439 \u043f\u043b\u0430\u043d',
  'pricing.personalizedDesc':   '\u041d\u0430 \u043e\u0441\u043d\u043e\u0432\u0456 \u0432\u0430\u0448\u043e\u0433\u043e \u0442\u0435\u0441\u0442\u0443 \u043c\u0438 \u043d\u0430\u043b\u0430\u0448\u0442\u0443\u0432\u0430\u043b\u0438 \u043d\u0430\u0432\u0447\u0430\u043b\u044c\u043d\u0438\u0439 \u0448\u043b\u044f\u0445 \u043f\u0456\u0434 \u0432\u0430\u0448\u0456 \u0446\u0456\u043b\u0456:',
  'pricing.starterTitle':       '\u0411\u0435\u0437\u043a\u043e\u0448\u0442\u043e\u0432\u043d\u0438\u0439 \u0441\u0442\u0430\u0440\u0442',
  'pricing.starterDesc':        '\u0421\u043f\u0440\u043e\u0431\u0443\u0439\u0442\u0435 \u0432\u0441\u0442\u0443\u043f\u043d\u0456 \u0443\u0440\u043e\u043a\u0438 \u0442\u0430 \u0431\u0430\u0437\u043e\u0432\u0456 \u0441\u043b\u043e\u0432\u0430 \u0431\u0435\u0437 \u0436\u043e\u0434\u043d\u043e\u0457 \u043e\u043f\u043b\u0430\u0442\u0438.',
  'pricing.starterPricePeriod': '\u043d\u0430\u0437\u0430\u0432\u0436\u0434\u0438',
  'pricing.starterFeat1':       '\u041f\u0435\u0440\u0448\u0438\u0439 \u0443\u0440\u043e\u043a \u0442\u0430 \u043e\u0441\u043d\u043e\u0432\u0438 \u0432\u043a\u043b\u044e\u0447\u0435\u043d\u043e',
  'pricing.starterFeat2':       '\u0406\u043d\u0442\u0435\u0440\u0430\u043a\u0442\u0438\u0432\u043d\u0456 \u0434\u0456\u0430\u043b\u043e\u0433\u0438 \u0442\u0430 \u0430\u0443\u0434\u0456\u043e \u043d\u043e\u0441\u0456\u0457\u0432',
  'pricing.starterFeat3':       '\u0411\u0430\u0437\u043e\u0432\u0438\u0439 \u0441\u043b\u043e\u0432\u043d\u0438\u043a\u043e\u0432\u0438\u0439 \u0442\u0440\u0435\u043d\u0430\u0436\u0435\u0440',
  'pricing.starterFeat4':       '\u0421\u0438\u043d\u0445\u0440\u043e\u043d\u0456\u0437\u0430\u0446\u0456\u044f \u043f\u0440\u043e\u0433\u0440\u0435\u0441\u0443',
  'pricing.starterBtn':         '\u041f\u0440\u043e\u0434\u043e\u0432\u0436\u0438\u0442\u0438 \u043d\u0430\u0432\u0447\u0430\u043d\u043d\u044f \u0431\u0435\u0437\u043a\u043e\u0448\u0442\u043e\u0432\u043d\u043e',
  'pricing.popularBadge':       '\u041d\u0430\u0439\u043f\u043e\u043f\u0443\u043b\u044f\u0440\u043d\u0456\u0448\u0438\u0439',
  'pricing.proTitle':           '\u0414\u043e\u0432\u0456\u0447\u043d\u0438\u0439 \u0434\u043e\u0441\u0442\u0443\u043f \u0434\u043e \u043a\u0443\u0440\u0441\u0443',
  'pricing.proDesc':            '\u041f\u043e\u0432\u043d\u0438\u0439 \u0441\u0442\u0440\u0443\u043a\u0442\u0443\u0440\u043e\u0432\u0430\u043d\u0438\u0439 \u0448\u043b\u044f\u0445 \u0432\u0456\u0434 \u043f\u043e\u0447\u0430\u0442\u043a\u0456\u0432\u0446\u044f \u0434\u043e \u0440\u043e\u0437\u043c\u043e\u0432\u043d\u043e\u0433\u043e \u0440\u0456\u0432\u043d\u044f.',
  'pricing.proPricePeriod':     '\u043e\u0434\u043d\u043e\u0440\u0430\u0437\u043e\u0432\u043e',
  'pricing.proFeat1':           '\u0423\u0441\u0456 \u044e\u043d\u0456\u0442\u0438 \u0442\u0430 \u0442\u0435\u043a\u0441\u0442\u0438 \u0434\u043b\u044f \u0447\u0438\u0442\u0430\u043d\u043d\u044f',
  'pricing.proFeat2':           '\u041f\u043e\u0432\u043d\u0438\u0439 \u0442\u0440\u0435\u043d\u0430\u0436\u0435\u0440 \u0441\u043b\u0456\u0432 \u0437\u0456 \u0441\u043f\u0435\u0439\u0441\u0434-\u0440\u0435\u043f\u0435\u0442\u0438\u0448\u043d\u043e\u043c',
  'pricing.proFeat3':           '\u0413\u0440\u0430\u043c\u0430\u0442\u0438\u0447\u043d\u0438\u0439 \u0434\u043e\u0432\u0456\u0434\u043d\u0438\u043a \u0442\u0430 \u043a\u0443\u043b\u044c\u0442\u0443\u0440\u043d\u0456 \u043d\u043e\u0442\u0430\u0442\u043a\u0438',
  'pricing.proFeat4':           '\u0406\u043d\u0442\u0435\u0440\u0430\u043a\u0442\u0438\u0432\u043d\u0456 \u0442\u0435\u0441\u0442\u0438, \u0430\u0443\u0434\u0456\u043e \u0442\u0430 \u0442\u0435\u043a\u0441\u0442\u0438',
  'pricing.proFeat5':           '\u0414\u043e\u0432\u0456\u0447\u043d\u0456 \u043e\u043d\u043e\u0432\u043b\u0435\u043d\u043d\u044f \u0431\u0435\u0437 \u0449\u043e\u043c\u0456\u0441\u044f\u0447\u043d\u043e\u0457 \u043e\u043f\u043b\u0430\u0442\u0438',
  'pricing.proBtn':             '\u041e\u043f\u043b\u0430\u0442\u0438\u0442\u0438 (\u0441\u0438\u043c\u0443\u043b\u044f\u0446\u0456\u044f)',
  'pricing.securityHeading':    '\u0416\u043e\u0434\u043d\u0438\u0445 \u0440\u0435\u0430\u043b\u044c\u043d\u0438\u0445 \u043a\u0430\u0440\u0442\u043a\u043e\u0432\u0438\u0445 \u0434\u0430\u043d\u0438\u0445 \u043d\u0430 \u043d\u0430\u0448\u043e\u043c\u0443 \u0441\u0435\u0440\u0432\u0435\u0440\u0456',
  'pricing.securityDesc':       'LanguageStudio \u043d\u0456\u043a\u043e\u043b\u0438 \u043d\u0435 \u0437\u0431\u0438\u0440\u0430\u0454, \u043d\u0435 \u043e\u0431\u0440\u043e\u0431\u043b\u044f\u0454 \u0442\u0430 \u043d\u0435 \u0437\u0431\u0435\u0440\u0456\u0433\u0430\u0454 \u043d\u043e\u043c\u0435\u0440\u0438 \u0432\u0430\u0448\u0438\u0445 \u043a\u0430\u0440\u0442\u043e\u043a. \u0423\u0441\u0456 \u0442\u0440\u0430\u043d\u0437\u0430\u043a\u0446\u0456\u0457 \u0432\u0456\u0434\u0431\u0443\u0432\u0430\u044e\u0442\u044c\u0441\u044f \u043f\u043e\u0437\u0430 \u0441\u0435\u0440\u0432\u0435\u0440\u043e\u043c \u0447\u0435\u0440\u0435\u0437 \u0441\u0435\u0440\u0442\u0438\u0444\u0456\u043a\u043e\u0432\u0430\u043d\u0443 \u0456\u043d\u0444\u0440\u0430\u0441\u0442\u0440\u0443\u043a\u0442\u0443\u0440\u0443.',
  'flashcards.pageTitle':       '\u0424\u043b\u0435\u0448\u043a\u0430\u0440\u0442\u043a\u0438 \u2014 LanguageStudio',
  'flashcards.heroLabel':       '\u0421\u043b\u043e\u0432\u043d\u0438\u043a\u043e\u0432\u0438\u0439 \u0442\u0440\u0435\u043d\u0430\u0436\u0435\u0440',
  'flashcards.heroTitle':       '\u0424\u043b\u0435\u0448\u043a\u0430\u0440\u0442\u043a\u0438',
  'flashcards.heroDesc':        '\u0424\u0456\u043b\u044c\u0442\u0440\u0443\u0439\u0442\u0435 \u0441\u043b\u043e\u0432\u0430 \u0437\u0430 \u043d\u0430\u043f\u0440\u044f\u043c\u043a\u043e\u043c \u0430\u0431\u043e \u0442\u0435\u043c\u043e\u044e. \u041f\u0435\u0440\u0435\u0432\u0435\u0440\u0442\u0430\u0439\u0442\u0435 \u043a\u0430\u0440\u0442\u043a\u0443 \u0442\u0430 \u0442\u0440\u0435\u043d\u0443\u0439\u0442\u0435 \u043f\u0430\u043c\u2019\u044f\u0442\u044c.',
  'flashcards.track':           '\u041d\u0430\u043f\u0440\u044f\u043c\u043e\u043a',
  'flashcards.allTracks':       '\u0423\u0441\u0456 \u043d\u0430\u043f\u0440\u044f\u043c\u043a\u0438',
  'flashcards.loadingWords':    '\u0417\u0430\u0432\u0430\u043d\u0442\u0430\u0436\u0435\u043d\u043d\u044f \u0441\u043b\u0456\u0432\u2026',
  'flashcards.tapHint':         '\u041d\u0430\u0442\u0438\u0441\u043d\u0456\u0442\u044c, \u0449\u043e\u0431 \u043f\u043e\u0431\u0430\u0447\u0438\u0442\u0438 \u043f\u0435\u0440\u0435\u043a\u043b\u0430\u0434',
  'flashcards.tapAgainHint':    '\u041d\u0430\u0442\u0438\u0441\u043d\u0456\u0442\u044c \u0437\u043d\u043e\u0432\u0443 \u0434\u043b\u044f \u0437\u0432\u043e\u0440\u043e\u0442\u0443',
  'flashcards.emptyNote':       '\u0414\u043b\u044f \u0446\u044c\u043e\u0433\u043e \u043a\u0443\u0440\u0441\u0443 \u0447\u0438 \u0443\u0440\u043e\u043a\u0443 \u043f\u043e\u043a\u0438 \u043d\u0435\u043c\u0430\u0454 \u0441\u043b\u0456\u0432 \u0443 \u0431\u0430\u0437\u0456.',
  'flashcards.prev':            '\u041d\u0430\u0437\u0430\u0434',
  'flashcards.next':            '\u0412\u043f\u0435\u0440\u0435\u0434',
  'flashcards.audioTitle':      '\u0410\u0443\u0434\u0456\u043e (\u0432\u0456\u0437\u0443\u0430\u043b\u044c\u043d\u0438\u0439 \u0440\u0435\u0436\u0438\u043c)',
  'flashcards.shuffleTitle':    '\u041f\u0435\u0440\u0435\u043c\u0456\u0448\u0430\u0442\u0438',
  'flashcards.markLearned':     '\u041f\u043e\u0437\u043d\u0430\u0447\u0438\u0442\u0438 \u044f\u043a \u0432\u0438\u0432\u0447\u0435\u043d\u0435',
  'grammar.pageTitle':          '\u0413\u0440\u0430\u043c\u0430\u0442\u0438\u0447\u043d\u0438\u0439 \u0434\u043e\u0432\u0456\u0434\u043d\u0438\u043a \u2014 LanguageStudio',
  'grammar.heroLabel':          '\u0413\u0440\u0430\u043c\u0430\u0442\u0438\u0447\u043d\u0456 \u0448\u043f\u0430\u0440\u0433\u0430\u043b\u043a\u0438',
  'grammar.heroTitle':          '\u0414\u043e\u0432\u0456\u0434\u043d\u0438\u043a \u0433\u0440\u0430\u043c\u0430\u0442\u0438\u043a\u0438',
  'grammar.heroDesc':           '\u0428\u0432\u0438\u0434\u043a\u0438\u0439 \u0434\u043e\u0441\u0442\u0443\u043f \u0434\u043e \u043e\u0441\u043d\u043e\u0432\u043d\u0438\u0445 \u043f\u0440\u0430\u0432\u0438\u043b, \u0444\u043e\u0440\u043c \u0434\u0456\u0454\u0441\u043b\u0456\u0432 \u0442\u0430 \u0435\u0442\u0438\u043a\u0435\u0442\u043d\u0438\u0445 \u0432\u0438\u0440\u0430\u0437\u0456\u0432.',
};

Object.assign(en, enNew);
Object.assign(uk, ukNew);

fs.writeFileSync(enPath, JSON.stringify(en, null, 2), 'utf8');
fs.writeFileSync(ukPath, JSON.stringify(uk, null, 2), 'utf8');
console.log('Locale files updated: en.json +', Object.keys(enNew).length, 'keys | uk.json +', Object.keys(ukNew).length, 'keys');
