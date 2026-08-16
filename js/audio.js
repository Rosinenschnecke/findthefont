/* ============================================================
   Soundeffekte — alles synthetisch erzeugt, keine Klangdateien.
   Die Lautstärke kommt aus den Einstellungen.
   ============================================================ */

const Sfx = (() => {
  let ctx = null;
  let rauschen = null;
  let summe = null;      // gemeinsamer Lautstärkeregler

  function ensure() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      rauschen = macheRauschen();
      summe = ctx.createGain();
      summe.connect(ctx.destination);
      aktualisiereLautstaerke();
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function macheRauschen() {
    const len = Math.floor(ctx.sampleRate * 0.4);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    return buf;
  }

  function aktualisiereLautstaerke() {
    if (!summe) return;
    const e = Einstellungen.alle();
    summe.gain.value = e.sfxAn ? Math.max(0, Math.min(1, e.sfxLaut / 100)) : 0;
  }

  Einstellungen.beiAenderung(aktualisiereLautstaerke);

  function an() { return Einstellungen.hole('sfxAn'); }

  /** Rauschstoß mit Hüllkurve — Grundmaterial jedes Anschlags. */
  function stoss({ gain = 0.3, attack = 0.001, decay = 0.06, filter = 2400, q = 1, type = 'bandpass', delay = 0 }) {
    const c = ensure();
    if (!c || !an()) return;
    const t = c.currentTime + delay;

    const src = c.createBufferSource();
    src.buffer = rauschen;
    src.playbackRate.value = 0.8 + Math.random() * 0.4;

    const bp = c.createBiquadFilter();
    bp.type = type;
    bp.frequency.value = filter * (0.9 + Math.random() * 0.2);
    bp.Q.value = q;

    const huelle = c.createGain();
    huelle.gain.setValueAtTime(0.0001, t);
    huelle.gain.exponentialRampToValueAtTime(gain, t + attack);
    huelle.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay);

    src.connect(bp).connect(huelle).connect(summe);
    src.start(t);
    src.stop(t + attack + decay + 0.05);
  }

  function ton({ freq = 880, gain = 0.2, decay = 0.5, type = 'sine', delay = 0 }) {
    const c = ensure();
    if (!c || !an()) return;
    const t = c.currentTime + delay;
    const osc = c.createOscillator();
    osc.type = type;
    osc.frequency.value = freq;
    const huelle = c.createGain();
    huelle.gain.setValueAtTime(0.0001, t);
    huelle.gain.exponentialRampToValueAtTime(gain, t + 0.005);
    huelle.gain.exponentialRampToValueAtTime(0.0001, t + decay);
    osc.connect(huelle).connect(summe);
    osc.start(t);
    osc.stop(t + decay + 0.05);
  }

  return {
    /** Einzelner Typenanschlag beim Tippen der Schriftprobe. */
    anschlag() {
      if (!Einstellungen.hole('tippgeraeusch')) return;
      stoss({ gain: 0.22, decay: 0.035, filter: 2600, q: 1.4 });
      stoss({ gain: 0.10, decay: 0.09, filter: 480, q: 0.8, delay: 0.008 });
    },
    /** Knopfdruck. */
    taste() {
      stoss({ gain: 0.3, decay: 0.05, filter: 1800, q: 1.1 });
      ton({ freq: 150 + Math.random() * 40, gain: 0.06, decay: 0.08, type: 'triangle' });
    },
    /** Eine Stufe wird aufgedeckt. */
    hebel() {
      for (let i = 0; i < 5; i++) {
        stoss({ gain: 0.14, decay: 0.02, filter: 3200, q: 3, delay: i * 0.035 });
      }
    },
    /** Richtige Antwort. */
    richtig() {
      ton({ freq: 1720, gain: 0.18, decay: 1.1, type: 'sine' });
      ton({ freq: 2580, gain: 0.07, decay: 0.7, type: 'sine' });
      stoss({ gain: 0.16, decay: 0.32, filter: 1200, q: 0.6, delay: 0.05 });
    },
    /** Falsche Antwort. */
    falsch() {
      stoss({ gain: 0.26, decay: 0.22, filter: 900, q: 0.5 });
      ton({ freq: 118, gain: 0.14, decay: 0.3, type: 'sawtooth' });
      ton({ freq: 96, gain: 0.10, decay: 0.34, type: 'sawtooth', delay: 0.06 });
    },
    /** Neue Runde beginnt. */
    papier() {
      stoss({ gain: 0.16, decay: 0.5, filter: 5200, q: 0.35, type: 'highpass' });
      for (let i = 0; i < 7; i++) {
        stoss({ gain: 0.05, decay: 0.03, filter: 2400, q: 2, delay: 0.05 + i * 0.04 });
      }
    },
    /** Ergebnis wird angezeigt. */
    stempel() {
      stoss({ gain: 0.34, decay: 0.14, filter: 700, q: 0.7 });
      ton({ freq: 84, gain: 0.16, decay: 0.24, type: 'square' });
    },
    /** Ein Tipp wird gekauft. */
    tipp() {
      ton({ freq: 900, gain: 0.1, decay: 0.16, type: 'triangle' });
      ton({ freq: 1350, gain: 0.08, decay: 0.2, type: 'triangle', delay: 0.07 });
    },
    /** Die Zeit läuft ab. */
    ticken() {
      stoss({ gain: 0.12, decay: 0.02, filter: 2800, q: 4 });
    },
    /** Zeit abgelaufen. */
    zeitAus() {
      ton({ freq: 320, gain: 0.16, decay: 0.5, type: 'square' });
      ton({ freq: 240, gain: 0.14, decay: 0.6, type: 'square', delay: 0.12 });
    }
  };
})();
