let grammarTopics = [];

function getGrammarTopicById(topicId) {
  return grammarTopics.find(topic => topic.id === topicId) || grammarTopics[0] || null;
}

function switchGrTab(tabKey, btn) {
  const tabs = document.querySelectorAll('.gr-tab-btn');
  tabs.forEach((tab) => tab.classList.toggle('active', tab === btn));

  const selectedTopic = getGrammarTopicById(tabKey);
  const body = document.getElementById('grBody');
  if (!body) return;

  if (!selectedTopic) {
    body.innerHTML = '';
    return;
  }

  body.innerHTML = renderBlocks(selectedTopic.blocks || []);

  const url = new URL(window.location.href);
  if (selectedTopic.id) {
    url.searchParams.set('tab', selectedTopic.id);
  }
  window.history.replaceState({}, '', url);

  if (typeof applyInterfaceLanguage === 'function') applyInterfaceLanguage();
}

async function initGrammarTabs() {
  const body = document.getElementById('grBody');
  const tabContainer = document.querySelector('.grammar-tabs-header');

  if (!body || !tabContainer) return;

  try {
    const data = await loadCourseData('grammar');
    grammarTopics = Array.isArray(data?.topics) ? data.topics : [];

    if (!grammarTopics.length) {
      body.innerHTML = '<div class="gr-note-box">No grammar topics available yet.</div>';
      return;
    }

    tabContainer.innerHTML = '';

    grammarTopics.forEach((topic) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'gr-tab-btn';
      button.dataset.topic = topic.id;
      button.innerHTML = `<span data-icon="${topic.icon || 'newspaper'}"></span> <span>${L(topic.title)}</span>`;
      button.addEventListener('click', () => switchGrTab(topic.id, button));
      tabContainer.appendChild(button);
    });

    const requestedTab = new URLSearchParams(window.location.search).get('tab');
    const fallbackTopic = getGrammarTopicById(requestedTab) || grammarTopics[0];
    const targetButton = tabContainer.querySelector(`[data-topic="${fallbackTopic.id}"]`);

    if (targetButton) {
      switchGrTab(fallbackTopic.id, targetButton);
    } else {
      body.innerHTML = renderBlocks(grammarTopics[0].blocks || []);
    }
  } catch (error) {
    console.warn('Could not load grammar data:', error);
    body.innerHTML = '<div class="gr-note-box">Grammar content is not available for this course.</div>';
  }
}

document.addEventListener('DOMContentLoaded', initGrammarTabs);
