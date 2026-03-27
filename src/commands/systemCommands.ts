import { CommandHandler, CommandResult } from '../types'
import { c, formatTable, formatHeader, formatSection, formatError } from '../utils/formatOutput'
import { filesystem, fileContents } from '../data/filesystem'

let cwd = '/home/slashdot'

export function getCwd() { return cwd }

export const systemCommands: Record<string, CommandHandler> = {
  help: (): CommandResult => ({
    output: [
      '',
      formatHeader('SlashDot OS — Command Reference'),
      '',
      formatSection('Navigation', [
        `${c.green}ls${c.reset} [path]          ${c.gray}List directory contents${c.reset}`,
        `${c.green}cd${c.reset} <path>           ${c.gray}Change directory${c.reset}`,
        `${c.green}pwd${c.reset}                 ${c.gray}Print working directory${c.reset}`,
        `${c.green}cat${c.reset} <file>          ${c.gray}Read a file${c.reset}`,
      ]),
      formatSection('Apps', [
        `${c.cyan}neofetch${c.reset}             ${c.gray}System info + logos${c.reset}`,
        `${c.cyan}open home${c.reset}            ${c.gray}Open homepage${c.reset}`,
        `${c.cyan}open about${c.reset}           ${c.gray}Open about page${c.reset}`,
        `${c.cyan}open team${c.reset}            ${c.gray}Meet the 25MS team${c.reset}`,
        `${c.cyan}open stack${c.reset}           ${c.gray}Tech stack details${c.reset}`,
        `${c.cyan}open contact${c.reset}         ${c.gray}Contact information${c.reset}`,
        `${c.cyan}open clock${c.reset}           ${c.gray}Live clock app${c.reset}`,
      ]),
      formatSection('Easter Eggs', [
        `${c.magenta}sudo party${c.reset}                      ${c.gray}???${c.reset}`,
        `${c.magenta}matrix${c.reset}                          ${c.gray}???${c.reset}`,
        `${c.magenta}hack${c.reset}                            ${c.gray}???${c.reset}`,
        `${c.magenta}nyan${c.reset}                            ${c.gray}???${c.reset}`,
        `${c.magenta}vim <file>${c.reset}                      ${c.gray}???${c.reset}`,
        `${c.magenta}apt install <pkg>${c.reset}               ${c.gray}???${c.reset}`,
        `${c.magenta}npm install${c.reset}                     ${c.gray}???${c.reset}`,
        `${c.magenta}ssh batch@iiserkol${c.reset}              ${c.gray}???${c.reset}`,
        `${c.magenta}git log${c.reset}                         ${c.gray}???${c.reset}`,
        `${c.magenta}git blame${c.reset}                       ${c.gray}???${c.reset}`,
        `${c.magenta}ls -la${c.reset}                          ${c.gray}???${c.reset}`,
        `${c.magenta}cat /etc/passwd${c.reset}                 ${c.gray}???${c.reset}`,
        `${c.magenta}import antigravity${c.reset}              ${c.gray}???${c.reset}`,
        `${c.magenta}sudo chmod 777 life${c.reset}             ${c.gray}???${c.reset}`,
        `${c.magenta}curl iiserkol.ac.in${c.reset}             ${c.gray}???${c.reset}`,
        `${c.magenta}sudo apt-get install iiser-wifi${c.reset} ${c.gray}???${c.reset}`,
        `${c.magenta}./run_exam.sh${c.reset}                   ${c.gray}???${c.reset}`,
        `${c.magenta}cowsay <text>${c.reset}                   ${c.gray}???${c.reset}`,
        `${c.magenta}sl${c.reset}                              ${c.gray}???${c.reset}`,
        `${c.magenta}fortune${c.reset}                         ${c.gray}???${c.reset}`,
        `${c.magenta}quote${c.reset}                           ${c.gray}???${c.reset}`,
        `${c.magenta}procrastinate${c.reset}                   ${c.gray}???${c.reset}`,
        `${c.magenta}weather${c.reset}                         ${c.gray}???${c.reset}`,
        `${c.magenta}top${c.reset}                             ${c.gray}???${c.reset}`,
        `${c.magenta}members${c.reset}                         ${c.gray}???${c.reset}`,
        `${c.magenta}changelog${c.reset}                       ${c.gray}???${c.reset}`,
        `${c.magenta}panic${c.reset}                           ${c.gray}???${c.reset}`,
        `${c.magenta}leetcode${c.reset}                        ${c.gray}???${c.reset}`,
        `${c.magenta}iiser wifi${c.reset}                      ${c.gray}???${c.reset}`,
        `${c.magenta}exam <subject>${c.reset}                  ${c.gray}???${c.reset}`,
        `${c.magenta}sudo give me marks${c.reset}              ${c.gray}???${c.reset}`,
        `${c.magenta}sudo give me a job${c.reset}              ${c.gray}???${c.reset}`,
        `${c.magenta}sudo make me a sandwich${c.reset}         ${c.gray}???${c.reset}`,
        `${c.magenta}sudo make me coffee${c.reset}             ${c.gray}???${c.reset}`,
        `${c.magenta}sudo make me a cgpa${c.reset}             ${c.gray}???${c.reset}`,
        `${c.magenta}yes${c.reset}                             ${c.gray}???${c.reset}`,
        `${c.magenta}banner <text>${c.reset}                   ${c.gray}???${c.reset}`,
      ]),
      formatSection('Terminal', [
        `${c.cyan}cursor block/bar/underline${c.reset}         ${c.gray}Change cursor style${c.reset}`,
        `${c.cyan}theme <name>${c.reset}                       ${c.gray}Switch terminal theme${c.reset}`,
        `${c.cyan}font+${c.reset}                              ${c.gray}Increase font size${c.reset}`,
        `${c.cyan}font-${c.reset}                              ${c.gray}Decrease font size${c.reset}`,
        `${c.cyan}crt on/off${c.reset}                         ${c.gray}Toggle CRT scanlines${c.reset}`,
        `${c.cyan}wallpaper <name>${c.reset}                   ${c.gray}Change desktop wallpaper${c.reset}`,
        `${c.cyan}fullscreen${c.reset}                         ${c.gray}Enter fullscreen${c.reset}`,
        `${c.cyan}exit-fullscreen${c.reset}                    ${c.gray}Exit fullscreen${c.reset}`,
        `${c.cyan}stats${c.reset}                              ${c.gray}Session statistics${c.reset}`,
        `${c.cyan}uptime${c.reset}                             ${c.gray}System uptime${c.reset}`,
        `${c.cyan}cal${c.reset}                                ${c.gray}Calendar${c.reset}`,
        `${c.cyan}tree${c.reset}                               ${c.gray}File tree${c.reset}`,
        `${c.cyan}echo <text>${c.reset}                        ${c.gray}Print text${c.reset}`,
        `${c.cyan}banner <text>${c.reset}                      ${c.gray}Big ASCII text${c.reset}`,
        `${c.cyan}reset${c.reset}                              ${c.gray}Reset terminal${c.reset}`,
      ]),
      formatSection('System', [
        `${c.yellow}whoami${c.reset}                ${c.gray}Current user info${c.reset}`,
        `${c.yellow}uname -a${c.reset}              ${c.gray}OS information${c.reset}`,
        `${c.yellow}date${c.reset}                  ${c.gray}Current date/time${c.reset}`,
        `${c.yellow}history${c.reset}               ${c.gray}Command history${c.reset}`,
        `${c.yellow}ping <host>${c.reset}           ${c.gray}Ping a host${c.reset}`,
        `${c.yellow}fullscreen${c.reset}            ${c.gray}Enter fullscreen mode${c.reset}`,
        `${c.yellow}exit-fullscreen${c.reset}       ${c.gray}Exit fullscreen mode${c.reset}`,
        `${c.yellow}toggle-fullscreen${c.reset}     ${c.gray}Toggle fullscreen${c.reset}`,
        `${c.yellow}clear${c.reset}                 ${c.gray}Clear terminal${c.reset}`,
      ]),
      '',
    ].join('\r\n'),
  }),

  ls: (args: string[]): CommandResult => {
    const path = args[0]
      ? (args[0].startsWith('/') ? args[0] : `${cwd}/${args[0]}`.replace('//', '/'))
      : cwd
    const contents = filesystem[path]
    if (!contents) return { output: formatError(`ls: cannot access '${path}': No such file or directory`) }

    const formatted = contents.map(item => {
      const fullPath = `${path}/${item}`.replace('//', '/')
      const isDir = !!filesystem[fullPath]
      return isDir
        ? `${c.cyan}${c.bold}${item}/${c.reset}`
        : `${c.white}${item}${c.reset}`
    })

    return { output: '\r\n' + formatted.join('    ') + '\r\n' }
  },

  cd: (args: string[]): CommandResult => {
    if (!args[0] || args[0] === '~') {
      cwd = '/home/slashdot'
      return { output: '' }
    }
    const newPath = args[0].startsWith('/')
      ? args[0]
      : `${cwd}/${args[0]}`.replace('//', '/')
    const normalized = newPath.replace(/\/\.$/, '').replace(/\/[^/]+\/\.\.$/, '') || '/'

    if (filesystem[normalized]) {
      cwd = normalized
      return { output: '' }
    }
    return { output: formatError(`cd: ${args[0]}: No such file or directory`) }
  },

  pwd: (): CommandResult => ({ output: `\r\n${c.yellow}${cwd}${c.reset}\r\n` }),

  cat: (args: string[]): CommandResult => {
    if (!args[0]) return { output: formatError('cat: missing file operand') }
    const path = args[0].startsWith('/')
      ? args[0]
      : `${cwd}/${args[0]}`.replace('//', '/')
    const content = fileContents[path]
    if (!content) return { output: formatError(`cat: ${args[0]}: No such file or directory`) }
    return { output: `\r\n${c.white}${content}${c.reset}\r\n` }
  },

  whoami: (): CommandResult => ({
    output: [
      '',
      formatTable([
        ['User',    'slashdot-user'],
        ['Batch',   '25MS — IISER Kolkata'],
        ['Club',    'SlashDot Programming & Design Club'],
        ['Role',    'Competitor — Inter-Batch Web Dev 2026'],
        ['Shell',   '/usr/bin/slashdot-sh'],
      ]),
      '',
    ].join('\r\n'),
  }),

  uname: (args: string[]): CommandResult => {
    const all = args.includes('-a')
    return {
      output: all
        ? `\r\n${c.cyan}SlashDot OS${c.reset} ${c.yellow}6.8.0-25ms${c.reset} ${c.white}SMP PREEMPT 2026 x86_64 GNU/Linux${c.reset}\r\n`
        : `\r\n${c.cyan}SlashDot OS${c.reset}\r\n`,
    }
  },

  date: (): CommandResult => ({
    output: `\r\n${c.yellow}${new Date().toString()}${c.reset}\r\n`,
  }),

  man: (args: string[]): CommandResult => {
    const cmd = args[0]?.toLowerCase()

    const pages: Record<string, string[]> = {
      ls: [
        `${c.cyan}NAME${c.reset}`,
        `  ls — list directory contents`,
        '',
        `${c.cyan}SYNOPSIS${c.reset}`,
        `  ls [path]`,
        '',
        `${c.cyan}DESCRIPTION${c.reset}`,
        `  Lists files and directories in the current or given path.`,
        `  Directories are shown in cyan with a trailing /.`,
        '',
        `${c.cyan}EXAMPLES${c.reset}`,
        `  ls                   list current directory`,
        `  ls /home/slashdot    list specific path`,
        `  ls team              list team folder`,
      ],
      cd: [
        `${c.cyan}NAME${c.reset}`,
        `  cd — change directory`,
        '',
        `${c.cyan}SYNOPSIS${c.reset}`,
        `  cd [path]`,
        '',
        `${c.cyan}DESCRIPTION${c.reset}`,
        `  Changes the current working directory.`,
        `  Use ~ or no argument to go to home directory.`,
        '',
        `${c.cyan}EXAMPLES${c.reset}`,
        `  cd /home/slashdot    go to home`,
        `  cd ..                go up one level`,
        `  cd ~                 go to home`,
      ],
      cat: [
        `${c.cyan}NAME${c.reset}`,
        `  cat — read file contents`,
        '',
        `${c.cyan}SYNOPSIS${c.reset}`,
        `  cat <file>`,
        '',
        `${c.cyan}DESCRIPTION${c.reset}`,
        `  Prints the contents of a file to the terminal.`,
        '',
        `${c.cyan}EXAMPLES${c.reset}`,
        `  cat about.txt        read about file`,
        `  cat README.md        read readme`,
        `  cat /etc/os-release  read OS info`,
      ],
      ping: [
        `${c.cyan}NAME${c.reset}`,
        `  ping — send ICMP packets to a host`,
        '',
        `${c.cyan}SYNOPSIS${c.reset}`,
        `  ping <host>`,
        '',
        `${c.cyan}DESCRIPTION${c.reset}`,
        `  Sends fake ICMP packets and shows response times.`,
        `  Known hosts: slashdot, iiser, localhost, google.com`,
        '',
        `${c.cyan}EXAMPLES${c.reset}`,
        `  ping slashdot        ping SlashDot server`,
        `  ping iiser           ping IISER server`,
        `  ping google.com      ping Google`,
      ],
      neofetch: [
        `${c.cyan}NAME${c.reset}`,
        `  neofetch — display system information`,
        '',
        `${c.cyan}SYNOPSIS${c.reset}`,
        `  neofetch`,
        '',
        `${c.cyan}DESCRIPTION${c.reset}`,
        `  Displays system info alongside ASCII art.`,
        `  Shows OS, batch, terminal, theme, and color palette.`,
        `  Also displays official IISER Kolkata and SlashDot logos.`,
      ],
      theme: [
        `${c.cyan}NAME${c.reset}`,
        `  theme — switch terminal color theme`,
        '',
        `${c.cyan}SYNOPSIS${c.reset}`,
        `  theme <name>`,
        '',
        `${c.cyan}DESCRIPTION${c.reset}`,
        `  Changes the terminal accent color and prompt color.`,
        '',
        `${c.cyan}AVAILABLE THEMES${c.reset}`,
        `  green    Terminal Green (default)`,
        `  amber    Phosphor Amber`,
        `  blue     Cyan Blue`,
        `  red      Red Alert`,
        `  purple   Purple Haze`,
      ],
      vim: [
        `${c.cyan}NAME${c.reset}`,
        `  vim — fake text editor`,
        '',
        `${c.cyan}SYNOPSIS${c.reset}`,
        `  vim [file]`,
        '',
        `${c.cyan}DESCRIPTION${c.reset}`,
        `  Opens a file in the fake vim editor.`,
        `  You cannot actually edit anything. This is a fake OS.`,
        '',
        `${c.cyan}COMMANDS${c.reset}`,
        `  :q     quit vim`,
        `  :wq    save and quit`,
        `  :wq!   force save and quit`,
        `  :q!    discard and quit`,
        '',
        `${c.cyan}KNOWN FILES${c.reset}`,
        `  about.txt    README.md    untitled`,
      ],
      ssh: [
        `${c.cyan}NAME${c.reset}`,
        `  ssh — fake secure shell client`,
        '',
        `${c.cyan}SYNOPSIS${c.reset}`,
        `  ssh <user>@<host>`,
        '',
        `${c.cyan}DESCRIPTION${c.reset}`,
        `  Connects to a remote server over SSH (fake).`,
        `  Only iiserkol and 25ms hosts are supported.`,
        '',
        `${c.cyan}EXAMPLES${c.reset}`,
        `  ssh batch@iiserkol   connect to IISER server`,
        `  ssh batch@25ms       same as above`,
      ],
      git: [
        `${c.cyan}NAME${c.reset}`,
        `  git — fake version control`,
        '',
        `${c.cyan}SYNOPSIS${c.reset}`,
        `  git <command>`,
        '',
        `${c.cyan}COMMANDS${c.reset}`,
        `  git log      show commit history`,
        `  git blame    blame someone for bugs`,
        `  git status   show working tree status`,
        `  git commit   record changes (fake)`,
        `  git push     push to remote (fake)`,
      ],
      open: [
        `${c.cyan}NAME${c.reset}`,
        `  open — open an application window`,
        '',
        `${c.cyan}SYNOPSIS${c.reset}`,
        `  open <app>`,
        '',
        `${c.cyan}AVAILABLE APPS${c.reset}`,
        `  home      Homepage`,
        `  about     About page`,
        `  team      Team page`,
        `  stack     Tech stack`,
        `  contact   Contact page`,
        `  clock     Clock app`,
      ],
    }

    if (!cmd) {
      return {
        output: [
          '',
          `${c.cyan}What manual page do you want?${c.reset}`,
          `${c.gray}Available: ${Object.keys(pages).join(', ')}${c.reset}`,
          '',
        ].join('\r\n'),
      }
    }

    const page = pages[cmd]
    if (!page) {
      return {
        output: [
          '',
          `${c.red}No manual entry for ${cmd}${c.reset}`,
          `${c.gray}Available: ${Object.keys(pages).join(', ')}${c.reset}`,
          '',
        ].join('\r\n'),
      }
    }

    return {
      output: [
        '',
        `${c.gray}SLASHDOT OS MANUAL — ${cmd.toUpperCase()}${c.reset}`,
        `${c.gray}${'─'.repeat(40)}${c.reset}`,
        '',
        ...page.map(l => `  ${l}`),
        '',
        `${c.gray}${'─'.repeat(40)}${c.reset}`,
        `${c.gray}SlashDot OS Manual  April 2026${c.reset}`,
        '',
      ].join('\r\n'),
    }
  },

  history: (): CommandResult => {
    const hist = ((window as any).__slashdotHistory as string[]) ?? []
    if (hist.length === 0) {
      return { output: `\r\n${c.gray}No commands in history yet.${c.reset}\r\n` }
    }
    return {
      output: [
        '',
        ...hist
          .slice()
          .reverse()
          .map((cmd: string, i: number) =>
            `  ${c.gray}${String(i + 1).padStart(3)}${c.reset}  ${c.white}${cmd}${c.reset}`
          ),
        '',
      ].join('\r\n'),
    }
  },

  ping: (args: string[]): CommandResult => {
    const host = args[0] || 'slashdot.iiserkol.ac.in'
    const knownHosts: Record<string, string> = {
      'slashdot.iiserkol.ac.in': '10.0.0.1',
      'slashdot':                '10.0.0.1',
      'iiserkol.ac.in':          '10.0.0.2',
      'iiser':                   '10.0.0.2',
      'localhost':               '127.0.0.1',
      '127.0.0.1':               '127.0.0.1',
      'google.com':              '142.250.195.46',
      'github.com':              '140.82.121.4',
    }
    const ip = knownHosts[host.toLowerCase()] ?? '192.168.1.1'
    const times = Array.from({ length: 4 }, () =>
      (Math.random() * 2 + 0.2).toFixed(3)
    )
    const avg = (times.reduce((a, b) => a + parseFloat(b), 0) / times.length).toFixed(3)
    return {
      output: [
        '',
        `${c.cyan}PING ${host} (${ip}) 56(84) bytes of data.${c.reset}`,
        ...times.map((t, i) =>
          `${c.white}64 bytes from ${ip}: icmp_seq=${i + 1} ttl=64 time=${t} ms${c.reset}`
        ),
        '',
        `${c.gray}--- ${host} ping statistics ---${c.reset}`,
        `${c.white}4 packets transmitted, 4 received, ${c.green}0% packet loss${c.reset}`,
        `${c.white}rtt min/avg/max = ${Math.min(...times.map(Number)).toFixed(3)}/${avg}/${Math.max(...times.map(Number)).toFixed(3)} ms${c.reset}`,
        '',
      ].join('\r\n'),
    }
  },

  // ── FULLSCREEN ──────────────────────────────────────────────────────────────
  fullscreen: (): CommandResult => {
    const el = document.documentElement
    if (el.requestFullscreen) {
      el.requestFullscreen()
      return {
        output: [
          '',
          `${c.green}✓ Entering fullscreen mode...${c.reset}`,
          `${c.gray}Type 'exit-fullscreen' or press Esc to exit.${c.reset}`,
          '',
        ].join('\r\n'),
      }
    }
    return {
      output: `\r\n${c.red}Fullscreen not supported in this browser.${c.reset}\r\n`,
    }
  },

  'exit-fullscreen': (): CommandResult => {
    if (document.fullscreenElement) {
      document.exitFullscreen()
      return {
        output: [
          '',
          `${c.yellow}Exiting fullscreen mode...${c.reset}`,
          '',
        ].join('\r\n'),
      }
    }
    return {
      output: `\r\n${c.gray}Not currently in fullscreen mode.${c.reset}\r\n`,
    }
  },

  // ── TOGGLE FULLSCREEN ───────────────────────────────────────────────────────
  'toggle-fullscreen': (): CommandResult => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      return {
        output: `\r\n${c.green}✓ Fullscreen on${c.reset}\r\n`,
      }
    } else {
      document.exitFullscreen()
      return {
        output: `\r\n${c.yellow}Fullscreen off${c.reset}\r\n`,
      }
    }
  },
}
