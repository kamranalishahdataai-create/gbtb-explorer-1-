# Gardens by the Bay Explorer

Interactive kiosk-to-phone map of Gardens by the Bay (Bay South).
Concept prototype by Stratagile for the AI warm-up exercise. It is not an official Gardens by the Bay website.

- **Kiosk (big screen):** illustrated map with 20 clickable spots, live opening status in Singapore time, Garden Rhapsody countdown, category filters, ready-made routes, plan builder, auto night view after 7pm, and an idle tour that resets the screen between visitors.
- **Phone:** visitors scan a QR code on the kiosk. The same map opens on their phone with their stops and route already loaded and saved. No app, no login.

No build step and no dependencies: plain HTML, CSS and JavaScript.

## Project structure

```
gbtb-explorer/
├── public/              ← the website (what gets deployed)
│   ├── index.html
│   ├── css/styles.css
│   ├── js/config.js     ← settings you may want to change
│   ├── js/app.js        ← map, spots data, kiosk + phone logic
│   ├── js/qrcode.js     ← QR code generator (qrcode-generator, MIT)
│   └── assets/favicon.svg
├── server.js            ← tiny Node server (Railway / local)
├── package.json
├── vercel.json          ← Vercel settings
├── railway.json         ← Railway settings (builds with the Dockerfile)
└── Dockerfile           ← container used by Railway
```

## Run locally

Requires Node 18+.

```bash
npm start
# open http://localhost:3000        (phone layout on narrow screens)
# open http://localhost:3000/kiosk  (forces kiosk mode)
```

To try the QR handoff on a real phone while testing locally, use your computer's network IP (e.g. `http://192.168.1.20:3000/kiosk`) with the phone on the same Wi-Fi. Or just deploy, which is easier.

## Deploy to Vercel

**Option A: dashboard (no command line)**
1. Push this folder to a GitHub repository.
2. Go to vercel.com → **Add New… → Project** → import the repo.
3. Framework preset: **Other**. Leave the build command empty. Output directory is already set to `public` by `vercel.json`.
4. Click **Deploy**. You get an address like `https://gbtb-explorer.vercel.app`.

**Option B: CLI**
```bash
npm i -g vercel
vercel          # first deploy (preview)
vercel --prod   # production
```

## Deploy to Railway

Railway builds the app from the included `Dockerfile` (set in `railway.json`), so nothing needs configuring in the dashboard.

1. Push this folder to a GitHub repository. `Dockerfile` and `railway.json` must be in the repo root.
2. Go to railway.com → **New Project → Deploy from GitHub repo** → pick the repo.
3. Wait for the build. The health check at `/health` must pass before the deploy goes live.
4. Open the service → **Settings → Networking → Generate Domain** to get a public address like `https://gbtb-explorer-production.up.railway.app`.
5. Open `<your-domain>/kiosk` on the big screen.

Or with the CLI:
```bash
npm i -g @railway/cli
railway login
railway init        # create a project
railway up          # build and deploy from this folder
railway domain      # create the public address
```

To test the container locally first:
```bash
docker build -t gbtb-explorer .
docker run -p 3000:3000 gbtb-explorer
# open http://localhost:3000/kiosk
```

## Addresses

| Address | What it does |
|---|---|
| `/` | Map. Uses the kiosk layout on wide screens, phone layout on narrow ones |
| `/kiosk` | Forces kiosk mode. Use this on the big touch screen |
| `/?mode=phone` | Forces phone mode on a wide screen |
| `/?spot=flower-dome` | Opens straight to one attraction |
| `/p/2.3/3` | Short QR link: plan with spots 2 and 3, opening on spot 3 |
| `/?calibrate=1` | Click the map to read x/y coordinates (for swapping in another map image) |

## Settings (`public/js/config.js`)

- `publicUrl`: leave empty. The QR codes then use whatever address the site is served from. Set it only if you serve the kiosk from one address but want phones to open a different one (e.g. a custom domain).
- `mapImage`: put the address of the official high-res map illustration here to use it instead of the drawn map. Then open `/?calibrate=1`, click each attraction on the image, and update its `x`/`y` in the `SPOTS` list in `js/app.js` (the map area is 1600 × 1000 units).
- `idleSeconds`: how long the kiosk waits with no touches before starting the idle tour and clearing the visitor's plan (default 60).
- `attractStepSeconds`: seconds per stop on the idle tour.
- `shortLinks`: `true` gives short QR links (`/p/...`). Set it to `false` if the site isn't at the root of its domain.

## Editing content

All attractions live in the `SPOTS` array near the top of `public/js/app.js`: name, category, map position, hours type, price label, description, highlights and tip. Opening hours rules are in `HOURS`, and ready-made routes are in `ROUTES`. Hours were taken from the official site in November 2026. Attractions close once a month for maintenance, so check before a live demo.

## Kiosk tips

- Run the browser full-screen (Chrome: `--kiosk https://your-app.vercel.app/kiosk`).
- Touch, mouse and keyboard all work. Pinch or scroll to zoom, drag to pan.
