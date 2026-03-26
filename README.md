# SlashDot OS — 25MS Batch

> A browser-based OS simulator built for the Inter-Batch Website Development Competition 2026.
> Organized by SlashDot Programming & Design Club, IISER Kolkata.

[![Deploy](https://github.com/berasankhadeep20-lang/Interbatch-Coding-2026-25MS/actions/workflows/deploy.yml/badge.svg)](https://github.com/berasankhadeep20-lang/Interbatch-Coding-2026-25MS/actions)

**Live Site:** https://berasankhadeep20-lang.github.io/Interbatch-Coding-2026-25MS/

---

## What is this?

SlashDot OS turns the SlashDot club website into a fake operating system running entirely in your browser. Navigate using a real terminal emulator (xterm.js) or click desktop icons — every section of the site is an app you can open, move, and minimize like a real OS window.

## Features

- Full terminal emulator with command history, tab-complete, Ctrl+C, Ctrl+L
- Draggable, stackable, maximizable app windows
- Boot sequence with BIOS screen and kernel log animation
- Virtual filesystem — `ls`, `cd`, `cat`, `pwd` all work
- Live clock in taskbar
- Right-click context menu on desktop
- Floating particle background with connection lines
- CRT scanline overlay for authentic retro feel
- Mobile support — full-screen terminal with bottom navigation
- Sound effects with mute toggle
- Screensaver — Matrix rain after 60s idle
- Theme switcher — green, amber, blue, red, purple
- Fullscreen toggle from terminal
- Maximize/restore windows by clicking the green button or double-clicking the title bar

### All 5 Mandatory Pages
- Homepage — `open home`
- About / Concept — `open about`
- Tech Stack — `open stack`
- Team — `open team`
- Contact — `open contact`

### Terminal Commands
```
help              → all commands
ls / cd / cat     → navigate virtual filesystem
neofetch          → system info + logos
whoami            → user info
uname -a          → OS info
date              → current date/time
ping <host>       → ping a host
history           → command history
fullscreen        → enter fullscreen
theme <name>      → switch terminal theme
top               → fake process manager
weather           → IISER Kolkata campus weather
members           → SlashDot club office bearers
clear             → clear terminal
```

### Easter Eggs
```
sudo party              → confetti explosion
matrix                  → matrix rain effect
vim about.txt           → fake vim editor
apt install <pkg>       → fake package manager
ssh batch@iiserkol      → fake SSH into IISER server
cowsay <text>           → a cow says things
sl                      → steam locomotive
fortune                 → random programming quote
procrastinate           → fake SlashTube
sudo give me marks      → perfect grades
sudo make me a sandwich → xkcd reference
sudo make me a cgpa     → perfect 10.0 CGPA
theme green/amber/blue  → change terminal theme
```

## Tech Stack

| Tool | Purpose |
|------|---------|
| React 18 + TypeScript | UI framework |
| Vite 5 | Build tool |
| xterm.js 5.5 | Terminal emulator |
| Framer Motion 11 | Window animations |
| Web Audio API | Sound effects |
| GitHub Actions | CI/CD |
| GitHub Pages | Deployment |

## Quick Start
```bash
git clone https://github.com/berasankhadeep20-lang/Interbatch-Coding-2026-25MS.git
cd Interbatch-Coding-2026-25MS/slashdot-os
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

No backend required — pure static frontend.

## Project Structure
```
slashdot-os/
├── public/
│   ├── iiserkol_logo.png
│   └── slashdot_logo.png
├── src/
│   ├── components/
│   │   ├── Boot/         ← Boot sequence
│   │   ├── Desktop/      ← Desktop, taskbar, particles, easter eggs
│   │   ├── Terminal/     ← xterm.js terminal
│   │   ├── WindowManager/← Draggable windows
│   │   └── Apps/         ← All 5 mandatory pages
│   ├── commands/         ← All terminal commands
│   ├── data/             ← Team, tech stack, filesystem data
│   ├── hooks/            ← useWindowManager, useBootSequence
│   ├── types/            ← TypeScript types
│   └── utils/            ← ASCII art, formatting, sounds
├── .github/workflows/    ← GitHub Actions CI/CD
└── README.md
```

## Team

| Name | Role | Batch |
|------|------|-------|
| Sankhadeep Bera | Lead Developer | 25MS |

## Deployment

Auto-deploys to GitHub Pages via GitHub Actions on every push to `main`.
```bash
npm run build
# dist/ folder is deployed automatically
```

## License

MIT — see [LICENSE](./LICENSE)

---

*SlashDot Programming & Design Club — IISER Kolkata*
*Inter-Batch Website Development Competition 2026*