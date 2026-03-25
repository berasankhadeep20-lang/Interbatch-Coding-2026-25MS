import { useState, useCallback, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { BootScreen } from './components/Boot/BootScreen'
import { Desktop } from './components/Desktop/Desktop'
import { AppWindow } from './components/WindowManager/AppWindow'
import { TerminalWindow } from './components/Terminal/TerminalWindow'
import { Confetti, MatrixRain } from './components/Desktop/EasterEggs'
import {
  HomeApp, AboutApp, TeamApp,
  TechStackApp, ContactApp, NeofetchApp,
} from './components/Apps'
import { useWindowManager } from './hooks/useWindowManager'
import { AppId } from './types'
import './App.css'

function LoadingBar() {
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      background: '#0a0a0a',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 16,
      fontFamily: "'JetBrains Mono', monospace",
    }}>
      <p style={{ color: '#00ff46', fontSize: 13 }}>Loading...</p>
      <div style={{
        width: 200,
        height: 4,
        background: '#1a1a1a',
        borderRadius: 2,
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          background: '#00ff46',
          borderRadius: 2,
          animation: 'loadbar 0.6s ease-out forwards',
          boxShadow: '0 0 8px #00ff4680',
        }} />
      </div>
    </div>
  )
}

function AppContentWithLoader({ appId }: { appId: AppId }) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(t)
  }, [appId])

  if (loading) return <LoadingBar />
  return <AppContent appId={appId} />
}

function AppContent({ appId }: { appId: AppId }) {
  switch (appId) {
    case 'home':     return <HomeApp />
    case 'about':    return <AboutApp />
    case 'team':     return <TeamApp />
    case 'stack':    return <TechStackApp />
    case 'contact':  return <ContactApp />
    case 'neofetch': return <NeofetchApp />
    default:         return null
  }
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])
  return isMobile
}

export default function App() {
  const [booted, setBooted] = useState(false)
  const [easterEgg, setEasterEgg] = useState<string | null>(null)
  const [mobilePage, setMobilePage] = useState<AppId | null>(null)
  const isMobile = useIsMobile()

  const {
    windows,
    openWindow,
    closeWindow,
    focusWindow,
    minimizeWindow,
    updatePosition,
  } = useWindowManager()

  const handleOpenWindow = useCallback((appId: AppId, title: string) => {
    if (isMobile) {
      setMobilePage(appId === 'terminal' ? null : appId)
    } else {
      openWindow(appId, title)
    }
  }, [openWindow, isMobile])

  const handleEasterEgg = useCallback((effect: string) => {
    setEasterEgg(effect)
  }, [])

  const handleRestoreWindow = useCallback((id: string) => {
    focusWindow(id)
    const w = windows.find(w => w.id === id)
    if (w) openWindow(w.appId, w.title)
  }, [windows, focusWindow, openWindow])

  // Screensaver — auto Matrix after 60s idle
  useEffect(() => {
    if (!booted) return
    let timer: ReturnType<typeof setTimeout>
    const reset = () => {
      clearTimeout(timer)
      timer = setTimeout(() => setEasterEgg('matrix'), 60000)
    }
    const events = ['mousemove', 'keydown', 'mousedown', 'touchstart']
    events.forEach(e => window.addEventListener(e, reset))
    reset()
    return () => {
      clearTimeout(timer)
      events.forEach(e => window.removeEventListener(e, reset))
    }
  }, [booted])

  if (!booted) {
    return <BootScreen onDone={() => setBooted(true)} />
  }

  // ── Mobile layout ──────────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <div className="app-root">
        {mobilePage ? (
          // Mobile app view
          <div className="mobile-app-view">
            <div className="mobile-app-header">
              <button
                className="mobile-back-btn"
                onClick={function() { setMobilePage(null) }}
              >
                {'← back'}
              </button>
              <span className="mobile-app-title">{mobilePage}</span>
            </div>
            <div className="mobile-app-content">
              <AppContent appId={mobilePage} />
            </div>
          </div>
        ) : (
          // Mobile terminal view
          <div className="mobile-terminal-view">
            <div className="mobile-terminal-header">
              <span className="mobile-header-logo">SlashDot OS</span>
              <span className="mobile-header-badge">25MS</span>
            </div>
            <div className="mobile-terminal-body">
              <TerminalWindow
                onOpenWindow={handleOpenWindow}
                onEasterEgg={handleEasterEgg}
              />
            </div>
            <div className="mobile-nav">
              {([
                ['home',    '⌂',  'Home'],
                ['about',   '📄', 'About'],
                ['team',    '👥', 'Team'],
                ['stack',   '⚙',  'Stack'],
                ['contact', '@',  'Contact'],
              ] as [AppId, string, string][]).map(function(item) {
                return (
                  <button
                    key={item[0]}
                    className={'mobile-nav-btn' + (mobilePage === item[0] ? ' active' : '')}
                    onClick={function() { setMobilePage(item[0]) }}
                  >
                    <span className="mobile-nav-icon">{item[1]}</span>
                    <span className="mobile-nav-label">{item[2]}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {easterEgg === 'confetti' && (
          <Confetti onDone={function() { setEasterEgg(null) }} />
        )}
        {easterEgg === 'matrix' && (
          <MatrixRain onDone={function() { setEasterEgg(null) }} />
        )}
      </div>
    )
  }

  // ── Desktop layout ─────────────────────────────────────────────────────────
  return (
    <div className="app-root">
      <Desktop
        windows={windows}
        onOpenWindow={handleOpenWindow}
        onFocusWindow={focusWindow}
        onRestoreWindow={handleRestoreWindow}
      />
      <div className="window-layer">
        <AnimatePresence>
          {windows.map(win => (
            <AppWindow
              key={win.id}
              window={win}
              onClose={closeWindow}
              onFocus={focusWindow}
              onMinimize={minimizeWindow}
              onMove={updatePosition}
            >
              {win.appId === 'terminal' ? (
                <TerminalWindow
                  onOpenWindow={handleOpenWindow}
                  onEasterEgg={handleEasterEgg}
                />
              ) : (
                <AppContentWithLoader appId={win.appId} />
              )}
            </AppWindow>
          ))}
        </AnimatePresence>
      </div>
      {easterEgg === 'confetti' && (
        <Confetti onDone={function() { setEasterEgg(null) }} />
      )}
      {easterEgg === 'matrix' && (
        <MatrixRain onDone={function() { setEasterEgg(null) }} />
      )}
    </div>
  )
}