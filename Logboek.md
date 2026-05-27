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

## Zondag 24 mei 2026

**Werk:** Level progression toegevoegd. Na het uitspelen van level 1 start nu automatisch level 2.

**Keuze:** Level 2 heeft meer kippen, twee rijen vijanden, snellere beweging en sneller vallende eieren. Daardoor wordt de game moeilijker en voldoet de game ook aan de Should-eis dat de moeilijkheid oploopt.

**Resultaat:** De basisversie heeft nu twee levels. De speler wint pas wanneer level 2 volledig is gehaald.

**Volgende stap:** Vanaf maandag werk ik aan kleine upgrades en polish, zoals volume/difficulty settings, Electron fullscreen en een level-select scherm.

## Maandag 25 mei 2026

**Werk:** Menu en polish verbeterd. Er is een startmenu gemaakt met aparte schermen voor level select en options. Level 1 en level 2 zijn speelbaar en de overige levels staan als locked tiles klaar voor later. Ook zijn volume, difficulty, power-up triple shot, pauzeren met `P`/`Esc`, muis/touch-besturing en Electron fullscreen toegevoegd of verbeterd.

**Keuze:** Ik heb de options niet als dropdown onder het hoofdmenu gelaten, maar als eigen scherm gemaakt. Dit ziet netter uit en past beter bij het level-select menu. Difficulty is simpel gehouden: op Easy bewegen kippen rustiger en vallen er minder eieren, op Hard bewegen kippen sneller en vallen er meer eieren.

**Resultaat:** De game voelt meer als een complete app: de speler kan levels kiezen, instellingen aanpassen, met keyboard/muis/touch spelen en de Electron-versie opent fullscreen. De README is bijgewerkt met installatie, controls, run-instructies en build-stappen.

**Volgende stap:** Testen of alles goed werkt in browser en Electron. Daarna kleine bugs oplossen.

## Dinsdag 26 mei 2026

**Werk:** Gesprek gehad met mevrouw Jacobs over de voortgang van de game. Ik heb de huidige versie laten zien met het startmenu, level select, options, twee levels, score, health, timer en de Electron-aanpak.

**Feedback:** Het gesprek ging goed en mevrouw Jacobs was enthousiast over de voortgang. Er zijn nog een paar punten om te verbeteren, zoals de slogan duidelijk terugzetten in de game en paar kleine bugs oplossen.

**Resultaat:** De richting van de game is goedgekeurd voor de laatste fase. Ik weet nu welke polish-punten ik nog moet afronden voor het inleveren.

**Volgende stap:** Op donderdag is er nog een laatste gesprek voor de inlevering. Voor die tijd werk ik aan de slogan, kleine bugfixes, laatste tests in browser/Electron en de presentatiebestanden.



## Testverslagen

### Testverslag 1 - Zondag 24 mei 2026, 13:20

**Tester:** Mohammed

**Wat is getest:** Browser-versie van de game met level 1, level 2, score, health, timer, shooting, enemy eggs en power-up.

**Bevindingen gebruiker:** Mohammed vond de game leuk en duidelijk speelbaar. Hij vond vooral het schieten en de power-up goed werken. Zijn feedback was dat de game iets moeilijker mocht worden, omdat level 1 redelijk makkelijk was wanneer je eenmaal wist hoe je moest bewegen.

**Verbetering na de test:** De difficulty-instelling is duidelijker gemaakt. Op `Hard` bewegen de kippen sneller en laten ze vaker eieren vallen. Hierdoor kan de speler zelf kiezen of de game makkelijker of moeilijker moet zijn.

### Testverslag 2 - Maandag 25 mei 2026, 14:05

**Tester:** Abdullah

**Wat is getest:** Menu, level-select scherm, options scherm, keyboard-besturing, muis/touch-besturing en pause met `P`/`Esc`.

**Bevindingen gebruiker:** Abdullah vond het menu overzichtelijker nadat level select en options aparte schermen kregen. Hij merkte op dat de slogan en developer-credit duidelijk zichtbaar moesten blijven, omdat dit belangrijk is voor de presentatie. Ook gaf hij aan dat muisbesturing handig is, maar dat de speler goed binnen het scherm moet blijven.

**Verbetering na de test:** De slogan `Wij lanceren je de toekomst in!` is teruggezet in het menu en in de game. `Developed by Molham Alam` is rechtsboven in de menu-card toegevoegd. De muis/touch-besturing is begrensd binnen het speelveld, zodat het ruimteschip niet buiten beeld kan bewegen.

### Testverslag 3 - Dinsdag 26 mei 2026, 10:15

**Tester:** Mevrouw Jacobs

**Wat is getest:** Voortgang van het project, game concept, menu, levels, documentatie en planning richting inlevermoment.

**Bevindingen gebruiker:** Mevrouw Jacobs was enthousiast over de voortgang en vond dat de game al duidelijk richting een complete examenversie ging. De belangrijkste feedback was om de laatste polish goed af te ronden, de slogan netjes zichtbaar te maken en kleine bugs voor de inlevering op te lossen.

**Verbetering na de test:** De feedback is verwerkt in de planning. Voor donderdag staat nog een laatste gesprek gepland voor de inlevering. Tot die tijd werk ik aan laatste bugfixes, testen in browser/Electron en het netjes maken van de presentatiebestanden.
