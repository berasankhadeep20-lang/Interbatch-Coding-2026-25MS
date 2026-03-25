import { CommandHandler, CommandResult } from '../types'
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

  clear: (): CommandResult => ({
    output: '',
    action: { type: 'clear' },
  }),

  // ── THEME ───────────────────────────────────────────────────────────────────
  theme: (args: string[]): CommandResult => {
    const name = args[0]?.toLowerCase()

    const themes: Record<string, {
      primary: string
      secondary: string
      bg: string
      label: string
    }> = {
      green: {
        primary:   '\x1b[38;2;0;255;70m',
        secondary: '\x1b[38;2;0;200;100m',
        bg:        '#00ff4610',
        label:     'Terminal Green (default)',
      },
      amber: {
        primary:   '\x1b[38;2;255;176;0m',
        secondary: '\x1b[38;2;255;140;0m',
        bg:        '#ffb00010',
        label:     'Phosphor Amber',
      },
      blue: {
        primary:   '\x1b[38;2;0;180;255m',
        secondary: '\x1b[38;2;0;120;220m',
        bg:        '#00b4ff10',
        label:     'Cyan Blue',
      },
      red: {
        primary:   '\x1b[38;2;255;80;80m',
        secondary: '\x1b[38;2;220;50;50m',
        bg:        '#ff505010',
        label:     'Red Alert',
      },
      purple: {
        primary:   '\x1b[38;2;180;100;255m',
        secondary: '\x1b[38;2;140;70;220m',
        bg:        '#b464ff10',
        label:     'Purple Haze',
      },
    }

    if (!name || !themes[name]) {
      return {
        output: [
          '',
          `${c.cyan}Available themes:${c.reset}`,
          '',
          ...Object.entries(themes).map(([key, t]) => {
            const current = (window as any).__slashdotTheme?.name === key
            return `  ${t.primary}${key.padEnd(10)}${c.reset}  ${c.gray}${t.label}${current ? `  ${c.green}← active${c.reset}` : ''}${c.reset}`
          }),
          '',
          `${c.gray}Usage: theme <name>${c.reset}`,
          `${c.gray}Example: theme amber${c.reset}`,
          '',
        ].join('\r\n'),
      }
    }

    const t = themes[name]

    // Store theme globally
    ;(window as any).__slashdotTheme = { name, ...t }

    // Update CSS variables on root
    document.documentElement.style.setProperty('--terminal-primary', t.bg)

    // Update xterm theme via custom event
    window.dispatchEvent(new CustomEvent('slashdot-theme', { detail: { name, theme: t } }))

    return {
      output: [
        '',
        `${t.primary}✓ Theme changed to: ${t.label}${c.reset}`,
        `${c.gray}Prompt and accent colors updated.${c.reset}`,
        '',
      ].join('\r\n'),
    }
  },

  // ── SANDWICH ────────────────────────────────────────────────────────────────
  'sudo make me a sandwich': (): CommandResult => ({
    output: [
      '',
      `${c.green}✓ Okay.${c.reset}`,
      '',
      `${c.white}┌─────────────────────────────┐${c.reset}`,
      `${c.white}│                             │${c.reset}`,
      `${c.white}│   🥪  Your sandwich, sir.   │${c.reset}`,
      `${c.white}│                             │${c.reset}`,
      `${c.white}│   Bread    : Sourdough      │${c.reset}`,
      `${c.white}│   Filling  : Bug-free code  │${c.reset}`,
      `${c.white}│   Sauce    : Stack Overflow │${c.reset}`,
      `${c.white}│   Side     : Fries (crispy) │${c.reset}`,
      `${c.white}│   Drink    : Black coffee   │${c.reset}`,
      `${c.white}│                             │${c.reset}`,
      `${c.white}└─────────────────────────────┘${c.reset}`,
      '',
      `${c.gray}(xkcd.com/149 — because sudo makes it happen)${c.reset}`,
      '',
    ].join('\r\n'),
  }),

  // ── MAKE ME A CGPA ──────────────────────────────────────────────────────────
  'sudo make me a cgpa': (): CommandResult => ({
    output: [
      '',
      `${c.cyan}Connecting to academic server...${c.reset}`,
      `${c.green}✓ Connected${c.reset}`,
      '',
      `${c.cyan}Overriding grade calculation algorithm...${c.reset}`,
      `${c.green}✓ Override successful${c.reset}`,
      '',
      `${c.cyan}Injecting marks...${c.reset}`,
      `${c.green}✓ Done${c.reset}`,
      '',
      `${c.white}┌─────────────────────────────────┐${c.reset}`,
      `${c.white}│   🎓 CGPA Update — 25MS Batch   │${c.reset}`,
      `${c.white}├─────────────────────────────────┤${c.reset}`,
      `${c.white}│   Previous CGPA : ${c.red}¯\\_(ツ)_/¯${c.white}    │${c.reset}`,
      `${c.white}│   New CGPA      : ${c.green}10.0 / 10.0${c.white} │${c.reset}`,
      `${c.white}│   Status        : ${c.green}Dean's List${c.white}  │${c.reset}`,
      `${c.white}│   Scholarship   : ${c.green}Full ride${c.white}    │${c.reset}`,
      `${c.white}└─────────────────────────────────┘${c.reset}`,
      '',
      `${c.green}✓ CGPA updated successfully!${c.reset}`,
      `${c.gray}(Still fake. Please attend your classes.)${c.reset}`,
      '',
    ].join('\r\n'),
  }),

  // ── TOP ─────────────────────────────────────────────────────────────────────

  top: (): CommandResult => {
    const uptime = Math.floor(Math.random() * 60) + 10
    const processes = [
      { pid: 1,    cpu: 0.0,  mem: 0.1,  cmd: 'init' },
      { pid: 42,   cpu: 0.0,  mem: 0.2,  cmd: 'slashdot-kernel' },
      { pid: 108,  cpu: 12.4, mem: 8.3,  cmd: 'browser-tabs (too many)' },
      { pid: 204,  cpu: 8.1,  mem: 12.1, cmd: 'node_modules (growing)' },
      { pid: 312,  cpu: 6.3,  mem: 4.2,  cmd: 'anxiety-daemon' },
      { pid: 420,  cpu: 5.5,  mem: 3.1,  cmd: 'procrastination.exe' },
      { pid: 512,  cpu: 4.2,  mem: 2.8,  cmd: 'vite-dev-server' },
      { pid: 613,  cpu: 3.8,  mem: 6.4,  cmd: 'typescript-checker' },
      { pid: 714,  cpu: 2.1,  mem: 1.2,  cmd: 'coffee-monitor' },
      { pid: 815,  cpu: 1.9,  mem: 0.9,  cmd: 'deadline-reminder' },
      { pid: 916,  cpu: 1.2,  mem: 0.7,  cmd: 'vim (never closes)' },
      { pid: 1024, cpu: 0.8,  mem: 0.4,  cmd: 'slashdot-os-terminal' },
      { pid: 1337, cpu: 0.4,  mem: 0.3,  cmd: 'ssh-iiserkol' },
      { pid: 2048, cpu: 0.2,  mem: 0.2,  cmd: 'matrix-screensaver' },
      { pid: 9999, cpu: 99.9, mem: 99.9, cmd: 'exam-stress (unkillable)' },
    ]
    const totalCpu = processes.reduce((a, p) => a + p.cpu, 0).toFixed(1)
    const totalMem = processes.reduce((a, p) => a + p.mem, 0).toFixed(1)

    return {
      output: [
        '',
        `${c.green}SlashDot OS${c.reset} - top`,
        `${c.white}Tasks: ${c.green}${processes.length} total${c.reset}  ${c.white}Uptime: ${uptime} min${c.reset}  ${c.white}Load avg: 4.20 3.14 2.71${c.reset}`,
        `${c.white}CPU usage: ${c.yellow}${totalCpu}%${c.reset}  ${c.white}Mem usage: ${c.yellow}${totalMem}%${c.reset}  ${c.white}Swap: 0% (we don't do that here)${c.reset}`,
        '',
        `${c.cyan}${'PID'.padEnd(6)}${'CPU%'.padEnd(8)}${'MEM%'.padEnd(8)}COMMAND${c.reset}`,
        `${c.gray}${'─'.repeat(52)}${c.reset}`,
        ...processes.map(p => {
          const cpuCol = p.cpu > 50 ? c.red : p.cpu > 10 ? c.yellow : c.white
          const memCol = p.mem > 50 ? c.red : p.mem > 10 ? c.yellow : c.white
          return `${c.gray}${String(p.pid).padEnd(6)}${c.reset}${cpuCol}${String(p.cpu).padEnd(8)}${c.reset}${memCol}${String(p.mem).padEnd(8)}${c.reset}${c.white}${p.cmd}${c.reset}`
        }),
        '',
        `${c.gray}Press Ctrl+C to stop (just kidding, type 'clear' instead)${c.reset}`,
        `${c.gray}PID 9999 cannot be killed. It never can.${c.reset}`,
        '',
      ].join('\r\n'),
    }
  },

  // ── WEATHER ─────────────────────────────────────────────────────────────────

  weather: (): CommandResult => {
    const conditions = [
      { icon: '☀', desc: 'Sunny', temp: 34, feel: 38, humidity: 65 },
      { icon: '⛅', desc: 'Partly Cloudy', temp: 30, feel: 33, humidity: 72 },
      { icon: '🌧', desc: 'Raining (again)', temp: 26, feel: 25, humidity: 95 },
      { icon: '🌩', desc: 'Thunderstorm', temp: 24, feel: 23, humidity: 98 },
      { icon: '🌫', desc: 'Foggy', temp: 22, feel: 21, humidity: 88 },
      { icon: '🔥', desc: 'Extremely Hot', temp: 42, feel: 47, humidity: 60 },
    ]
    const w = conditions[Math.floor(Math.random() * conditions.length)]
    const days = [
      { day: 'Tomorrow', icon: '⛅', temp: 31 },
      { day: 'Wednesday', icon: '🌧', temp: 27 },
      { day: 'Thursday', icon: '☀', temp: 35 },
      { day: 'Friday', icon: '🌩', temp: 25 },
    ]
    return {
      output: [
        '',
        `${c.cyan}┌─────────────────────────────────────────────┐${c.reset}`,
        `${c.cyan}│  Weather — IISER Kolkata Campus             │${c.reset}`,
        `${c.cyan}│  Mohanpur, West Bengal, India               │${c.reset}`,
        `${c.cyan}└─────────────────────────────────────────────┘${c.reset}`,
        '',
        `  ${w.icon}  ${c.yellow}${w.desc}${c.reset}`,
        '',
        `  ${c.white}Temperature   ${c.reset}${c.yellow}${w.temp}°C${c.reset}  ${c.gray}(feels like ${w.feel}°C)${c.reset}`,
        `  ${c.white}Humidity      ${c.reset}${c.cyan}${w.humidity}%${c.reset}`,
        `  ${c.white}Wind          ${c.reset}${c.white}12 km/h NE${c.reset}`,
        `  ${c.white}Visibility    ${c.reset}${c.white}8 km${c.reset}`,
        `  ${c.white}UV Index      ${c.reset}${c.red}Very High (protect your laptop)${c.reset}`,
        '',
        `  ${c.gray}── 4-Day Forecast ────────────────────────${c.reset}`,
        '',
        ...days.map(d =>
          `  ${d.icon}  ${c.white}${d.day.padEnd(12)}${c.reset}  ${c.yellow}${d.temp}°C${c.reset}`
        ),
        '',
        `  ${c.gray}── Campus Conditions ─────────────────────${c.reset}`,
        '',
        `  ${c.white}Canteen queue    ${c.reset}${c.red}Dangerously long${c.reset}`,
        `  ${c.white}Library AC       ${c.reset}${c.green}Working (miracle)${c.reset}`,
        `  ${c.white}Hostel WiFi      ${c.reset}${c.red}Down (as always)${c.reset}`,
        `  ${c.white}Exam stress      ${c.reset}${c.red}Maximum${c.reset}`,
        `  ${c.white}Coffee supply    ${c.reset}${c.yellow}Critical${c.reset}`,
        '',
        `  ${c.gray}Last updated: ${new Date().toLocaleTimeString()}${c.reset}`,
        '',
      ].join('\r\n'),
    }
  },

  sudo: (args: string[]): CommandResult => {
    if (args[0] === 'party') return easterEggs['sudo party']([])
    if (args[0] === 'rm')    return easterEggs['sudo rm -rf /']([])
    if (args[0] === 'apt')   return easterEggs['apt'](['install', ...args.slice(2)])
    if (args.join(' ') === 'give me marks') return easterEggs['sudo give me marks']([])
    if (args.join(' ') === 'make me a sandwich') return easterEggs['sudo make me a sandwich']([])
    if (args.join(' ') === 'make me a cgpa') return easterEggs['sudo make me a cgpa']([])
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

  man: (args: string[]): CommandResult => ({
    output: [
      '',
      `${c.cyan}Manual page: ${args[0] || '???'}${c.reset}`,
      `${c.gray}No manual entry. Have you tried 'help'?${c.reset}`,
      '',
    ].join('\r\n'),
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
        '',
        'The theme: what if the club website WAS',
        'an operating system?',
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
        `${c.gray}Type  :wq! to force save (still fake)${c.reset}`,
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

  // ── SUDO GIVE ME MARKS ──────────────────────────────────────────────────────
  'sudo give me marks': (): CommandResult => ({
    output: [
      '',
      `${c.cyan}Connecting to IISER Kolkata Academic Server...${c.reset}`,
      `${c.green}✓ Connected${c.reset}`,
      '',
      `${c.cyan}Authenticating as: slashdot-user${c.reset}`,
      `${c.green}✓ Authentication successful${c.reset}`,
      '',
      `${c.cyan}Fetching grade records...${c.reset}`,
      `${c.green}✓ Records found${c.reset}`,
      '',
      `${c.white}┌─────────────────────────────────────────┐${c.reset}`,
      `${c.white}│         25MS Grade Report 2026          │${c.reset}`,
      `${c.white}├──────────────────────┬──────────────────┤${c.reset}`,
      `${c.white}│ Course               │ Grade            │${c.reset}`,
      `${c.white}├──────────────────────┼──────────────────┤${c.reset}`,
      `${c.white}│ Mathematics I        │ ${c.green}A+${c.white}               │${c.reset}`,
      `${c.white}│ Physics I            │ ${c.green}A+${c.white}               │${c.reset}`,
      `${c.white}│ Chemistry I          │ ${c.green}A+${c.white}               │${c.reset}`,
      `${c.white}│ Biology I            │ ${c.green}A+${c.white}               │${c.reset}`,
      `${c.white}│ CS Fundamentals      │ ${c.green}A+${c.white}               │${c.reset}`,
      `${c.white}│ Web Dev Competition  │ ${c.green}A+ (obviously)${c.white}   │${c.reset}`,
      `${c.white}├──────────────────────┼──────────────────┤${c.reset}`,
      `${c.white}│ CGPA                 │ ${c.green}10.0 / 10.0${c.white}      │${c.reset}`,
      `${c.white}└──────────────────────┴──────────────────┘${c.reset}`,
      '',
      `${c.green}✓ Grades updated successfully!${c.reset}`,
      `${c.gray}(This is a fake OS. Please study for real exams.)${c.reset}`,
      '',
    ].join('\r\n'),
  }),

  // ── PROCRASTINATE ───────────────────────────────────────────────────────────
  'procrastinate': (): CommandResult => ({
    output: [
      '',
      `${c.cyan}Opening SlashTube...${c.reset}`,
      `${c.gray}The video platform for people who should be studying${c.reset}`,
      '',
      `${c.white}┌─────────────────────────────────────────────────────┐${c.reset}`,
      `${c.red}│  ▶ SlashTube                          🔴 LIVE       │${c.reset}`,
      `${c.white}├─────────────────────────────────────────────────────┤${c.reset}`,
      `${c.white}│                                                     │${c.reset}`,
      `${c.white}│  🎬 Recommended for you:                            │${c.reset}`,
      `${c.white}│                                                     │${c.reset}`,
      `${c.yellow}│  ► "How to study effectively" — 2.3M views         │${c.reset}`,
      `${c.gray}│    Watched: 0% ████░░░░░░░░░░░░░░░░░░ 0:00/45:32   │${c.reset}`,
      `${c.white}│                                                     │${c.reset}`,
      `${c.yellow}│  ► "Top 10 VS Code extensions" — 890K views        │${c.reset}`,
      `${c.gray}│    Watched: 73% ████████████████░░░░░ 33:21/45:10  │${c.reset}`,
      `${c.white}│                                                     │${c.reset}`,
      `${c.yellow}│  ► "I coded for 24 hours straight" — 5.1M views    │${c.reset}`,
      `${c.gray}│    Watched: 100% ████████████████████ completed     │${c.reset}`,
      `${c.white}│                                                     │${c.reset}`,
      `${c.yellow}│  ► "Why you can't focus" — 12M views               │${c.reset}`,
      `${c.gray}│    Watched: 45% ████████░░░░░░░░░░░░ 18:02/40:15   │${c.reset}`,
      `${c.white}│                                                     │${c.reset}`,
      `${c.yellow}│  ► "Minecraft but every block is an exam" — 3M     │${c.reset}`,
      `${c.gray}│    Watched: 12% ██░░░░░░░░░░░░░░░░░░ 4:22/36:00   │${c.reset}`,
      `${c.white}│                                                     │${c.reset}`,
      `${c.white}│  ── Your subscriptions ─────────────────────────   │${c.reset}`,
      `${c.cyan}│  • Lo-fi hip hop radio — beats to study/relax to   │${c.reset}`,
      `${c.cyan}│  • Fireship                                         │${c.reset}`,
      `${c.cyan}│  • 3Blue1Brown                                      │${c.reset}`,
      `${c.cyan}│  • ThePrimeagen                                     │${c.reset}`,
      `${c.white}│                                                     │${c.reset}`,
      `${c.white}└─────────────────────────────────────────────────────┘${c.reset}`,
      '',
      `${c.red}⚠ Warning: ${c.reset}${c.white}You have ${c.yellow}3 assignments${c.reset}${c.white} due tomorrow.${c.reset}`,
      `${c.gray}Type 'clear' to pretend this never happened.${c.reset}`,
      '',
    ].join('\r\n'),
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
      friendship: [
        `${c.green}✓ Successfully installed: friendship (1.0.0-25ms)${c.reset}`,
        `${c.gray}Now initialising warmth subsystem...${c.reset}`,
        `${c.green}✓ Warmth subsystem online.${c.reset}`,
      ],
      love: [
        `${c.green}✓ Successfully installed: love (∞.0-eternal)${c.reset}`,
        `${c.gray}Warning: love has no uninstall script.${c.reset}`,
      ],
      sleep: [
        `${c.red}E: Package 'sleep' has no installation candidate.${c.reset}`,
        `${c.gray}Hint: Have you tried closing your laptop?${c.reset}`,
      ],
      coffee: [
        `${c.green}✓ Successfully installed: coffee (4.2.0-espresso)${c.reset}`,
        `${c.yellow}Warning: May cause jitteriness and late-night commits.${c.reset}`,
      ],
      motivation: [
        `${c.red}E: Package 'motivation' is not available.${c.reset}`,
        `${c.gray}Try: apt install coffee${c.reset}`,
      ],
      vim: [
        `${c.green}✓ vim is already installed (fake-vim 2026.1)${c.reset}`,
        `${c.gray}Try typing: vim about.txt${c.reset}`,
      ],
      grades: [
        `${c.red}E: Package 'grades' has unmet dependencies.${c.reset}`,
        `${c.gray}Depends: study (>= 8h/day) — but study is not installable.${c.reset}`,
      ],
      sanity: [
        `${c.red}E: Unable to locate package 'sanity'${c.reset}`,
        `${c.gray}It was removed in the 3rd year semester update.${c.reset}`,
      ],
      brain: [
        `${c.green}✓ brain is already installed (v25MS-enhanced)${c.reset}`,
        `${c.gray}Current status: overclocked, undercooled.${c.reset}`,
      ],
      python: [
        `${c.green}✓ Successfully installed: python3 (3.12.0)${c.reset}`,
        `${c.gray}Note: This is still fake. Please use your real terminal.${c.reset}`,
      ],
    }
    const progressBar = (pkg: string) => [
      '',
      `${c.cyan}Reading package lists...${c.reset} Done`,
      `${c.cyan}Building dependency tree...${c.reset} Done`,
      `${c.cyan}Reading state information...${c.reset} Done`,
      `${c.white}The following NEW packages will be installed:${c.reset}`,
      `  ${c.green}${pkg}${c.reset}`,
      `${c.white}0 upgraded, 1 newly installed, 0 to remove and 0 not upgraded.${c.reset}`,
      `${c.white}Need to get 42 kB of archives.${c.reset}`,
      `${c.gray}Do you want to continue? [Y/n]${c.reset} Y`,
      '',
      `${c.cyan}Get:1${c.reset} http://slashdot.iiserkol.ac.in ${pkg} 1.0.0 [42 kB]`,
      `${c.cyan}Fetched 42 kB in 0s (∞ kB/s)${c.reset}`,
      `${c.white}Selecting previously unselected package ${pkg}.${c.reset}`,
      `${c.white}Preparing to unpack .../archives/${pkg}_1.0.0_amd64.deb ...${c.reset}`,
      `${c.white}Unpacking ${pkg} (1.0.0) ...${c.reset}`,
      `${c.white}Setting up ${pkg} (1.0.0) ...${c.reset}`,
      `${c.white}Processing triggers for slashdot-os...${c.reset}`,
    ]
    const extras = funPackages[pkg.toLowerCase()]
    return {
      output: [
        ...progressBar(pkg || 'unknown'),
        ...(extras ?? [
          `${c.green}✓ Successfully installed: ${pkg}${c.reset}`,
          `${c.gray}(This is a fake OS — nothing was actually installed)${c.reset}`,
        ]),
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
        `${c.gray}The authenticity of host 'iiserkol.ac.in (10.0.0.2)' can't be established.${c.reset}`,
        `${c.gray}ECDSA key fingerprint is SHA256:25MS/SlashDotOS/2026/IISERKOL.${c.reset}`,
        `${c.yellow}Are you sure you want to continue connecting? (yes/no) yes${c.reset}`,
        `${c.green}Warning: Permanently added 'iiserkol.ac.in' to the list of known hosts.${c.reset}`,
        '',
        `${c.green}Connected to IISER Kolkata Internal Network${c.reset}`,
        `${c.gray}─────────────────────────────────────────────${c.reset}`,
        '',
        `${c.cyan}  ██╗██╗███████╗███████╗██████╗ ${c.reset}`,
        `${c.cyan}  ██║██║██╔════╝██╔════╝██╔══██╗${c.reset}`,
        `${c.cyan}  ██║██║███████╗█████╗  ██████╔╝${c.reset}`,
        `${c.cyan}  ██║██║╚════██║██╔══╝  ██╔══██╗${c.reset}`,
        `${c.cyan}  ██║██║███████║███████╗██║  ██║${c.reset}`,
        `${c.cyan}  ╚═╝╚═╝╚══════╝╚══════╝╚═╝  ╚═╝${c.reset}`,
        `${c.cyan}  KOLKATA${c.reset}`,
        '',
        `${c.gray}─────────────────────────────────────────────${c.reset}`,
        `${c.white}Last login: Sat Apr 11 23:59:59 2026${c.reset}`,
        '',
        `${c.yellow}  Welcome, 25MS Batch!${c.reset}`,
        `${c.gray}  You have accessed the IISER Kolkata internal server.${c.reset}`,
        '',
        `${c.white}  ── 25MS Batch Stats ──────────────────────${c.reset}`,
        `${c.cyan}  Students enrolled   ${c.reset}${c.white}:  ~150${c.reset}`,
        `${c.cyan}  Courses completed   ${c.reset}${c.white}:  6 semesters${c.reset}`,
        `${c.cyan}  Avg sleep per night ${c.reset}${c.white}:  4.2 hours${c.reset}`,
        `${c.cyan}  Coffee consumed     ${c.reset}${c.white}:  ∞ litres${c.reset}`,
        `${c.cyan}  Assignments pending ${c.reset}${c.white}:  always${c.reset}`,
        `${c.cyan}  Bugs fixed today    ${c.reset}${c.white}:  3 (introduced 7)${c.reset}`,
        `${c.cyan}  SlashDot members    ${c.reset}${c.white}:  the coolest ones${c.reset}`,
        '',
        `${c.white}  ── Upcoming Events ───────────────────────${c.reset}`,
        `${c.green}  ★ Inter-Batch Web Dev Competition 2026${c.reset}`,
        `${c.gray}    Submission deadline: April 11, 2026${c.reset}`,
        `${c.green}  ★ SlashDot Hackathon — coming soon${c.reset}`,
        `${c.green}  ★ End semester exams — pray for us${c.reset}`,
        '',
        `${c.white}  ── Message of the Day ────────────────────${c.reset}`,
        `${c.yellow}  "We didn't sleep, we deployed."${c.reset}`,
        `${c.gray}              — 25MS Batch, 2026${c.reset}`,
        '',
        `${c.gray}─────────────────────────────────────────────${c.reset}`,
        `${c.green}batch@iiserkol:~$${c.reset} ${c.gray}exit${c.reset}`,
        `${c.cyan}Connection to iiserkol.ac.in closed.${c.reset}`,
        '',
      ].join('\r\n'),
    }
  },
}