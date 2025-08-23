
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


(function drawerController() {
  const btn = document.getElementById('menu-toggle');
  const drawer = document.getElementById('mobile-drawer');
  const closeBtn = document.getElementById('drawer-close');
  const backdrop = document.getElementById('drawer-backdrop');

  if (!btn || !drawer || !closeBtn || !backdrop) return;

  let lastFocus = null;

  function getFocusable(root) {
    return [...root.querySelectorAll('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])')]
      .filter(el => !el.hasAttribute('disabled') && el.offsetParent !== null);
  }

  function open() {
    lastFocus = document.activeElement;
    document.documentElement.style.overflow = 'hidden'; // lock scroll
    drawer.setAttribute('aria-hidden', 'false');
    drawer.classList.add('open');
    backdrop.hidden = false;
    backdrop.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');

    const focusables = getFocusable(drawer);
    if (focusables[0]) focusables[0].focus();
  }

  function close() {
    document.documentElement.style.overflow = '';
    drawer.setAttribute('aria-hidden', 'true');
    drawer.classList.remove('open');
    backdrop.classList.remove('open');
    // delay hide to allow fade
    setTimeout(() => { backdrop.hidden = true; }, 200);
    btn.setAttribute('aria-expanded', 'false');
    if (lastFocus) lastFocus.focus();
  }

  btn.addEventListener('click', () => {
    const isOpen = drawer.classList.contains('open');
    isOpen ? close() : open();
  });
  closeBtn.addEventListener('click', close);
  backdrop.addEventListener('click', close);

  // Close on link click
  drawer.addEventListener('click', (e) => {
    if (e.target.matches('.drawer-nav a')) close();
  });

  // Esc to close + focus trap
  document.addEventListener('keydown', (e) => {
    if (!drawer.classList.contains('open')) return;
    if (e.key === 'Escape') { e.preventDefault(); close(); return; }

    if (e.key === 'Tab') {
      const f = getFocusable(drawer);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  // Close drawer if resized back to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && drawer.classList.contains('open')) close();
  });
})();