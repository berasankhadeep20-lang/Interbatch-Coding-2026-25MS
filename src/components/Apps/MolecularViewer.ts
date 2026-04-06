import { h } from '../../../framework/render'

const MOLECULES:Record<string,{name:string;formula:string;description:string;atoms:{symbol:string;x:number;y:number;z:number;color:string;radius:number}[];bonds:{from:number;to:number}[]}>={
  H2O:{name:'Water',formula:'H₂O',description:'The molecule of life. Bent shape due to lone pairs on oxygen.',atoms:[{symbol:'O',x:0,y:0,z:0,color:'#ff5050',radius:16},{symbol:'H',x:-60,y:50,z:0,color:'#ffffff',radius:10},{symbol:'H',x:60,y:50,z:0,color:'#ffffff',radius:10}],bonds:[{from:0,to:1},{from:0,to:2}]},
  CO2:{name:'Carbon Dioxide',formula:'CO₂',description:'Linear molecule. Main greenhouse gas.',atoms:[{symbol:'C',x:0,y:0,z:0,color:'#888888',radius:14},{symbol:'O',x:-90,y:0,z:0,color:'#ff5050',radius:16},{symbol:'O',x:90,y:0,z:0,color:'#ff5050',radius:16}],bonds:[{from:0,to:1},{from:0,to:2}]},
  CH4:{name:'Methane',formula:'CH₄',description:'Simplest hydrocarbon. Tetrahedral geometry.',atoms:[{symbol:'C',x:0,y:0,z:0,color:'#888888',radius:14},{symbol:'H',x:-70,y:-70,z:0,color:'#ffffff',radius:10},{symbol:'H',x:70,y:-70,z:0,color:'#ffffff',radius:10},{symbol:'H',x:-70,y:70,z:0,color:'#ffffff',radius:10},{symbol:'H',x:70,y:70,z:0,color:'#ffffff',radius:10}],bonds:[{from:0,to:1},{from:0,to:2},{from:0,to:3},{from:0,to:4}]},
  NH3:{name:'Ammonia',formula:'NH₃',description:'Trigonal pyramidal. Used in fertilizers.',atoms:[{symbol:'N',x:0,y:0,z:0,color:'#4488ff',radius:15},{symbol:'H',x:-70,y:60,z:0,color:'#ffffff',radius:10},{symbol:'H',x:70,y:60,z:0,color:'#ffffff',radius:10},{symbol:'H',x:0,y:-80,z:0,color:'#ffffff',radius:10}],bonds:[{from:0,to:1},{from:0,to:2},{from:0,to:3}]},
  NaCl:{name:'Sodium Chloride',formula:'NaCl',description:'Table salt. Ionic compound.',atoms:[{symbol:'Na',x:-60,y:0,z:0,color:'#ffd700',radius:18},{symbol:'Cl',x:60,y:0,z:0,color:'#00ff46',radius:20}],bonds:[{from:0,to:1}]},
  O2:{name:'Oxygen',formula:'O₂',description:'Diatomic oxygen. Essential for respiration.',atoms:[{symbol:'O',x:-50,y:0,z:0,color:'#ff5050',radius:16},{symbol:'O',x:50,y:0,z:0,color:'#ff5050',radius:16}],bonds:[{from:0,to:1}]},
  C6H6:{name:'Benzene',formula:'C₆H₆',description:'Aromatic ring. Basis of organic chemistry.',atoms:[{symbol:'C',x:0,y:-80,z:0,color:'#888888',radius:12},{symbol:'C',x:70,y:-40,z:0,color:'#888888',radius:12},{symbol:'C',x:70,y:40,z:0,color:'#888888',radius:12},{symbol:'C',x:0,y:80,z:0,color:'#888888',radius:12},{symbol:'C',x:-70,y:40,z:0,color:'#888888',radius:12},{symbol:'C',x:-70,y:-40,z:0,color:'#888888',radius:12},{symbol:'H',x:0,y:-110,z:0,color:'#ffffff',radius:8},{symbol:'H',x:95,y:-55,z:0,color:'#ffffff',radius:8},{symbol:'H',x:95,y:55,z:0,color:'#ffffff',radius:8},{symbol:'H',x:0,y:110,z:0,color:'#ffffff',radius:8},{symbol:'H',x:-95,y:55,z:0,color:'#ffffff',radius:8},{symbol:'H',x:-95,y:-55,z:0,color:'#ffffff',radius:8}],bonds:[{from:0,to:1},{from:1,to:2},{from:2,to:3},{from:3,to:4},{from:4,to:5},{from:5,to:0},{from:0,to:6},{from:1,to:7},{from:2,to:8},{from:3,to:9},{from:4,to:10},{from:5,to:11}]},
}

export function MolecularViewerApp():HTMLElement{
  const W=680,H=300
  const canvas=h('canvas',{width:W,height:H,style:'flex:1;width:100%'}) as HTMLCanvasElement
  const ctx=canvas.getContext('2d')!
  let selected='H2O',spinning=true,angle=0,animId=0

  const infoDiv=h('div',{style:'padding:10px 16px;border-top:1px solid #1e1e1e;display:flex;gap:16px;flex-wrap:wrap'})

  function updateInfo(){const mol=MOLECULES[selected];if(!mol)return;infoDiv.innerHTML=''
    infoDiv.appendChild(h('div',null,h('span',{style:'color:#ffd700;font-family:JetBrains Mono;font-size:14px;font-weight:700'},mol.formula),h('span',{style:'color:#888;font-family:JetBrains Mono;font-size:12px;margin-left:8px'},mol.name)))
    infoDiv.appendChild(h('p',{style:'color:#666;font-family:JetBrains Mono;font-size:11px;margin:0;flex:1'},mol.description))}
  updateInfo()

  function draw(){ctx.fillStyle='#0a0a0a';ctx.fillRect(0,0,W,H)
    const mol=MOLECULES[selected];if(!mol){animId=requestAnimationFrame(draw);return}
    const CX=W/2,CY=H/2;const cosA=Math.cos(angle),sinA=Math.sin(angle)
    const rotated=mol.atoms.map(a=>({...a,rx:a.x*cosA-a.z*sinA+CX,ry:a.y+CY,rz:a.x*sinA+a.z*cosA}))
    mol.bonds.forEach(b=>{const a1=rotated[b.from],a2=rotated[b.to];ctx.beginPath();ctx.moveTo(a1.rx,a1.ry);ctx.lineTo(a2.rx,a2.ry);ctx.strokeStyle='#444';ctx.lineWidth=3;ctx.stroke()})
    rotated.sort((a,b)=>a.rz-b.rz).forEach(a=>{ctx.beginPath();ctx.arc(a.rx,a.ry,a.radius,0,Math.PI*2);ctx.fillStyle=a.color;ctx.shadowColor=a.color;ctx.shadowBlur=12;ctx.fill();ctx.shadowBlur=0
      ctx.fillStyle='#000';ctx.font=`bold ${a.radius*0.9}px JetBrains Mono`;ctx.textAlign='center';ctx.fillText(a.symbol,a.rx,a.ry+a.radius*0.35)})
    if(spinning)angle+=0.015;animId=requestAnimationFrame(draw)}
  animId=requestAnimationFrame(draw)

  const molBtns=h('div',{style:'display:flex;gap:8px;flex-wrap:wrap'})
  function renderBtns(){molBtns.innerHTML='';Object.keys(MOLECULES).forEach(key=>{
    molBtns.appendChild(h('button',{style:`padding:3px 10px;background:${selected===key?'#00c8ff20':'transparent'};border:1px solid ${selected===key?'#00c8ff':'#333'};border-radius:4px;color:${selected===key?'#00c8ff':'#666'};font-family:JetBrains Mono;font-size:11px;cursor:pointer`,
      onClick:()=>{selected=key;renderBtns();updateInfo()}},MOLECULES[key].formula))})}
  renderBtns()

  const spinBtn=h('button',{style:'padding:3px 10px;background:transparent;border:1px solid #333;border-radius:4px;color:#666;font-family:JetBrains Mono;font-size:11px;cursor:pointer;margin-left:auto',
    onClick:()=>{spinning=!spinning;spinBtn.textContent=spinning?'⏸ Stop':'▶ Spin'}},spinning?'⏸ Stop':'▶ Spin')

  const el=h('div',{style:'background:#0a0a0a;width:100%;height:100%;display:flex;flex-direction:column'},
    h('div',{style:'padding:6px 16px;border-bottom:1px solid #1e1e1e;display:flex;gap:8px;flex-wrap:wrap;align-items:center'},
      h('span',{style:'color:#00c8ff;font-family:JetBrains Mono;font-size:12px;font-weight:700'},'// molecular.app'),molBtns,spinBtn),
    canvas,infoDiv)
  ;(el as any)._cleanup=()=>cancelAnimationFrame(animId)
  return el
}
