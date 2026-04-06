import { createDesktop } from './components/Desktop/Desktop'
import { createAppWindow } from './components/WindowManager/AppWindow'
import { createTerminalWindow } from './components/Terminal/TerminalWindow'
import { createCommandPalette } from './components/Desktop/CommandPalette'
import { createEasterEggs } from './components/Desktop/EasterEggs'
import { windowManager } from './store/windowManager'
import { 
  HomeApp, AboutApp, TeamApp, TechStackApp, ContactApp, NeofetchApp,
  AsteroidsApp, DNAViewerApp, FlappyBirdApp, FourierVizApp, GameOfLifeApp,
  GraphPlotterApp, GravitySimApp, MatrixCalcApp, MolecularViewerApp,
  PeriodicTableApp, PhysicsSimApp, PongApp, SlashDotAIApp, TypingTestApp,
  JokeGeneratorApp, GuestbookApp, PollApp, AchievementsApp
} from './components/Apps'
import { AppId, WindowState } from './types'
import { h } from '../framework/render'
import './App.css'

const root = document.getElementById('root')

if (root) {
  root.innerHTML = ''
  
  // 1. Create layout
  const appRoot = h('div', { className: 'app-root' })
  const desktop = createDesktop()
  const windowLayer = h('div', { className: 'window-layer' })
  
  const cmdPalette = createCommandPalette((appId, title) => windowManager.openWindow(appId as AppId, title))
  const easterEggs = createEasterEggs()

  appRoot.appendChild(desktop)
  appRoot.appendChild(windowLayer)
  appRoot.appendChild(cmdPalette)
  appRoot.appendChild(easterEggs)
  root.appendChild(appRoot)

  // 2. Map AppId to Component
  const appMap: Record<string, () => HTMLElement> = {
    home: HomeApp,
    about: AboutApp,
    team: TeamApp,
    stack: TechStackApp,
    contact: ContactApp,
    neofetch: NeofetchApp,
    asteroids: AsteroidsApp,
    dna: DNAViewerApp,
    flappy: FlappyBirdApp,
    fourier: FourierVizApp,
    gameoflife: GameOfLifeApp,
    grapher: GraphPlotterApp,
    gravity: GravitySimApp,
    'matrix-calc': MatrixCalcApp,
    molecular: MolecularViewerApp,
    periodic: PeriodicTableApp,
    physics: PhysicsSimApp,
    pong: PongApp,
    slashdotai: SlashDotAIApp,
    typing: TypingTestApp,
    jokes: JokeGeneratorApp,
    guestbook: GuestbookApp,
    poll: PollApp,
    achievements: AchievementsApp
  }

  // Effect map (obsolete, handled by easter eggs)
  const effectMap: Record<string, HTMLElement> = {}

  const onOpenWindow = (appId: AppId, title: string) => {
    windowManager.openWindow(appId, title)
  }

  // 3. Manage Windows
  const activeWindows = new Map<string, HTMLElement>()

  windowManager.subscribe((windows: WindowState[]) => {
    // Find removed windows
    for (const [id, el] of activeWindows.entries()) {
      if (!windows.find(w => w.id === id)) {
        windowLayer.removeChild(el)
        activeWindows.delete(id)
      }
    }

    // Add or update windows
    for (const w of windows) {
      let el = activeWindows.get(w.id)
      
      if (!el) {
        // Create new window
        let content: HTMLElement
        if (w.appId === 'terminal') {
          content = createTerminalWindow()
        } else {
          const factory = appMap[w.appId]
          content = factory ? factory() : h('div', null, 'App not found')
        }

        el = createAppWindow(w, content)
        activeWindows.set(w.id, el)
        windowLayer.appendChild(el)
      } else {
        // Update existing window
        if ((el as any)._updateState) {
          ;(el as any)._updateState(w)
        }
      }
    }
  })

  // 4. Handle commands from RISC-V emulator (via OSC 999 escape)
  window.addEventListener('slashdot-jscmd', ((e: CustomEvent) => {
    const payload = e.detail as string
    if (payload.startsWith('open:')) {
      const appId = payload.slice(5)
      const titleMap: Record<string, string> = {
        home: 'home.exe', about: 'about.txt', team: 'team.db',
        stack: 'stack.log', contact: 'contact.sh', neofetch: 'neofetch',
        asteroids: 'asteroids.exe', pong: 'pong.exe', periodic: 'periodic.app',
        fourier: 'fourier.app', gravity: 'gravity.app', dna: 'dna.app',
        grapher: 'grapher.app', slashdotai: 'slashdot-ai.app',
        'matrix-calc': 'matrix.app', physics: 'physics.app',
        molecular: 'molecular.app', gameoflife: 'life.exe',
        typing: 'typing.exe', flappy: 'flappy.exe',
      }
      const title = titleMap[appId] || appId
      if (appMap[appId]) {
        windowManager.openWindow(appId as AppId, title)
      }
    }
  }) as EventListener)
}
