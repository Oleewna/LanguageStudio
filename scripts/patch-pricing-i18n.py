"""Add data-i18n attributes to pricing.html and update locale files."""
import json, re

# ── 1. Patch pricing.html ────────────────────────────────────────────────────
path = 'frontend/public/pages/pricing.html'
with open(path, 'r', encoding='utf-8') as f:
    c = f.read()

patches = [
    ('<title>Pricing &amp; Plans \u2014 LanguageStudio</title>',
     '<title data-i18n="pricing.pageTitle">Pricing &amp; Plans \u2014 LanguageStudio</title>'),
    ('<p class="eyebrow" id="courseSubtitle">LanguageStudio Courses</p>',
     '<p class="eyebrow" id="courseSubtitle" data-i18n="pricing.courseSubtitle">LanguageStudio Courses</p>'),
    ('<h1 id="pricingHeading">Choose your learning plan</h1>',
     '<h1 id="pricingHeading" data-i18n="pricing.heroTitle">Choose your learning plan</h1>'),
    ('<p id="pricingSubheading">Start for free with introductory lessons, or upgrade once for unlimited lifetime access. No subscriptions or hidden fees.</p>',
     '<p id="pricingSubheading" data-i18n="pricing.heroDesc">Start for free with introductory lessons, or upgrade once for unlimited lifetime access. No subscriptions or hidden fees.</p>'),
    ('<span data-icon="sparkles"></span> Recommended Plan',
     '<span data-icon="sparkles"></span> <span data-i18n="pricing.recPlan">Recommended Plan</span>'),
    ('<div class="pricing-plan-title" id="starterTitle">Free Starter</div>',
     '<div class="pricing-plan-title" id="starterTitle" data-i18n="pricing.starterTitle">Free Starter</div>'),
    ('<div class="pricing-plan-desc" id="starterDesc">Try introductory lessons and essential vocabulary at zero cost.</div>',
     '<div class="pricing-plan-desc" id="starterDesc" data-i18n="pricing.starterDesc">Try introductory lessons and essential vocabulary at zero cost.</div>'),
    ('<span class="period">forever</span>',
     '<span class="period" data-i18n="pricing.starterPricePeriod">forever</span>'),
    ('<span id="feat1">First lesson and basics included</span>',
     '<span id="feat1" data-i18n="pricing.starterFeat1">First lesson and basics included</span>'),
    ('<span id="feat2">Interactive dialogues &amp; native audio</span>',
     '<span id="feat2" data-i18n="pricing.starterFeat2">Interactive dialogues &amp; native audio</span>'),
    ('<span id="feat3">Basic vocabulary word bank</span>',
     '<span id="feat3" data-i18n="pricing.starterFeat3">Basic vocabulary word bank</span>'),
    ('<span id="feat4">Progress synchronization</span>',
     '<span id="feat4" data-i18n="pricing.starterFeat4">Progress synchronization</span>'),
    ('<div class="pricing-badge" id="popularBadge">Most Popular</div>',
     '<div class="pricing-badge" id="popularBadge" data-i18n="pricing.popularBadge">Most Popular</div>'),
    ('<div class="pricing-plan-title" id="proTitle">Lifetime Course Pass</div>',
     '<div class="pricing-plan-title" id="proTitle" data-i18n="pricing.proTitle">Lifetime Course Pass</div>'),
    ('<div class="pricing-plan-desc" id="proDesc">Complete structured path from beginner to conversational fluency.</div>',
     '<div class="pricing-plan-desc" id="proDesc" data-i18n="pricing.proDesc">Complete structured path from beginner to conversational fluency.</div>'),
    ('<span class="period">one-time</span>',
     '<span class="period" data-i18n="pricing.proPricePeriod">one-time</span>'),
    ('<span id="proFeat1">All units and reading lessons</span>',
     '<span id="proFeat1" data-i18n="pricing.proFeat1">All units and reading lessons</span>'),
    ('<span id="proFeat2">Full vocabulary trainer &amp; spaced repetition</span>',
     '<span id="proFeat2" data-i18n="pricing.proFeat2">Full vocabulary trainer &amp; spaced repetition</span>'),
    ('<span id="proFeat3">Grammar handbook and cultural notes</span>',
     '<span id="proFeat3" data-i18n="pricing.proFeat3">Grammar handbook and cultural notes</span>'),
    ('<span id="proFeat4">Interactive quizzes, audio &amp; story texts</span>',
     '<span id="proFeat4" data-i18n="pricing.proFeat4">Interactive quizzes, audio &amp; story texts</span>'),
    ('<span id="proFeat5">Lifetime updates with no recurring fees</span>',
     '<span id="proFeat5" data-i18n="pricing.proFeat5">Lifetime updates with no recurring fees</span>'),
    ('<span id="btnCheckoutLabel">Pay with Mock Checkout</span>',
     '<span id="btnCheckoutLabel" data-i18n="pricing.proBtn">Pay with Mock Checkout</span>'),
    ('<h4 id="secHeading">No real card data ever touches our server</h4>',
     '<h4 id="secHeading" data-i18n="pricing.securityHeading">No real card data ever touches our server</h4>'),
]

for old, new in patches:
    if old in c:
        c = c.replace(old, new)
        print(f'Patched: {old[:60]}...')
    else:
        print(f'NOT FOUND: {old[:60]}...')

with open(path, 'w', encoding='utf-8') as f:
    f.write(c)

# ── 2. Add translation keys to en.json ───────────────────────────────────────
en_path = 'frontend/public/locales/en.json'
with open(en_path, 'r', encoding='utf-8') as f:
    en = json.load(f)

en_pricing = {
    "pricing.pageTitle":          "Pricing & Plans \u2014 LanguageStudio",
    "pricing.courseSubtitle":     "LanguageStudio Courses",
    "pricing.heroTitle":          "Choose your learning plan",
    "pricing.heroDesc":           "Start for free with introductory lessons, or upgrade once for unlimited lifetime access. No subscriptions or hidden fees.",
    "pricing.recPlan":            "Recommended Plan",
    "pricing.personalizedHeading":"Personalized Learning Plan",
    "pricing.personalizedDesc":   "Based on your placement test, we have tailored your path to focus on your specific goals:",
    "pricing.starterTitle":       "Free Starter",
    "pricing.starterDesc":        "Try introductory lessons and essential vocabulary at zero cost.",
    "pricing.starterPricePeriod": "forever",
    "pricing.starterFeat1":       "First lesson and basics included",
    "pricing.starterFeat2":       "Interactive dialogues & native audio",
    "pricing.starterFeat3":       "Basic vocabulary word bank",
    "pricing.starterFeat4":       "Progress synchronization",
    "pricing.starterBtn":         "Continue Learning Free",
    "pricing.popularBadge":       "Most Popular",
    "pricing.proTitle":           "Lifetime Course Pass",
    "pricing.proDesc":            "Complete structured path from beginner to conversational fluency.",
    "pricing.proPricePeriod":     "one-time",
    "pricing.proFeat1":           "All units and reading lessons",
    "pricing.proFeat2":           "Full vocabulary trainer & spaced repetition",
    "pricing.proFeat3":           "Grammar handbook and cultural notes",
    "pricing.proFeat4":           "Interactive quizzes, audio & story texts",
    "pricing.proFeat5":           "Lifetime updates with no recurring fees",
    "pricing.proBtn":             "Pay with Mock Checkout",
    "pricing.securityHeading":    "No real card data ever touches our server",
    "pricing.securityDesc":       "LanguageStudio never collects, handles, or stores your credit card numbers or banking credentials. All transactions are handled off-site through certified, compliant payment infrastructure via encrypted sessions.",
    # flashcards
    "flashcards.pageTitle":    "Flashcards \u2014 LanguageStudio",
    "flashcards.heroLabel":    "Vocabulary trainer",
    "flashcards.heroTitle":    "Flashcards",
    "flashcards.heroDesc":     "Filter words by learning path or topic. Flip the card and train your memory.",
    "flashcards.track":        "Learning path",
    "flashcards.allTracks":    "All learning paths",
    "flashcards.loadingWords": "Loading words\u2026",
    "flashcards.tapHint":      "Tap to see translation",
    "flashcards.tapAgainHint": "Tap again to flip back",
    "flashcards.emptyNote":    "No words in the database for this course or lesson yet.",
    "flashcards.prev":         "Back",
    "flashcards.next":         "Next",
    "flashcards.audioTitle":   "Audio (visual mode)",
    "flashcards.shuffleTitle": "Shuffle",
    "flashcards.markLearned":  "Mark as learned",
    # grammar
    "grammar.pageTitle":  "Grammar guide \u2014 LanguageStudio",
    "grammar.heroLabel":  "Grammar cheatsheets",
    "grammar.heroTitle":  "Grammar guide",
    "grammar.heroDesc":   "Quick access to core rules, verb forms, and essential expressions.",
}
en.update(en_pricing)

with open(en_path, 'w', encoding='utf-8') as f:
    json.dump(en, f, ensure_ascii=False, indent=2)

# ── 3. Add translation keys to uk.json ───────────────────────────────────────
uk_path = 'frontend/public/locales/uk.json'
with open(uk_path, 'r', encoding='utf-8') as f:
    uk = json.load(f)

uk_pricing = {
    "pricing.pageTitle":          "Ціни та плани \u2014 LanguageStudio",
    "pricing.courseSubtitle":     "Курси LanguageStudio",
    "pricing.heroTitle":          "Оберіть навчальний план",
    "pricing.heroDesc":           "Розпочніть безкоштовно з вступних уроків або придбайте повний доступ назавжди. Без підписок та прихованих платежів.",
    "pricing.recPlan":            "Рекомендований план",
    "pricing.personalizedHeading":"Персоналізований навчальний план",
    "pricing.personalizedDesc":   "На основі вашого тесту ми налаштували навчальний шлях під ваші цілі:",
    "pricing.starterTitle":       "Безкоштовний старт",
    "pricing.starterDesc":        "Спробуйте вступні уроки та базові слова без жодної оплати.",
    "pricing.starterPricePeriod": "назавжди",
    "pricing.starterFeat1":       "Перший урок та основи включено",
    "pricing.starterFeat2":       "Інтерактивні діалоги та аудіо носіїв",
    "pricing.starterFeat3":       "Базовий словниковий тренажер",
    "pricing.starterFeat4":       "Синхронізація прогресу",
    "pricing.starterBtn":         "Продовжити навчання безкоштовно",
    "pricing.popularBadge":       "Найпопулярніший",
    "pricing.proTitle":           "Довічний доступ до курсу",
    "pricing.proDesc":            "Повний структурований шлях від початківця до розмовного рівня.",
    "pricing.proPricePeriod":     "одноразово",
    "pricing.proFeat1":           "Усі юніти та читання",
    "pricing.proFeat2":           "Повний тренажер слів зі спейсд-репетишном",
    "pricing.proFeat3":           "Граматичний довідник та культурні нотатки",
    "pricing.proFeat4":           "Інтерактивні тести, аудіо та тексти",
    "pricing.proFeat5":           "Довічні оновлення без щомісячної оплати",
    "pricing.proBtn":             "Оплатити (симуляція)",
    "pricing.securityHeading":    "Жодних реальних карткових даних на нашому сервері",
    "pricing.securityDesc":       "LanguageStudio ніколи не збирає, не обробляє та не зберігає номери ваших карток чи банківські реквізити. Усі транзакції відбуваються поза сервером через сертифіковану інфраструктуру.",
    # flashcards
    "flashcards.pageTitle":    "Флешкартки \u2014 LanguageStudio",
    "flashcards.heroLabel":    "Словниковий тренажер",
    "flashcards.heroTitle":    "Флешкартки",
    "flashcards.heroDesc":     "Фільтруйте слова за напрямком або темою. Перевертайте картку та тренуйте пам\u2019ять.",
    "flashcards.track":        "Напрямок",
    "flashcards.allTracks":    "Усі напрямки",
    "flashcards.loadingWords": "Завантаження слів\u2026",
    "flashcards.tapHint":      "Натисніть, щоб побачити переклад",
    "flashcards.tapAgainHint": "Натисніть знову для звороту",
    "flashcards.emptyNote":    "Для цього курсу чи уроку поки немає слів у базі.",
    "flashcards.prev":         "Назад",
    "flashcards.next":         "Вперед",
    "flashcards.audioTitle":   "Аудіо (візуальний режим)",
    "flashcards.shuffleTitle": "Перемішати",
    "flashcards.markLearned":  "Позначити як вивчене",
    # grammar
    "grammar.pageTitle":  "Граматичний довідник \u2014 LanguageStudio",
    "grammar.heroLabel":  "Граматичні шпаргалки",
    "grammar.heroTitle":  "Довідник граматики",
    "grammar.heroDesc":   "Швидкий доступ до основних правил, форм дієслів та етикетних виразів.",
}
uk.update(uk_pricing)

with open(uk_path, 'w', encoding='utf-8') as f:
    json.dump(uk, f, ensure_ascii=False, indent=2)

print('\nAll locale keys added.')
