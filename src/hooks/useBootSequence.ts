import { useState, useEffect } from 'react'
import { BOOT_LINES } from '../utils/asciiArt'

export type BootPhase = 'bios' | 'booting' | 'done'

export function useBootSequence() {
  const [phase, setPhase] = useState<BootPhase>('bios')
  const [visibleLines, setVisibleLines] = useState<string[]>([])
  const [lineIndex, setLineIndex] = useState(0)

  // BIOS screen for 1.2s, then start scrolling boot lines
  useEffect(() => {
    const t = setTimeout(() => setPhase('booting'), 1200)
    return () => clearTimeout(t)
  }, [])

  // Scroll through boot lines
  useEffect(() => {
    if (phase !== 'booting') return
    if (lineIndex >= BOOT_LINES.length) {
      const t = setTimeout(() => setPhase('done'), 600)
      return () => clearTimeout(t)
    }
    const delay = BOOT_LINES[lineIndex] === '' ? 80 : 60
    const t = setTimeout(() => {
      setVisibleLines(prev => [...prev, BOOT_LINES[lineIndex]])
      setLineIndex(i => i + 1)
    }, delay)
    return () => clearTimeout(t)
  }, [phase, lineIndex])

  return { phase, visibleLines }
}
