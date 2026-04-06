export function createDesktopRain(intensity=60):HTMLCanvasElement{
  const canvas=document.createElement('canvas')
  canvas.style.cssText='position:fixed;inset:0;z-index:1;pointer-events:none'
  canvas.width=window.innerWidth;canvas.height=window.innerHeight
  const ctx=canvas.getContext('2d')!
  let animId=0

  interface Drop{x:number;y:number;speed:number;length:number;opacity:number}
  const drops:Drop[]=Array.from({length:intensity},()=>({x:Math.random()*canvas.width,y:Math.random()*canvas.height,speed:4+Math.random()*6,length:10+Math.random()*20,opacity:0.1+Math.random()*0.3}))

  function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height)
    drops.forEach(d=>{ctx.beginPath();ctx.moveTo(d.x,d.y);ctx.lineTo(d.x-1,d.y+d.length);ctx.strokeStyle=`rgba(0,200,255,${d.opacity})`;ctx.lineWidth=0.8;ctx.stroke()
      d.y+=d.speed;if(d.y>canvas.height){d.y=-d.length;d.x=Math.random()*canvas.width}})
    animId=requestAnimationFrame(draw)
  }
  draw()

  const onResize=()=>{canvas.width=window.innerWidth;canvas.height=window.innerHeight}
  window.addEventListener('resize',onResize)

  ;(canvas as any)._cleanup=()=>{cancelAnimationFrame(animId);window.removeEventListener('resize',onResize)}
  return canvas
}
