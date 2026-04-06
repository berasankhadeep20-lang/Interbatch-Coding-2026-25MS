import { h } from '../../../framework/render'

const PRESETS=[{label:'sin(x)',fn:'Math.sin(x)'},{label:'cos(x)',fn:'Math.cos(x)'},{label:'x²',fn:'x*x'},{label:'x³',fn:'x*x*x'},{label:'tan(x)',fn:'Math.tan(x)'},{label:'1/x',fn:'1/x'},{label:'e^x',fn:'Math.exp(x)'},{label:'√x',fn:'Math.sqrt(x)'}]

export function GraphPlotterApp():HTMLElement{
  let fnStr='Math.sin(x)',xRange=10,error=''
  const canvas=h('canvas',{width:640,height:280,style:'width:100%;border-radius:8px;margin-bottom:10px'}) as HTMLCanvasElement
  const ctx=canvas.getContext('2d')!
  const W=640,H=280
  const errorEl=h('p',{style:'color:#ff5050;font-family:JetBrains Mono;font-size:11px;margin-bottom:8px;display:none'})

  const inputEl=h('input',{value:fnStr,placeholder:'f(x) = ...',
    style:'flex:1;padding:6px 10px;background:#111;border:1px solid #222;border-radius:6px;color:#d0d0d0;font-family:JetBrains Mono;font-size:12px;outline:none'}) as HTMLInputElement
  inputEl.addEventListener('keydown',(e:KeyboardEvent)=>{if(e.key==='Enter'){fnStr=inputEl.value;draw();updatePresetBtns()}})

  function draw(){
    const CX=W/2,CY=H/2,scaleX=W/(xRange*2),scaleY=H/8
    ctx.fillStyle='#0a0a0a';ctx.fillRect(0,0,W,H)
    ctx.strokeStyle='#111';ctx.lineWidth=1
    for(let x=0;x<W;x+=scaleX){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();ctx.beginPath();ctx.moveTo(W-x,0);ctx.lineTo(W-x,H);ctx.stroke()}
    for(let y=0;y<H;y+=scaleY){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();ctx.beginPath();ctx.moveTo(0,H-y);ctx.lineTo(W,H-y);ctx.stroke()}
    ctx.strokeStyle='#333';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(0,CY);ctx.lineTo(W,CY);ctx.stroke();ctx.beginPath();ctx.moveTo(CX,0);ctx.lineTo(CX,H);ctx.stroke()
    ctx.fillStyle='#444';ctx.font='9px JetBrains Mono';ctx.textAlign='center'
    for(let i=-Math.floor(xRange);i<=Math.floor(xRange);i+=2){if(i===0)continue;ctx.fillText(String(i),CX+i*scaleX,CY+12)}
    try{const fn=new Function('x','Math',`return ${fnStr}`)
      ctx.beginPath();ctx.strokeStyle='#00ff46';ctx.lineWidth=2;ctx.shadowColor='#00ff46';ctx.shadowBlur=4;let first=true
      for(let px=0;px<W;px++){const x=(px-CX)/scaleX;const y=fn(x,Math);if(!isFinite(y)){first=true;continue};const py=CY-y*scaleY
        if(Math.abs(py-CY)>H){first=true;continue};if(first){ctx.moveTo(px,py);first=false}else ctx.lineTo(px,py)}
      ctx.stroke();ctx.shadowBlur=0;error='';errorEl.style.display='none';inputEl.style.borderColor='#222'
    }catch(e){error='Invalid expression';errorEl.textContent=error;errorEl.style.display='';inputEl.style.borderColor='#ff5050'}
  }
  draw()

  const presetBtns=h('div',{style:'display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px'})
  function updatePresetBtns(){presetBtns.innerHTML=''
    PRESETS.forEach(p=>{presetBtns.appendChild(h('button',{style:`padding:2px 8px;background:${fnStr===p.fn?'#00ff4620':'transparent'};border:1px solid ${fnStr===p.fn?'#00ff46':'#333'};border-radius:4px;color:${fnStr===p.fn?'#00ff46':'#666'};font-family:JetBrains Mono;font-size:11px;cursor:pointer`,
      onClick:()=>{inputEl.value=p.fn;fnStr=p.fn;draw();updatePresetBtns()}},p.label))})}
  updatePresetBtns()

  const rangeLabel=h('span',{style:'color:#888;font-family:JetBrains Mono;font-size:11px'},`X range: ±${xRange}`)
  const rangeSlider=h('input',{type:'range',min:'2',max:'30',value:String(xRange),style:'flex:1'}) as HTMLInputElement
  rangeSlider.addEventListener('input',()=>{xRange=Number(rangeSlider.value);rangeLabel.textContent=`X range: ±${xRange}`;draw()})

  return h('div',{className:'app-body',style:'padding:12px 16px'},
    h('p',{className:'app-label cyan'},'// grapher.app — Function Plotter'),
    h('div',{style:'display:flex;gap:8px;margin-bottom:8px;flex-wrap:wrap'},inputEl,
      h('button',{style:'padding:6px 14px;background:#00ff4620;border:1px solid #00ff46;border-radius:6px;color:#00ff46;font-family:JetBrains Mono;font-size:12px;cursor:pointer',
        onClick:()=>{fnStr=inputEl.value;draw();updatePresetBtns()}},'Plot')),
    errorEl,presetBtns,canvas,
    h('div',{style:'display:flex;align-items:center;gap:8px'},rangeLabel,rangeSlider))
}
