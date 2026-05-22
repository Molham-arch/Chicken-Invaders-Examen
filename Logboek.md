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

## Dinsdag 19 mei 2026

**Werk:** Shooting system toegevoegd. De speler kan nu met de spatiebalk kogels afvuren vanaf het ruimteschip.

**Keuze:** Ik heb een cooldown toegevoegd, zodat de speler niet onbeperkt veel kogels tegelijk kan spammen. Kogels bewegen omhoog en worden automatisch verwijderd wanneer ze uit beeld zijn.

**Resultaat:** De speler kan nu bewegen en schieten. Dit is de basis voor het aanvallen van vijanden in de volgende stap.

**Volgende stap:** Enemy waves toevoegen, zodat er echte doelen zijn om op te schieten.

## Woensdag 20 mei 2026

**Werk:** Enemy wave toegevoegd. De kippen worden nu als echte enemy objects aangemaakt wanneer de game start.

**Keuze:** Ik heb de vijanden als een groep laten bewegen van links naar rechts. Wanneer de groep de rand van het scherm raakt, draaien de vijanden om en zakken ze een klein stukje naar beneden.

**Resultaat:** De game heeft nu bewegende vijanden in plaats van alleen een statische preview. Dit is de basis voor collisions en score.

**Volgende stap:** Collision detection toevoegen tussen bullets en enemies, zodat de speler kippen kan raken.

## Donderdag 21 mei 2026

**Werk:** Collision detection toegevoegd tussen bullets en enemies. Wanneer een kogel een kip raakt, verdwijnen de kogel en de kip.

**Keuze:** Ik gebruik eenvoudige rectangle-collision op basis van de positie en afmetingen van objecten. Dit is duidelijk en past goed bij deze 2D canvas game.

**Resultaat:** De speler kan nu vijanden raken en krijgt scorepunten per geraakte kip. De score in de HUD verandert tijdens het spelen.

**Volgende stap:** Win- en lose-states toevoegen, zodat de speler echt kan winnen of verliezen.

## Vrijdag 22 mei 2026

**Werk:** Win- en lose-states toegevoegd. De speler wint wanneer alle kippen zijn geraakt en verliest wanneer de timer op 0 komt.

**Keuze:** Ik heb een simpele game state gebruikt met `menu`, `playing`, `won` en `lost`. De startknop wordt ook gebruikt om opnieuw te starten na winst of verlies.

**Resultaat:** De game heeft nu een duidelijk begin, speelstatus, win condition, lose condition en restart mogelijkheid. Dit vult meerdere Must-eisen uit de backlog in.

**Volgende stap:** Health en vijandelijke eieren toevoegen, zodat de speler ook door vijanden geraakt kan worden.

## Zaterdag 23 mei 2026

**Werk:** Vijandelijke eieren en health damage toegevoegd. Kippen kunnen nu eieren naar beneden laten vallen en de speler verliest health wanneer hij geraakt wordt.

**Keuze:** Ik gebruik dezelfde rectangle-collision aanpak als bij bullets en enemies. Na een hit krijgt de speler kort invincibility, zodat health niet direct meerdere keren tegelijk omlaag gaat.

**Resultaat:** Health heeft nu echte gameplay-betekenis. De speler kan winnen door alle kippen te raken en verliezen door tijd of door health op 0.

**Planning aangepast:** Ik wil zondag de basisversie afronden. Vanaf maandag tot vrijdag werk ik aan kleinere upgrades, zoals volume/difficulty settings, Electron fullscreen, een level-select scherm met locked levels en polish voor de presentatie.

**Volgende stap:** Basisversie afronden met level 1 en level 2, zodat de Musts en Shoulds duidelijker zichtbaar zijn.
