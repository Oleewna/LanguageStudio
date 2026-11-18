(function () {
  'use strict';

  // ─── Translations for Ukrainian and English ──────────────────────────────────
  const I18N = {
    uk: {
      pageTitle: 'Вхід — LanguageStudio',
      welcomeTitle: 'Benvenuto!',
      welcomeSub: 'Увійдіть за допомогою облікового запису Google, щоб зберігати свій прогрес на всіх пристроях.',
      googleSignIn: 'Увійти через Google',
      genericError: 'Не вдалося виконати запит. Спробуйте ще раз.',
      // Google OAuth errors
      google_failed: 'Не вдалося увійти через Google. Спробуйте ще раз.',
      invalid_state: 'Помилка безпеки. Будь ласка, спробуйте увійти знову.',
      missing_code: 'Авторизацію було скасовано. Спробуйте ще раз.',
      google_profile_missing: 'Не вдалося отримати дані профілю Google.'
    },
    en: {
      pageTitle: 'Sign in — LanguageStudio',
      welcomeTitle: 'Benvenuto!',
      welcomeSub: 'Sign in with Google to keep and sync your progress across all your devices.',
      googleSignIn: 'Sign in with Google',
      genericError: 'Request failed. Please try again.',
      // Google OAuth errors
      google_failed: 'Failed to sign in with Google. Please try again.',
      invalid_state: 'Security verification failed. Please try again.',
      missing_code: 'Authorization was cancelled. Please try again.',
      google_profile_missing: 'Could not retrieve Google profile details.'
    }
  };

  function getActiveLanguage() {
    if (typeof window.getSourceLanguage === 'function') {
      const l = window.getSourceLanguage();
      if (l === 'en' || l === 'uk') return l;
    }
    const saved = localStorage.getItem('ls_source_language') || localStorage.getItem('ls_italian_source_language');
    if (saved === 'en' || saved === 'uk') return saved;
    return (navigator.language || '').toLowerCase().startsWith('uk') ? 'uk' : 'en';
  }

  function applyLanguage() {
    const lang = getActiveLanguage();
    const t = I18N[lang] || I18N.uk;
    document.documentElement.lang = lang;

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (t[key] !== undefined) {
        if (el.tagName === 'TITLE') {
          document.title = t[key];
        } else {
          el.textContent = t[key];
        }
      }
    });

    // Refresh URL error banner if visible
    const globalErrorEl = document.getElementById('auth-global-error');
    if (globalErrorEl && !globalErrorEl.hidden && globalErrorEl.dataset.errorKey) {
      globalErrorEl.textContent = t[globalErrorEl.dataset.errorKey] || t.genericError;
    }
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str == null ? '' : String(str);
    return div.innerHTML;
  }

  async function checkExistingAuth() {
    try {
      const res = await fetch('/api/v1/auth/me', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user) {
          const panel = document.getElementById('panel-auth');
          const lang = getActiveLanguage();
          const user = data.user;
          const userName = user.displayName || user.name || user.email || (lang === 'en' ? 'Student' : 'Студент');
          if (panel) {
            panel.innerHTML = `
              <h2 class="auth-title">${lang === 'en' ? 'Already Signed In' : 'Ви вже увійшли'}</h2>
              <p class="auth-sub">${lang === 'en' ? 'Signed in as' : 'Ви увійшли як'} <strong>${escapeHtml(userName)}</strong>.</p>
              <div style="display:flex;flex-direction:column;gap:0.75rem;margin-top:1.5rem;">
                <button type="button" class="btn-primary" id="btnAuthLogout" style="background:var(--danger,#d64545);border-color:var(--danger,#d64545);justify-content:center;padding:0.75rem;">
                  ${lang === 'en' ? 'Log out' : 'Вийти з акаунта'}
                </button>
                <a href="home.html" class="btn-ghost" style="text-align:center;padding:0.75rem;">
                  ${lang === 'en' ? 'Go to Learning Space' : 'Перейти до навчання'}
                </a>
              </div>
            `;
            document.getElementById('btnAuthLogout')?.addEventListener('click', async () => {
              if (typeof window.handleLogout === 'function') {
                await window.handleLogout();
              } else {
                await fetch('/api/v1/auth/logout', { method: 'POST', credentials: 'include' });
                window.location.reload();
              }
            });
          }
        }
      }
    } catch (e) {}
  }

  // ─── Initial setup ──────────────────────────────────────────────────────────
  applyLanguage();
  checkExistingAuth();
  window.addEventListener('sourceLanguageChanged', () => {
    applyLanguage();
    checkExistingAuth();
  });

  const urlParams = new URLSearchParams(window.location.search);

  // Forward returnUrl to Google OAuth links if provided
  const returnParam = urlParams.get('returnUrl') || urlParams.get('redirect');
  if (returnParam) {
    document.querySelectorAll('.btn-google-signin').forEach(btn => {
      btn.href = `/api/v1/auth/google?returnUrl=${encodeURIComponent(returnParam)}`;
    });
  }

  // Handle URL errors (e.g. from Google OAuth callback)
  const errorParam = urlParams.get('error');
  if (errorParam) {
    const globalErrorEl = document.getElementById('auth-global-error');
    if (globalErrorEl) {
      const lang = getActiveLanguage();
      const t = I18N[lang] || I18N.uk;
      globalErrorEl.dataset.errorKey = errorParam;
      globalErrorEl.textContent = t[errorParam] || t.genericError;
      globalErrorEl.hidden = false;
    }
  }
})();
