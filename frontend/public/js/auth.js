document.querySelectorAll('[data-auth-form]').forEach(form => {
  form.addEventListener('submit', async event => {
    event.preventDefault();

    const message = form.querySelector('[data-auth-message]');
    const submitButton = form.querySelector('button[type="submit"]');
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    if (form.action.endsWith('/register')) {
      if (payload.password !== formData.get('password2')) {
        message.textContent = 'Passwords do not match.';
        message.hidden = false;
        return;
      }
      payload.termsAccepted = formData.has('terms');
      delete payload.password2;
      delete payload.terms;
    } else {
      payload.remember = formData.has('remember');
    }

    message.hidden = true;
    submitButton.disabled = true;
    try {
      const endpoint = form.action.endsWith('/register') ? 'auth/register' : 'auth/login';
      const response = await fetch(window.getApiUrl(endpoint), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      if (!response.ok) {
        message.textContent = result.error || 'Unable to sign in.';
        message.hidden = false;
        return;
      }
      window.location.assign('../pages/home.html');
    } catch (error) {
      message.textContent = 'Could not reach the LanguageStudio gateway. Make sure the backend services are running.';
      message.hidden = false;
      console.error('Authentication request failed:', error);
    } finally {
      submitButton.disabled = false;
    }
  });
});
