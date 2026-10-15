const ICON_MAP_URL = new URL('../assets/icons/icons.json', document.currentScript.src).href;
const ICON_ASSET_BASE_URL = new URL('.', ICON_MAP_URL).href;
const ICON_ALIASES = {
  path: 'paths',
  cards: 'flashcards',
  fire: 'streak',
  plus: 'add',
  newspaper: 'article',
  handshake: 'greeting',
  coffee: 'cafe',
  compass: 'paths',
  pointer: 'tap',
  brain: 'mcq',
  pencil: 'blank',
  dice: 'shuffle',
  trash: 'delete',
  chevronDown: 'chevron-down'
};

let iconRegistryPromise;
let iconRegistry = null;
const warnedIconNames = new Set();

function loadIconRegistry() {
  if (!iconRegistryPromise) {
    iconRegistryPromise = fetch(ICON_MAP_URL)
      .then(response => {
        if (!response.ok) throw new Error(`Icon map request failed: ${response.status}`);
        return response.json();
      })
      .then(registry => {
        iconRegistry = registry;
        renderRegisteredIcons();
        return registry;
      })
      .catch(error => {
        console.warn('Could not load icon map:', error);
        iconRegistry = { placeholder: { file: '_placeholder.svg', mode: 'mask' } };
        renderRegisteredIcons();
        return iconRegistry;
      });
  }

  return iconRegistryPromise;
}

function resolveIconName(name) {
  return ICON_ALIASES[name] || name;
}

function getIconSvg(name) {
  const iconName = resolveIconName(name);
  const entry = iconRegistry?.[iconName];

  if (!entry) {
    if (iconRegistry && !warnedIconNames.has(iconName)) {
      warnedIconNames.add(iconName);
      console.warn(`Icon "${iconName}" not found`);
    }
    const fallback = iconRegistry?.placeholder;
    const fallbackAttributes = fallback
      ? ` data-name="placeholder" data-icon-missing style="--icon: url('${ICON_ASSET_BASE_URL}${fallback.file}')"`
      : '';
    return `<span class="ls-icon" data-icon="${iconName}"${fallbackAttributes} aria-hidden="true"></span>`;
  }

  const assetName = entry.file === iconRegistry.placeholder?.file ? 'placeholder' : iconName;
  return `<span class="ls-icon" data-icon="${iconName}" data-name="${assetName}" style="--icon: url('${ICON_ASSET_BASE_URL}${entry.file}')" aria-hidden="true"></span>`;
}

function renderRegisteredIcons(root = document) {
  if (!iconRegistry || !root?.querySelectorAll) return;
  const icons = [];
  if (root.matches?.('[data-icon]')) icons.push(root);
  icons.push(...root.querySelectorAll('[data-icon]'));

  icons.forEach(element => {
    const requestedName = element.dataset.icon;
    const iconName = resolveIconName(requestedName);
    const entry = iconRegistry[iconName];
    const isMissing = !entry;
    const resolvedEntry = entry || iconRegistry.placeholder;
    const isPlaceholder = isMissing || resolvedEntry.file === iconRegistry.placeholder?.file;

    if (isMissing && !warnedIconNames.has(iconName)) {
      warnedIconNames.add(iconName);
      console.warn(`Icon "${iconName}" not found`);
    }

    element.classList.add('ls-icon');
    element.dataset.name = isPlaceholder ? 'placeholder' : iconName;
    if (isMissing) element.dataset.iconMissing = '';
    else delete element.dataset.iconMissing;
    element.style.setProperty('--icon', `url("${ICON_ASSET_BASE_URL}${resolvedEntry.file}")`);
    element.setAttribute('aria-hidden', 'true');
  });
}

function getIconNames() {
  return Object.keys(iconRegistry || {});
}

window.loadIconRegistry = loadIconRegistry;
window.renderRegisteredIcons = renderRegisteredIcons;
window.getIconNames = getIconNames;
loadIconRegistry();