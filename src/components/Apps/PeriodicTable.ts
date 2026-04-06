import { h } from '../../../framework/render'

interface Element{symbol:string;name:string;number:number;mass:string;category:string;group:number;period:number;description:string}

const ELEMENTS:Element[]=[
  {symbol:'H',name:'Hydrogen',number:1,mass:'1.008',category:'nonmetal',group:1,period:1,description:'Lightest element. Makes up 75% of the universe.'},
  {symbol:'He',name:'Helium',number:2,mass:'4.003',category:'noble-gas',group:18,period:1,description:'Noble gas. Used in balloons and MRI machines.'},
  {symbol:'Li',name:'Lithium',number:3,mass:'6.941',category:'alkali-metal',group:1,period:2,description:'Lightest metal. Used in batteries.'},
  {symbol:'Be',name:'Beryllium',number:4,mass:'9.012',category:'alkaline-earth',group:2,period:2,description:'Hard, lightweight metal used in aerospace.'},
  {symbol:'B',name:'Boron',number:5,mass:'10.811',category:'metalloid',group:13,period:2,description:'Metalloid used in glass and ceramics.'},
  {symbol:'C',name:'Carbon',number:6,mass:'12.011',category:'nonmetal',group:14,period:2,description:'Basis of all known life. Exists as diamond and graphite.'},
  {symbol:'N',name:'Nitrogen',number:7,mass:'14.007',category:'nonmetal',group:15,period:2,description:'Makes up 78% of Earth\'s atmosphere.'},
  {symbol:'O',name:'Oxygen',number:8,mass:'15.999',category:'nonmetal',group:16,period:2,description:'Essential for respiration. Makes up 21% of air.'},
  {symbol:'F',name:'Fluorine',number:9,mass:'18.998',category:'halogen',group:17,period:2,description:'Most electronegative element.'},
  {symbol:'Ne',name:'Neon',number:10,mass:'20.180',category:'noble-gas',group:18,period:2,description:'Noble gas used in neon signs.'},
  {symbol:'Na',name:'Sodium',number:11,mass:'22.990',category:'alkali-metal',group:1,period:3,description:'Highly reactive metal. Component of table salt.'},
  {symbol:'Mg',name:'Magnesium',number:12,mass:'24.305',category:'alkaline-earth',group:2,period:3,description:'Light structural metal. Essential for chlorophyll.'},
  {symbol:'Al',name:'Aluminum',number:13,mass:'26.982',category:'post-transition',group:13,period:3,description:'Most abundant metal in Earth\'s crust.'},
  {symbol:'Si',name:'Silicon',number:14,mass:'28.086',category:'metalloid',group:14,period:3,description:'Basis of modern electronics and computing.'},
  {symbol:'P',name:'Phosphorus',number:15,mass:'30.974',category:'nonmetal',group:15,period:3,description:'Essential for DNA and ATP energy molecules.'},
  {symbol:'S',name:'Sulfur',number:16,mass:'32.065',category:'nonmetal',group:16,period:3,description:'Yellow solid. Used in gunpowder and rubber vulcanization.'},
  {symbol:'Cl',name:'Chlorine',number:17,mass:'35.453',category:'halogen',group:17,period:3,description:'Used to disinfect water. Component of table salt.'},
  {symbol:'Ar',name:'Argon',number:18,mass:'39.948',category:'noble-gas',group:18,period:3,description:'Third most abundant gas in Earth\'s atmosphere.'},
  {symbol:'K',name:'Potassium',number:19,mass:'39.098',category:'alkali-metal',group:1,period:4,description:'Essential for nerve function. Highly reactive.'},
  {symbol:'Ca',name:'Calcium',number:20,mass:'40.078',category:'alkaline-earth',group:2,period:4,description:'Most abundant metal in human body. Builds bones.'},
  {symbol:'Fe',name:'Iron',number:26,mass:'55.845',category:'transition-metal',group:8,period:4,description:'Most common element on Earth by mass. Basis of steel.'},
  {symbol:'Cu',name:'Copper',number:29,mass:'63.546',category:'transition-metal',group:11,period:4,description:'Excellent electrical conductor. Used since ancient times.'},
  {symbol:'Zn',name:'Zinc',number:30,mass:'65.38',category:'transition-metal',group:12,period:4,description:'Essential trace element. Used in galvanizing steel.'},
  {symbol:'Ag',name:'Silver',number:47,mass:'107.868',category:'transition-metal',group:11,period:5,description:'Best electrical and thermal conductor. Used in jewelry.'},
  {symbol:'Au',name:'Gold',number:79,mass:'196.967',category:'transition-metal',group:11,period:6,description:'Highly valued precious metal. Resistant to corrosion.'},
  {symbol:'Hg',name:'Mercury',number:80,mass:'200.592',category:'transition-metal',group:12,period:6,description:'Only metal liquid at room temperature.'},
  {symbol:'Pb',name:'Lead',number:82,mass:'207.2',category:'post-transition',group:14,period:6,description:'Dense toxic metal. Used in batteries and radiation shielding.'},
  {symbol:'U',name:'Uranium',number:92,mass:'238.029',category:'actinide',group:3,period:7,description:'Radioactive. Used in nuclear power and weapons.'},
]

const CAT_COLORS:Record<string,string>={'nonmetal':'#1D9E75','noble-gas':'#534AB7','alkali-metal':'#D85A30','alkaline-earth':'#BA7517','metalloid':'#0F6E56','halogen':'#993556','transition-metal':'#185FA5','post-transition':'#888780','actinide':'#A32D2D'}

export function PeriodicTableApp():HTMLElement{
  let selected:Element|null=null, search=''
  const detailDiv=h('div',{style:'display:none;background:#111;border:2px solid #333;border-radius:8px;padding:12px 16px;margin-bottom:12px'})
  const gridDiv=h('div',{style:'display:flex;flex-wrap:wrap;gap:6px'})
  const searchInput=h('input',{type:'text',placeholder:'Search element, symbol, or number...',
    style:'width:100%;padding:8px 12px;margin-bottom:12px;background:#111;border:1px solid #222;border-radius:6px;color:#d0d0d0;font-family:JetBrains Mono,monospace;font-size:12px;outline:none;box-sizing:border-box'}) as HTMLInputElement

  function renderGrid(){gridDiv.innerHTML=''
    const filtered=search?ELEMENTS.filter(e=>e.name.toLowerCase().includes(search)||e.symbol.toLowerCase().includes(search)||String(e.number).includes(search)):ELEMENTS
    filtered.forEach(el=>{const color=CAT_COLORS[el.category]??'#333'
      const btn=h('button',{style:`width:56px;height:60px;background:${selected?.number===el.number?color:'#111'};border:1px solid ${color};border-radius:6px;cursor:pointer;padding:4px;display:flex;flex-direction:column;align-items:center;justify-content:center;transition:all 0.12s`,
        onClick:()=>{selected=el;renderDetail();renderGrid()}},
        h('span',{style:'font-size:9px;color:#666;font-family:JetBrains Mono'},String(el.number)),
        h('span',{style:`font-size:16px;font-weight:700;color:${selected?.number===el.number?'#fff':color};font-family:JetBrains Mono`},el.symbol),
        h('span',{style:'font-size:8px;color:#888;font-family:JetBrains Mono;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:52px'},el.name))
      gridDiv.appendChild(btn)})}

  function renderDetail(){if(!selected){detailDiv.style.display='none';return}
    const color=CAT_COLORS[selected.category]??'#333'
    detailDiv.style.display='flex';detailDiv.style.borderColor=color;detailDiv.innerHTML=''
    detailDiv.appendChild(h('div',{style:'text-align:center;min-width:80px'},
      h('div',{style:`font-size:36px;font-weight:700;color:${color};font-family:JetBrains Mono`},selected.symbol),
      h('div',{style:'font-size:11px;color:#888;font-family:JetBrains Mono'},'#'+selected.number),
      h('div',{style:'font-size:11px;color:#555;font-family:JetBrains Mono'},selected.mass)))
    detailDiv.appendChild(h('div',null,
      h('p',{style:'color:#fff;font-family:JetBrains Mono;font-size:14px;font-weight:700;margin-bottom:4px'},selected.name),
      h('p',{style:'color:#888;font-family:JetBrains Mono;font-size:11px;margin-bottom:6px;text-transform:capitalize'},selected.category.replace(/-/g,' ')),
      h('p',{style:'color:#aaa;font-family:JetBrains Mono;font-size:12px;line-height:1.6'},selected.description)))
    detailDiv.appendChild(h('button',{style:'margin-left:auto;background:transparent;border:none;color:#555;cursor:pointer;font-size:16px;align-self:flex-start',
      onClick:()=>{selected=null;renderDetail();renderGrid()}},'✕'))}
  renderGrid()

  searchInput.addEventListener('input',()=>{search=searchInput.value.toLowerCase();renderGrid()})

  const legend=h('div',{style:'margin-top:12px;display:flex;flex-wrap:wrap;gap:8px'})
  Object.entries(CAT_COLORS).forEach(([cat,col])=>{legend.appendChild(h('span',{style:'display:flex;align-items:center;gap:4px;font-family:JetBrains Mono;font-size:10px;color:#888'},
    h('span',{style:`width:10px;height:10px;background:${col};border-radius:2px;display:inline-block`}),cat.replace(/-/g,' ')))})

  return h('div',{className:'app-body',style:'padding:12px 16px'},
    h('p',{className:'app-label cyan'},'// periodic.app — Periodic Table'),
    searchInput,detailDiv,gridDiv,legend)
}
