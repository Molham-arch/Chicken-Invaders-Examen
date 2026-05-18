# Logboek Chicken Invaders Examen

## Vrijdag 15 mei 2026

**Werk:** Examenopdracht bekeken en gekozen voor een Chicken Invaders stijl game. Eerste idee gemaakt: een ruimteschip schiet op vijandelijke kippen, met score, health, timer en twee levels.

**Keuze:** Ik bouw de game in HTML, CSS en JavaScript, omdat ik deze later makkelijk met Electron als Windows `.exe` kan maken.

**Resultaat:** Game concept bepaald en begonnen met de voorbereiding.

**Volgende stap:** Game Design Document invullen en assets verzamelen.

## Zaterdag 16 mei 2026

**Werk:** Game Design Document ingevuld op basis van de schooltemplate. Project sketch gemaakt in simpele pen-stijl. Unity-assets bekeken en gekozen welke sprites/audio bruikbaar zijn voor de webgame.

**Keuze:** Ik gebruik lokale assets voor spaceship, chicken, bullets, eggs, background en audio.

**Resultaat:** Bespreekversie van het GDD staat klaar in `docs/`.

**Volgende stap:** Projectstructuur maken en eerste werkende gameversie bouwen.

## Zondag 17 mei 2026

**Werk:** Git repository aangemaakt en gekoppeld aan GitHub. Project voorbereid voor versiebeheer. `.gitignore`, logboek en ontwikkelomgeving-document toegevoegd.

**Keuze:** `node_modules` en `dist` worden niet gecommit, omdat dit gegenereerde bestanden zijn. De broncode, assets, documentatie en package files worden wel gecommit.

**Resultaat:** Eerste Git commit kan gemaakt worden met project setup, basiscode, assets en documentatie.

**Volgende stap:** Game verder opdelen in duidelijke commits: player movement, shooting, enemies, UI, levels, testing en final polish.

## Maandag 18 mei 2026

**Werk:** Player movement toegevoegd aan de starter game. De speler kan nu bewegen met WASD en de pijltjestoetsen.

**Keuze:** Ik heb de beweging begrensd binnen het speelveld, zodat het ruimteschip niet buiten het scherm kan gaan. Diagonale beweging is genormaliseerd, zodat de speler niet sneller beweegt wanneer twee toetsen tegelijk worden ingedrukt.

**Resultaat:** Het ruimteschip kan bestuurd worden in het onderste deel van het scherm. Dit past bij de backlog-eis dat de speler de game of karakters moet kunnen besturen.

**Volgende stap:** Shooting system toevoegen, zodat de speler kogels kan afvuren.
