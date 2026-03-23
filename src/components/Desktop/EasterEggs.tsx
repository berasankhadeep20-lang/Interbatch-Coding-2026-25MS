import { useEffect, useRef } from 'react'
import { MATRIX_CHARS } from '../../utils/asciiArt'
import './EasterEggs.css'

export function Confetti({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3500)
    return () => clearTimeout(t)
  }, [onDone])

  const pieces = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 1.5,
    dur: 2 + Math.random() * 1.5,
    color: ['#00ff46','#00c8ff','#ffd700','#c864ff','#ff5050'][i % 5],
    size: 6 + Math.random() * 8,
    char: ['●','■','▲','◆','★'][i % 5],
  }))

  return (
    <div className="confetti-overlay">
      {pieces.map(p => (
        <span
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            color: p.color,
            fontSize: p.size,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.dur}s`,
          }}
        >
          {p.char}
        </span>
      ))}
      <div className="party-text">🎉 PARTY MODE 🎉</div>
    </div>
  )
}

export function MatrixRain({ onDone }: { onDone: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const cols = Math.floor(canvas.width / 16)
    const drops = Array(cols).fill(1)

    const draw = () => {
      ctx.fillStyle = 'rgba(0,0,0,0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = '#00ff46'
      ctx.font = '14px JetBrains Mono, monospace'
      drops.forEach((y, i) => {
        const char = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)]
        ctx.fillStyle = i % 7 === 0 ? '#aaffbb' : '#00ff46'
        ctx.fillText(char, i * 16, y * 16)
        if (y * 16 > canvas.height && Math.random() > 0.975) drops[i] = 0
        drops[i]++
      })
    }

    const interval = setInterval(draw, 50)
    const timeout = setTimeout(() => { clearInterval(interval); onDone() }, 5000)
    return () => { clearInterval(interval); clearTimeout(timeout) }
  }, [onDone])

  return (
    <div className="matrix-overlay" onClick={onDone} title="Click to exit">
      <canvas ref={canvasRef} />
      <p className="matrix-hint">Click anywhere to exit the Matrix</p>
    </div>
  )
}