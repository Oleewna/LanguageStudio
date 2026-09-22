# LanguageStudio — Professional Italian Learning Platform

A structured, teacher-led Italian learning platform designed to bridge classroom instruction with interactive self-study. Built on a CEFR-guided curriculum (A1–C2), this platform provides students with organized theory, native audio examples, interactive exercises, and gamified study tools.

---

## 📐 System Architecture & Module Breakdown

### 1. Student Portal (`/learn`)
* **Structured Learning Roadmap:** Visual, step-by-step unit progression following CEFR standards with locked and unlocked lesson nodes.
* **Lesson Theory Hub:** In-depth grammar guides, structured explanations, and dialogue transcripts written to reinforce live teaching sessions.
* **Native Audio & Examples:** Pronunciation clips integrated directly into vocabulary lists and conversation examples.
* **Interactive Drill Engine:**
  * Multiple choice & single-choice quizzes
  * Sentence structure and word-reordering exercises
  * Audio listening comprehension drills
  * Interactive fill-in-the-blank text inputs
* **Games & Study Tools:**
  * Spaced Repetition (SRS) flashcards for active recall
  * Time-attack word matching games
  * Listening quizzes
* **Gamification & Progress:** Streak counters, XP rewards, lesson accuracy rates, and completion tracking.

### 2. Teacher & Admin Dashboard (`/admin`)
* **Student Roster Management:** Invite students, manage access, and organize learners into study groups or cohorts.
* **Homework & Practice Assignments:** Assign specific modules, drills, or review games to individual students or classes.
* **Analytics & Homework Tracker:** Real-time visibility into student quiz scores, exercise completion times, accuracy rates, and common mistakes.
* **Manual Feedback System:** Review written submissions and track individual student progress over time.

---

## 🎒 Standardized Lesson Structure Template

Every lesson follows a consistent 4-step sequence to maximize engagement and retention:

```text
┌────────────────────────────────────────────────────────┐
│ 1. REAL-WORLD DIALOGUE & AUDIO                         │
│    Listen to a native conversation snippet first.      │
├────────────────────────────────────────────────────────┤
│ 2. THEORY & GRAMMAR BREAKDOWN                          │
│    Clear, bite-sized rules explaining the dialogue.    │
├────────────────────────────────────────────────────────┤
│ 3. GUIDED DRILLS & EXERCISES                           │
│    Multiple-choice, fill-in-blanks, re-ordering.       │
├────────────────────────────────────────────────────────┤
│ 4. MINI-GAME / CHECKPOINT                              │
│    Timed matching or flashcard review to earn XP.      │
└────────────────────────────────────────────────────────┘
```

---

## 🛠️ Key Platform Features vs. Reference Sites

| Feature | Reference Sites (LingoHut / 50Languages / PrimalEzione) | Impara! Platform |
| :--- | :--- | :--- |
| **Structure** | Unstructured vocabulary lists or standalone articles | CEFR-guided linear curriculum (A1–C2) |
| **Grammar Explanations** | Minimal or fragmented across pages | Deep, structured theory integrated with drills |
| **Progress Control** | Open list access with no prerequisites | Sequential progression & checkpoint tests |
| **Teacher Controls** | None (Public tools) | Complete dashboard to manage students & assign tasks |
| **Gamification** | Basic quizzes | XP tracking, streaks, audio matching, & flashcard games |

---

## ⚡ Technical Stack Recommendations

* **Frontend:** React / Next.js with Tailwind CSS (Responsive design, fast page loads)
* **Backend & Database:** Node.js / PostgreSQL or Supabase (User management, progress tracking, quiz data)
* **Audio Engine:** HTML5 Audio API / Web Speech API (or pre-recorded native audio files)
* **Hosting:** Vercel (Frontend) + Supabase/Render (Backend & Database)