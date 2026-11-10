Cloud Cross Terminal - PWA
==========================
Files (keep them together in one folder):
  index.html, manifest.webmanifest, sw.js, lightweight-charts.js, icons/

A PWA must be served over HTTPS (opening index.html straight from the phone's
file manager will work as a normal page but cannot install or work offline).

Easiest free hosting (pick one):
  - Netlify Drop: drag this folder onto https://app.netlify.com/drop
  - GitHub Pages: push the folder to a repo, Settings > Pages
  - Cloudflare Pages / Vercel: import the folder

Install:
  - Android / Chrome: open the URL, tap the "Install" button in the toolbar (or menu > Install app)
  - iPhone / iPad: open the URL in Safari > Share > Add to Home Screen

Releasing an update: edit sw.js and change VERSION ('cct-v3' -> 'cct-v4') so
installed copies pick up the new files.
