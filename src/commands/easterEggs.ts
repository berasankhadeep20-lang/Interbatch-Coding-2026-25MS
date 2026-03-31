import { type CommandHandler, type CommandResult } from '../types'
import { c } from '../utils/formatOutput'

export const easterEggs: Record<string, CommandHandler> = {

  'sudo party': (): CommandResult => ({
    output: `\r\n${c.yellow}🎉 PARTY MODE ACTIVATED${c.reset}\r\n${c.magenta}Launching confetti cannon...${c.reset}\r\n`,
    action: { type: 'easter_egg', effect: 'confetti' },
  }),

  matrix: (): CommandResult => ({
    output: `\r\n${c.green}Entering the Matrix...${c.reset}\r\n`,
    action: { type: 'easter_egg', effect: 'matrix' },
  }),

  sl: (): CommandResult => ({
    output: [
      '',
      `${c.yellow}      ====        ________                ___________${c.reset}`,
      `${c.yellow}  _D _|  |_______/        \\__I_I_____===__|_________|${c.reset}`,
      `${c.yellow}   |(_)---  |   H\\________/ |   |        =|___ ___|${c.reset}`,
      `${c.yellow}   /     |  |   H  |  |     |   |         ||_| |_||${c.reset}`,
      `${c.yellow}  |      |  |   H  |__--------------------| [___] |${c.reset}`,
      `${c.yellow}  | ________|___H__/__|_____/[][]~\\_______|       |${c.reset}`,
      `${c.yellow}  |/ |   |-----------I_____I [][] []  D   |=======|__${c.reset}`,
      `${c.cyan}__/ =| o |=-~~\\  /~~\\  /~~\\  /~~\\ ____Y___________|__${c.reset}`,
      `${c.cyan} |/-=|___|=    ||    ||    ||    |_____/~\\___/     |${c.reset}`,
      `${c.cyan}  \\_/      \\O=====O=====O=====O_/      \\_/         |${c.reset}`,
      '',
      `${c.gray}You meant 'ls', didn't you?${c.reset}`,
      '',
    ].join('\r\n'),
  }),

  cowsay: (args: string[]): CommandResult => {
    const text = args.join(' ') || 'Moo! SlashDot rocks!'
    const len = text.length + 2
    const top = ` ${'_'.repeat(len)}`
    const mid = `< ${text} >`
    const bot = ` ${'-'.repeat(len)}`
    return {
      output: [
        '',
        `${c.white}${top}`,
        mid,
        bot,
        `        \\   ^__^`,
        `         \\  (oo)\\_______`,
        `            (__)\\       )\\/\\`,
        `                ||----w |`,
        `                ||     ||${c.reset}`,
        '',
      ].join('\r\n'),
    }
  },

  'sudo rm -rf /': (): CommandResult => ({
    output: [
      '',
      `${c.red}rm: it is dangerous to operate recursively on '/'${c.reset}`,
      `${c.red}rm: use --no-preserve-root to override this failsafe${c.reset}`,
      `${c.gray}(Nice try though 😄)${c.reset}`,
      '',
    ].join('\r\n'),
  }),

  sudo: (args: string[]): CommandResult => {
    if (args[0] === 'party') return easterEggs['sudo party']([])
    if (args[0] === 'rm') return easterEggs['sudo rm -rf /']([])
    if (args[0] === 'apt') return easterEggs['apt'](['install', ...args.slice(2)])
    if (args.join(' ') === 'give me marks') return easterEggs['sudo give me marks']([])
    if (args.join(' ') === 'make me a sandwich') return easterEggs['sudo make me a sandwich']([])
    if (args.join(' ') === 'make me a cgpa') return easterEggs['sudo make me a cgpa']([])
    if (args.join(' ') === 'give me a job') return easterEggs['sudo give me a job']([])
    if (args.join(' ') === 'make me coffee') return easterEggs['sudo make me coffee']([])
    if (args.join(' ') === 'chmod 777 life') return easterEggs['sudo chmod 777 life']([])
    return {
      output: `\r\n${c.red}sudo: ${args.join(' ')}: command not allowed${c.reset}\r\n${c.gray}This incident will be reported.${c.reset}\r\n`,
    }
  },

  fortune: (): CommandResult => {
    const quotes = [
      'Any sufficiently advanced technology is indistinguishable from magic. — Clarke',
      'Programs must be written for people to read, and only incidentally for machines to execute. — Abelson',
      'The best way to predict the future is to invent it. — Kay',
      'Talk is cheap. Show me the code. — Torvalds',
      'First, solve the problem. Then, write the code. — Johnson',
      'It works on my machine. — Every Developer Ever',
      'There are only two hard things in CS: cache invalidation and naming things. — Knuth',
    ]
    const q = quotes[Math.floor(Math.random() * quotes.length)]
    return { output: `\r\n${c.yellow}"${q}"${c.reset}\r\n` }
  },

  clear: (): CommandResult => ({
    output: '',
    action: { type: 'clear' },
  }),

  panic: (): CommandResult => ({
    output: `\r\n${c.red}KERNEL PANIC — initiating...${c.reset}\r\n`,
    action: { type: 'easter_egg', effect: 'panic' },
  }),

  reboot: (): CommandResult => ({
    output: `\r\n${c.green}Rebooting SlashDot OS...${c.reset}\r\n`,
    action: { type: 'easter_egg', effect: 'reboot' },
  }),

  reset: (): CommandResult => ({
    output: '',
    action: { type: 'easter_egg', effect: 'reset' },
  }),

  // ── VIM ─────────────────────────────────────────────────────────────────────
  vim: (args: string[]): CommandResult => {
    const file = args[0] || 'untitled'
    const fileContents: Record<string, string[]> = {
      'about.txt': [
        '# SlashDot OS — About',
        '',
        'SlashDot OS is a browser-based OS simulator',
        'built for the Inter-Batch Website Development',
        'Competition 2026, organized by SlashDot Club',
        'at IISER Kolkata.',
      ],
      'README.md': [
        '# SlashDot OS — 25MS Batch',
        '',
        'Welcome to SlashDot OS.',
        'Type "help" to see available commands.',
        '',
        'Built with love by the 25MS batch.',
      ],
      'untitled': [''],
    }
    const lines = fileContents[file] ?? [`"${file}" [New File]`]
    return {
      output: [
        '',
        `${lines.map((l, i) => `${c.gray}${String(i + 1).padStart(3)} ${c.reset}${c.white}${l}`).join('\r\n')}${c.reset}`,
        '',
        `${c.gray}~\r\n~\r\n~\r\n~${c.reset}`,
        '',
        `${c.cyan}-- INSERT -- ${c.reset}${c.gray}(fake vim — type :q to quit, :wq to save & quit)${c.reset}`,
        '',
        `${c.green}"${file}" ${lines.length}L, ${lines.join('').length}C${c.reset}`,
        '',
        `${c.gray}Type  :q   to quit${c.reset}`,
        `${c.gray}Type  :wq  to save and quit${c.reset}`,
        '',
      ].join('\r\n'),
      action: { type: 'easter_egg', effect: 'vim' },
    }
  },

  ':q': (): CommandResult => ({
    output: `\r\n${c.yellow}Exiting vim...${c.reset}\r\n${c.green}Welcome back to reality.${c.reset}\r\n`,
  }),

  ':wq': (): CommandResult => ({
    output: `\r\n${c.green}File saved! (not really, this is a fake OS)${c.reset}\r\n${c.yellow}Exiting vim...${c.reset}\r\n`,
  }),

  ':wq!': (): CommandResult => ({
    output: `\r\n${c.green}Force saved! (still fake)${c.reset}\r\n${c.yellow}Exiting vim...${c.reset}\r\n`,
  }),

  ':q!': (): CommandResult => ({
    output: `\r\n${c.red}Discarding changes...${c.reset}\r\n${c.yellow}Exiting vim...${c.reset}\r\n`,
  }),

  // ── APT ─────────────────────────────────────────────────────────────────────
  apt: (args: string[]): CommandResult => {
    const subcommand = args[0]
    const pkg = args[1] || ''
    if (subcommand !== 'install') {
      return {
        output: [
          '',
          `${c.yellow}apt ${subcommand}: unknown subcommand${c.reset}`,
          `${c.gray}Usage: apt install <package>${c.reset}`,
          '',
        ].join('\r\n'),
      }
    }
    const funPackages: Record<string, string[]> = {
      friendship:  [`${c.green}✓ Successfully installed: friendship (1.0.0-25ms)${c.reset}`, `${c.gray}Now initialising warmth subsystem...${c.reset}`, `${c.green}✓ Warmth subsystem online.${c.reset}`],
      love:        [`${c.green}✓ Successfully installed: love (∞.0-eternal)${c.reset}`, `${c.gray}Warning: love has no uninstall script.${c.reset}`],
      sleep:       [`${c.red}E: Package 'sleep' has no installation candidate.${c.reset}`, `${c.gray}Hint: Have you tried closing your laptop?${c.reset}`],
      coffee:      [`${c.green}✓ Successfully installed: coffee (4.2.0-espresso)${c.reset}`, `${c.yellow}Warning: May cause jitteriness and late-night commits.${c.reset}`],
      motivation:  [`${c.red}E: Package 'motivation' is not available.${c.reset}`, `${c.gray}Try: apt install coffee${c.reset}`],
      vim:         [`${c.green}✓ vim is already installed (fake-vim 2026.1)${c.reset}`, `${c.gray}Try typing: vim about.txt${c.reset}`],
      grades:      [`${c.red}E: Package 'grades' has unmet dependencies.${c.reset}`, `${c.gray}Depends: study (>= 8h/day) — but study is not installable.${c.reset}`],
      sanity:      [`${c.red}E: Unable to locate package 'sanity'${c.reset}`, `${c.gray}It was removed in the 3rd year semester update.${c.reset}`],
      brain:       [`${c.green}✓ brain is already installed (v25MS-enhanced)${c.reset}`, `${c.gray}Current status: overclocked, undercooled.${c.reset}`],
      python:      [`${c.green}✓ Successfully installed: python3 (3.12.0)${c.reset}`, `${c.gray}Note: This is still fake. Please use your real terminal.${c.reset}`],
    }
    const progressBar = (p: string) => [
      '',
      `${c.cyan}Reading package lists...${c.reset} Done`,
      `${c.cyan}Building dependency tree...${c.reset} Done`,
      `${c.white}The following NEW packages will be installed:${c.reset}`,
      `  ${c.green}${p}${c.reset}`,
      `${c.gray}Do you want to continue? [Y/n]${c.reset} Y`,
      '',
      `${c.cyan}Get:1${c.reset} http://slashdot.iiserkol.ac.in ${p} 1.0.0 [42 kB]`,
      `${c.white}Setting up ${p} (1.0.0) ...${c.reset}`,
    ]
    const extras = funPackages[pkg.toLowerCase()]
    return {
      output: [
        ...progressBar(pkg || 'unknown'),
        ...(extras ?? [`${c.green}✓ Successfully installed: ${pkg}${c.reset}`, `${c.gray}(This is a fake OS — nothing was actually installed)${c.reset}`]),
        '',
      ].join('\r\n'),
    }
  },

  // ── SSH ─────────────────────────────────────────────────────────────────────
  ssh: (args: string[]): CommandResult => {
    const target = args[0] || ''
    const isIISER = target.includes('iiserkol') || target.includes('iiser') || target.includes('25ms')
    if (!isIISER) {
      return {
        output: [
          '',
          `${c.cyan}ssh: connecting to ${target}...${c.reset}`,
          `${c.red}ssh: connect to host ${target} port 22: Connection refused${c.reset}`,
          `${c.gray}Hint: Try 'ssh batch@iiserkol'${c.reset}`,
          '',
        ].join('\r\n'),
      }
    }
    return {
      output: [
        '',
        `${c.cyan}ssh: connecting to ${target}...${c.reset}`,
        `${c.gray}ECDSA key fingerprint is SHA256:25MS/SlashDotOS/2026/IISERKOL.${c.reset}`,
        `${c.yellow}Are you sure you want to continue connecting? (yes/no) yes${c.reset}`,
        `${c.green}Connected to IISER Kolkata Internal Network${c.reset}`,
        '',
        `${c.yellow}  Welcome, 25MS Batch!${c.reset}`,
        '',
        `${c.white}  ── 25MS Batch Stats ──────────────────────${c.reset}`,
        `${c.cyan}  Students enrolled   ${c.reset}${c.white}:  ~150${c.reset}`,
        `${c.cyan}  Avg sleep per night ${c.reset}${c.white}:  4.2 hours${c.reset}`,
        `${c.cyan}  Coffee consumed     ${c.reset}${c.white}:  ∞ litres${c.reset}`,
        `${c.cyan}  Bugs fixed today    ${c.reset}${c.white}:  3 (introduced 7)${c.reset}`,
        '',
        `${c.white}  ── Message of the Day ────────────────────${c.reset}`,
        `${c.yellow}  "We didn't sleep, we deployed."${c.reset}`,
        `${c.gray}              — 25MS Batch, 2026${c.reset}`,
        '',
        `${c.green}batch@iiserkol:~$${c.reset} ${c.gray}exit${c.reset}`,
        `${c.cyan}Connection to iiserkol.ac.in closed.${c.reset}`,
        '',
      ].join('\r\n'),
    }
  },

  // ── GIT ─────────────────────────────────────────────────────────────────────
  git: (args: string[]): CommandResult => {
    const sub = args[0]
    if (sub === 'log') {
      const commits = [
        { hash: 'a3f9d2c', author: 'Sankhadeep Bera', date: 'Thu Apr 10 23:58:00 2026', msg: 'final final FINAL submission (for real this time)' },
        { hash: 'b2e1f8a', author: 'Sankhadeep Bera', date: 'Thu Apr 10 23:30:00 2026', msg: 'fix: removed the thing that broke the other thing' },
        { hash: 'c9d4e7b', author: 'Sankhadeep Bera', date: 'Thu Apr 10 22:15:00 2026', msg: 'feat: added ssh easter egg (very important)' },
        { hash: 'd1a6c3f', author: 'Sankhadeep Bera', date: 'Thu Apr 10 20:00:00 2026', msg: 'fix: why was the logo broken AGAIN' },
        { hash: 'e8b2d9a', author: 'Sankhadeep Bera', date: 'Thu Apr 10 18:45:00 2026', msg: 'feat: particles go brrr' },
        { hash: 'j5a1c9f', author: 'Sankhadeep Bera', date: 'Wed Apr 09 15:00:00 2026', msg: 'init: initial commit (nothing works)' },
      ]
      return {
        output: [
          '',
          ...commits.map(commit => [
            `${c.yellow}commit ${commit.hash}${c.reset}`,
            `${c.white}Author: ${commit.author}${c.reset}`,
            `${c.white}Date:   ${commit.date}${c.reset}`,
            '',
            `    ${c.white}${commit.msg}${c.reset}`,
            '',
          ].join('\r\n')),
        ].join('\r\n'),
      }
    }
    if (sub === 'blame') {
      return {
        output: [
          '',
          `${c.yellow}  1${c.reset} ${c.cyan}(Sankhadeep)${c.reset} ${c.white}const os = new SlashDotOS()${c.reset}`,
          `${c.yellow}  2${c.reset} ${c.cyan}(Sankhadeep)${c.reset} ${c.white}os.boot() // this took 3 hours${c.reset}`,
          `${c.yellow}  3${c.reset} ${c.cyan}(Sankhadeep)${c.reset} ${c.white}// TODO: fix this before deadline${c.reset}`,
          '',
          `${c.gray}git blame: All blame goes to Sankhadeep. As always.${c.reset}`,
          '',
        ].join('\r\n'),
      }
    }
    if (sub === 'status') {
      return {
        output: [
          '',
          `${c.cyan}On branch main${c.reset}`,
          `${c.red}modified:   src/commands/easterEggs.ts${c.reset}`,
          `${c.red}modified:   src/data/team.ts${c.reset}`,
          `${c.green}Untracked files:${c.reset}`,
          `${c.green}  src/components/Desktop/Particles.tsx${c.reset}`,
          '',
        ].join('\r\n'),
      }
    }
    if (sub === 'push') {
      return {
        output: [
          '',
          `${c.green}To https://github.com/berasankhadeep20-lang/Interbatch-Coding-2026-25MS.git${c.reset}`,
          `${c.green}   b2e1f8a..a3f9d2c  main -> main${c.reset}`,
          '',
        ].join('\r\n'),
      }
    }
    if (sub === 'commit') {
      return {
        output: `\r\n${c.green}[main a3f9d2c] ${args.slice(2).join(' ') || 'wip: changes'}${c.reset}\r\n${c.gray}(This is a fake OS — nothing was actually committed)${c.reset}\r\n`,
      }
    }
    return {
      output: [
        '',
        `${c.cyan}usage: git <command>${c.reset}`,
        `  ${c.green}git log${c.reset}     ${c.gray}Show commit history${c.reset}`,
        `  ${c.green}git blame${c.reset}   ${c.gray}Blame someone for bugs${c.reset}`,
        `  ${c.green}git status${c.reset}  ${c.gray}Show working tree status${c.reset}`,
        `  ${c.green}git commit${c.reset}  ${c.gray}Record changes (fake)${c.reset}`,
        `  ${c.green}git push${c.reset}    ${c.gray}Push to remote (fake)${c.reset}`,
        '',
      ].join('\r\n'),
    }
  },

  // ── CURSOR ──────────────────────────────────────────────────────────────────
  cursor: (args: string[]): CommandResult => {
    const style = args[0]?.toLowerCase()
    const valid = ['block', 'bar', 'underline']
    if (!style || !valid.includes(style)) {
      return { output: [``, `${c.cyan}Usage: cursor <style>${c.reset}`, `${c.gray}Available: block, bar, underline${c.reset}`, ``].join('\r\n') }
    }
    window.dispatchEvent(new CustomEvent('slashdot-cursor', { detail: { style } }))
    return { output: `\r\n${c.green}✓ Cursor style changed to: ${style}${c.reset}\r\n` }
  },

  // ── CHANGELOG ───────────────────────────────────────────────────────────────
  changelog: (): CommandResult => ({
    output: [
      '',
      `${c.cyan}SlashDot OS — Changelog${c.reset}`,
      '',
      `${c.yellow}v2026.1.0${c.reset} ${c.gray}(2026-04-11 — submission day)${c.reset}`,
      `  ${c.green}+${c.reset} Added everything at 3am`,
      `  ${c.green}+${c.reset} Added 50+ easter eggs`,
      `  ${c.red}-${c.reset} Removed sleep from developer's schedule`,
      '',
      `${c.yellow}v2026.0.9${c.reset} ${c.gray}(2026-04-10)${c.reset}`,
      `  ${c.green}+${c.reset} Boot screen now types itself dramatically`,
      `  ${c.green}+${c.reset} Added kernel panic (for the vibes)`,
      `  ${c.gray}~${c.reset} Fixed TypeScript errors (introduced 12 more)`,
      '',
      `${c.yellow}v2026.0.1${c.reset} ${c.gray}(2026-03-22 — competition start)${c.reset}`,
      `  ${c.green}+${c.reset} Initial commit`,
      `  ${c.red}-${c.reset} Nothing works`,
      '',
      `${c.gray}For full history: git log${c.reset}`,
      '',
    ].join('\r\n'),
  }),

  // ── MEMBERS ─────────────────────────────────────────────────────────────────
  members: (): CommandResult => ({
    output: [
      '',
      `${c.cyan}SlashDot Club — Office Bearers${c.reset}`,
      '',
      `  ${c.green}[01]${c.reset} ${c.white}Shuvam Banerji Seal${c.reset}  ${c.gray}sbs22ms076@iiserkol.ac.in  22MS${c.reset}`,
      `  ${c.green}[02]${c.reset} ${c.white}Anuprovo Debnath${c.reset}     ${c.gray}ad23ms110@iiserkol.ac.in   23MS${c.reset}`,
      `  ${c.green}[03]${c.reset} ${c.white}Abhinav Dhingra${c.reset}      ${c.gray}ad24ms110@iiserkol.ac.in   24MS${c.reset}`,
      '',
      `  ${c.green}[04]${c.reset} ${c.white}Sankhadeep Bera${c.reset}      ${c.gray}sb25ms227@iiserkol.ac.in   25MS — Dev${c.reset}`,
      '',
    ].join('\r\n'),
  }),

  // ── TOP ─────────────────────────────────────────────────────────────────────
  top: (): CommandResult => {
    const uptime = Math.floor(Math.random() * 60) + 10
    const processes = [
      { pid: 1,    cpu: 0.0,  mem: 0.1,  cmd: 'init' },
      { pid: 108,  cpu: 12.4, mem: 8.3,  cmd: 'browser-tabs (too many)' },
      { pid: 312,  cpu: 6.3,  mem: 4.2,  cmd: 'anxiety-daemon' },
      { pid: 420,  cpu: 5.5,  mem: 3.1,  cmd: 'procrastination.exe' },
      { pid: 512,  cpu: 4.2,  mem: 2.8,  cmd: 'vite-dev-server' },
      { pid: 714,  cpu: 2.1,  mem: 1.2,  cmd: 'coffee-monitor' },
      { pid: 916,  cpu: 1.2,  mem: 0.7,  cmd: 'vim (never closes)' },
      { pid: 9999, cpu: 99.9, mem: 99.9, cmd: 'exam-stress (unkillable)' },
    ]
    return {
      output: [
        '',
        `${c.green}SlashDot OS${c.reset} — top  uptime: ${uptime}min`,
        `${c.cyan}${'PID'.padEnd(6)}${'CPU%'.padEnd(8)}${'MEM%'.padEnd(8)}COMMAND${c.reset}`,
        `${c.gray}${'─'.repeat(40)}${c.reset}`,
        ...processes.map(p => {
          const cc = p.cpu > 50 ? c.red : p.cpu > 10 ? c.yellow : c.white
          return `${c.gray}${String(p.pid).padEnd(6)}${c.reset}${cc}${String(p.cpu).padEnd(8)}${c.reset}${cc}${String(p.mem).padEnd(8)}${c.reset}${c.white}${p.cmd}${c.reset}`
        }),
        '',
        `${c.gray}PID 9999 cannot be killed. It never can.${c.reset}`,
        '',
      ].join('\r\n'),
    }
  },

  // ── WEATHER (Live API) ───────────────────────────────────────────────────────
  weather: (): CommandResult => {
    const fetchWeather = async () => {
      try {
        const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=22.9734&longitude=88.5196&current=temperature_2m,weathercode,windspeed_10m,relativehumidity_2m&timezone=Asia/Kolkata')
        const data = await res.json()
        const temp = data.current.temperature_2m
        const humidity = data.current.relativehumidity_2m
        const wind = data.current.windspeed_10m
        const code = data.current.weathercode
        const weatherDesc: Record<number, string> = {
          0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
          45: 'Foggy', 51: 'Light drizzle', 61: 'Light rain', 63: 'Rain',
          65: 'Heavy rain', 80: 'Rain showers', 95: 'Thunderstorm',
        }
        const weatherIcon: Record<number, string> = {
          0: '☀', 1: '🌤', 2: '⛅', 3: '☁',
          45: '🌫', 51: '🌦', 61: '🌧', 63: '🌧', 65: '⛈', 80: '🌦', 95: '⛈',
        }
        const desc = weatherDesc[code] ?? 'Unknown'
        const icon = weatherIcon[code] ?? '🌡'
        window.dispatchEvent(new CustomEvent('slashdot-weather', { detail: { code } }))
        window.dispatchEvent(new CustomEvent('slashdot-terminal-write', {
          detail: {
            text: [
              '',
              `${c.cyan}┌─────────────────────────────────────────────────┐${c.reset}`,
              `${c.cyan}│  🌍 LIVE Weather — IISER Kolkata Campus         │${c.reset}`,
              `${c.cyan}└─────────────────────────────────────────────────┘${c.reset}`,
              '',
              `  ${icon}  ${c.yellow}${desc}${c.reset}`,
              '',
              `  ${c.white}Temperature   ${c.reset}${c.yellow}${temp}°C${c.reset}`,
              `  ${c.white}Humidity      ${c.reset}${c.cyan}${humidity}%${c.reset}`,
              `  ${c.white}Wind Speed    ${c.reset}${c.white}${wind} km/h${c.reset}`,
              '',
              `  ${c.gray}── Campus Conditions ─────────────────${c.reset}`,
              `  ${c.white}Canteen queue  ${c.reset}${c.red}Dangerously long${c.reset}`,
              `  ${c.white}Hostel WiFi    ${c.reset}${c.red}Down (as always)${c.reset}`,
              '',
              `  ${c.gray}Source: Open-Meteo API (real data) — ${new Date().toLocaleTimeString()}${c.reset}`,
              '',
            ].join('\r\n'),
          },
        }))
      } catch {
        window.dispatchEvent(new CustomEvent('slashdot-terminal-write', {
          detail: { text: `\r\n${c.red}Weather fetch failed. Check your internet connection.${c.reset}\r\n` },
        }))
      }
    }
    fetchWeather()
    return { output: `\r\n${c.cyan}Fetching live weather from Open-Meteo API...${c.reset}\r\n` }
  },

  // ── RAIN ─────────────────────────────────────────────────────────────────────
  rain: (args: string[]): CommandResult => {
    const on = args[0] === 'on'
    const off = args[0] === 'off'
    if (!on && !off) return { output: `\r\n${c.gray}Usage: rain on / rain off${c.reset}\r\n` }
    window.dispatchEvent(new CustomEvent('slashdot-weather', { detail: { code: on ? 63 : 0 } }))
    return { output: `\r\n${c.cyan}${on ? '🌧 Rain started' : '☀ Rain stopped'}${c.reset}\r\n` }
  },

  // ── VISITS ──────────────────────────────────────────────────────────────────
  visits: (): CommandResult => {
    fetch('https://api.countapi.xyz/hit/slashdot-os-25ms/visits')
      .then(function(r) { return r.json() })
      .then(function(data) {
        window.dispatchEvent(new CustomEvent('slashdot-terminal-write', {
          detail: {
            text: [
              '',
              `${c.cyan}┌─────────────────────────────────┐${c.reset}`,
              `${c.cyan}│  🌍 Live Visitor Counter         │${c.reset}`,
              `${c.cyan}└─────────────────────────────────┘${c.reset}`,
              '',
              `  ${c.white}Total visits   ${c.reset}${c.green}${data.value ?? 0}${c.reset}`,
              `  ${c.gray}You are visitor #${data.value ?? 0}${c.reset}`,
              '',
            ].join('\r\n'),
          },
        }))
      })
      .catch(function() {
        window.dispatchEvent(new CustomEvent('slashdot-terminal-write', {
          detail: { text: `\r\n${c.red}Could not fetch visitor count.${c.reset}\r\n` },
        }))
      })
    return { output: `\r\n${c.cyan}Fetching live visitor count...${c.reset}\r\n` }
  },

  // ── WALLPAPER ────────────────────────────────────────────────────────────────
  wallpaper: (args: string[]): CommandResult => {
    const color = args[0]?.toLowerCase()
    const wallpapers: Record<string, string> = {
      dark: '#050505', green: '#001a00', blue: '#000d1a',
      purple: '#0d0014', red: '#1a0000', amber: '#1a0f00',
      matrix: '#001200', default: '#050505',
    }
    if (!color || !wallpapers[color]) {
      return {
        output: [``, `${c.cyan}Available wallpapers:${c.reset}`, `  ${c.white}${Object.keys(wallpapers).join(', ')}${c.reset}`, `${c.gray}Usage: wallpaper <name>${c.reset}`, ``].join('\r\n'),
      }
    }
    const el = document.querySelector('.desktop') as HTMLElement | null
    if (el) el.style.backgroundColor = wallpapers[color]
    return { output: `\r\n${c.green}✓ Wallpaper changed to: ${color}${c.reset}\r\n` }
  },

  // ── THEME ────────────────────────────────────────────────────────────────────
  theme: (args: string[]): CommandResult => {
    const name = args[0]?.toLowerCase()
    const themes: Record<string, { primary: string; label: string }> = {
      green:  { primary: '\x1b[38;2;0;255;70m',   label: 'Terminal Green' },
      amber:  { primary: '\x1b[38;2;255;176;0m',  label: 'Phosphor Amber' },
      blue:   { primary: '\x1b[38;2;0;180;255m',  label: 'Cyan Blue' },
      red:    { primary: '\x1b[38;2;255;80;80m',   label: 'Red Alert' },
      purple: { primary: '\x1b[38;2;180;100;255m', label: 'Purple Haze' },
    }
    if (!name || !themes[name]) {
      return {
        output: [
          '',
          `${c.cyan}Available themes:${c.reset}`,
          ...Object.entries(themes).map(([k, t]) => `  ${t.primary}${k}${c.reset}  ${c.gray}${t.label}${c.reset}`),
          '',
          `${c.gray}Usage: theme <name>${c.reset}`,
          '',
        ].join('\r\n'),
      }
    }
    const t = themes[name]
    ;(window as any).__slashdotTheme = { name, ...t }
    window.dispatchEvent(new CustomEvent('slashdot-theme', { detail: { name, theme: t } }))
    return { output: `\r\n${t.primary}✓ Theme changed to: ${t.label}${c.reset}\r\n` }
  },

  // ── CRT ──────────────────────────────────────────────────────────────────────
  crt: (args: string[]): CommandResult => {
    const on = args[0] === 'on'
    const off = args[0] === 'off'
    if (!on && !off) return { output: `\r\n${c.gray}Usage: crt on / crt off${c.reset}\r\n` }
    const el = document.querySelector('.scanlines') as HTMLElement | null
    if (el) el.style.opacity = on ? '1' : '0'
    return { output: `\r\n${c.green}✓ CRT effect ${on ? 'enabled' : 'disabled'}${c.reset}\r\n` }
  },

  // ── FONT ─────────────────────────────────────────────────────────────────────
  'font+': (): CommandResult => {
    window.dispatchEvent(new CustomEvent('slashdot-font', { detail: { delta: 1 } }))
    return { output: `\r\n${c.green}✓ Font size increased${c.reset}\r\n` }
  },

  'font-': (): CommandResult => {
    window.dispatchEvent(new CustomEvent('slashdot-font', { detail: { delta: -1 } }))
    return { output: `\r\n${c.green}✓ Font size decreased${c.reset}\r\n` }
  },

  // ── SUDO COMMANDS ────────────────────────────────────────────────────────────
  'sudo give me marks': (): CommandResult => ({
    output: [
      '',
      `${c.cyan}Connecting to IISER Kolkata Academic Server...${c.reset}`,
      `${c.green}✓ Connected${c.reset}`,
      '',
      `${c.white}┌─────────────────────────────────────────┐${c.reset}`,
      `${c.white}│         25MS Grade Report 2026          │${c.reset}`,
      `${c.white}├──────────────────────┬──────────────────┤${c.reset}`,
      `${c.white}│ Mathematics I        │ ${c.green}A+${c.white}               │${c.reset}`,
      `${c.white}│ Physics I            │ ${c.green}A+${c.white}               │${c.reset}`,
      `${c.white}│ Web Dev Competition  │ ${c.green}A+ (obviously)${c.white}   │${c.reset}`,
      `${c.white}├──────────────────────┼──────────────────┤${c.reset}`,
      `${c.white}│ CGPA                 │ ${c.green}10.0 / 10.0${c.white}      │${c.reset}`,
      `${c.white}└──────────────────────┴──────────────────┘${c.reset}`,
      '',
      `${c.gray}(This is a fake OS. Please study for real exams.)${c.reset}`,
      '',
    ].join('\r\n'),
  }),

  'sudo make me a sandwich': (): CommandResult => ({
    output: [
      '',
      `${c.green}✓ Okay.${c.reset}`,
      '',
      `${c.white}┌─────────────────────────────┐${c.reset}`,
      `${c.white}│   🥪  Your sandwich, sir.   │${c.reset}`,
      `${c.white}│   Bread    : Sourdough      │${c.reset}`,
      `${c.white}│   Filling  : Bug-free code  │${c.reset}`,
      `${c.white}│   Sauce    : Stack Overflow │${c.reset}`,
      `${c.white}└─────────────────────────────┘${c.reset}`,
      '',
      `${c.gray}(xkcd.com/149)${c.reset}`,
      '',
    ].join('\r\n'),
  }),

  'sudo make me a cgpa': (): CommandResult => ({
    output: [
      '',
      `${c.cyan}Overriding grade calculation algorithm...${c.reset}`,
      `${c.green}✓ Done${c.reset}`,
      '',
      `${c.white}┌─────────────────────────────────┐${c.reset}`,
      `${c.white}│   Previous CGPA : ${c.red}¯\\_(ツ)_/¯${c.white}    │${c.reset}`,
      `${c.white}│   New CGPA      : ${c.green}10.0 / 10.0${c.white} │${c.reset}`,
      `${c.white}└─────────────────────────────────┘${c.reset}`,
      '',
      `${c.gray}(Still fake. Please attend your classes.)${c.reset}`,
      '',
    ].join('\r\n'),
  }),

  'sudo give me a job': (): CommandResult => ({
    output: [
      '',
      `${c.cyan}Sending resume to top tech companies...${c.reset}`,
      '',
      `${c.green}✓ Google    — Offer received: $450,000/yr + free food${c.reset}`,
      `${c.green}✓ Meta      — Offer received: $420,000/yr + VR headset${c.reset}`,
      `${c.green}✓ Anthropic — Offer received: work with Claude all day${c.reset}`,
      `${c.green}✓ IISER     — Offer received: PhD stipend ₹37,000/month${c.reset}`,
      '',
      `${c.yellow}Recommended: Take the Anthropic offer.${c.reset}`,
      `${c.gray}(All offers are fake. Please update your LinkedIn.)${c.reset}`,
      '',
    ].join('\r\n'),
  }),

  'sudo make me coffee': (): CommandResult => ({
    output: [
      '',
      `${c.cyan}Initializing coffee module...${c.reset}`,
      `${c.green}✓ Water heated to 94°C${c.reset}`,
      `${c.green}✓ Espresso extracted (28 seconds)${c.reset}`,
      '',
      `${c.white}    ( (${c.reset}`,
      `${c.white}     ) )${c.reset}`,
      `${c.white}  ........${c.reset}`,
      `${c.white}  |      |]${c.reset}`,
      `${c.white}  \\      /${c.reset}`,
      `${c.white}   \`----'${c.reset}`,
      '',
      `${c.green}☕ Your coffee is ready!${c.reset}`,
      '',
    ].join('\r\n'),
  }),

  clippy: (): CommandResult => {
    window.dispatchEvent(new CustomEvent('slashdot-clippy', {
      detail: { text: "It looks like you summoned me! How can I help? Try 'help' to see all commands." }
    }))
    return { output: `\r\n${c.yellow}📎 Clippy has appeared!${c.reset}\r\n` }
  },

  'sudo chmod 777 life': (): CommandResult => ({
    output: [
      '',
      `${c.green}✓ Done. You now have full permissions to life.${c.reset}`,
      `${c.white}rwxrwxrwx  you  life${c.reset}`,
      `${c.gray}(Your parents may revoke these permissions.)${c.reset}`,
      '',
    ].join('\r\n'),
  }),

  // ── PROCRASTINATE ────────────────────────────────────────────────────────────
  procrastinate: (): CommandResult => ({
    output: [
      '',
      `${c.cyan}Opening SlashTube...${c.reset}`,
      '',
      `${c.white}┌─────────────────────────────────────────────────────┐${c.reset}`,
      `${c.red}│  ▶ SlashTube                          🔴 LIVE       │${c.reset}`,
      `${c.white}├─────────────────────────────────────────────────────┤${c.reset}`,
      `${c.yellow}│  ► "How to study effectively" — 2.3M views         │${c.reset}`,
      `${c.yellow}│  ► "Top 10 VS Code extensions" — 890K views        │${c.reset}`,
      `${c.yellow}│  ► "I coded for 24 hours straight" — 5.1M views    │${c.reset}`,
      `${c.yellow}│  ► "Why you can't focus" — 12M views               │${c.reset}`,
      `${c.white}└─────────────────────────────────────────────────────┘${c.reset}`,
      '',
      `${c.red}⚠ Warning: ${c.reset}${c.white}You have ${c.yellow}3 assignments${c.reset}${c.white} due tomorrow.${c.reset}`,
      `${c.gray}Type 'clear' to pretend this never happened.${c.reset}`,
      '',
    ].join('\r\n'),
  }),

  // ── MISC ─────────────────────────────────────────────────────────────────────
  nyan: (): CommandResult => ({
    output: [
      '',
      `${c.magenta}+      o     +              o   ${c.reset}`,
      `${c.cyan}+--+--+--+--+--+--+--+--+--+--+${c.reset}`,
      `${c.red}|  ${c.reset}${c.yellow}~(=^‥^)ノ彡☆${c.reset}             ${c.red}|${c.reset}`,
      `${c.cyan}+--+--+--+--+--+--+--+--+--+--+${c.reset}`,
      `${c.magenta}   +      +        +   o    +   ${c.reset}`,
      '',
      `${c.gray}Nyan nyan nyan nyan nyan! 🌈${c.reset}`,
      '',
    ].join('\r\n'),
  }),

  yes: (): CommandResult => ({
    output: [
      '',
      `${c.green}yes${c.reset}`,
      `${c.green}yes${c.reset}`,
      `${c.green}yes${c.reset}`,
      `${c.green}yes${c.reset}`,
      `${c.green}yes${c.reset}`,
      `${c.gray}... (already stopped)${c.reset}`,
      '',
    ].join('\r\n'),
  }),

  echo: (args: string[]): CommandResult => ({
    output: `\r\n${c.white}${args.join(' ')}${c.reset}\r\n`,
  }),

  banner: (args: string[]): CommandResult => {
    const text = args.join(' ') || 'SlashDot'
    const line = '█'.repeat(text.length + 4)
    return {
      output: [``, `${c.green}${line}${c.reset}`, `${c.green}█ ${c.yellow}${text.toUpperCase()} ${c.green}█${c.reset}`, `${c.green}${line}${c.reset}`, ``].join('\r\n'),
    }
  },

  quote: (): CommandResult => {
    const quotes = [
      'IISER Kolkata: where sleep is a myth and coffee is a food group.',
      'SlashDot: we code, we design, we forget to eat.',
      '25MS batch: came for science, stayed for the existential dread.',
      'It works on my machine. — Every 25MS developer, ever.',
      'The deadline is April 11. We are fine.',
      '404: Work-life balance not found.',
    ]
    const q = quotes[Math.floor(Math.random() * quotes.length)]
    return { output: `\r\n${c.yellow}"${q}"${c.reset}\r\n` }
  },

  hack: (): CommandResult => ({
    output: [
      '',
      `${c.green}Initializing hack sequence...${c.reset}`,
      `${c.green}Bypassing firewall...${c.reset}`,
      `${c.green}████████████████████ 100%${c.reset}`,
      '',
      `${c.green}ACCESS GRANTED${c.reset}`,
      `${c.gray}Just kidding. This is a fake OS.${c.reset}`,
      '',
    ].join('\r\n'),
    action: { type: 'easter_egg', effect: 'matrix' },
  }),

  'npm install': (): CommandResult => ({
    output: [
      '',
      `${c.cyan}npm warn deprecated everything@1.0.0${c.reset}`,
      `${c.cyan}npm warn deprecated sanity@0.0.1${c.reset}`,
      '',
      `${c.green}added 999 packages in 4.20s${c.reset}`,
      `${c.yellow}247 packages are looking for funding${c.reset}`,
      `${c.red}3 critical vulnerabilities found${c.reset}`,
      `${c.gray}(this is fine)${c.reset}`,
      '',
    ].join('\r\n'),
  }),

  'ls -la': (): CommandResult => ({
    output: [
      '',
      `${c.cyan}total 42${c.reset}`,
      `${c.red}-rw-------  slashdot  .secrets${c.reset}`,
      `${c.red}-rw-------  slashdot  .actual_cgpa.txt${c.reset}`,
      `${c.red}-rw-------  slashdot  .times_cried_over_code.txt${c.reset}`,
      `${c.white}-rw-r--r--  slashdot  about.txt${c.reset}`,
      `${c.white}-rw-r--r--  slashdot  README.md${c.reset}`,
      `${c.white}-rwxr-xr-x  slashdot  contact.sh${c.reset}`,
      '',
      `${c.gray}Hint: try 'cat .secrets'${c.reset}`,
      '',
    ].join('\r\n'),
  }),

  'cat .secrets': (): CommandResult => ({
    output: `\r\n${c.red}Permission denied.${c.reset}\r\n${c.gray}(some things are better left unknown)${c.reset}\r\n`,
  }),

  'cat .actual_cgpa.txt': (): CommandResult => ({
    output: `\r\n${c.red}Permission denied. Even you don't want to know.${c.reset}\r\n`,
  }),

  'cat /etc/passwd': (): CommandResult => ({
    output: [
      '',
      `${c.cyan}root:x:0:0:root:/root:/bin/bash${c.reset}`,
      `${c.white}slashdot:x:1000:1000:SlashDot OS User:/home/slashdot:/bin/slashdot-sh${c.reset}`,
      `${c.white}sankhadeep:x:1001:1001:Sankhadeep Bera:/home/sankhadeep:/bin/bash${c.reset}`,
      `${c.white}exam_stress:x:9999:9999:unkillable:/proc/9999:/bin/panic${c.reset}`,
      '',
    ].join('\r\n'),
  }),

  'sudo apt-get install iiser-wifi': (): CommandResult => ({
    output: [
      '',
      `${c.cyan}Connecting to repository...${c.reset}`,
      `${c.cyan}Connecting to repository...${c.reset}`,
      `${c.red}E: Failed to connect. Connection timed out.${c.reset}`,
      `${c.gray}(The WiFi itself is preventing you from installing WiFi.)${c.reset}`,
      '',
    ].join('\r\n'),
  }),

  './run_exam.sh': (): CommandResult => ({
    output: [
      '',
      `${c.white}┌─────────────────────────────────────────────────────┐${c.reset}`,
      `${c.white}│  IISER Kolkata — End Semester Examination 2026      │${c.reset}`,
      `${c.white}│  Q1. Explain the universe. (10 marks)               │${c.reset}`,
      `${c.white}│  Q2. Prove P = NP. (20 marks)                       │${c.reset}`,
      `${c.white}│  Q3. Why did you join IISER? (42 marks)             │${c.reset}`,
      `${c.white}└─────────────────────────────────────────────────────┘${c.reset}`,
      '',
      `${c.gray}Type 'sudo give me marks' to skip the exam.${c.reset}`,
      '',
    ].join('\r\n'),
  }),

  'import antigravity': (): CommandResult => ({
    output: [
      '',
      `${c.green}✓ antigravity module loaded${c.reset}`,
      `${c.yellow}Weee! I'm flying!${c.reset}`,
      '',
      `${c.white}        o${c.reset}`,
      `${c.white}       /|\\${c.reset}`,
      `${c.white}       / \\${c.reset}`,
      `${c.gray}(xkcd.com/353)${c.reset}`,
      '',
    ].join('\r\n'),
  }),

  'curl iiserkol.ac.in': (): CommandResult => ({
    output: [
      '',
      `${c.red}curl: (6) Could not resolve host: iiserkol.ac.in${c.reset}`,
      `${c.gray}(Have you tried turning the WiFi off and on again?)${c.reset}`,
      `${c.gray}(Trick question — it was never on.)${c.reset}`,
      '',
    ].join('\r\n'),
  }),

  leetcode: (): CommandResult => ({
    output: [
      '',
      `${c.white}Problem #420: Graduate Without Crying${c.reset}`,
      `${c.yellow}Difficulty: IMPOSSIBLE${c.reset}`,
      '',
      `${c.white}Constraints:${c.reset}`,
      `  ${c.gray}Sleep ≤ 4 hours${c.reset}`,
      `  ${c.gray}Coffee ≥ 5 cups/day${c.reset}`,
      `  ${c.gray}Deadlines are always tomorrow${c.reset}`,
      '',
      `${c.red}Acceptance rate: 0.0%${c.reset}`,
      `${c.gray}Hint: There is no solution. This is the way.${c.reset}`,
      '',
    ].join('\r\n'),
  }),

  'iiser wifi': (): CommandResult => ({
    output: [
      '',
      `${c.cyan}PING iiser-wifi (10.0.0.1) 56 bytes of data.${c.reset}`,
      `${c.red}Request timeout for icmp_seq 0${c.reset}`,
      `${c.red}Request timeout for icmp_seq 1${c.reset}`,
      `${c.red}Request timeout for icmp_seq 2${c.reset}`,
      '',
      `${c.white}4 packets transmitted, 0 received, ${c.red}100% packet loss${c.reset}`,
      `${c.gray}Solution: Use mobile data. Or pray.${c.reset}`,
      '',
    ].join('\r\n'),
  }),

  exam: (args: string[]): CommandResult => {
    const subject = args[0] || 'physics'
    return {
      output: [
        '',
        `${c.white}┌─────────────────────────────────────────────────────┐${c.reset}`,
        `${c.white}│  IISER Kolkata — ${subject.toUpperCase().padEnd(35)}│${c.reset}`,
        `${c.white}│  Q1. Derive everything from first principles.(100m) │${c.reset}`,
        `${c.white}│  Q2. Prove your existence using ${subject}. (∞ marks)  │${c.reset}`,
        `${c.white}└─────────────────────────────────────────────────────┘${c.reset}`,
        '',
        `${c.gray}Type 'sudo give me marks' to auto-submit.${c.reset}`,
        '',
      ].join('\r\n'),
    }
  },

  uptime: (): CommandResult => {
    const mins = Math.floor(Math.random() * 120) + 10
    const hrs = Math.floor(mins / 60)
    const rem = mins % 60
    return {
      output: [
        '',
        `${c.white}System uptime: ${c.green}${hrs}h ${rem}m${c.reset}`,
        `${c.white}Coffee consumed: ${c.red}∞ cups${c.reset}`,
        `${c.white}Bugs introduced today: ${c.red}${Math.floor(Math.random() * 20) + 3}${c.reset}`,
        `${c.white}Bugs fixed today: ${c.green}${Math.floor(Math.random() * 5) + 1}${c.reset}`,
        '',
      ].join('\r\n'),
    }
  },

  cal: (): CommandResult => {
    const now = new Date()
    const month = now.toLocaleString('default', { month: 'long' })
    const year = now.getFullYear()
    const firstDay = new Date(year, now.getMonth(), 1).getDay()
    const daysInMonth = new Date(year, now.getMonth() + 1, 0).getDate()
    const today = now.getDate()
    let cal = `\r\n  ${c.cyan}${month} ${year}${c.reset}\r\n  ${c.gray}Su Mo Tu We Th Fr Sa${c.reset}\r\n  `
    let day = 1
    for (let i = 0; i < firstDay; i++) cal += '   '
    for (let i = firstDay; i < 7; i++) {
      cal += day === today ? `${c.green}${String(day).padStart(2)}${c.reset} ` : `${c.white}${String(day).padStart(2)}${c.reset} `
      day++
    }
    cal += '\r\n  '
    while (day <= daysInMonth) {
      for (let i = 0; i < 7 && day <= daysInMonth; i++) {
        cal += day === today ? `${c.green}${String(day).padStart(2)}${c.reset} ` : `${c.white}${String(day).padStart(2)}${c.reset} `
        day++
      }
      cal += '\r\n  '
    }
    return { output: cal }
  },

  tree: (): CommandResult => ({
    output: [
      '',
      `${c.cyan}/home/slashdot${c.reset}`,
      `${c.white}├── about.txt${c.reset}`,
      `${c.white}├── README.md${c.reset}`,
      `${c.white}├── contact.sh${c.reset}`,
      `${c.white}├── team.db${c.reset}`,
      `${c.cyan}└── projects/${c.reset}`,
      `${c.white}    ├── web-terminal.exe${c.reset}`,
      `${c.white}    └── algo-visualizer.run${c.reset}`,
      '',
      `${c.gray}3 directories, 7 files${c.reset}`,
      '',
    ].join('\r\n'),
  }),

  stats: (): CommandResult => {
    const hist = ((window as any).__slashdotHistory as string[]) ?? []
    const unique = new Set(hist).size
    return {
      output: [
        '',
        `${c.cyan}── Session Stats ──────────────────────${c.reset}`,
        '',
        `${c.white}Commands typed    ${c.reset}${c.green}${hist.length}${c.reset}`,
        `${c.white}Unique commands   ${c.reset}${c.green}${unique}${c.reset}`,
        `${c.white}Productivity      ${c.reset}${c.red}${Math.max(0, 100 - hist.length * 2)}%${c.reset}`,
        '',
      ].join('\r\n'),
    }
  },
}