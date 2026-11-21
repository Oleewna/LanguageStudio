# 🇮🇹 Уроки італійської мови — Текстова база (Markdown)

У цій папці зібрано всі уроки італійської мови, витягнуті з вихідного коду (JSON та i18n файлів). Вони відформатовані за принципом «один файл — один урок» для швидкого читання та перегляду без необхідності дивитися вихідний код.

## 📚 Зміст та швидка навігація

### Розділ 1: Основи спілкування (`communication-basics`)

| № | Назва уроку | Файл | Статус у додатку |
|---|---|---|---|
| Урок 1 | Привіт, як справи? | [communication-basics-1.md](./communication-basics-1.md) | ✅ В додатку |
| Урок 2 | Ввічливі привітання | [communication-basics-1-greetings.md](./communication-basics-1-greetings.md) | ✅ В додатку |
| Урок 3 | Як тебе звати? | [communication-basics-1-practice.md](./communication-basics-1-practice.md) | ✅ В додатку |
| Урок 4 | Приємно познайомитися | [communication-basics-1-review.md](./communication-basics-1-review.md) | 📋 План курсу |
| Урок 5 | Звідки ти? | [communication-basics-1-origin.md](./communication-basics-1-origin.md) | 📋 План курсу |
| Урок 6 | Навчатися чи працювати? | [communication-basics-2.md](./communication-basics-2.md) | 📋 План курсу |
| Урок 7 | Мови, якими я розмовляю | [communication-basics-2-languages.md](./communication-basics-2-languages.md) | 📋 План курсу |
| Урок 8 | Моя родина | [communication-basics-2-family.md](./communication-basics-2-family.md) | 📋 План курсу |
| Урок 9 | Що тобі подобається? | [communication-basics-3.md](./communication-basics-3.md) | 📋 План курсу |
| Урок 10 | Запросити на каву | [communication-basics-3-plans.md](./communication-basics-3-plans.md) | 📋 План курсу |
| Урок 11 | Домовитися про час | [communication-basics-3-time.md](./communication-basics-3-time.md) | 📋 План курсу |
| Підсумок | Підсумкове повторення курсу | [communication-basics-summary.md](./communication-basics-summary.md) | 🎯 Самоперевірка |

### Розділ 2: Правила читання (`italian-reading`)

| № | Назва правила / уроку | Файл | Статус у додатку |
|---|---|---|---|
| Правило 1 | Тверда C | [italian-reading-2.md](./italian-reading-2.md) | ✅ В додатку |
| Правило 2 | C та CH | [italian-reading-3.md](./italian-reading-3.md) | ✅ В додатку |
| Правило 3 | Тверда G | [italian-reading-4.md](./italian-reading-4.md) | ✅ В додатку |
| Правило 4 | G та GH | [italian-reading-5.md](./italian-reading-5.md) | ✅ В додатку |
| Правило 5 | Звуки SC | [italian-reading-6.md](./italian-reading-6.md) | ✅ В додатку |
| Правило 6 | GN | [italian-reading-7.md](./italian-reading-7.md) | ✅ В додатку |
| Правило 7 | GLI | [italian-reading-8.md](./italian-reading-8.md) | ✅ В додатку |
| Правило 8 | QU | [italian-reading-9.md](./italian-reading-9.md) | ✅ В додатку |
| Правило 9 | Подвоєні приголосні | [italian-reading-10.md](./italian-reading-10.md) | ✅ В додатку |
| Правило 10 | Наголос і акценти | [italian-reading-11.md](./italian-reading-11.md) | ✅ В додатку |
| Урок 12 | Читаємо | [italian-reading-12.md](./italian-reading-12.md) | ✅ В додатку |

---

## 🔄 Як оновити ці файли

Якщо ви редагуєте або додаєте уроки в `courses/it/` чи `paid-content/courses/it/`, ви можете будь-коли повторно оновити Markdown-файли однією командою з кореня репозиторію:

```bash
node scripts/extract-lessons-md.mjs
```