# 🐔 Chicken Invaders - Exam Edition

A small HTML/CSS/JavaScript arcade game made for the game development exam project.

Developed by **Molham Alam**.

## 🎮 Features

- 2 playable levels
- Level-select screen with locked future levels
- Score, health, timer, pause, win and game-over screens
- Chicken enemies, falling eggs, shooting and collisions
- Power-up drop with triple shot for a short time
- Sound effects, background music, volume setting and difficulty setting
- Electron support so the game can run as a Windows `.exe`

## 🕹️ Controls

- Move: `WASD`, arrow keys, mouse, or touch
- Shoot: `Space` or hold mouse/touch on the game screen
- Pause/Menu: `P` or `Esc`
- Electron fullscreen toggle: `F11`

## 📦 Install From GitHub

Clone the repository:

```powershell
git clone https://github.com/Molham-arch/Chicken-Invaders-Examen.git
```

Go into the project folder:

```powershell
cd Chicken-Invaders-Examen
```

Install dependencies:

```powershell
npm install
```

## 🌐 Run In Browser

Open `index.html` directly in a browser.

## 🖥️ Run With Electron

Start the desktop app:

```powershell
npm start
```

The Electron app opens in fullscreen.

## 🧱 Build The `.exe`

Build a portable Windows executable:

```powershell
npm run build:exe
```

The output will be created in the `dist` folder.

Build an installer:

```powershell
npm run build:installer
```

## 🚀 Download Installer From GitHub Release

The easiest way to test the game is to download the installer from the GitHub Release page.

Steps:

1. Open the GitHub repository.
2. Go to `Releases`.
3. Open the latest release, for example `v1.0.0`.
4. Download `Chicken-Invaders-Exam-Edition-Setup.exe`.
5. Run the setup and start the game.

This option does not require `npm install` or opening the source code.

## 📁 Project Structure

```text
web-game/
├── assets/
│   ├── audio/
│   ├── sprites/
│   └── Bijlage 2 - Logos/
├── docs/
├── electron-main.js
├── game.js
├── index.html
├── styles.css
├── package.json
└── README.md
```

## 🛠️ Handover For Further Development

The main game logic is in `game.js`. This file contains the game state, player movement, shooting, enemies, collisions, levels, power-ups, menu flow and difficulty settings. The layout is in `index.html`, and the visual style of the menus/buttons is in `styles.css`. Electron starts the desktop version through `electron-main.js`.

A new engineer can continue by first running the browser version with `index.html` and then testing the desktop version with `npm start`. New sprites or sounds should be added inside `assets/`. Extra levels can be added by extending the level-select menu in `index.html` and updating the enemy wave logic in `createEnemyWave()` in `game.js`.

Good next improvements are: more levels, a boss enemy, better animations, a local high-score screen, extra power-ups, and a settings screen with more options. The current `Could` and `Would` backlog items are not implemented yet and can be used as future tasks, such as an online scoreboard or multiplayer.
