import { useState, useEffect, useRef } from 'react'
import { AppId } from '../../types'

const ALL_COMMANDS = [
  { label: 'Open Terminal',      action: 'open:terminal',    icon: '>_' },
  { label: 'Open Home',          action: 'open:home',        icon: '⌂'  },
  { label: 'Open About',         action: 'open:about',       icon: '📄' },
  { label: 'Open Team',          action: 'open:team',        icon: '👥' },
  { label: 'Open Tech Stack',    action: 'open:stack',       icon: '⚙'  },
  { label: 'Open Contact',       action: 'open:contact',     icon: '@'  },
  { label: 'Open Neofetch',      action: 'open:neofetch',    icon: '🖥' },
  { label: 'Open Clock',         action: 'open:clock',       icon: '⏰' },
  { label: 'Open Asteroids',     action: 'open:asteroids',   icon: '🚀' },
  { label: 'Open Pong',          action: 'open:pong',        icon: '🏓' },
  { label: 'Open Periodic Table',action: 'open:periodic',    icon: '⚗'  },
  { label: 'Open Fourier',       action: 'open:fourier',     icon: '〜' },
  { label: 'Open Gravity Sim',   action: 'open:gravity',     icon: '🪐' },
  { label: 'Open DNA Viewer',    action: 'open:dna',         icon: '🧬' },
  { label: 'Open Graph Plotter', action: 'open:grapher',     icon: 'f(x)'},
  { label: 'Open Physics Sim',   action: 'open:physics',     icon: '⚛'  },
  { label: 'Open Molecular',     action: 'open:molecular',   icon: '🔬' },
  { label: 'Open Matrix Calc',   action: 'open:matrix-calc', icon: '[M]'},
  { label: 'Open Game of Life',  action: 'open:gameoflife',  icon: '🔲' },
  { label: 'Open Typing Test',   action: 'open:typing',      icon: '⌨'  },
  { label: 'Open Guestbook',     action: 'open:guestbook',   icon: '📖' },
  { label: 'Open Poll',          action: 'open:poll',        icon: '📊' },
  { label: 'Open Jokes',         action: 'open:jokes',       icon: '😂' },
  { label: 'Open SlashDot AI',   action: 'open:slashdotai',  icon: '🤖' },
  { label: 'Open Achievements',  action: 'open:achievements', icon: '🏆' },
  { label: 'Open Flappy Bracket',action: 'open:flappy',       icon: '{}' },
  { label: 'Open Dungeon',       action: 'open:dungeon',      icon: '⚔'  },
  { label: 'Sudo Party 🎉',      action: 'cmd:sudo party',   icon: '🎉' },
  { label: 'Matrix Rain',        action: 'cmd:matrix',       icon: '🟩' },
  { label: 'Neofetch',           action: 'cmd:neofetch',     icon: '🖥' },
  { label: 'Toggle Fullscreen',  action: 'cmd:fullscreen',   icon: '⛶'  },
  { label: 'Rain On',            action: 'cmd:rain on',      icon: '🌧' },
  { label: 'Rain Off',           action: 'cmd:rain off',     icon: '☀'  },
  { label: 'Live Weather',       action: 'cmd:weather',      icon: '🌍' },
  { label: 'Visitor Counter',    action: 'cmd:visits',       icon: '👥' },
  { label: 'Change Theme Green', action: 'cmd:theme green',  icon: '🟢' },
  { label: 'Change Theme Amber', action: 'cmd:theme amber',  icon: '🟡' },
  { label: 'Change Theme Blue',  action: 'cmd:theme blue',   icon: '🔵' },
  { label: 'Weather',            action: 'cmd:weather',      icon: '🌤' },
  { label: 'Top Processes',      action: 'cmd:top',          icon: '📈' },
]

interface Props {
  onOpenWindow: (appId: AppId, title: string) => void
  onRunCommand: (cmd: string) => void
}

export function CommandPalette({ onOpenWindow, onRunCommand }: Props) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const filtered = query
    ? ALL_COMMANDS.filter(c => c.label.toLowerCase().includes(query.toLowerCase()))
    : ALL_COMMANDS

  useEffect(function() {
    const handler = function(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(o => !o)
        setQuery('')
        setSelected(0)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', handler)
    return function() { window.removeEventListener('keydown', handler) }
  }, [])

  useEffect(function() {
    if (open) setTimeout(function() { inputRef.current?.focus() }, 50)
  }, [open])

  function execute(action: string) {
    setOpen(false)
    setQuery('')
    if (action.startsWith('open:')) {
      const appId = action.replace('open:', '') as AppId
      const titleMap: Record<string, string> = {
        terminal: 'terminal.sh', home: 'home.exe', about: 'about.txt',
        team: 'team.db', stack: 'stack.log', contact: 'contact.sh',
        neofetch: 'neofetch', clock: 'clock.app', asteroids: 'asteroids.exe',
        pong: 'pong.exe', periodic: 'periodic.app', fourier: 'fourier.app',
        gravity: 'gravity.app', dna: 'dna.app', grapher: 'grapher.app',
        physics: 'physics.app', molecular: 'molecular.app',
        'matrix-calc': 'matrix.app', gameoflife: 'life.exe',
        typing: 'typing.exe', guestbook: 'guestbook.app',
        poll: 'poll.app', jokes: 'jokes.app', slashdotai: 'slashdot-ai.app',
        achievements: 'achievements.app', flappy: 'flappy.exe',
        dungeon: 'dungeon.exe',
      }
      onOpenWindow(appId, titleMap[appId] ?? appId)
    } else if (action.startsWith('cmd:')) {
      onRunCommand(action.replace('cmd:', ''))
    }
  }

  if (!open) return null

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
      zIndex: 9998, display: 'flex', alignItems: 'flex-start',
      justifyContent: 'center', paddingTop: '15vh',
    }} onClick={function() { setOpen(false) }}>
      <div style={{
        width: 520, background: '#111',
        border: '1px solid #00ff4640', borderRadius: 12,
        overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
      }} onClick={function(e) { e.stopPropagation() }}>

        <div style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid #1e1e1e', gap: 10 }}>
          <span style={{ color: '#555', fontSize: 14 }}>⌘</span>
          <input
            ref={inputRef}
            value={query}
            onChange={function(e) { setQuery(e.target.value); setSelected(0) }}
            onKeyDown={function(e) {
              if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(s => Math.min(s + 1, filtered.length - 1)) }
              if (e.key === 'ArrowUp')   { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)) }
              if (e.key === 'Enter' && filtered[selected]) execute(filtered[selected].action)
            }}
            placeholder="Search commands and apps..."
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#d0d0d0', fontFamily: 'JetBrains Mono', fontSize: 14 }}
          />
          <span style={{ color: '#333', fontFamily: 'JetBrains Mono', fontSize: 10 }}>ESC to close</span>
        </div>

        <div style={{ maxHeight: 360, overflowY: 'auto' }}>
          {filtered.slice(0, 12).map(function(cmd, i) {
            return (
              <div key={cmd.action}
                onClick={function() { execute(cmd.action) }}
                onMouseEnter={function() { setSelected(i) }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 16px', cursor: 'pointer',
                  background: i === selected ? '#00ff4610' : 'transparent',
                  borderLeft: `2px solid ${i === selected ? '#00ff46' : 'transparent'}`,
                  transition: 'all 0.08s',
                }}>
                <span style={{ fontSize: 14, width: 20, textAlign: 'center' }}>{cmd.icon}</span>
                <span style={{ color: i === selected ? '#00ff46' : '#aaa', fontFamily: 'JetBrains Mono', fontSize: 13 }}>{cmd.label}</span>
                {cmd.action.startsWith('open:') && <span style={{ marginLeft: 'auto', color: '#333', fontFamily: 'JetBrains Mono', fontSize: 10 }}>APP</span>}
                {cmd.action.startsWith('cmd:') && <span style={{ marginLeft: 'auto', color: '#333', fontFamily: 'JetBrains Mono', fontSize: 10 }}>CMD</span>}
              </div>
            )
          })}
          {filtered.length === 0 && (
            <div style={{ padding: '20px 16px', color: '#444', fontFamily: 'JetBrains Mono', fontSize: 12, textAlign: 'center' }}>
              No results for "{query}"
            </div>
          )}
        </div>

        <div style={{ padding: '8px 16px', borderTop: '1px solid #1e1e1e', display: 'flex', gap: 16 }}>
          <span style={{ color: '#333', fontFamily: 'JetBrains Mono', fontSize: 10 }}>↑↓ navigate</span>
          <span style={{ color: '#333', fontFamily: 'JetBrains Mono', fontSize: 10 }}>↵ select</span>
          <span style={{ color: '#333', fontFamily: 'JetBrains Mono', fontSize: 10 }}>Ctrl+K toggle</span>
        </div>
      </div>
    </div>
  )
}