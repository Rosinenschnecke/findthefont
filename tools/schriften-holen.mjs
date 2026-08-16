/* ============================================================
   Werkzeug: holt die Schriftdateien in die Werkstatt.

   Lädt für jede im Katalog als "google" geführte Schrift den
   Latin-Schnitt als .woff2 nach fonts/ und schreibt die passenden
   @font-face-Regeln nach css/schriften.css.

   Aufruf:  node tools/schriften-holen.mjs

   Warum überhaupt mitliefern statt vom CDN laden?
   Ein Ratespiel über Schriften ist wertlos, wenn die Schriften
   fehlen — bei blockiertem CDN, ohne Netz oder hinter strengen
   Firewalls sähe sonst jede Probe gleich aus.
   ============================================================ */

import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const WURZEL = join(dirname(fileURLToPath(import.meta.url)), '..');
const ZIEL = join(WURZEL, 'fonts');
const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

/* Katalog einlesen, ohne ein Modulsystem zu bemühen. */
const katalogQuelle = readFileSync(join(WURZEL, 'js', 'fonts.js'), 'utf8');
const sandkasten = {};
new Function('exports', katalogQuelle + '\nexports.FONT_CATALOG = FONT_CATALOG; exports.UI_FONTS = UI_FONTS;')(sandkasten);

const familien = [
  ...sandkasten.UI_FONTS.map(n => ({ n, gewichte: '400;700' })),
  ...sandkasten.FONT_CATALOG.filter(f => f.src === 'google').map(f => ({ n: f.n, gewichte: '400' }))
];

const dateiname = n => n.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

async function hole(url, alsText) {
  const antwort = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!antwort.ok) throw new Error(`${antwort.status} ${antwort.statusText}`);
  return alsText ? antwort.text() : Buffer.from(await antwort.arrayBuffer());
}

/**
 * Aus dem Google-CSS die @font-face-Blöcke der lateinischen Subsets
 * herausziehen — Kyrillisch, Griechisch und Vietnamesisch brauchen
 * wir für deutsche Schriftproben nicht.
 */
function latinBloecke(css) {
  const bloecke = [];
  const regex = /\/\*\s*([a-z-]+)\s*\*\/\s*(@font-face\s*\{[^}]*\})/g;
  let treffer;
  while ((treffer = regex.exec(css)) !== null) {
    if (treffer[1] === 'latin' || treffer[1] === 'latin-ext') {
      bloecke.push({ subset: treffer[1], block: treffer[2] });
    }
  }
  return bloecke;
}

const felder = (block, name) => (block.match(new RegExp(`${name}:\\s*([^;]+);`)) || [])[1]?.trim();

mkdirSync(ZIEL, { recursive: true });

const regeln = [];
const fehlend = [];
let geladen = 0, uebersprungen = 0, bytes = 0;

for (const familie of familien) {
  const anfrage = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(familie.n).replace(/%20/g, '+')}:wght@${familie.gewichte}&display=swap`;

  let css;
  try {
    css = await hole(anfrage, true);
  } catch (e) {
    console.warn(`  ✗ ${familie.n}: Stylesheet nicht erreichbar (${e.message})`);
    fehlend.push(familie.n);
    continue;
  }

  const bloecke = latinBloecke(css);
  if (!bloecke.length) {
    console.warn(`  ✗ ${familie.n}: kein lateinisches Subset gefunden`);
    fehlend.push(familie.n);
    continue;
  }

  for (const { subset, block } of bloecke) {
    const url = (block.match(/url\((https:\/\/[^)]+\.woff2)\)/) || [])[1];
    if (!url) continue;

    const gewicht = felder(block, 'font-weight') || '400';
    const bereich = felder(block, 'unicode-range');
    const datei = `${dateiname(familie.n)}-${gewicht.replace(/\s+/g, '-')}-${subset}.woff2`;
    const pfad = join(ZIEL, datei);

    if (existsSync(pfad) && statSync(pfad).size > 0) {
      uebersprungen++;
    } else {
      try {
        const daten = await hole(url, false);
        writeFileSync(pfad, daten);
        geladen++;
        bytes += daten.length;
      } catch (e) {
        console.warn(`  ✗ ${familie.n} (${subset}): ${e.message}`);
        continue;
      }
    }

    regeln.push(
      `@font-face {\n` +
      `  font-family: '${familie.n}';\n` +
      `  font-style: normal;\n` +
      `  font-weight: ${gewicht};\n` +
      `  font-display: swap;\n` +
      `  src: url('../fonts/${datei}') format('woff2');\n` +
      (bereich ? `  unicode-range: ${bereich};\n` : '') +
      `}`
    );
  }
  process.stdout.write(`  ✓ ${familie.n}\n`);
}

const kopf =
`/* ============================================================
   Das Typenlager — automatisch erzeugt von tools/schriften-holen.mjs.
   Nicht von Hand bearbeiten.

   Die Schriftdateien stammen aus dem Google-Fonts-Projekt und
   stehen unter der SIL Open Font License 1.1 bzw. der Apache
   License 2.0 (siehe fonts/HERKUNFT.md).
   ${familien.length - fehlend.length} Familien · erzeugt am ${new Date().toISOString().slice(0, 10)}
   ============================================================ */\n\n`;

writeFileSync(join(WURZEL, 'css', 'schriften.css'), kopf + regeln.join('\n\n') + '\n');

console.log(`\nFertig: ${geladen} Dateien geladen, ${uebersprungen} bereits vorhanden, ` +
            `${(bytes / 1024 / 1024).toFixed(2)} MB neu.`);
if (fehlend.length) console.log(`Nicht erhalten: ${fehlend.join(', ')}`);
