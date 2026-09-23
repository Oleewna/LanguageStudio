/**
 * LanguageStudio - Shared Helper Script
 */

const XP_KEY = 'ls_xp';
const DICT_KEY = 'ls_custom_dict';

function getXP() {
  return parseInt(localStorage.getItem(XP_KEY) || '0', 10);
}

function addXP(amount) {
  const current = getXP() + amount;
  localStorage.setItem(XP_KEY, current);
  updateXPDisplay();
  return current;
}

function updateXPDisplay() {
  const els = document.querySelectorAll('.xp-val-display');
  const xp = getXP();
  els.forEach(el => el.textContent = xp);
}

function openMobNav() {
  const nav = document.getElementById('mobNav');
  const overlay = document.getElementById('mobOverlay');
  if (nav) nav.classList.add('open');
  if (overlay) overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeMobNav() {
  const nav = document.getElementById('mobNav');
  const overlay = document.getElementById('mobOverlay');
  if (nav) nav.classList.remove('open');
  if (overlay) overlay.classList.remove('open');
  document.body.style.overflow = '';
}

// Visual audio button click handler (voice synthesis deactivated as requested)
function speak(text, btnElement) {
  // Visual pulse / indicator for future audio playback
  if (btnElement && btnElement.classList) {
    btnElement.classList.add('audio-playing');
    setTimeout(() => btnElement.classList.remove('audio-playing'), 500);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  updateXPDisplay();
});
