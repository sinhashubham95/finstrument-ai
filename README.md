
# finstrument.ai — static site (free TradingView widgets)

This repo is a fully static website powered **only** by free TradingView widgets.

## Structure
- `index.html` — clean homepage with macro overview, heatmaps & calendar
- `markets.html` — multi-asset Market Overview tabs (indices, forex, commodities, crypto)
- `heatmaps.html` — stocks, forex, and crypto heatmaps
- `screener.html` — stock/forex/crypto screeners
- `calendar.html` — global economic calendar
- `instrument.html` — **instrument insights** page (Advanced Chart, Symbol Info, Technicals, Top Stories, Profile, Fundamentals)

Global header includes a site-wide **search** (top-right). Enter a TradingView symbol like:
- `NSE:RELIANCE`, `BSE:SENSEX`, `OANDA:USDINR`
- `NASDAQ:AAPL`, `CRYPTO:SOLUSD`, `BITSTAMP:BTCUSD`
- Pairs like `BTCUSD` or `EURUSD` also work

The instrument page uses TradingView’s `tvwidgetsymbol` URL parameter. Example:
```
/instrument.html?tvwidgetsymbol=NASDAQ:AAPL
/instrument.html?tvwidgetsymbol=NSE:RELIANCE
```
Widgets that honor this param will automatically update the symbol.

## Deploy (pick one)

### 1) GitHub Pages (simple)
1. Create a new repo, e.g. `finstrument-ai-site`.
2. Put these files at the repo root (or keep them in `/site` and set Pages to use `/site`).
3. In **Settings → Pages**, set **Build and deployment** → **Source: Deploy from a branch**; pick `main` and `/ (root)` or `/site` folder.
4. Add a DNS **CNAME** for `www.finstrument.ai` to `<your-user>.github.io` and (optionally) an **ALIAS/ANAME** or Cloudflare CNAME flattening for the apex `finstrument.ai`.
5. Force HTTPS.

### 2) Cloudflare Pages (recommended for apex)
1. Create a project, connect GitHub repo, **Build command:** _none_ (static), **Build output dir:** `/site` if you keep that structure.
2. Once deployed, add **Custom domains**: point `finstrument.ai` and `www.finstrument.ai` to the Pages project (Cloudflare handles TLS + CNAME flattening).

### 3) Netlify / Vercel (drag‑and‑drop)
- Drag the `/site` folder in; set it as the publish directory. Add custom domain and enable HTTPS.

## Notes
- All data & charts © TradingView. Widgets used: Advanced Chart, Market Overview, Screener, Stock Heatmap, Forex Heatmap, Crypto Heatmap, Symbol Info, Technical Analysis, Company Profile, Fundamentals, Economic Calendar, Ticker Tape.
- No server or API is required; this is fully static.
- To pre-open a particular symbol directly from search, we route to `/instrument.html?tvwidgetsymbol=...`.
- You can tune the widget options (themes, heights, tabs, symbols) in the HTML files.
