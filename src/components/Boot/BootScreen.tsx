import { useState, useEffect } from 'react'
import { useBootSequence } from '../../hooks/useBootSequence'
import { SLASHDOT_ASCII } from '../../utils/asciiArt'
import './BootScreen.css'

interface Props {
  onDone: () => void
}

function TypedAscii() {
  const full = ` ____  _           _     ____        _ 
/ ___|| | __ _ ___| |__ |  _ \\  ___ | |_
\\___ \\| |/ _\` / __| '_ \\| | | |/ _ \\| __|
 ___) | | (_| \\__ \\ | | | |_| | (_) | |_ 
|____/|_|\\__,_|___/_| |_|____/ \\___/ \\__|`
  const [displayed, setDisplayed] = useState('')
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    if (idx >= full.length) return
    const t = setTimeout(() => {
      setDisplayed(full.slice(0, idx + 1))
      setIdx(i => i + 1)
    }, 12)
    return () => clearTimeout(t)
  }, [idx, full])

  return (
    <pre className="bios-ascii">
      {displayed}
      {idx < full.length && <span style={{ opacity: Math.random() > 0.5 ? 1 : 0 }}>█</span>}
    </pre>
  )
}

export function BootScreen({ onDone }: Props) {
  const { phase, visibleLines } = useBootSequence()

  useEffect(() => {
    if (phase === 'done') onDone()
  }, [phase, onDone])

  if (phase === 'done') return null

  if (phase === 'bios') {
    return (
      <div className="boot-screen bios">
        <TypedAscii />
        <p className="bios-subtitle">SlashDot OS v2026.1-LTS — 25MS Batch Edition</p>
        <p className="bios-sub">IISER Kolkata &nbsp;|&nbsp; SlashDot Programming & Design Club</p>
        <div className="bios-bar">
          <div className="bios-bar-fill" />
        </div>
        <p className="bios-hint">Initializing system...</p>
      </div>
    )
  }

  return (
    <div className="boot-screen boot-log">
      <pre className="boot-lines">
        {visibleLines.map((line, i) => (
          <div key={i} className="boot-line">{line}</div>
        ))}
        <span className="cursor">█</span>
      </pre>
    </div>
  )
}
