(function () {
  // Show error message from URL params (e.g. ?error=google_failed after a failed OAuth)
  const urlParams = new URLSearchParams(window.location.search);
  const errorParam = urlParams.get('error');

  if (errorParam) {
    const errorEl = document.getElementById('auth-error');
    if (errorEl) {
      const messages = {
        google_failed: 'Не вдалося увійти через Google. Спробуйте ще раз.',
        invalid_state: 'Помилка безпеки. Будь ласка, спробуйте увійти знову.',
        missing_code: 'Авторизацію було скасовано. Спробуйте ще раз.',
        google_profile_missing: 'Не вдалося отримати дані профілю Google.'
      };
      errorEl.textContent = messages[errorParam] || 'Помилка входу. Спробуйте ще раз.';
      errorEl.hidden = false;
    }
  }
})();
