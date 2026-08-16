# findthefont

Ein Ratespiel über Druckschriften, aufgemacht als Werkstatt einer alten
Schriftsetzerei. Die Maschine tippt eine Schriftprobe aufs Papier — zuerst
nur einen einzigen Punkt. Wer die Schrift daran erkennt, bekommt die volle
Punktzahl. Wer mehr sehen will, zieht den Hebel und bekommt weniger.

**Keine Abhängigkeiten, kein Build, kein Server.** Die Seite besteht aus
statischem HTML, CSS und JavaScript.

## Spielen

```bash
python3 -m http.server 8000
# dann http://localhost:8000 öffnen
```

Ein Dateiaufruf per `file://` funktioniert nicht zuverlässig, weil Browser
das Nachladen der Schriftdateien dabei blockieren. Zum Veröffentlichen
genügt jeder statische Webspace (GitHub Pages, Netlify, ein beliebiger
Webserver) — einfach den gesamten Ordner hochladen.

## Spielprinzip

Eine Runde besteht aus **fünf Proben**. Für jede Probe zeigt die Maschine
zunächst Stufe 1 und deckt auf Wunsch weiter auf:

| Stufe | Was zu sehen ist | Punkte |
|------:|------------------|-------:|
| 1 | Der Punkt | 1000 |
| 2 | Das Komma | 800 |
| 3 | Ein Buchstabe | 620 |
| 4 | Ein kurzes Wort | 460 |
| 5 | Ein langes Wort | 320 |
| 6 | Ein kurzer Satz | 200 |
| 7 | Das Pangramm | 110 |

* Ein **Fehlgriff** kostet 120 Punkte, verklemmt die Taste und schiebt die
  Walze automatisch eine Stufe weiter.
* Bleibt nur noch eine Taste übrig, gilt die Probe als Makulatur — null Punkte.
* Am Ende gibt es ein **Zeugnis** mit Gesamtpunktzahl, Rang, Protokoll und
  möglichen Auszeichnungen. Der Hausrekord wird je Dienstgrad im Browser
  gespeichert.

Drei Dienstgrade bestimmen Schwierigkeit und Punktfaktor:

| Dienstgrad | Tasten | Faktor | Besonderheit |
|------------|-------:|-------:|--------------|
| Lehrling | 4 | ×1,0 | gemischte Gattungen |
| Geselle | 6 | ×1,4 | nur verwandte Gattungen |
| Meister | 8 | ×1,8 | nur verwandte Gattungen |

**Tastatur:** `1`–`8` wählen eine Antwort, `Leertaste` zieht den Hebel
bzw. blättert weiter.

## Aufbau

```
index.html            Gerüst aller vier Schirme (Laden, Start, Spiel, Zeugnis)
css/style.css         Ausstattung der Werkstatt
css/schriften.css     @font-face-Regeln — erzeugt, nicht von Hand pflegen
fonts/                Die mitgelieferten Schriftdateien (.woff2)
js/fonts.js           Katalog aller Schriften samt Gattung und Notiz
js/detect.js          Prüft, welche Schriften tatsächlich vorhanden sind
js/specimen.js        Die Walze: tippt die Probe aufs Canvas
js/audio.js           Synthetische Werkstattgeräusche (Web Audio)
js/game.js            Spielablauf, Punkte, Zeugnis
tools/schriften-holen.mjs   Holt die Schriftdateien und schreibt schriften.css
```

### Warum ein Canvas?

Die Schriftprobe wird nicht als HTML-Text gesetzt, sondern auf ein
`<canvas>` gezeichnet. Damit steht der gesuchte Schriftname nirgends im
Quelltext des Blattes — ein Blick in die Entwicklerwerkzeuge verrät die
Lösung nicht. Nebenbei lässt sich der Anschlag so Zeichen für Zeichen
animieren.

### Warum liegen die Schriften bei?

124 Schriften stehen im Katalog. Rund 60 davon sind Systemschriften
(Arial, Times New Roman, Futura …), die je nach Betriebssystem vorhanden
sind oder eben nicht — sie werden nur abgefragt, wenn sie das Gerät
wirklich besitzt. Die übrigen 64 Familien liegen als `.woff2` bei, damit
jede Person dieselben Proben zu sehen bekommt, auch offline oder hinter
einer Firewall, die Schrift-CDNs blockiert.

`js/detect.js` misst vor dem Spiel jede Schrift gegen die drei
Ausweichgattungen des Browsers. Nur was sich messbar unterscheidet, kommt
in den Setzkasten — sonst gäbe es Antwortmöglichkeiten, die identisch
aussehen.

## Schriften ergänzen

Neuen Eintrag in `js/fonts.js` anlegen:

```js
{ n: 'Fira Sans', src: 'google', cat: 'sans',
  m: 'Erik Spiekermann, 2013',
  t: 'Ursprünglich für Firefox OS entworfen.' }
```

`src: 'sys'` für Systemschriften (nichts weiter zu tun), `src: 'google'`
für nachzuladende. Bei letzteren anschließend einmal

```bash
node tools/schriften-holen.mjs
```

ausführen — das lädt die fehlenden Dateien nach `fonts/` und schreibt
`css/schriften.css` neu. Bereits vorhandene Dateien werden übersprungen.

Mögliche Gattungen (`cat`): `sans`, `serif`, `slab`, `mono`, `display`,
`script`.

## Lizenz der Schriftdateien

Die mitgelieferten Schriften stehen unter der SIL Open Font License 1.1
bzw. der Apache License 2.0 — Einzelheiten in
[`fonts/HERKUNFT.md`](fonts/HERKUNFT.md).
