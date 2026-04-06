import { h, html } from '../../../framework/render'

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlocked: boolean
  unlockedAt?: string
}

const ACHIEVEMENT_DEFS = [
  { id: 'first_boot',    title: 'First Boot',         description: 'Welcome to SlashDot OS!',                    icon: '🚀' },
  { id: 'help',         title: 'RTFM',               description: "Typed 'help' — a good start.",               icon: '📖' },
  { id: 'neofetch',     title: 'Flex Mode',           description: "Ran neofetch. Very aesthetic.",              icon: '🖥' },
  { id: 'sudo_party',   title: 'Party Animal',        description: "sudo party — you know how to celebrate.",    icon: '🎉' },
  { id: 'matrix',       title: 'Chosen One',          description: 'Entered the Matrix.',                        icon: '🟩' },
  { id: 'ssh',          title: 'Network Wizard',      description: 'SSH-ed into IISER. Impressive.',             icon: '🔐' },
  { id: 'apt',          title: 'Package Manager',     description: 'apt install something.',                     icon: '📦' },
  { id: 'vim',          title: 'Vim Survivor',        description: 'Opened vim. Did you exit?',                  icon: '✍' },
  { id: 'git',          title: 'Version Control',     description: 'Used a git command.',                        icon: '🌿' },
  { id: 'panic',        title: 'Blue Screen',         description: 'Triggered a kernel panic.',                  icon: '💙' },
  { id: 'sandwich',     title: 'xkcd Fan',            description: 'sudo make me a sandwich.',                   icon: '🥪' },
  { id: 'marks',        title: 'Academic Weapon',     description: 'Gave yourself perfect marks.',               icon: '📊' },
  { id: 'weather',      title: 'Meteorologist',       description: 'Checked the campus weather.',                icon: '🌤' },
  { id: 'top',          title: 'System Monitor',      description: "Ran top — noticed exam-stress.exe.",         icon: '📈' },
  { id: 'asteroids',    title: 'Space Cadet',         description: 'Opened Asteroids.',                          icon: '🚀' },
  { id: 'pong',         title: 'Ping Pong',           description: 'Opened Pong.',                               icon: '🏓' },
  { id: 'periodic',     title: 'Chemist',             description: 'Opened the periodic table.',                 icon: '⚗' },
  { id: 'gravity',      title: 'Astrophysicist',      description: 'Simulated gravity.',                         icon: '🪐' },
  { id: 'dna',          title: 'Biologist',           description: 'Viewed a DNA sequence.',                     icon: '🧬' },
  { id: 'slashdotai',   title: 'AI Whisperer',        description: 'Chatted with SlashDot AI.',                  icon: '🤖' },
  { id: 'guestbook',    title: 'Signed In',           description: 'Signed the guestbook.',                      icon: '📖' },
  { id: 'typing',       title: 'Speed Typist',        description: 'Took the typing speed test.',                icon: '⌨' },
  { id: 'gameoflife',   title: 'Game of Life',        description: "Conway would be proud.",                     icon: '🔲' },
  { id: 'all_science',  title: 'IISER Student',       description: 'Opened all science apps.',                   icon: '🎓' },
  { id: 'dark_side',    title: 'Dark Mode Forever',   description: 'SlashDot OS is always dark. As it should be.',icon: '🌑' },
]

function loadAchievements(): Achievement[] {
  const saved = (window as any).__slashdotAchievements ?? {}
  return ACHIEVEMENT_DEFS.map(def => ({
    ...def,
    unlocked: !!saved[def.id],
    unlockedAt: saved[def.id] || undefined,
  }))
}

export function AchievementsApp() {
  const container = h('div', { className: 'app-body', style: { padding: '12px 16px' } })

  function render() {
    container.innerHTML = ''
    const achievements = loadAchievements()
    const unlocked = achievements.filter(a => a.unlocked)
    const locked = achievements.filter(a => !a.unlocked)

    container.appendChild(html('<p class="app-label cyan">// achievements.app</p>'))

    const statsRow = h('div', { style: { display: 'flex', gap: '16px', marginBottom: '16px' } })
    
    // Unlocked Box
    const uBox = h('div', { style: { flex: 1, background: '#111', border: '1px solid #1e1e1e', borderRadius: '8px', padding: '10px 14px', textAlign: 'center' } })
    uBox.appendChild(html(`<div style="color: #ffd700; font-family: 'JetBrains Mono'; font-size: 28px; font-weight: 700">${unlocked.length}</div>`))
    uBox.appendChild(html(`<div style="color: #555; font-family: 'JetBrains Mono'; font-size: 10px">Unlocked</div>`))
    
    // Locked Box
    const lBox = h('div', { style: { flex: 1, background: '#111', border: '1px solid #1e1e1e', borderRadius: '8px', padding: '10px 14px', textAlign: 'center' } })
    lBox.appendChild(html(`<div style="color: #555; font-family: 'JetBrains Mono'; font-size: 28px; font-weight: 700">${locked.length}</div>`))
    lBox.appendChild(html(`<div style="color: #555; font-family: 'JetBrains Mono'; font-size: 10px">Locked</div>`))

    // Ratio Box
    const rBox = h('div', { style: { flex: 1, background: '#111', border: '1px solid #1e1e1e', borderRadius: '8px', padding: '10px 14px', textAlign: 'center' } })
    rBox.appendChild(html(`<div style="color: #00ff46; font-family: 'JetBrains Mono'; font-size: 28px; font-weight: 700">${Math.round(unlocked.length / achievements.length * 100)}%</div>`))
    rBox.appendChild(html(`<div style="color: #555; font-family: 'JetBrains Mono'; font-size: 10px">Complete</div>`))

    statsRow.appendChild(uBox)
    statsRow.appendChild(lBox)
    statsRow.appendChild(rBox)
    container.appendChild(statsRow)

    const barContainer = h('div', { style: { height: '6px', background: '#111', borderRadius: '3px', overflow: 'hidden', marginBottom: '16px' } })
    barContainer.appendChild(html(`<div style="height: 100%; width: ${unlocked.length / achievements.length * 100}%; background: #ffd700; border-radius: 3px; transition: width 0.4s"></div>`))
    container.appendChild(barContainer)

    container.appendChild(html(`<p class="app-label yellow">// unlocked (${unlocked.length})</p>`))
    const uList = h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' } })
    unlocked.forEach(a => {
      const item = h('div', { style: { background: '#111', border: '1px solid #ffd70030', borderRadius: '8px', padding: '10px 12px', display: 'flex', gap: '10px', alignItems: 'flex-start' } })
      item.appendChild(html(`<span style="font-size: 20px">${a.icon}</span>`))
      const text = h('div', {})
      text.appendChild(html(`<p style="color: #ffd700; font-family: 'JetBrains Mono'; font-size: 12px; font-weight: 700; margin: 0 0 2px">${a.title}</p>`))
      text.appendChild(html(`<p style="color: #666; font-family: 'JetBrains Mono'; font-size: 10px; margin: 0">${a.description}</p>`))
      item.appendChild(text)
      uList.appendChild(item)
    })
    container.appendChild(uList)

    container.appendChild(html(`<p class="app-label yellow">// locked (${locked.length})</p>`))
    const lList = h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' } })
    locked.forEach(a => {
      const item = h('div', { style: { background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: '8px', padding: '10px 12px', display: 'flex', gap: '10px', alignItems: 'flex-start', opacity: '0.5' } })
      item.appendChild(html(`<span style="font-size: 20px; filter: grayscale(1)">${a.icon}</span>`))
      const text = h('div', {})
      text.appendChild(html(`<p style="color: #444; font-family: 'JetBrains Mono'; font-size: 12px; font-weight: 700; margin: 0 0 2px">???</p>`))
      text.appendChild(html(`<p style="color: #333; font-family: 'JetBrains Mono'; font-size: 10px; margin: 0">Keep exploring...</p>`))
      item.appendChild(text)
      lList.appendChild(item)
    })
    container.appendChild(lList)
  }

  render()

  const hndl = () => { render() }
  window.addEventListener('slashdot-achievement', hndl)
  ;(container as any)._cleanup = () => {
    window.removeEventListener('slashdot-achievement', hndl)
  }

  return container
}
