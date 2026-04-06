import { h } from '../../../framework/render'

export function FourierVizApp():HTMLElement{
  let harmonics=5, waveType:'square'|'sawtooth'|'triangle'='square', time=0, animId=0
  const canvas=h('canvas',{width:680,height:340,style:'flex:1;width:100%;height:100%'}) as HTMLCanvasElement
  const ctx=canvas.getContext('2d')!
  const W=680,H=340,CX=W*0.35,CY=H/2
  const infoSpan=h('span',{style:'color:#888;font-family:JetBrains Mono;font-size:11px'},'Harmonics: 5')
  const waveHistory:number[]=[]

  function getSeries(n:number){const series:{ freq:number;amp:number}[]=[]
    if(waveType==='square'){for(let k=0;k<n;k++){const hm=2*k+1;series.push({freq:hm,amp:(4/Math.PI)/hm})}}
    else if(waveType==='sawtooth'){for(let k=1;k<=n;k++)series.push({freq:k,amp:(2/Math.PI)*(k%2===0?-1:1)/k})}
    else{for(let k=0;k<n;k++){const hm=2*k+1;series.push({freq:hm,amp:(k%2===0?1:-1)*(8/(Math.PI*Math.PI))/(hm*hm)})}}
    return series}

  function draw(){
    ctx.fillStyle='#0a0a0a';ctx.fillRect(0,0,W,H)
    const series=getSeries(harmonics);const baseRadius=60
    let x=CX,y=CY
    series.forEach((s,i)=>{const r=baseRadius*Math.abs(s.amp);const angle=s.freq*time+(s.amp<0?Math.PI:0);const nx=x+r*Math.cos(angle);const ny=y+r*Math.sin(angle)
      ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.strokeStyle=`rgba(0,200,255,${0.15+i*0.03})`;ctx.lineWidth=0.5;ctx.stroke()
      ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(nx,ny);ctx.strokeStyle=i===0?'#00ff46':'#00c8ff';ctx.lineWidth=i===0?2:1;ctx.stroke()
      ctx.beginPath();ctx.arc(nx,ny,3,0,Math.PI*2);ctx.fillStyle='#00ff46';ctx.fill();x=nx;y=ny})
    waveHistory.unshift(y);if(waveHistory.length>W-Math.round(CX)-20)waveHistory.pop()
    ctx.beginPath();ctx.moveTo(CX+20,waveHistory[0]);waveHistory.forEach((wy,i)=>ctx.lineTo(CX+20+i,wy))
    ctx.strokeStyle='#ffd700';ctx.lineWidth=1.5;ctx.shadowColor='#ffd700';ctx.shadowBlur=4;ctx.stroke();ctx.shadowBlur=0
    ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(CX+20,waveHistory[0]);ctx.strokeStyle='rgba(255,255,255,0.15)';ctx.lineWidth=0.5;ctx.stroke()
    ctx.strokeStyle='#1a1a1a';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(CX+20,0);ctx.lineTo(CX+20,H);ctx.stroke()
    ctx.fillStyle='#555';ctx.font='10px JetBrains Mono';ctx.textAlign='left';ctx.fillText(`${waveType} wave — ${harmonics} harmonics`,CX+24,14)
    time+=0.04;animId=requestAnimationFrame(draw)
  }
  animId=requestAnimationFrame(draw)

  const btns=h('div',{style:'display:flex;gap:8px'})
  ;(['square','sawtooth','triangle'] as const).forEach(t=>{
    const btn=h('button',{style:`padding:3px 10px;background:${waveType===t?'#00c8ff20':'transparent'};border:1px solid ${waveType===t?'#00c8ff':'#333'};border-radius:4px;color:${waveType===t?'#00c8ff':'#666'};font-family:JetBrains Mono;font-size:11px;cursor:pointer`,
      onClick:()=>{waveType=t;waveHistory.length=0;time=0;btns.querySelectorAll('button').forEach((b:any,i:number)=>{const types=['square','sawtooth','triangle'];b.style.background=types[i]===t?'#00c8ff20':'transparent';b.style.borderColor=types[i]===t?'#00c8ff':'#333';b.style.color=types[i]===t?'#00c8ff':'#666'})}
    },t)
    btns.appendChild(btn)
  })

  const slider=h('input',{type:'range',min:'1',max:'20',value:'5',style:'width:100px'}) as HTMLInputElement
  slider.addEventListener('input',()=>{harmonics=Number(slider.value);infoSpan.textContent='Harmonics: '+harmonics;waveHistory.length=0;time=0})

  const el=h('div',{style:'background:#0a0a0a;width:100%;height:100%;display:flex;flex-direction:column'},
    h('div',{style:'padding:8px 16px;border-bottom:1px solid #1e1e1e;display:flex;gap:16px;align-items:center;flex-wrap:wrap'},
      h('span',{style:'color:#00c8ff;font-family:JetBrains Mono;font-size:12px'},'// fourier.app'),btns,
      h('div',{style:'display:flex;align-items:center;gap:8px'},infoSpan,slider)),
    canvas,
    h('div',{style:'padding:4px 16px;border-top:1px solid #1e1e1e;font-family:JetBrains Mono;font-size:10px;color:#444;display:flex;gap:24px'},
      h('span',{style:'color:#00ff46'},'● circles = harmonics'),h('span',{style:'color:#ffd700'},'● wave output')))
  ;(el as any)._cleanup=()=>cancelAnimationFrame(animId)
  return el
}
