import { CommandHandler } from '../types'
import { c, formatHeader, formatTable, formatSection } from '../utils/formatOutput'
import { NEOFETCH_ART } from '../utils/asciiArt'
import { teamMembers } from '../data/team'
import { techStack } from '../data/techStack'

export const appCommands: Record<string, CommandHandler> = {
  neofetch: () => ({
    output: [
      '',
      `${c.cyan}${NEOFETCH_ART}${c.reset}`,
      formatTable([
        ['OS',       'SlashDot OS 2026.1-LTS'],
        ['Batch',    '25MS — IISER Kolkata'],
        ['Club',     'SlashDot Programming & Design Club'],
        ['Shell',    'slashdot-sh 2026'],
        ['Terminal', 'xterm.js 5.3'],
        ['Theme',    'Terminal Green on Void Black'],
        ['Icons',    'ASCII Art Pack v3'],
        ['CPU',      'Brain @ 3.0GHz (caffeine-cooled)'],
        ['Memory',   '8GB (4GB used by browser tabs)'],
        ['Uptime',   'Since March 22, 2026'],
      ]),
      '',
      `  ${c.green}███${c.reset}${c.cyan}███${c.reset}${c.yellow}███${c.reset}${c.magenta}███${c.reset}${c.red}███${c.reset}${c.white}███${c.reset}`,
      '',
    ].join('\r\n'),
  }),

  open: (args) => {
    const target = args[0]?.toLowerCase()
    const appMap: Record<string, { appId: string; title: string; preview: string }> = {
      home:    { appId: 'home',    title: 'home.exe',    preview: 'Opening homepage...' },
      about:   { appId: 'about',   title: 'about.txt',   preview: 'Opening about page...' },
      team:    { appId: 'team',    title: 'team.db',     preview: 'Loading team roster...' },
      stack:   { appId: 'stack',   title: 'stack.log',   preview: 'Reading stack.log...' },
      contact: { appId: 'contact', title: 'contact.sh',  preview: 'Executing contact.sh...' },
    }

    if (!target || !appMap[target]) {
      return {
        output: [
          '',
          `${c.red}open: unknown application '${target}'${c.reset}`,
          `${c.gray}Available: ${Object.keys(appMap).join(', ')}${c.reset}`,
          '',
        ].join('\r\n'),
      }
    }

    const app = appMap[target]
    return {
      output: `\r\n${c.green}▶ ${app.preview}${c.reset}\r\n`,
      action: { type: 'open_window', appId: app.appId as any, title: app.title },
    }
  },

  // Shorthand aliases
  'cat about.txt': () => appCommands['open'](['about']),
  'ls team':       () => appCommands['open'](['team']),
  './contact.sh':  () => appCommands['open'](['contact']),

  // Inline team listing
  team: () => ({
    output: [
      '',
      formatHeader('25MS Team Roster'),
      '',
      ...teamMembers.map((m, i) =>
        [
          `  ${c.cyan}[${String(i + 1).padStart(2, '0')}]${c.reset} ${c.bold}${c.yellow}${m.name}${c.reset}`,
          `       ${c.gray}Role:${c.reset} ${c.white}${m.role}${c.reset}`,
          m.github ? `       ${c.gray}GitHub:${c.reset} ${c.cyan}@${m.github}${c.reset}` : '',
          `       ${c.gray}Fun fact:${c.reset} ${c.white}${m.fun_fact}${c.reset}`,
          '',
        ].filter(Boolean).join('\r\n')
      ),
    ].join('\r\n'),
    action: { type: 'open_window', appId: 'team', title: 'team.db' },
  }),

  stack: () => ({
    output: [
      '',
      formatHeader('Tech Stack — stack.log'),
      '',
      ...(['frontend', 'language', 'library', 'tooling'] as const).map(cat =>
        formatSection(cat.toUpperCase(), techStack
          .filter(t => t.category === cat)
          .map(t => `${c.cyan}${t.name}${t.version ? ` v${t.version}` : ''}${c.reset}  ${c.gray}${t.description}${c.reset}`)
        )
      ),
      '',
    ].join('\r\n'),
    action: { type: 'open_window', appId: 'stack', title: 'stack.log' },
  }),
}
