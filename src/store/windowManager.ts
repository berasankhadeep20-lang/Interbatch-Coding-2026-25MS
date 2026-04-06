import { Store } from '../../framework/store'
import { WindowState, AppId } from '../types'

let nextZ = 10

class WindowManagerStore extends Store<WindowState[]> {
  openWindow(appId: AppId, title: string) {
    const prev = this.get()
    const existing = prev.find(w => w.appId === appId)
    
    if (existing) {
      this.set(prev.map(w => ({
        ...w,
        isFocused: w.id === existing.id,
        isMinimized: w.id === existing.id ? false : w.isMinimized,
        zIndex: w.id === existing.id ? ++nextZ : w.zIndex,
      })))
      return
    }

    const offset = prev.length * 30
    const newWindow: WindowState = {
      id: `${appId}-${Date.now()}`,
      appId,
      title,
      isMinimized: false,
      isFocused: true,
      position: { x: 80 + offset, y: 60 + offset },
      size: { width: 680, height: 480 },
      zIndex: ++nextZ,
    }
    this.set([...prev.map(w => ({ ...w, isFocused: false })), newWindow])
  }

  closeWindow(id: string) {
    this.set(this.get().filter(w => w.id !== id))
  }

  focusWindow(id: string) {
    this.set(this.get().map(w => ({
      ...w,
      isFocused: w.id === id,
      zIndex: w.id === id ? ++nextZ : w.zIndex,
    })))
  }

  minimizeWindow(id: string) {
    this.set(this.get().map(w =>
      w.id === id ? { ...w, isMinimized: true, isFocused: false } : w
    ))
  }

  updatePosition(id: string, position: { x: number; y: number }) {
    this.set(this.get().map(w => w.id === id ? { ...w, position } : w))
  }
}

export const windowManager = new WindowManagerStore([])
