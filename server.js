// Tiny static server with no dependencies, used for Railway (or any Node host) and local testing.
// Vercel doesn't use this file: it serves /public directly (see vercel.json).
const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const ROOT = path.join(__dirname, "public");
const TYPES = {
  ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp",
  ".json": "application/json", ".ico": "image/x-icon", ".txt": "text/plain; charset=utf-8",
};

function send(res, file, status = 200) {
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404, { "Content-Type": "text/plain" }); return res.end("Not found"); }
    const ext = path.extname(file).toLowerCase();
    res.writeHead(status, {
      "Content-Type": TYPES[ext] || "application/octet-stream",
      "Cache-Control": ext === ".html" ? "no-cache" : "public, max-age=3600",
      "X-Content-Type-Options": "nosniff",
    });
    res.end(data);
  });
}

http.createServer((req, res) => {
  const url = new URL(req.url, "http://localhost");
  let p = decodeURIComponent(url.pathname);

  if (p === "/health") { res.writeHead(200, { "Content-Type": "text/plain" }); return res.end("ok"); }

  // App routes: short QR links (/p/...) and the kiosk address (/kiosk) all load the single-page app.
  if (p === "/" || p === "/kiosk" || p === "/kiosk/" || p.startsWith("/p/")) return send(res, path.join(ROOT, "index.html"));

  const file = path.normalize(path.join(ROOT, p));
  if (!file.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
  fs.stat(file, (err, st) => {
    if (!err && st.isFile()) return send(res, file);
    send(res, path.join(ROOT, "index.html")); // fall back to the app
  });
}).listen(PORT, "0.0.0.0", () => console.log(`Gardens by the Bay Explorer running on http://localhost:${PORT}`));
