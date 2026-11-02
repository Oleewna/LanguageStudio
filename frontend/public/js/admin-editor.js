(function () {
  const apiBase = (() => {
    if (window.location.port !== '5500') return '/api/v1';
    const origin = new URL(window.location.origin);
    origin.port = '3005';
    return `${origin.origin}/api/v1`;
  })();
  const api = resource => `${apiBase}/${resource}`;
  const accessMessage = document.getElementById('access-message');
  const workspace = document.getElementById('editor-workspace');
  const editor = document.getElementById('catalog-editor');
  const saveButton = document.getElementById('save-button');
  const reloadButton = document.getElementById('reload-button');
  const logoutButton = document.getElementById('logout-button');
  const summary = document.getElementById('catalog-summary');
  let savedText = '';

  function showMessage(message, state = '') {
    accessMessage.textContent = message;
    accessMessage.dataset.state = state;
  }

  async function request(url, options = {}) {
    const response = await fetch(url, {
      ...options,
      credentials: 'include',
      headers: {
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...options.headers
      }
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      const error = new Error(result.error || `Request failed (${response.status}).`);
      error.status = response.status;
      throw error;
    }
    return result;
  }

  async function loadCatalog(confirmDiscard = false) {
    if (confirmDiscard && editor.value !== savedText
        && !window.confirm('Discard your unsaved edits and reload the database catalog?')) {
      return;
    }

    reloadButton.disabled = true;
    saveButton.disabled = true;
    showMessage('Loading the database catalog…');
    try {
      const catalog = await request(api('content/admin/catalog'));
      savedText = JSON.stringify(catalog, null, 2);
      editor.value = savedText;
      editor.disabled = false;
      workspace.hidden = false;
      summary.textContent = `${catalog.courses.length} courses loaded`;
      showMessage('Catalog loaded. Unsaved edits are only in this browser until saved.', 'success');
    } catch (error) {
      if (error.status === 401 || error.status === 403) {
        showMessage('Administrator access is required. Sign in with an administrator account.');
      } else {
        showMessage(error.message || 'Could not load the database catalog.', 'error');
      }
      workspace.hidden = true;
    } finally {
      reloadButton.disabled = false;
      saveButton.disabled = false;
    }
  }

  async function checkAccess() {
    try {
      const session = await request(api('auth/session'));
      if (!session.authenticated || !session.user || session.user.role !== 'admin') {
        showMessage('Administrator access is required. Sign in with an administrator account.');
        return;
      }
      logoutButton.hidden = false;
      await loadCatalog();
    } catch (error) {
      showMessage(error.message || 'Could not verify your account.', 'error');
    }
  }

  async function saveCatalog() {
    let catalog;
    try {
      catalog = JSON.parse(editor.value);
    } catch (error) {
      showMessage(`Invalid JSON: ${error.message}`, 'error');
      return;
    }

    saveButton.disabled = true;
    reloadButton.disabled = true;
    showMessage('Validating and saving catalog…');
    try {
      await request(api('content/admin/catalog'), {
        method: 'PUT',
        body: JSON.stringify(catalog)
      });
      savedText = editor.value;
      showMessage('Catalog saved to the database successfully.', 'success');
    } catch (error) {
      showMessage(error.message || 'Could not save the catalog.', 'error');
    } finally {
      saveButton.disabled = false;
      reloadButton.disabled = false;
    }
  }

  saveButton.addEventListener('click', saveCatalog);
  reloadButton.addEventListener('click', () => loadCatalog(true));
  logoutButton.addEventListener('click', async () => {
    try {
      await request(api('auth/logout'), { method: 'POST' });
      window.location.assign('./auth.html');
    } catch (error) {
      showMessage(error.message || 'Could not sign out.', 'error');
    }
  });

  checkAccess();
})();
