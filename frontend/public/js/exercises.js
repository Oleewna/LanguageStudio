(() => {
  const DEFAULT_FORMATS = ['mcq', 'blank', 'match', 'reorder', 'listen', 'dialogue', 'dict'];
  const DEFAULT_XP = {
    mcq: 15,
    blank: 10,
    match: 20,
    reorder: 10,
    listen: 10,
    dialogue: 15,
    dict: 10
  };

  let activeCategoryFilter = 'all';
  let currentTab = 'mcq';
  const answeredState = {};
  let taskBank = [];
  let categoryMap = {};
  let runtimeFormats = [...DEFAULT_FORMATS];
  let currentMatchTask = null;
  let currentMatchData = [];
  let matchSelected = { it: null, target: null };
  let matchFoundCount = 0;
  const reorderStateMap = {};

  function getLang() {
    return typeof getSourceLanguage === 'function' ? getSourceLanguage() : 'uk';
  }

  function getText(value, fallback = '') {
    if (value === null || typeof value === 'undefined') return fallback;
    if (typeof value === 'string') return value;
    if (Array.isArray(value)) return value.map(item => getText(item)).join(', ');
    if (typeof value === 'object') {
      const lang = getLang();
      return value[lang] || value.uk || value.en || fallback;
    }
    return String(value || fallback);
  }

  function normalizeExerciseTask(task) {
    if (!task || !task.id || !task.format) return null;
    const normalized = { ...task };
    normalized.category = normalized.category || 'general';
    normalized.xp = typeof normalized.xp === 'number' ? normalized.xp : (DEFAULT_XP[normalized.format] || 10);

    if (normalized.question && typeof normalized.question === 'string') {
      normalized.question = { uk: normalized.question, en: normalized.question };
    }
    if (normalized.prompt && typeof normalized.prompt === 'string') {
      normalized.prompt = { uk: normalized.prompt, en: normalized.prompt };
    }
    if (normalized.title && typeof normalized.title === 'string') {
      normalized.title = { uk: normalized.title, en: normalized.title };
    }
    if (normalized.instruction && typeof normalized.instruction === 'string') {
      normalized.instruction = { uk: normalized.instruction, en: normalized.instruction };
    }
    if (normalized.clue && typeof normalized.clue === 'string') {
      normalized.clue = { uk: normalized.clue, en: normalized.clue };
    }

    if (normalized.options && Array.isArray(normalized.options)) {
      normalized.options = normalized.options.map((option) => {
        if (!option) return option;
        const safeOption = { ...option };
        if (typeof safeOption.text === 'string') {
          safeOption.text = { uk: safeOption.text, en: safeOption.text };
        }
        return safeOption;
      });
    }

    if (normalized.pairs && Array.isArray(normalized.pairs)) {
      normalized.pairs = normalized.pairs.map((pair) => {
        if (!pair) return pair;
        const nextPair = { ...pair };
        if (!nextPair.trans && (nextPair.ua || nextPair.en)) {
          nextPair.trans = { uk: nextPair.ua || '', en: nextPair.en || '' };
        }
        if (nextPair.trans && typeof nextPair.trans === 'string') {
          nextPair.trans = { uk: nextPair.trans, en: nextPair.trans };
        }
        return nextPair;
      });
    }

    return normalized;
  }

  function getCategoryInfo(catKey) {
    const fallback = { id: catKey, group: 'grammar', icon: 'layers', name: { uk: catKey, en: catKey } };
    return categoryMap[catKey] || fallback;
  }

  function getCategoryLabel(catKey) {
    const info = getCategoryInfo(catKey);
    const label = getText(info.name, catKey);
    return `${getIconSvg(info.icon || 'layers')} ${label}`;
  }

  function getAllowedFormats(course = {}) {
    if (course && course.features && Array.isArray(course.features.exerciseFormats) && course.features.exerciseFormats.length) {
      return course.features.exerciseFormats.filter(Boolean);
    }
    return [...DEFAULT_FORMATS];
  }

  function buildCategoryMap(courseCategories = []) {
    const map = {};
    (courseCategories || []).forEach((item) => {
      if (!item || !item.id) return;
      map[item.id] = {
        ...item,
        group: item.group || 'grammar',
        icon: item.icon || 'layers',
        name: item.name || { uk: item.title || item.id, en: item.title || item.id }
      };
    });

    taskBank.forEach((task) => {
      if (!map[task.category]) {
        map[task.category] = {
          id: task.category,
          group: 'grammar',
          icon: 'layers',
          name: { uk: task.category, en: task.category }
        };
      }
    });

    return map;
  }

  function renderCategoryPills() {
    const wrap = document.getElementById('catPillsWrap');
    if (!wrap) return;

    const visibleCategories = Array.from(new Set([
      'all',
      ...Object.keys(categoryMap),
      ...taskBank.map(task => task.category)
    ])).filter(Boolean);

    const html = visibleCategories.map((catId) => {
      if (catId === 'all') {
        return `<button class="cat-pill active" data-cat="all"><span data-icon="globe"></span> ${getText({ uk: 'Усі категорії', en: 'All categories' })}</button>`;
      }
      const info = getCategoryInfo(catId);
      return `<button class="cat-pill" data-cat="${catId}">${getIconSvg(info.icon || 'layers')} ${getText(info.name, catId)}</button>`;
    }).join('');

    wrap.innerHTML = html;
    wrap.querySelectorAll('.cat-pill').forEach((button) => {
      button.addEventListener('click', () => setCategoryFilter(button.dataset.cat));
    });
  }

  function renderFormatTabs() {
    const tabs = document.querySelector('.task-tabs');
    if (!tabs) return;

    const labels = {
      mcq: { uk: 'Вибір відповіді', en: 'Multiple choice' },
      blank: { uk: 'Заповни пропуск', en: 'Fill in the blank' },
      match: { uk: 'Зіставлення слів', en: 'Word matching' },
      reorder: { uk: 'Порядок слів', en: 'Sentence builder' },
      listen: { uk: 'Аудіювання', en: 'Listening' },
      dialogue: { uk: 'Діалог', en: 'Dialogue' },
      dict: { uk: 'Зі словника', en: 'From dictionary' }
    };

    const iconMap = {
      mcq: 'mcq',
      blank: 'blank',
      match: 'match',
      reorder: 'reorder',
      listen: 'listen',
      dialogue: 'chat',
      dict: 'from-dictionary'
    };

    tabs.innerHTML = runtimeFormats.map((format) => {
      const label = labels[format] || { uk: format, en: format };
      const icon = getIconSvg(iconMap[format] || 'layers');
      const activeClass = format === currentTab ? 'active' : '';
      return `<button class="task-tab ${activeClass}" data-tab="${format}">${icon} ${getText(label)}</button>`;
    }).join('');

    tabs.querySelectorAll('.task-tab').forEach((button) => {
      button.addEventListener('click', () => showTaskTab(button.dataset.tab));
    });

    document.querySelectorAll('.task-panel').forEach((panel) => {
      panel.classList.toggle('active', panel.id === `panel-${currentTab}`);
    });
  }

  function setCategoryFilter(cat) {
    activeCategoryFilter = cat;
    document.querySelectorAll('.cat-pill').forEach((button) => {
      button.classList.toggle('active', button.dataset.cat === cat);
    });
    applyFiltersAndSort();
  }

  function showTaskTab(name) {
    if (!runtimeFormats.includes(name)) return;
    currentTab = name;
    renderFormatTabs();

    if (name === 'match') {
      renderMatchingPanel();
    } else if (name === 'reorder') {
      renderReorderPanel();
    } else if (name === 'dict') {
      generateDictQuiz();
    } else {
      applyFiltersAndSort();
    }
  }

  function applyFiltersAndSort() {
    const groupFilter = document.getElementById('groupFilterSelect');
    const groupVal = groupFilter ? groupFilter.value : 'all';
    const searchInput = document.getElementById('searchInput');
    const searchVal = searchInput ? searchInput.value.trim().toLowerCase() : '';

    const filtered = taskBank.filter((task) => {
      if (task.format !== currentTab) return false;
      if (activeCategoryFilter !== 'all' && task.category !== activeCategoryFilter) return false;

      const catInfo = getCategoryInfo(task.category);
      if (groupVal !== 'all' && catInfo.group !== groupVal) return false;

      if (searchVal) {
        const qText = getText(task.question || task.prompt || task.title || task.lineA || '').toLowerCase();
        const catText = getText(catInfo.name || '').toLowerCase();
        if (!qText.includes(searchVal) && !catText.includes(searchVal)) return false;
      }

      return true;
    });

    const summary = document.getElementById('activeFilterSummary');
    if (summary) {
      summary.textContent = `${getText({ uk: 'Знайдено', en: 'Showing' })}: ${filtered.length} ${getText({ uk: 'вправ', en: 'exercises' })}`;
    }

    if (currentTab === 'mcq') renderMCQPanel(filtered);
    else if (currentTab === 'blank') renderBlankPanel(filtered);
    else if (currentTab === 'listen') renderListenPanel(filtered);
    else if (currentTab === 'dialogue') renderDialoguePanel(filtered);
    else if (currentTab === 'match') renderMatchingPanel(filtered);
    else if (currentTab === 'reorder') renderReorderPanel(filtered);
  }

  function groupByCategory(items) {
    const groups = {};
    items.forEach((item) => {
      const cat = item.category || 'general';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(item);
    });
    return groups;
  }

  function renderCategoryHeader(catKey, count) {
    return `
      <div class="category-section-title">
        <span>${getCategoryLabel(catKey)}</span>
        <span class="category-section-count">${count} ${getText({ uk: 'завдань', en: 'exercises' })}</span>
      </div>
    `;
  }

  function renderEmptyState() {
    return `
      <div class="empty-state">
        <div class="empty-state-icon">${getIconSvg('search')}</div>
        <h3>${getText({ uk: 'Вправ не знайдено', en: 'No exercises found' })}</h3>
        <p>${getText({ uk: 'Спробуйте змінити категорії або скинути фільтри.', en: 'Try adjusting your filters or search keywords.' })}</p>
      </div>
    `;
  }

  function renderMCQPanel(items) {
    const container = document.getElementById('container-mcq');
    if (!container) return;
    if (!items.length) { container.innerHTML = renderEmptyState(); return; }

    const groups = groupByCategory(items);
    let html = '';
    Object.keys(groups).forEach((catKey) => {
      html += renderCategoryHeader(catKey, groups[catKey].length);
      groups[catKey].forEach((task, idx) => {
        const catName = getCategoryLabel(task.category);
        const prompt = getText(task.question || task.prompt || '');
        html += `
          <div class="quiz-card" id="card-${task.id}">
            <div class="card-meta-header">
              <div class="card-tags"><span class="badge-cat">${catName}</span></div>
              <div class="quiz-q-num">${getText({ uk: 'Питання', en: 'Question' })} ${idx + 1}</div>
            </div>
            <div class="quiz-question">${prompt}</div>
            <div class="quiz-options">
              ${task.options.map((opt, oIdx) => `
                <div class="quiz-opt" data-correct="${Boolean(opt.correct)}" onclick="handleMCQClick('${task.id}', ${oIdx}, ${Boolean(opt.correct)}, this)">
                  ${getText(opt.text || '')}
                </div>
              `).join('')}
            </div>
            <div class="quiz-feedback" id="fb-${task.id}"></div>
          </div>
        `;
      });
    });
    container.innerHTML = html;
  }

  function handleMCQClick(taskId, optIdx, isCorrect, el) {
    if (answeredState[taskId]) return;
    answeredState[taskId] = true;

    const card = document.getElementById(`card-${taskId}`);
    const task = taskBank.find((item) => item.id === taskId);
    const opts = card ? card.querySelectorAll('.quiz-opt') : [];
    const fb = document.getElementById(`fb-${taskId}`);

    opts.forEach((option) => {
      option.style.pointerEvents = 'none';
    });

    if (isCorrect) {
      el.classList.add('correct');
      const xpValue = typeof task?.xp === 'number' ? task.xp : (DEFAULT_XP[task?.format] || 10);
      fb.className = 'quiz-feedback show-correct';
      fb.innerHTML = `${getIconSvg('sparkles')} <b>${getText({ uk: 'Чудово!', en: 'Great!' })}</b> ${getText({ uk: 'Правильна відповідь.', en: 'Correct answer.' })} (+${xpValue} XP)`;
      if (typeof addXP === 'function') addXP(xpValue);
    } else {
      el.classList.add('wrong');
      const correctOpt = [...opts].find((option) => option.dataset.correct === 'true');
      if (correctOpt) correctOpt.classList.add('correct');
      fb.className = 'quiz-feedback show-wrong';
      fb.innerHTML = `${getIconSvg('wrong')} <b>${getText({ uk: 'Не зовсім.', en: 'Not quite.' })}</b> ${getText({ uk: 'Подивіться правильний варіант вище.', en: 'The correct answer is highlighted.' })}`;
    }

    if (task && task.explanation) {
      fb.innerHTML += `<div class="quiz-explanation">${getIconSvg('lightbulb')} <b>${getText({ uk: 'Пояснення:', en: 'Explanation:' })}</b> ${getText(task.explanation)}</div>`;
    }
  }

  function renderBlankPanel(items) {
    const container = document.getElementById('container-blank');
    if (!container) return;
    if (!items.length) { container.innerHTML = renderEmptyState(); return; }

    const groups = groupByCategory(items);
    let html = '';
    Object.keys(groups).forEach((catKey) => {
      html += renderCategoryHeader(catKey, groups[catKey].length);
      groups[catKey].forEach((task) => {
        const catName = getCategoryLabel(task.category);
        html += `
          <div class="quiz-card" id="card-${task.id}">
            <div class="card-meta-header">
              <div class="card-tags"><span class="badge-cat">${catName}</span></div>
              <div class="quiz-q-num">${getText({ uk: 'Заповніть пропуск', en: 'Fill in the blank' })}</div>
            </div>
            <div class="quiz-question">${getText(task.question || task.prompt || '')}</div>
            ${task.hint ? `<div class="quiz-hint">${getText(task.hint)}</div>` : ''}
            <div class="fill-input-row">
              <input type="text" class="text-answer-input" id="input-${task.id}" placeholder="${getText({ uk: 'Впишіть слово...', en: 'Type answer...' })}" />
              <button class="btn-primary" onclick="handleBlankCheck('${task.id}')">${getText({ uk: 'Перевірити', en: 'Check' })}</button>
            </div>
            <div class="quiz-feedback" id="fb-${task.id}"></div>
          </div>
        `;
      });
    });
    container.innerHTML = html;
  }

  function handleBlankCheck(taskId) {
    if (answeredState[taskId]) return;

    const task = taskBank.find((item) => item.id === taskId);
    const input = document.getElementById(`input-${taskId}`);
    const fb = document.getElementById(`fb-${taskId}`);
    if (!task || !input || !fb) return;

    const val = input.value.trim().toLowerCase();
    const validAnswers = (task.answers || [task.answer || '']).map((answer) => String(answer || '').toLowerCase());

    if (validAnswers.includes(val)) {
      answeredState[taskId] = true;
      input.disabled = true;
      const xpValue = typeof task.xp === 'number' ? task.xp : (DEFAULT_XP[task.format] || 10);
      fb.className = 'quiz-feedback show-correct';
      fb.innerHTML = `${getIconSvg('sparkles')} <b>${getText({ uk: 'Правильно!', en: 'Correct!' })}</b> (+${xpValue} XP)`;
      if (typeof addXP === 'function') addXP(xpValue);
    } else {
      fb.className = 'quiz-feedback show-wrong';
      const answerText = Array.isArray(task.answers) ? task.answers[0] : task.answer || '';
      fb.innerHTML = `${getIconSvg('wrong')} <b>${getText({ uk: 'Спробуйте ще раз.', en: 'Try again.' })}</b> (${getText({ uk: 'Правильна відповідь:', en: 'Correct:' })} <b>${answerText}</b>)`;
    }

    if (task.explanation) {
      fb.innerHTML += `<div class="quiz-explanation">${getIconSvg('lightbulb')} <b>${getText({ uk: 'Пояснення:', en: 'Explanation:' })}</b> ${getText(task.explanation)}</div>`;
    }
  }

  function renderListenPanel(items) {
    const container = document.getElementById('container-listen');
    if (!container) return;
    if (!items.length) { container.innerHTML = renderEmptyState(); return; }

    const groups = groupByCategory(items);
    let html = '';
    Object.keys(groups).forEach((catKey) => {
      html += renderCategoryHeader(catKey, groups[catKey].length);
      groups[catKey].forEach((task) => {
        const catName = getCategoryLabel(task.category);
        html += `
          <div class="quiz-card" id="card-${task.id}">
            <div class="card-meta-header">
              <div class="card-tags"><span class="badge-cat">${catName}</span></div>
              <div class="quiz-q-num">${getText({ uk: 'Аудіювання', en: 'Listening Practice' })}</div>
            </div>
            <div class="quiz-question">
              <button class="audio-btn" onclick="speak('${task.audioWord || ''}', this)" title="Listen to Italian word">${getIconSvg('audio')}</button>
              <span>${getText(task.instruction || '')}</span>
            </div>
            <div class="quiz-options">
              ${task.options.map((opt, oIdx) => `
                <div class="quiz-opt" data-correct="${Boolean(opt.correct)}" onclick="handleMCQClick('${task.id}', ${oIdx}, ${Boolean(opt.correct)}, this)">
                  ${getText(opt.text || '')}
                </div>
              `).join('')}
            </div>
            <div class="quiz-feedback" id="fb-${task.id}"></div>
          </div>
        `;
      });
    });
    container.innerHTML = html;
  }

  function renderDialoguePanel(items) {
    const container = document.getElementById('container-dialogue');
    if (!container) return;
    if (!items.length) { container.innerHTML = renderEmptyState(); return; }

    const groups = groupByCategory(items);
    let html = '';
    Object.keys(groups).forEach((catKey) => {
      html += renderCategoryHeader(catKey, groups[catKey].length);
      groups[catKey].forEach((task) => {
        const catName = getCategoryLabel(task.category);
        html += `
          <div class="quiz-card" id="card-${task.id}">
            <div class="card-meta-header">
              <div class="card-tags"><span class="badge-cat">${catName}</span></div>
              <div class="quiz-q-num">${getText({ uk: 'Практика діалогу', en: 'Interactive Dialogue' })}</div>
            </div>
            <div class="quiz-question">
              <div>${getIconSvg('user')} ${task.lineA || ''}</div>
              <div>${getIconSvg('user')} ${getText(task.instruction || '')}</div>
            </div>
            <div class="quiz-options">
              ${task.options.map((opt, oIdx) => `
                <div class="quiz-opt" data-correct="${Boolean(opt.correct)}" onclick="handleMCQClick('${task.id}', ${oIdx}, ${Boolean(opt.correct)}, this)">
                  ${getIconSvg('chat')} ${getText(opt.text || '')}
                </div>
              `).join('')}
            </div>
            <div class="quiz-feedback" id="fb-${task.id}"></div>
          </div>
        `;
      });
    });
    container.innerHTML = html;
  }

  function renderMatchingPanel(filteredItems) {
    const container = document.getElementById('container-match');
    if (!container) return;

    const matchTasks = (filteredItems && filteredItems.length ? filteredItems : taskBank).filter((task) => task.format === 'match');
    if (!matchTasks.length) { container.innerHTML = renderEmptyState(); return; }

    const task = matchTasks[0];
    currentMatchTask = task;
    currentMatchData = (task.pairs || []).map((pair, index) => ({
      id: pair.id || `${task.id}-${index}`,
      it: pair.it || pair.word || '',
      trans: pair.trans || { uk: pair.ua || '', en: pair.en || pair.target || '' }
    }));
    matchSelected = { it: null, target: null };
    matchFoundCount = 0;

    const shuffledIt = [...currentMatchData].sort(() => Math.random() - 0.5);
    const shuffledTarget = [...currentMatchData].sort(() => Math.random() - 0.5);

    container.innerHTML = `
      <div class="quiz-card">
        <div class="card-meta-header">
          <div class="card-tags"><span class="badge-cat">${getText({ uk: 'Зіставлення слів', en: 'Word Matching' })}</span></div>
          <div class="quiz-q-num">${getText(task.title || { uk: 'Зіставлення', en: 'Matching' })}</div>
        </div>
        <div class="quiz-question">${getText({ uk: 'Натисніть італійське слово, а потім відповідний переклад', en: 'Select an Italian word, then select its translation' })}</div>
        <div class="match-wrap">
          <div class="match-col" id="matchColIt">
            ${shuffledIt.map((m) => `<div class="match-item" data-id="${m.id}" data-side="it" onclick="selectMatchItem(this)">${m.it}</div>`).join('')}
          </div>
          <div class="match-col" id="matchColTarget">
            ${shuffledTarget.map((m) => `<div class="match-item" data-id="${m.id}" data-side="target" onclick="selectMatchItem(this)">${getText(m.trans || '')}</div>`).join('')}
          </div>
        </div>
        <div class="match-status" id="matchStatus">${getText({ uk: 'Знайдено пар', en: 'Pairs found' })}: 0/${currentMatchData.length}</div>
        <div>
          <button class="btn-ghost" onclick="renderMatchingPanel()">${getIconSvg('shuffle')} ${getText({ uk: 'Перемішати заново', en: 'Shuffle again' })}</button>
        </div>
      </div>
    `;
  }

  function selectMatchItem(el) {
    const side = el.dataset.side;
    if (el.classList.contains('matched')) return;

    if (matchSelected[side]) matchSelected[side].classList.remove('selected');
    el.classList.add('selected');
    matchSelected[side] = el;

    if (matchSelected.it && matchSelected.target) {
      const itEl = matchSelected.it;
      const targetEl = matchSelected.target;

      if (itEl.dataset.id === targetEl.dataset.id) {
        itEl.classList.remove('selected');
        targetEl.classList.remove('selected');
        itEl.classList.add('matched');
        targetEl.classList.add('matched');
        matchFoundCount += 1;

        const statusEl = document.getElementById('matchStatus');
        if (statusEl) {
          statusEl.textContent = `${getText({ uk: 'Знайдено пар', en: 'Pairs found' })}: ${matchFoundCount}/${currentMatchData.length}`;
        }

        matchSelected = { it: null, target: null };

        if (matchFoundCount === currentMatchData.length) {
          const xpValue = typeof currentMatchTask?.xp === 'number' ? currentMatchTask.xp : (DEFAULT_XP.match || 20);
          if (typeof addXP === 'function') addXP(xpValue);
          if (statusEl) {
            statusEl.innerHTML += ` ${getIconSvg('sparkles')} <b>${getText({ uk: 'Всі пари знайдено!', en: 'All pairs matched!' })}</b> (+${xpValue} XP)`;
          }
        }
      } else {
        itEl.classList.add('wrong');
        targetEl.classList.add('wrong');
        setTimeout(() => {
          itEl.classList.remove('selected', 'wrong');
          targetEl.classList.remove('selected', 'wrong');
          matchSelected = { it: null, target: null };
        }, 600);
      }
    }
  }

  function renderReorderPanel(filteredItems) {
    const container = document.getElementById('container-reorder');
    if (!container) return;

    const items = (filteredItems && filteredItems.length ? filteredItems : taskBank).filter((task) => task.format === 'reorder');
    if (!items.length) { container.innerHTML = renderEmptyState(); return; }

    container.innerHTML = items.map((task) => {
      if (!reorderStateMap[task.id]) {
        reorderStateMap[task.id] = {
          pool: [...task.words].sort(() => Math.random() - 0.5),
          answer: []
        };
      }

      return `
        <div class="quiz-card" id="card-${task.id}">
          <div class="card-meta-header">
            <div class="card-tags"><span class="badge-cat">${getCategoryLabel(task.category)}</span></div>
            <div class="quiz-q-num">${getText({ uk: 'Складіть речення', en: 'Build the sentence' })}</div>
          </div>
          <div class="quiz-question">${getIconSvg('chat')} «${getText(task.clue || '')}»</div>
          <div class="reorder-answer" id="ans-${task.id}"></div>
          <div class="reorder-pool" id="pool-${task.id}"></div>
          <div class="reorder-actions">
            <button class="btn-primary" onclick="checkReorderSentence('${task.id}')">${getText({ uk: 'Перевірити', en: 'Check' })}</button>
            <button class="btn-ghost" onclick="resetReorderSentence('${task.id}')">${getText({ uk: 'Скинути', en: 'Reset' })}</button>
          </div>
          <div class="quiz-feedback" id="fb-${task.id}"></div>
        </div>
      `;
    }).join('');

    items.forEach((task) => drawReorderChips(task.id));
  }

  function drawReorderChips(id) {
    const state = reorderStateMap[id];
    if (!state) return;

    const poolEl = document.getElementById(`pool-${id}`);
    const ansEl = document.getElementById(`ans-${id}`);
    if (!poolEl || !ansEl) return;

    poolEl.innerHTML = state.pool.map((word, idx) => `<span class="reorder-chip" onclick="moveChipToAnswer('${id}', ${idx})">${word}</span>`).join('');
    ansEl.innerHTML = state.answer.length
      ? state.answer.map((word, idx) => `<span class="reorder-chip answer-chip" onclick="moveChipToPool('${id}', ${idx})">${word}</span>`).join('')
      : `<span>${getText({ uk: 'Натисніть слова знизу, щоб скласти речення', en: 'Click words below to assemble sentence' })}</span>`;
  }

  function moveChipToAnswer(id, idx) {
    const state = reorderStateMap[id];
    if (!state) return;
    const [word] = state.pool.splice(idx, 1);
    if (word) state.answer.push(word);
    drawReorderChips(id);
  }

  function moveChipToPool(id, idx) {
    const state = reorderStateMap[id];
    if (!state) return;
    const [word] = state.answer.splice(idx, 1);
    if (word) state.pool.push(word);
    drawReorderChips(id);
  }

  function resetReorderSentence(id) {
    const task = taskBank.find((item) => item.id === id);
    if (!task) return;

    reorderStateMap[id] = {
      pool: [...task.words].sort(() => Math.random() - 0.5),
      answer: []
    };

    const fb = document.getElementById(`fb-${id}`);
    if (fb) {
      fb.className = 'quiz-feedback';
      fb.innerHTML = '';
    }

    delete answeredState[id];
    drawReorderChips(id);
  }

  function checkReorderSentence(id) {
    if (answeredState[id]) return;

    const task = taskBank.find((item) => item.id === id);
    const state = reorderStateMap[id];
    const fb = document.getElementById(`fb-${id}`);
    if (!task || !state || !fb) return;

    const xpValue = typeof task.xp === 'number' ? task.xp : (DEFAULT_XP[task.format] || 10);

    if (state.answer.join(' ') === task.words.join(' ')) {
      answeredState[id] = true;
      fb.className = 'quiz-feedback show-correct';
      fb.innerHTML = `${getIconSvg('sparkles')} <b>${getText({ uk: 'Правильно!', en: 'Correct!' })}</b> (+${xpValue} XP)`;
      if (typeof addXP === 'function') addXP(xpValue);
    } else {
      fb.className = 'quiz-feedback show-wrong';
      fb.innerHTML = `${getIconSvg('wrong')} <b>${getText({ uk: 'Ще не так.', en: 'Not quite right.' })}</b> ${getText({ uk: 'Спробуйте ще раз.', en: 'Check the word order.' })}`;
    }

    if (task.explanation) {
      fb.innerHTML += `<div class="quiz-explanation">${getIconSvg('lightbulb')} <b>${getText({ uk: 'Пояснення:', en: 'Explanation:' })}</b> ${getText(task.explanation)}</div>`;
    }
  }

  const DICT_KEY = typeof window.courseKey === 'function' ? window.courseKey('custom_dict') : 'ls_custom_dict';

  async function getAllDictWords() {
    let custom = [];
    if (typeof window.getJSON === 'function') {
      custom = Array.isArray(window.getJSON(DICT_KEY, [])) ? window.getJSON(DICT_KEY, []) : [];
    } else {
      try {
        custom = JSON.parse(localStorage.getItem(DICT_KEY) || '[]');
      } catch (error) {
        custom = [];
      }
    }

    let baseWords = [];
    if (typeof window.loadCourseData === 'function') {
      try {
        const data = await window.loadCourseData('vocab');
        baseWords = Array.isArray(data) ? data : [];
      } catch (error) {
        baseWords = [];
      }
    }

    return [
      ...baseWords.map((word) => ({ word: word.word, trans: getText(word.trans, '') })),
      ...custom.map((entry) => ({ word: entry.word, trans: getText(entry.trans || '', entry.trans || '') }))
    ];
  }

  async function generateDictQuiz() {
    const container = document.getElementById('dictQuizContainer');
    if (!container) return;

    const pool = await getAllDictWords();
    if (pool.length < 3) {
      container.textContent = getText({ uk: 'Додайте більше слів у словник, щоб згенерувати тест (мінімум 3).', en: 'Add more words to your dictionary to generate a quiz (at least 3).' });
      return;
    }

    const qCount = Math.min(5, pool.length);
    const chosen = [...pool].sort(() => Math.random() - 0.5).slice(0, qCount);

    container.innerHTML = chosen.map((question, idx) => {
      const distractors = [...pool.filter((item) => item.word !== question.word)].sort(() => Math.random() - 0.5).slice(0, 2);
      const options = [...[{ ...question, correct: true }], ...distractors.map((item) => ({ ...item, correct: false }))].sort(() => Math.random() - 0.5);
      const qid = `dq_${Date.now()}_${idx}`;

      return `
        <div class="quiz-card" id="card-${qid}">
          <div class="quiz-q-num">${getText({ uk: 'Питання', en: 'Question' })} ${idx + 1} ${getText({ uk: 'з', en: 'of' })} ${qCount}</div>
          <div class="quiz-question">${getText({ uk: 'Що означає', en: 'What does' })} «<b>${question.word}</b>»${getText({ uk: '?', en: ' mean?' })}</div>
          <div class="quiz-options">
            ${options.map((option, optionIndex) => `
              <div class="quiz-opt" data-correct="${Boolean(option.correct)}" onclick="handleMCQClick('${qid}', ${optionIndex}, ${Boolean(option.correct)}, this)">
                ${option.trans}
              </div>
            `).join('')}
          </div>
          <div class="quiz-feedback" id="fb-${qid}"></div>
        </div>
      `;
    }).join('');
  }

  Object.assign(window, {
    getExerciseData: () => ({ tasks: taskBank, categories: categoryMap, formats: runtimeFormats }),
    renderMatchingPanel,
    selectMatchItem,
    moveChipToAnswer,
    moveChipToPool,
    resetReorderSentence,
    checkReorderSentence,
    handleBlankCheck,
    handleMCQClick,
    setCategoryFilter,
    showTaskTab
  });

  async function initExerciseData() {
    try {
      const course = typeof window.loadCourse === 'function' ? await window.loadCourse() : {};
      const data = typeof window.loadCourseData === 'function' ? await window.loadCourseData('exercises') : [];
      const exerciseArray = Array.isArray(data) ? data : (data && Array.isArray(data.exercises) ? data.exercises : []);

      taskBank = exerciseArray.map(normalizeExerciseTask).filter(Boolean);
      runtimeFormats = getAllowedFormats(course);
      categoryMap = buildCategoryMap(course.exerciseCategories || []);
      currentTab = runtimeFormats.includes(currentTab) ? currentTab : runtimeFormats[0] || 'mcq';

      renderCategoryPills();
      renderFormatTabs();
      applyFiltersAndSort();
    } catch (error) {
      console.error('Failed to load exercise bank:', error);
      const container = document.getElementById('container-mcq');
      if (container) {
        container.innerHTML = renderEmptyState();
      }
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const requestedGroup = urlParams.get('group');
    if (requestedGroup && ['grammar', 'situational'].includes(requestedGroup)) {
      const groupSelect = document.getElementById('groupFilterSelect');
      if (groupSelect) groupSelect.value = requestedGroup;
    }

    const filterToggle = document.querySelector('[data-filter-toggle="exercises"]');
    const exerciseFiltersPanel = document.getElementById('exerciseFiltersPanel');
    if (filterToggle && exerciseFiltersPanel) {
      filterToggle.addEventListener('click', () => {
        const isOpen = filterToggle.getAttribute('aria-expanded') === 'true';
        filterToggle.setAttribute('aria-expanded', String(!isOpen));
        exerciseFiltersPanel.classList.toggle('hidden', isOpen);
      });
    }

    const groupSelect = document.getElementById('groupFilterSelect');
    if (groupSelect) {
      groupSelect.addEventListener('change', () => applyFiltersAndSort());
    }
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.addEventListener('input', () => applyFiltersAndSort());
    }

    initExerciseData();
  });
})();


document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-exercises-1]');
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
  var target = event.target.closest('[data-external-handler-exercises-2]');
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
  var target = event.target.closest('[data-external-handler-exercises-3]');
  if (!target) return;
  var result = (function(event) {
location.href='path.html'
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-exercises-4]');
  if (!target) return;
  var result = (function(event) {
location.href='flashcards.html'
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-exercises-5]');
  if (!target) return;
  var result = (function(event) {
location.href='exercises.html'
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-exercises-6]');
  if (!target) return;
  var result = (function(event) {
location.href='dictionary.html'
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});


document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-exercises-8]');
  if (!target) return;
  var result = (function(event) {
location.href='grammar.html'
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-exercises-9]');
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
  var target = event.target.closest('[data-external-handler-exercises-10]');
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
  var target = event.target.closest('[data-external-handler-exercises-11]');
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
  var target = event.target.closest('[data-external-handler-exercises-12]');
  if (!target) return;
  var result = (function(event) {
setCategoryFilter('all')
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-exercises-13]');
  if (!target) return;
  var result = (function(event) {
setCategoryFilter('articles')
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-exercises-14]');
  if (!target) return;
  var result = (function(event) {
setCategoryFilter('verbs')
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-exercises-15]');
  if (!target) return;
  var result = (function(event) {
setCategoryFilter('pronouns')
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-exercises-16]');
  if (!target) return;
  var result = (function(event) {
setCategoryFilter('sentence')
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-exercises-17]');
  if (!target) return;
  var result = (function(event) {
setCategoryFilter('greetings')
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-exercises-18]');
  if (!target) return;
  var result = (function(event) {
setCategoryFilter('cafe')
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-exercises-19]');
  if (!target) return;
  var result = (function(event) {
setCategoryFilter('directions')
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-exercises-20]');
  if (!target) return;
  var result = (function(event) {
setCategoryFilter('shopping')
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('change', function(event) {
  var target = event.target.closest('[data-external-handler-exercises-21]');
  if (!target) return;
  var result = (function(event) {
applyFiltersAndSort()
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('change', function(event) {
  var target = event.target.closest('[data-external-handler-exercises-22]');
  if (!target) return;
  var result = (function(event) {
applyFiltersAndSort()
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('change', function(event) {
  var target = event.target.closest('[data-external-handler-exercises-23]');
  if (!target) return;
  var result = (function(event) {
applyFiltersAndSort()
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('input', function(event) {
  var target = event.target.closest('[data-external-handler-exercises-24]');
  if (!target) return;
  var result = (function(event) {
applyFiltersAndSort()
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-exercises-25]');
  if (!target) return;
  var result = (function(event) {
showTaskTab('mcq')
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-exercises-26]');
  if (!target) return;
  var result = (function(event) {
showTaskTab('blank')
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-exercises-27]');
  if (!target) return;
  var result = (function(event) {
showTaskTab('match')
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-exercises-28]');
  if (!target) return;
  var result = (function(event) {
showTaskTab('reorder')
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-exercises-29]');
  if (!target) return;
  var result = (function(event) {
showTaskTab('listen')
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-exercises-30]');
  if (!target) return;
  var result = (function(event) {
showTaskTab('dialogue')
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-exercises-31]');
  if (!target) return;
  var result = (function(event) {
showTaskTab('dict')
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-exercises-32]');
  if (!target) return;
  var result = (function(event) {
generateDictQuiz()
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});
