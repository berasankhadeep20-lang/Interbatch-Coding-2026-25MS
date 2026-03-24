let muted = false

export function toggleMute(): boolean {
  muted = !muted
  return muted
}

export function isMuted(): boolean {
  return muted
}

function getCtx(): AudioContext {
  return new (window.AudioContext || (window as any).webkitAudioContext)()
}

export function playKeyClick() {
  if (muted) return
  try {
    const ac = getCtx()
    const osc = ac.createOscillator()
    const gain = ac.createGain()
    osc.connect(gain)
    gain.connect(ac.destination)
    osc.frequency.setValueAtTime(800, ac.currentTime)
    osc.frequency.exponentialRampToValueAtTime(400, ac.currentTime + 0.03)
    gain.gain.setValueAtTime(0.08, ac.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.03)
    osc.start(ac.currentTime)
    osc.stop(ac.currentTime + 0.03)
  } catch (e) {}
}

export function playEnter() {
  if (muted) return
  try {
    const ac = getCtx()
    const osc = ac.createOscillator()
    const gain = ac.createGain()
    osc.connect(gain)
    gain.connect(ac.destination)
    osc.type = 'square'
    osc.frequency.setValueAtTime(300, ac.currentTime)
    osc.frequency.exponentialRampToValueAtTime(150, ac.currentTime + 0.08)
    gain.gain.setValueAtTime(0.06, ac.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.08)
    osc.start(ac.currentTime)
    osc.stop(ac.currentTime + 0.08)
  } catch (e) {}
}

export function playWindowOpen() {
  if (muted) return
  try {
    const ac = getCtx()
    const osc = ac.createOscillator()
    const gain = ac.createGain()
    osc.connect(gain)
    gain.connect(ac.destination)
    osc.type = 'sine'
    osc.frequency.setValueAtTime(440, ac.currentTime)
    osc.frequency.exponentialRampToValueAtTime(880, ac.currentTime + 0.1)
    gain.gain.setValueAtTime(0.1, ac.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.15)
    osc.start(ac.currentTime)
    osc.stop(ac.currentTime + 0.15)
  } catch (e) {}
}

export function playWindowClose() {
  if (muted) return
  try {
    const ac = getCtx()
    const osc = ac.createOscillator()
    const gain = ac.createGain()
    osc.connect(gain)
    gain.connect(ac.destination)
    osc.type = 'sine'
    osc.frequency.setValueAtTime(880, ac.currentTime)
    osc.frequency.exponentialRampToValueAtTime(220, ac.currentTime + 0.1)
    gain.gain.setValueAtTime(0.08, ac.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.12)
    osc.start(ac.currentTime)
    osc.stop(ac.currentTime + 0.12)
  } catch (e) {}
}

export function playBoot() {
  if (muted) return
  try {
    const ac = getCtx()
    const notes = [261, 329, 392, 523]
    notes.forEach(function(freq, i) {
      const osc = ac.createOscillator()
      const gain = ac.createGain()
      osc.connect(gain)
      gain.connect(ac.destination)
      osc.type = 'sine'
      const t = ac.currentTime + i * 0.12
      osc.frequency.setValueAtTime(freq, t)
      gain.gain.setValueAtTime(0.12, t)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15)
      osc.start(t)
      osc.stop(t + 0.15)
    })
  } catch (e) {}
}

export function playParty() {
  if (muted) return
  try {
    const ac = getCtx()
    const notes = [523, 659, 784, 1047, 784, 659, 523]
    notes.forEach(function(freq, i) {
      const osc = ac.createOscillator()
      const gain = ac.createGain()
      osc.connect(gain)
      gain.connect(ac.destination)
      osc.type = 'sine'
      const t = ac.currentTime + i * 0.1
      osc.frequency.setValueAtTime(freq, t)
      gain.gain.setValueAtTime(0.1, t)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12)
      osc.start(t)
      osc.stop(t + 0.12)
    })
  } catch (e) {}
}