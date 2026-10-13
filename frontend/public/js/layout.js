(function () {
  function mountLayoutTargets() {
    if (!document) return;

    const appNav = document.getElementById('app-nav');
    const appFooter = document.getElementById('app-footer');
    const appProfile = document.getElementById('app-profile');

    if (appNav && !appNav.dataset.layoutMounted) {
      appNav.dataset.layoutMounted = 'true';
      appNav.innerHTML = '<div data-component="navbar"></div>';
    }

    if (appFooter && !appFooter.dataset.layoutMounted) {
      appFooter.dataset.layoutMounted = 'true';
      appFooter.innerHTML = '<div data-component="footer"></div>';
    }

    if (appProfile && !appProfile.dataset.layoutMounted) {
      appProfile.dataset.layoutMounted = 'true';
      appProfile.innerHTML = '<div data-component="profile-modal"></div>';
    }

    if (typeof window.LSComponents?.load === 'function') {
      window.LSComponents.load();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountLayoutTargets, { once: true });
  } else {
    mountLayoutTargets();
  }

  window.LSLayout = {
    mount: mountLayoutTargets
  };
})();
