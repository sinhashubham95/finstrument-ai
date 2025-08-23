
// Global search: route to instrument.html with TradingView-supported tvwidgetsymbol query.
// Accepts raw symbols like "AAPL" or with exchange like "NSE:RELIANCE" or pairs like "BTCUSD".
function initGlobalSearch() {
  const form = document.getElementById('global-search-form');
  if (!form) return;
  const input = document.getElementById('global-search-input');
  form.addEventListener('submit', function(e){
    e.preventDefault();
    const raw = (input.value || '').trim();
    if (!raw) return;
    // Normalize: uppercase, collapse spaces, replace forward slash with colon if common mistakes
    let symbol = raw.toUpperCase().replace(/\s+/g,'');
    // Route
    window.location.href = '/instrument.html?tvwidgetsymbol=' + encodeURIComponent(symbol);
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

document.addEventListener('DOMContentLoaded', () => {
  initGlobalSearch();
  setActiveNav();
});
