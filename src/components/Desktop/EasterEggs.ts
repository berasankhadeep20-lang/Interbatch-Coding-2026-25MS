import { h } from '../../../framework/render'

const MATRIX_CHARS = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズヅブヅエェケセテネヘメレゲゼデベペオォコソトノホモロヲゴゾドボポヴッン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'

export function createEasterEggs() {
  const container = h('div', { className: 'easter-eggs-layer', style: { position: 'fixed', inset: '0', pointerEvents: 'none', zIndex: '9997' } })

  function startConfetti() {
    const overlay = h('div', { style: { position: 'absolute', inset: '0', overflow: 'hidden' } })
    const colors = ['#00ff46','#00c8ff','#ffd700','#c864ff','#ff5050']
    const chars = ['●','■','▲','◆','★']

    const style = document.createElement('style')
    style.innerHTML = `
      @keyframes confetti-fall {
        0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
        100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
      }
      @keyframes party-text-pop {
        0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
        20% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
        40% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        80% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        100% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; }
      }
    `
    overlay.appendChild(style)

    for (let i = 0; i < 60; i++) {
      const p = h('span', {
        style: {
          position: 'absolute', top: '-10%', left: `${Math.random() * 100}%`,
          color: colors[i % 5], fontSize: `${6 + Math.random() * 8}px`,
          animation: `confetti-fall ${2 + Math.random() * 1.5}s linear ${Math.random() * 1.5}s forwards`
        }
      }, chars[i % 5])
      overlay.appendChild(p)
    }

    const text = h('div', {
      style: {
        position: 'absolute', top: '50%', left: '50%', color: '#ffd700',
        fontFamily: 'JetBrains Mono', fontSize: '48px', fontWeight: 'bold',
        textShadow: '0 0 20px rgba(255, 215, 0, 0.5)', whiteSpace: 'nowrap',
        animation: 'party-text-pop 3s ease-in-out forwards'
      }
    }, '🎉 PARTY MODE 🎉')
    overlay.appendChild(text)

    container.appendChild(overlay)
    setTimeout(() => container.removeChild(overlay), 3500)
  }

  function startMatrix() {
    const canvas = h('canvas', { style: { position: 'absolute', inset: '0', pointerEvents: 'auto', background: 'rgba(0,0,0,0.8)' } }) as HTMLCanvasElement
    const hint = h('p', {
      style: { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', color: '#fff', fontFamily: 'JetBrains Mono', pointerEvents: 'none', background: '#000', padding: '10px' }
    }, 'Click to exit Matrix')
    
    container.appendChild(canvas)
    container.appendChild(hint)

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
    let cleaned = false;
    const cleanup = () => {
      if (cleaned) return;
      cleaned = true;
      clearInterval(interval)
      container.removeChild(canvas)
      container.removeChild(hint)
    }

    canvas.onclick = cleanup
    setTimeout(cleanup, 5000)
  }

  const handler = ((e: CustomEvent) => {
    if (e.detail === 'sudo party') startConfetti()
    if (e.detail === 'matrix') startMatrix()
  }) as EventListener

  window.addEventListener('slashdot-easteregg', handler)
  ;(container as any)._cleanup = () => {
    window.removeEventListener('slashdot-easteregg', handler)
  }

  return container
}
