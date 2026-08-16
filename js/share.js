/* ============================================================
   Ergebnis als Bild

   Zeichnet das Ergebnis auf ein Canvas — ein Blatt Papier mit
   Punktzahl, Kästchenraster und den erkannten Schriften. Jede
   Schrift steht dabei in sich selbst, das ist ja der Reiz.
   ============================================================ */

const Ergebnisbild = (() => {
  const BREITE = 1080;
  const KOPF = 700;          // alles bis zum Kästchenraster
  const ZEILE = 76;          // Höhe je Schriftzeile
  const FUSS = 150;

  const PAPIER = '#f3e9d2';
  const PAPIER_HELL = '#fbf4e2';
  const TINTE = '#241f1c';
  const GRAU = '#7a6e60';
  const ROT = '#b0362b';

  const KAESTCHEN = {
    frueh: '#4d7a3f',   // Stufe 1–2
    mittel: '#c9a227',  // Stufe 3–4
    spaet: '#c9752a',   // Stufe 5–7
    daneben: '#b0362b'  // nicht erkannt
  };

  function farbeFuer(stufe) {
    if (stufe < 0) return KAESTCHEN.daneben;
    if (stufe <= 1) return KAESTCHEN.frueh;
    if (stufe <= 3) return KAESTCHEN.mittel;
    return KAESTCHEN.spaet;
  }

  /** Leichte Papierstruktur, damit es nicht nach Formular aussieht. */
  function papier(ctx, HOEHE) {
    const verlauf = ctx.createLinearGradient(0, 0, BREITE, HOEHE);
    verlauf.addColorStop(0, PAPIER_HELL);
    verlauf.addColorStop(1, PAPIER);
    ctx.fillStyle = verlauf;
    ctx.fillRect(0, 0, BREITE, HOEHE);

    ctx.globalAlpha = 0.035;
    ctx.fillStyle = TINTE;
    for (let y = 0; y < HOEHE; y += 6) ctx.fillRect(0, y, BREITE, 1);
    ctx.globalAlpha = 1;

    ctx.strokeStyle = 'rgba(36,31,28,.45)';
    ctx.lineWidth = 4;
    ctx.strokeRect(34, 34, BREITE - 68, HOEHE - 68);
    ctx.lineWidth = 1;
    ctx.strokeRect(48, 48, BREITE - 96, HOEHE - 96);
  }

  function schrift(ctx, groesse, familie = 'Special Elite') {
    ctx.font = `400 ${groesse}px "${familie}", "Courier New", monospace`;
  }

  /**
   * ergebnis = {
   *   titel:   'Schrift des Tages · 16.08.2026',
   *   punkte:  3240,
   *   rang:    'Sehr sicher',
   *   runden:  [{ name: 'Futura', stufe: 2, richtig: true }, …],
   *   fuss:    'rosinenschnecke.github.io/findthefont'
   * }
   */
  function zeichne(ergebnis) {
    /* Die Höhe richtet sich nach der Zahl der Runden, damit unten
       kein leeres Feld stehen bleibt. */
    const zeilen = ergebnis.runden.filter(r => r.name).length;
    const HOEHE = KOPF + zeilen * ZEILE + FUSS;

    const cv = document.createElement('canvas');
    cv.width = BREITE;
    cv.height = HOEHE;
    const ctx = cv.getContext('2d');

    papier(ctx, HOEHE);
    ctx.textAlign = 'center';
    ctx.fillStyle = TINTE;

    schrift(ctx, 62);
    ctx.fillText('findthefont', BREITE / 2, 168);

    schrift(ctx, 26);
    ctx.fillStyle = ROT;
    ctx.fillText(ergebnis.titel.toUpperCase(), BREITE / 2, 218);

    /* Punktzahl groß in die Mitte des Kopfes */
    ctx.fillStyle = TINTE;
    schrift(ctx, 150);
    ctx.fillText(ergebnis.punkte.toLocaleString('de-DE'), BREITE / 2, 372);
    schrift(ctx, 24);
    ctx.fillStyle = GRAU;
    ctx.fillText('PUNKTE', BREITE / 2, 410);

    if (ergebnis.rang) {
      schrift(ctx, 44);
      ctx.fillStyle = ROT;
      ctx.fillText(ergebnis.rang, BREITE / 2, 476);
    }

    /* Kästchenraster: ein Feld je Runde */
    const felder = ergebnis.runden.length;
    const kante = 84, luecke = 20;
    const gesamt = felder * kante + (felder - 1) * luecke;
    let x = (BREITE - gesamt) / 2;
    const y = 528;

    ergebnis.runden.forEach(r => {
      ctx.fillStyle = farbeFuer(r.richtig ? r.stufe : -1);
      ctx.beginPath();
      ctx.roundRect(x, y, kante, kante, 10);
      ctx.fill();

      ctx.fillStyle = PAPIER_HELL;
      schrift(ctx, 40);
      ctx.fillText(r.richtig ? String(r.stufe + 1) : '✗', x + kante / 2, y + kante / 2 + 15);
      x += kante + luecke;
    });

    schrift(ctx, 20);
    ctx.fillStyle = GRAU;
    ctx.fillText('ZAHL = STUFE, AUF DER ERKANNT WURDE', BREITE / 2, y + kante + 42);

    /* Die Schriften der Runde, jede in sich selbst gesetzt */
    let zeileY = y + kante + 116;
    ctx.textAlign = 'left';

    ergebnis.runden.forEach((r, i) => {
      if (!r.name) return;
      ctx.fillStyle = GRAU;
      schrift(ctx, 30);
      ctx.fillText(String(i + 1), 120, zeileY);

      ctx.fillStyle = r.richtig ? TINTE : 'rgba(36,31,28,.45)';
      ctx.font = `400 46px "${r.name}", serif`;
      ctx.fillText(r.name, 170, zeileY);

      ctx.strokeStyle = 'rgba(36,31,28,.18)';
      ctx.beginPath();
      ctx.moveTo(120, zeileY + 26);
      ctx.lineTo(BREITE - 120, zeileY + 26);
      ctx.stroke();

      zeileY += 76;
    });

    ctx.textAlign = 'center';
    ctx.fillStyle = GRAU;
    schrift(ctx, 24);
    ctx.fillText(ergebnis.fuss, BREITE / 2, HOEHE - 60);

    return cv;
  }

  /** Liefert das Bild als Blob. */
  function alsBlob(ergebnis) {
    const cv = zeichne(ergebnis);
    return new Promise(res => cv.toBlob(res, 'image/png'));
  }

  /**
   * Teilt das Bild, wenn das Gerät es kann — sonst wird es
   * heruntergeladen. Liefert zurück, was passiert ist.
   */
  async function teileOderLade(ergebnis, dateiname) {
    const blob = await alsBlob(ergebnis);
    if (!blob) return 'fehler';

    const datei = new File([blob], dateiname, { type: 'image/png' });
    if (navigator.canShare && navigator.canShare({ files: [datei] })) {
      try {
        await navigator.share({ files: [datei] });
        return 'geteilt';
      } catch (e) {
        if (e && e.name === 'AbortError') return 'abgebrochen';
      }
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = dateiname;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 10000);
    return 'geladen';
  }

  return { zeichne, alsBlob, teileOderLade };
})();
