/* ============================================================
   Hintergrundmusik.

   Browser lassen Ton erst zu, nachdem die Person etwas angeklickt
   hat. Deshalb wird beim ersten Klick oder Tastendruck gestartet,
   nicht schon beim Laden der Seite.
   ============================================================ */

const Musik = (() => {
  const QUELLE = 'assets/musik/jazz.mp3';

  let element = null;
  let laeuft = false;
  let blende = null;

  function bauen() {
    if (element) return element;
    element = new Audio();
    element.src = QUELLE;
    element.loop = true;
    element.preload = 'none';   // erst laden, wenn wirklich gespielt wird
    element.volume = 0;
    return element;
  }

  function zielLautstaerke() {
    const e = Einstellungen.alle();
    return e.musikAn ? Math.max(0, Math.min(1, e.musikLaut / 100)) : 0;
  }

  /** Sanft auf die Ziellautstärke fahren statt hart umschalten. */
  function blenden(ziel, dauer = 900) {
    if (!element) return;
    clearInterval(blende);
    const start = element.volume;
    const beginn = performance.now();
    blende = setInterval(() => {
      const p = Math.min(1, (performance.now() - beginn) / dauer);
      element.volume = start + (ziel - start) * p;
      if (p >= 1) {
        clearInterval(blende);
        if (ziel === 0) { element.pause(); laeuft = false; }
      }
    }, 40);
  }

  function starten() {
    if (!Einstellungen.hole('musikAn')) return;
    bauen();
    if (laeuft) return;
    const versuch = element.play();
    if (versuch && versuch.catch) {
      versuch.then(() => { laeuft = true; blenden(zielLautstaerke()); })
             .catch(() => { laeuft = false; });  // Browser blockt noch
    } else {
      laeuft = true;
      blenden(zielLautstaerke());
    }
  }

  function stoppen() { blenden(0, 500); }

  /** Beim ersten Klick/Tastendruck anwerfen. */
  function beiErsterGeste() {
    const los = () => {
      starten();
      document.removeEventListener('pointerdown', los);
      document.removeEventListener('keydown', los);
    };
    document.addEventListener('pointerdown', los);
    document.addEventListener('keydown', los);
  }

  Einstellungen.beiAenderung(e => {
    if (!element) return;
    if (e.musikAn) {
      if (!laeuft) starten(); else blenden(zielLautstaerke(), 250);
    } else {
      stoppen();
    }
  });

  return {
    beiErsterGeste,
    starten,
    stoppen,
    /** Für die Vorschau im Einstellungsfenster. */
    sofortLautstaerke() {
      if (element && laeuft) { clearInterval(blende); element.volume = zielLautstaerke(); }
      else if (Einstellungen.hole('musikAn')) starten();
    },
    laeuft: () => laeuft
  };
})();
