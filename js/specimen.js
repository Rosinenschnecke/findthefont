/* ============================================================
   Die Walze: hier wird die Schriftprobe aufs Papier getippt.

   Bewusst auf ein <canvas> gezeichnet statt als Text im HTML —
   so steht der gesuchte Schriftname nirgends im Quelltext des
   Blattes, und der Anschlag lässt sich Zeichen für Zeichen
   animieren wie an einer echten Maschine.
   ============================================================ */

const Walze = (() => {
  let cv, ctx, dpr = 1;
  let laufendeAnimation = 0;

  const INK = '#241f1c';

  function mount(canvasEl) {
    cv = canvasEl;
    ctx = cv.getContext('2d');
    window.addEventListener('resize', () => { if (letzteProbe) zeichne(letzteProbe, letzteProbe.text.length); });
  }

  function skaliere() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = cv.getBoundingClientRect();
    cv.width = Math.max(1, Math.round(rect.width * dpr));
    cv.height = Math.max(1, Math.round(rect.height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { w: rect.width, h: rect.height };
  }

  /** Bricht den Text so um, dass er in die Breite passt. */
  function umbrich(text, maxW) {
    const woerter = text.split(' ');
    const zeilen = [];
    let zeile = '';
    for (const w of woerter) {
      const probe = zeile ? zeile + ' ' + w : w;
      if (ctx.measureText(probe).width <= maxW || !zeile) {
        zeile = probe;
      } else {
        zeilen.push(zeile);
        zeile = w;
      }
    }
    if (zeile) zeilen.push(zeile);
    return zeilen;
  }

  /**
   * Sucht den größten Schriftgrad, bei dem die Probe noch
   * vollständig aufs Blatt passt.
   */
  function passeAn(text, font, wunschgrad, maxW, maxH) {
    let grad = wunschgrad;
    for (let i = 0; i < 60; i++) {
      ctx.font = `400 ${grad}px "${font}"`;
      const zeilen = umbrich(text, maxW);
      const zeilenhoehe = grad * 1.22;
      const breitesteZeile = Math.max(...zeilen.map(z => ctx.measureText(z).width));

      /* Bei einer einzelnen Zeile zählt die tatsächliche Höhe der
         Druckfarbe, nicht der Kegel — sonst bliebe ein einzelner
         Punkt lächerlich klein, obwohl das halbe Blatt frei ist. */
      let hoehe, erlaubt = maxH;
      if (zeilen.length === 1) {
        const m = ctx.measureText(zeilen[0]);
        hoehe = (m.actualBoundingBoxAscent || grad * 0.7) + (m.actualBoundingBoxDescent || grad * 0.2);
        /* Satzzeichen dürfen groß sein, aber nicht das halbe Blatt
           füllen — sonst wirkt der Punkt wie ein Tintenklecks. */
        if (text.length <= 2) erlaubt = maxH * 0.45;
      } else {
        hoehe = zeilen.length * zeilenhoehe;
      }

      if (breitesteZeile <= maxW && hoehe <= erlaubt) {
        return { grad, zeilen, zeilenhoehe };
      }
      grad *= 0.94;
    }
    ctx.font = `400 ${grad}px "${font}"`;
    return { grad, zeilen: umbrich(text, maxW), zeilenhoehe: grad * 1.22 };
  }

  let letzteProbe = null;

  /** Zeichnet die Probe bis einschließlich Zeichen Nr. `bis`. */
  function zeichne(probe, bis, mitCursor = false) {
    const { w, h } = skaliere();
    ctx.clearRect(0, 0, w, h);

    const rand = Math.min(w, h) * 0.06;
    const maxW = w - rand * 2;
    const maxH = h - rand * 2;

    const layout = passeAn(probe.text, probe.font, probe.grad * Math.min(1, w / 760), maxW, maxH);
    ctx.font = `400 ${layout.grad}px "${probe.font}"`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';

    /* Optische Mitte: Satzspiegel über die tatsächlichen Umrisse
       zentrieren, damit ein einzelner Punkt nicht am Rand klebt. */
    const gesamt = probe.text.slice(0, bis);
    const m = ctx.measureText(layout.zeilen.join(' ') || 'x');
    const asc = m.actualBoundingBoxAscent || layout.grad * 0.72;
    const desc = m.actualBoundingBoxDescent || layout.grad * 0.22;
    const blockHoehe = (layout.zeilen.length - 1) * layout.zeilenhoehe + asc + desc;
    let y = (h - blockHoehe) / 2 + asc;

    /* Zeichen auf die Zeilen verteilen, so weit schon getippt. */
    let rest = gesamt.length;
    for (const zeile of layout.zeilen) {
      const laenge = zeile.length;
      const sichtbar = Math.max(0, Math.min(laenge, rest));
      const teil = zeile.slice(0, sichtbar);

      if (teil) {
        /* Zweifacher Druck mit minimalem Versatz: das Farbband
           trifft nie ganz sauber. */
        ctx.globalAlpha = 0.18;
        ctx.fillStyle = INK;
        ctx.fillText(teil, w / 2 + 0.7, y + 0.7);
        ctx.globalAlpha = 1;
        ctx.fillText(teil, w / 2, y);
      }

      if (mitCursor && (sichtbar < laenge || rest <= laenge)) {
        const bx = w / 2 + ctx.measureText(teil).width / 2 + layout.grad * 0.06;
        ctx.globalAlpha = 0.5;
        ctx.fillRect(bx, y + layout.grad * 0.1, Math.max(2, layout.grad * 0.05), Math.max(2, layout.grad * 0.06));
        ctx.globalAlpha = 1;
      }

      rest -= laenge + 1; // + Leerzeichen des Umbruchs
      y += layout.zeilenhoehe;
      if (rest <= 0) break;
    }

    letzteProbe = probe;
  }

  /**
   * Tippt eine Probe an. Liefert ein Promise, das erfüllt ist,
   * sobald das letzte Zeichen steht.
   */
  function tippe({ font, text, grad, tempo = 45, ton = true }) {
    const probe = { font, text, grad };
    const lauf = ++laufendeAnimation;

    return new Promise(resolve => {
      let i = 0;
      const einZeichen = () => {
        if (lauf !== laufendeAnimation) return resolve();
        i++;
        zeichne(probe, i, i < text.length);
        if (ton && text[i - 1] !== ' ') Werkstattgeraeusche.anschlag();
        if (i < text.length) {
          const pause = tempo * (0.7 + Math.random() * 0.7) + (/[.,;:!?]/.test(text[i - 1]) ? tempo * 3 : 0);
          setTimeout(einZeichen, pause);
        } else {
          zeichne(probe, i, false);
          resolve();
        }
      };
      zeichne(probe, 0, true);
      setTimeout(einZeichen, 160);
    });
  }

  /** Sofort und ohne Animation setzen (z. B. beim Zurückblättern). */
  function setze({ font, text, grad }) {
    laufendeAnimation++;
    zeichne({ font, text, grad }, text.length, false);
  }

  function leere() {
    laufendeAnimation++;
    letzteProbe = null;
    const { w, h } = skaliere();
    ctx.clearRect(0, 0, w, h);
  }

  return { mount, tippe, setze, leere };
})();
