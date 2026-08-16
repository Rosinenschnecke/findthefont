# findthefont

**→ [Hier spielen](https://rosinenschnecke.github.io/findthefont/)**

Ein Ratespiel über Schriftarten im Gewand einer alten Schreibmaschine. Die
Maschine tippt eine Schriftprobe aufs Papier — zuerst nur einen einzigen
Punkt. Wer die Schrift daran erkennt, bekommt die volle Punktzahl. Wer mehr
sehen will, deckt weiter auf und bekommt weniger.

**Keine Abhängigkeiten, kein Build, kein Server.** Statisches HTML, CSS und
JavaScript — offline lauffähig, auf Deutsch und Englisch.

## Lokal starten

```bash
python3 -m http.server 8000
# dann http://localhost:8000 öffnen
```

Ein Aufruf per `file://` funktioniert nicht zuverlässig, weil Browser das
Nachladen der Schriftdateien dabei blockieren.

## Veröffentlichen

Die Seite liegt auf **GitHub Pages**:
<https://rosinenschnecke.github.io/findthefont/>

`.github/workflows/pages.yml` lädt bei jedem Push auf den Standard-Branch den
Ordner unverändert hoch. Gebaut wird nichts. Genauso gut tut es jeder andere
statische Webspace.

## Was es zu tun gibt

| Bereich | Inhalt |
|---|---|
| **Schrift des Tages** | Jeden Tag dieselben fünf Schriften, einmal spielbar, mit Auswertung |
| **Freies Spiel** | 5 Runden mit Punkten, Schwierigkeit wählbar |
| **Trainingslager** | Üben ohne Punkte und Zeitdruck, dazu ein durchsuchbarer Schriftenkatalog |
| **Anleitung** | Stufen und Punkte, in aufklappbaren Kästen |
| **Einstellungen** | Sprache, Lautstärke für Musik und Soundeffekte, Animationen, Bestwerte |

### Die sieben Stufen

| Stufe | Zu sehen | Punkte |
|------:|----------|-------:|
| 1 | Punkt | 1000 |
| 2 | Komma | 800 |
| 3 | Buchstabe | 620 |
| 4 | Kurzes Wort | 460 |
| 5 | Langes Wort | 320 |
| 6 | Kurzer Satz | 200 |
| 7 | Ganzes Alphabet | 110 |

* Eine **falsche Antwort** kostet 120 Punkte, streicht die Antwort durch und
  deckt automatisch eine Stufe mehr auf.
* Die **Versuche pro Runde sind begrenzt** — durchprobieren führt nicht zum
  Ziel. Sind sie aufgebraucht, endet die Runde ohne Punkte.
* Ab „Schwer“ **wird die falsche Antwort durch eine neue ersetzt** — die Zahl
  der Felder bleibt gleich, die Auswahl verengt sich also nicht.

Die **Zeit** läuft nicht in einem eigenen Balken, sondern auf der Walze der
Maschine: Das Leuchten darauf wird kürzer, bis es verschwunden ist.

### Schwierigkeitsgrade

| Grad | Antworten | Versuche | Schriften | Zeit | Punkte |
|------|----------:|---------:|-----------|-----:|-------:|
| Leicht | 4 | 2 | nur sehr bekannte | — | ×1,0 |
| Mittel | 5 | 2 | bekannte | 60 s | ×1,4 |
| Schwer | 6 | 3, Felder werden ersetzt | alle, gleiche Gattung | 40 s | ×1,9 |
| Experte | 8 | 3, Felder werden ersetzt | alle, gleiche Gattung | 25 s | ×2,5 |

Wie bekannt eine Schrift ist, steht in `js/fonts.js` unter `BEKANNTHEIT`.

### Schrift des Tages

Fünf Schriften, für alle gleich, einmal pro Tag: fünf Antworten, 45 Sekunden,
zwei Versuche je Runde.

Damit die Aufgabe überall dieselbe ist, kommen zwei Dinge zusammen
(`js/daily.js`):

* Der Zufall wird **aus dem Datum berechnet** (mulberry32 über einen
  FNV-Hash des Datums) statt aus `Math.random`. `js/game.js` schaltet dafür
  seine Zufallsquelle um, sodass auch die gezeigten Wörter identisch sind.
* Gezogen wird **nur aus den mitgelieferten Schriften**. Welche Systemschriften
  ein Gerät besitzt, unterscheidet sich — die Aufgabe wäre sonst nicht für alle
  gleich.

Am Ende gibt es Serie, Verteilung der eigenen Ergebnisse, Verteilung der
Stufen, auf denen erkannt wurde, und einen Zähler bis zum nächsten Tag. Der
Teilen-Text ist ein Kästchenraster: 🟩 auf Stufe 1–2, 🟨 auf 3–4, 🟧 später,
🟥 nicht erkannt.

**Kein Vergleich mit anderen Spielern.** Die Seite läuft ohne Server; es gibt
keine fremden Ergebnisse, mit denen sich rechnen ließe. Verglichen wird
deshalb mit den eigenen bisherigen Tagen, und die Auswertung sagt das auch so.
Ein echter Vergleich bräuchte einen Endpunkt, der Ergebnisse sammelt.

Das Ergebnis lässt sich als Text kopieren oder als **Bild** speichern: ein
Papierblatt mit Punktzahl, Kästchenraster und den Schriften der Runde, jede in
sich selbst gesetzt (`js/share.js`). Wo das Gerät die Teilen-Funktion kennt,
geht es direkt dorthin, sonst als Download.

**Tastatur:** `1`–`8` wählen eine Antwort, `Leertaste` deckt auf bzw. blättert
weiter, `Esc` schließt Fenster.

## Sprachen

Deutsch und Englisch, umschaltbar in den Einstellungen; beim ersten Aufruf
entscheidet die Spracheinstellung des Browsers. Feste Texte tragen im HTML ein
`data-t="schluessel"`, alles dynamisch Zusammengesetzte holt sich den Text über
`t('schluessel', { platzhalter })` — beides aus `js/i18n.js`.

Mit übersetzt sind auch die Dinge, die man leicht übersieht: die **Schriftproben**
selbst (englische Wörter und das englische Pangramm statt der deutschen), die
**Notizen zu allen 124 Schriften** (`NOTIZ_EN` in `js/fonts.js`), die
Gattungsnamen und das Zahlenformat. Ein Wechsel mitten im Spiel baut die
betroffenen Listen neu auf.

## Offline und Installation

`sw.js` legt das Gerüst bei der Installation ab und frischt es im Hintergrund
auf; Schriften und Musik kommen erst in den Speicher, wenn sie das erste Mal
gebraucht werden. Zusammen mit `manifest.webmanifest` lässt sich die Seite als
App installieren und läuft ohne Netz.

Beim Start wird **nichts** an Schriften vorgeladen: Die mitgelieferten Familien
liegen ohnehin im Ordner `fonts/` und müssen nicht geprüft werden, gemessen
werden nur die Systemschriften — und das geht ohne Laden. Vor jeder Runde holt
`FontDepot.load()` die eine Schrift, die gebraucht wird. Im Testbrowser sind das
52 KB bis zum Menü statt 2,8 MB.

## Aufbau

```
index.html            Alle Schirme: Laden, Startseite, Schwierigkeit,
                      Anleitung, Training, Spiel, Ergebnis
css/style.css         Gestaltung
css/schriften.css     @font-face-Regeln — erzeugt, nicht von Hand pflegen
fonts/                Mitgelieferte Schriftdateien (.woff2)
assets/musik/         Hintergrundmusik
js/i18n.js            Deutsche und englische Texte, Schriftproben je Sprache
js/fonts.js           Schriftenkatalog: Gattung, Herkunft, Notiz, Bekanntheit
js/daily.js           Schrift des Tages: Datum, Zufallssaat, Verlauf, Statistik
js/settings.js        Einstellungen, im Browser gespeichert
js/audio.js           Soundeffekte (Web Audio, synthetisch erzeugt)
js/music.js           Hintergrundmusik in Dauerschleife
js/detect.js          Prüft, welche Schriften wirklich vorhanden sind
js/specimen.js        Zeichnet die Schriftprobe aufs Canvas
js/share.js           Ergebnis als PNG
js/game.js            Spielablauf, Punkte, Training, Ergebnis
sw.js                 Service Worker für Offline-Betrieb
manifest.webmanifest  Angaben für die Installation als App
tools/schriften-holen.mjs   Holt die Schriftdateien und schreibt schriften.css
```

### Warum ein Canvas?

Die Schriftprobe wird nicht als HTML-Text gesetzt, sondern auf ein `<canvas>`
gezeichnet. So steht der gesuchte Schriftname nirgends im Quelltext — ein Blick
in die Entwicklerwerkzeuge verrät die Lösung nicht. Nebenbei lässt sich der
Anschlag so Zeichen für Zeichen animieren.

### Warum liegen die Schriften bei?

124 Schriften stehen im Katalog. Rund 60 davon sind Systemschriften (Arial,
Times New Roman, Futura …), die je nach Betriebssystem vorhanden sind oder
nicht — sie werden nur abgefragt, wenn das Gerät sie wirklich besitzt. Die
übrigen 64 Familien liegen als `.woff2` bei, damit überall dieselben Proben
ankommen, auch offline oder hinter einer Firewall, die Schrift-CDNs blockiert.

`js/detect.js` misst jede Systemschrift gegen die drei Ausweich­gattungen des
Browsers. Nur was sich messbar unterscheidet, kommt ins Spiel — sonst gäbe es
Antwortmöglichkeiten, die identisch aussehen. Die mitgelieferten Familien
werden nicht geprüft; sie sind ja da.

### Ton

Die **Soundeffekte** werden zur Laufzeit über die Web Audio API erzeugt; es gibt
dafür keine Klangdateien. Die **Hintergrundmusik** liegt unter
`assets/musik/jazz.mp3` und läuft in Dauerschleife. Browser lassen Ton erst zu,
nachdem jemand geklickt hat — die Musik startet deshalb bei der ersten
Interaktion, nicht beim Laden.

Beide Lautstärken lassen sich getrennt regeln und werden im Browser gespeichert.

## Schriften ergänzen

Neuen Eintrag in `js/fonts.js` anlegen:

```js
{ n: 'Fira Sans', src: 'google', cat: 'sans',
  m: 'Erik Spiekermann, 2013',
  t: 'Ursprünglich für Firefox OS entworfen.' }
```

Dazu einen Eintrag in `NOTIZ_EN` für die englische Notiz.

`src: 'sys'` für Systemschriften (nichts weiter zu tun), `src: 'google'` für
nachzuladende. Bei letzteren anschließend einmal

```bash
node tools/schriften-holen.mjs
```

ausführen — das lädt fehlende Dateien nach `fonts/` und schreibt
`css/schriften.css` neu. Vorhandene Dateien werden übersprungen.

Gattungen (`cat`): `sans`, `serif`, `slab`, `mono`, `display`, `script`.
Optional den Namen in `BEKANNTHEIT` eintragen, sonst gilt die Schrift als
Stufe 3 (nur in „Schwer“ und „Experte“).

## Lizenz der Schriftdateien

SIL Open Font License 1.1 bzw. Apache License 2.0 — Einzelheiten in
[`fonts/HERKUNFT.md`](fonts/HERKUNFT.md).
