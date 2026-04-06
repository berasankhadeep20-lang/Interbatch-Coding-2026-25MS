import { h } from '../../../framework/render'

const CELL=12,COLS=54,ROWS=36
type Grid=boolean[][]

function emptyGrid():Grid{return Array.from({length:ROWS},()=>Array(COLS).fill(false))}
function randomGrid():Grid{return Array.from({length:ROWS},()=>Array.from({length:COLS},()=>Math.random()>0.7))}

const PRESETS:Record<string,{name:string;cells:[number,number][]}> = {
  glider:{name:'Glider',cells:[[1,0],[2,1],[0,2],[1,2],[2,2]]},
  pulsar:{name:'Blinker',cells:[[0,1],[1,1],[2,1]]},
  rpentomino:{name:'R-pentomino',cells:[[1,0],[2,0],[0,1],[1,1],[1,2]]},
}

export function GameOfLifeApp():HTMLElement{
  let grid=emptyGrid(),running=false,gen=0,speed=100,lastTick=0,animId=0
  const canvas=h('canvas',{width:COLS*CELL,height:ROWS*CELL,style:'flex:1;width:100%;cursor:crosshair'}) as HTMLCanvasElement
  const ctx=canvas.getContext('2d')!
  const genSpan=h('span',{style:'color:#555;font-family:JetBrains Mono;font-size:11px;margin-left:auto'},'Gen: 0')

  function nextGen(){
    const next=emptyGrid()
    for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++){let n=0
      for(let dr=-1;dr<=1;dr++)for(let dc=-1;dc<=1;dc++){if(dr===0&&dc===0)continue;if(grid[(r+dr+ROWS)%ROWS][(c+dc+COLS)%COLS])n++}
      if(grid[r][c])next[r][c]=n===2||n===3;else next[r][c]=n===3}
    grid=next;gen++;genSpan.textContent='Gen: '+gen
  }

  function draw(ts:number){
    ctx.fillStyle='#0a0a0a';ctx.fillRect(0,0,canvas.width,canvas.height)
    grid.forEach((row,r)=>row.forEach((cell,c)=>{
      if(cell){ctx.fillStyle='#00ff46';ctx.shadowColor='#00ff46';ctx.shadowBlur=3;ctx.fillRect(c*CELL+1,r*CELL+1,CELL-2,CELL-2);ctx.shadowBlur=0}
      else{ctx.fillStyle='#111';ctx.fillRect(c*CELL+1,r*CELL+1,CELL-2,CELL-2)}}))
    if(running&&ts-lastTick>speed){nextGen();lastTick=ts}
    animId=requestAnimationFrame(draw)
  }
  animId=requestAnimationFrame(draw)

  canvas.addEventListener('click',(e)=>{const rect=canvas.getBoundingClientRect();const c=Math.floor((e.clientX-rect.left)/CELL);const r=Math.floor((e.clientY-rect.top)/CELL)
    if(r>=0&&r<ROWS&&c>=0&&c<COLS){grid=grid.map(row=>[...row]);grid[r][c]=!grid[r][c]}})

  const startBtn=h('button',{style:'padding:3px 10px;background:#00ff4620;border:1px solid #00ff46;border-radius:4px;color:#00ff46;font-family:JetBrains Mono;font-size:11px;cursor:pointer',
    onClick:()=>{running=!running;startBtn.textContent=running?'⏸ Pause':'▶ Start';startBtn.style.background=running?'#ff505020':'#00ff4620';startBtn.style.borderColor=running?'#ff5050':'#00ff46';startBtn.style.color=running?'#ff5050':'#00ff46'}},'▶ Start')

  const speedSlider=h('input',{type:'range',min:'50',max:'500',value:'100',style:'width:70px',title:'Speed'}) as HTMLInputElement
  speedSlider.addEventListener('input',()=>{speed=Number(speedSlider.value)})

  const toolbar=h('div',{style:'padding:6px 16px;border-bottom:1px solid #1e1e1e;display:flex;gap:8px;flex-wrap:wrap;align-items:center'},
    h('span',{style:'color:#00ff46;font-family:JetBrains Mono;font-size:12px;font-weight:700'},"Conway's Game of Life"),
    startBtn,
    h('button',{style:'padding:3px 10px;background:transparent;border:1px solid #333;border-radius:4px;color:#666;font-family:JetBrains Mono;font-size:11px;cursor:pointer',
      onClick:()=>{running=false;startBtn.textContent='▶ Start';grid=randomGrid();gen=0;genSpan.textContent='Gen: 0'}},'🎲 Random'),
    h('button',{style:'padding:3px 10px;background:transparent;border:1px solid #333;border-radius:4px;color:#666;font-family:JetBrains Mono;font-size:11px;cursor:pointer',
      onClick:()=>{running=false;startBtn.textContent='▶ Start';grid=emptyGrid();gen=0;genSpan.textContent='Gen: 0'}},'Clear'),
  )
  Object.entries(PRESETS).forEach(([key,p])=>{toolbar.appendChild(h('button',{style:'padding:3px 10px;background:transparent;border:1px solid #333;border-radius:4px;color:#888;font-family:JetBrains Mono;font-size:11px;cursor:pointer',
    onClick:()=>{const g=emptyGrid();const oR=Math.floor(ROWS/2)-1,oC=Math.floor(COLS/2)-1;p.cells.forEach(([r,c])=>{if(r+oR<ROWS&&c+oC<COLS)g[r+oR][c+oC]=true});grid=g;gen=0;genSpan.textContent='Gen: 0'}},p.name))})
  toolbar.appendChild(genSpan);toolbar.appendChild(speedSlider)

  const el=h('div',{style:'background:#0a0a0a;width:100%;height:100%;display:flex;flex-direction:column'},
    toolbar,canvas,
    h('div',{style:'padding:4px 16px;border-top:1px solid #1e1e1e;font-family:JetBrains Mono;font-size:10px;color:#333'},'Click cells to toggle • Start to run • Drag slider for speed'))
  ;(el as any)._cleanup=()=>cancelAnimationFrame(animId)
  return el
}
