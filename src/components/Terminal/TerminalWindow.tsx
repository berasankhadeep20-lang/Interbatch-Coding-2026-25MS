import { useEffect, useRef } from 'react'
import { Terminal } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'
import { WebLinksAddon } from '@xterm/addon-web-links'
import { parseAndRun, getCompletions } from '../../commands'
import { prompt } from '../../utils/formatOutput'
import { getCwd } from '../../commands/systemCommands'
import { AppId } from '../../types'
import { playKeyClick, playEnter } from '../../utils/sounds'
import '@xterm/xterm/css/xterm.css'
import './TerminalWindow.css'

interface Props {
  onOpenWindow: (appId: AppId, title: string) => void
  onEasterEgg: (effect: string) => void
}

export function TerminalWindow({ onOpenWindow, onEasterEgg }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const termRef = useRef<Terminal | null>(null)
  const fitAddonRef = useRef<FitAddon | null>(null)
  const inputRef = useRef('')
  const historyRef = useRef<string[]>([])
  const histIdxRef = useRef(-1)

  useEffect(() => {
    if (!containerRef.current) return

    const term = new Terminal({
      theme: {
        background:  '#0a0a0a',
        foreground:  '#d0d0d0',
        cursor:      '#00ff46',
        cursorAccent:'#000',
        selectionBackground: '#00ff4630',
        black:       '#1a1a1a',
        green:       '#00ff46',
        cyan:        '#00c8ff',
        yellow:      '#ffd700',
        magenta:     '#c864ff',
        red:         '#ff5050',
        white:       '#e0e0e0',
        brightBlack: '#555',
        brightGreen: '#39ff6a',
        brightCyan:  '#40d8ff',
        brightWhite: '#ffffff',
      },
      fontFamily: "'JetBrains Mono', 'Share Tech Mono', monospace",
      fontSize: 13,
      lineHeight: 1.5,
      cursorBlink: true,
      cursorStyle: 'block',
      scrollback: 1000,
      convertEol: true,
    })

    const fitAddon = new FitAddon()
    const linksAddon = new WebLinksAddon()
    term.loadAddon(fitAddon)
    term.loadAddon(linksAddon)
    term.open(containerRef.current)
    fitAddon.fit()

    // Listen for theme changes
    const themeHandler = (e: Event) => {
      const { name } = (e as CustomEvent).detail
      const themeColors: Record<string, string> = {
        green:  '#00ff46',
        amber:  '#ffb000',
        blue:   '#00b4ff',
        red:    '#ff5050',
        purple: '#b464ff',
      }
      const col = themeColors[name] ?? '#00ff46'
      term.options.theme = {
        ...term.options.theme,
        cursor: col,
        green:  col,
      }
    }
    window.addEventListener('slashdot-theme', themeHandler)

    termRef.current = term
    fitAddonRef.current = fitAddon

    const welcomeLines = [
      '\r\n\x1b[38;2;0;255;70m' +
      '  ____  _           _     ____        _    \r\n' +
      ' / ___|| | __ _ ___| |__ |  _ \\  ___ | |_  \r\n' +
      ' \\___ \\| |/ _` / __| \'_ \\| | | |/ _ \\| __| \r\n' +
      '  ___) | | (_| \\__ \\ | | | |_| | (_) | |_  \r\n' +
      ' |____/|_|\\__,_|___/_| |_|____/ \\___/ \\__| \r\n' +
      '\x1b[0m',
      '\x1b[38;2;0;200;255m  SlashDot OS v2026.1 — 25MS Batch Edition\x1b[0m',
      '\x1b[38;2;120;120;120m  IISER Kolkata  |  Inter-Batch Web Dev Competition 2026\x1b[0m',
      '',
      "\x1b[38;2;255;220;0m  Type 'help' to see all commands.\x1b[0m",
      "\x1b[38;2;120;120;120m  Type 'open home' to launch the homepage app.\x1b[0m",
      '',
    ]
    welcomeLines.forEach(function(l) { term.writeln(l) })
    term.write(prompt(getCwd()))

    term.onKey(function({ key, domEvent }) {
      const code = domEvent.keyCode

      if (code === 13) {
        playEnter()
        const input = inputRef.current.trim()
        term.writeln('')
        if (input) {
          historyRef.current.unshift(input)
          histIdxRef.current = -1
          ;(window as any).__slashdotHistory = historyRef.current
          const result = parseAndRun(input)
          if (result.output) term.write(result.output)
          if (result.action) {
            if (result.action.type === 'open_window') {
              onOpenWindow(result.action.appId, result.action.title)
            } else if (result.action.type === 'clear') {
              term.clear()
            } else if (result.action.type === 'easter_egg') {
              onEasterEgg(result.action.effect)
            }
          }
        }
        inputRef.current = ''
        term.write(prompt(getCwd()))
        return
      }

      if (code === 8) {
        if (inputRef.current.length > 0) {
          inputRef.current = inputRef.current.slice(0, -1)
          term.write('\b \b')
          playKeyClick()
        }
        return
      }

      if (code === 38) {
        const newIdx = Math.min(histIdxRef.current + 1, historyRef.current.length - 1)
        if (historyRef.current[newIdx] !== undefined) {
          term.write('\r' + prompt(getCwd()) + ' '.repeat(inputRef.current.length) + '\r' + prompt(getCwd()))
          histIdxRef.current = newIdx
          inputRef.current = historyRef.current[newIdx]
          term.write(inputRef.current)
        }
        return
      }

      if (code === 40) {
        const newIdx = histIdxRef.current - 1
        term.write('\r' + prompt(getCwd()) + ' '.repeat(inputRef.current.length) + '\r' + prompt(getCwd()))
        if (newIdx < 0) {
          histIdxRef.current = -1
          inputRef.current = ''
        } else {
          histIdxRef.current = newIdx
          inputRef.current = historyRef.current[newIdx]
          term.write(inputRef.current)
        }
        return
      }

      if (code === 9) {
        domEvent.preventDefault()
        const completions = getCompletions(inputRef.current)
        if (completions.length === 1) {
          const suffix = completions[0].slice(inputRef.current.length)
          inputRef.current += suffix
          term.write(suffix)
        } else if (completions.length > 1) {
          term.writeln('')
          term.writeln('\x1b[38;2;120;120;120m' + completions.join('  ') + '\x1b[0m')
          term.write(prompt(getCwd()) + inputRef.current)
        }
        return
      }

      if (domEvent.ctrlKey && domEvent.key === 'c') {
        term.writeln('^C')
        inputRef.current = ''
        term.write(prompt(getCwd()))
        return
      }

      if (domEvent.ctrlKey && domEvent.key === 'l') {
        term.clear()
        term.write(prompt(getCwd()))
        inputRef.current = ''
        return
      }

      if (!domEvent.ctrlKey && !domEvent.altKey && key.length === 1) {
        inputRef.current += key
        term.write(key)
        playKeyClick()
      }
    })

    const ro = new ResizeObserver(function() { fitAddon.fit() })
    ro.observe(containerRef.current)

    return function() {
      ro.disconnect()
      term.dispose()
      window.removeEventListener('slashdot-theme', themeHandler)
    }

  }, [onOpenWindow, onEasterEgg])

  return (
    <div className="terminal-container">
      <div ref={containerRef} className="xterm-wrapper" />
    </div>
  )
}