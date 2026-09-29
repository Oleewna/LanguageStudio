function openSidebar(){
  document.getElementById('sidebar').classList.add('open');
  document.getElementById('sbOverlay').classList.add('open');
}
function closeSidebar(){
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sbOverlay').classList.remove('open');
}
function updateLessonCharacterNames() {
  const studentName = getSourceTranslation('lesson.character.student');
  const studentItalianName = getSourceTranslation('lesson.character.student.italian');
  const teacherName = getSourceTranslation('lesson.character.teacher');
  const teacherItalianName = getSourceTranslation('lesson.character.teacher.italian');

  document.querySelectorAll('.dialogue-name').forEach((element, index) => {
    element.textContent = index % 2 === 0 ? studentName : teacherName;
  });
  document.querySelectorAll('.dialogue-avatar').forEach((element, index) => {
    element.textContent = index % 2 === 0 ? studentName[0] : teacherName[0];
  });
  document.querySelectorAll('.dialogue-it').forEach(element => {
    if (!element.dataset.originalText) element.dataset.originalText = element.innerHTML;
    element.innerHTML = element.dataset.originalText
      .replace(/\b(?:Sara|Sofia|Emily)\b/g, studentItalianName)
      .replace(/\b(?:Anna|Olena|Jessica)\b/g, teacherItalianName);
  });

  const phoneticLines = document.querySelectorAll('.dialogue-phon');
  const english = getSourceLanguage() === 'en';
  if (phoneticLines[2]) phoneticLines[2].textContent = english ? '[mee KYAH-moh EH-mee-lee. eh too]' : '[мі к’я-мо Со-Фі-я. е ту]';
  if (phoneticLines[3]) phoneticLines[3].textContent = english ? '[EE-oh SOH-noh JESS-ee-kah. pyah-CHEH-reh]' : '[і-о со-но О-ле-на. п’я-че-ре]';
  if (phoneticLines[4]) phoneticLines[4].textContent = english ? '[pyah-CHEH-reh, JESS-ee-kah]' : '[п’я-че-ре, О-ле-на]';

  const teacherExercise = Array.from(document.querySelectorAll('#exercises + .card .task'))
    .find(task => task.textContent.includes('Io ___'));
  const teacherExerciseText = Array.from(teacherExercise?.childNodes || [])
    .find(node => node.nodeType === Node.TEXT_NODE && node.nodeValue.includes('Io ___'));
  if (teacherExerciseText) {
    teacherExerciseText.nodeValue = teacherExerciseText.nodeValue
      .replace(/\b(?:Anna|Olena|Jessica)\b/g, teacherItalianName);
  }
}

updateLessonCharacterNames();
window.addEventListener('sourceLanguageChanged', updateLessonCharacterNames);

function gradeLessonTasks() {
  const choiceAnswers = {
    q1: getSourceTranslation('lesson.exercise.q1.a'),
    q2: getSourceTranslation('lesson.exercise.q2.a'),
    q3: 'Piacere',
    q4: getSourceTranslation('lesson.exercise.q4.a'),
    q5: 'Prego',
    q6: getSourceTranslation('lesson.yes'),
    q7: getSourceTranslation('lesson.no'),
    q8: getSourceTranslation('lesson.yes')
  };
  const textAnswers = [
    { value: () => getSourceTranslation('lesson.character.student.italian') },
    { value: () => 'sono' },
    { value: () => 'Benvenuta' },
    { value: () => 'Prego' }
  ];
  const taskRoot = document.getElementById('exercises').nextElementSibling;
  const allTasks = Array.from(taskRoot.querySelectorAll('.task'));
  const choiceNames = Object.keys(choiceAnswers);
  const textInputs = Array.from(taskRoot.querySelectorAll('input[type="text"]'));
  const unanswered = choiceNames.some(name => !taskRoot.querySelector(`input[name="${name}"]:checked`)) || textInputs.some(input => !input.value.trim());
  const result = document.getElementById('taskResult');

  if (unanswered) {
    result.textContent = getSourceLanguage() === 'en' ? 'Answer all 12 questions before checking.' : 'Дайте відповідь на всі 12 завдань перед перевіркою.';
    result.className = 'task-result task-result-warning';
    return;
  }

  let correctCount = 0;
  allTasks.forEach(task => {
    task.classList.remove('task-correct', 'task-incorrect');
    task.querySelector('.task-feedback')?.remove();
  });

  choiceNames.forEach(name => {
    const selected = taskRoot.querySelector(`input[name="${name}"]:checked`).parentElement.textContent.trim();
    const isCorrect = selected === choiceAnswers[name];
    showTaskFeedback(taskRoot.querySelector(`input[name="${name}"]`).closest('.task'), isCorrect, choiceAnswers[name]);
    correctCount += Number(isCorrect);
  });

  textInputs.forEach((input, index) => {
    const normalized = input.value.trim().toLowerCase().replace(/\s+/g, ' ');
    const correctAnswer = textAnswers[index].value();
    const isCorrect = normalized === correctAnswer.toLowerCase();
    showTaskFeedback(input.closest('.task'), isCorrect, correctAnswer);
    correctCount += Number(isCorrect);
  });

  const total = choiceNames.length + textInputs.length;
  const earnedXP = Math.round((correctCount / total) * 30);
  const scoreKey = 'ls_unit_1_lesson_1_best_xp';
  const previousBest = Number(localStorage.getItem(scoreKey) || '0');
  const xpToAdd = Math.max(0, earnedXP - previousBest);
  if (xpToAdd > 0) {
    localStorage.setItem(scoreKey, String(earnedXP));
    addXP(xpToAdd);
  }

  result.textContent = getSourceLanguage() === 'en'
    ? `${correctCount}/${total} correct. ${xpToAdd > 0 ? `Added ${xpToAdd} XP.` : `Your best score is already saved (${previousBest} XP).`}`
    : `${correctCount}/${total} правильних. ${xpToAdd > 0 ? `Додано ${xpToAdd} XP.` : `Ваш найкращий результат уже враховано (${previousBest} XP).`}`;
  result.className = `task-result ${correctCount === total ? 'task-result-success' : 'task-result-info'}`;
}

function showTaskFeedback(task, isCorrect, correctAnswer) {
  task.classList.add(isCorrect ? 'task-correct' : 'task-incorrect');
  const feedback = document.createElement('div');
  feedback.className = 'task-feedback';
  feedback.textContent = isCorrect ? (getSourceLanguage() === 'en' ? '✓ Correct' : '✓ Правильно') : `${getSourceLanguage() === 'en' ? 'Correct answer:' : 'Правильна відповідь:'} ${correctAnswer}`;
  task.appendChild(feedback);
}

document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-communication-basics-lesson-1-1]');
  if (!target) return;
  var result = (function(event) {
closeMobNav()
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-communication-basics-lesson-1-2]');
  if (!target) return;
  var result = (function(event) {
closeMobNav()
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-communication-basics-lesson-1-3]');
  if (!target) return;
  var result = (function(event) {
location.href='../pages/path.html'
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-communication-basics-lesson-1-4]');
  if (!target) return;
  var result = (function(event) {
location.href='../pages/flashcards.html'
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-communication-basics-lesson-1-5]');
  if (!target) return;
  var result = (function(event) {
location.href='../pages/exercises.html'
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-communication-basics-lesson-1-6]');
  if (!target) return;
  var result = (function(event) {
location.href='../pages/dictionary.html'
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});


document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-communication-basics-lesson-1-8]');
  if (!target) return;
  var result = (function(event) {
location.href='../pages/grammar.html'
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-communication-basics-lesson-1-9]');
  if (!target) return;
  var result = (function(event) {
toggleTheme()
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-communication-basics-lesson-1-10]');
  if (!target) return;
  var result = (function(event) {
openProfileModal()
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-communication-basics-lesson-1-11]');
  if (!target) return;
  var result = (function(event) {
openMobNav()
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-communication-basics-lesson-1-12]');
  if (!target) return;
  var result = (function(event) {
closeSidebar()
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-communication-basics-lesson-1-13]');
  if (!target) return;
  var result = (function(event) {
openSidebar()
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-communication-basics-lesson-1-14]');
  if (!target) return;
  var result = (function(event) {
speak('Buongiorno!', this)
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-communication-basics-lesson-1-15]');
  if (!target) return;
  var result = (function(event) {
speak('Come ti chiami?', this)
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-communication-basics-lesson-1-16]');
  if (!target) return;
  var result = (function(event) {
speak(`Mi chiamo ${getSourceTranslation('lesson.character.student.italian')}. E tu?`, this)
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-communication-basics-lesson-1-17]');
  if (!target) return;
  var result = (function(event) {
speak(`Io sono ${getSourceTranslation('lesson.character.teacher.italian')}. Piacere!`, this)
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-communication-basics-lesson-1-18]');
  if (!target) return;
  var result = (function(event) {
speak(`Piacere, ${getSourceTranslation('lesson.character.teacher.italian')}!`, this)
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-communication-basics-lesson-1-19]');
  if (!target) return;
  var result = (function(event) {
speak('Sei nuova qui?', this)
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-communication-basics-lesson-1-20]');
  if (!target) return;
  var result = (function(event) {
gradeLessonTasks()
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});
