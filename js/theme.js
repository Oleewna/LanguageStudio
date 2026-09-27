(function() {
    function getRelativeAssetPath() {
      const pathname = window.location.pathname || '';
      return pathname.includes('/pages/') || pathname.includes('/lessons/') ? '../' : '';
    }

    function updateBrandLogos(theme) {
      const currentTheme = theme || document.documentElement.getAttribute('data-theme') || 'light';
      const relativePrefix = getRelativeAssetPath();
      const logoPath = `${relativePrefix}assets/images/${currentTheme === 'dark' ? 'dark_theme_logo.png' : 'light_theme_logo.png'}`;

      document.querySelectorAll('.brand-logo').forEach((img) => {
        img.src = logoPath;
        img.alt = 'LanguageStudio';
      });
    }

    const saved = localStorage.getItem('ls_theme');
    const theme = (saved === 'dark' || saved === 'light') ? saved : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => updateBrandLogos(theme), { once: true });
    } else {
      updateBrandLogos(theme);
    }

    window.updateBrandLogos = updateBrandLogos;
  })();
