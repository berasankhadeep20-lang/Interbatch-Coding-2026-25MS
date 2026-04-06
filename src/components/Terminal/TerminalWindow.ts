import { Terminal } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'
import { WebLinksAddon } from '@xterm/addon-web-links'
import { h } from '../../../framework/render'
import '@xterm/xterm/css/xterm.css'
import './TerminalWindow.css'

export function createTerminalWindow() {
  const wrapper = h('div', { className: 'xterm-wrapper' })
  const container = h('div', { className: 'terminal-container' }, wrapper)

  const term = new Terminal({
    theme: {
      background: '#0a0a0a',
      foreground: '#d0d0d0',
      cursor: '#00ff46',
      cursorAccent: '#000',
      selectionBackground: '#00ff4630',
      black: '#1a1a1a',
      green: '#00ff46',
      cyan: '#00c8ff',
      yellow: '#ffd700',
      magenta: '#c864ff',
      red: '#ff5050',
      white: '#e0e0e0',
      brightBlack: '#555',
      brightGreen: '#39ff6a',
      brightCyan: '#40d8ff',
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

  setTimeout(async () => {
    const fitAddon = new FitAddon()
    const linksAddon = new WebLinksAddon()
    term.loadAddon(fitAddon)
    term.loadAddon(linksAddon)
    term.open(wrapper)
    fitAddon.fit()

    const themeHandler = (e: Event) => {
      const { name } = (e as CustomEvent).detail
      const themeColors: Record<string, string> = {
        green: '#00ff46',
        amber: '#ffb000',
        blue: '#00b4ff',
        red: '#ff5050',
        purple: '#b464ff',
      }
      const col = themeColors[name] ?? '#00ff46'
      term.options.theme = {
        ...term.options.theme,
        cursor: col,
        green: col,
      }
    }
    window.addEventListener('slashdot-theme', themeHandler)

    const welcomeLines = [
      '\r\n\x1b[38;2;0;255;70m' +
      '  ____  _           _     ____        _    \r\n' +
      ' / ___|| | __ _ ___| |__ |  _ \\  ___ | |_  \r\n' +
      ' \\___ \\| |/ _` / __| \'_ \\| | | |/ _ \\| __| \r\n' +
      '  ___) | | (_| \\__ \\ | | | |_| | (_) | |_  \r\n' +
      ' |____/|_|\\__,_|___/_| |_|____/ \\___/ \\__| \r\n' +
      '\x1b[0m',
      '\x1b[38;2;0;200;255m  Emulated ELF Runtime v2026.1 — WASM\x1b[0m',
      '\x1b[38;2;120;120;120m  Loading initramfs from network... Please wait.\x1b[0m',
      '',
    ]
    welcomeLines.forEach(l => term.writeln(l))

    let emulatorInstance: any = null
    let inputStr = ''

    term.onKey(({ key, domEvent }) => {
      const code = domEvent.keyCode
      if (code === 13) {
        term.write('\r\n')
        if (emulatorInstance && typeof emulatorInstance._push_input === 'function') {
          for (let i = 0; i < inputStr.length; i++) {
            emulatorInstance._push_input(inputStr.charCodeAt(i))
          }
          emulatorInstance._push_input(10)
        }
        inputStr = ''
      } else if (code === 8) {
        if (inputStr.length > 0) {
          inputStr = inputStr.slice(0, -1)
          term.write('\b \b')
        }
      } else if (key.length === 1 && !domEvent.ctrlKey && !domEvent.altKey) {
        inputStr += key
        term.write(key)
      }
    })

    try {
      // @ts-ignore
      const JSZip = (await import('jszip')).default
      const resp = await fetch('./initramfs.zip')
      const buf = await resp.arrayBuffer()
      const zip = await JSZip.loadAsync(buf)

      const filesData: Record<string, Uint8Array> = {}
      for (const filename of Object.keys(zip.files)) {
        const file = zip.files[filename]
        if (!file.dir) {
          filesData[filename] = await file.async('uint8array')
        }
      }

      term.writeln('\x1b[38;2;120;120;120m  Initializing emulator...\x1b[0m')

      // @ts-ignore
      const { default: createEmulator } = await import('../../emulator-module/emulator.js')

      const emulator = await createEmulator({
        locateFile: (path: string) => {
          if (path.endsWith('.wasm')) return './os/' + path
          return path
        },
        print: () => { },
        printErr: () => { },
        preRun: [
          (Module: any) => {
            Module.FS.mkdir('/initramfs')
            for (const [filename, data] of Object.entries(filesData)) {
              const parts = filename.split('/')
              let cur = '/initramfs'
              for (let i = 0; i < parts.length - 1; i++) {
                cur += '/' + parts[i]
                try { Module.FS.mkdir(cur) } catch (e) { }
              }
              Module.FS.writeFile('/initramfs/' + filename, data)
            }

            const charOut = (charCode: number) => {
              if (charCode === 10) {
                term.write('\r\n')
              } else if (charCode !== 0) {
                term.write(String.fromCharCode(charCode))
              }
            }
            Module.FS.init(null, charOut, charOut)
          }
        ]
      })

      emulatorInstance = emulator
      term.writeln('\x1b[38;2;0;255;70m  Emulator Running!\x1b[0m')
      emulator.callMain(['/elf'])

    } catch (err) {
      term.writeln('\x1b[31mFailed to load emulated ELF runtime:\x1b[0m ' + err)
    }

    const ro = new ResizeObserver(() => fitAddon.fit())
    ro.observe(wrapper)

    ;(container as any)._cleanup = () => {
      ro.disconnect()
      term.dispose()
      window.removeEventListener('slashdot-theme', themeHandler)
    }
  }, 0)

  return container
}
