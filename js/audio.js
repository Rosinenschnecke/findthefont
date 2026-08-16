/* ============================================================
   Die Geräuschkulisse der Werkstatt.
   Alles synthetisch erzeugt — keine externen Klangdateien.
   ============================================================ */

const Werkstattgeraeusche = (() => {
  let ctx = null;
  let noiseBuffer = null;
  let enabled = localStorage.getItem('ftf.sound') !== 'aus';

  function ensure() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      noiseBuffer = makeNoise();
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function makeNoise() {
    const len = Math.floor(ctx.sampleRate * 0.4);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    return buf;
  }

  /** Ein Rauschstoß mit Hüllkurve — das Grundmaterial jedes Anschlags. */
  function burst({ gain = 0.3, attack = 0.001, decay = 0.06, filter = 2400, q = 1, type = 'bandpass', delay = 0 }) {
    const c = ensure();
    if (!c || !enabled) return;
    const t = c.currentTime + delay;

    const src = c.createBufferSource();
    src.buffer = noiseBuffer;
    src.playbackRate.value = 0.8 + Math.random() * 0.4;

    const bp = c.createBiquadFilter();
    bp.type = type;
    bp.frequency.value = filter * (0.9 + Math.random() * 0.2);
    bp.Q.value = q;

    const env = c.createGain();
    env.gain.setValueAtTime(0.0001, t);
    env.gain.exponentialRampToValueAtTime(gain, t + attack);
    env.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay);

    src.connect(bp).connect(env).connect(c.destination);
    src.start(t);
    src.stop(t + attack + decay + 0.05);
  }

  function tone({ freq = 880, gain = 0.2, decay = 0.5, type = 'sine', delay = 0 }) {
    const c = ensure();
    if (!c || !enabled) return;
    const t = c.currentTime + delay;
    const osc = c.createOscillator();
    osc.type = type;
    osc.frequency.value = freq;
    const env = c.createGain();
    env.gain.setValueAtTime(0.0001, t);
    env.gain.exponentialRampToValueAtTime(gain, t + 0.005);
    env.gain.exponentialRampToValueAtTime(0.0001, t + decay);
    osc.connect(env).connect(c.destination);
    osc.start(t);
    osc.stop(t + decay + 0.05);
  }

  return {
    /** Ein einzelner Typenhebel schlägt aufs Papier. */
    anschlag() {
      burst({ gain: 0.22, decay: 0.035, filter: 2600, q: 1.4 });
      burst({ gain: 0.10, decay: 0.09, filter: 480, q: 0.8, delay: 0.008 });
    },
    /** Taste gedrückt — etwas satter als ein Anschlag. */
    taste() {
      burst({ gain: 0.3, decay: 0.05, filter: 1800, q: 1.1 });
      tone({ freq: 150 + Math.random() * 40, gain: 0.06, decay: 0.08, type: 'triangle' });
    },
    /** Der Hebel für die nächste Stufe: Ratsche. */
    hebel() {
      for (let i = 0; i < 5; i++) {
        burst({ gain: 0.14, decay: 0.02, filter: 3200, q: 3, delay: i * 0.035 });
      }
    },
    /** Wagenrücklauf mit Glocke — richtig geraten. */
    glocke() {
      tone({ freq: 1720, gain: 0.18, decay: 1.1, type: 'sine' });
      tone({ freq: 2580, gain: 0.07, decay: 0.7, type: 'sine' });
      burst({ gain: 0.16, decay: 0.32, filter: 1200, q: 0.6, delay: 0.05 });
    },
    /** Papier reißt / Typenhebel verhakt sich — falsch geraten. */
    fehler() {
      burst({ gain: 0.26, decay: 0.22, filter: 900, q: 0.5 });
      tone({ freq: 118, gain: 0.14, decay: 0.3, type: 'sawtooth' });
      tone({ freq: 96, gain: 0.10, decay: 0.34, type: 'sawtooth', delay: 0.06 });
    },
    /** Frisches Blatt wird eingespannt. */
    papier() {
      burst({ gain: 0.16, decay: 0.5, filter: 5200, q: 0.35, type: 'highpass' });
      for (let i = 0; i < 7; i++) {
        burst({ gain: 0.05, decay: 0.03, filter: 2400, q: 2, delay: 0.05 + i * 0.04 });
      }
    },
    /** Stempel aufs Zeugnis. */
    stempel() {
      burst({ gain: 0.34, decay: 0.14, filter: 700, q: 0.7 });
      tone({ freq: 84, gain: 0.16, decay: 0.24, type: 'square' });
    },

    an() { return enabled; },
    umschalten() {
      enabled = !enabled;
      localStorage.setItem('ftf.sound', enabled ? 'an' : 'aus');
      if (enabled) { ensure(); this.taste(); }
      return enabled;
    }
  };
})();
