# Communication Basics: Lesson Implementation Steps

## Course Goal

Create a brisk A0 Italian course following Sofia and Greta from their first meeting outside class, into a teacher-led activity, and then into relaxed conversations with classmates. Use three substantial lessons instead of separating every personal topic. Make countries and nationalities more prominent than city names; a current city can be an optional detail. Each lesson should take about 20 minutes and leave time for active practice.

Implement only the numbered step requested. Use the corresponding existing lesson ID (`communication-basics-1`, `communication-basics-2`, or `communication-basics-3`). Each lesson should have exactly one dialogue section. Keep dialogue in Italian only; use story text to establish any change of setting instead of splitting the dialogue into multiple blocks. App translations belong in separate Ukrainian and English fields, never inside the dialogue. Reuse the existing lesson renderer and data conventions unless a required interaction is unsupported.

**Structure:** The course contains three lessons. Implementation Steps 1, 2, and 3 each create the matching lesson; Implementation Step 4 connects the lessons in the course path. “Step” means build order, not a lesson type.

**Natural dialogue rule:** Every question must make sense in its scene. Do not make characters interview strangers or ask questions merely to introduce a target phrase. Establish the situation first, then let questions arise from what someone has said or shown. Include natural reactions, small acknowledgements, reciprocal turns, and chances for learners to choose what they share.

## Required Quality Check for Every Lesson

Before finishing any lesson step, check all of the following for that lesson:

- **Italian:** Proofread the story, dialogue, vocabulary, headings, and prompts for natural beginner-level Italian; spelling and accents; apostrophes; articles; gender and number agreement; verb forms; and consistent informal/formal address. Check that each question and reply is motivated by the scene and that speakers react to one another instead of reciting a questionnaire. For countries, verify the article/preposition in forms such as *dall'Ucraina* and *dalla Germania*, and make nationality adjectives agree with the person. Keep character details and facts consistent within the story and across the course.
- **Translations:** Provide Ukrainian and English for every user-facing item that the app displays, including dialogue lines, story text, vocabulary meanings, section headings, quiz prompts, feedback, and image descriptions. Compare each translation with its Italian source for meaning, tone, names, and details. Translations must read naturally in their own language, not as literal word swaps. Keep the two interface languages separate and check each view for missing or mixed-language labels.
- **Pronunciation/transliteration:** Do not add ad-hoc transliterations. If a pronunciation guide is useful and included, verify the Italian sounds and stress, use one consistent method, and make sure it is appropriate for the learner's interface language. The existing `phonetic` field is not language-specific: do not reuse a Ukrainian-style spelling guide for English learners. Omit the guide or make it language-specific if it cannot be made accurate for both.
- **Audio and vocabulary:** If audio is enabled, confirm it speaks the exact Italian line. Check that each vocabulary entry is correct, useful, and present in or clearly explained by the lesson; include articles or gender where they help learners use the word correctly.
- **Activities:** Ensure quiz questions and accepted answers match the taught content, allow legitimate spelling/capitalization variants where needed, and do not rely on information absent from the lesson.

## Lesson 1: First Meeting and First Class

**Implementation step:** Step 1.

**Story:** Sofia arrives at the classroom early and is not sure which seat is free. Greta helps her; they discover they are both new to the course. As class begins, the teacher leads a short, low-pressure introduction round so students can share their names and countries.

**Dialogue (one continuous dialogue block; Italian only):**

> Sofia: Scusa, questo posto è libero?  
> Greta: Sì, certo. Anche tu sei qui per il corso d'italiano?  
> Sofia: Sì, è la mia prima lezione. Mi chiamo Sofia.  
> Greta: Piacere, Sofia. Io sono Greta.  
> Insegnante: Buongiorno a tutti. Cominciamo con un giro veloce: nome e paese.  
> Sofia: Sono Sofia. Vengo dall'Ucraina.  
> Insegnante: Benvenuta, Sofia. Greta?  
> Greta: Vengo dalla Germania. Sono tedesca.  
> Sofia: Ah, che bello!  
> Greta: E tu?  
> Sofia: Sono ucraina.
> Insegnante: E tu, Luca?
> Luca: Sono francese, vengo dalla Francia.

**Vocabulary (Italian — English / Ukrainian):** *questo posto è libero?* — is this seat free? / це місце вільне?; *certo* — of course / звісно; *anche tu?* — you too? / ти теж?; *il corso d'italiano* — Italian course / курс італійської; *la prima lezione* — the first lesson / перше заняття; *piacere* — nice to meet you / приємно познайомитися; *il paese* — country / країна; *venire da* — to come from / бути родом із; *l'Ucraina, la Germania, la Francia* — Ukraine, Germany, France / Україна, Німеччина, Франція; *ucraino/a, tedesco/a, francese* — Ukrainian, German, French / українець, українка; німець, німкеня; француз, француженка; *che bello!* — how nice! / як чудово!

**Teach:** Natural first-meeting phrases, names, countries, and nationalities. Focus on countries more than city names; cities can be optional. Check country articles and forms such as *dall'Ucraina*, *dalla Germania*, and *dal Canada*. Keep the teacher's round brief, and let students pass or use a prepared character if they do not want to share personal details.

**Learner outcome:** Join a first meeting, say a name and country, and respond naturally to another person's introduction. Run the Required Quality Check for this lesson.

## Lesson 2: Teacher's Pair Activity: What We Do and Speak

**Implementation step:** Step 2.

**Story:** In the next class, the teacher gives students a pair task: make a short profile by sharing what they study or do, languages they speak, and (if they want) someone important to them. The activity gives Sofia and Greta a reason to ask and answer; Sofia chooses to share a photo during their conversation.

**Dialogue (one continuous dialogue block; Italian only):**

> Insegnante: Lavorate a coppie. Parlate di cosa fate, che lingue parlate e perché studiate italiano.  
> Greta: Studi o lavori, Sofia?  
> Sofia: Studio medicina. E tu?  
> Greta: Studio architettura e il sabato lavoro in libreria.  
> Sofia: Ti piace il lavoro?  
> Greta: Sì, molto. E tu, che lingue parli?  
> Sofia: Ucraino e inglese. Studio italiano perché vivo qui con la mia famiglia.  
> Greta: Che bello! Io invece studio italiano per lavorare.  
> Sofia: Guarda, questa è mia sorella Olena.  
> Greta: Che bella foto! Vive in Ucraina?  
> Sofia: No, vive anche lei qui a Milano. E tu, hai fratelli o sorelle?  
> Greta: No, sono figlia unica. Però ho una cugina qui a Milano.

**Vocabulary (Italian — English / Ukrainian):** *lavorare a coppie* — to work in pairs / працювати в парах; *studiare* — to study / навчатися; *lavorare* — to work / працювати; *studio... / lavoro...* — I study... / I work... / я навчаюся... / я працюю...; *in libreria* — in a bookshop / у книгарні; *ti piace...?* — do you like...? / тобі подобається...?; *che lingue parli?* — what languages do you speak? / якими мовами ти розмовляєш?; *parlo...* — I speak... / я розмовляю...; *per lavorare* — to work / щоб працювати; *perché vivo qui* — because I live here / тому що я живу тут; *la famiglia* — family / родина; *vivere* — to live / жити; *la sorella / il fratello* — sister / brother / сестра / брат; *la foto* — photo / фотографія; *figlia unica* — an only child (female) / єдина дитина (про дівчину); *la cugina* — female cousin / двоюрідна сестра.

**Teach:** Useful ways to talk about studies, work, and languages, without assuming everyone is employed. Include answer options for studying, working, doing both, or not working now. Recycle country/nationality language when naming languages. Keep family vocabulary brief and optional; students may talk about a friend or fictional person instead.

**Learner outcome:** Exchange a few details about study/work and languages, explain a simple reason for learning Italian, and optionally introduce someone. Run the Required Quality Check for this lesson.

## Lesson 3: Student Discussion: Interests and Everyday Life

**Implementation step:** Step 3.

**Story:** The teacher puts students in small groups and gives them a topic card about free time. Sofia, Greta, and Luca find shared interests, talk about their weekend routines, and make a plan. The lesson ends with students introducing themselves to a new group using language from the whole course.

**Dialogue (one continuous dialogue block; Italian only):**

> Insegnante: In piccoli gruppi, parlate di cosa vi piace fare nel tempo libero.  
> Sofia: Mi piace cucinare. E a voi?  
> Greta: A me piace ascoltare la musica.  
> Luca: Anch'io! Che musica ascolti?  
> Greta: Mi piace il pop. E tu, Sofia?  
> Sofia: Mi piace leggere e cucinare.  
> Greta: Davvero? Qual è il tuo piatto preferito?  
> Sofia: Un piatto tradizionale ucraino: il borshch.  
> Luca: Buono! Cosa fate di solito nel fine settimana?  
> Greta: Il sabato incontro gli amici. La domenica resto a casa.  
> Sofia: Ti va di prendere un caffè sabato?  
> Greta: Volentieri! A che ora?  
> Sofia: Alle tre?  
> Greta: Perfetto!

**Vocabulary (Italian — English / Ukrainian):** *nel tempo libero* — in your free time / у вільний час; *mi piace...* — I like... / мені подобається...; *a me piace...* — I like... / а мені подобається...; *anch'io* — me too / я теж; *ascoltare la musica* — to listen to music / слухати музику; *il pop* — pop music / попмузика; *leggere* — to read / читати; *cucinare* — to cook / готувати; *un piatto tradizionale* — a traditional dish / традиційна страва; *il piatto preferito* — favourite dish / улюблена страва; *davvero?* — really? / справді?; *nel fine settimana* — at the weekend / на вихідних; *di solito* — usually / зазвичай; *incontrare gli amici* — to meet friends / зустрічатися з друзями; *restare a casa* — to stay at home / залишатися вдома; *ti va di...?* — would you like to...? / хочеш...?; *volentieri!* — gladly! / залюбки!; *a che ora?* — at what time? / о котрій?

**Teach:** *Mi piace* with a singular noun or infinitive, a small set of activities and time expressions, and one natural invitation. Let classmates respond to each other's details and follow up on something they heard; avoid a teacher-led list of disconnected questions. Finish with a learner-created introduction and short group exchange that recycle country/nationality, study/work status, languages, and interests. Do not add major new grammar.

**Learner outcome:** Discuss interests and a simple routine, make or respond to a plan, and give a short introduction that sustains a basic exchange. Run the Required Quality Check for this lesson.

## Implementation Step 4: Connect and Verify the Course

Update the Communication Basics path to show the three lessons in order. Reuse the three existing lesson IDs, set previous/next navigation correctly, and align path titles, descriptions, duration estimates, and availability with the lesson data. Ensure visible path text is available in Ukrainian and English.

**Acceptance checks:**

- Each lesson meets its learner outcome and passes the Required Quality Check above.
- Dialogue contains Italian only; translations are in their own Ukrainian and English fields.
- Pronunciation guides are either verified and appropriate for the interface language or omitted.
- Stories, dialogue, vocabulary, audio, and practice agree with each other and with character facts.
- Lessons use section types supported by `frontend/public/js/lesson-engine.js`.
- Lesson navigation is sequential, with no missing IDs or dead ends.
- The three lessons build toward a practical introduction without unnecessary topic-only lessons.

## Implementation Files

- `frontend/public/js/data/lessons.js` — lesson story, dialogue, vocabulary, translations, and activities.
- `frontend/public/js/path.js` — course path titles, descriptions, ordering, and availability.
- `frontend/public/js/lesson-engine.js` — existing section renderers; change only if a required interaction cannot be built with them.