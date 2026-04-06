import { h, html } from '../../../framework/render'

type Matrix=number[][]
function createMatrix(r:number,c:number):Matrix{return Array.from({length:r},()=>Array(c).fill(0))}
function multiply(A:Matrix,B:Matrix):Matrix|null{if(A[0].length!==B.length)return null;return A.map((_,i)=>B[0].map((_,j)=>A[i].reduce((s,_,k)=>s+A[i][k]*B[k][j],0)))}
function determinant(M:Matrix):number{const n=M.length;if(n===1)return M[0][0];if(n===2)return M[0][0]*M[1][1]-M[0][1]*M[1][0];return M[0].reduce((s,v,j)=>{const minor=M.slice(1).map(r=>r.filter((_,c)=>c!==j));return s+v*Math.pow(-1,j)*determinant(minor)},0)}
function transpose(M:Matrix):Matrix{return M[0].map((_,j)=>M.map(r=>r[j]))}
function inverse(M:Matrix):Matrix|null{if(M.length!==2)return null;const d=determinant(M);if(Math.abs(d)<1e-10)return null;return[[M[1][1]/d,-M[0][1]/d],[-M[1][0]/d,M[0][0]/d]]}
function add(A:Matrix,B:Matrix):Matrix|null{if(A.length!==B.length||A[0].length!==B[0].length)return null;return A.map((r,i)=>r.map((v,j)=>v+B[i][j]))}

function matrixInput(label:string,matrix:Matrix,color:string,onChange:(m:Matrix)=>void):HTMLElement{
  const el=h('div',{style:'flex:1'})
  el.appendChild(h('p',{style:`color:${color};font-family:JetBrains Mono;font-size:12px;margin-bottom:6px;font-weight:700`},label))
  const grid=h('div',{style:`display:grid;grid-template-columns:repeat(${matrix[0].length},52px);gap:4px`})
  matrix.forEach((row,i)=>row.forEach((val,j)=>{
    const inp=h('input',{type:'number',value:String(val),
      style:`width:52px;padding:5px 6px;background:#111;border:1px solid ${color}40;border-radius:4px;color:#d0d0d0;font-family:JetBrains Mono;font-size:12px;text-align:center;outline:none`}) as HTMLInputElement
    inp.addEventListener('input',()=>{const nm=matrix.map(r=>[...r]);nm[i][j]=parseFloat(inp.value)||0;onChange(nm)})
    grid.appendChild(inp)}))
  el.appendChild(grid);return el}

function matrixDisplay(label:string,matrix:Matrix,color:string):HTMLElement{
  const el=h('div',null,h('p',{style:`color:${color};font-family:JetBrains Mono;font-size:12px;margin-bottom:6px;font-weight:700`},label))
  const grid=h('div',{style:`display:grid;grid-template-columns:repeat(${matrix[0].length},60px);gap:4px`})
  matrix.forEach(row=>row.forEach(val=>{grid.appendChild(h('div',{style:`width:60px;padding:5px 6px;background:${color}15;border:1px solid ${color}40;border-radius:4px;color:${color};font-family:JetBrains Mono;font-size:12px;text-align:center`},String(Math.round(val*1000)/1000)))}))
  el.appendChild(grid);return el}

export function MatrixCalcApp():HTMLElement{
  let A:Matrix=[[1,2],[3,4]],B:Matrix=[[5,6],[7,8]]

  const inputsDiv=h('div',{style:'display:flex;gap:24px;margin-bottom:16px;flex-wrap:wrap'})
  const resultDiv=h('div',{style:'display:none;background:#111;border:1px solid #1e1e1e;border-radius:8px;padding:14px 16px'})

  function renderInputs(){inputsDiv.innerHTML=''
    inputsDiv.appendChild(matrixInput('Matrix A',A,'#00ff46',(m)=>{A=m}))
    inputsDiv.appendChild(matrixInput('Matrix B',B,'#00c8ff',(m)=>{B=m}))}
  renderInputs()

  function showResult(label:string,matrix?:Matrix,scalar?:number,error?:string){
    resultDiv.style.display='';resultDiv.innerHTML=''
    resultDiv.appendChild(h('p',{style:'color:#ffd700;font-family:JetBrains Mono;font-size:12px;margin-bottom:10px;font-weight:700'},'Result: '+label))
    if(error)resultDiv.appendChild(h('p',{style:'color:#ff5050;font-family:JetBrains Mono;font-size:12px'},error))
    if(matrix)resultDiv.appendChild(matrixDisplay('',matrix,'#ffd700'))
    if(scalar!==undefined)resultDiv.appendChild(h('p',{style:'color:#ffd700;font-family:JetBrains Mono;font-size:24px;font-weight:700'},String(Math.round(scalar*10000)/10000)))}

  const ops=[
    {label:'A × B',fn:()=>{const r=multiply(A,B);r?showResult('A × B',r):showResult('A × B',undefined,undefined,'Incompatible dimensions')}},
    {label:'A + B',fn:()=>{const r=add(A,B);r?showResult('A + B',r):showResult('A + B',undefined,undefined,'Incompatible dimensions')}},
    {label:'Aᵀ',fn:()=>showResult('Transpose of A',transpose(A))},
    {label:'Bᵀ',fn:()=>showResult('Transpose of B',transpose(B))},
    {label:'det(A)',fn:()=>showResult('det(A)',undefined,determinant(A))},
    {label:'det(B)',fn:()=>showResult('det(B)',undefined,determinant(B))},
    {label:'A⁻¹',fn:()=>{const r=inverse(A);r?showResult('A⁻¹ (2×2 only)',r):showResult('A⁻¹',undefined,undefined,'Not invertible or not 2×2')}},
    {label:'B⁻¹',fn:()=>{const r=inverse(B);r?showResult('B⁻¹ (2×2 only)',r):showResult('B⁻¹',undefined,undefined,'Not invertible or not 2×2')}},
  ]

  const opsDiv=h('div',{style:'display:flex;flex-wrap:wrap;gap:6px;margin-bottom:16px'})
  ops.forEach(op=>{const btn=h('button',{style:'padding:5px 12px;background:#111;border:1px solid #333;border-radius:6px;color:#aaa;font-family:JetBrains Mono;font-size:12px;cursor:pointer;transition:all 0.1s',onClick:op.fn},op.label)
    btn.addEventListener('mouseenter',()=>{btn.style.borderColor='#00ff46';btn.style.color='#00ff46'})
    btn.addEventListener('mouseleave',()=>{btn.style.borderColor='#333';btn.style.color='#aaa'})
    opsDiv.appendChild(btn)})

  const sizeDiv=h('div',{style:'display:flex;gap:12px'})
  ;[{label:'2×2',fn:()=>{A=[[1,2],[3,4]];B=[[5,6],[7,8]];renderInputs()}},
   {label:'3×3',fn:()=>{A=[[1,2,3],[4,5,6],[7,8,9]];B=[[9,8,7],[6,5,4],[3,2,1]];renderInputs()}},
   {label:'Reset',fn:()=>{A=[[1,0],[0,1]];B=[[1,0],[0,1]];resultDiv.style.display='none';renderInputs()}}
  ].forEach(b=>{sizeDiv.appendChild(h('button',{style:'padding:4px 12px;background:transparent;border:1px solid #333;border-radius:4px;color:#666;font-family:JetBrains Mono;font-size:11px;cursor:pointer',onClick:b.fn},b.label))})

  return h('div',{className:'app-body',style:'padding:12px 16px'},
    h('p',{className:'app-label cyan'},'// matrix.app — Matrix Calculator'),
    inputsDiv,opsDiv,resultDiv,html('<div class="app-divider"></div>'),
    h('p',{className:'app-label yellow'},'// matrix size'),sizeDiv)
}
