const GR_DATA = {
  articoli: `
    <table class="gr-table">
      <thead>
        <tr>
          <th>Рід / Число</th>
          <th>Перед приголосними</th>
          <th>Перед s+пригол., z, gn, ps</th>
          <th>Перед голосними</th>
        </tr>
      </thead>
      <tbody>
        <tr><td><b>Чоловічий (однина)</b></td><td><b>il</b> ragazzo</td><td><b>lo</b> studente, <b>lo</b> zaino</td><td><b>l'</b>amico</td></tr>
        <tr><td><b>Чоловічий (множина)</b></td><td><b>i</b> ragazzi</td><td><b>gli</b> studenti, <b>gli</b> zaini</td><td><b>gli</b> amici</td></tr>
        <tr><td><b>Жіночий (однина)</b></td><td><b>la</b> pizza</td><td><b>la</b> ragazza</td><td><b>l'</b>amica</td></tr>
        <tr><td><b>Жіночий (множина)</b></td><td><b>le</b> pizze</td><td><b>le</b> ragazze</td><td><b>le</b> amiche</td></tr>
      </tbody>
    </table>
    <div class="gr-note-box">
      <b>💡 Зверніть увагу:</b> Перед голосними в однині артиклі <i>lo</i> та <i>la</i> скорочуються до <b>l'</b> (l'albergo, l'ora).
    </div>
  `,
  verbi: `
    <table class="gr-table">
      <thead>
        <tr>
          <th>Особа</th>
          <th>Essere (бути)</th>
          <th>Avere (мати)</th>
          <th>Приклад використання</th>
        </tr>
      </thead>
      <tbody>
        <tr><td><b>io</b> (я)</td><td>sono</td><td>ho</td><td>Io sono Sara / Ho un gatto</td></tr>
        <tr><td><b>tu</b> (ти)</td><td>sei</td><td>hai</td><td>Sei italiana? / Hai fame?</td></tr>
        <tr><td><b>lui / lei</b> (він / вона)</td><td>è</td><td>ha</td><td>Lui è Marco / Lei ha una casa</td></tr>
        <tr><td><b>noi</b> (ми)</td><td>siamo</td><td>abbiamo</td><td>Siamo a Milano / Abbiamo tempo</td></tr>
        <tr><td><b>voi</b> (ви)</td><td>siete</td><td>avete</td><td>Siete pronti? / Avete domande?</td></tr>
        <tr><td><b>loro</b> (вони)</td><td>sono</td><td>hanno</td><td>Sono gentili / Hanno fretta</td></tr>
      </tbody>
    </table>
    <div class="gr-note-box">
      <b>💡 Вік в італійській мові:</b> Вік виражається через дієслово <i>avere</i> (мати): «Ho 25 anni» (Мені 25 років, дослівно «Я маю 25 років»).
    </div>
  `,
  cortesia: `
    <table class="gr-table">
      <thead>
        <tr>
          <th>Ситуація</th>
          <th>Неформально (на «ти» — tu)</th>
          <th>Ввічливо (на «Ви» — Lei)</th>
        </tr>
      </thead>
      <tbody>
        <tr><td><b>Привітання</b></td><td>Ciao!</td><td>Buongiorno / Buonasera</td></tr>
        <tr><td><b>Як справи?</b></td><td>Come stai?</td><td>Come sta?</td></tr>
        <tr><td><b>Як звати?</b></td><td>Come ti chiami?</td><td>Come si chiama?</td></tr>
        <tr><td><b>Звідки ви?</b></td><td>Di dove sei?</td><td>Di dov'è?</td></tr>
        <tr><td><b>Вибачте</b></td><td>Scusa!</td><td>Scusi!</td></tr>
        <tr><td><b>Прощання</b></td><td>Ciao! / A presto!</td><td>Arrivederla! / Arrivederci!</td></tr>
      </tbody>
    </table>
  `
};

function switchGrTab(tabKey, btn) {
  document.querySelectorAll('.gr-tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('grBody').innerHTML = GR_DATA[tabKey] || GR_DATA.articoli;
  if (typeof applyInterfaceLanguage === 'function') applyInterfaceLanguage();
}

document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const requestedTab = urlParams.get('tab') || 'articoli';
  const tabIndexMap = { articoli: 0, verbi: 1, cortesia: 2 };
  const targetBtn = document.querySelectorAll('.gr-tab-btn')[tabIndexMap[requestedTab] || 0];
  if (targetBtn) {
    switchGrTab(requestedTab, targetBtn);
  } else {
    document.getElementById('grBody').innerHTML = GR_DATA.articoli;
  }
});

document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-grammar-1]');
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
  var target = event.target.closest('[data-external-handler-grammar-2]');
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
  var target = event.target.closest('[data-external-handler-grammar-3]');
  if (!target) return;
  var result = (function(event) {
location.href='units.html'
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-grammar-4]');
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
  var target = event.target.closest('[data-external-handler-grammar-5]');
  if (!target) return;
  var result = (function(event) {
location.href='tasks.html'
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-grammar-6]');
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
  var target = event.target.closest('[data-external-handler-grammar-7]');
  if (!target) return;
  var result = (function(event) {
location.href='games.html'
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-grammar-8]');
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
  var target = event.target.closest('[data-external-handler-grammar-9]');
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
  var target = event.target.closest('[data-external-handler-grammar-10]');
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
  var target = event.target.closest('[data-external-handler-grammar-11]');
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
  var target = event.target.closest('[data-external-handler-grammar-12]');
  if (!target) return;
  var result = (function(event) {
switchGrTab('articoli', this)
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-grammar-13]');
  if (!target) return;
  var result = (function(event) {
switchGrTab('verbi', this)
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});

document.addEventListener('click', function(event) {
  var target = event.target.closest('[data-external-handler-grammar-14]');
  if (!target) return;
  var result = (function(event) {
switchGrTab('cortesia', this)
  }).call(target, event);
  if (result === false) {
    event.preventDefault();
    event.stopPropagation();
  }
});
