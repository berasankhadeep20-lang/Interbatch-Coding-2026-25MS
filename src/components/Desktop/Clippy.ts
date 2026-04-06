import { h } from '../../../framework/render'

const TIPS=[
  "It looks like you're building an OS! Have you tried typing 'help' in the terminal?",
  "Did you know? You can press Ctrl+K to search all commands instantly!",
  "Tip: Type 'sudo party' in the terminal for a surprise! 🎉",
  "It looks like you haven't tried 'neofetch' yet. Give it a go!",
  "Did you know? You can drag windows anywhere on the desktop!",
  "Tip: Double-click the title bar to maximize a window!",
  "It looks like you might be procrastinating. Type 'procrastinate' to commit fully.",
  "Did you know? Type 'weather' to see real live weather at IISER Kolkata!",
  "It looks like you're having fun! Type 'open asteroids' to have more fun.",
  "Did you know? You can change the terminal theme with 'theme amber'!",
  "It looks like you need coffee. Type 'sudo make me coffee' immediately.",
  "Did you know? Type 'open slashdotai' to chat with SlashDot AI!",
  "Tip: Right-click anywhere on the desktop for a context menu!",
  "Did you know? Type 'matrix' for a screensaver effect!",
  "It looks like you're a power user! Try 'open gravity' to simulate planets.",
  "Did you know? Type 'visits' to see how many people have visited this OS!",
]

const FRAMES=[`
   /\\___/\\
  (  o o  )
  =( Y )=
    )   (
   (_)-(_)`,`
   /\\___/\\
  (  - -  )
  =( Y )=
    )   (
   (_)-(_)`,`
   /\\___/\\
  (  ^ ^  )
  =( Y )=
    )   (
   (_)-(_)`]

export function createClippy():HTMLElement{
  let visible=false,message='',frame=0,minimized=false,tipIdx=0
  let posX=window.innerWidth-180,posY=window.innerHeight-280

  const container=h('div',{style:`position:fixed;left:${posX}px;top:${posY}px;z-index:8500;display:none;flex-direction:column;align-items:center;gap:6px;user-select:none`})

  const bubbleDiv=h('div',{style:'display:none;background:#fffde7;border:2px solid #f9a825;border-radius:10px;padding:10px 12px;max-width:200px;position:relative;box-shadow:2px 2px 8px rgba(0,0,0,0.4)'})
  const msgP=h('p',{style:'font-family:JetBrains Mono,monospace;font-size:11px;color:#333;margin:0;line-height:1.5;padding-right:12px'})
  const closeX=h('button',{style:'position:absolute;top:4px;right:6px;background:transparent;border:none;cursor:pointer;color:#999;font-size:12px;line-height:1',onClick:()=>{minimized=true;bubbleDiv.style.display='none'}},'✕')
  const triangle=h('div',{style:'position:absolute;bottom:-10px;left:50%;transform:translateX(-50%);width:0;height:0;border-left:8px solid transparent;border-right:8px solid transparent;border-top:10px solid #f9a825'})
  bubbleDiv.appendChild(closeX);bubbleDiv.appendChild(msgP);bubbleDiv.appendChild(triangle)

  const pre=h('pre',{style:'color:#ffd700;font-family:JetBrains Mono,monospace;font-size:11px;line-height:1.3;margin:0;text-shadow:0 0 8px #ffd70080;background:#111;border:1px solid #ffd70040;border-radius:8px;padding:6px 10px'},FRAMES[0])

  function showTip(){const tip=TIPS[tipIdx%TIPS.length];tipIdx++
    message=tip;msgP.textContent=message;minimized=false;bubbleDiv.style.display=''}

  const bodyDiv=h('div',{style:'cursor:grab;display:flex;flex-direction:column;align-items:center'})
  bodyDiv.appendChild(pre)

  const btnsRow=h('div',{style:'display:flex;gap:4px;margin-top:4px'},
    h('button',{style:'padding:2px 8px;background:#ffd70020;border:1px solid #ffd70060;border-radius:4px;color:#ffd700;font-family:JetBrains Mono,monospace;font-size:9px;cursor:pointer',title:'Get a tip',onClick:showTip},'💡 Tip'),
    h('button',{style:'padding:2px 8px;background:#ff505020;border:1px solid #ff505060;border-radius:4px;color:#ff5050;font-family:JetBrains Mono,monospace;font-size:9px;cursor:pointer',title:'Dismiss Clippy',onClick:()=>{visible=false;container.style.display='none'}},'✕'))
  bodyDiv.appendChild(btnsRow)
  bodyDiv.appendChild(h('p',{style:'color:#444;font-family:JetBrains Mono,monospace;font-size:9px;margin:2px 0 0;text-align:center'},'Clippy v2026'))

  // drag
  let drag:{startX:number;startY:number;origX:number;origY:number}|null=null
  bodyDiv.addEventListener('mousedown',(e:MouseEvent)=>{drag={startX:e.clientX,startY:e.clientY,origX:posX,origY:posY}
    const onMove=(me:MouseEvent)=>{if(!drag)return;posX=Math.max(0,Math.min(window.innerWidth-160,drag.origX+me.clientX-drag.startX));posY=Math.max(0,Math.min(window.innerHeight-200,drag.origY+me.clientY-drag.startY));container.style.left=posX+'px';container.style.top=posY+'px'}
    const onUp=()=>{drag=null;document.removeEventListener('mousemove',onMove);document.removeEventListener('mouseup',onUp)}
    document.addEventListener('mousemove',onMove);document.addEventListener('mouseup',onUp)})

  container.appendChild(bubbleDiv);container.appendChild(bodyDiv)

  // animate face
  const faceTimer=setInterval(()=>{frame=(frame+1)%FRAMES.length;pre.textContent=FRAMES[frame]},2000)

  // show after 5s
  const showTimer=setTimeout(()=>{visible=true;container.style.display='flex';showTip()},5000)

  // cycle tips
  let tipTimer:ReturnType<typeof setInterval>|null=null
  const startTips=()=>{tipTimer=setInterval(()=>{if(visible)showTip()},30000)}
  setTimeout(startTips,5500)

  // clippy event listener
  const handler=(e:Event)=>{const{text}=(e as CustomEvent).detail;message=text;msgP.textContent=text;minimized=false;bubbleDiv.style.display=''}
  window.addEventListener('slashdot-clippy',handler)

  ;(container as any)._cleanup=()=>{clearInterval(faceTimer);clearTimeout(showTimer);if(tipTimer)clearInterval(tipTimer);window.removeEventListener('slashdot-clippy',handler)}
  return container
}
