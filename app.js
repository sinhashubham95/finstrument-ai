
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
  const shield = document.getElementById('click-shield');
  if (!btn || !drawer || !closeBtn || !backdrop || !shield) return;

  const ANIM_MS = 220;
  let lastFocus = null;

  function getFocusable(root) {
    return [...root.querySelectorAll('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])')]
      .filter(el => !el.hasAttribute('disabled') && el.offsetParent !== null);
  }

  function open() {
    lastFocus = document.activeElement;
    document.documentElement.classList.add('drawer-open'); // shows shield & disables TVs
    drawer.setAttribute('aria-hidden', 'false');
    drawer.classList.add('open');
    backdrop.hidden = false;
    backdrop.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
    if (getFocusable(drawer)[0]) getFocusable(drawer)[0].focus();
  }

  function close() {
    return new Promise(res => {
      document.documentElement.classList.remove('drawer-open'); // hides shield & re-enables TVs
      drawer.setAttribute('aria-hidden', 'true');
      drawer.classList.remove('open');
      backdrop.classList.remove('open');
      setTimeout(() => { backdrop.hidden = true; res(); }, ANIM_MS);
      btn.setAttribute('aria-expanded', 'false');
      if (lastFocus) lastFocus.focus();
    });
  }

  // open/close
  btn.addEventListener('click', () => drawer.classList.contains('open') ? close() : open());
  closeBtn.addEventListener('click', () => { close(); });
  backdrop.addEventListener('click', () => { close(); });

  // prevent any bubbling from the drawer itself
  drawer.addEventListener('click', e => e.stopPropagation());

  // robust link handling inside drawer (wait for close before navigating)
  drawer.addEventListener('click', async (e) => {
    const link = e.target.closest('.drawer-nav a, .drawer-header a');
    if (!link) return;
    e.preventDefault();
    const href = link.getAttribute('href');
    await close();
    if (href) window.location.href = href;
  });

  // Esc + resize
  document.addEventListener('keydown', (e) => {
    if (!drawer.classList.contains('open')) return;
    if (e.key === 'Escape') { e.preventDefault(); close(); }
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && drawer.classList.contains('open')) close();
  });
})();
