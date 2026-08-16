/* ============================================================
   findthefont — Der Setzkasten
   Katalog aller Schriften, die im Spiel auftreten können.

   src: "sys"    = auf dem Gerät installierte Systemschrift
        "google" = wird zur Laufzeit von Google Fonts nachgeladen
   cat: sans | serif | slab | mono | display | script

   Welche Schriften tatsächlich im Spiel landen, entscheidet die
   Verfügbarkeitsprüfung in js/detect.js — nur wirklich gerenderte
   Schriften kommen in den Setzkasten.
   ============================================================ */

const FONT_CATALOG = [
  /* ---------- Systemschriften: Grotesk / Serifenlos ---------- */
  { n: 'Arial',                 src: 'sys', cat: 'sans',    m: 'Monotype, 1982', t: 'Die Allgegenwärtige. Am schräg abgeschnittenen "t" und dem geneigten "e"-Abschluss zu erkennen.' },
  { n: 'Helvetica',             src: 'sys', cat: 'sans',    m: 'Max Miedinger, 1957', t: 'Die Schweizer Ikone. Ihre Endstriche stehen exakt waagerecht — Arial schneidet schräg.' },
  { n: 'Helvetica Neue',        src: 'sys', cat: 'sans',    m: 'D. Stempel AG, 1983', t: 'Die aufgeräumte Neufassung der Helvetica mit vereinheitlichten Strichstärken.' },
  { n: 'Verdana',               src: 'sys', cat: 'sans',    m: 'Matthew Carter, 1996', t: 'Für den Bildschirm gezeichnet: breite Buchstaben, weite Punzen, riesige x-Höhe.' },
  { n: 'Tahoma',                src: 'sys', cat: 'sans',    m: 'Matthew Carter, 1994', t: 'Verdanas engere Schwester — dieselbe Handschrift, schmalerer Lauf.' },
  { n: 'Trebuchet MS',          src: 'sys', cat: 'sans',    m: 'Vincent Connare, 1996', t: 'Erkennungszeichen: das "M" mit spitz zulaufendem Mittelteil und die geschwungene "1".' },
  { n: 'Segoe UI',              src: 'sys', cat: 'sans',    m: 'Steve Matteson, 2004', t: 'Windows’ Hausschrift — freundlich gerundet, leicht humanistisch.' },
  { n: 'Calibri',              src: 'sys', cat: 'sans',    m: 'Luc(as) de Groot, 2004', t: 'Die Schrift mit den abgerundeten Ecken — jahrelang Word-Standard.' },
  { n: 'Candara',               src: 'sys', cat: 'sans',    m: 'Gary Munch, 2004', t: 'Humanistische Grotesk mit leicht gewölbten Stämmen.' },
  { n: 'Corbel',                src: 'sys', cat: 'sans',    m: 'Jeremy Tankard, 2005', t: 'Klare Bildschirm-Grotesk mit Mediävalziffern im Standard.' },
  { n: 'Arial Narrow',          src: 'sys', cat: 'sans',    m: 'Monotype', t: 'Die zusammengeschobene Arial — Retter aller zu langen Tabellen.' },
  { n: 'Arial Black',           src: 'sys', cat: 'display', m: 'Monotype', t: 'Arial mit maximalem Fettgrad — die Punzen sind fast zugelaufen.' },
  { n: 'Franklin Gothic Medium',src: 'sys', cat: 'sans',    m: 'Morris F. Benton, 1902', t: 'Amerikanische Zeitungsgrotesk mit kräftigen, leicht unregelmäßigen Strichen.' },
  { n: 'Century Gothic',        src: 'sys', cat: 'sans',    m: 'Monotype, 1991', t: 'Geometrisch wie am Zirkel gezogen — das "a" ist ein reiner Kreis mit Strich.' },
  { n: 'Futura',                src: 'sys', cat: 'sans',    m: 'Paul Renner, 1927', t: 'Bauhaus in Bleisatz: Kreis, Dreieck, Quadrat. Das spitze "A" verrät sie.' },
  { n: 'Gill Sans',             src: 'sys', cat: 'sans',    m: 'Eric Gill, 1928', t: 'Britische Humanistin — das doppelstöckige "g" mit offener Unterschlinge.' },
  { n: 'Optima',                src: 'sys', cat: 'sans',    m: 'Hermann Zapf, 1958', t: 'Serifenlos, aber mit schwellenden Strichen — halb Grotesk, halb Antiqua.' },
  { n: 'Avenir',                src: 'sys', cat: 'sans',    m: 'Adrian Frutiger, 1988', t: 'Die "Zukunft" auf Französisch: Futuras Geometrie, humanistisch gemildert.' },
  { n: 'Avenir Next',           src: 'sys', cat: 'sans',    m: 'Frutiger & Sassoon, 2004', t: 'Die überarbeitete Avenir mit erweiterten Schnitten.' },
  { n: 'Lucida Grande',         src: 'sys', cat: 'sans',    m: 'Bigelow & Holmes, 1985', t: 'Lange Jahre die Systemschrift von Mac OS X.' },
  { n: 'Lucida Sans Unicode',   src: 'sys', cat: 'sans',    m: 'Bigelow & Holmes, 1993', t: 'Breite, gutmütige Grotesk mit riesigem Zeichenvorrat.' },
  { n: 'Geneva',                src: 'sys', cat: 'sans',    m: 'Susan Kare, 1984', t: 'Aus den frühen Macintosh-Tagen — Helvetica für 72 dpi.' },
  { n: 'Bahnschrift',           src: 'sys', cat: 'sans',    m: 'Microsoft, 2017', t: 'Nach DIN 1451 — die Schrift der deutschen Autobahnschilder.' },
  { n: 'Ebrima',                src: 'sys', cat: 'sans',    m: 'Microsoft', t: 'Ursprünglich für afrikanische Schriftsysteme gezeichnet.' },

  /* ---------- Systemschriften: Antiqua / Serif ---------- */
  { n: 'Times New Roman',       src: 'sys', cat: 'serif',   m: 'Stanley Morison, 1932', t: 'Für die Londoner "Times" — enge Laufweite, um Zeitungsspalten zu sparen.' },
  { n: 'Georgia',               src: 'sys', cat: 'serif',   m: 'Matthew Carter, 1993', t: 'Bildschirm-Antiqua mit großer x-Höhe und Mediävalziffern, die auf- und abtauchen.' },
  { n: 'Garamond',              src: 'sys', cat: 'serif',   m: 'nach Claude Garamond, 16. Jh.', t: 'Renaissance-Antiqua: kleine x-Höhe, hoher Kontrast, tropfenförmige Ansätze.' },
  { n: 'Palatino Linotype',     src: 'sys', cat: 'serif',   m: 'Hermann Zapf, 1949', t: 'Kalligrafisch geprägt — man sieht die Breitfeder in jedem Bogen.' },
  { n: 'Palatino',              src: 'sys', cat: 'serif',   m: 'Hermann Zapf, 1949', t: 'Benannt nach dem Schreibmeister Giambattista Palatino.' },
  { n: 'Book Antiqua',          src: 'sys', cat: 'serif',   m: 'Monotype, 1991', t: 'Palatinos naher Verwandter — ein alter Streitfall der Schriftbranche.' },
  { n: 'Baskerville',           src: 'sys', cat: 'serif',   m: 'John Baskerville, 1757', t: 'Barock-Antiqua: waagerechte Achse, feine Haarstriche, klare Serifen.' },
  { n: 'Didot',                 src: 'sys', cat: 'serif',   m: 'Firmin Didot, 1784', t: 'Klassizistisch: extremer Strichkontrast, haarfeine gerade Serifen. Modeheft-Schrift.' },
  { n: 'Cambria',               src: 'sys', cat: 'serif',   m: 'Jelle Bosma, 2004', t: 'Robuste Bildschirm-Antiqua mit kräftigen, fast rechteckigen Serifen.' },
  { n: 'Constantia',            src: 'sys', cat: 'serif',   m: 'John Hudson, 2004', t: 'Serifenschrift mit weichem, leicht kalligrafischem Duktus.' },
  { n: 'Bookman Old Style',     src: 'sys', cat: 'serif',   m: 'nach A. C. Phemister, 1858', t: 'Schwere, breite Serifen — in den 70ern auf jedem Plattencover.' },
  { n: 'Perpetua',              src: 'sys', cat: 'serif',   m: 'Eric Gill, 1929', t: 'Zurückhaltende britische Antiqua mit scharf geschnittenen Serifen.' },
  { n: 'Sylfaen',               src: 'sys', cat: 'serif',   m: 'John Hudson, 1998', t: 'Für georgische und lateinische Schrift zugleich entworfen.' },
  { n: 'Rockwell',              src: 'sys', cat: 'slab',    m: 'Monotype, 1934', t: 'Egyptienne mit exakt rechteckigen Serifen ohne Kehlung.' },

  /* ---------- Systemschriften: Schreibmaschine / Monospace ---------- */
  { n: 'Courier New',           src: 'sys', cat: 'mono',    m: 'Howard Kettler, 1955', t: 'Die Schreibmaschine schlechthin — dünn, weit, mit ausladenden Serifen.' },
  { n: 'Consolas',              src: 'sys', cat: 'mono',    m: 'Luc(as) de Groot, 2004', t: 'Programmierschrift mit abgerundeten Ecken und geschlitzter Null.' },
  { n: 'Monaco',                src: 'sys', cat: 'mono',    m: 'Susan Kare, 1984', t: 'Der Klassiker aus dem Mac-Terminal.' },
  { n: 'Menlo',                 src: 'sys', cat: 'mono',    m: 'Jim Lyles, 2009', t: 'Auf Bitstream Vera Sans Mono aufgebaut, Apples Terminal-Standard.' },
  { n: 'Lucida Console',        src: 'sys', cat: 'mono',    m: 'Bigelow & Holmes, 1993', t: 'Kompakte Konsolenschrift mit kurzen Ober- und Unterlängen.' },
  { n: 'Andale Mono',           src: 'sys', cat: 'mono',    m: 'Steve Matteson, 1995', t: 'Für Terminals gezeichnet, mit sehr eindeutiger Null.' },

  /* ---------- Systemschriften: Plakat & Handschrift ---------- */
  { n: 'Impact',                src: 'sys', cat: 'display', m: 'Geoffrey Lee, 1965', t: 'Extrem fett und schmal — die Schrift sämtlicher Bildmakros.' },
  { n: 'Comic Sans MS',         src: 'sys', cat: 'display', m: 'Vincent Connare, 1994', t: 'Für Sprechblasen einer Microsoft-Hilfe gezeichnet. Meistgehasst, meistbenutzt.' },
  { n: 'Papyrus',               src: 'sys', cat: 'display', m: 'Chris Costello, 1982', t: 'Rissige Ränder, unregelmäßige Kanten — die Pergament-Anmutung von der Stange.' },
  { n: 'Copperplate',           src: 'sys', cat: 'display', m: 'F. W. Goudy, 1901', t: 'Winzige Serifen an den Enden, reine Versalschrift — Visitenkarten-Klassiker.' },
  { n: 'Luminari',              src: 'sys', cat: 'display', m: 'Philip Bouwsma', t: 'Verspielte Renaissance-Anleihen mit ausschwingenden Bögen.' },
  { n: 'Herculanum',            src: 'sys', cat: 'display', m: 'Adrian Frutiger, 1990', t: 'Nach römischen Wandinschriften aus Herculaneum.' },
  { n: 'Brush Script MT',       src: 'sys', cat: 'script',  m: 'Robert E. Smith, 1942', t: 'Pinselschrift mit verbundenen Buchstaben — der Diner-Look.' },
  { n: 'Snell Roundhand',       src: 'sys', cat: 'script',  m: 'Matthew Carter, 1966', t: 'Nach dem Schreibmeister Charles Snell — englische Schreibschrift in Reinform.' },
  { n: 'Zapfino',               src: 'sys', cat: 'script',  m: 'Hermann Zapf, 1998', t: 'Kalligrafie mit riesigen Schwüngen, die weit über die Zeile hinausragen.' },
  { n: 'Bradley Hand',          src: 'sys', cat: 'script',  m: 'Richard Bradley, 1995', t: 'Nach der echten Handschrift ihres Zeichners digitalisiert.' },
  { n: 'Marker Felt',           src: 'sys', cat: 'script',  m: 'Apple', t: 'Filzstift auf Papier — dicke, leicht ausgefranste Striche.' },
  { n: 'Chalkboard SE',         src: 'sys', cat: 'script',  m: 'Apple', t: 'Kreide an der Tafel, weich und leicht wackelig.' },
  { n: 'Segoe Script',          src: 'sys', cat: 'script',  m: 'Microsoft', t: 'Locker verbundene Handschrift aus der Segoe-Familie.' },
  { n: 'Segoe Print',           src: 'sys', cat: 'script',  m: 'Microsoft', t: 'Handgedruckte Blockschrift, unverbunden.' },
  { n: 'Ink Free',              src: 'sys', cat: 'script',  m: 'Microsoft, 2017', t: 'Schnell hingeschriebene Notizschrift aus Windows 10.' },
  { n: 'Gabriola',              src: 'sys', cat: 'script',  m: 'John Hudson, 2008', t: 'Kalligrafische Schrift mit reichlich Zierschnörkeln.' },

  /* ---------- Google Fonts: Grotesk / Serifenlos ---------- */
  { n: 'Roboto',                src: 'google', cat: 'sans',  m: 'Christian Robertson, 2011', t: 'Androids Hausschrift — geometrisches Grundgerüst, humanistische Details.' },
  { n: 'Open Sans',             src: 'google', cat: 'sans',  m: 'Steve Matteson, 2011', t: 'Offene Formen, neutrale Anmutung — jahrelang die meistgenutzte Webschrift.' },
  { n: 'Lato',                  src: 'google', cat: 'sans',  m: 'Łukasz Dziedzic, 2010', t: '"Lato" heißt auf Polnisch "Sommer" — halbrunde Details wärmen die Grotesk.' },
  { n: 'Montserrat',            src: 'google', cat: 'sans',  m: 'Julieta Ulanovsky, 2011', t: 'Nach den Ladenschildern des Viertels Montserrat in Buenos Aires.' },
  { n: 'Poppins',               src: 'google', cat: 'sans',  m: 'Indian Type Foundry, 2014', t: 'Streng geometrisch, mit perfekt kreisrunden Punzen und einstöckigem "a".' },
  { n: 'Raleway',               src: 'google', cat: 'sans',  m: 'Matt McInerney, 2010', t: 'Erkennungsmerkmal: das "W" mit gekreuzten Mittelstrichen.' },
  { n: 'Nunito',                src: 'google', cat: 'sans',  m: 'Vernon Adams, 2011', t: 'Rundgelutschte Enden — die freundlichste Grotesk im Regal.' },
  { n: 'Inter',                 src: 'google', cat: 'sans',  m: 'Rasmus Andersson, 2016', t: 'Für Bildschirmoberflächen optimiert, hohe x-Höhe, sehr enge Anschlüsse.' },
  { n: 'Work Sans',             src: 'google', cat: 'sans',  m: 'Wei Huang, 2014', t: 'Auf mittlere Textgrößen im Web hin gezeichnet.' },
  { n: 'Rubik',                 src: 'google', cat: 'sans',  m: 'Hubert & Fischer, 2015', t: 'Leicht abgerundete Ecken, ursprünglich für ein Chrome-Cube-Projekt.' },
  { n: 'Karla',                 src: 'google', cat: 'sans',  m: 'Jonathan Pinhorn, 2012', t: 'Grotesk mit eigenwilligen, leicht schiefen Details.' },
  { n: 'Manrope',               src: 'google', cat: 'sans',  m: 'Mikhail Sharanda, 2018', t: 'Halb geometrisch, halb neogrotesk, mit konstanter Strichstärke.' },
  { n: 'Barlow',                src: 'google', cat: 'sans',  m: 'Jeremy Tribby, 2017', t: 'Leicht "rundgeschliffene" Grotesk, inspiriert von kalifornischen Verkehrsschildern.' },
  { n: 'Cabin',                 src: 'google', cat: 'sans',  m: 'Pablo Impallari, 2010', t: 'Angelehnt an Gill Sans, aber mit weicheren Kurven.' },
  { n: 'Quicksand',             src: 'google', cat: 'sans',  m: 'Andrew Paglinawan, 2008', t: 'Geometrisch mit auffällig runden Enden — wirkt fast wie aus Draht gebogen.' },
  { n: 'Josefin Sans',          src: 'google', cat: 'sans',  m: 'Santiago Orozco, 2010', t: 'Sehr niedrige x-Höhe im Geist der 1920er.' },
  { n: 'Fira Sans',             src: 'google', cat: 'sans',  m: 'Erik Spiekermann, 2013', t: 'Ursprünglich für Firefox OS entworfen.' },
  { n: 'PT Sans',               src: 'google', cat: 'sans',  m: 'ParaType, 2009', t: 'Teil eines russischen Staatsprojekts für öffentliche Schriften.' },
  { n: 'Titillium Web',         src: 'google', cat: 'sans',  m: 'Accademia di Urbino, 2009', t: 'Studienprojekt aus Italien mit technisch anmutenden Schnitten.' },
  { n: 'Exo 2',                 src: 'google', cat: 'sans',  m: 'Natanael Gama, 2013', t: 'Technoide Grotesk mit leicht abgeschrägten Ecken.' },
  { n: 'Oswald',                src: 'google', cat: 'sans',  m: 'Vernon Adams, 2011', t: 'Schmale Schrift in der Tradition der "Alternate Gothic".' },
  { n: 'Archivo Black',         src: 'google', cat: 'display', m: 'Omnibus-Type, 2012', t: 'Kräftige Grotesk für Schlagzeilen, angelehnt an amerikanische Gothics.' },
  { n: 'Anton',                 src: 'google', cat: 'display', m: 'Vernon Adams, 2011', t: 'Ultrafett und schmal — Plakatschrift für ganz große Überschriften.' },
  { n: 'Bebas Neue',            src: 'google', cat: 'display', m: 'Ryoichi Tsunekawa, 2010', t: 'Reine Versalschrift, hoch und schmal — kennt gar keine Kleinbuchstaben.' },

  /* ---------- Google Fonts: Antiqua / Serif ---------- */
  { n: 'Playfair Display',      src: 'google', cat: 'serif', m: 'Claus Eggers Sørensen, 2011', t: 'Klassizistisch mit hohem Kontrast — die Modemagazin-Schrift des Webs.' },
  { n: 'Merriweather',          src: 'google', cat: 'serif', m: 'Sorkin Type, 2010', t: 'Für Bildschirme gezeichnet: große x-Höhe, kräftige Serifen, offene Formen.' },
  { n: 'Lora',                  src: 'google', cat: 'serif', m: 'Cyreal, 2011', t: 'Kalligrafische Wurzeln, aber mit zeitgemäßem Strichkontrast.' },
  { n: 'EB Garamond',           src: 'google', cat: 'serif', m: 'Georg Duffner, 2011', t: 'Digitale Rekonstruktion nach Originalabzügen Claude Garamonds.' },
  { n: 'Libre Baskerville',     src: 'google', cat: 'serif', m: 'Impallari Type, 2012', t: 'Baskerville, für den Bildschirm verbreitert.' },
  { n: 'Crimson Text',          src: 'google', cat: 'serif', m: 'Sebastian Kosch, 2010', t: 'Für Buchsatz gezeichnet, im Geist alter Garamond-Schnitte.' },
  { n: 'Cormorant Garamond',    src: 'google', cat: 'serif', m: 'Christian Thalmann, 2015', t: 'Sehr feine Haarstriche — glänzt erst in großen Graden.' },
  { n: 'Vollkorn',              src: 'google', cat: 'serif', m: 'Friedrich Althausen, 2005', t: 'Deutsche Brotschrift im Wortsinn — kräftig und bodenständig.' },
  { n: 'Alegreya',              src: 'google', cat: 'serif', m: 'Juan Pablo del Peral, 2011', t: 'Für lange Lesetexte, mit bewusst unruhigem Rhythmus.' },
  { n: 'Bitter',                src: 'google', cat: 'slab',  m: 'Sol Matas, 2011', t: 'Slab-Serif fürs Lesen am Bildschirm, mit leicht kantigen Rundungen.' },
  { n: 'Arvo',                  src: 'google', cat: 'slab',  m: 'Anton Koovit, 2010', t: 'Geometrische Egyptienne mit klaren, rechtwinkligen Serifen.' },
  { n: 'Zilla Slab',            src: 'google', cat: 'slab',  m: 'Typotheque, 2017', t: 'Mozillas Hausschrift — Serifen mit abgeflachten Enden.' },
  { n: 'Roboto Slab',           src: 'google', cat: 'slab',  m: 'Christian Robertson, 2013', t: 'Robotos Skelett, mit rechteckigen Serifen versehen.' },
  { n: 'PT Serif',              src: 'google', cat: 'serif', m: 'ParaType, 2010', t: 'Der Serifen-Partner zur PT Sans, humanistisch geprägt.' },
  { n: 'Noto Serif',            src: 'google', cat: 'serif', m: 'Google, 2013', t: 'Teil des Projekts "No more Tofu" — Schrift für alle Sprachen der Welt.' },
  { n: 'Source Serif 4',        src: 'google', cat: 'serif', m: 'Frank Grießhammer, 2014', t: 'Adobes Open-Source-Antiqua, angelehnt an Fournier und Kis.' },
  { n: 'Cinzel',                src: 'google', cat: 'display', m: 'Natanael Gama, 2012', t: 'Nach römischen Kapitalis-Inschriften des 1. Jahrhunderts.' },
  { n: 'Abril Fatface',         src: 'google', cat: 'display', m: 'TypeTogether, 2011', t: 'Fette Didone im Stil viktorianischer Werbeplakate.' },

  /* ---------- Google Fonts: Schreibmaschine / Monospace ---------- */
  { n: 'Roboto Mono',           src: 'google', cat: 'mono',  m: 'Christian Robertson, 2015', t: 'Robotos Buchstabenformen auf feste Dickte gezwungen.' },
  { n: 'Space Mono',            src: 'google', cat: 'mono',  m: 'Colophon Foundry, 2016', t: 'Eigenwillige Monospace mit gebogenen Ausläufern — für Google Design entworfen.' },
  { n: 'IBM Plex Mono',         src: 'google', cat: 'mono',  m: 'Mike Abbink, 2017', t: 'IBMs Hausschrift mit Anleihen an die IBM Selectric.' },
  { n: 'Inconsolata',           src: 'google', cat: 'mono',  m: 'Raph Levien, 2006', t: 'Programmierschrift, inspiriert von Consolas — aber mit eigenem Charakter.' },
  { n: 'Source Code Pro',       src: 'google', cat: 'mono',  m: 'Paul D. Hunt, 2012', t: 'Adobes Code-Schrift mit besonders eindeutigen Ziffern.' },
  { n: 'JetBrains Mono',        src: 'google', cat: 'mono',  m: 'Philipp Nurullin, 2020', t: 'Erhöhte x-Höhe, damit Code auf kleinen Graden ruhig bleibt.' },
  { n: 'Cutive Mono',           src: 'google', cat: 'mono',  m: 'Vernon Adams, 2012', t: 'Alte Schreibmaschinen-Anmutung mit schweren Serifen.' },
  { n: 'Nanum Gothic Coding',   src: 'google', cat: 'mono',  m: 'Sandoll, 2010', t: 'Koreanische Coding-Schrift mit sehr sachlichen Lateinbuchstaben.' },

  /* ---------- Google Fonts: Plakat & Handschrift ---------- */
  { n: 'Lobster',               src: 'google', cat: 'script', m: 'Pablo Impallari, 2010', t: 'Fette Pinselschrift mit Schwung — das Café-Schild des Internets.' },
  { n: 'Pacifico',              src: 'google', cat: 'script', m: 'Vernon Adams, 2011', t: 'Surf-Kultur der 50er, mit Pinsel geschrieben.' },
  { n: 'Dancing Script',        src: 'google', cat: 'script', m: 'Pablo Impallari, 2011', t: 'Lebendige Schreibschrift, deren Buchstaben leicht auf und ab tanzen.' },
  { n: 'Great Vibes',           src: 'google', cat: 'script', m: 'TypeSETit, 2012', t: 'Feine Englische Schreibschrift mit langen Zierschwüngen.' },
  { n: 'Satisfy',               src: 'google', cat: 'script', m: 'Sideshow, 2011', t: 'Lockere Pinselschrift mit unregelmäßiger Grundlinie.' },
  { n: 'Caveat',                src: 'google', cat: 'script', m: 'Impallari Type, 2015', t: 'Handschrift wie mit dem Kugelschreiber ins Notizbuch geworfen.' },
  { n: 'Indie Flower',          src: 'google', cat: 'script', m: 'Kimberly Geswein, 2010', t: 'Rundliche Druckhandschrift mit dicken, weichen Strichen.' },
  { n: 'Shadows Into Light',    src: 'google', cat: 'script', m: 'Kimberly Geswein, 2010', t: 'Schmale, nach rechts geneigte Handschrift.' },
  { n: 'Permanent Marker',      src: 'google', cat: 'script', m: 'Font Diner, 2011', t: 'Dicker Filzstift auf Karton — Umzugskisten-Ästhetik.' },
  { n: 'Amatic SC',             src: 'google', cat: 'display', m: 'Vernon Adams, 2010', t: 'Extrem schmale, handgezeichnete Versalien.' },
  { n: 'Righteous',             src: 'google', cat: 'display', m: 'Astigmatic, 2011', t: 'Art-déco-Anleihen mit geschlossenen, geometrischen Formen.' },
  { n: 'Orbitron',              src: 'google', cat: 'display', m: 'Matt McInerney, 2009', t: 'Science-Fiction auf dem Raster — streng geometrisch, technoid.' },
  { n: 'Fredoka',               src: 'google', cat: 'display', m: 'Milena Brandão, 2011', t: 'Prall gerundete Formen, gerne für Kinderbücher und Spiele.' },
  { n: 'Alfa Slab One',         src: 'google', cat: 'display', m: 'Sorkin Type, 2011', t: 'Sehr fette Egyptienne im Stil alter Zirkusplakate.' }
];

/* Schriften der Bedienoberfläche — dürfen nie abgefragt werden,
   sonst wäre die Antwort auf jedem Knopf abzulesen. */
const UI_FONTS = ['Special Elite', 'Courier Prime'];

/* ------------------------------------------------------------
   Bekanntheit — steuert, welche Schriften in welcher
   Schwierigkeit vorkommen.

   1 = kennt praktisch jeder
   2 = begegnet einem regelmäßig im Web oder in Office
   3 = etwas für Leute, die sich mit Schriften beschäftigen

   Was hier nicht steht, gilt automatisch als Stufe 3.
   ------------------------------------------------------------ */
const BEKANNTHEIT = {
  1: [
    'Arial', 'Times New Roman', 'Comic Sans MS', 'Courier New', 'Impact',
    'Georgia', 'Verdana', 'Helvetica', 'Calibri', 'Papyrus', 'Tahoma',
    'Trebuchet MS', 'Segoe UI', 'Brush Script MT', 'Arial Black', 'Futura',
    'Garamond', 'Century Gothic',
    'Roboto', 'Open Sans', 'Montserrat', 'Lato', 'Oswald', 'Poppins',
    'Lobster', 'Pacifico', 'Bebas Neue', 'Playfair Display', 'Anton',
    'Permanent Marker', 'Indie Flower', 'Dancing Script', 'Orbitron',
    'Amatic SC', 'Inter', 'Merriweather', 'Roboto Mono', 'Alfa Slab One'
  ],
  2: [
    'Palatino Linotype', 'Palatino', 'Book Antiqua', 'Baskerville', 'Didot',
    'Cambria', 'Consolas', 'Monaco', 'Menlo', 'Lucida Console', 'Lucida Grande',
    'Gill Sans', 'Optima', 'Avenir', 'Rockwell', 'Copperplate',
    'Bookman Old Style', 'Franklin Gothic Medium', 'Arial Narrow',
    'Segoe Script', 'Segoe Print', 'Marker Felt', 'Chalkboard SE',
    'Bradley Hand', 'Zapfino', 'Snell Roundhand', 'Geneva', 'Bahnschrift',
    'Ink Free',
    'Raleway', 'Nunito', 'Quicksand', 'Josefin Sans', 'Fira Sans', 'PT Sans',
    'PT Serif', 'Source Code Pro', 'JetBrains Mono', 'Inconsolata',
    'Space Mono', 'IBM Plex Mono', 'Roboto Slab', 'Lora', 'EB Garamond',
    'Libre Baskerville', 'Cormorant Garamond', 'Crimson Text', 'Abril Fatface',
    'Cinzel', 'Great Vibes', 'Satisfy', 'Caveat', 'Shadows Into Light',
    'Righteous', 'Fredoka', 'Archivo Black', 'Barlow', 'Rubik', 'Work Sans',
    'Titillium Web', 'Exo 2', 'Noto Serif', 'Bitter', 'Arvo', 'Cutive Mono',
    'Cabin', 'Karla', 'Manrope'
  ]
};

/** Bekanntheitsstufe einer Schrift (1–3). */
function bekanntheitVon(name) {
  if (BEKANNTHEIT[1].includes(name)) return 1;
  if (BEKANNTHEIT[2].includes(name)) return 2;
  return 3;
}

/* Menschenlesbare Namen der Schriftfamilien-Gattungen */
const CATEGORY_LABELS = {
  sans:    'Grotesk',
  serif:   'Antiqua',
  slab:    'Egyptienne',
  mono:    'Schreibmaschine',
  display: 'Plakatschrift',
  script:  'Schreibschrift'
};
