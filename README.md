# findthefont

**→ [Hier spielen](https://rosinenschnecke.github.io/findthefont/)**

Ein Ratespiel über Schriftarten im Gewand einer alten Schreibmaschine. Die
Maschine tippt eine Schriftprobe aufs Papier — zuerst nur einen einzigen
Punkt. Wer die Schrift daran erkennt, bekommt die volle Punktzahl. Wer mehr
sehen will, deckt weiter auf und bekommt weniger.

**Keine Abhängigkeiten, kein Build, kein Server.** Statisches HTML, CSS und
JavaScript.

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
| **Spiel** | 5 Runden mit Punkten, Zeitlimit und Endergebnis |
| **Trainingslager** | Üben ohne Punkte und Zeitdruck, dazu ein durchsuchbarer Schriftenkatalog |
| **So wird gespielt** | Stufen, Punkte und Tipps kurz erklärt |
| **Einstellungen** | Lautstärke für Musik und Soundeffekte, Animationen, Bestwerte |

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
* Bleibt nur noch eine Antwort übrig, endet die Runde ohne Punkte.
* **Tipps** kosten Punkte: Gattung (60), Herkunft (110), Anfangsbuchstabe (150).
  Im Trainingslager sind sie kostenlos.

### Schwierigkeitsgrade

| Grad | Antworten | Schriften | Zeit | Punkte |
|------|----------:|-----------|-----:|-------:|
| Leicht | 4 | nur sehr bekannte | — | ×1,0 |
| Mittel | 5 | bekannte | 60 s | ×1,4 |
| Schwer | 6 | alle, gleiche Gattung | 40 s | ×1,9 |
| Experte | 8 | alle, gleiche Gattung | 25 s | ×2,5 |

Wie bekannt eine Schrift ist, steht in `js/fonts.js` unter `BEKANNTHEIT`.

**Tastatur:** `1`–`8` wählen eine Antwort, `Leertaste` deckt auf bzw. blättert
weiter, `Esc` schließt Fenster.

## Aufbau

```
index.html            Alle Schirme: Laden, Startseite, Schwierigkeit,
                      Anleitung, Training, Spiel, Ergebnis
css/style.css         Gestaltung
css/schriften.css     @font-face-Regeln — erzeugt, nicht von Hand pflegen
fonts/                Mitgelieferte Schriftdateien (.woff2)
assets/musik/         Hintergrundmusik
js/fonts.js           Schriftenkatalog: Gattung, Herkunft, Notiz, Bekanntheit
js/settings.js        Einstellungen, im Browser gespeichert
js/audio.js           Soundeffekte (Web Audio, synthetisch erzeugt)
js/music.js           Hintergrundmusik in Dauerschleife
js/detect.js          Prüft, welche Schriften wirklich vorhanden sind
js/specimen.js        Zeichnet die Schriftprobe aufs Canvas
js/game.js            Spielablauf, Punkte, Tipps, Training, Ergebnis
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

`js/detect.js` misst vor dem Spiel jede Schrift gegen die drei Ausweich­gattungen
des Browsers. Nur was sich messbar unterscheidet, kommt ins Spiel — sonst gäbe
es Antwortmöglichkeiten, die identisch aussehen.

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
