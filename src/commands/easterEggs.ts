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

  sudo: (args: string[]): CommandResult => {
    if (args[0] === 'party') return easterEggs['sudo party']([])
    if (args[0] === 'rm')    return easterEggs['sudo rm -rf /']([])
    if (args[0] === 'apt')   return easterEggs['apt'](['install', ...args.slice(2)])
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
}