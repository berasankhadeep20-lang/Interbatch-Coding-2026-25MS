import { h } from '../../../framework/render'

interface Vec2{x:number;y:number}
interface Ship{pos:Vec2;vel:Vec2;angle:number;alive:boolean;invincible:number}
interface Bullet{pos:Vec2;vel:Vec2;life:number}
interface Asteroid{pos:Vec2;vel:Vec2;radius:number;angle:number;spin:number;vertices:number[]}
interface Particle{pos:Vec2;vel:Vec2;life:number;maxLife:number}

function randomAsteroid(W:number,H:number,radius:number,avoidPos?:Vec2):Asteroid{
  let pos:Vec2
  do{pos={x:Math.random()*W,y:Math.random()*H}}while(avoidPos&&Math.hypot(pos.x-avoidPos.x,pos.y-avoidPos.y)<150)
  const speed=(Math.random()*1.5+0.5)*(60/radius), angle=Math.random()*Math.PI*2
  const vertices=Array.from({length:Math.floor(Math.random()*5)+7},()=>radius*(0.7+Math.random()*0.4))
  return{pos,vel:{x:Math.cos(angle)*speed,y:Math.sin(angle)*speed},radius,angle:0,spin:(Math.random()-0.5)*0.05,vertices}
}

export function AsteroidsApp():HTMLElement{
  const W=640,H=420
  const canvas=h('canvas',{width:W,height:H,style:'flex:1;display:block;width:100%;height:100%',tabIndex:0}) as HTMLCanvasElement
  const ctx=canvas.getContext('2d')!
  const scoreEl=h('span',{style:'color:#00ff46'},'Score: 0')
  const levelEl=h('span',{style:'color:#ffd700'},'Level: 1')
  const livesEl=h('span',{style:'color:#ff5050'},'♥ ♥ ♥')

  const s={ship:null as Ship|null,bullets:[] as Bullet[],asteroids:[] as Asteroid[],particles:[] as Particle[],
    score:0,lives:3,level:1,gameOver:false,started:false,keys:{} as Record<string,boolean>,shootCooldown:0,respawnTimer:0}
  let animId=0

  function initGame(){
    s.ship={pos:{x:W/2,y:H/2},vel:{x:0,y:0},angle:-Math.PI/2,alive:true,invincible:180}
    s.bullets=[];s.particles=[];s.score=0;s.lives=3;s.level=1;s.gameOver=false;s.started=true;s.shootCooldown=0;s.respawnTimer=0
    s.asteroids=Array.from({length:4},()=>randomAsteroid(W,H,40,s.ship!.pos))
    scoreEl.textContent='Score: 0';levelEl.textContent='Level: 1';livesEl.textContent='♥ ♥ ♥'
  }

  function spawnParticles(pos:Vec2,count:number){
    for(let i=0;i<count;i++){const a=Math.random()*Math.PI*2,sp=Math.random()*3+1
      s.particles.push({pos:{x:pos.x,y:pos.y},vel:{x:Math.cos(a)*sp,y:Math.sin(a)*sp},life:60,maxLife:60})}
  }

  function wrap(v:Vec2){if(v.x<0)v.x+=W;if(v.x>W)v.x-=W;if(v.y<0)v.y+=H;if(v.y>H)v.y-=H}

  const onKeyDown=(e:KeyboardEvent)=>{s.keys[e.key]=true;if(['ArrowUp','ArrowLeft','ArrowRight',' '].includes(e.key))e.preventDefault()
    if(e.key==='Enter'&&(!s.started||s.gameOver)){initGame()}}
  const onKeyUp=(e:KeyboardEvent)=>{s.keys[e.key]=false}
  window.addEventListener('keydown',onKeyDown);window.addEventListener('keyup',onKeyUp)

  function loop(){
    ctx.fillStyle='rgba(0,0,0,0.15)';ctx.fillRect(0,0,W,H)
    if(!s.started){ctx.fillStyle='#0a0a0a';ctx.fillRect(0,0,W,H);ctx.fillStyle='#00ff46';ctx.font='bold 28px JetBrains Mono';ctx.textAlign='center';ctx.fillText('ASTEROIDS',W/2,H/2-40);ctx.font='14px JetBrains Mono';ctx.fillStyle='#aaa';ctx.fillText('Press ENTER to start',W/2,H/2);ctx.fillText('Arrow keys to move  |  Space to shoot',W/2,H/2+28);animId=requestAnimationFrame(loop);return}
    if(s.gameOver){ctx.fillStyle='#0a0a0a';ctx.fillRect(0,0,W,H);ctx.fillStyle='#ff5050';ctx.font='bold 28px JetBrains Mono';ctx.textAlign='center';ctx.fillText('GAME OVER',W/2,H/2-40);ctx.fillStyle='#00ff46';ctx.font='16px JetBrains Mono';ctx.fillText('Score: '+s.score,W/2,H/2);ctx.fillStyle='#aaa';ctx.font='13px JetBrains Mono';ctx.fillText('Press ENTER to restart',W/2,H/2+36);animId=requestAnimationFrame(loop);return}

    const ship=s.ship!
    if(ship.alive){
      if(s.keys['ArrowLeft'])ship.angle-=0.05;if(s.keys['ArrowRight'])ship.angle+=0.05
      if(s.keys['ArrowUp']){ship.vel.x+=Math.cos(ship.angle)*0.3;ship.vel.y+=Math.sin(ship.angle)*0.3}
      ship.vel.x*=0.98;ship.vel.y*=0.98;ship.pos.x+=ship.vel.x;ship.pos.y+=ship.vel.y;wrap(ship.pos)
      if(ship.invincible>0)ship.invincible--
      if((s.keys[' ']||s.keys['Space'])&&s.shootCooldown<=0){
        s.bullets.push({pos:{x:ship.pos.x+Math.cos(ship.angle)*22,y:ship.pos.y+Math.sin(ship.angle)*22},vel:{x:Math.cos(ship.angle)*8+ship.vel.x,y:Math.sin(ship.angle)*8+ship.vel.y},life:60})
        s.shootCooldown=12
      }
      if(s.shootCooldown>0)s.shootCooldown--
    }else{s.respawnTimer--;if(s.respawnTimer<=0){ship.pos={x:W/2,y:H/2};ship.vel={x:0,y:0};ship.alive=true;ship.invincible=180}}

    s.bullets=s.bullets.filter(b=>{b.pos.x+=b.vel.x;b.pos.y+=b.vel.y;wrap(b.pos);b.life--;return b.life>0})
    s.asteroids.forEach(a=>{a.pos.x+=a.vel.x;a.pos.y+=a.vel.y;a.angle+=a.spin;wrap(a.pos)})
    s.particles=s.particles.filter(p=>{p.pos.x+=p.vel.x;p.pos.y+=p.vel.y;p.vel.x*=0.95;p.vel.y*=0.95;p.life--;return p.life>0})

    s.bullets.forEach((b,bi)=>{s.asteroids.forEach((a,ai)=>{if(Math.hypot(b.pos.x-a.pos.x,b.pos.y-a.pos.y)<a.radius){
      spawnParticles(a.pos,8);s.bullets.splice(bi,1)
      const nw:Asteroid[]=[];if(a.radius>20){for(let i=0;i<2;i++){const na=randomAsteroid(W,H,a.radius/2);na.pos={x:a.pos.x,y:a.pos.y};nw.push(na)}}
      s.asteroids.splice(ai,1);s.asteroids.push(...nw);s.score+=a.radius>30?20:a.radius>15?50:100;scoreEl.textContent='Score: '+s.score
    }})})

    if(ship.alive&&ship.invincible<=0){s.asteroids.forEach(a=>{if(Math.hypot(ship.pos.x-a.pos.x,ship.pos.y-a.pos.y)<a.radius+12){
      spawnParticles(ship.pos,20);ship.alive=false;s.lives--;s.respawnTimer=120
      if(s.lives<=0){s.gameOver=true}
      livesEl.textContent='♥ '.repeat(s.lives)
    }})}

    if(s.asteroids.length===0){s.level++;s.asteroids=Array.from({length:3+s.level},()=>randomAsteroid(W,H,40,ship.pos));levelEl.textContent='Level: '+s.level}

    // draw ship
    if(ship.alive&&!(ship.invincible>0&&Math.floor(ship.invincible/5)%2===0)){
      ctx.save();ctx.translate(ship.pos.x,ship.pos.y);ctx.rotate(ship.angle)
      ctx.strokeStyle='#00ff46';ctx.lineWidth=2;ctx.shadowColor='#00ff46';ctx.shadowBlur=8
      ctx.beginPath();ctx.moveTo(20,0);ctx.lineTo(-12,-10);ctx.lineTo(-8,0);ctx.lineTo(-12,10);ctx.closePath();ctx.stroke()
      if(s.keys['ArrowUp']){ctx.strokeStyle='#ff8800';ctx.shadowColor='#ff8800';ctx.beginPath();ctx.moveTo(-8,-5);ctx.lineTo(-18-Math.random()*8,0);ctx.lineTo(-8,5);ctx.stroke()}
      ctx.restore()
    }
    s.bullets.forEach(b=>{ctx.beginPath();ctx.arc(b.pos.x,b.pos.y,2,0,Math.PI*2);ctx.fillStyle='#ffd700';ctx.shadowColor='#ffd700';ctx.shadowBlur=6;ctx.fill()})
    s.asteroids.forEach(a=>{ctx.save();ctx.translate(a.pos.x,a.pos.y);ctx.rotate(a.angle);ctx.strokeStyle='#00c8ff';ctx.lineWidth=1.5;ctx.shadowColor='#00c8ff';ctx.shadowBlur=4
      ctx.beginPath();const step=(Math.PI*2)/a.vertices.length;a.vertices.forEach((r,i)=>{const x=Math.cos(i*step)*r,y=Math.sin(i*step)*r;i===0?ctx.moveTo(x,y):ctx.lineTo(x,y)});ctx.closePath();ctx.stroke();ctx.restore()})
    s.particles.forEach(p=>{const alpha=p.life/p.maxLife;ctx.beginPath();ctx.arc(p.pos.x,p.pos.y,2,0,Math.PI*2);ctx.fillStyle=`rgba(255,${Math.floor(100+155*alpha)},0,${alpha})`;ctx.fill()})
    ctx.shadowBlur=0
    animId=requestAnimationFrame(loop)
  }
  animId=requestAnimationFrame(loop)

  const el=h('div',{style:'background:#0a0a0a;width:100%;height:100%;display:flex;flex-direction:column'},
    h('div',{style:'display:flex;justify-content:space-between;align-items:center;padding:6px 16px;border-bottom:1px solid #1e1e1e;font-family:JetBrains Mono,monospace;font-size:12px'},scoreEl,levelEl,livesEl),
    canvas,
    h('div',{style:'padding:4px 16px;border-top:1px solid #1e1e1e;font-family:JetBrains Mono,monospace;font-size:11px;color:#555;display:flex;gap:24px'},
      h('span',null,'↑ Thrust'),h('span',null,'← → Rotate'),h('span',null,'Space Shoot'),h('span',null,'Enter Start')),
  )
  ;(el as any)._cleanup=()=>{cancelAnimationFrame(animId);window.removeEventListener('keydown',onKeyDown);window.removeEventListener('keyup',onKeyUp)}
  return el
}
