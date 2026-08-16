/* ============================================================
   Einstellungen — Lautstärken und Anzeigeoptionen.
   Wird im Browser gespeichert und überlebt einen Neustart.
   ============================================================ */

const Einstellungen = (() => {
  const SCHLUESSEL = 'ftf.einstellungen';

  const STANDARD = {
    musikAn: true,
    musikLaut: 35,      // 0–100
    sfxAn: true,
    sfxLaut: 70,        // 0–100
    tippgeraeusch: true,
    wenigerBewegung: false
  };

  let werte = { ...STANDARD };
  const zuhoerer = [];

  function laden() {
    try {
      const roh = localStorage.getItem(SCHLUESSEL);
      if (roh) werte = { ...STANDARD, ...JSON.parse(roh) };
    } catch (e) {
      werte = { ...STANDARD };
    }
    /* Wer Animationen im Betriebssystem abgestellt hat, bekommt sie
       hier ebenfalls nicht — außer er hat es selbst anders gesetzt. */
    if (!localStorage.getItem(SCHLUESSEL) &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      werte.wenigerBewegung = true;
    }
    anwenden();
  }

  function sichern() {
    try { localStorage.setItem(SCHLUESSEL, JSON.stringify(werte)); } catch (e) {}
  }

  function anwenden() {
    document.documentElement.classList.toggle('ruhig', werte.wenigerBewegung);
    zuhoerer.forEach(fn => fn(werte));
  }

  return {
    laden,
    /** Aktuelle Werte (Kopie). */
    alle: () => ({ ...werte }),
    hole: name => werte[name],
    setze(name, wert) {
      werte[name] = wert;
      sichern();
      anwenden();
    },
    /** Wird bei jeder Änderung gerufen. */
    beiAenderung(fn) { zuhoerer.push(fn); fn(werte); },
    zuruecksetzen() {
      werte = { ...STANDARD };
      sichern();
      anwenden();
    }
  };
})();
