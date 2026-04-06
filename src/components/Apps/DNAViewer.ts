import { h, html } from '../../../framework/render'

const COMPLEMENT:Record<string,string>={A:'T',T:'A',G:'C',C:'G'}
const BASE_COLORS:Record<string,string>={A:'#ff5050',T:'#00c8ff',G:'#00ff46',C:'#ffd700'}
const aminoMap:Record<string,string>={'TTT':'Phe','TTC':'Phe','TTA':'Leu','TTG':'Leu','CTT':'Leu','CTC':'Leu','CTA':'Leu','CTG':'Leu','ATT':'Ile','ATC':'Ile','ATA':'Ile','ATG':'Met','GTT':'Val','GTC':'Val','GTA':'Val','GTG':'Val','TCT':'Ser','TCC':'Ser','TCA':'Ser','TCG':'Ser','CCT':'Pro','CCC':'Pro','CCA':'Pro','CCG':'Pro','ACT':'Thr','ACC':'Thr','ACA':'Thr','ACG':'Thr','GCT':'Ala','GCC':'Ala','GCA':'Ala','GCG':'Ala','TAT':'Tyr','TAC':'Tyr','TAA':'Stop','TAG':'Stop','CAT':'His','CAC':'His','CAA':'Gln','CAG':'Gln','AAT':'Asn','AAC':'Asn','AAA':'Lys','AAG':'Lys','GAT':'Asp','GAC':'Asp','GAA':'Glu','GAG':'Glu','TGT':'Cys','TGC':'Cys','TGA':'Stop','TGG':'Trp','CGT':'Arg','CGC':'Arg','CGA':'Arg','CGG':'Arg','AGT':'Ser','AGC':'Ser','AGA':'Arg','AGG':'Arg','GGT':'Gly','GGC':'Gly','GGA':'Gly','GGG':'Gly'}

export function DNAViewerApp():HTMLElement{
  let sequence='ATCGATCGATCGAATTCCGGTTAAGGCC'
  const canvas=h('canvas',{width:640,height:160,style:'width:100%;border-radius:8px;margin-bottom:12px'}) as HTMLCanvasElement
  const ctx=canvas.getContext('2d')!
  let offset=0,animId=0

  const inputEl=h('input',{type:'text',value:sequence,placeholder:'Enter DNA sequence (A, T, G, C only)...',
    style:'flex:1;padding:6px 10px;background:#111;border:1px solid #222;border-radius:6px;color:#d0d0d0;font-family:JetBrains Mono;font-size:12px;outline:none'}) as HTMLInputElement
  inputEl.addEventListener('input',()=>{inputEl.value=inputEl.value.toUpperCase().replace(/[^ATGC]/g,'')})

  const analysisDiv=h('div',{className:'app-commands',style:'margin-bottom:12px'})
  const codonDiv=h('div',{style:'display:flex;flex-wrap:wrap;gap:6px'})

  function updateAnalysis(){
    const comp=sequence.split('').map(b=>COMPLEMENT[b]??'N').join('')
    analysisDiv.innerHTML='';
    [['Length',sequence.length+' bases'],['Complement',comp.slice(0,20)+(comp.length>20?'...':'')],
     ['GC content',Math.round(sequence.split('').filter(b=>b==='G'||b==='C').length/sequence.length*100)+'%'],
     ['AT content',Math.round(sequence.split('').filter(b=>b==='A'||b==='T').length/sequence.length*100)+'%']
    ].forEach(([k,v])=>{analysisDiv.appendChild(h('div',{className:'app-cmd-row'},h('span',{className:'app-cmd'},k),h('span',{className:'app-cmd-desc'},v)))})
    codonDiv.innerHTML=''
    for(let i=0;i<sequence.length-2;i+=3){const codon=sequence.slice(i,i+3);const aa=aminoMap[codon]??'???'
      codonDiv.appendChild(h('div',{style:`background:${aa==='Stop'?'#ff505020':'#111'};border:1px solid ${aa==='Stop'?'#ff5050':'#222'};border-radius:4px;padding:3px 8px;font-family:JetBrains Mono;font-size:10px`},
        h('span',{style:'color:#00c8ff'},codon),h('span',{style:'color:#555'},' → '),h('span',{style:`color:${aa==='Stop'?'#ff5050':'#ffd700'}`},aa)))}
  }
  updateAnalysis()

  function draw(){
    ctx.fillStyle='#0a0a0a';ctx.fillRect(0,0,640,160)
    const comp=sequence.split('').map(b=>COMPLEMENT[b]??'N').join('')
    const spacing=24,visible=Math.floor(640/spacing)+2
    for(let i=0;i<visible;i++){const seqIdx=(i+Math.floor(offset/spacing))%sequence.length;const base1=sequence[seqIdx]??'A';const base2=comp[seqIdx]??'T'
      const x=i*spacing-(offset%spacing);const wave=Math.sin((i+offset*0.02)*0.4)*40;const y1=80-50+wave;const y2=80+50-wave
      ctx.beginPath();ctx.moveTo(x,y1);ctx.lineTo(x,y2);ctx.strokeStyle='#1a1a1a';ctx.lineWidth=1;ctx.stroke()
      ctx.beginPath();ctx.arc(x,y1,8,0,Math.PI*2);ctx.fillStyle=BASE_COLORS[base1]??'#888';ctx.shadowColor=BASE_COLORS[base1]??'#888';ctx.shadowBlur=6;ctx.fill();ctx.shadowBlur=0
      ctx.beginPath();ctx.arc(x,y2,8,0,Math.PI*2);ctx.fillStyle=BASE_COLORS[base2]??'#888';ctx.shadowColor=BASE_COLORS[base2]??'#888';ctx.shadowBlur=6;ctx.fill();ctx.shadowBlur=0
      ctx.fillStyle='#000';ctx.font='bold 8px JetBrains Mono';ctx.textAlign='center';ctx.fillText(base1,x,y1+3);ctx.fillText(base2,x,y2+3)}
    offset+=0.5;animId=requestAnimationFrame(draw)
  }
  animId=requestAnimationFrame(draw)

  const legend=h('div',{style:'display:flex;gap:8px;margin-bottom:12px'})
  Object.entries(BASE_COLORS).forEach(([b,c])=>{legend.appendChild(h('span',{style:'display:flex;align-items:center;gap:4px;font-family:JetBrains Mono;font-size:11px'},
    h('span',{style:`width:12px;height:12px;background:${c};border-radius:50%;display:inline-block`}),h('span',{style:`color:${c}`},b)))})

  const el=h('div',{className:'app-body',style:'padding:12px 16px'},
    h('p',{className:'app-label cyan'},'// dna.app — DNA Sequence Viewer'),
    h('div',{style:'display:flex;gap:8px;margin-bottom:12px'},inputEl,
      h('button',{style:'padding:6px 14px;background:#00ff4620;border:1px solid #00ff46;border-radius:6px;color:#00ff46;font-family:JetBrains Mono;font-size:12px;cursor:pointer',
        onClick:()=>{if(inputEl.value.length>=3){sequence=inputEl.value;updateAnalysis();offset=0}}},'Visualize')),
    canvas,legend,html('<div class="app-divider"></div>'),
    h('p',{className:'app-label yellow'},'// sequence analysis'),analysisDiv,
    h('p',{className:'app-label yellow'},'// codon translation'),codonDiv)
  ;(el as any)._cleanup=()=>cancelAnimationFrame(animId)
  return el
}
