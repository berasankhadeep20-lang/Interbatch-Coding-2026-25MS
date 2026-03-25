import { useRef, useState, ReactNode } from 'react'
import { motion } from 'framer-motion'
import { WindowState } from '../../types'
import './WindowManager.css'

interface Props {
  window: WindowState
  children: ReactNode
  onClose: (id: string) => void
  onFocus: (id: string) => void
  onMinimize: (id: string) => void
  onMove: (id: string, pos: { x: number; y: number }) => void
}

export function AppWindow({ window: win, children, onClose, onFocus, onMinimize, onMove }: Props) {
  const dragStart = useRef<{ mx: number; my: number; wx: number; wy: number } | null>(null)
const [isMaximized, setIsMaximized] = useState(false)
const prevSize = useRef({ position: { x: 0, y: 0 }, size: { width: 680, height: 480 } })

  function handleMaximize() {
    const el = document.getElementById(`win-${win.id}`)
    if (!el) return
    if (!isMaximized) {
      prevSize.current = {
        position: { x: win.position.x, y: win.position.y },
        size: { width: win.size.width, height: win.size.height },
      }
      el.style.left = '0px'
      el.style.top = '0px'
      el.style.width = '100vw'
      el.style.height = 'calc(100vh - 36px)'
      setIsMaximized(true)
    } else {
      el.style.left = prevSize.current.position.x + 'px'
      el.style.top = prevSize.current.position.y + 'px'
      el.style.width = prevSize.current.size.width + 'px'
      el.style.height = prevSize.current.size.height + 'px'
      setIsMaximized(false)
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.win-controls')) return
    onFocus(win.id)
    dragStart.current = {
      mx: e.clientX,
      my: e.clientY,
      wx: win.position.x,
      wy: win.position.y,
    }

    const onMove = (me: MouseEvent) => {
      if (!dragStart.current) return
      const dx = me.clientX - dragStart.current.mx
      const dy = me.clientY - dragStart.current.my
      const newX = Math.max(0, dragStart.current.wx + dx)
      const newY = Math.max(0, dragStart.current.wy + dy)
      onMove_window(win.id, { x: newX, y: newY })
    }

    // We need reference to the prop — using closure trick
    function onMove_window(id: string, pos: { x: number; y: number }) {
      win.position.x = pos.x
      win.position.y = pos.y
      const el = document.getElementById(`win-${id}`)
      if (el) {
        el.style.left = pos.x + 'px'
        el.style.top = pos.y + 'px'
      }
    }

    const onUp = () => {
      if (dragStart.current) {
        const el = document.getElementById(`win-${win.id}`)
        if (el) {
          const left = parseInt(el.style.left) || win.position.x
          const top = parseInt(el.style.top) || win.position.y
          onMove(win.id, { x: left, y: top })
        }
      }
      dragStart.current = null
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
    }

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
  }

  if (win.isMinimized) return null

  return (
    <motion.div
      id={`win-${win.id}`}
      className={`app-window ${win.isFocused ? 'focused' : ''}`}
      style={{
        left: win.position.x,
        top: win.position.y,
        width: win.size.width,
        height: win.size.height,
        zIndex: win.zIndex,
      }}
      initial={{ opacity: 0, scale: 0.92, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, y: 10 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      onClick={() => onFocus(win.id)}
    >
      {/* Title bar */}
      <div className="win-titlebar" onMouseDown={handleMouseDown} onDoubleClick={handleMaximize}>
        <div className="win-controls">
          <button
            className="win-btn close"
            onClick={(e) => { e.stopPropagation(); onClose(win.id) }}
            title="Close"
          />
          <button
            className="win-btn minimize"
            onClick={(e) => { e.stopPropagation(); onMinimize(win.id) }}
            title="Minimize"
          />
          <button
            className="win-btn maximize"
            title={isMaximized ? 'Restore' : 'Maximize'}
            onClick={function(e) { e.stopPropagation(); handleMaximize() }}
          />
        </div>
        <span className="win-title">{win.title}</span>
        <div style={{ width: 52 }} />
      </div>

      {/* Content */}
      <div className="win-content">
        {children}
      </div>
    </motion.div>
  )
}
