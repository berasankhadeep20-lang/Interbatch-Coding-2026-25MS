# SlashDot OS — 25MS Batch

> A browser-based OS simulator built for the Inter-Batch Website Development Competition 2026.
> Organized by SlashDot Programming & Design Club, IISER Kolkata.

[![Deploy](https://github.com/YOUR_USERNAME/slashdot-os/actions/workflows/deploy.yml/badge.svg)](https://github.com/YOUR_USERNAME/slashdot-os/actions)

**Live Site:** https://YOUR_USERNAME.github.io/slashdot-os/

---

## What is this?

SlashDot OS turns the SlashDot club website into a fake operating system running entirely in your browser. Navigate using a real terminal emulator (xterm.js) or click desktop icons — every section of the site is an "app" you can open, move, and minimize like a real OS window.

## Features

- Full terminal emulator with `help`, `ls`, `cd`, `cat`, `neofetch`, and more
- Draggable, stackable app windows
- Boot sequence with BIOS screen and kernel log animation  
- Virtual filesystem you can navigate with `ls` / `cd` / `cat`
- Command history (up/down arrows), tab autocomplete
- Easter eggs: `sudo party`, `matrix`, `sl`, `cowsay`, `fortune`
- CRT scanline overlay for authentic retro feel
- All 5 mandatory pages: Home, About, Team, Tech Stack, Contact

## Tech Stack

| Tool | Purpose |
|------|---------|
| React 18 + TypeScript | UI framework |
| Vite 5 | Build tool |
| xterm.js 5.3 | Terminal emulator |
| Framer Motion 11 | Window animations |
| GitHub Actions | CI/CD |
| GitHub Pages | Deployment |

## Quick Start

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/slashdot-os.git
cd slashdot-os

# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

No backend required — pure static frontend.

## Deployment

The site auto-deploys to GitHub Pages via GitHub Actions on every push to `main`.

For manual deploy:
```bash
npm run build
# Upload ./dist to any static host (Vercel, Netlify, GitHub Pages, etc.)
```

> **Note:** Update `base` in `vite.config.ts` to match your GitHub repo name before deploying.

## Team

Built by the **25MS Batch**, IISER Kolkata for the Inter-Batch Website Development Competition 2026.

| Name | Role |
|------|------|
| Your Name | Lead Developer |
| Teammate 2 | UI/UX |
| Teammate 3 | Content |

## License

MIT — see [LICENSE](./LICENSE)

---

*SlashDot Programming & Design Club — IISER Kolkata*
