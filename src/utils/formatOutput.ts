// ANSI color codes for xterm.js
export const c = {
  reset:   '\x1b[0m',
  bold:    '\x1b[1m',
  dim:     '\x1b[2m',
  green:   '\x1b[38;2;0;255;70m',
  cyan:    '\x1b[38;2;0;200;255m',
  yellow:  '\x1b[38;2;255;220;0m',
  red:     '\x1b[38;2;255;80;80m',
  white:   '\x1b[38;2;220;220;220m',
  gray:    '\x1b[38;2;120;120;120m',
  magenta: '\x1b[38;2;200;100;255m',
  orange:  '\x1b[38;2;255;160;50m',
}

export function formatTable(rows: [string, string][], labelColor = c.cyan): string {
  const maxLen = Math.max(...rows.map(([k]) => k.length))
  return rows
    .map(([k, v]) => `  ${labelColor}${k.padEnd(maxLen)}${c.reset}  ${c.white}${v}${c.reset}`)
    .join('\r\n')
}

export function formatHeader(text: string): string {
  const line = '─'.repeat(text.length + 4)
  return [
    `${c.cyan}┌${line}┐${c.reset}`,
    `${c.cyan}│  ${c.bold}${c.yellow}${text}${c.reset}${c.cyan}  │${c.reset}`,
    `${c.cyan}└${line}┘${c.reset}`,
  ].join('\r\n')
}

export function formatSection(title: string, lines: string[]): string {
  return [
    `\r\n${c.cyan}${c.bold}── ${title} ${'─'.repeat(Math.max(0, 40 - title.length))}${c.reset}`,
    ...lines.map(l => `  ${l}`),
  ].join('\r\n')
}

export function formatError(msg: string): string {
  return `${c.red}Error: ${msg}${c.reset}`
}

export function formatSuccess(msg: string): string {
  return `${c.green}✓ ${msg}${c.reset}`
}

export function prompt(cwd: string): string {
  return `${c.green}slashdot${c.reset}${c.gray}@${c.reset}${c.cyan}25ms-os${c.reset}${c.gray}:${c.reset}${c.yellow}${cwd}${c.reset}${c.white}$ ${c.reset}`
}
