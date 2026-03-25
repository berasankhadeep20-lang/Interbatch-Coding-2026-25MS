import { useState, useEffect } from 'react'
import { AppId, WindowState } from '../../types'
import { toggleMute, isMuted } from '../../utils/sounds'
import { Particles } from './Particles'
import './Desktop.css'

interface DesktopIcon {
  appId: AppId
  title: string
  label: string
  icon: string
}

const ICONS: DesktopIcon[] = [
  { appId: 'terminal', title: 'terminal.sh',  label: 'Terminal',   icon: '>_' },
  { appId: 'home',     title: 'home.exe',     label: 'Home',       icon: '⌂'  },
  { appId: 'about',    title: 'about.txt',    label: 'About',      icon: '📄' },
  { appId: 'team',     title: 'team.db',      label: 'Team',       icon: '👥' },
  { appId: 'stack',    title: 'stack.log',    label: 'Tech Stack', icon: '⚙'  },
  { appId: 'contact',  title: 'contact.sh',   label: 'Contact',    icon: '@'  },
  { appId: 'neofetch', title: 'neofetch',     label: 'Neofetch',   icon: '🖥' },
]

interface ContextMenu {
  x: number
  y: number
}

interface Props {
  windows: WindowState[]
  onOpenWindow: (appId: AppId, title: string) => void
  onFocusWindow: (id: string) => void
  onRestoreWindow: (id: string) => void
}

export function Desktop({ windows, onOpenWindow, onFocusWindow, onRestoreWindow }: Props) {
  const [time, setTime] = useState(new Date())
  const [contextMenu, setContextMenu] = useState<ContextMenu | null>(null)
  const [muted, setMuted] = useState(false)

  useEffect(function() {
    const t = setInterval(function() { setTime(new Date()) }, 1000)
    return function() { clearInterval(t) }
  }, [])

  useEffect(function() {
    const handler = function(e: MouseEvent) {
      const menu = document.getElementById('context-menu')
      if (menu && !menu.contains(e.target as Node)) {
        setContextMenu(null)
      }
    }
    document.addEventListener('mousedown', handler)
    return function() { document.removeEventListener('mousedown', handler) }
  }, [])

  function handleRightClick(e: React.MouseEvent) {
    e.preventDefault()
    setContextMenu({ x: e.clientX, y: e.clientY })
  }

  function handleMenuClick(action: () => void) {
    action()
    setContextMenu(null)
  }

  function handleMuteToggle() {
    const nowMuted = toggleMute()
    setMuted(nowMuted)
  }

  const timeStr = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  const dateStr = time.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })

  const minimized = windows.filter(function(w) { return w.isMinimized })
  const open = windows.filter(function(w) { return !w.isMinimized })

  return (
    <div className="desktop" onContextMenu={handleRightClick}>
      <Particles />
      <div className="scanlines" />

      <div className="desktop-icons">
        {ICONS.map(function(icon) {
          return (
            <button
              key={icon.appId}
              className="desktop-icon"
              onDoubleClick={function() { onOpenWindow(icon.appId, icon.title) }}
              title={'Double-click to open ' + icon.label}
            >
              <span className="desktop-icon-glyph">{icon.icon}</span>
              <span className="desktop-icon-label">{icon.label}</span>
            </button>
          )
        })}
      </div>

      {contextMenu && (
        <div
          id="context-menu"
          className="context-menu"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          <div className="context-menu-header">SlashDot OS</div>
          <div className="context-divider" />
          <button className="context-item" onClick={function() { handleMenuClick(function() { onOpenWindow('terminal', 'terminal.sh') }) }}>
            <span className="context-icon">&gt;_</span> Open Terminal
          </button>
          <button className="context-item" onClick={function() { handleMenuClick(function() { onOpenWindow('home', 'home.exe') }) }}>
            <span className="context-icon">⌂</span> Open Home
          </button>
          <button className="context-item" onClick={function() { handleMenuClick(function() { onOpenWindow('about', 'about.txt') }) }}>
            <span className="context-icon">📄</span> Open About
          </button>
          <button className="context-item" onClick={function() { handleMenuClick(function() { onOpenWindow('team', 'team.db') }) }}>
            <span className="context-icon">👥</span> Open Team
          </button>
          <button className="context-item" onClick={function() { handleMenuClick(function() { onOpenWindow('stack', 'stack.log') }) }}>
            <span className="context-icon">⚙</span> Open Tech Stack
          </button>
          <button className="context-item" onClick={function() { handleMenuClick(function() { onOpenWindow('contact', 'contact.sh') }) }}>
            <span className="context-icon">@</span> Open Contact
          </button>
          <div className="context-divider" />
          <button className="context-item" onClick={function() { handleMenuClick(function() { onOpenWindow('neofetch', 'neofetch') }) }}>
            <span className="context-icon">🖥</span> Neofetch
          </button>
          <div className="context-divider" />
          <button className="context-item" onClick={function() { handleMenuClick(function() { window.location.reload() }) }}>
            <span className="context-icon">↺</span> Refresh Desktop
          </button>
          <button className="context-item" onClick={function() {
            handleMenuClick(function() {
              const el = document.documentElement
              if (el.requestFullscreen) el.requestFullscreen()
            })
          }}>
            <span className="context-icon">⛶</span> Fullscreen
          </button>
          <div className="context-divider" />
          <div className="context-item disabled">
            <span className="context-icon">ℹ</span> SlashDot OS v2026.1
          </div>
          <div className="context-item disabled">
            <span className="context-icon">👤</span> 25MS — IISER Kolkata
          </div>
        </div>
      )}

      <div className="taskbar">
        <div className="taskbar-left">
          <button
            className="taskbar-logo"
            onClick={function() { onOpenWindow('terminal', 'terminal.sh') }}
            title="Open Terminal"
          >
            <span className="taskbar-logo-text">SlashDot</span>
            <span className="taskbar-logo-badge">OS</span>
          </button>
        </div>

        <div className="taskbar-center">
          {open.map(function(w) {
            return (
              <button
                key={w.id}
                className={'taskbar-item' + (w.isFocused ? ' active' : '')}
                onClick={function() { onFocusWindow(w.id) }}
              >
                {w.title}
              </button>
            )
          })}
          {minimized.map(function(w) {
            return (
              <button
                key={w.id}
                className="taskbar-item minimized"
                onClick={function() { onRestoreWindow(w.id) }}
                title={'Restore ' + w.title}
              >
                {w.title}
              </button>
            )
          })}
        </div>

        <div className="taskbar-right">
          <button
            className={'mute-btn' + (muted ? ' muted' : '')}
            onClick={handleMuteToggle}
            title={muted ? 'Unmute sounds' : 'Mute sounds'}
          >
            {muted ? '🔇' : '🔊'}
          </button>
          <span className="taskbar-date">{dateStr}</span>
          <span className="taskbar-time">{timeStr}</span>
        </div>
      </div>
    </div>
  )
}