import { h } from '../../../framework/render'

type SimType='projectile'|'shm'|'wave'

export function PhysicsSimApp():HTMLElement{
  const W=680,H=280
  const canvas=h('canvas',{width:W,height:H,style:'flex:1;width:100%'}) as HTMLCanvasElement
  const ctx=canvas.getContext('2d')!
  let simType:SimType='projectile',time=0,running=true,animId=0
  const params={angle:45,velocity:50,gravity:9.8,amplitude:80,frequency:1,damping:0.02}

  function drawGrid(){ctx.strokeStyle='#111';ctx.lineWidth=1
    for(let x=0;x<W;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke()}
    for(let y=0;y<H;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke()}
    ctx.strokeStyle='#222';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(0,H-60);ctx.lineTo(W,H-60);ctx.stroke()
    ctx.beginPath();ctx.moveTo(60,0);ctx.lineTo(60,H);ctx.stroke()}

  function drawProjectile(t:number){const{angle,velocity,gravity}=params;const rad=angle*Math.PI/180;const vx=velocity*Math.cos(rad);const vy=velocity*Math.sin(rad);const scale=4
    const ox=60,oy=H-60;const trail:any[]=[]
    for(let ti=0;ti<=t;ti+=0.05){const x=ox+vx*ti*scale;const y=oy-(vy*ti-0.5*gravity*ti*ti)*scale;if(y>oy)break;trail.push({x,y})}
    if(trail.length>1){ctx.beginPath();ctx.moveTo(trail[0].x,trail[0].y);trail.forEach((p:any)=>ctx.lineTo(p.x,p.y));ctx.strokeStyle='#ffd70060';ctx.lineWidth=1.5;ctx.stroke()}
    const last=trail[trail.length-1];if(last){ctx.beginPath();ctx.arc(last.x,last.y,8,0,Math.PI*2);ctx.fillStyle='#ffd700';ctx.shadowColor='#ffd700';ctx.shadowBlur=10;ctx.fill();ctx.shadowBlur=0}
    ctx.fillStyle='#555';ctx.font='10px JetBrains Mono';ctx.textAlign='left'
    ctx.fillText(`Range: ${Math.round(2*vx*vy/gravity*10)/10}m`,70,H-40)
    ctx.fillText(`Max H: ${Math.round(vy*vy/(2*gravity)*10)/10}m`,70,H-26)
    ctx.fillText(`T: ${Math.round(t*10)/10}s`,70,H-12)
    if(t>2*vy/gravity)time=0}

  function drawSHM(t:number){const{amplitude,frequency,damping}=params;const CX=W/2,CY=H/2
    ctx.strokeStyle='#00c8ff';ctx.lineWidth=1.5;ctx.beginPath()
    for(let x=0;x<W;x++){const ti=(x-CX)/40;const y=CY-amplitude*Math.exp(-damping*Math.abs(ti))*Math.cos(2*Math.PI*frequency*ti);x===0?ctx.moveTo(x,y):ctx.lineTo(x,y)}
    ctx.stroke()
    const decay=Math.exp(-damping*t);const ballY=CY-amplitude*decay*Math.cos(2*Math.PI*frequency*t);const ballX=CX+t*40
    if(ballX<W){ctx.beginPath();ctx.arc(ballX,ballY,8,0,Math.PI*2);ctx.fillStyle='#00c8ff';ctx.shadowColor='#00c8ff';ctx.shadowBlur=10;ctx.fill();ctx.shadowBlur=0
      ctx.beginPath();ctx.moveTo(ballX,CY);ctx.lineTo(ballX,ballY);ctx.strokeStyle='#00c8ff40';ctx.lineWidth=1;ctx.stroke()}else time=0
    ctx.fillStyle='#555';ctx.font='10px JetBrains Mono';ctx.textAlign='left';ctx.fillText(`A: ${amplitude}px  f: ${frequency}Hz  γ: ${damping}`,10,H-12)}

  function drawWave(t:number){const{amplitude,frequency}=params;const CY=H/2
    ctx.beginPath();for(let x=0;x<W;x++){const y=CY-amplitude*Math.sin(2*Math.PI*(x/80-frequency*t*0.1));x===0?ctx.moveTo(x,y):ctx.lineTo(x,y)}
    ctx.strokeStyle='#00ff46';ctx.lineWidth=2;ctx.shadowColor='#00ff46';ctx.shadowBlur=6;ctx.stroke();ctx.shadowBlur=0
    ctx.beginPath();for(let x=0;x<W;x++){const y=CY-amplitude*Math.sin(2*Math.PI*(x/80-frequency*t*0.1)+Math.PI/2);x===0?ctx.moveTo(x,y):ctx.lineTo(x,y)}
    ctx.strokeStyle='#ffd70060';ctx.lineWidth=1.5;ctx.stroke()
    ctx.beginPath();for(let x=0;x<W;x++){const y1=CY-amplitude*Math.sin(2*Math.PI*(x/80-frequency*t*0.1));const y2=CY-amplitude*Math.sin(2*Math.PI*(x/80-frequency*t*0.1)+Math.PI/2);x===0?ctx.moveTo(x,CY-((y1-CY)+(y2-CY))):ctx.lineTo(x,CY-((y1-CY)+(y2-CY)))}
    ctx.strokeStyle='#c864ff';ctx.lineWidth=1;ctx.stroke()
    ctx.fillStyle='#555';ctx.font='10px JetBrains Mono';ctx.textAlign='left';ctx.fillText('Green: wave 1  Yellow: wave 2  Purple: superposition',10,H-12)}

  function loop(){ctx.fillStyle='#0a0a0a';ctx.fillRect(0,0,W,H);drawGrid()
    if(simType==='projectile')drawProjectile(time);else if(simType==='shm')drawSHM(time);else drawWave(time)
    if(running)time+=0.05;animId=requestAnimationFrame(loop)}
  animId=requestAnimationFrame(loop)

  const simBtns=h('div',{style:'display:flex;gap:8px'})
  const simTypes:SimType[]=['projectile','shm','wave']
  const simLabels=['Projectile','SHM','Wave']
  simTypes.forEach((st,idx)=>{simBtns.appendChild(h('button',{style:`padding:3px 10px;background:${simType===st?'#00ff4620':'transparent'};border:1px solid ${simType===st?'#00ff46':'#333'};border-radius:4px;color:${simType===st?'#00ff46':'#666'};font-family:JetBrains Mono;font-size:11px;cursor:pointer`,
    onClick:()=>{simType=st;time=0;simBtns.querySelectorAll('button').forEach((b:any,i:number)=>{b.style.background=simTypes[i]===st?'#00ff4620':'transparent';b.style.borderColor=simTypes[i]===st?'#00ff46':'#333';b.style.color=simTypes[i]===st?'#00ff46':'#666'}); updateSliders()}
  },simLabels[idx]))})

  const pauseBtn=h('button',{style:'padding:3px 10px;background:transparent;border:1px solid #ff5050;border-radius:4px;color:#ff5050;font-family:JetBrains Mono;font-size:11px;cursor:pointer;margin-left:auto',
    onClick:()=>{running=!running;pauseBtn.textContent=running?'⏸ Pause':'▶ Resume';pauseBtn.style.borderColor=running?'#ff5050':'#00ff46';pauseBtn.style.color=running?'#ff5050':'#00ff46'}},'⏸ Pause')

  const sliderDefs=[
    {key:'angle' as const,label:'Angle (°)',min:1,max:89,step:1,show:['projectile']},
    {key:'velocity' as const,label:'Velocity',min:10,max:100,step:1,show:['projectile']},
    {key:'gravity' as const,label:'Gravity',min:1,max:20,step:0.1,show:['projectile']},
    {key:'amplitude' as const,label:'Amplitude',min:10,max:120,step:1,show:['shm','wave']},
    {key:'frequency' as const,label:'Frequency',min:0.1,max:5,step:0.1,show:['shm','wave']},
    {key:'damping' as const,label:'Damping',min:0,max:0.2,step:0.01,show:['shm']},
  ]
  const slidersDiv=h('div',{style:'padding:8px 16px;border-top:1px solid #1e1e1e;display:flex;flex-wrap:wrap;gap:12px'})
  function updateSliders(){slidersDiv.innerHTML=''
    sliderDefs.filter(sd=>sd.show.includes(simType)).forEach(sd=>{
      const lbl=h('span',{style:'color:#888;font-family:JetBrains Mono;font-size:10px;min-width:80px'},`${sd.label}: ${params[sd.key]}`)
      const sl=h('input',{type:'range',min:String(sd.min),max:String(sd.max),step:String(sd.step),value:String(params[sd.key]),style:'width:80px'}) as HTMLInputElement
      sl.addEventListener('input',()=>{(params as any)[sd.key]=parseFloat(sl.value);lbl.textContent=`${sd.label}: ${params[sd.key]}`;time=0})
      slidersDiv.appendChild(h('div',{style:'display:flex;align-items:center;gap:8px'},lbl,sl))})}
  updateSliders()

  const el=h('div',{style:'background:#0a0a0a;width:100%;height:100%;display:flex;flex-direction:column'},
    h('div',{style:'padding:6px 16px;border-bottom:1px solid #1e1e1e;display:flex;gap:8px;flex-wrap:wrap;align-items:center'},simBtns,pauseBtn),
    canvas,slidersDiv)
  ;(el as any)._cleanup=()=>cancelAnimationFrame(animId)
  return el
}
