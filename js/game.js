/* ============================================================
   findthefont — Spielablauf
   ============================================================ */

(() => {
  'use strict';

  /* ---------------- Die sieben Stufen ---------------- */

  const STUFEN = [
    { name: 'Punkt',        wert: 1000, grad: 900, probe: () => '.' },
    { name: 'Komma',        wert: 800,  grad: 820, probe: () => ',' },
    { name: 'Buchstabe',    wert: 620,  grad: 520, probe: () => waehle(['a', 'g', 'R', 'e', 'k', 'y', 'S', 'Q']) },
    { name: 'Kurzes Wort',  wert: 460,  grad: 320, probe: () => waehle(['Typ', 'Hut', 'Zug', 'Reh', 'Gas', 'Eis', 'Blei']) },
    { name: 'Langes Wort',  wert: 320,  grad: 200, probe: () => waehle(['Schriftsetzerei', 'Buchstabenkasten', 'Druckerpresse', 'Federzeichnung', 'Handsatzregal']) },
    { name: 'Kurzer Satz',  wert: 200,  grad: 120, probe: () => waehle([
        'Der Setzer greift zur Lupe.',
        'Die Presse klappert im Hinterhof.',
        'Ein Blatt Papier, frisch gespannt.',
        'Das Farbband ist fast verbraucht.'
      ]) },
    { name: 'Ganzes Alphabet', wert: 110, grad: 84,
      probe: () => 'Franz jagt im komplett verwahrlosten Taxi quer durch Bayern. 0123456789' }
  ];

  /* ---------------- Schwierigkeitsgrade ---------------- */

  /* fehlversuche: so viele falsche Antworten sind erlaubt; die
     nächste beendet die Runde. Damit lässt sich nicht einfach
     jede Antwort durchprobieren.
     nachruecken: die falsch geratene Antwort wird durch eine neue
     ersetzt, damit die Auswahl nicht kleiner wird. */
  const SCHWIERIGKEIT = {
    leicht: {
      name: 'Leicht', optionen: 4, zeit: 0, faktor: 1.0,
      bekanntheit: 1, gleicheGattung: false, fehlversuche: 1, nachruecken: false
    },
    mittel: {
      name: 'Mittel', optionen: 5, zeit: 60, faktor: 1.4,
      bekanntheit: 2, gleicheGattung: false, fehlversuche: 1, nachruecken: false
    },
    schwer: {
      name: 'Schwer', optionen: 6, zeit: 40, faktor: 1.9,
      bekanntheit: 3, gleicheGattung: true, fehlversuche: 2, nachruecken: true
    },
    experte: {
      name: 'Experte', optionen: 8, zeit: 25, faktor: 2.5,
      bekanntheit: 3, gleicheGattung: true, fehlversuche: 2, nachruecken: true
    },
    /* Für alle gleich, deshalb feste Regeln und nicht in der
       Schwierigkeitswahl aufgeführt. */
    taeglich: {
      name: 'Schrift des Tages', optionen: 5, zeit: 45, faktor: 1.0,
      bekanntheit: 2, gleicheGattung: false, fehlversuche: 1, nachruecken: false,
      versteckt: true
    }
  };

  const WAEHLBAR = Object.entries(SCHWIERIGKEIT).filter(([, s]) => !s.versteckt);

  const RUNDEN_JE_SPIEL = 5;
  const FEHLERKOSTEN = 120;
  const MINDESTPUNKTE = 30;

  const RAENGE = [
    { ab: 0.90, titel: 'Schriftexperte',   text: 'Beeindruckend. Du erkennst Schriften an fast nichts.' },
    { ab: 0.75, titel: 'Sehr sicher',      text: 'Starke Runde — nur wenige Stufen zu viel aufgedeckt.' },
    { ab: 0.58, titel: 'Gut im Blick',     text: 'Solide. Achte beim nächsten Mal früher auf die Serifen.' },
    { ab: 0.40, titel: 'Auf dem Weg',      text: 'Die Richtung stimmt. Punkt und Komma verraten oft mehr, als man denkt.' },
    { ab: 0.22, titel: 'Noch am Üben',     text: 'Schau dir im Trainingslager ein paar Schriften in Ruhe an.' },
    { ab: 0,    titel: 'Erster Versuch',   text: 'Aller Anfang ist schwer. Im Trainingslager geht es ohne Punktedruck.' }
  ];

  const ORDEN = [
    { id: 'blind',   name: 'Nur ein Punkt',    text: 'Eine Schrift allein am Punkt erkannt.' },
    { id: 'sparsam', name: 'Ohne Hilfe',       text: 'Eine Runde ohne einmal aufzudecken gelöst.' },
    { id: 'rein',    name: 'Fehlerfrei',       text: 'Keine einzige falsche Antwort im ganzen Spiel.' },
    { id: 'serie',   name: 'Alle fünf',        text: 'Alle fünf Schriften richtig bestimmt.' },
    { id: 'lupe',    name: 'Nicht aufgegeben', text: 'Eine Schrift erst auf der letzten Stufe geknackt.' }
  ];

  /* ---------------- Zustand ---------------- */

  const spiel = {
    lager: [],
    modus: 'klassisch',        // 'klassisch' | 'training'
    stufe: 'leicht',           // Schlüssel aus SCHWIERIGKEIT
    training: { gattung: 'alle', bekanntheit: 2, optionen: 4 },
    rundeNr: 0,
    richtige: 0,
    punkte: 0,
    protokoll: [],
    runde: null,
    laeuft: false,
    warteAufWeiter: false,
    uhr: null,
    restzeit: 0
  };

  /* ---------------- Helfer ---------------- */

  const $ = id => document.getElementById(id);
  const zahl = n => n.toLocaleString('de-DE');

  /* Im Tagesmodus kommt der Zufall aus dem Datum, damit alle
     dieselbe Aufgabe bekommen. Sonst der übliche Zufall. */
  let wuerfel = Math.random;

  const waehle = arr => arr[Math.floor(wuerfel() * arr.length)];

  function mische(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(wuerfel() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function zeigeSchirm(id) {
    document.querySelectorAll('.schirm').forEach(s => s.classList.remove('schirm--aktiv'));
    $('schirm-' + id).classList.add('schirm--aktiv');
    $('menue-knopf').hidden = (id === 'menue' || id === 'laden');
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  function zaehleHoch(el, von, bis, dauer = 700) {
    if (Einstellungen.hole('wenigerBewegung')) { el.textContent = zahl(bis); return; }
    const start = performance.now();
    (function schritt(jetzt) {
      const p = Math.min(1, (jetzt - start) / dauer);
      el.textContent = zahl(Math.round(von + (bis - von) * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(schritt);
    })(start);
  }

  /* ---------------- Rückfrage-Fenster ---------------- */

  let rueckfrageAntwort = null;

  function frage(titel, text, jaText = 'Ja') {
    $('rueckfrage-titel').textContent = titel;
    $('rueckfrage-text').textContent = text;
    $('rueckfrage-ja').textContent = jaText;
    $('rueckfrage').hidden = false;
    $('rueckfrage-ja').focus();
    return new Promise(res => { rueckfrageAntwort = res; });
  }

  function schliesseRueckfrage(antwort) {
    $('rueckfrage').hidden = true;
    if (rueckfrageAntwort) { rueckfrageAntwort(antwort); rueckfrageAntwort = null; }
  }

  /* ---------------- Laden ---------------- */

  async function hochfahren() {
    const balken = $('lade-balken');
    const texte = ['Einen Moment …', 'Schriften werden geprüft …', 'Gleich geht es los …'];
    let t = 0;
    const ticker = setInterval(() => { $('lade-text').textContent = texte[++t % texte.length]; }, 1100);

    const { stock, missing, total } = await FontDepot.open(p => {
      balken.style.width = Math.round(p * 100) + '%';
    });

    clearInterval(ticker);
    spiel.lager = stock;

    $('lager-fuss').textContent = `${stock.length} von ${total} Schriften verfügbar`;

    if (stock.length < 8) {
      $('lade-text').textContent = 'Zu wenige Schriften gefunden.';
      $('lager-fuss').textContent = 'Zu wenige Schriften geladen.';
      $('karte-spiel').disabled = true;
      $('karte-training').disabled = true;
      zeigeSchirm('menue');
      return;
    }

    baueStufenwahl();
    baueAnleitung();
    baueTrainingsfelder();
    baueKatalog();
    zeigeBestenliste();
    zeigeTageskarte();
    setTimeout(() => zeigeSchirm('menue'), 300);
  }

  /* ---------------- Bestwerte ---------------- */

  const bestSchluessel = stufe => `ftf.best.${stufe}`;
  const holeBest = stufe => parseInt(localStorage.getItem(bestSchluessel(stufe)) || '0', 10);

  function zeigeBestenliste() {
    $('bestenliste').innerHTML = WAEHLBAR.map(([key, s]) => {
      const b = holeBest(key);
      return `<li class="bestwerte__zeile">
        <span class="bestwerte__name">${s.name}</span>
        <span class="bestwerte__wert">${b ? zahl(b) : '—'}</span>
      </li>`;
    }).join('');
  }

  /* ---------------- Schwierigkeitswahl ---------------- */

  function baueStufenwahl() {
    $('stufenwahl').innerHTML = WAEHLBAR.map(([key, s]) => `
      <button type="button" class="stufenkarte${key === spiel.stufe ? ' stufenkarte--aktiv' : ''}" data-stufe="${key}">
        <span class="stufenkarte__name">${s.name}</span>
        <span class="stufenkarte__daten">
          <span>${s.optionen} Antworten</span>
          <span>${s.zeit ? s.zeit + ' s' : 'ohne Zeit'}</span>
          <span>${s.fehlversuche + 1} Versuche</span>
          <span>×${s.faktor.toFixed(1).replace('.', ',')}</span>
        </span>
      </button>`).join('');

    $('stufenwahl').querySelectorAll('.stufenkarte').forEach(k => {
      k.addEventListener('click', () => {
        spiel.stufe = k.dataset.stufe;
        $('stufenwahl').querySelectorAll('.stufenkarte')
          .forEach(x => x.classList.toggle('stufenkarte--aktiv', x === k));
        zeigeStufenBestwert();
        Sfx.taste();
      });
    });
    zeigeStufenBestwert();
  }

  function zeigeStufenBestwert() {
    const b = holeBest(spiel.stufe);
    const moeglich = Math.round(RUNDEN_JE_SPIEL * STUFEN[0].wert * SCHWIERIGKEIT[spiel.stufe].faktor);
    $('stufenwahl-bestwert').textContent = b
      ? `Bestwert ${zahl(b)} von ${zahl(moeglich)} möglichen Punkten`
      : `Bis zu ${zahl(moeglich)} Punkte möglich`;
  }

  /* ---------------- Anleitung ---------------- */

  function baueAnleitung() {
    $('anleitung-stufen').innerHTML = STUFEN.map((s, i) => `
      <li class="stufenliste__zeile">
        <span class="stufenliste__nr">${i + 1}</span>
        <span class="stufenliste__name">${s.name}</span>
        <span class="stufenliste__wert">${s.wert} Punkte</span>
      </li>`).join('');

  }

  /* ---------------- Trainingslager ---------------- */

  function gattungsListe() {
    const vorhanden = [...new Set(spiel.lager.map(f => f.cat))];
    return ['alle', ...Object.keys(CATEGORY_LABELS).filter(c => vorhanden.includes(c))];
  }

  function baueTrainingsfelder() {
    const optionen = gattungsListe().map(c =>
      `<option value="${c}">${c === 'alle' ? 'alle Gattungen' : CATEGORY_LABELS[c]}</option>`).join('');
    $('training-gattung').innerHTML = optionen;
    $('katalog-gattung').innerHTML = optionen;
    aktualisiereTrainingsanzahl();
  }

  function trainingsAuswahl() {
    const gattung = $('training-gattung').value;
    const bekanntheit = parseInt($('training-bekanntheit').value, 10);
    return spiel.lager.filter(f =>
      (gattung === 'alle' || f.cat === gattung) && bekanntheitVon(f.n) <= bekanntheit);
  }

  function aktualisiereTrainingsanzahl() {
    const n = trainingsAuswahl().length;
    const noetig = parseInt($('training-optionen').value, 10);
    const genug = n >= Math.max(4, noetig);
    $('training-anzahl').textContent = genug
      ? `${n} Schriften passen zu dieser Auswahl.`
      : `Nur ${n} Schriften passen dazu — das reicht nicht für ${noetig} Antworten. Bitte weiter fassen.`;
    $('training-anzahl').classList.toggle('hinweis--warnung', !genug);
    $('training-start').disabled = !genug;
  }

  function baueKatalog() {
    const suche = ($('katalog-suche').value || '').trim().toLowerCase();
    const gattung = $('katalog-gattung').value || 'alle';
    const liste = spiel.lager
      .filter(f => (gattung === 'alle' || f.cat === gattung) && f.n.toLowerCase().includes(suche))
      .sort((a, b) => a.n.localeCompare(b.n, 'de'));

    $('katalog').innerHTML = liste.length ? liste.map((f, i) => `
      <li class="katalog__zeile">
        <button class="katalog__kopf" type="button" data-i="${i}" aria-expanded="false">
          <span class="katalog__probe" style="font-family:'${f.n}', serif">Hamburgefonstiv</span>
          <span class="katalog__namen">
            <span class="katalog__name">${f.n}</span>
            <span class="katalog__gattung">${CATEGORY_LABELS[f.cat]}</span>
          </span>
        </button>
        <div class="katalog__detail" hidden>
          <p class="katalog__meta">${f.m}</p>
          <p class="katalog__wissen">${f.t}</p>
          <p class="katalog__zeile-probe" style="font-family:'${f.n}', serif">
            ABCDEFGHIJKLMNOPQRSTUVWXYZ<br>abcdefghijklmnopqrstuvwxyz<br>0123456789 . , ; : ! ?
          </p>
        </div>
      </li>`).join('')
      : '<li class="katalog__leer">Keine Schrift passt zu dieser Suche.</li>';

    $('katalog').querySelectorAll('.katalog__kopf').forEach(k => {
      k.addEventListener('click', () => {
        const detail = k.nextElementSibling;
        const offen = !detail.hidden;
        detail.hidden = offen;
        k.setAttribute('aria-expanded', String(!offen));
        Sfx.taste();
      });
    });
  }

  /* ---------------- Spielstart ---------------- */

  function auswahlFuerSpiel() {
    if (spiel.modus === 'taeglich') return Tagesspiel.pool();
    const s = SCHWIERIGKEIT[spiel.stufe];
    let pool = spiel.lager.filter(f => bekanntheitVon(f.n) <= s.bekanntheit);
    /* Zu wenige Schriften auf diesem Gerät? Dann den Kreis weiter ziehen,
       statt das Spiel zu verweigern. */
    if (pool.length < s.optionen + 3) pool = spiel.lager;
    return pool;
  }

  function starteSpiel(modus) {
    spiel.modus = modus;
    spiel.rundeNr = 0;
    spiel.richtige = 0;
    spiel.punkte = 0;
    spiel.protokoll = [];
    spiel.laeuft = true;

    if (modus === 'taeglich') {
      spiel.stufe = 'taeglich';
      spiel.datum = Tagesspiel.heute();
      wuerfel = Tagesspiel.wuerfel(spiel.datum);   // für alle dieselbe Folge
    } else {
      wuerfel = Math.random;
    }

    $('hud').classList.toggle('hud--training', modus === 'training');
    $('loesung-knopf').hidden = modus !== 'training';
    $('training-ende-knopf').hidden = modus !== 'training';
    $('hud-punkte').textContent = modus === 'training' ? '0 / 0' : '0';
    $('hud-schild-1').textContent = modus === 'training' ? 'Aufgabe' : 'Runde';
    $('hud-schild-2').textContent = modus === 'training' ? 'Richtig' : 'Punkte';

    zeigeSchirm('spiel');
    Sfx.papier();
    naechsteRunde();
  }

  function gegenspieler(ziel, anzahl, pool, gleicheGattung) {
    const gleich = mische(pool.filter(f => f !== ziel && f.cat === ziel.cat));
    const andere = mische(pool.filter(f => f !== ziel && f.cat !== ziel.cat));
    const quelle = gleicheGattung
      ? gleich.concat(andere)
      : gleich.slice(0, Math.ceil(anzahl / 2)).concat(andere);

    const gewaehlt = [];
    for (const f of quelle) {
      if (gewaehlt.length >= anzahl - 1) break;
      if (!gewaehlt.includes(f)) gewaehlt.push(f);
    }
    return mische(gewaehlt.concat([ziel]));
  }

  function naechsteRunde() {
    spiel.rundeNr++;

    const training = spiel.modus === 'training';
    const pool = training ? trainingsAuswahl() : auswahlFuerSpiel();
    const anzahl = Math.min(
      training ? parseInt($('training-optionen').value, 10) : SCHWIERIGKEIT[spiel.stufe].optionen,
      pool.length);
    const gleicheGattung = training
      ? $('training-gattung').value !== 'alle'
      : SCHWIERIGKEIT[spiel.stufe].gleicheGattung;

    const schonGehabt = spiel.protokoll.slice(-8).map(p => p.schrift);
    const frisch = pool.filter(f => !schonGehabt.includes(f));
    const ziel = waehle(frisch.length ? frisch : pool);

    spiel.runde = {
      schrift: ziel,
      optionen: gegenspieler(ziel, anzahl, pool, gleicheGattung),
      stufe: 0,
      fehler: [],
      proben: STUFEN.map(s => s.probe()),
      beendet: false
    };

    $('hud-runde').textContent = training
      ? String(spiel.rundeNr)
      : `${spiel.rundeNr} / ${RUNDEN_JE_SPIEL}`;
    $('blatt-kopf-links').textContent = training ? `Aufgabe ${spiel.rundeNr}` : `Runde ${spiel.rundeNr}`;
    $('aufloesung').hidden = true;
    $('aufdecken-knopf').disabled = false;
    $('loesung-knopf').disabled = false;

    if (!Einstellungen.hole('wenigerBewegung')) {
      $('blatt').classList.remove('blatt--eingespannt');
      void $('blatt').offsetWidth;
      $('blatt').classList.add('blatt--eingespannt');
    }

    baueTastatur();
    baueStufenleiste();
    zeigeVersuche();
    Walze.leere();
    zeigeStufe(true);
    starteUhr();
  }

  /* ---------------- Zeitlimit ---------------- */

  function starteUhr() {
    stoppeUhr();
    const sekunden = spiel.modus === 'training' ? 0 : SCHWIERIGKEIT[spiel.stufe].zeit;
    $('zeitband').hidden = !sekunden;
    $('zeitzahl').hidden = !sekunden;
    if (!sekunden) return;

    spiel.restzeit = sekunden;
    let letzterTick = sekunden;
    zeichneUhr(sekunden, sekunden);

    spiel.uhr = setInterval(() => {
      spiel.restzeit -= 0.1;
      zeichneUhr(spiel.restzeit, sekunden);

      const ganze = Math.ceil(spiel.restzeit);
      if (ganze !== letzterTick && ganze <= 5 && ganze > 0) { Sfx.ticken(); letzterTick = ganze; }

      if (spiel.restzeit <= 0) {
        stoppeUhr();
        Sfx.zeitAus();
        beendeRunde(false, null, true);
      }
    }, 100);
  }

  /**
   * Es gibt keinen eigenen Zeitbalken: Die Walze selbst ist die Uhr.
   * Das Leuchten auf ihr läuft mit der verbleibenden Zeit zurück.
   */
  function zeichneUhr(rest, gesamt) {
    const anteil = Math.max(0, rest / gesamt);
    $('zeitband').style.width = (anteil * 100) + '%';
    $('zeitband').classList.toggle('walzenbalken__zeit--knapp', anteil < 0.25);
    $('zeitzahl').textContent = Math.max(0, Math.ceil(rest));
    $('zeitzahl').classList.toggle('walzenbalken__zahl--knapp', anteil < 0.25);
  }

  function stoppeUhr() {
    clearInterval(spiel.uhr);
    spiel.uhr = null;
    $('zeitband').classList.remove('walzenbalken__zeit--knapp');
    $('zeitzahl').classList.remove('walzenbalken__zahl--knapp');
  }

  /* ---------------- Anzeige der Stufe ---------------- */

  function rundenwert(stufeNr = spiel.runde.stufe) {
    const r = spiel.runde;
    return Math.max(MINDESTPUNKTE,
      STUFEN[stufeNr].wert - r.fehler.length * FEHLERKOSTEN);
  }

  function rundenpunkte() {
    return Math.round(rundenwert() * SCHWIERIGKEIT[spiel.stufe].faktor);
  }

  function zeigeStufe(mitAnimation) {
    const r = spiel.runde;
    const stufe = STUFEN[r.stufe];
    const training = spiel.modus === 'training';

    $('blatt-kopf-rechts').textContent = `${r.stufe + 1}/${STUFEN.length} · ${stufe.name}`;
    if (!training) $('hud-wert').textContent = zahl(rundenpunkte());
    aktualisiereStufenleiste();

    const letzte = r.stufe === STUFEN.length - 1;
    $('aufdecken-knopf').disabled = letzte || r.beendet;
    $('aufdecken-info').textContent = letzte
      ? 'alles aufgedeckt'
      : training
        ? STUFEN[r.stufe + 1].name
        : `${STUFEN[r.stufe + 1].name} · ${zahl(Math.round(rundenwert(r.stufe + 1) * SCHWIERIGKEIT[spiel.stufe].faktor))}`;

    const auftrag = { font: r.schrift.n, text: r.proben[r.stufe], grad: stufe.grad };
    if (mitAnimation && !Einstellungen.hole('wenigerBewegung')) {
      Walze.tippe({ ...auftrag, tempo: r.proben[r.stufe].length > 30 ? 22 : 55 });
    } else {
      Walze.setze(auftrag);
    }
  }

  function baueStufenleiste() {
    $('stufenleiste').innerHTML = STUFEN.map((s, i) => `
      <li class="kerbe" title="Stufe ${i + 1}: ${s.name} — ${s.wert} Punkte">
        <span class="kerbe__marke"></span>
        <span class="kerbe__nr">${i + 1}</span>
      </li>`).join('');
  }

  function aktualisiereStufenleiste() {
    $('stufenleiste').querySelectorAll('.kerbe').forEach((el, i) => {
      el.classList.toggle('kerbe--auf', i < spiel.runde.stufe);
      el.classList.toggle('kerbe--jetzt', i === spiel.runde.stufe);
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
      b.addEventListener('click', () => antworte(parseInt(b.dataset.i, 10)));
    });
    t.dataset.spalten = spiel.runde.optionen.length > 6 ? '4' : (spiel.runde.optionen.length > 4 ? '3' : '2');
  }

  /* ---------------- Verbleibende Versuche ---------------- */

  /** Wie viele falsche Antworten diese Runde noch verträgt. */
  function erlaubteFehler() {
    return spiel.modus === 'training'
      ? Infinity
      : SCHWIERIGKEIT[spiel.stufe].fehlversuche;
  }

  /** Punktreihe im Blattkopf: ausgefüllt = noch offen. */
  function zeigeVersuche() {
    const feld = $('versuche');
    const erlaubt = erlaubteFehler();

    if (!isFinite(erlaubt)) { feld.hidden = true; return; }

    const gesamt = erlaubt + 1;                 // Wahlmöglichkeiten insgesamt
    const offen = gesamt - spiel.runde.fehler.length;
    feld.hidden = false;
    feld.title = `${offen} von ${gesamt} Versuchen übrig`;
    feld.innerHTML = Array.from({ length: gesamt }, (_, i) =>
      `<span class="versuch${i < offen ? '' : ' versuch--weg'}"></span>`).join('');
  }

  /* ---------------- Spielzüge ---------------- */

  function aufdecken() {
    const r = spiel.runde;
    if (!r || r.beendet || r.stufe >= STUFEN.length - 1) return;
    r.stufe++;
    Sfx.hebel();
    if (!Einstellungen.hole('wenigerBewegung')) {
      $('blatt').classList.add('blatt--ruck');
      setTimeout(() => $('blatt').classList.remove('blatt--ruck'), 320);
    }
    zeigeStufe(true);
  }

  function antworte(index) {
    const r = spiel.runde;
    if (!r || r.beendet) return;
    const gewaehlt = r.optionen[index];
    if (r.fehler.includes(gewaehlt)) return;

    const taste = $('tastatur').querySelector(`.taste[data-i="${index}"]`);

    if (gewaehlt === r.schrift) {
      Sfx.richtig();
      taste.classList.add('taste--treffer');
      beendeRunde(true, gewaehlt);
      return;
    }

    r.fehler.push(gewaehlt);
    Sfx.falsch();
    taste.classList.add('taste--verklemmt');
    taste.disabled = true;
    if (!Einstellungen.hole('wenigerBewegung')) {
      document.body.classList.add('erschuettert');
      setTimeout(() => document.body.classList.remove('erschuettert'), 400);
    }
    zeigeVersuche();

    const ersetzen = spiel.modus !== 'training' && SCHWIERIGKEIT[spiel.stufe].nachruecken;

    /* Wird die falsche Antwort ersetzt, bleiben alle Felder wählbar —
       sonst zählt jede ausgestrichene Antwort als weggefallen. */
    const gesperrt = ersetzen ? 0 : r.fehler.length;

    if (r.fehler.length > erlaubteFehler() || r.optionen.length - gesperrt <= 1) {
      beendeRunde(false, gewaehlt);
      return;
    }

    /* Ab „Schwer“ tritt an die Stelle der falschen Antwort eine neue
       Schrift, damit sich die Auswahl nicht mit jedem Fehlgriff verengt. */
    if (ersetzen) setTimeout(() => ersetzeAntwort(index), 650);

    if (r.stufe < STUFEN.length - 1) {
      r.stufe++;
      setTimeout(() => zeigeStufe(true), 260);
    } else {
      zeigeStufe(false);
    }
  }

  /** Tauscht die falsch geratene Antwort gegen eine neue aus. */
  function ersetzeAntwort(index) {
    const r = spiel.runde;
    if (!r || r.beendet) return;

    const frei = auswahlFuerSpiel().filter(f =>
      f !== r.schrift && !r.optionen.includes(f) && !r.fehler.includes(f));

    /* Bevorzugt eine Schrift derselben Gattung. Ist der Vorrat
       erschöpft — bei kleinen Gattungen schnell der Fall —, tut es
       auch eine andere; ein leeres Feld wäre schlechter. */
    const gleicheGattung = frei.filter(f => f.cat === r.schrift.cat);
    const pool = (SCHWIERIGKEIT[spiel.stufe].gleicheGattung && gleicheGattung.length)
      ? gleicheGattung
      : frei;
    if (!pool.length) return;          // nichts mehr da: Feld bleibt gestrichen

    const neue = waehle(pool);
    r.optionen[index] = neue;

    const taste = $('tastatur').querySelector(`.taste[data-i="${index}"]`);
    if (!taste) return;
    taste.classList.remove('taste--verklemmt');
    taste.classList.add('taste--neu');
    taste.disabled = false;
    taste.querySelector('.taste__name').textContent = neue.n;
    setTimeout(() => taste.classList.remove('taste--neu'), 500);
  }

  function loesungZeigen() {
    if (!spiel.runde || spiel.runde.beendet) return;
    beendeRunde(false, null, false, true);
  }

  function beendeRunde(richtig, gewaehlt, zeitAbgelaufen = false, aufgegeben = false) {
    const r = spiel.runde;
    if (!r || r.beendet) return;
    r.beendet = true;
    stoppeUhr();

    $('aufdecken-knopf').disabled = true;
    $('loesung-knopf').disabled = true;
    $('tastatur').querySelectorAll('.taste').forEach(b => { b.disabled = true; });


    const training = spiel.modus === 'training';
    const punkte = (richtig && !training) ? rundenpunkte() : 0;
    const vorher = spiel.punkte;
    spiel.punkte += punkte;
    if (richtig) spiel.richtige++;

    spiel.protokoll.push({
      schrift: r.schrift, richtig, stufe: r.stufe,
      fehler: r.fehler.length,
      punkte, gewaehlt: richtig ? null : gewaehlt, zeitAbgelaufen, aufgegeben
    });

    if (training) {
      $('hud-punkte').textContent = `${spiel.richtige} / ${spiel.rundeNr}`;
    } else {
      zaehleHoch($('hud-punkte'), vorher, spiel.punkte);
    }

    setTimeout(() => zeigeAufloesung(richtig, gewaehlt, punkte, zeitAbgelaufen, aufgegeben), 560);
  }

  /* ---------------- Auflösung ---------------- */

  function zeigeAufloesung(richtig, gewaehlt, punkte, zeitAbgelaufen, aufgegeben) {
    const r = spiel.runde;
    const training = spiel.modus === 'training';

    $('stempel').className = 'stempel ' + (richtig ? 'stempel--gut' : 'stempel--schlecht');
    $('stempel-text').textContent = richtig ? 'richtig' : 'falsch';

    $('aufloesung-vorspann').textContent = richtig
      ? `Richtig erkannt auf Stufe ${r.stufe + 1} von ${STUFEN.length}`
      : zeitAbgelaufen ? 'Zeit abgelaufen. Gesucht war'
      : aufgegeben ? 'Gesucht war'
      : 'Leider nicht. Gesucht war';

    $('aufloesung-name').textContent = r.schrift.n;
    $('aufloesung-name').style.fontFamily = `"${r.schrift.n}", serif`;
    $('aufloesung-meta').textContent = `${CATEGORY_LABELS[r.schrift.cat]} · ${r.schrift.m}`;
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

    const klammer = r.fehler.length ? ` · ${r.fehler.length}× falsch` : '';

    $('aufloesung-punkte').textContent = training
      ? `${spiel.richtige} von ${spiel.rundeNr} richtig${klammer}`
      : richtig ? `+ ${zahl(punkte)} Punkte${klammer}` : `Keine Punkte für diese Runde${klammer}`;

    $('weiter-knopf').textContent = (!training && spiel.rundeNr >= RUNDEN_JE_SPIEL)
      ? 'Ergebnis ansehen' : 'Weiter';

    $('aufloesung').hidden = false;
    spiel.warteAufWeiter = true;
    $('weiter-knopf').focus({ preventScroll: true });
  }

  function weiter() {
    if (!spiel.warteAufWeiter) return;
    spiel.warteAufWeiter = false;
    /* Das Fenster liegt über allen Schirmen — beim Wechsel muss es
       ausdrücklich zu, sonst blockiert es die Bedienung. */
    $('aufloesung').hidden = true;
    if (spiel.modus !== 'training' && spiel.rundeNr >= RUNDEN_JE_SPIEL) {
      if (spiel.modus === 'taeglich') sichereTagesergebnis();
      zeigeErgebnis();
    } else {
      Sfx.papier();
      naechsteRunde();
    }
  }

  /* ---------------- Ergebnis ---------------- */

  function verdienteOrden() {
    const p = spiel.protokoll;
    const ids = [];
    if (p.some(x => x.richtig && x.stufe === 0)) ids.push('blind');
    if (p.some(x => x.richtig && x.stufe === 0 && x.fehler === 0)) ids.push('sparsam');
    if (p.every(x => x.fehler === 0)) ids.push('rein');
    if (p.every(x => x.richtig)) ids.push('serie');
    if (p.some(x => x.richtig && x.stufe === STUFEN.length - 1)) ids.push('lupe');
    return ORDEN.filter(o => ids.includes(o.id));
  }

  function zeigeErgebnis() {
    spiel.laeuft = false;
    stoppeUhr();

    const s = SCHWIERIGKEIT[spiel.stufe];
    const maximum = RUNDEN_JE_SPIEL * STUFEN[0].wert * s.faktor;
    const rang = RAENGE.find(r => spiel.punkte / maximum >= r.ab);

    zeigeSchirm('ende');
    Sfx.stempel();

    $('ende-modus').textContent = s.name;
    $('zeugnis-rang').textContent = rang.titel;
    zaehleHoch($('zeugnis-punkte'), 0, spiel.punkte, 1100);

    $('protokoll').innerHTML = spiel.protokoll.map((p, i) => {
      const wie = p.richtig
        ? `auf Stufe ${p.stufe + 1}`
        : p.zeitAbgelaufen ? 'Zeit abgelaufen' : 'nicht erkannt';
      const extra = [];
      if (p.fehler) extra.push(`${p.fehler}× falsch`);
      return `<li class="protokoll__zeile${p.richtig ? '' : ' protokoll__zeile--daneben'}">
        <span class="protokoll__nr">${i + 1}</span>
        <span class="protokoll__schrift" style="font-family:'${p.schrift.n}', serif">${p.schrift.n}</span>
        <span class="protokoll__stufe">${wie}${extra.length ? ' · ' + extra.join(' · ') : ''}</span>
        <span class="protokoll__punkte">${p.punkte ? '+' + zahl(p.punkte) : '—'}</span>
      </li>`;
    }).join('');

    const orden = verdienteOrden();
    $('orden').innerHTML = orden.length
      ? orden.map(o => `<span class="orden__stueck" title="${o.text}">${o.name}</span>`).join('')
      : '';

    const taeglich = spiel.modus === 'taeglich';
    $('tagesauswertung').hidden = !taeglich;
    $('stufe-wechseln-knopf').hidden = taeglich;
    $('nochmal-knopf').hidden = taeglich;          // einmal am Tag
    $('ende-modus').textContent = taeglich
      ? `Schrift des Tages · ${Tagesspiel.lesbar(spiel.datum)}`
      : s.name;

    if (taeglich) {
      zeigeTagesauswertung();
      $('bestwert-ende').textContent = '';
    } else {
      const alt = holeBest(spiel.stufe);
      if (spiel.punkte > alt) {
        localStorage.setItem(bestSchluessel(spiel.stufe), String(spiel.punkte));
        $('bestwert-ende').textContent = alt ? `Neuer Bestwert (vorher ${zahl(alt)})` : 'Neuer Bestwert';
      } else {
        $('bestwert-ende').textContent = `Bestwert: ${zahl(alt)}`;
      }
    }

    zeigeBestenliste();
    zeigeStufenBestwert();
    zeigeTageskarte();
  }

  /* ---------------- Schrift des Tages ---------------- */

  /** Ergebnis des Tages festhalten — je Runde die erreichte Stufe. */
  function sichereTagesergebnis() {
    if (Tagesspiel.hole(spiel.datum)) return;      // schon gespeichert
    Tagesspiel.speichere(spiel.datum, {
      p: spiel.punkte,
      s: spiel.protokoll.map(r => r.richtig ? r.stufe : -1),
      n: spiel.protokoll.map(r => r.schrift.n)
    });
  }

  /** Aufschrift der Menükarte: gespielt, offen, Serie. */
  function zeigeTageskarte() {
    const heute = Tagesspiel.hole(Tagesspiel.heute());
    const serie = Tagesspiel.serie();
    $('karte-taeglich-text').textContent = heute
      ? `Heute gespielt: ${zahl(heute.p)} Punkte`
      : 'Für alle dieselben fünf Schriften';
    $('karte-taeglich-serie').textContent = serie.aktuell > 1
      ? `${serie.aktuell} Tage in Folge`
      : '';
    $('karte-taeglich-serie').hidden = serie.aktuell <= 1;
  }

  let uhrBisMorgen = null;

  function zeigeTagesauswertung() {
    const serie = Tagesspiel.serie();
    const alleTage = Object.keys(Tagesspiel.alle()).length;

    $('serie-aktuell').textContent = serie.aktuell;
    $('serie-laengste').textContent = serie.laengste;
    $('serie-tage').textContent = alleTage;

    /* Vergleich mit den eigenen bisherigen Tagen — mehr kann eine
       Seite ohne Server nicht ehrlich behaupten. */
    const rang = Tagesspiel.eigenerRang(spiel.punkte, spiel.datum);
    $('prozentrang').textContent = rang
      ? `Besser als ${Math.round(rang.anteil * 100)} % deiner bisherigen ` +
        `${rang.tage} ${rang.tage === 1 ? 'Runde' : 'Runden'}`
      : 'Dein erster Tag — ab morgen gibt es einen Vergleich.';

    zeichnePunkteverteilung();
    zeichneStufenverteilung();

    clearInterval(uhrBisMorgen);
    const tick = () => {
      const rest = Tagesspiel.bisMorgen();
      const st = Math.floor(rest / 3600000);
      const mi = Math.floor(rest / 60000) % 60;
      const se = Math.floor(rest / 1000) % 60;
      $('naechster-tag').textContent =
        `Nächste Schrift des Tages in ${st}:${String(mi).padStart(2, '0')}:${String(se).padStart(2, '0')}`;
    };
    tick();
    uhrBisMorgen = setInterval(tick, 1000);
  }

  function zeichnePunkteverteilung() {
    const klassen = Tagesspiel.punkteverteilung(500, RUNDEN_JE_SPIEL * STUFEN[0].wert);
    const hoechste = Math.max(1, ...klassen.map(k => k.anzahl));
    const meine = Math.min(klassen.length - 1, Math.floor(spiel.punkte / 500));

    $('punkteverteilung').innerHTML = klassen.map((k, i) => `
      <div class="saeule${i === meine ? ' saeule--meine' : ''}"
           title="${zahl(k.von)}–${zahl(k.bis)} Punkte: ${k.anzahl}×">
        <span class="saeule__zahl">${k.anzahl || ''}</span>
        <span class="saeule__balken" style="height:${Math.max(3, k.anzahl / hoechste * 100)}%"></span>
        <span class="saeule__schild">${k.von / 1000 === Math.floor(k.von / 1000) ? k.von / 1000 + 'k' : ''}</span>
      </div>`).join('');
  }

  function zeichneStufenverteilung() {
    const zaehler = Tagesspiel.stufenverteilung(STUFEN.length);
    const hoechste = Math.max(1, ...zaehler);

    $('stufenverteilung').innerHTML = zaehler.map((anzahl, i) => {
      const letzte = i === STUFEN.length;
      return `<div class="saeule${letzte ? ' saeule--daneben' : ''}"
           title="${letzte ? 'nicht erkannt' : 'Stufe ' + (i + 1)}: ${anzahl}×">
        <span class="saeule__zahl">${anzahl || ''}</span>
        <span class="saeule__balken" style="height:${Math.max(3, anzahl / hoechste * 100)}%"></span>
        <span class="saeule__schild">${letzte ? '✗' : i + 1}</span>
      </div>`;
    }).join('');
  }

  /** Klick auf die Tageskarte: spielen oder das Ergebnis zeigen. */
  function starteTagesspiel() {
    const datum = Tagesspiel.heute();
    const fertig = Tagesspiel.hole(datum);
    Sfx.taste();

    if (!fertig) { starteSpiel('taeglich'); return; }

    /* Schon gespielt — die Auswertung noch einmal zeigen. */
    spiel.modus = 'taeglich';
    spiel.stufe = 'taeglich';
    spiel.datum = datum;
    spiel.punkte = fertig.p;
    spiel.laeuft = false;
    spiel.protokoll = [];
    zeigeErgebnisNurAuswertung(fertig);
  }

  /** Ergebnisschirm ohne frisch gespielte Runden. */
  function zeigeErgebnisNurAuswertung(gespeichert) {
    const maximum = RUNDEN_JE_SPIEL * STUFEN[0].wert;
    const rang = RAENGE.find(r => gespeichert.p / maximum >= r.ab);

    zeigeSchirm('ende');
    $('ende-modus').textContent = `Schrift des Tages · ${Tagesspiel.lesbar(spiel.datum)}`;
    $('zeugnis-rang').textContent = rang.titel;
    $('zeugnis-punkte').textContent = zahl(gespeichert.p);
    const namen = gespeichert.n || [];
    $('protokoll').innerHTML = gespeichert.s.map((stufe, i) => `
      <li class="protokoll__zeile${stufe < 0 ? ' protokoll__zeile--daneben' : ''}">
        <span class="protokoll__nr">${i + 1}</span>
        ${namen[i] ? `<span class="protokoll__schrift" style="font-family:'${namen[i]}', serif">${namen[i]}</span>` : ''}
        <span class="protokoll__stufe">${stufe < 0 ? 'nicht erkannt' : 'auf Stufe ' + (stufe + 1)}</span>
      </li>`).join('');
    $('orden').innerHTML = '';
    $('bestwert-ende').textContent = '';
    $('tagesauswertung').hidden = false;
    $('stufe-wechseln-knopf').hidden = true;
    $('nochmal-knopf').hidden = true;
    zeigeTagesauswertung();
  }

  /** Ein Kästchen je Runde: je früher erkannt, desto grüner. */
  function tagesraster(stufen) {
    return stufen.map(stufe => {
      if (stufe < 0) return '🟥';
      if (stufe <= 1) return '🟩';
      if (stufe <= 3) return '🟨';
      return '🟧';
    }).join('');
  }

  function ergebnisKopieren() {
    let text;

    if (spiel.modus === 'taeglich') {
      const gespeichert = Tagesspiel.hole(spiel.datum);
      const stufen = spiel.protokoll.length
        ? spiel.protokoll.map(p => p.richtig ? p.stufe : -1)
        : (gespeichert ? gespeichert.s : []);
      text = [
        `findthefont · Schrift des Tages ${Tagesspiel.lesbar(spiel.datum)}`,
        `${tagesraster(stufen)}  ${zahl(spiel.punkte)} Punkte`,
        'https://rosinenschnecke.github.io/findthefont/'
      ].join('\n');
    } else {
      text = [
        `findthefont · Schwierigkeit ${SCHWIERIGKEIT[spiel.stufe].name}`,
        `${spiel.punkte} Punkte — ${$('zeugnis-rang').textContent}`,
        ...spiel.protokoll.map((p, i) =>
          `${i + 1}. ${p.schrift.n} — ${p.richtig ? 'Stufe ' + (p.stufe + 1) : 'nicht erkannt'} (${p.punkte} P.)`)
      ].join('\n');
    }

    const fertig = () => {
      const k = $('kopieren-knopf');
      k.textContent = 'Kopiert!';
      Sfx.stempel();
      setTimeout(() => { k.textContent = 'Ergebnis kopieren'; }, 1800);
    };
    if (navigator.clipboard) navigator.clipboard.writeText(text).then(fertig).catch(fertig);
    else fertig();
  }

  /* ---------------- Verlassen ---------------- */

  async function zurueckZumMenue() {
    if (spiel.laeuft && spiel.modus !== 'training' && !spiel.warteAufWeiter) {
      const ja = await frage('Spiel abbrechen?',
        'Das laufende Spiel wird verworfen und die Punkte gehen verloren.', 'Abbrechen und zurück');
      if (!ja) return;
    }
    spiel.laeuft = false;
    stoppeUhr();
    clearInterval(uhrBisMorgen);
    $('aufloesung').hidden = true;
    spiel.warteAufWeiter = false;
    zeigeBestenliste();
    zeigeTageskarte();
    zeigeSchirm('menue');
  }

  /* ---------------- Einstellungsfenster ---------------- */

  function baueEinstellungen() {
    const e = Einstellungen.alle();

    const zeige = () => {
      const a = Einstellungen.alle();
      $('regler-musik').value = a.musikLaut;
      $('wert-musik').textContent = a.musikLaut + ' %';
      $('schalter-musik').textContent = a.musikAn ? 'an' : 'aus';
      $('schalter-musik').setAttribute('aria-pressed', String(a.musikAn));
      $('schalter-musik').classList.toggle('schalter--aus', !a.musikAn);
      $('regler-musik').disabled = !a.musikAn;

      $('regler-sfx').value = a.sfxLaut;
      $('wert-sfx').textContent = a.sfxLaut + ' %';
      $('schalter-sfx').textContent = a.sfxAn ? 'an' : 'aus';
      $('schalter-sfx').setAttribute('aria-pressed', String(a.sfxAn));
      $('schalter-sfx').classList.toggle('schalter--aus', !a.sfxAn);
      $('regler-sfx').disabled = !a.sfxAn;

      $('haken-tippen').checked = a.tippgeraeusch;
      $('haken-bewegung').checked = a.wenigerBewegung;
    };

    $('regler-musik').value = e.musikLaut;
    $('regler-sfx').value = e.sfxLaut;

    $('regler-musik').addEventListener('input', ev => {
      Einstellungen.setze('musikLaut', parseInt(ev.target.value, 10));
      $('wert-musik').textContent = ev.target.value + ' %';
      Musik.sofortLautstaerke();
    });
    $('schalter-musik').addEventListener('click', () => {
      Einstellungen.setze('musikAn', !Einstellungen.hole('musikAn'));
      zeige();
      Sfx.taste();
    });

    let sfxProbe = null;
    $('regler-sfx').addEventListener('input', ev => {
      Einstellungen.setze('sfxLaut', parseInt(ev.target.value, 10));
      $('wert-sfx').textContent = ev.target.value + ' %';
      clearTimeout(sfxProbe);
      sfxProbe = setTimeout(() => Sfx.taste(), 140);   // kurze Hörprobe
    });
    $('schalter-sfx').addEventListener('click', () => {
      Einstellungen.setze('sfxAn', !Einstellungen.hole('sfxAn'));
      zeige();
      Sfx.taste();
    });

    $('haken-tippen').addEventListener('change', ev =>
      Einstellungen.setze('tippgeraeusch', ev.target.checked));
    $('haken-bewegung').addEventListener('change', ev =>
      Einstellungen.setze('wenigerBewegung', ev.target.checked));

    $('bestwerte-loeschen').addEventListener('click', async () => {
      const ja = await frage('Bestwerte löschen?',
        'Alle gespeicherten Bestwerte werden entfernt. Das lässt sich nicht rückgängig machen.', 'Löschen');
      if (!ja) return;
      Object.keys(SCHWIERIGKEIT).forEach(k => localStorage.removeItem(bestSchluessel(k)));
      Tagesspiel.loesche();
      zeigeBestenliste();
      zeigeStufenBestwert();
      $('einstellungen-fuss').textContent = 'Bestwerte gelöscht.';
      setTimeout(() => { $('einstellungen-fuss').textContent = ''; }, 2600);
    });

    zeige();
    return zeige;
  }

  /* ---------------- Verdrahtung ---------------- */

  function verdrahte() {
    Walze.mount($('probe'));
    const zeigeEinstellungen = baueEinstellungen();

    /* Startseite */
    $('karte-spiel').addEventListener('click', () => { Sfx.taste(); zeigeSchirm('schwierigkeit'); });
    $('karte-taeglich').addEventListener('click', starteTagesspiel);
    $('karte-training').addEventListener('click', () => { Sfx.taste(); zeigeSchirm('training'); });
    $('karte-anleitung').addEventListener('click', () => { Sfx.taste(); zeigeSchirm('anleitung'); });
    $('karte-einstellungen').addEventListener('click', () => { Sfx.taste(); oeffneEinstellungen(); });
    $('logo-knopf').addEventListener('click', zurueckZumMenue);
    $('menue-knopf').addEventListener('click', zurueckZumMenue);
    document.querySelectorAll('[data-ziel="menue"]').forEach(b =>
      b.addEventListener('click', zurueckZumMenue));

    /* Schwierigkeit */
    $('losgehts-knopf').addEventListener('click', () => { Sfx.taste(); starteSpiel('klassisch'); });

    /* Training */
    document.querySelectorAll('.reiter__knopf').forEach(k => {
      k.addEventListener('click', () => {
        document.querySelectorAll('.reiter__knopf').forEach(x =>
          x.classList.toggle('reiter__knopf--aktiv', x === k));
        document.querySelectorAll('.reiter__inhalt').forEach(x =>
          x.classList.toggle('reiter__inhalt--aktiv', x.dataset.inhalt === k.dataset.reiter));
        Sfx.taste();
      });
    });
    ['training-gattung', 'training-bekanntheit', 'training-optionen'].forEach(id =>
      $(id).addEventListener('change', aktualisiereTrainingsanzahl));
    $('training-start').addEventListener('click', () => { Sfx.taste(); starteSpiel('training'); });
    $('katalog-gattung').addEventListener('change', baueKatalog);
    $('katalog-suche').addEventListener('input', baueKatalog);

    /* Spiel */
    $('aufdecken-knopf').addEventListener('click', aufdecken);
    $('loesung-knopf').addEventListener('click', loesungZeigen);
    $('weiter-knopf').addEventListener('click', weiter);
    $('training-ende-knopf').addEventListener('click', () => {
      $('aufloesung').hidden = true;
      spiel.warteAufWeiter = false;
      spiel.laeuft = false;
      zeigeSchirm('training');
    });

    /* Ergebnis */
    $('nochmal-knopf').addEventListener('click', () => { Sfx.taste(); starteSpiel('klassisch'); });
    $('stufe-wechseln-knopf').addEventListener('click', () => { Sfx.taste(); zeigeSchirm('schwierigkeit'); });
    $('kopieren-knopf').addEventListener('click', ergebnisKopieren);

    /* Fenster */
    $('einstellungen-knopf').addEventListener('click', oeffneEinstellungen);
    $('einstellungen-schliessen').addEventListener('click', () => { $('einstellungen-fenster').hidden = true; });
    $('einstellungen-fenster').addEventListener('click', ev => {
      if (ev.target === $('einstellungen-fenster')) $('einstellungen-fenster').hidden = true;
    });
    $('rueckfrage-ja').addEventListener('click', () => schliesseRueckfrage(true));
    $('rueckfrage-nein').addEventListener('click', () => schliesseRueckfrage(false));

    function oeffneEinstellungen() {
      zeigeEinstellungen();
      $('einstellungen-fenster').hidden = false;
    }

    /* Tastatur */
    document.addEventListener('keydown', e => {
      if (e.target.matches('input, textarea, select')) return;

      if (e.code === 'Escape') {
        if (!$('rueckfrage').hidden) { schliesseRueckfrage(false); return; }
        if (!$('einstellungen-fenster').hidden) { $('einstellungen-fenster').hidden = true; return; }
        return;
      }

      if (!$('rueckfrage').hidden || !$('einstellungen-fenster').hidden) return;

      if (e.code === 'Space' || e.code === 'Enter') {
        const aktiv = document.querySelector('.schirm--aktiv');
        if (!aktiv) return;
        if (spiel.warteAufWeiter) { e.preventDefault(); weiter(); return; }
        if (aktiv.id === 'schirm-schwierigkeit') { e.preventDefault(); $('losgehts-knopf').click(); }
        else if (aktiv.id === 'schirm-ende') { e.preventDefault(); $('nochmal-knopf').click(); }
        else if (aktiv.id === 'schirm-spiel' && e.code === 'Space') { e.preventDefault(); aufdecken(); }
        return;
      }

      if (/^Digit[1-8]$/.test(e.code) && spiel.laeuft && !spiel.warteAufWeiter) {
        const i = parseInt(e.code.slice(5), 10) - 1;
        if (spiel.runde && i < spiel.runde.optionen.length) { e.preventDefault(); antworte(i); }
      }
    });
  }

  /* ---------------- Los ---------------- */

  Einstellungen.laden();
  Musik.beiErsterGeste();
  verdrahte();
  hochfahren();
})();
