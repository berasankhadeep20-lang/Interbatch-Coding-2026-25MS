import { CommandHandler } from '../types'
import { c, formatTable, formatHeader, formatSection, formatError } from '../utils/formatOutput'
import { filesystem, fileContents } from '../data/filesystem'

let cwd = '/home/slashdot'

export function getCwd() { return cwd }

export const systemCommands: Record<string, CommandHandler> = {
  help: () => ({
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
      ]),
      formatSection('System', [
        `${c.yellow}whoami${c.reset}               ${c.gray}Current user info${c.reset}`,
        `${c.yellow}uname -a${c.reset}             ${c.gray}OS information${c.reset}`,
        `${c.yellow}date${c.reset}                 ${c.gray}Current date/time${c.reset}`,
        `${c.yellow}clear${c.reset}                ${c.gray}Clear terminal${c.reset}`,
        `${c.yellow}history${c.reset}              ${c.gray}Command history${c.reset}`,
      ]),
      formatSection('Easter Eggs', [
        `${c.magenta}sudo party${c.reset}           ${c.gray}???${c.reset}`,
        `${c.magenta}matrix${c.reset}               ${c.gray}???${c.reset}`,
        `${c.magenta}cowsay <text>${c.reset}        ${c.gray}???${c.reset}`,
        `${c.magenta}sl${c.reset}                   ${c.gray}???${c.reset}`,
      ]),
      '',
    ].join('\r\n'),
  }),

  ls: (args) => {
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

  cd: (args) => {
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

  pwd: () => ({ output: `\r\n${c.yellow}${cwd}${c.reset}\r\n` }),

  cat: (args) => {
    if (!args[0]) return { output: formatError('cat: missing file operand') }
    const path = args[0].startsWith('/')
      ? args[0]
      : `${cwd}/${args[0]}`.replace('//', '/')
    const content = fileContents[path]
    if (!content) return { output: formatError(`cat: ${args[0]}: No such file or directory`) }
    return { output: `\r\n${c.white}${content}${c.reset}\r\n` }
  },

  whoami: () => ({
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

  'uname': (args) => {
    const all = args.includes('-a')
    return {
      output: all
        ? `\r\n${c.cyan}SlashDot OS${c.reset} ${c.yellow}6.8.0-25ms${c.reset} ${c.white}SMP PREEMPT 2026 x86_64 GNU/Linux${c.reset}\r\n`
        : `\r\n${c.cyan}SlashDot OS${c.reset}\r\n`,
    }
  },

  date: () => ({
    output: `\r\n${c.yellow}${new Date().toString()}${c.reset}\r\n`,
  }),
}
