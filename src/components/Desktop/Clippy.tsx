import { useState, useEffect, useRef } from 'react'

interface ClippyMessage {
  text: string
  duration?: number
}

const TIPS: ClippyMessage[] = [
  { text: "It looks like you're building an OS! Have you tried typing 'help' in the terminal?" },
  { text: "Did you know? You can press Ctrl+K to search all commands instantly!" },
  { text: "Tip: Type 'sudo party' in the terminal for a surprise! 🎉" },
  { text: "It looks like you haven't tried 'neofetch' yet. Give it a go!" },
  { text: "Did you know? You can drag windows anywhere on the desktop!" },
  { text: "Tip: Double-click the title bar to maximize a window!" },
  { text: "It looks like you might be procrastinating. Type 'procrastinate' to commit fully." },
  { text: "Did you know? Type 'weather' to see real live weather at IISER Kolkata!" },
  { text: "Tip: Try 'ssh batch@iiserkol' to connect to the IISER server!" },
  { text: "It looks like you're having fun! Type 'open asteroids' to have more fun." },
  { text: "Did you know? You can change the terminal theme with 'theme amber'!" },
  { text: "Tip: Type 'open dungeon' for an ASCII dungeon crawler RPG!" },
  { text: "It looks like you need coffee. Type 'sudo make me coffee' immediately." },
  { text: "Did you know? Type 'open slashdotai' to chat with SlashDot AI!" },
  { text: "Tip: Right-click anywhere on the desktop for a context menu!" },
  { text: "It looks like you haven't checked your achievements! Type 'open achievements'." },
  { text: "Did you know? Type 'matrix' for a screensaver effect!" },
  { text: "Tip: Type 'git log' to see the project commit history!" },
  { text: "It looks like you're a power user! Try 'open gravity' to simulate planets." },
  { text: "Did you know? Type 'visits' to see how many people have visited this OS!" },
]

const CLIPPY_FRAMES = [
  `
   /\\___/\\
  (  o o  )
  =( Y )=
    )   (
   (_)-(_)`,
  `
   /\\___/\\
  (  - -  )
  =( Y )=
    )   (
   (_)-(_)`,
  `
   /\\___/\\
  (  ^ ^  )
  =( Y )=
    )   (
   (_)-(_)`,
]

export function Clippy() {
  const [visible, setVisible] = useState(false)
  const [message, setMessage] = useState('')
  const [frame, setFrame] = useState(0)
  const [minimized, setMinimized] = useState(false)
  const [pos, setPos] = useState({ x: window.innerWidth - 180, y: window.innerHeight - 280 })
  const dragRef = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null)
  const tipIndexRef = useRef(0)
  const frameRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Show Clippy after 5 seconds
  useEffect(function() {
    const t = setTimeout(function() {
      setVisible(true)
      showTip()
    }, 5000)
    return function() { clearTimeout(t) }
  }, [])

  // Animate Clippy face
  useEffect(function() {
    frameRef.current = setInterval(function() {
      setFrame(f => (f + 1) % CLIPPY_FRAMES.length)
    }, 2000)
    return function() { if (frameRef.current) clearInterval(frameRef.current) }
  }, [])

  // Show a tip every 30 seconds
  useEffect(function() {
    if (!visible) return
    const t = setInterval(function() {
      showTip()
    }, 30000)
    return function() { clearInterval(t) }
  }, [visible])

  // Listen for clippy events from other parts of the app
  useEffect(function() {
    const handler = function(e: Event) {
      const { text } = (e as CustomEvent).detail
      setMessage(text)
      setMinimized(false)
    }
    window.addEventListener('slashdot-clippy', handler)
    return function() { window.removeEventListener('slashdot-clippy', handler) }
  }, [])

  function showTip() {
    const tip = TIPS[tipIndexRef.current % TIPS.length]
    tipIndexRef.current++
    setMessage(tip.text)
    setMinimized(false)
  }

  function handleMouseDown(e: React.MouseEvent) {
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      origX: pos.x,
      origY: pos.y,
    }
    const onMove = function(me: MouseEvent) {
      if (!dragRef.current) return
      setPos({
        x: Math.max(0, Math.min(window.innerWidth - 160, dragRef.current.origX + me.clientX - dragRef.current.startX)),
        y: Math.max(0, Math.min(window.innerHeight - 200, dragRef.current.origY + me.clientY - dragRef.current.startY)),
      })
    }
    const onUp = function() {
      dragRef.current = null
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
    }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
  }

  if (!visible) return null

  return (
    <div style={{
      position: 'fixed',
      left: pos.x,
      top: pos.y,
      zIndex: 8500,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 6,
      userSelect: 'none',
    }}>

      {/* Speech bubble */}
      {!minimized && message && (
        <div style={{
          background: '#fffde7',
          border: '2px solid #f9a825',
          borderRadius: 10,
          padding: '10px 12px',
          maxWidth: 200,
          position: 'relative',
          boxShadow: '2px 2px 8px rgba(0,0,0,0.4)',
        }}>
          <button
            onClick={function() { setMinimized(true) }}
            style={{
              position: 'absolute', top: 4, right: 6,
              background: 'transparent', border: 'none',
              cursor: 'pointer', color: '#999', fontSize: 12, lineHeight: 1,
            }}
          >✕</button>
          <p style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 11,
            color: '#333',
            margin: 0,
            lineHeight: 1.5,
            paddingRight: 12,
          }}>{message}</p>
          <div style={{
            position: 'absolute',
            bottom: -10,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: '8px solid transparent',
            borderRight: '8px solid transparent',
            borderTop: '10px solid #f9a825',
          }} />
        </div>
      )}

      {/* Clippy body */}
      <div
        onMouseDown={handleMouseDown}
        style={{ cursor: 'grab', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <pre style={{
          color: '#ffd700',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 11,
          lineHeight: 1.3,
          margin: 0,
          textShadow: '0 0 8px #ffd70080',
          background: '#111',
          border: '1px solid #ffd70040',
          borderRadius: 8,
          padding: '6px 10px',
        }}>
          {CLIPPY_FRAMES[frame]}
        </pre>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
          <button
            onClick={showTip}
            style={{
              padding: '2px 8px',
              background: '#ffd70020',
              border: '1px solid #ffd70060',
              borderRadius: 4,
              color: '#ffd700',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 9,
              cursor: 'pointer',
            }}
            title="Get a tip"
          >
            💡 Tip
          </button>
          <button
            onClick={function() { setVisible(false) }}
            style={{
              padding: '2px 8px',
              background: '#ff505020',
              border: '1px solid #ff505060',
              borderRadius: 4,
              color: '#ff5050',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 9,
              cursor: 'pointer',
            }}
            title="Dismiss Clippy"
          >
            ✕
          </button>
        </div>

        <p style={{
          color: '#444',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 9,
          margin: '2px 0 0',
          textAlign: 'center',
        }}>
          Clippy v2026
        </p>
      </div>
    </div>
  )
}