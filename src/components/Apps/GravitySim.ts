import { h } from '../../../framework/render'

interface Body{x:number;y:number;vx:number;vy:number;mass:number;radius:number;color:string;trail:{x:number;y:number}[];name:string}
const COLORS=['#ffd700','#00c8ff','#ff5050','#00ff46','#c864ff','#ff8800']

export function GravitySimApp():HTMLElement{
  const W=680,H=380
  const canvas=h('canvas',{width:W,height:H,style:'flex:1;width:100%;height:100%;cursor:grab'}) as HTMLCanvasElement
  const ctx=canvas.getContext('2d')!
  let bodies:Body[]=[], paused=false, dragging:number|null=null
  const dragVel={x:0,y:0,lastX:0,lastY:0}
  let animId=0

  function init(){bodies=[
    {x:W/2,y:H/2,vx:0,vy:0,mass:8000,radius:18,color:'#ffd700',trail:[],name:'Star'},
    {x:W/2+140,y:H/2,vx:0,vy:2.2,mass:100,radius:7,color:'#00c8ff',trail:[],name:'Planet 1'},
    {x:W/2+220,y:H/2,vx:0,vy:1.8,mass:60,radius:5,color:'#00ff46',trail:[],name:'Planet 2'},
    {x:W/2-170,y:H/2,vx:0,vy:-2.0,mass:80,radius:6,color:'#ff5050',trail:[],name:'Planet 3'},
  ]}
  init()

  function draw(){
    ctx.fillStyle='rgba(10,10,10,0.25)';ctx.fillRect(0,0,W,H)
    if(!paused){const G=500,DT=0.5
      for(let i=0;i<bodies.length;i++)for(let j=i+1;j<bodies.length;j++){
        const dx=bodies[j].x-bodies[i].x,dy=bodies[j].y-bodies[i].y,dist=Math.max(Math.sqrt(dx*dx+dy*dy),20)
        const force=G*bodies[i].mass*bodies[j].mass/(dist*dist),ax=force*dx/dist/bodies[i].mass,ay=force*dy/dist/bodies[i].mass
        bodies[i].vx+=ax*DT;bodies[i].vy+=ay*DT;bodies[j].vx-=ax*DT*bodies[i].mass/bodies[j].mass;bodies[j].vy-=ay*DT*bodies[i].mass/bodies[j].mass
      }
      bodies.forEach((b,i)=>{if(dragging===i)return;b.x+=b.vx*0.5;b.y+=b.vy*0.5;b.trail.push({x:b.x,y:b.y});if(b.trail.length>120)b.trail.shift()})
    }
    bodies.forEach(b=>{
      if(b.trail.length>1){ctx.beginPath();ctx.moveTo(b.trail[0].x,b.trail[0].y);b.trail.forEach(p=>ctx.lineTo(p.x,p.y));ctx.strokeStyle=b.color+'40';ctx.lineWidth=1;ctx.stroke()}
      ctx.beginPath();ctx.arc(b.x,b.y,b.radius,0,Math.PI*2);ctx.fillStyle=b.color;ctx.shadowColor=b.color;ctx.shadowBlur=12;ctx.fill();ctx.shadowBlur=0
      ctx.fillStyle='#888';ctx.font='10px JetBrains Mono';ctx.textAlign='center';ctx.fillText(b.name,b.x,b.y-b.radius-4)
    })
    animId=requestAnimationFrame(draw)
  }
  animId=requestAnimationFrame(draw)

  canvas.addEventListener('mousedown',(e)=>{const rect=canvas.getBoundingClientRect();const mx=(e.clientX-rect.left)*(W/rect.width),my=(e.clientY-rect.top)*(H/rect.height)
    bodies.forEach((b,i)=>{if(Math.hypot(mx-b.x,my-b.y)<b.radius+10){dragging=i;dragVel.x=0;dragVel.y=0;dragVel.lastX=mx;dragVel.lastY=my}})})
  canvas.addEventListener('mousemove',(e)=>{if(dragging===null)return;const rect=canvas.getBoundingClientRect();const mx=(e.clientX-rect.left)*(W/rect.width),my=(e.clientY-rect.top)*(H/rect.height)
    dragVel.x=mx-dragVel.lastX;dragVel.y=my-dragVel.lastY;dragVel.lastX=mx;dragVel.lastY=my;bodies[dragging].x=mx;bodies[dragging].y=my})
  canvas.addEventListener('mouseup',()=>{if(dragging!==null){bodies[dragging].vx=dragVel.x*2;bodies[dragging].vy=dragVel.y*2;bodies[dragging].trail=[]};dragging=null})

  const pauseBtn=h('button',{style:'padding:3px 12px;background:#ff505020;border:1px solid #ff5050;border-radius:4px;color:#ff5050;font-family:JetBrains Mono;font-size:11px;cursor:pointer',
    onClick:()=>{paused=!paused;pauseBtn.textContent=paused?'▶ Resume':'⏸ Pause';pauseBtn.style.background=paused?'#00ff4620':'#ff505020';pauseBtn.style.borderColor=paused?'#00ff46':'#ff5050';pauseBtn.style.color=paused?'#00ff46':'#ff5050'}},'⏸ Pause')

  const el=h('div',{style:'background:#0a0a0a;width:100%;height:100%;display:flex;flex-direction:column'},
    h('div',{style:'padding:6px 16px;border-bottom:1px solid #1e1e1e;display:flex;gap:8px;align-items:center'},
      h('span',{style:'color:#ffd700;font-family:JetBrains Mono;font-size:12px'},'// gravity.app'),pauseBtn,
      h('button',{style:'padding:3px 12px;background:transparent;border:1px solid #333;border-radius:4px;color:#aaa;font-family:JetBrains Mono;font-size:11px;cursor:pointer',
        onClick:()=>{const color=COLORS[bodies.length%COLORS.length];bodies.push({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-0.5)*3,vy:(Math.random()-0.5)*3,mass:50+Math.random()*100,radius:4+Math.random()*6,color,trail:[],name:'Body '+bodies.length})}},
        '+ Body'),
      h('button',{style:'padding:3px 12px;background:transparent;border:1px solid #333;border-radius:4px;color:#aaa;font-family:JetBrains Mono;font-size:11px;cursor:pointer',onClick:init},'↺ Reset'),
      h('span',{style:'color:#555;font-family:JetBrains Mono;font-size:10px;margin-left:auto'},'Drag bodies to reposition')),
    canvas)
  ;(el as any)._cleanup=()=>cancelAnimationFrame(animId)
  return el
}
