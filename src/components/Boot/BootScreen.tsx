import { useBootSequence } from '../../hooks/useBootSequence'
import { SLASHDOT_ASCII } from '../../utils/asciiArt'
import './BootScreen.css'

interface Props {
  onDone: () => void
}

export function BootScreen({ onDone }: Props) {
  const { phase, visibleLines } = useBootSequence()

  if (phase === 'done') {
    onDone()
    return null
  }

  if (phase === 'bios') {
    return (
      <div className="boot-screen bios">
        <pre className="bios-ascii">{SLASHDOT_ASCII}</pre>
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
