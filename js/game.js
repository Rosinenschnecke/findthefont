/* ============================================================
   findthefont — der Betrieb der Setzerei
   ============================================================ */

(() => {
  'use strict';

  /* ---------------- Die sieben Stufen der Enthüllung ---------------- */

  const STUFEN = [
    {
      name: 'Der Punkt', wert: 1000, grad: 900,
      probe: () => '.',
      erklaerung: 'Rund, quadratisch oder rautenförmig? Der Punkt verrät die Bauart.'
    },
    {
      name: 'Das Komma', wert: 800, grad: 820,
      probe: () => ',',
      erklaerung: 'Der Schwung des Kommas zeigt, ob eine Feder Pate stand.'
    },
    {
      name: 'Ein Buchstabe', wert: 620, grad: 520,
      probe: () => waehle(['a', 'g', 'R', 'e', 'k', 'y', 'S', 'Q']),
      erklaerung: 'Ein- oder zweistöckig? Offene oder geschlossene Punze?'
    },
    {
      name: 'Ein kurzes Wort', wert: 460, grad: 320,
      probe: () => waehle(['Typ', 'Hut', 'Zug', 'Reh', 'Gas', 'Eis', 'Blei']),
      erklaerung: 'Jetzt zeigt sich, wie die Buchstaben miteinander auskommen.'
    },
    {
      name: 'Ein langes Wort', wert: 320, grad: 200,
      probe: () => waehle(['Schriftsetzerei', 'Buchstabenkasten', 'Druckerpresse', 'Federzeichnung', 'Handsatzregal']),
      erklaerung: 'Laufweite und Rhythmus werden sichtbar.'
    },
    {
      name: 'Ein kurzer Satz', wert: 200, grad: 120,
      probe: () => waehle([
        'Der Setzer greift zur Lupe.',
        'Die Presse klappert im Hinterhof.',
        'Ein Blatt Papier, frisch gespannt.',
        'Das Farbband ist fast verbraucht.'
      ]),
      erklaerung: 'Im Satzbild verrät sich fast jede Schrift.'
    },
    {
      name: 'Das Pangramm', wert: 110, grad: 84,
      probe: () => 'Franz jagt im komplett verwahrlosten Taxi quer durch Bayern. 0123456789',
      erklaerung: 'Jeder Buchstabe des Alphabets — mehr können wir nicht hergeben.'
    }
  ];

  const GRADE = {
    lehrling: { name: 'Lehrling',  tasten: 4, faktor: 1.0, streng: false, info: '4 Schriften zur Auswahl, gern auch aus verschiedenen Gattungen.' },
    geselle:  { name: 'Geselle',   tasten: 6, faktor: 1.4, streng: true,  info: '6 Schriften — und alle aus derselben Gattung. Kein Schummeln über die Form.' },
    meister:  { name: 'Meister',   tasten: 8, faktor: 1.8, streng: true,  info: '8 verwandte Schriften. Nur für Augen mit Fadenzähler.' }
  };

  const PROBEN_JE_RUNDE = 5;
  const FEHLERKOSTEN = 120;
  const TROSTPUNKTE = 30;

  const RAENGE = [
    { ab: 0.90, titel: 'Meisterhand',                 vermerk: 'Die Werkstatt verneigt sich. Du liest Schrift wie andere Leute Verkehrsschilder.' },
    { ab: 0.75, titel: 'Erste Kraft am Setzkasten',   vermerk: 'Sehr sichere Griffe. Der Meister lässt dich künftig allein an die Presse.' },
    { ab: 0.58, titel: 'Gesellenbrief',               vermerk: 'Solide Arbeit. Ein paar Hebelzüge zu viel, aber das Blatt sitzt sauber.' },
    { ab: 0.40, titel: 'Fleißiges Lehrjahr',          vermerk: 'Der Blick schärft sich. Achte das nächste Mal genauer auf die Serifen.' },
    { ab: 0.22, titel: 'Erste Woche in der Werkstatt',vermerk: 'Noch viel Farbband verbraucht — aber jeder fängt am Punkt an.' },
    { ab: 0,    titel: 'Tinte an den Fingern',        vermerk: 'Papierverbrauch beträchtlich. Wir üben das morgen noch einmal.' }
  ];

  const ORDEN = [
    { id: 'blind',   name: 'Blindsetzer',      text: 'Eine Schrift allein am Punkt erkannt.' },
    { id: 'sparsam', name: 'Sparsam am Hebel', text: 'Eine Probe ohne einen einzigen Hebelzug gelöst.' },
    { id: 'rein',    name: 'Reine Weste',      text: 'Keine einzige Fehltaste in der ganzen Runde.' },
    { id: 'serie',   name: 'Voller Auftrag',   text: 'Alle fünf Proben richtig bestimmt.' },
    { id: 'lupe',    name: 'Der Fadenzähler',  text: 'Eine Probe erst am Pangramm geknackt — aber geknackt.' }
  ];

  /* ---------------- Zustand ---------------- */

  const spiel = {
    lager: [],          // verfügbare Schriften
    grad: 'lehrling',
    probeNr: 0,
    punkte: 0,
    protokoll: [],
    runde: null,
    laeuft: false,
    warteAufWeiter: false
  };

  /* ---------------- Kleine Helfer ---------------- */

  const $ = id => document.getElementById(id);
  const waehle = arr => arr[Math.floor(Math.random() * arr.length)];

  function mische(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function zeigeSchirm(id) {
    document.querySelectorAll('.schirm').forEach(s => s.classList.remove('schirm--aktiv'));
    $(id).classList.add('schirm--aktiv');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /** Zahl im Zählwerk hochlaufen lassen. */
  function zaehleHoch(el, von, bis, dauer = 700) {
    const start = performance.now();
    function schritt(jetzt) {
      const p = Math.min(1, (jetzt - start) / dauer);
      const weich = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(von + (bis - von) * weich).toLocaleString('de-DE');
      if (p < 1) requestAnimationFrame(schritt);
    }
    requestAnimationFrame(schritt);
  }

  /* ---------------- Aufbau: Lager öffnen ---------------- */

  async function hochfahren() {
    const balken = $('lade-balken');
    const texte = [
      'Typenlager wird geöffnet …',
      'Bleisatz wird abgeklopft …',
      'Farbband wird eingefädelt …',
      'Setzkasten wird sortiert …'
    ];
    let t = 0;
    const ticker = setInterval(() => { $('lade-text').textContent = texte[++t % texte.length]; }, 900);

    const { stock, missing, total } = await FontDepot.open(p => {
      balken.style.width = Math.round(p * 100) + '%';
    });

    clearInterval(ticker);
    spiel.lager = stock;

    const eigene = stock.filter(f => f.src === 'sys').length;
    $('lager-info').textContent =
      `${stock.length} von ${total} Schriften einsatzbereit — davon ${eigene} aus dem Bestand deines Geräts. ` +
      (missing.length
        ? `${missing.length} Systemschriften gibt es hier nicht; die bleiben im Regal.`
        : 'Vollständiges Lager, alle Achtung.');
    $('lager-fuss').textContent = `${stock.length} Schriften im Setzkasten`;

    if (stock.length < 8) {
      $('lade-text').textContent = 'Das Lager ist zu leer für einen Auftrag.';
      $('start-knopf').disabled = true;
      $('lager-info').textContent =
        'Es konnten zu wenige Schriften geladen werden. Liegt der Ordner "fonts" neben der Seite ' +
        'und ist css/schriften.css eingebunden?';
      zeigeSchirm('schirm-start');
      return;
    }

    baueStufenschau();
    baueGradWahl();
    zeigeBestwert();
    setTimeout(() => zeigeSchirm('schirm-start'), 350);
  }

  function baueStufenschau() {
    $('stufenschau-liste').innerHTML = STUFEN.map((s, i) => `
      <li class="stufenschau__eintrag">
        <span class="stufenschau__nr">${i + 1}</span>
        <span class="stufenschau__name">${s.name}</span>
        <span class="stufenschau__wert">${s.wert}</span>
      </li>`).join('');
  }

  function baueGradWahl() {
    const wrap = $('grad-wahl');
    wrap.innerHTML = Object.entries(GRADE).map(([key, g]) => `
      <button type="button" class="gradknopf${key === spiel.grad ? ' gradknopf--aktiv' : ''}"
              data-grad="${key}" role="radio" aria-checked="${key === spiel.grad}">
        <span class="gradknopf__name">${g.name}</span>
        <span class="gradknopf__detail">${g.tasten} Tasten · ×${g.faktor.toFixed(1)}</span>
      </button>`).join('');

    wrap.querySelectorAll('.gradknopf').forEach(b => {
      b.addEventListener('click', () => {
        spiel.grad = b.dataset.grad;
        wrap.querySelectorAll('.gradknopf').forEach(x => {
          const aktiv = x === b;
          x.classList.toggle('gradknopf--aktiv', aktiv);
          x.setAttribute('aria-checked', String(aktiv));
        });
        $('grad-hinweis').textContent = GRADE[spiel.grad].info;
        zeigeBestwert();
        Werkstattgeraeusche.taste();
      });
    });
    $('grad-hinweis').textContent = GRADE[spiel.grad].info;
  }

  /* ---------------- Bestwert-Buchhaltung ---------------- */

  const bestwertSchluessel = grad => `ftf.best.${grad}`;

  function holeBestwert(grad) {
    return parseInt(localStorage.getItem(bestwertSchluessel(grad)) || '0', 10);
  }

  function zeigeBestwert() {
    const b = holeBestwert(spiel.grad);
    $('bestwert').textContent = b
      ? `Hausrekord als ${GRADE[spiel.grad].name}: ${b.toLocaleString('de-DE')} Punkte`
      : 'Noch kein Eintrag im Werkstattbuch.';
  }

  /* ---------------- Eine Runde ---------------- */

  function starteRunde() {
    spiel.probeNr = 0;
    spiel.punkte = 0;
    spiel.protokoll = [];
    spiel.laeuft = true;
    $('punkte-zaehler').textContent = '0';
    zeigeSchirm('schirm-spiel');
    Werkstattgeraeusche.papier();
    naechsteProbe();
  }

  function waehleGegner(ziel, anzahl) {
    const streng = GRADE[spiel.grad].streng;
    const gleicheGattung = mische(spiel.lager.filter(f => f !== ziel && f.cat === ziel.cat));
    const rest = mische(spiel.lager.filter(f => f !== ziel && f.cat !== ziel.cat));

    const gewaehlt = [];
    const quelle = streng ? gleicheGattung.concat(rest) : gleicheGattung.slice(0, Math.ceil(anzahl / 2)).concat(rest);
    for (const f of quelle) {
      if (gewaehlt.length >= anzahl - 1) break;
      if (!gewaehlt.includes(f)) gewaehlt.push(f);
    }
    return mische(gewaehlt.concat([ziel]));
  }

  function naechsteProbe() {
    spiel.probeNr++;

    /* Schriften, die in dieser Partie schon dran waren, meiden. */
    const schonGehabt = spiel.protokoll.map(p => p.schrift);
    const frisch = spiel.lager.filter(f => !schonGehabt.includes(f));
    const ziel = waehle(frisch.length >= 1 ? frisch : spiel.lager);

    const tastenzahl = Math.min(GRADE[spiel.grad].tasten, spiel.lager.length);

    spiel.runde = {
      schrift: ziel,
      optionen: waehleGegner(ziel, tastenzahl),
      stufe: 0,
      fehler: [],
      proben: STUFEN.map(s => s.probe()),
      beendet: false
    };

    $('auftrag-zaehler').textContent = `${spiel.probeNr} / ${PROBEN_JE_RUNDE}`;
    $('blatt-kopf-links').textContent = `Probe Nr. ${spiel.probeNr}`;
    $('aufloesung').hidden = true;
    $('blatt').classList.remove('blatt--eingespannt');
    void $('blatt').offsetWidth;                    // Neustart der Einzieh-Animation
    $('blatt').classList.add('blatt--eingespannt');

    baueTastatur();
    baueStufenleiste();
    Walze.leere();
    zeigeStufe(true);
  }

  function aktuellerWert() {
    const r = spiel.runde;
    return Math.max(TROSTPUNKTE, STUFEN[r.stufe].wert - r.fehler.length * FEHLERKOSTEN);
  }

  function zeigeStufe(mitAnimation) {
    const r = spiel.runde;
    const stufe = STUFEN[r.stufe];

    $('blatt-kopf-rechts').textContent = `Stufe ${r.stufe + 1} — ${stufe.name}`;
    $('probenwert').textContent = Math.round(aktuellerWert() * GRADE[spiel.grad].faktor);
    aktualisiereStufenleiste();

    const letzte = r.stufe === STUFEN.length - 1;
    $('hebel-knopf').disabled = letzte;
    $('hebel-info').textContent = letzte
      ? 'mehr gibt das Farbband nicht her'
      : `nächste Stufe · noch ${Math.round(Math.max(TROSTPUNKTE, STUFEN[r.stufe + 1].wert - r.fehler.length * FEHLERKOSTEN) * GRADE[spiel.grad].faktor)} Punkte`;

    const auftrag = { font: r.schrift.n, text: r.proben[r.stufe], grad: stufe.grad };
    if (mitAnimation) {
      Walze.tippe({ ...auftrag, tempo: r.proben[r.stufe].length > 30 ? 22 : 55 });
    } else {
      Walze.setze(auftrag);
    }
  }

  function baueStufenleiste() {
    $('stufenleiste').innerHTML = STUFEN.map((s, i) => `
      <li class="kerbe" data-nr="${i}" title="${s.name} — ${s.wert} Punkte">
        <span class="kerbe__marke"></span>
        <span class="kerbe__nr">${i + 1}</span>
      </li>`).join('');
  }

  function aktualisiereStufenleiste() {
    const r = spiel.runde;
    $('stufenleiste').querySelectorAll('.kerbe').forEach((el, i) => {
      el.classList.toggle('kerbe--auf', i < r.stufe);
      el.classList.toggle('kerbe--jetzt', i === r.stufe);
    });
  }

  function baueTastatur() {
    const t = $('tastatur');
    t.innerHTML = spiel.runde.optionen.map((f, i) => `
      <button type="button" class="taste" data-i="${i}">
        <span class="taste__kappe">
          <span class="taste__ziffer">${i + 1}</span>
          <span class="taste__name">${f.n}</span>
        </span>
      </button>`).join('');
    t.querySelectorAll('.taste').forEach(b => {
      b.addEventListener('click', () => tippeAuf(parseInt(b.dataset.i, 10)));
    });
    t.dataset.spalten = spiel.runde.optionen.length > 6 ? '4' : (spiel.runde.optionen.length > 4 ? '3' : '2');
  }

  /* ---------------- Spielzüge ---------------- */

  function hebelZiehen() {
    const r = spiel.runde;
    if (!r || r.beendet || r.stufe >= STUFEN.length - 1) return;
    r.stufe++;
    Werkstattgeraeusche.hebel();
    $('blatt').classList.add('blatt--ruck');
    setTimeout(() => $('blatt').classList.remove('blatt--ruck'), 320);
    zeigeStufe(true);
  }

  function tippeAuf(index) {
    const r = spiel.runde;
    if (!r || r.beendet) return;
    const gewaehlt = r.optionen[index];
    if (r.fehler.includes(gewaehlt)) return;

    const taste = $('tastatur').querySelector(`.taste[data-i="${index}"]`);

    if (gewaehlt === r.schrift) {
      Werkstattgeraeusche.glocke();
      taste.classList.add('taste--treffer');
      beendeProbe(true, gewaehlt);
      return;
    }

    /* Fehlgriff: Taste verklemmt sich, die Maschine rückt eine Stufe vor. */
    r.fehler.push(gewaehlt);
    Werkstattgeraeusche.fehler();
    taste.classList.add('taste--verklemmt');
    taste.disabled = true;
    document.body.classList.add('erschuettert');
    setTimeout(() => document.body.classList.remove('erschuettert'), 400);

    const nochOffen = r.optionen.length - r.fehler.length;
    if (nochOffen <= 1) {
      beendeProbe(false, gewaehlt);
      return;
    }

    if (r.stufe < STUFEN.length - 1) {
      r.stufe++;
      setTimeout(() => zeigeStufe(true), 260);
    } else {
      zeigeStufe(false);
    }
  }

  function beendeProbe(richtig, gewaehlt) {
    const r = spiel.runde;
    r.beendet = true;
    $('hebel-knopf').disabled = true;
    $('tastatur').querySelectorAll('.taste').forEach(b => { b.disabled = true; });

    const punkte = richtig ? Math.round(aktuellerWert() * GRADE[spiel.grad].faktor) : 0;
    const vorher = spiel.punkte;
    spiel.punkte += punkte;

    spiel.protokoll.push({
      schrift: r.schrift,
      richtig,
      stufe: r.stufe,
      fehler: r.fehler.length,
      punkte,
      gewaehlt: richtig ? null : gewaehlt
    });

    zaehleHoch($('punkte-zaehler'), vorher, spiel.punkte);
    setTimeout(() => zeigeAufloesung(richtig, gewaehlt, punkte), 620);
  }

  function zeigeAufloesung(richtig, gewaehlt, punkte) {
    const r = spiel.runde;
    const box = $('aufloesung');

    $('stempel').className = 'stempel ' + (richtig ? 'stempel--gut' : 'stempel--schlecht');
    $('stempel-text').textContent = richtig ? 'gesetzt' : 'Makulatur';

    $('aufloesung-vorspann').textContent = richtig
      ? `Erkannt auf Stufe ${r.stufe + 1}`
      : 'Die gesuchte Schrift war';
    $('aufloesung-name').textContent = r.schrift.n;
    $('aufloesung-name').style.fontFamily = `"${r.schrift.n}", serif`;
    $('aufloesung-meta').textContent = `${CATEGORY_LABELS[r.schrift.cat]} · ${r.schrift.m}`;
    $('aufloesung-probe').textContent = 'Hamburgefonstiv 0123';
    $('aufloesung-probe').style.fontFamily = `"${r.schrift.n}", serif`;
    $('aufloesung-wissen').textContent = r.schrift.t;

    const vergleich = $('aufloesung-vergleich');
    if (!richtig && gewaehlt) {
      vergleich.hidden = false;
      $('vergleich-probe').textContent = 'Hamburgefonstiv 0123';
      $('vergleich-probe').style.fontFamily = `"${gewaehlt.n}", serif`;
      $('vergleich-name').textContent = gewaehlt.n;
    } else {
      vergleich.hidden = true;
    }

    const fehlerText = r.fehler.length
      ? ` (${r.fehler.length} Fehlgriff${r.fehler.length > 1 ? 'e' : ''})`
      : '';
    $('aufloesung-punkte').textContent = richtig
      ? `+ ${punkte.toLocaleString('de-DE')} Punkte${fehlerText}`
      : 'Kein Punkt für dieses Blatt.';

    $('weiter-text').textContent = spiel.probeNr >= PROBEN_JE_RUNDE ? 'Zeugnis ausstellen' : 'Nächstes Blatt';
    box.hidden = false;
    spiel.warteAufWeiter = true;
    $('weiter-knopf').focus({ preventScroll: true });
  }

  function weiter() {
    if (!spiel.warteAufWeiter) return;
    spiel.warteAufWeiter = false;
    if (spiel.probeNr >= PROBEN_JE_RUNDE) {
      stelleZeugnisAus();
    } else {
      Werkstattgeraeusche.papier();
      naechsteProbe();
    }
  }

  /* ---------------- Zeugnis ---------------- */

  function verdienteOrden() {
    const p = spiel.protokoll;
    const verliehen = [];
    if (p.some(x => x.richtig && x.stufe === 0)) verliehen.push('blind');
    if (p.some(x => x.richtig && x.stufe === 0 && x.fehler === 0)) verliehen.push('sparsam');
    if (p.every(x => x.fehler === 0)) verliehen.push('rein');
    if (p.every(x => x.richtig)) verliehen.push('serie');
    if (p.some(x => x.richtig && x.stufe === STUFEN.length - 1)) verliehen.push('lupe');
    return ORDEN.filter(o => verliehen.includes(o.id));
  }

  function stelleZeugnisAus() {
    spiel.laeuft = false;
    const maximum = PROBEN_JE_RUNDE * STUFEN[0].wert * GRADE[spiel.grad].faktor;
    const quote = spiel.punkte / maximum;
    const rang = RAENGE.find(r => quote >= r.ab);

    zeigeSchirm('schirm-ende');
    Werkstattgeraeusche.stempel();

    $('zeugnis-rang').textContent = rang.titel;
    $('zeugnis-vermerk').textContent = rang.vermerk;
    zaehleHoch($('zeugnis-punkte'), 0, spiel.punkte, 1100);

    $('protokoll').innerHTML = spiel.protokoll.map((p, i) => `
      <li class="protokoll__zeile${p.richtig ? '' : ' protokoll__zeile--daneben'}">
        <span class="protokoll__nr">${i + 1}</span>
        <span class="protokoll__schrift" style="font-family:'${p.schrift.n}', serif">${p.schrift.n}</span>
        <span class="protokoll__stufe">${p.richtig ? 'Stufe ' + (p.stufe + 1) : 'nicht erkannt'}${p.fehler ? ` · ${p.fehler}× daneben` : ''}</span>
        <span class="protokoll__punkte">${p.punkte ? '+' + p.punkte.toLocaleString('de-DE') : '—'}</span>
      </li>`).join('');

    const orden = verdienteOrden();
    $('orden').innerHTML = orden.length
      ? orden.map(o => `<span class="orden__stueck" title="${o.text}"><b>${o.name}</b><small>${o.text}</small></span>`).join('')
      : '<span class="orden__leer">Diesmal keine Auszeichnung — das Farbband hält noch eine Runde.</span>';

    const alt = holeBestwert(spiel.grad);
    if (spiel.punkte > alt) {
      localStorage.setItem(bestwertSchluessel(spiel.grad), String(spiel.punkte));
      $('bestwert-ende').textContent = `Neuer Hausrekord als ${GRADE[spiel.grad].name}! Bisher: ${alt.toLocaleString('de-DE')} Punkte.`;
    } else {
      $('bestwert-ende').textContent = `Hausrekord als ${GRADE[spiel.grad].name}: ${alt.toLocaleString('de-DE')} Punkte.`;
    }
    zeigeBestwert();
  }

  function ergebnisAbtippen() {
    const zeilen = spiel.protokoll.map((p, i) =>
      `${i + 1}. ${p.schrift.n} — ${p.richtig ? 'Stufe ' + (p.stufe + 1) : 'daneben'} (${p.punkte} P.)`
    );
    const text = [
      `findthefont · ${GRADE[spiel.grad].name}`,
      `${spiel.punkte} Punkte — ${$('zeugnis-rang').textContent}`,
      ...zeilen
    ].join('\n');

    const fertig = () => {
      const k = $('teilen-knopf');
      k.textContent = 'Abgetippt!';
      Werkstattgeraeusche.stempel();
      setTimeout(() => { k.textContent = 'Ergebnis abtippen'; }, 1800);
    };

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(fertig).catch(fertig);
    } else {
      fertig();
    }
  }

  /* ---------------- Bedienung ---------------- */

  function verdrahte() {
    Walze.mount($('probe'));

    $('start-knopf').addEventListener('click', () => { Werkstattgeraeusche.taste(); starteRunde(); });
    $('hebel-knopf').addEventListener('click', hebelZiehen);
    $('weiter-knopf').addEventListener('click', weiter);
    $('nochmal-knopf').addEventListener('click', () => { Werkstattgeraeusche.taste(); starteRunde(); });
    $('teilen-knopf').addEventListener('click', ergebnisAbtippen);

    const tonSchalter = $('ton-schalter');
    const zeigeTon = an => {
      tonSchalter.setAttribute('aria-pressed', String(an));
      tonSchalter.classList.toggle('metallknopf--aus', !an);
      $('ton-text').textContent = an ? 'Ton an' : 'Ton aus';
    };
    zeigeTon(Werkstattgeraeusche.an());
    tonSchalter.addEventListener('click', () => zeigeTon(Werkstattgeraeusche.umschalten()));

    document.addEventListener('keydown', e => {
      if (e.target.matches('input, textarea')) return;

      if (e.code === 'Space' || e.code === 'Enter') {
        const aktiv = document.querySelector('.schirm--aktiv');
        if (!aktiv) return;
        if (aktiv.id === 'schirm-start' && !$('start-knopf').disabled) { e.preventDefault(); $('start-knopf').click(); }
        else if (aktiv.id === 'schirm-ende') { e.preventDefault(); $('nochmal-knopf').click(); }
        else if (aktiv.id === 'schirm-spiel') {
          e.preventDefault();
          if (spiel.warteAufWeiter) weiter();
          else if (e.code === 'Space') hebelZiehen();
        }
        return;
      }

      if (/^Digit[1-8]$/.test(e.code) && spiel.laeuft && !spiel.warteAufWeiter) {
        const i = parseInt(e.code.slice(5), 10) - 1;
        if (spiel.runde && i < spiel.runde.optionen.length) {
          e.preventDefault();
          tippeAuf(i);
        }
      }
    });
  }

  /* ---------------- Los geht's ---------------- */

  verdrahte();
  hochfahren();
})();
