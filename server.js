// Tiny static server with no dependencies, used for Railway (or any Node host) and local testing.
// Vercel doesn't use this file: it serves /public directly (see vercel.json).
const http = require("http");
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");
const crypto = require("crypto");

const PORT = process.env.PORT || 3000;
const ROOT = path.join(__dirname, "public");
const TYPES = {
  ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp",
  ".json": "application/json", ".webmanifest": "application/manifest+json", ".ico": "image/x-icon", ".txt": "text/plain; charset=utf-8",
};
const COMPRESSIBLE = /^(text\/|image\/svg|application\/(json|manifest\+json))/;
// Files that must always be revalidated so a new deploy is picked up straight away.
const NO_CACHE = new Set([".html", ".webmanifest"]);

const SECURITY = {
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-Frame-Options": "SAMEORIGIN",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=()",
  "Content-Security-Policy": [
    "default-src 'self'",
    "script-src 'self'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https:",
    "connect-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com",
    "manifest-src 'self'",
    "frame-ancestors 'self'",
    "base-uri 'self'",
  ].join("; "),
};
if (process.env.NODE_ENV === "production") SECURITY["Strict-Transport-Security"] = "max-age=15552000";

// Small site, so files are kept in memory (with a gzipped copy) and re-read only when they change on disk.
const cache = new Map();
function load(file, cb) {
  fs.stat(file, (err, st) => {
    if (err || !st.isFile()) return cb(null);
    const hit = cache.get(file);
    if (hit && hit.mtime === st.mtimeMs) return cb(hit);
    fs.readFile(file, (err, body) => {
      if (err) return cb(null);
      const ext = path.extname(file).toLowerCase();
      const type = TYPES[ext] || "application/octet-stream";
      const entry = {
        body, type, ext, name: path.basename(file), mtime: st.mtimeMs,
        etag: '"' + crypto.createHash("sha1").update(body).digest("base64url").slice(0, 20) + '"',
        gz: COMPRESSIBLE.test(type) && body.length > 1024 ? zlib.gzipSync(body, { level: 9 }) : null,
      };
      cache.set(file, entry);
      cb(entry);
    });
  });
}

function plain(res, status, text, head) {
  res.writeHead(status, { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store", ...SECURITY });
  res.end(head ? undefined : text);
}

function send(req, res, f) {
  const headers = {
    "Content-Type": f.type,
    "Cache-Control": NO_CACHE.has(f.ext) || f.name === "sw.js" ? "no-cache" : "public, max-age=3600",
    "ETag": f.etag,
    "Vary": "Accept-Encoding",
    ...SECURITY,
  };
  if (req.headers["if-none-match"] === f.etag) { res.writeHead(304, headers); return res.end(); }
  const gzip = f.gz && /\bgzip\b/.test(req.headers["accept-encoding"] || "");
  const body = gzip ? f.gz : f.body;
  if (gzip) headers["Content-Encoding"] = "gzip";
  headers["Content-Length"] = body.length;
  res.writeHead(200, headers);
  res.end(req.method === "HEAD" ? undefined : body);
}

const INDEX = path.join(ROOT, "index.html");
const serveApp = (req, res) => load(INDEX, f => f ? send(req, res, f) : plain(res, 500, "index.html missing"));

const server = http.createServer((req, res) => {
  const head = req.method === "HEAD";
  if (req.method !== "GET" && !head) { res.setHeader("Allow", "GET, HEAD"); return plain(res, 405, "Method not allowed", head); }

  let p;
  try { p = decodeURIComponent(new URL(req.url, "http://localhost").pathname); }
  catch (e) { return plain(res, 400, "Bad request", head); } // malformed %-escapes used to crash the process

  if (p === "/health") return plain(res, 200, "ok", head);

  // App routes: short QR links (/p/...) and the kiosk address (/kiosk) all load the single-page app.
  if (p === "/" || p === "/index.html" || p === "/kiosk" || p === "/kiosk/" || p.startsWith("/p/")) return serveApp(req, res);

  const file = path.normalize(path.join(ROOT, p));
  if (file !== ROOT && !file.startsWith(ROOT + path.sep)) return plain(res, 403, "Forbidden", head);
  load(file, f => {
    if (f) return send(req, res, f);
    // A missing asset (has a file extension) is a real 404; anything else falls back to the app.
    if (path.extname(p)) return plain(res, 404, "Not found", head);
    serveApp(req, res);
  });
});

server.keepAliveTimeout = 65000; // longer than typical proxy idle timeouts, avoids sporadic 502s
server.listen(PORT, "0.0.0.0", () => console.log(`Gardens by the Bay Explorer running on http://localhost:${PORT}`));

// Railway sends SIGTERM on redeploy: finish in-flight requests, then exit.
for (const sig of ["SIGTERM", "SIGINT"]) process.on(sig, () => {
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(0), 5000).unref();
});
