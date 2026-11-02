(function() {
    function getRelativeAssetPath() {
      const pathname = window.location.pathname || '';
      const routeMarker = ['/pages/', '/lessons/'].find((marker) => pathname.includes(marker));
      if (!routeMarker) return '';

      const route = pathname.slice(pathname.indexOf(routeMarker) + routeMarker.length);
      const directoryDepth = route.split('/').length - 1;
      return '../'.repeat(directoryDepth + 1);
    }

    function resolveLogoPath() {
      const relativePrefix = getRelativeAssetPath();
      return `${relativePrefix}assets/images/logo.svg`;
    }

    function updateBrandLogos() {
      const logoPath = resolveLogoPath();

      document.querySelectorAll('.brand-logo').forEach((img) => {
        img.src = logoPath;
        img.style.display = 'block';
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
