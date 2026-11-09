/* Edit these settings, then redeploy. */
window.CONFIG = {
  // Public address of this page once hosted (e.g. https://gbtb-explorer.vercel.app). Used for QR codes.
  // Leave empty to use the current address automatically.
  publicUrl: "",
  // Optional: URL of the official high-res illustrated map to use instead of the drawn one.
  // Open the page with ?calibrate=1 to click on the image and read coordinates for each spot.
  mapImage: "",
  idleSeconds: 60,          // kiosk: return to attract mode after this much inactivity
  attractStepSeconds: 6,
  // QR codes use short links like https://your-app.vercel.app/p/2.3/3 (needs the site at the domain root).
  shortLinks: true,
};
