import { CommandHandler } from '../types'
import { c } from '../utils/formatOutput'

export const easterEggs: Record<string, CommandHandler> = {
  'sudo party': () => ({
    output: `\r\n${c.yellow}🎉 PARTY MODE ACTIVATED${c.reset}\r\n${c.magenta}Launching confetti cannon...${c.reset}\r\n`,
    action: { type: 'easter_egg', effect: 'confetti' },
  }),

  matrix: () => ({
    output: `\r\n${c.green}Entering the Matrix...${c.reset}\r\n`,
    action: { type: 'easter_egg', effect: 'matrix' },
  }),

  sl: () => ({
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

  cowsay: (args) => {
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

  'sudo rm -rf /': () => ({
    output: [
      '',
      `${c.red}rm: it is dangerous to operate recursively on '/'${c.reset}`,
      `${c.red}rm: use --no-preserve-root to override this failsafe${c.reset}`,
      `${c.gray}(Nice try though 😄)${c.reset}`,
      '',
    ].join('\r\n'),
  }),

  sudo: (args) => {
    if (args[0] === 'party') return easterEggs['sudo party']([])
    if (args[0] === 'rm')    return easterEggs['sudo rm -rf /']([])
    return {
      output: `\r\n${c.red}sudo: ${args.join(' ')}: command not allowed${c.reset}\r\n${c.gray}This incident will be reported.${c.reset}\r\n`,
    }
  },

  fortune: () => {
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

  man: (args) => ({
    output: [
      '',
      `${c.cyan}Manual page: ${args[0] || '???'}${c.reset}`,
      `${c.gray}No manual entry. Have you tried 'help'?${c.reset}`,
      '',
    ].join('\r\n'),
  }),

  // ── VIM ─────────────────────────────────────────────────────────────────────
  vim: (args) => {
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
      'untitled': [
        '',
      ],
    }

    const lines = fileContents[file] ?? [`"${file}" [New File]`]

    return {
      output: [
        '',
        `${c.white}${lines.map((l, i) => `${c.gray}${String(i + 1).padStart(3)} ${c.reset}${c.white}${l}`).join('\r\n')}${c.reset}`,
        '',
        `${c.gray}${'~\r\n~\r\n~\r\n~'.split('\r\n').map(l => `    ${l}`).join('\r\n')}${c.reset}`,
        '',
        `${c.cyan}-- INSERT -- ${c.reset}${c.gray}(fake vim — type :q to quit, :wq to save & quit)${c.reset}`,
        '',
        `${c.green}"${file}" ${lines.length}L, ${lines.join('').length}C${c.reset}`,
        '',
        `${c.gray}Hint: You cannot actually edit this file.${c.reset}`,
        `${c.gray}Type  :q   to quit${c.reset}`,
        `${c.gray}Type  :wq  to save and quit${c.reset}`,
        `${c.gray}Type  :wq! to force save (still fake)${c.reset}`,
        '',
      ].join('\r\n'),
      action: { type: 'easter_egg', effect: 'vim' },
    }
  },

  ':q': () => ({
    output: `\r\n${c.yellow}Exiting vim...${c.reset}\r\n${c.green}Welcome back to reality.${c.reset}\r\n`,
  }),

  ':wq': () => ({
    output: `\r\n${c.green}File saved! (not really, this is a fake OS)${c.reset}\r\n${c.yellow}Exiting vim...${c.reset}\r\n`,
  }),

  ':wq!': () => ({
    output: `\r\n${c.green}Force saved! (still fake)${c.reset}\r\n${c.yellow}Exiting vim...${c.reset}\r\n`,
  }),

  ':q!': () => ({
    output: `\r\n${c.red}Discarding changes...${c.reset}\r\n${c.yellow}Exiting vim...${c.reset}\r\n`,
  }),
}