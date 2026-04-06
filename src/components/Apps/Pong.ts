import { h } from '../../../framework/render'

const PH = 80, PW = 10, BALL_R = 7, W = 640, H = 420, WIN_SCORE = 7

export function PongApp(): HTMLElement {
  const canvas = h('canvas', { width: W, height: H, style: 'flex:1;display:block;width:100%;height:100%', tabIndex: 0 }) as HTMLCanvasElement
  const ctx = canvas.getContext('2d')!

  const state = {
    ball: { x: W/2, y: H/2, vx: 4, vy: 3 },
    p1: { y: H/2 - PH/2, score: 0 },
    p2: { y: H/2 - PH/2, score: 0 },
    keys: {} as Record<string, boolean>,
    gameOver: false, started: false, winner: '',
  }
  let animId = 0

  const onKeyDown = (e: KeyboardEvent) => {
    state.keys[e.key] = true
    if (['w','s','ArrowUp','ArrowDown'].includes(e.key)) e.preventDefault()
    if (e.key === 'Enter') {
      state.ball = { x: W/2, y: H/2, vx: 4*(Math.random()>0.5?1:-1), vy: 3*(Math.random()>0.5?1:-1) }
      state.p1 = { y: H/2-PH/2, score: 0 }; state.p2 = { y: H/2-PH/2, score: 0 }
      state.gameOver = false; state.started = true; state.winner = ''
    }
  }
  const onKeyUp = (e: KeyboardEvent) => { state.keys[e.key] = false }
  window.addEventListener('keydown', onKeyDown)
  window.addEventListener('keyup', onKeyUp)

  function loop() {
    const s = state
    ctx.fillStyle = '#0a0a0a'; ctx.fillRect(0,0,W,H)
    ctx.setLineDash([10,10]); ctx.strokeStyle='#222'; ctx.lineWidth=2
    ctx.beginPath(); ctx.moveTo(W/2,0); ctx.lineTo(W/2,H); ctx.stroke(); ctx.setLineDash([])

    if (!s.started) {
      ctx.fillStyle='#00ff46'; ctx.font='bold 28px JetBrains Mono'; ctx.textAlign='center'
      ctx.fillText('PONG',W/2,H/2-50)
      ctx.fillStyle='#aaa'; ctx.font='13px JetBrains Mono'
      ctx.fillText('Player 1: W / S keys',W/2,H/2-10)
      ctx.fillText('Player 2: ↑ / ↓ keys',W/2,H/2+14)
      ctx.fillStyle='#00ff46'; ctx.fillText('Press ENTER to start',W/2,H/2+50)
      animId=requestAnimationFrame(loop); return
    }
    if (s.gameOver) {
      ctx.fillStyle='#ffd700'; ctx.font='bold 24px JetBrains Mono'; ctx.textAlign='center'
      ctx.fillText(s.winner+' WINS!',W/2,H/2-20)
      ctx.fillStyle='#aaa'; ctx.font='13px JetBrains Mono'; ctx.fillText('Press ENTER to restart',W/2,H/2+20)
      animId=requestAnimationFrame(loop); return
    }
    const SP=5
    if(s.keys['w']&&s.p1.y>0) s.p1.y-=SP
    if(s.keys['s']&&s.p1.y<H-PH) s.p1.y+=SP
    if(s.keys['ArrowUp']&&s.p2.y>0) s.p2.y-=SP
    if(s.keys['ArrowDown']&&s.p2.y<H-PH) s.p2.y+=SP
    s.ball.x+=s.ball.vx; s.ball.y+=s.ball.vy
    if(s.ball.y-BALL_R<0||s.ball.y+BALL_R>H) s.ball.vy*=-1
    if(s.ball.x-BALL_R<PW+20&&s.ball.y>s.p1.y&&s.ball.y<s.p1.y+PH){
      s.ball.vx=Math.abs(s.ball.vx)*1.05; s.ball.vy=((s.ball.y-s.p1.y)/PH-0.5)*8
    }
    if(s.ball.x+BALL_R>W-PW-20&&s.ball.y>s.p2.y&&s.ball.y<s.p2.y+PH){
      s.ball.vx=-Math.abs(s.ball.vx)*1.05; s.ball.vy=((s.ball.y-s.p2.y)/PH-0.5)*8
    }
    s.ball.vx=Math.max(-12,Math.min(12,s.ball.vx)); s.ball.vy=Math.max(-10,Math.min(10,s.ball.vy))
    if(s.ball.x<0){s.p2.score++; s.ball={x:W/2,y:H/2,vx:-4,vy:3*(Math.random()>0.5?1:-1)}; if(s.p2.score>=WIN_SCORE){s.gameOver=true;s.winner='Player 2'}}
    if(s.ball.x>W){s.p1.score++; s.ball={x:W/2,y:H/2,vx:4,vy:3*(Math.random()>0.5?1:-1)}; if(s.p1.score>=WIN_SCORE){s.gameOver=true;s.winner='Player 1'}}
    // Draw
    ctx.fillStyle='#00ff46'; ctx.shadowColor='#00ff46'; ctx.shadowBlur=8; ctx.fillRect(20,s.p1.y,PW,PH); ctx.shadowBlur=0
    ctx.fillStyle='#00c8ff'; ctx.shadowColor='#00c8ff'; ctx.shadowBlur=8; ctx.fillRect(W-PW-20,s.p2.y,PW,PH); ctx.shadowBlur=0
    ctx.beginPath(); ctx.arc(s.ball.x,s.ball.y,BALL_R,0,Math.PI*2); ctx.fillStyle='#ffd700'; ctx.shadowColor='#ffd700'; ctx.shadowBlur=12; ctx.fill(); ctx.shadowBlur=0
    ctx.fillStyle='#00ff46'; ctx.font='bold 32px JetBrains Mono'; ctx.textAlign='center'; ctx.fillText(String(s.p1.score),W/4,48)
    ctx.fillStyle='#00c8ff'; ctx.fillText(String(s.p2.score),(W*3)/4,48)
    animId=requestAnimationFrame(loop)
  }
  animId=requestAnimationFrame(loop)

  const el = h('div',{style:'background:#0a0a0a;width:100%;height:100%;display:flex;flex-direction:column'},
    h('div',{style:'display:flex;justify-content:space-between;align-items:center;padding:6px 16px;border-bottom:1px solid #1e1e1e;font-family:JetBrains Mono,monospace;font-size:12px'},
      h('span',{style:'color:#00ff46'},'P1 — W/S keys'),
      h('span',{style:'color:#ffd700'},`First to ${WIN_SCORE} wins`),
      h('span',{style:'color:#00c8ff'},'P2 — ↑/↓ keys'),
    ),
    canvas,
    h('div',{style:'padding:4px 16px;border-top:1px solid #1e1e1e;font-family:JetBrains Mono,monospace;font-size:11px;color:#555'},'Press Enter to start/restart'),
  )
  ;(el as any)._cleanup = () => { cancelAnimationFrame(animId); window.removeEventListener('keydown',onKeyDown); window.removeEventListener('keyup',onKeyUp) }
  return el
}
