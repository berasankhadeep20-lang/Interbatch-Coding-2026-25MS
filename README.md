# SlashDot OS — 25MS Batch

> A browser-based OS simulator built for the Inter-Batch Website Development Competition 2026.
> Organized by SlashDot Programming & Design Club, IISER Kolkata.

[![Deploy](https://github.com/berasankhadeep20-lang/Interbatch-Coding-2026-25MS/actions/workflows/deploy.yml/badge.svg)](https://github.com/berasankhadeep20-lang/Interbatch-Coding-2026-25MS/actions)

**Live Site:** https://berasankhadeep20-lang.github.io/Interbatch-Coding-2026-25MS/

---

## What is this?

SlashDot OS turns the SlashDot club website into a fake operating system running entirely in your browser. Navigate using a real terminal emulator (xterm.js) or click desktop icons — every section of the site is an app you can open, move, and minimize like a real OS window.

---

## Features

### OS Core
- Full terminal emulator with command history, tab-complete, Ctrl+C, Ctrl+L
- Execute standard C binaries (RV32IMAF) directly in-browser.
- `initramfs` loaded via WASM, supporting `ls`, `cat`, `mkdir`, and `top`.
- Draggable, stackable, maximizable app windows using a custom DOM factory.
- Boot sequence with BIOS screen and animated ASCII art (WIP).
- Live clock in taskbar
- Right-click context menu on desktop
- Draggable desktop icons — 25+ icons in a clean grid
- Floating particle background with connection lines
- CRT scanline overlay for authentic retro feel
- Animated desktop background with glowing blobs
- IISER Kolkata + SlashDot logos on desktop corners
- Mobile support — full-screen terminal with bottom navigation
- Sound effects with mute toggle in taskbar
- Screensaver — Matrix rain after 60s idle
- Theme switcher — green, amber, blue, red, purple
- Fullscreen toggle from terminal
- Maximize/restore windows by clicking green button or double-clicking title bar
- **Ctrl+K Command Palette** — fuzzy search all commands and apps instantly
- **Toast notification system** — popups in top-right corner
- **Achievement system** — 25 unlockable achievements

### All 5 Mandatory Pages
- Homepage — `open home`
- About / Concept — `open about`
- Tech Stack — `open stack`
- Team — `open team`
- Contact — `open contact`

### Games
- **Asteroids** — shoot asteroids, 3 lives, levels get harder (arrow keys + space)
- **Pong** — 2 player, first to 7 wins (P1: W/S, P2: ↑/↓)
- **Flappy { }** — Flappy Bird with brackets, space to flap
- **Dungeon Crawler** — ASCII roguelike, WASD to move, bump enemies to attack, find the stairs
- **Conway's Game of Life** — click cells, presets, random fill
- **Typing Speed Test** — WPM, accuracy, random passages

### Science Apps
- **Periodic Table** — click elements for info, search by name/symbol/number
- **Fourier Visualizer** — square/sawtooth/triangle waves, adjustable harmonics
- **Gravity Simulator** — N-body gravity, drag planets, add bodies
- **DNA Viewer** — sequence animation, codon translation, GC content
- **Graph Plotter** — plot any f(x), 8 presets, adjustable x range
- **Physics Simulator** — projectile motion, SHM, wave superposition
- **Molecular Viewer** — spinning 3D molecules (H₂O, CO₂, CH₄, C₆H₆ and more)
- **Matrix Calculator** — multiply, add, transpose, determinant, inverse

### Social / Fun Apps
- **Guestbook** — visitors leave messages (stored in session)
- **Poll** — 3 community polls with live voting
- **Joke Generator** — programming, science, IISER, math jokes
- **SlashDot AI** — fake AI chatbot that actually responds

---

## Terminal Commands
```bash
help              → all commands
ls / cd / cat     → navigate virtual filesystem
neofetch          → system info + logos
whoami            → user info
uname -a          → OS info
date              → current date/time
ping <host>       → ping a host
history           → command history
man <command>     → manual pages
fullscreen        → enter fullscreen
exit-fullscreen   → exit fullscreen
toggle-fullscreen → toggle fullscreen
clear             → clear terminal
uptime            → system uptime
cal               → current month calendar
tree              → file system tree
echo <text>       → print text
banner <text>     → big ASCII text
stats             → session statistics
setname <name>    → set your username (remembered on next visit)
visits            → live visitor counter
rain on/off       → toggle desktop rain effect
weather           → live weather from Open-Meteo API (real data!)
reset             → reset terminal
```

## Terminal Customization
```bash
cursor block/bar/underline  → change cursor style
theme green/amber/blue/red/purple → switch theme
font+                       → increase font size
font-                       → decrease font size
crt on/off                  → toggle CRT scanlines
wallpaper <name>            → change desktop background
```

## Apps
```bash
open home         → Homepage
open about        → About page
open team         → Team roster
open stack        → Tech stack
open contact      → Contact info
open clock        → Live clock with unix time
open asteroids    → Asteroids game
open pong         → Pong (2 player)
open typing       → Typing speed test
open periodic     → Interactive periodic table
open fourier      → Fourier transform visualizer
open gravity      → N-body gravity simulator
open dna          → DNA sequence viewer + translator
open grapher      → Mathematical function plotter
open physics      → Physics simulator
open molecular    → Molecular viewer (3D spinning)
open matrix-calc  → Matrix calculator
open guestbook    → Sign the guestbook
open poll         → Community voting polls
open jokes        → Random joke generator
open slashdotai   → Chat with SlashDot AI
open achievements → View achievements
open flappy       → Flappy { } game
open dungeon      → ASCII dungeon crawler RPG
open gameoflife   → Conway's Game of Life
```

## Easter Eggs (50+ hidden commands)
```bash
sudo party                     → confetti explosion
matrix                         → matrix rain effect
hack                           → fake hacking sequence
nyan                           → nyan cat
vim about.txt                  → fake vim editor
apt install <pkg>              → fake package manager
npm install                    → 999 packages, 3 vulnerabilities
ssh batch@iiserkol             → fake SSH into IISER server
git log                        → fake commit history
git blame                      → blame someone for bugs
git status                     → show working tree status
git push                       → fake push to GitHub
ls -la                         → hidden files revealed
cat /etc/passwd                → fake password file
import antigravity             → Python easter egg
sudo chmod 777 life            → full permissions to life
curl iiserkol.ac.in            → WiFi always fails
sudo apt-get install iiser-wifi → WiFi never installs
./run_exam.sh                  → fake exam paper
exam <subject>                 → subject-specific exam
cowsay <text>                  → a cow says things
sl                             → steam locomotive
fortune                        → random programming quote
quote                          → random IISER quote
procrastinate                  → fake SlashTube
weather                        → IISER campus weather
top                            → fake process manager
members                        → SlashDot office bearers
changelog                      → fake OS changelog
panic                          → kernel panic screen
reboot                         → recover from panic
leetcode                       → daily challenge
iiser wifi                     → ping test (always fails)
sudo give me marks             → perfect grades
sudo give me a job             → job offers from Google etc
sudo make me a sandwich        → xkcd reference
sudo make me coffee            → coffee brewing animation
sudo make me a cgpa            → perfect 10.0 CGPA
yes                            → spams yes
banner <text>                  → big ASCII banner
echo <text>                    → prints text
sudo give me a cgpa            → perfect 10.0 CGPA
clippy                         → summon Clippy the assistant
```

## Keyboard Shortcuts
```
Ctrl+K            → Command Palette (search all commands/apps)
Ctrl+C            → Cancel current terminal input
Ctrl+L            → Clear terminal
↑ / ↓             → Terminal command history
Tab               → Autocomplete command
Double-click icon → Open app
Double-click titlebar → Maximize/restore window
```

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| Vanilla TypeScript | High-performance core logic |
| Vite 5 | Build tool & Dev server |
| xterm.js 5.5 | High-fidelity terminal emulator |
| Emscripten | RISC-V core cross-compilation (WASM) |
| Web Audio API | Low-latency sound effects |
| Canvas API | Graphics-intensive games & visualizers |
| GitHub Actions | Automated CI/CD deployment |
| GitHub Pages | Global static hosting |

---

## Quick Start
```bash
git clone https://github.com/berasankhadeep20-lang/Interbatch-Coding-2026-25MS.git
cd Interbatch-Coding-2026-25MS/slashdot-os
npm install
npm run dev
```

Open http://localhost:5173 in your browser. No backend required — pure static frontend.

---

## Project Structure
```
slashdot-os/
├── public/
│   ├── os/                ← Compiled RISC-V WASM core
│   ├── initramfs.zip      ← Virtual disk with ELF binaries
│   └── slashdot_logo.png
├── src/
│   ├── components/
│   │   ├── Desktop/       ← Desktop icons, taskbar, clippy
│   │   ├── Terminal/      ← xterm.js + WASM input handling
│   │   ├── WindowManager/ ← Custom draggable window system
│   │   └── Apps/          ← JS apps
│   ├── framework/         ← framework
│   ├── emulator-module/   ← Emulator JS loader hooks
│   ├── data/              ← Static team & tech data
│   ├── types/             ← Shared TypeScript definitions
│   └── utils/             ← Core logic (sounds, formatting)
├── emulator/              ← C source for the RISC-V core
└── README.md
```

---

## Team

| Name | Role | Batch | Email |
|------|------|-------|-------|
| Sankhadeep Bera | Lead Developer | 25MS | sb25ms227@iiserkol.ac.in |
| S. Bari | Lead Developer | 25MS | shayan.bari.0001@gmail.com |

---

## SlashDot Club — Office Bearers

| Name | Batch | Email |
|------|-------|-------|
| Shuvam Banerji Seal | 22MS | sbs22ms076@iiserkol.ac.in |
| Anuprovo Debnath | 23MS | ad23ms110@iiserkol.ac.in |
| Abhinav Dhingra | 24MS | ad24ms110@iiserkol.ac.in |

---

## Deployment

Auto-deploys to GitHub Pages via GitHub Actions on every push to `main`.
```bash
npm run build
# dist/ is deployed automatically via .github/workflows/deploy.yml
```

---

## License

GNU GPLv3 — see [LICENSE](./LICENSE)

---

*SlashDot Programming & Design Club — IISER Kolkata*
*Inter-Batch Website Development Competition 2026*