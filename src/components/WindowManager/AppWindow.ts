import { h } from '../../../framework/render'
import { WindowState } from '../../types'
import { windowManager } from '../../store/windowManager'
import './WindowManager.css'

export function createAppWindow(win: WindowState, content: HTMLElement) {
  let isMaximized = false
  const prevSize = { x: 0, y: 0, w: 0, h: 0 }

  const closeBtn = h('button', {
    className: 'win-btn close',
    title: 'Close',
    onClick: (e: MouseEvent) => {
      e.stopPropagation()
      windowManager.closeWindow(win.id)
    }
  })

  const minimizeBtn = h('button', {
    className: 'win-btn minimize',
    title: 'Minimize',
    onClick: (e: MouseEvent) => {
      e.stopPropagation()
      windowManager.minimizeWindow(win.id)
    }
  })

  const maximizeBtn = h('button', {
    className: 'win-btn maximize',
    title: 'Maximize'
  })
  
  const titleText = h('span', { className: 'win-title' }, win.title)

  const titleBar = h('div', { className: 'win-titlebar' },
    h('div', { className: 'win-controls' }, closeBtn, minimizeBtn, maximizeBtn),
    titleText,
    h('div', { style: { width: '52px' } })
  )

  const contentArea = h('div', { className: 'win-content' }, content)

  const el = h('div', {
    id: `win-${win.id}`,
    className: `app-window ${win.isFocused ? 'focused' : ''}`,
    style: {
      left: `${win.position.x}px`,
      top: `${win.position.y}px`,
      width: `${win.size.width}px`,
      height: `${win.size.height}px`,
      zIndex: String(win.zIndex)
    },
    onClick: () => windowManager.focusWindow(win.id)
  }, titleBar, contentArea)

  // Maximize logic
  const handleMaximize = () => {
    if (!isMaximized) {
      const rect = el.getBoundingClientRect()
      prevSize.x = rect.left
      prevSize.y = rect.top
      prevSize.w = rect.width
      prevSize.h = rect.height
      el.style.left = '0px'
      el.style.top = '0px'
      el.style.width = '100vw'
      el.style.height = 'calc(100vh - 36px)'
      maximizeBtn.title = 'Restore'
      isMaximized = true
    } else {
      el.style.left = `${prevSize.x}px`
      el.style.top = `${prevSize.y}px`
      el.style.width = `${prevSize.w}px`
      el.style.height = `${prevSize.h}px`
      maximizeBtn.title = 'Maximize'
      isMaximized = false
    }
  }

  maximizeBtn.addEventListener('click', (e) => {
    e.stopPropagation()
    handleMaximize()
  })
  titleBar.addEventListener('dblclick', handleMaximize)

  // Drag logic
  titleBar.addEventListener('mousedown', (e: MouseEvent) => {
    if ((e.target as HTMLElement).closest('.win-controls')) return
    windowManager.focusWindow(win.id)
    
    // Fallback reading current position from styles
    const startX = parseInt(el.style.left) || 0
    const startY = parseInt(el.style.top) || 0
    const mouseStartX = e.clientX
    const mouseStartY = e.clientY

    const onMove = (me: MouseEvent) => {
      const dx = me.clientX - mouseStartX
      const dy = me.clientY - mouseStartY
      const newX = Math.max(0, startX + dx)
      const newY = Math.max(0, startY + dy)
      el.style.left = `${newX}px`
      el.style.top = `${newY}px`
    }

    const onUp = () => {
      const finalX = parseInt(el.style.left) || 0
      const finalY = parseInt(el.style.top) || 0
      windowManager.updatePosition(win.id, { x: finalX, y: finalY })
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
    }

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
  })

  // Expose a method to update state from store changes
  ;(el as any)._updateState = (newState: WindowState) => {
    if (newState.isFocused) {
      el.classList.add('focused')
    } else {
      el.classList.remove('focused')
    }
    
    if (newState.isMinimized) {
      el.style.display = 'none'
    } else {
      el.style.display = 'flex'
      if (!isMaximized) {
        el.style.left = `${newState.position.x}px`
        el.style.top = `${newState.position.y}px`
      }
    }
    el.style.zIndex = String(newState.zIndex)
    titleText.textContent = newState.title
    
    // We update reference to win so maximize works correctly
    Object.assign(win, newState)
  }

  return el
}
