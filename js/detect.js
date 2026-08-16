/* ============================================================
   Welche Schriften stehen zur Verfügung?

   Zwei Fälle, die verschieden behandelt werden:

   • Mitgelieferte Schriften liegen im Ordner fonts/ und sind damit
     überall vorhanden. Sie werden nicht geprüft und vor allem nicht
     beim Start geladen — das wären knapp drei Megabyte, bevor
     irgendetwas spielbar ist. Geladen wird, was gebraucht wird.

   • Systemschriften sind je nach Gerät da oder nicht. Ob eine
     vorhanden ist, lässt sich ohne Laden messen: Fehlt sie, ersetzt
     der Browser sie durch eine Ausweichgattung, und die Maße stimmen
     dann exakt mit dieser überein.
   ============================================================ */

const FontDepot = (() => {
  const PROBE = 'mmmwwwiiillIOo0@$MW1lg';
  const PROBE_SIZE = 96;
  const BASELINES = ['monospace', 'serif', 'sans-serif'];
  const LADE_FRIST = 6000;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  function measure(family) {
    ctx.font = `${PROBE_SIZE}px ${family}`;
    const m = ctx.measureText(PROBE);
    const asc = m.actualBoundingBoxAscent || 0;
    const desc = m.actualBoundingBoxDescent || 0;
    return `${Math.round(m.width * 100)}/${Math.round((asc + desc) * 100)}`;
  }

  const baselinePrints = BASELINES.map(measure);

  /** Vorhanden ist, was sich von allen drei Ausweichgattungen unterscheidet. */
  function isAvailable(name) {
    return BASELINES.every((base, i) => measure(`"${name}", ${base}`) !== baselinePrints[i]);
  }

  const geladen = new Set();

  /**
   * Lädt die angegebenen Schriften, bevor sie aufs Canvas gezeichnet
   * werden. Ohne das würde beim ersten Anschlag die Ausweichschrift
   * erscheinen — im Spiel wäre das die falsche Antwort.
   */
  function load(namen) {
    if (!document.fonts) return Promise.resolve();

    const offen = namen.filter(n => !geladen.has(n));
    if (!offen.length) return Promise.resolve();

    const jobs = offen.map(n =>
      document.fonts.load(`400 ${PROBE_SIZE}px "${n}"`)
        .then(() => geladen.add(n))
        .catch(() => {}));

    return Promise.race([
      Promise.all(jobs),
      new Promise(res => setTimeout(res, LADE_FRIST))
    ]);
  }

  /** Lädt im Hintergrund vor, ohne auf das Ergebnis zu warten. */
  function vorladen(namen) {
    load(namen);
  }

  /**
   * Öffnet den Bestand. Das geht jetzt in Sekundenbruchteilen, weil
   * nur gemessen und nichts geladen wird.
   */
  async function open(onProgress) {
    onProgress && onProgress(0.2);

    /* Die Schriften der Bedienoberfläche werden sofort gebraucht. */
    await load(UI_FONTS);
    onProgress && onProgress(0.6);

    const stock = [];
    const missing = [];

    FONT_CATALOG.forEach(f => {
      if (UI_FONTS.includes(f.n)) return;
      if (f.src === 'google') { stock.push(f); return; }   // liegt bei
      (isAvailable(f.n) ? stock : missing).push(f);
    });

    onProgress && onProgress(1);
    return { stock, missing, total: FONT_CATALOG.length };
  }

  return { open, load, vorladen, isAvailable };
})();
