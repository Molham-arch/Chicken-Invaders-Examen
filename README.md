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

