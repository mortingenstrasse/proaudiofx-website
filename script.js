// ─── Ad Blocker Detection ───────────────────────────────────────────────────
function checkAdBlocker() {
  const bait = document.getElementById('adblock-bait');
  if (!bait) return; // not on download page

  // Give the ad blocker time to act on the bait element
  setTimeout(() => {
    const blocked =
      !bait ||
      bait.offsetHeight === 0 ||
      bait.offsetWidth === 0 ||
      bait.style.display === 'none' ||
      bait.style.visibility === 'hidden' ||
      window.getComputedStyle(bait).display === 'none' ||
      window.getComputedStyle(bait).visibility === 'hidden';

    if (blocked) {
      const overlay = document.getElementById('adblock-overlay');
      if (overlay) overlay.style.display = 'flex';
    }
  }, 300);
}

function closeAdblockOverlay() {
  const overlay = document.getElementById('adblock-overlay');
  if (overlay) overlay.style.display = 'none';
}

// ─── Language Switcher ──────────────────────────────────────────────────────
const currentLang = { value: 'en' };

function applyLang(lang) {
  currentLang.value = lang;

  // Update all data-en / data-ja elements
  document.querySelectorAll('[data-en], [data-ja]').forEach(el => {
    const text = el.getAttribute('data-' + lang);
    if (!text) return;
    // Use innerHTML so Japanese HTML entities render correctly
    el.innerHTML = text;
  });

  // Update active button state
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  // Persist choice
  try { localStorage.setItem('proaudiofx-lang', lang); } catch(e) {}
}

document.addEventListener('DOMContentLoaded', () => {
  // Restore saved language
  let savedLang = 'en';
  try { savedLang = localStorage.getItem('proaudiofx-lang') || 'en'; } catch(e) {}
  applyLang(savedLang);

  // Bind lang buttons
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => applyLang(btn.dataset.lang));
  });

  // Check ad blocker on download page
  checkAdBlocker();
});

// ─── Step Wizard (download.html) ────────────────────────────────────────────
function goToStep(n) {
  // Hide all steps
  document.querySelectorAll('.step-content').forEach(el => {
    el.classList.remove('active');
  });

  // Show target step
  const target = document.getElementById('step-' + n);
  if (target) {
    target.classList.add('active');
    // Scroll to top of step indicator smoothly
    const indicator = document.getElementById('steps-indicator');
    if (indicator) {
      indicator.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // Update step indicators
  for (let i = 1; i <= 3; i++) {
    const ind = document.getElementById('step-ind-' + i);
    if (!ind) continue;
    ind.classList.remove('active', 'done');
    if (i === n) ind.classList.add('active');
    if (i < n)  ind.classList.add('done');
  }

  // Update connector lines
  const line12 = document.getElementById('line-1-2');
  const line23 = document.getElementById('line-2-3');
  if (line12) line12.classList.toggle('done', n > 1);
  if (line23) line23.classList.toggle('done', n > 2);
}
