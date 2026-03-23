import { useState, useCallback } from 'react'
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

function AppContent({ appId }: { appId: AppId }) {
  switch (appId) {
    case 'home':    return <HomeApp />
    case 'about':   return <AboutApp />
    case 'team':    return <TeamApp />
    case 'stack':   return <TechStackApp />
    case 'contact': return <ContactApp />
    case 'neofetch':return <NeofetchApp />
    default:        return null
  }
}

export default function App() {
  const [booted, setBooted] = useState(false)
  const [easterEgg, setEasterEgg] = useState<string | null>(null)

  const {
    windows,
    openWindow,
    closeWindow,
    focusWindow,
    minimizeWindow,
    updatePosition,
  } = useWindowManager()

  const handleOpenWindow = useCallback((appId: AppId, title: string) => {
    openWindow(appId, title)
  }, [openWindow])

  const handleEasterEgg = useCallback((effect: string) => {
    setEasterEgg(effect)
  }, [])

  const handleRestoreWindow = useCallback((id: string) => {
    focusWindow(id)
    // Un-minimize by refocusing (useWindowManager sets isMinimized=false on focus)
    const w = windows.find(w => w.id === id)
    if (w) openWindow(w.appId, w.title)
  }, [windows, focusWindow, openWindow])

  if (!booted) {
    return <BootScreen onDone={() => setBooted(true)} />
  }

  return (
    <div className="app-root">
      <Desktop
        windows={windows}
        onOpenWindow={handleOpenWindow}
        onFocusWindow={focusWindow}
        onRestoreWindow={handleRestoreWindow}
      />

      {/* Window layer */}
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
                <AppContent appId={win.appId} />
              )}
            </AppWindow>
          ))}
        </AnimatePresence>
      </div>

      {/* Easter eggs */}
      {easterEgg === 'confetti' && (
        <Confetti onDone={() => setEasterEgg(null)} />
      )}
      {easterEgg === 'matrix' && (
        <MatrixRain onDone={() => setEasterEgg(null)} />
      )}
    </div>
  )
}
