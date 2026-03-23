// Virtual filesystem — gives illusion of a real OS
export const filesystem: Record<string, string[]> = {
  '/': ['home', 'etc', 'usr', 'var', 'dev'],
  '/home': ['slashdot'],
  '/home/slashdot': ['about.txt', 'team.db', 'stack.log', 'contact.sh', 'projects', 'README.md'],
  '/home/slashdot/projects': ['web-terminal.exe', 'particle-sim.bin', 'algo-visualizer.run'],
  '/etc': ['os-release', 'hostname', 'motd'],
  '/usr': ['bin', 'lib', 'share'],
  '/usr/bin': ['neofetch', 'cowsay', 'sl', 'matrix'],
  '/dev': ['null', 'zero', 'random'],
  '/var': ['log'],
  '/var/log': ['slashdot.log', 'competition.log'],
}

export const fileContents: Record<string, string> = {
  '/home/slashdot/README.md': `# SlashDot OS — 25MS Batch
  
Welcome to the SlashDot OS terminal. 
Type 'help' to see available commands.
  
Built with love by the 25MS batch for the
Inter-Batch Website Development Competition 2026.`,

  '/home/slashdot/about.txt': `SlashDot OS is a browser-based OS simulator
built for the Inter-Batch Website Development
Competition 2026, organized by SlashDot Club
at IISER Kolkata.

The theme: what if the club's website WAS 
an operating system?`,

  '/etc/os-release': `NAME="SlashDot OS"
VERSION="2026.1-LTS"
BATCH="25MS"
COLLEGE="IISER Kolkata"
CLUB="SlashDot"
BUILD_DATE="2026-04-11"`,

  '/etc/hostname': `slashdot-25ms`,

  '/etc/motd': `Welcome to SlashDot OS.
Type 'help' for available commands.
All systems nominal. Coffee levels: critical.`,
}
