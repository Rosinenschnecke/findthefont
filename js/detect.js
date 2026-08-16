/* ============================================================
   Die Wareneingangs-Kontrolle der Setzerei.

   Nicht jedes Gerät besitzt jede Schrift. Eine Schrift, die nicht
   vorhanden ist, wird vom Browser klammheimlich durch eine andere
   ersetzt — im Spiel wären zwei Antwortmöglichkeiten dann optisch
   identisch. Deshalb wandert nur in den Setzkasten, was hier
   nachweislich mit eigener Form gerendert wird.
   ============================================================ */

const FontDepot = (() => {
  const PROBE = 'mmmwwwiiillIOo0@$MW1lg';
  const PROBE_SIZE = 96;
  const BASELINES = ['monospace', 'serif', 'sans-serif'];
  const LOAD_TIMEOUT = 7000;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  /** Breite + Höhe einer Probe in einer bestimmten Schrift-Angabe. */
  function measure(family) {
    ctx.font = `${PROBE_SIZE}px ${family}`;
    const m = ctx.measureText(PROBE);
    const asc = m.actualBoundingBoxAscent || 0;
    const desc = m.actualBoundingBoxDescent || 0;
    return `${Math.round(m.width * 100)}/${Math.round((asc + desc) * 100)}`;
  }

  /* Fingerabdruck der drei Ausweich-Schriften, einmalig berechnet. */
  const baselinePrints = BASELINES.map(measure);

  /**
   * Vorhanden ist eine Schrift dann, wenn sie sich von allen drei
   * Ausweich-Gattungen unterscheidet. Fällt der Browser mangels
   * Schrift auf die Ausweich-Gattung zurück, sind die Maße identisch.
   */
  function isAvailable(name) {
    return BASELINES.every((base, i) => measure(`"${name}", ${base}`) !== baselinePrints[i]);
  }

  /**
   * Fordert das tatsächliche Laden der Schriftdateien an.
   * Die @font-face-Regeln stehen in css/schriften.css; Browser laden
   * solche Schriften erst, wenn jemand sie anfordert — genau das tut
   * document.fonts.load().
   */
  function forceLoad(names) {
    if (!document.fonts) return Promise.resolve();
    const jobs = names.map(n =>
      document.fonts.load(`400 ${PROBE_SIZE}px "${n}"`).catch(() => {})
    );
    const done = Promise.all(jobs).then(() => document.fonts.ready).catch(() => {});
    const clock = new Promise(res => setTimeout(res, LOAD_TIMEOUT));
    return Promise.race([done, clock]);
  }

  /**
   * Öffnet den Setzkasten: lädt die Webfonts, prüft alle Schriften
   * des Katalogs und liefert nur die brauchbaren zurück.
   * onProgress(0..1) meldet den Fortschritt für die Ladeanzeige.
   */
  async function open(onProgress) {
    const webfonts = FONT_CATALOG.filter(f => f.src === 'google').map(f => f.n);

    onProgress && onProgress(0.1);
    await forceLoad(webfonts.concat(UI_FONTS));
    onProgress && onProgress(0.75);

    /* Kurz durchatmen lassen, damit der Browser die frisch geladenen
       Schriften auch wirklich in die Messung einbezieht. */
    await new Promise(r => requestAnimationFrame(() => setTimeout(r, 60)));

    const stock = [];
    const missing = [];
    FONT_CATALOG.forEach(f => {
      if (UI_FONTS.includes(f.n)) return;
      (isAvailable(f.n) ? stock : missing).push(f);
    });

    onProgress && onProgress(1);
    return { stock, missing, total: FONT_CATALOG.length };
  }

  return { open, isAvailable };
})();
