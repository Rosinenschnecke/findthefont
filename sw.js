/* ============================================================
   Service Worker

   Macht die Seite offline lauffähig und installierbar.

   Zwei Strategien:
   • Das Gerüst (HTML, CSS, JavaScript) wird bei der Installation
     abgelegt und danach aus dem Speicher bedient — mit einer
     Auffrischung im Hintergrund, damit Änderungen ankommen.
   • Schriften und Musik werden erst abgelegt, wenn sie das erste Mal
     gebraucht werden. Alle 64 Schriften vorab zu holen würde den
     ersten Aufruf ausbremsen, und die Musik sind 17 MB.
   ============================================================ */

const VERSION = 'ftf-v1';
const GERUEST = `${VERSION}-geruest`;
const BEIWERK = `${VERSION}-beiwerk`;

const GRUNDAUSSTATTUNG = [
  './',
  './index.html',
  './css/style.css',
  './css/schriften.css',
  './js/fonts.js',
  './js/daily.js',
  './js/share.js',
  './js/settings.js',
  './js/audio.js',
  './js/music.js',
  './js/detect.js',
  './js/specimen.js',
  './js/game.js',
  './manifest.webmanifest',
  './icon.svg'
];

self.addEventListener('install', ereignis => {
  ereignis.waitUntil(
    caches.open(GERUEST)
      .then(speicher => speicher.addAll(GRUNDAUSSTATTUNG))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', ereignis => {
  ereignis.waitUntil(
    caches.keys()
      .then(namen => Promise.all(
        namen.filter(n => !n.startsWith(VERSION)).map(n => caches.delete(n))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', ereignis => {
  const anfrage = ereignis.request;
  if (anfrage.method !== 'GET') return;

  const url = new URL(anfrage.url);
  if (url.origin !== self.location.origin) return;

  const istBeiwerk = /\.(woff2|mp3)$/.test(url.pathname);

  if (istBeiwerk) {
    /* Erst nachschauen, sonst holen und behalten. */
    ereignis.respondWith(
      caches.match(anfrage).then(treffer => treffer || fetch(anfrage).then(antwort => {
        /* Auch Teilinhalte (206) können bei Musik auftreten — die
           lassen sich nicht ablegen und werden durchgereicht. */
        if (antwort.ok && antwort.status === 200) {
          const kopie = antwort.clone();
          caches.open(BEIWERK).then(speicher => speicher.put(anfrage, kopie));
        }
        return antwort;
      }).catch(() => treffer))
    );
    return;
  }

  /* Gerüst: aus dem Speicher bedienen, im Hintergrund auffrischen. */
  ereignis.respondWith(
    caches.match(anfrage).then(treffer => {
      const ausDemNetz = fetch(anfrage).then(antwort => {
        if (antwort.ok) {
          const kopie = antwort.clone();
          caches.open(GERUEST).then(speicher => speicher.put(anfrage, kopie));
        }
        return antwort;
      }).catch(() => treffer);

      return treffer || ausDemNetz;
    })
  );
});
