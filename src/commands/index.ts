import { CommandResult } from '../types'
import { systemCommands, getCwd } from './systemCommands'
import { appCommands } from './appCommands'
import { easterEggs } from './easterEggs'
import { c, formatError, prompt } from '../utils/formatOutput'

const ALL_COMMANDS = {
  ...systemCommands,
  ...appCommands,
  ...easterEggs,
}

export const ALL_COMMAND_NAMES = Object.keys(ALL_COMMANDS)

export function parseAndRun(raw: string): CommandResult & { prompt: string } {
  const input = raw.trim()
  if (!input) return { output: '', prompt: prompt(getCwd()) }

  // Try exact match first (for multi-word commands like 'sudo party')
  if (ALL_COMMANDS[input]) {
    const result = ALL_COMMANDS[input]([])
    return { ...result, prompt: prompt(getCwd()) }
  }

  const [cmd, ...args] = input.split(/\s+/)
  const key = cmd.toLowerCase()

  // Handle 'open' with subcommand
  if (key === 'open' && appCommands['open']) {
    const result = appCommands['open'](args)
    return { ...result, prompt: prompt(getCwd()) }
  }

  if (ALL_COMMANDS[key]) {
    const result = ALL_COMMANDS[key](args)
    return { ...result, prompt: prompt(getCwd()) }
  }

  // Unknown command
  return {
    output: [
      `\r\n${c.red}${cmd}: command not found${c.reset}`,
      `${c.gray}Type 'help' to see available commands.${c.reset}`,
      '',
    ].join('\r\n'),
    prompt: prompt(getCwd()),
  }
}

export function getCompletions(partial: string): string[] {
  if (!partial) return []
  return ALL_COMMAND_NAMES.filter(name => name.startsWith(partial.toLowerCase()))
}
