/* ============================================================
   Sprachen

   Feste Texte stehen im HTML mit data-t="schluessel" und werden
   hier ersetzt. Alles, was JavaScript zusammensetzt, holt sich den
   Text über t('schluessel', { platzhalter }).

   Die Notizen zu den einzelnen Schriften stehen in js/fonts.js
   (Felder t und te), die Schriftproben weiter unten in PROBEN.
   ============================================================ */

const Sprache = (() => {
  const SCHLUESSEL = 'ftf.sprache';

  const TEXTE = {
    de: {
      'titel.seite': 'findthefont — Errate die Schriftart',
      'kopf.startseite': 'Startseite',
      'kopf.einstellungen': 'Einstellungen',
      'kopf.zurStartseite': 'Zur Startseite',

      'laden.text': 'Schriften werden geladen …',
      'laden.moment': 'Einen Moment …',
      'laden.pruefen': 'Schriften werden geprüft …',
      'laden.gleich': 'Gleich geht es los …',
      'laden.zuwenig': 'Zu wenige Schriften gefunden.',

      'menue.titel': 'Erkennst du<br>die Schrift?',
      'menue.einleitung': 'Zuerst siehst du nur einen Punkt. Je weniger du aufdeckst, desto mehr Punkte.',
      'menue.taeglich': 'Schrift des Tages',
      'menue.taeglichText': 'Für alle dieselben fünf Schriften',
      'menue.spiel': 'Freies Spiel',
      'menue.spielText': '5 Runden, Schwierigkeit wählbar',
      'menue.training': 'Trainingslager',
      'menue.trainingText': 'Üben ohne Wertung',
      'menue.anleitung': 'Anleitung',
      'menue.anleitungText': 'Regeln in Kürze',
      'menue.einstellungen': 'Einstellungen',
      'menue.einstellungenText': 'Ton und Anzeige',

      'schwierigkeit.titel': 'Schwierigkeit',
      'schwierigkeit.start': 'Spiel starten',
      'schwierigkeit.leicht': 'Leicht',
      'schwierigkeit.mittel': 'Mittel',
      'schwierigkeit.schwer': 'Schwer',
      'schwierigkeit.experte': 'Experte',
      'schwierigkeit.antworten': '{n} Antworten',
      'schwierigkeit.sekunden': '{n} s',
      'schwierigkeit.ohneZeit': 'ohne Zeit',
      'schwierigkeit.versuche': '{n} Versuche',
      'schwierigkeit.bestwert': 'Bestwert {best} von {max} möglichen Punkten',
      'schwierigkeit.moeglich': 'Bis zu {max} Punkte möglich',

      'anleitung.titel': 'Anleitung',
      'anleitung.stufen': 'Die sieben Stufen',
      'anleitung.punkte': 'Punkte und Fehlversuche',
      'anleitung.punkte1': 'Es zählt die Stufe, auf der du richtig rätst.',
      'anleitung.punkte2': 'Jede falsche Antwort kostet 120 Punkte und deckt eine Stufe auf.',
      'anleitung.punkte3': 'Sind die Fehlversuche aufgebraucht, endet die Runde ohne Punkte.',
      'anleitung.punkte4': 'Ab „Schwer“ wird die falsche Antwort durch eine neue ersetzt.',
      'anleitung.punkte5': 'Die Schwierigkeit multipliziert die Punkte jeder Runde.',
      'anleitung.taeglich': 'Schrift des Tages',
      'anleitung.taeglich1': 'Jeden Tag dieselben fünf Schriften — für alle gleich.',
      'anleitung.taeglich2': 'Fünf Antworten, 45 Sekunden, zwei Versuche je Runde.',
      'anleitung.taeglich3': 'Einmal am Tag; danach zeigt die Karte dein Ergebnis.',
      'anleitung.taeglich4': 'Am Ende siehst du, wie der Tag im Vergleich zu deinen bisherigen ausfällt.',
      'anleitung.tastatur': 'Tastatur',
      'anleitung.tastatur1': '— Antwort wählen',
      'anleitung.tastatur2': '— aufdecken, weiter',
      'anleitung.tastatur3': '— Fenster schließen',
      'anleitung.zurueck': 'Zurück',
      'anleitung.punkteEinheit': '{n} Punkte',

      'training.titel': 'Trainingslager',
      'training.ueben': 'Üben',
      'training.katalog': 'Schriften ansehen',
      'training.gattung': 'Gattung',
      'training.bekanntheit': 'Bekanntheit',
      'training.bekannt1': 'nur sehr bekannte',
      'training.bekannt2': 'bekannte',
      'training.bekannt3': 'alle',
      'training.antworten': 'Antworten',
      'training.start': 'Training starten',
      'training.unterschied': 'Was ist anders als im Spiel?',
      'training.unterschied1': 'Keine Punkte, keine Zeit, beliebig viele Versuche.',
      'training.unterschied2': 'Die Lösung lässt sich jederzeit anzeigen.',
      'training.unterschied3': 'Es läuft, bis du aufhörst.',
      'training.passen': '{n} Schriften passen zu dieser Auswahl.',
      'training.zuwenig': 'Nur {n} Schriften passen dazu — das reicht nicht für {noetig} Antworten. Bitte weiter fassen.',
      'training.alleGattungen': 'alle Gattungen',
      'katalog.suchen': 'Suchen',
      'katalog.suchePlatz': 'Name der Schrift',
      'katalog.probetext': 'Probetext',
      'katalog.leer': 'Keine Schrift passt zu dieser Suche.',

      'spiel.runde': 'Runde',
      'spiel.punkte': 'Punkte',
      'spiel.dieseRunde': 'Diese Runde',
      'spiel.aufgabe': 'Aufgabe',
      'spiel.richtig': 'Richtig',
      'spiel.aufdecken': 'Mehr aufdecken',
      'spiel.loesung': 'Lösung zeigen',
      'spiel.alles': 'alles aufgedeckt',
      'spiel.rundeNr': 'Runde {n}',
      'spiel.aufgabeNr': 'Aufgabe {n}',
      'spiel.stufeVon': '{n}/{gesamt} · {name}',
      'spiel.versucheUebrig': '{offen} von {gesamt} Versuchen übrig',

      'stufe.1': 'Punkt',
      'stufe.2': 'Komma',
      'stufe.3': 'Buchstabe',
      'stufe.4': 'Kurzes Wort',
      'stufe.5': 'Langes Wort',
      'stufe.6': 'Kurzer Satz',
      'stufe.7': 'Ganzes Alphabet',

      'aufloesung.richtig': 'richtig',
      'aufloesung.falsch': 'falsch',
      'aufloesung.erkanntAuf': 'Richtig erkannt auf Stufe {n} von {gesamt}',
      'aufloesung.zeitAus': 'Zeit abgelaufen. Gesucht war',
      'aufloesung.gesucht': 'Gesucht war',
      'aufloesung.leider': 'Leider nicht. Gesucht war',
      'aufloesung.deineAntwort': 'Deine Antwort',
      'aufloesung.mehr': 'Mehr zu dieser Schrift',
      'aufloesung.plusPunkte': '+ {n} Punkte{zusatz}',
      'aufloesung.keinePunkte': 'Keine Punkte für diese Runde{zusatz}',
      'aufloesung.trainingStand': '{richtig} von {gesamt} richtig{zusatz}',
      'aufloesung.malFalsch': ' · {n}× falsch',
      'aufloesung.weiter': 'Weiter',
      'aufloesung.ergebnisAnsehen': 'Ergebnis ansehen',
      'aufloesung.beenden': 'Beenden',

      'ende.nochmal': 'Nochmal',
      'ende.schwierigkeit': 'Schwierigkeit',
      'ende.kopieren': 'Kopieren',
      'ende.kopiert': 'Kopiert!',
      'ende.bild': 'Als Bild',
      'ende.bildMoment': 'Moment …',
      'ende.bildGeteilt': 'Geteilt!',
      'ende.bildGespeichert': 'Gespeichert!',
      'ende.bildFehler': 'Ging nicht',
      'ende.startseite': 'Startseite',
      'ende.punkteEinheit': 'Punkte',
      'ende.aufStufe': 'auf Stufe {n}',
      'ende.zeitAus': 'Zeit abgelaufen',
      'ende.nichtErkannt': 'nicht erkannt',
      'ende.malFalsch': '{n}× falsch',
      'ende.neuerBestwert': 'Neuer Bestwert',
      'ende.neuerBestwertVorher': 'Neuer Bestwert (vorher {alt})',
      'ende.bestwert': 'Bestwert: {n}',

      'rang.experte': 'Schriftexperte',
      'rang.sicher': 'Sehr sicher',
      'rang.gut': 'Gut im Blick',
      'rang.weg': 'Auf dem Weg',
      'rang.ueben': 'Noch am Üben',
      'rang.erster': 'Erster Versuch',

      'orden.blind': 'Nur ein Punkt',
      'orden.blindText': 'Eine Schrift allein am Punkt erkannt.',
      'orden.sparsam': 'Ohne Hilfe',
      'orden.sparsamText': 'Eine Runde ohne einmal aufzudecken gelöst.',
      'orden.rein': 'Fehlerfrei',
      'orden.reinText': 'Keine einzige falsche Antwort im ganzen Spiel.',
      'orden.serie': 'Alle fünf',
      'orden.serieText': 'Alle fünf Schriften richtig bestimmt.',
      'orden.lupe': 'Nicht aufgegeben',
      'orden.lupeText': 'Eine Schrift erst auf der letzten Stufe geknackt.',

      'tag.titel': 'Schrift des Tages',
      'tag.heuteGespielt': 'Heute gespielt: {n} Punkte',
      'tag.serieEins': '1 Tag in Folge',
      'tag.serieViele': '{n} Tage in Folge',
      'tag.heuteOffen': ' — heute noch offen',
      'tag.inFolge': 'Tage in Folge',
      'tag.laengste': 'längste Serie',
      'tag.gespielt': 'Tage gespielt',
      'tag.verteilung': 'Wie deine Ergebnisse verteilt sind',
      'tag.stufenTitel': 'Auf welcher Stufe du erkennst',
      'tag.stufenFuss': 'Über alle bisherigen Tage · ✗ = nicht erkannt',
      'tag.besserAls': 'Besser als {p} % deiner bisherigen {n} Runden',
      'tag.besserAlsEine': 'Besser als {p} % deiner bisherigen Runde',
      'tag.ersterTag': 'Dein erster Tag — ab morgen gibt es einen Vergleich.',
      'tag.countdown': 'Nächste Schrift des Tages in {zeit}',
      'tag.warum': 'Warum kein Vergleich mit anderen Spielern?',
      'tag.warumText': 'Die Seite läuft ohne Server: Alles, was du spielst, bleibt in deinem Browser. Damit gibt es keine Ergebnisse anderer Leute, mit denen sich rechnen ließe — verglichen wird deshalb mit deinen eigenen bisherigen Tagen.',
      'tag.bildStufe': 'ZAHL = STUFE, AUF DER ERKANNT WURDE',
      'tag.bildPunkte': 'PUNKTE',

      'einst.titel': 'Einstellungen',
      'einst.sprache': 'Sprache',
      'einst.musik': 'Musik',
      'einst.sfx': 'Soundeffekte',
      'einst.an': 'an',
      'einst.aus': 'aus',
      'einst.tippen': 'Tippgeräusch',
      'einst.bewegung': 'Weniger Animation',
      'einst.loeschen': 'Bestwerte löschen',
      'einst.geloescht': 'Bestwerte gelöscht.',
      'einst.schliessen': 'Schließen',

      'frage.ja': 'Ja',
      'frage.abbrechen': 'Abbrechen',
      'frage.abbruchTitel': 'Spiel abbrechen?',
      'frage.abbruchText': 'Das laufende Spiel wird verworfen und die Punkte gehen verloren.',
      'frage.abbruchJa': 'Abbrechen und zurück',
      'frage.loeschenTitel': 'Bestwerte löschen?',
      'frage.loeschenText': 'Alle gespeicherten Bestwerte werden entfernt. Das lässt sich nicht rückgängig machen.',
      'frage.loeschenJa': 'Löschen',

      'fuss.bestand': '{n} von {gesamt} Schriften verfügbar',
      'fuss.zuwenig': 'Zu wenige Schriften geladen.',

      'gattung.sans': 'Grotesk',
      'gattung.serif': 'Antiqua',
      'gattung.slab': 'Egyptienne',
      'gattung.mono': 'Schreibmaschine',
      'gattung.display': 'Plakatschrift',
      'gattung.script': 'Schreibschrift'
    },

    en: {
      'titel.seite': 'findthefont — Guess the typeface',
      'kopf.startseite': 'Home',
      'kopf.einstellungen': 'Settings',
      'kopf.zurStartseite': 'Back to home',

      'laden.text': 'Loading typefaces …',
      'laden.moment': 'One moment …',
      'laden.pruefen': 'Checking typefaces …',
      'laden.gleich': 'Almost ready …',
      'laden.zuwenig': 'Too few typefaces found.',

      'menue.titel': 'Can you name<br>the typeface?',
      'menue.einleitung': 'You start with a single full stop. The less you reveal, the more points you get.',
      'menue.taeglich': 'Typeface of the Day',
      'menue.taeglichText': 'The same five for everyone',
      'menue.spiel': 'Free play',
      'menue.spielText': '5 rounds, pick your level',
      'menue.training': 'Practice',
      'menue.trainingText': 'No score, no clock',
      'menue.anleitung': 'How to play',
      'menue.anleitungText': 'The rules in brief',
      'menue.einstellungen': 'Settings',
      'menue.einstellungenText': 'Sound and display',

      'schwierigkeit.titel': 'Difficulty',
      'schwierigkeit.start': 'Start game',
      'schwierigkeit.leicht': 'Easy',
      'schwierigkeit.mittel': 'Medium',
      'schwierigkeit.schwer': 'Hard',
      'schwierigkeit.experte': 'Expert',
      'schwierigkeit.antworten': '{n} answers',
      'schwierigkeit.sekunden': '{n} s',
      'schwierigkeit.ohneZeit': 'no clock',
      'schwierigkeit.versuche': '{n} tries',
      'schwierigkeit.bestwert': 'Best {best} of a possible {max} points',
      'schwierigkeit.moeglich': 'Up to {max} points',

      'anleitung.titel': 'How to play',
      'anleitung.stufen': 'The seven stages',
      'anleitung.punkte': 'Points and wrong answers',
      'anleitung.punkte1': 'You score the value of the stage you guess it on.',
      'anleitung.punkte2': 'Each wrong answer costs 120 points and reveals a stage.',
      'anleitung.punkte3': 'Run out of tries and the round ends with nothing.',
      'anleitung.punkte4': 'From “Hard” up, a wrong answer is replaced by a new one.',
      'anleitung.punkte5': 'The difficulty multiplies every round’s points.',
      'anleitung.taeglich': 'Typeface of the Day',
      'anleitung.taeglich1': 'The same five typefaces every day, for everyone.',
      'anleitung.taeglich2': 'Five answers, 45 seconds, two tries per round.',
      'anleitung.taeglich3': 'Once a day; after that the card shows your result.',
      'anleitung.taeglich4': 'At the end you see how the day compares with your previous ones.',
      'anleitung.tastatur': 'Keyboard',
      'anleitung.tastatur1': '— pick an answer',
      'anleitung.tastatur2': '— reveal, continue',
      'anleitung.tastatur3': '— close a window',
      'anleitung.zurueck': 'Back',
      'anleitung.punkteEinheit': '{n} points',

      'training.titel': 'Practice',
      'training.ueben': 'Practise',
      'training.katalog': 'Browse typefaces',
      'training.gattung': 'Category',
      'training.bekanntheit': 'How well known',
      'training.bekannt1': 'very well known only',
      'training.bekannt2': 'well known',
      'training.bekannt3': 'all of them',
      'training.antworten': 'Answers',
      'training.start': 'Start practice',
      'training.unterschied': 'How is this different from the game?',
      'training.unterschied1': 'No points, no clock, as many tries as you like.',
      'training.unterschied2': 'You can reveal the answer at any time.',
      'training.unterschied3': 'It runs until you stop.',
      'training.passen': '{n} typefaces match this selection.',
      'training.zuwenig': 'Only {n} typefaces match — not enough for {noetig} answers. Please widen the selection.',
      'training.alleGattungen': 'all categories',
      'katalog.suchen': 'Search',
      'katalog.suchePlatz': 'Name of the typeface',
      'katalog.probetext': 'Sample text',
      'katalog.leer': 'No typeface matches this search.',

      'spiel.runde': 'Round',
      'spiel.punkte': 'Points',
      'spiel.dieseRunde': 'This round',
      'spiel.aufgabe': 'Task',
      'spiel.richtig': 'Correct',
      'spiel.aufdecken': 'Reveal more',
      'spiel.loesung': 'Show answer',
      'spiel.alles': 'everything revealed',
      'spiel.rundeNr': 'Round {n}',
      'spiel.aufgabeNr': 'Task {n}',
      'spiel.stufeVon': '{n}/{gesamt} · {name}',
      'spiel.versucheUebrig': '{offen} of {gesamt} tries left',

      'stufe.1': 'Full stop',
      'stufe.2': 'Comma',
      'stufe.3': 'Letter',
      'stufe.4': 'Short word',
      'stufe.5': 'Long word',
      'stufe.6': 'Short sentence',
      'stufe.7': 'Whole alphabet',

      'aufloesung.richtig': 'correct',
      'aufloesung.falsch': 'wrong',
      'aufloesung.erkanntAuf': 'Named it on stage {n} of {gesamt}',
      'aufloesung.zeitAus': 'Time up. It was',
      'aufloesung.gesucht': 'It was',
      'aufloesung.leider': 'Not quite. It was',
      'aufloesung.deineAntwort': 'Your answer',
      'aufloesung.mehr': 'More about this typeface',
      'aufloesung.plusPunkte': '+ {n} points{zusatz}',
      'aufloesung.keinePunkte': 'No points this round{zusatz}',
      'aufloesung.trainingStand': '{richtig} of {gesamt} correct{zusatz}',
      'aufloesung.malFalsch': ' · {n} wrong',
      'aufloesung.weiter': 'Continue',
      'aufloesung.ergebnisAnsehen': 'See result',
      'aufloesung.beenden': 'Finish',

      'ende.nochmal': 'Play again',
      'ende.schwierigkeit': 'Difficulty',
      'ende.kopieren': 'Copy',
      'ende.kopiert': 'Copied!',
      'ende.bild': 'As image',
      'ende.bildMoment': 'One moment …',
      'ende.bildGeteilt': 'Shared!',
      'ende.bildGespeichert': 'Saved!',
      'ende.bildFehler': 'Did not work',
      'ende.startseite': 'Home',
      'ende.punkteEinheit': 'points',
      'ende.aufStufe': 'on stage {n}',
      'ende.zeitAus': 'time up',
      'ende.nichtErkannt': 'not named',
      'ende.malFalsch': '{n} wrong',
      'ende.neuerBestwert': 'New best',
      'ende.neuerBestwertVorher': 'New best (was {alt})',
      'ende.bestwert': 'Best: {n}',

      'rang.experte': 'Type expert',
      'rang.sicher': 'Very sure-footed',
      'rang.gut': 'Good eye',
      'rang.weg': 'Getting there',
      'rang.ueben': 'Still practising',
      'rang.erster': 'First attempt',

      'orden.blind': 'From a dot',
      'orden.blindText': 'Named a typeface from the full stop alone.',
      'orden.sparsam': 'No help needed',
      'orden.sparsamText': 'Solved a round without revealing anything.',
      'orden.rein': 'Flawless',
      'orden.reinText': 'Not a single wrong answer all game.',
      'orden.serie': 'All five',
      'orden.serieText': 'Named all five typefaces.',
      'orden.lupe': 'Never gave up',
      'orden.lupeText': 'Cracked one only on the very last stage.',

      'tag.titel': 'Typeface of the Day',
      'tag.heuteGespielt': 'Played today: {n} points',
      'tag.serieEins': '1 day in a row',
      'tag.serieViele': '{n} days in a row',
      'tag.heuteOffen': ' — today still open',
      'tag.inFolge': 'days in a row',
      'tag.laengste': 'longest streak',
      'tag.gespielt': 'days played',
      'tag.verteilung': 'How your results spread out',
      'tag.stufenTitel': 'Which stage you name it on',
      'tag.stufenFuss': 'Across all your days · ✗ = not named',
      'tag.besserAls': 'Better than {p} % of your {n} previous rounds',
      'tag.besserAlsEine': 'Better than {p} % of your previous round',
      'tag.ersterTag': 'Your first day — comparisons start tomorrow.',
      'tag.countdown': 'Next Typeface of the Day in {zeit}',
      'tag.warum': 'Why no comparison with other players?',
      'tag.warumText': 'This site runs without a server: everything you play stays in your browser. That means there are no other people’s results to compare against — so the comparison is with your own previous days.',
      'tag.bildStufe': 'NUMBER = STAGE IT WAS NAMED ON',
      'tag.bildPunkte': 'POINTS',

      'einst.titel': 'Settings',
      'einst.sprache': 'Language',
      'einst.musik': 'Music',
      'einst.sfx': 'Sound effects',
      'einst.an': 'on',
      'einst.aus': 'off',
      'einst.tippen': 'Typing sound',
      'einst.bewegung': 'Reduce animation',
      'einst.loeschen': 'Clear best scores',
      'einst.geloescht': 'Best scores cleared.',
      'einst.schliessen': 'Close',

      'frage.ja': 'Yes',
      'frage.abbrechen': 'Cancel',
      'frage.abbruchTitel': 'Abandon the game?',
      'frage.abbruchText': 'The running game is discarded and its points are lost.',
      'frage.abbruchJa': 'Abandon and go back',
      'frage.loeschenTitel': 'Clear best scores?',
      'frage.loeschenText': 'All stored best scores will be removed. This cannot be undone.',
      'frage.loeschenJa': 'Clear',

      'fuss.bestand': '{n} of {gesamt} typefaces available',
      'fuss.zuwenig': 'Too few typefaces loaded.',

      'gattung.sans': 'Sans-serif',
      'gattung.serif': 'Serif',
      'gattung.slab': 'Slab serif',
      'gattung.mono': 'Monospace',
      'gattung.display': 'Display',
      'gattung.script': 'Script'
    }
  };

  /* Die Schriftproben selbst — in der jeweiligen Sprache, sonst
     stünden auf einer englischen Seite deutsche Wörter. */
  const PROBEN = {
    de: {
      buchstaben: ['a', 'g', 'R', 'e', 'k', 'y', 'S', 'Q'],
      kurz: ['Typ', 'Hut', 'Zug', 'Reh', 'Gas', 'Eis', 'Blei'],
      lang: ['Schriftsetzerei', 'Buchstabenkasten', 'Druckerpresse',
             'Federzeichnung', 'Handsatzregal'],
      satz: ['Der Setzer greift zur Lupe.',
             'Die Presse klappert im Hinterhof.',
             'Ein Blatt Papier, frisch gespannt.',
             'Das Farbband ist fast verbraucht.'],
      pangramm: 'Franz jagt im komplett verwahrlosten Taxi quer durch Bayern. 0123456789',
      katalogprobe: 'Hamburgefonstiv'
    },
    en: {
      buchstaben: ['a', 'g', 'R', 'e', 'k', 'y', 'S', 'Q'],
      kurz: ['Type', 'Ink', 'Hat', 'Gas', 'Rye', 'Lead'],
      lang: ['Typesetting', 'Letterpress', 'Compositor',
             'Penmanship', 'Printworks'],
      satz: ['The setter reaches for the loupe.',
             'The press clatters in the backyard.',
             'A sheet of paper, freshly clamped.',
             'The ribbon is nearly worn through.'],
      pangramm: 'The quick brown fox jumps over the lazy dog. 0123456789',
      katalogprobe: 'Hamburgefonstiv'
    }
  };

  let aktuell = 'de';
  const zuhoerer = [];

  function erkenne() {
    const gespeichert = localStorage.getItem(SCHLUESSEL);
    if (gespeichert && TEXTE[gespeichert]) return gespeichert;
    const browser = (navigator.language || 'de').slice(0, 2).toLowerCase();
    return TEXTE[browser] ? browser : 'en';
  }

  /** Text holen; {platzhalter} werden ersetzt. */
  function t(schluessel, werte) {
    let text = (TEXTE[aktuell] && TEXTE[aktuell][schluessel]);
    if (text === undefined) text = TEXTE.de[schluessel];
    if (text === undefined) return schluessel;
    if (!werte) return text;
    return text.replace(/\{(\w+)\}/g, (_, name) =>
      werte[name] === undefined ? '' : werte[name]);
  }

  /** Alle Elemente mit data-t (und data-t-attr) füllen. */
  function anwenden() {
    document.documentElement.lang = aktuell;
    document.title = t('titel.seite');

    document.querySelectorAll('[data-t]').forEach(el => {
      const text = t(el.dataset.t);
      if (el.dataset.tHtml !== undefined || /<[a-z]/i.test(text)) el.innerHTML = text;
      else el.textContent = text;
    });

    document.querySelectorAll('[data-t-platzhalter]').forEach(el => {
      el.placeholder = t(el.dataset.tPlatzhalter);
    });
    document.querySelectorAll('[data-t-titel]').forEach(el => {
      el.title = t(el.dataset.tTitel);
      if (el.hasAttribute('aria-label')) el.setAttribute('aria-label', t(el.dataset.tTitel));
    });

    zuhoerer.forEach(fn => fn(aktuell));
  }

  return {
    lade() { aktuell = erkenne(); },
    aktuell: () => aktuell,
    verfuegbar: () => Object.keys(TEXTE),
    setze(sprache) {
      if (!TEXTE[sprache]) return;
      aktuell = sprache;
      try { localStorage.setItem(SCHLUESSEL, sprache); } catch (e) {}
      anwenden();
    },
    t,
    anwenden,
    proben: () => PROBEN[aktuell] || PROBEN.de,
    /** Wird nach jedem Sprachwechsel gerufen. */
    beiWechsel(fn) { zuhoerer.push(fn); }
  };
})();

const t = (schluessel, werte) => Sprache.t(schluessel, werte);
