
// Global search: route to instrument.html with TradingView-supported tvwidgetsymbol query.
// Accepts raw symbols like "AAPL" or with exchange like "NSE:RELIANCE" or pairs like "BTCUSD".
function initGlobalSearch() {
  const form = document.getElementById('global-search-form');
  if (!form) return;
  const input = document.getElementById('global-search-input');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const raw = (input.value || '').trim();
    if (!raw) return;
    // Normalize: uppercase, collapse spaces, replace forward slash with colon if common mistakes
    let symbol = raw.toUpperCase().replace(/\s+/g, '');
    // Route
    window.location.href = 'instrument.html?tvwidgetsymbol=' + encodeURIComponent(symbol);
  });
}

// Highlight active nav
function setActiveNav() {
  const path = location.pathname;
  const links = document.querySelectorAll('nav a');
  links.forEach(a => {
    const href = a.getAttribute('href');
    if (href && path.endsWith(href)) a.classList.add('active');
    if (path === '/' && href === '/index.html') a.classList.add('active');
  });
}

function getTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function mountTV() {
  document.querySelectorAll('script[src*="tradingview.com/external-embedding"]').forEach(s => {
    try {
      const cfg = JSON.parse(s.innerHTML);
      cfg.colorTheme = getTheme();
      s.innerHTML = JSON.stringify(cfg);
    } catch (e) { }
  });
}

mountTV();

function reload() {
  location.reload();
}

const mq = window.matchMedia("(prefers-color-scheme: dark)");
if (mq.addEventListener) {
  mq.addEventListener("change", reload);
} else if (mq.addListener) {
  mq.addListener(reload);
}

document.addEventListener('DOMContentLoaded', () => {
  initGlobalSearch();
  setActiveNav();
});

// Mobile menu toggler
(function () {
  const btn = document.getElementById('menu-toggle');
  const nav = document.getElementById('primary-nav');
  if (!btn || !nav) return;

  function closeMenu() {
    nav.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
  }
  function openMenu() {
    nav.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
  }
  btn.addEventListener('click', () => {
    nav.classList.contains('open') ? closeMenu() : openMenu();
  });

  // Close menu when clicking a link
  nav.addEventListener('click', (e) => {
    if (e.target.closest('a')) closeMenu();
  });

  // Auto-close when resizing back to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) closeMenu();
  });
})();
