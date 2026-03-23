import { useState, useCallback } from 'react'
import { WindowState, AppId } from '../types'

let nextZ = 10

export function useWindowManager() {
  const [windows, setWindows] = useState<WindowState[]>([])

  const openWindow = useCallback((appId: AppId, title: string) => {
    setWindows(prev => {
      // If already open, just focus it
      const existing = prev.find(w => w.appId === appId)
      if (existing) {
        return prev.map(w => ({
          ...w,
          isFocused: w.id === existing.id,
          isMinimized: w.id === existing.id ? false : w.isMinimized,
          zIndex: w.id === existing.id ? ++nextZ : w.zIndex,
        }))
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
      return [...prev.map(w => ({ ...w, isFocused: false })), newWindow]
    })
  }, [])

  const closeWindow = useCallback((id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id))
  }, [])

  const focusWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => ({
      ...w,
      isFocused: w.id === id,
      zIndex: w.id === id ? ++nextZ : w.zIndex,
    })))
  }, [])

  const minimizeWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w =>
      w.id === id ? { ...w, isMinimized: true, isFocused: false } : w
    ))
  }, [])

  const updatePosition = useCallback((id: string, position: { x: number; y: number }) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, position } : w))
  }, [])

  return { windows, openWindow, closeWindow, focusWindow, minimizeWindow, updatePosition }
}
