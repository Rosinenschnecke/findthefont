/* ============================================================
   Schrift des Tages

   Jeden Tag dieselben fünf Schriften für alle — abgeleitet aus dem
   Datum, ohne Server. Zwei Dinge müssen dafür stimmen:

   1. Der Zufall muss aus dem Datum berechnet werden statt aus
      Math.random, damit überall dieselbe Folge herauskommt.
   2. Gezogen wird nur aus den mitgelieferten Schriften. Welche
      Systemschriften ein Gerät besitzt, ist von Gerät zu Gerät
      verschieden — die Aufgabe wäre sonst nicht für alle gleich.

   Gespeichert wird ausschließlich im Browser der spielenden Person.
   ============================================================ */

const Tagesspiel = (() => {
  const SCHLUESSEL = 'ftf.tage';
  const AUFBEWAHRUNG = 400;           // so viele Tage bleiben gespeichert

  /* ---------------- Datum ---------------- */

  /** Ortszeit, nicht UTC — der Tag wechselt dort, wo gespielt wird. */
  function heute(d = new Date()) {
    const p = n => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
  }

  function lesbar(datum) {
    const [j, m, t] = datum.split('-');
    return `${t}.${m}.${j}`;
  }

  /** Millisekunden bis zur nächsten Schrift des Tages. */
  function bisMorgen() {
    const jetzt = new Date();
    const mitternacht = new Date(jetzt);
    mitternacht.setHours(24, 0, 0, 0);
    return mitternacht - jetzt;
  }

  /* ---------------- Zufall aus dem Datum ---------------- */

  function saat(datum) {
    let h = 2166136261;
    for (let i = 0; i < datum.length; i++) {
      h ^= datum.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  /** mulberry32 — klein, schnell, für Spielzwecke gut genug. */
  function wuerfel(datum) {
    let a = saat(datum);
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      let t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  /**
   * Die Schriften des Tages stammen nur aus dem mitgelieferten
   * Bestand und stehen in fester Reihenfolge — sonst zöge jedes
   * Gerät andere Schriften.
   */
  function pool() {
    return FONT_CATALOG
      .filter(f => f.src === 'google' && bekanntheitVon(f.n) <= 2)
      .slice()
      .sort((a, b) => a.n.localeCompare(b.n, 'de'));
  }

  /* ---------------- Gespeicherte Tage ---------------- */

  function alle() {
    try {
      return JSON.parse(localStorage.getItem(SCHLUESSEL) || '{}');
    } catch (e) {
      return {};
    }
  }

  function hole(datum) {
    return alle()[datum] || null;
  }

  /** ergebnis: { p: Punkte, s: [Stufe je Runde, -1 = nicht erkannt] } */
  function speichere(datum, ergebnis) {
    const tage = alle();
    tage[datum] = ergebnis;

    const zuViel = Object.keys(tage).sort();
    while (zuViel.length > AUFBEWAHRUNG) delete tage[zuViel.shift()];

    try { localStorage.setItem(SCHLUESSEL, JSON.stringify(tage)); } catch (e) {}
  }

  function loesche() {
    try { localStorage.removeItem(SCHLUESSEL); } catch (e) {}
  }

  /* ---------------- Auswertung ---------------- */

  /** Aktuelle und längste Serie aufeinanderfolgender Tage. */
  function serie() {
    const tage = Object.keys(alle()).sort();
    if (!tage.length) return { aktuell: 0, laengste: 0 };

    let laengste = 1, lauf = 1;
    for (let i = 1; i < tage.length; i++) {
      const vorher = new Date(tage[i - 1] + 'T12:00:00');
      const jetzt = new Date(tage[i] + 'T12:00:00');
      const tagesabstand = Math.round((jetzt - vorher) / 86400000);
      lauf = tagesabstand === 1 ? lauf + 1 : 1;
      if (lauf > laengste) laengste = lauf;
    }

    /* Die aktuelle Serie zählt nur, wenn heute oder gestern
       gespielt wurde — sonst ist sie gerissen. */
    const letzter = tage[tage.length - 1];
    const abstandZuHeute = Math.round(
      (new Date(heute() + 'T12:00:00') - new Date(letzter + 'T12:00:00')) / 86400000);

    return { aktuell: abstandZuHeute <= 1 ? lauf : 0, laengste };
  }

  /**
   * Anteil der eigenen bisherigen Tage, die unter dem übergebenen
   * Ergebnis liegen — der ehrliche Vergleich, den ein Browser ohne
   * Server anstellen kann.
   */
  function eigenerRang(punkte, ohneDatum) {
    const werte = Object.entries(alle())
      .filter(([d]) => d !== ohneDatum)
      .map(([, e]) => e.p);
    if (!werte.length) return null;
    const schlechter = werte.filter(w => w < punkte).length;
    return { anteil: schlechter / werte.length, tage: werte.length };
  }

  /** Punkte in Klassen zu je 500, für das Balkendiagramm. */
  function punkteverteilung(klassenbreite = 500, maximum = 5000) {
    const anzahl = Math.ceil(maximum / klassenbreite);
    const klassen = Array.from({ length: anzahl }, (_, i) => ({
      von: i * klassenbreite,
      bis: (i + 1) * klassenbreite,
      anzahl: 0
    }));
    Object.values(alle()).forEach(e => {
      const i = Math.min(anzahl - 1, Math.floor(e.p / klassenbreite));
      klassen[i].anzahl++;
    });
    return klassen;
  }

  /** Wie oft wurde auf welcher Stufe erkannt (Index 0–6, 7 = gar nicht). */
  function stufenverteilung(stufenzahl) {
    const zaehler = Array(stufenzahl + 1).fill(0);
    Object.values(alle()).forEach(e => {
      (e.s || []).forEach(stufe => {
        zaehler[stufe < 0 ? stufenzahl : stufe]++;
      });
    });
    return zaehler;
  }

  return {
    heute, lesbar, bisMorgen,
    wuerfel, pool,
    hole, speichere, alle, loesche,
    serie, eigenerRang, punkteverteilung, stufenverteilung
  };
})();
