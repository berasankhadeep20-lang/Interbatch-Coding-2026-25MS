import { useEffect, useRef, useState, useCallback } from 'react'

const CELL = 12
const COLS = 54
const ROWS = 36

type Grid = boolean[][]

function emptyGrid(): Grid {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(false))
}

function randomGrid(): Grid {
  return Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => Math.random() > 0.7)
  )
}

const PRESETS: Record<string, { name: string; cells: [number, number][] }> = {
  glider: { name: 'Glider', cells: [[1,0],[2,1],[0,2],[1,2],[2,2]] },
  pulsar: { name: 'Blinker', cells: [[0,1],[1,1],[2,1]] },
  rpentomino: { name: 'R-pentomino', cells: [[1,0],[2,0],[0,1],[1,1],[1,2]] },
}

export function GameOfLifeApp() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const gridRef = useRef<Grid>(emptyGrid())
  const frameRef = useRef<number>(0)
  const genRef = useRef(0)
  const [running, setRunning] = useState(false)
  const runningRef = useRef(false)
  const [gen, setGen] = useState(0)
  const [speed, setSpeed] = useState(100)
  const speedRef = useRef(100)
  const lastTickRef = useRef(0)

  useEffect(() => { runningRef.current = running }, [running])
  useEffect(() => { speedRef.current = speed }, [speed])

  function nextGen() {
    const grid = gridRef.current
    const next = emptyGrid()
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        let neighbors = 0
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue
            const nr = (r + dr + ROWS) % ROWS
            const nc = (c + dc + COLS) % COLS
            if (grid[nr][nc]) neighbors++
          }
        }
        if (grid[r][c]) next[r][c] = neighbors === 2 || neighbors === 3
        else next[r][c] = neighbors === 3
      }
    }
    gridRef.current = next
    genRef.current++
    setGen(genRef.current)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    function draw(ts: number) {
      ctx.fillStyle = '#0a0a0a'
      ctx.fillRect(0, 0, canvas!.width, canvas!.height)

      gridRef.current.forEach(function(row, r) {
        row.forEach(function(cell, c) {
          if (cell) {
            ctx.fillStyle = '#00ff46'
            ctx.shadowColor = '#00ff46'
            ctx.shadowBlur = 3
            ctx.fillRect(c * CELL + 1, r * CELL + 1, CELL - 2, CELL - 2)
            ctx.shadowBlur = 0
          } else {
            ctx.fillStyle = '#111'
            ctx.fillRect(c * CELL + 1, r * CELL + 1, CELL - 2, CELL - 2)
          }
        })
      })

      if (runningRef.current && ts - lastTickRef.current > speedRef.current) {
        nextGen()
        lastTickRef.current = ts
      }

      frameRef.current = requestAnimationFrame(draw)
    }

    frameRef.current = requestAnimationFrame(draw)

    const onClick = function(e: MouseEvent) {
      const rect = canvas.getBoundingClientRect()
      const c = Math.floor((e.clientX - rect.left) / CELL)
      const r = Math.floor((e.clientY - rect.top) / CELL)
      if (r >= 0 && r < ROWS && c >= 0 && c < COLS) {
        const newGrid = gridRef.current.map(row => [...row])
        newGrid[r][c] = !newGrid[r][c]
        gridRef.current = newGrid
      }
    }

    canvas.addEventListener('click', onClick)
    return () => { cancelAnimationFrame(frameRef.current); canvas.removeEventListener('click', onClick) }
  }, [])

  function loadPreset(key: string) {
    const grid = emptyGrid()
    const preset = PRESETS[key]
    const offsetR = Math.floor(ROWS / 2) - 1
    const offsetC = Math.floor(COLS / 2) - 1
    preset.cells.forEach(function([r, c]) {
      if (r + offsetR < ROWS && c + offsetC < COLS) grid[r + offsetR][c + offsetC] = true
    })
    gridRef.current = grid
    genRef.current = 0
    setGen(0)
  }

  return (
    <div style={{ background: '#0a0a0a', width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '6px 16px', borderBottom: '1px solid #1e1e1e', display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ color: '#00ff46', fontFamily: 'JetBrains Mono', fontSize: 12, fontWeight: 700 }}>Conway's Game of Life</span>
        <button onClick={function() { setRunning(r => !r) }}
          style={{ padding: '3px 10px', background: running ? '#ff505020' : '#00ff4620', border: `1px solid ${running ? '#ff5050' : '#00ff46'}`, borderRadius: 4, color: running ? '#ff5050' : '#00ff46', fontFamily: 'JetBrains Mono', fontSize: 11, cursor: 'pointer' }}>
          {running ? '⏸ Pause' : '▶ Start'}
        </button>
        <button onClick={function() { setRunning(false); gridRef.current = randomGrid(); genRef.current = 0; setGen(0) }}
          style={{ padding: '3px 10px', background: 'transparent', border: '1px solid #333', borderRadius: 4, color: '#666', fontFamily: 'JetBrains Mono', fontSize: 11, cursor: 'pointer' }}>
          🎲 Random
        </button>
        <button onClick={function() { setRunning(false); gridRef.current = emptyGrid(); genRef.current = 0; setGen(0) }}
          style={{ padding: '3px 10px', background: 'transparent', border: '1px solid #333', borderRadius: 4, color: '#666', fontFamily: 'JetBrains Mono', fontSize: 11, cursor: 'pointer' }}>
          Clear
        </button>
        {Object.entries(PRESETS).map(function([key, p]) {
          return (
            <button key={key} onClick={function() { loadPreset(key) }}
              style={{ padding: '3px 10px', background: 'transparent', border: '1px solid #333', borderRadius: 4, color: '#888', fontFamily: 'JetBrains Mono', fontSize: 11, cursor: 'pointer' }}>
              {p.name}
            </button>
          )
        })}
        <span style={{ color: '#555', fontFamily: 'JetBrains Mono', fontSize: 11, marginLeft: 'auto' }}>Gen: {gen}</span>
        <input type="range" min={50} max={500} value={speed} onChange={function(e) { setSpeed(Number(e.target.value)) }} style={{ width: 70 }} title="Speed" />
      </div>
      <canvas ref={canvasRef} width={COLS * CELL} height={ROWS * CELL} style={{ flex: 1, width: '100%', cursor: 'crosshair' }} />
      <div style={{ padding: '4px 16px', borderTop: '1px solid #1e1e1e', fontFamily: 'JetBrains Mono', fontSize: 10, color: '#333' }}>
        Click cells to toggle • Start to run • Drag slider for speed
      </div>
    </div>
  )
}