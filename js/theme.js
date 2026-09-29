(function() {
    function getRelativeAssetPath() {
      const pathname = window.location.pathname || '';
      const routeMarker = ['/pages/', '/lessons/'].find((marker) => pathname.includes(marker));
      if (!routeMarker) return '';

      const route = pathname.slice(pathname.indexOf(routeMarker) + routeMarker.length);
      const directoryDepth = route.split('/').length - 1;
      return '../'.repeat(directoryDepth + 1);
    }

    function resolveLogoPath(theme) {
      const relativePrefix = getRelativeAssetPath();
      const filename = theme === 'dark' ? 'dark_theme_logo.png' : 'light_theme_logo.png';
      return `${relativePrefix}assets/images/${filename}`;
    }

    function updateBrandLogos(theme) {
      const currentTheme = theme || document.documentElement.getAttribute('data-theme') || 'light';
      const logoPath = resolveLogoPath(currentTheme);

      document.querySelectorAll('.brand-logo').forEach((img) => {
        const fallbackPath = resolveLogoPath(currentTheme === 'dark' ? 'light' : 'dark');
        img.src = logoPath;
        img.alt = 'LanguageStudio';
        img.style.display = 'block';
        img.onerror = () => {
          img.src = fallbackPath;
        };
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
