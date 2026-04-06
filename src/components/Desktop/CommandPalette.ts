import { h } from '../../../framework/render'

const ALL_COMMANDS = [
  { label: 'Open Terminal',      action: 'open:terminal',    icon: '💻' },
  { label: 'Open About',         action: 'open:about',       icon: '📄' },
  { label: 'Open Team',          action: 'open:team',        icon: '👥' },
  { label: 'Open Stack',         action: 'open:stack',       icon: '🛠' },
  { label: 'Open Contact',       action: 'open:contact',     icon: '📧' },
  { label: 'Open Clock',         action: 'open:clock',       icon: '⏱' },
  { label: 'Open Asteroids',     action: 'open:asteroids',   icon: '🚀' },
  { label: 'Open Pong',          action: 'open:pong',        icon: '🏓' },
  { label: 'Open Periodic Table',action: 'open:periodic',    icon: '⚗'  },
  { label: 'Open Fourier',       action: 'open:fourier',     icon: '〜' },
  { label: 'Open Gravity Sim',   action: 'open:gravity',     icon: '🪐' },
  { label: 'Open DNA Viewer',    action: 'open:dna',         icon: '🧬' },
  { label: 'Open Graph Plotter', action: 'open:grapher',     icon: 'f(x)'},
  { label: 'Open Physics Sim',   action: 'open:physics',     icon: '⚛'  },
  { label: 'Open Molecular',     action: 'open:molecular',   icon: '🔬' },
  { label: 'Open Matrix Calc',   action: 'open:matrix-calc', icon: '[M]'},
  { label: 'Open Game of Life',  action: 'open:gameoflife',  icon: '🔲' },
  { label: 'Open Typing Test',   action: 'open:typing',      icon: '⌨'  },
  { label: 'Open Guestbook',     action: 'open:guestbook',   icon: '📖' },
  { label: 'Open Poll',          action: 'open:poll',        icon: '📊' },
  { label: 'Open Jokes',         action: 'open:jokes',       icon: '😂' },
  { label: 'Open SlashDot AI',   action: 'open:slashdotai',  icon: '🤖' },
  { label: 'Open Achievements',  action: 'open:achievements', icon: '🏆' },
  { label: 'Sudo Party 🎉',      action: 'cmd:sudo party',   icon: '🎉' },
  { label: 'Matrix Rain',        action: 'cmd:matrix',       icon: '🟩' },
  { label: 'Neofetch',           action: 'cmd:neofetch',     icon: '🖥' },
]

export function createCommandPalette(onOpenWindow: (appId: string, title: string) => void) {
  let isOpen = false
  let query = ''
  let selected = 0

  const container = h('div', {
    style: {
      position: 'fixed', inset: '0', background: 'rgba(0,0,0,0.7)',
      zIndex: '9998', display: 'none', alignItems: 'flex-start',
      justifyContent: 'center', paddingTop: '15vh'
    },
    onclick: () => { isOpen = false; render() }
  })

  // To prevent re-creating DOM every render, we create persistent structure
  const modal = h('div', {
    style: {
      width: '520px', background: '#111', border: '1px solid #00ff4640',
      borderRadius: '12px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.8)'
    },
    onclick: (e: Event) => e.stopPropagation()
  })

  const header = h('div', { style: { display: 'flex', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid #1e1e1e', gap: '10px' } })
  const searchIcon = h('span', { style: { color: '#555', fontSize: '14px' } }, '⌘')
  const input = h('input', {
    placeholder: 'Search commands and apps...',
    style: { flex: '1', background: 'transparent', border: 'none', outline: 'none', color: '#d0d0d0', fontFamily: 'JetBrains Mono', fontSize: '14px' },
    oninput: (e: any) => { query = e.target.value; selected = 0; updateList() },
    onkeydown: (e: KeyboardEvent) => {
      const filtered = getFiltered()
      if (e.key === 'ArrowDown') { e.preventDefault(); selected = Math.min(selected + 1, filtered.length - 1); updateList() }
      if (e.key === 'ArrowUp') { e.preventDefault(); selected = Math.max(selected - 1, 0); updateList() }
      if (e.key === 'Enter' && filtered[selected]) execute(filtered[selected].action)
    }
  })
  header.appendChild(searchIcon)
  header.appendChild(input)
  header.appendChild(h('span', { style: { color: '#333', fontFamily: 'JetBrains Mono', fontSize: '10px' } }, 'ESC to close'))
  modal.appendChild(header)

  const listContainer = h('div', { style: { maxHeight: '360px', overflowY: 'auto' } })
  modal.appendChild(listContainer)

  const footer = h('div', { style: { padding: '8px 16px', borderTop: '1px solid #1e1e1e', display: 'flex', gap: '16px' } })
  footer.appendChild(h('span', { style: { color: '#333', fontFamily: 'JetBrains Mono', fontSize: '10px' } }, '↑↓ navigate'))
  footer.appendChild(h('span', { style: { color: '#333', fontFamily: 'JetBrains Mono', fontSize: '10px' } }, '↵ select'))
  footer.appendChild(h('span', { style: { color: '#333', fontFamily: 'JetBrains Mono', fontSize: '10px' } }, 'Ctrl+K toggle'))
  modal.appendChild(footer)
  
  container.appendChild(modal)

  function getFiltered() {
    return query ? ALL_COMMANDS.filter(c => c.label.toLowerCase().includes(query.toLowerCase())) : ALL_COMMANDS
  }

  function execute(action: string) {
    isOpen = false
    query = ''
    render()
    if (action.startsWith('open:')) {
      const appId = action.replace('open:', '')
      const titleMap: Record<string, string> = {
        terminal: 'terminal.sh', home: 'home.exe', about: 'about.txt', team: 'team.db',
        stack: 'stack.log', contact: 'contact.sh', neofetch: 'neofetch', clock: 'clock.app',
        asteroids: 'asteroids.exe', pong: 'pong.exe', periodic: 'periodic.app', fourier: 'fourier.app',
        gravity: 'gravity.app', dna: 'dna.app', grapher: 'grapher.app', physics: 'physics.app',
        molecular: 'molecular.app', 'matrix-calc': 'matrix.app', gameoflife: 'life.exe',
        typing: 'typing.exe', guestbook: 'guestbook.app', poll: 'poll.app', jokes: 'jokes.app',
        slashdotai: 'slashdot-ai.app', achievements: 'achievements.app'
      }
      onOpenWindow(appId, titleMap[appId] || appId)
    } else if (action.startsWith('cmd:')) {
      const cmd = action.replace('cmd:', '')
      window.dispatchEvent(new CustomEvent('slashdot-easteregg', { detail: cmd }))
    }
  }

  function updateList() {
    listContainer.innerHTML = ''
    const filtered = getFiltered()
    if (filtered.length === 0) {
      listContainer.appendChild(h('div', { style: { padding: '20px 16px', color: '#444', fontFamily: 'JetBrains Mono', fontSize: '12px', textAlign: 'center' } }, `No results for "${query}"`))
      return
    }
    
    filtered.slice(0, 12).forEach((cmd, i) => {
      const item = h('div', {
        style: { display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px', cursor: 'pointer', background: i === selected ? '#00ff4610' : 'transparent', borderLeft: `2px solid ${i === selected ? '#00ff46' : 'transparent'}`, transition: 'all 0.08s' },
        onclick: () => execute(cmd.action),
        onmouseenter: () => { selected = i; updateList() }
      })
      item.appendChild(h('span', { style: { fontSize: '14px', width: '20px', textAlign: 'center' } }, cmd.icon))
      item.appendChild(h('span', { style: { color: i === selected ? '#00ff46' : '#aaa', fontFamily: 'JetBrains Mono', fontSize: '13px' } }, cmd.label))
      if (cmd.action.startsWith('open:')) item.appendChild(h('span', { style: { marginLeft: 'auto', color: '#333', fontFamily: 'JetBrains Mono', fontSize: '10px' } }, 'APP'))
      if (cmd.action.startsWith('cmd:')) item.appendChild(h('span', { style: { marginLeft: 'auto', color: '#333', fontFamily: 'JetBrains Mono', fontSize: '10px' } }, 'CMD'))
      listContainer.appendChild(item)
    })
  }

  function render() {
    container.style.display = isOpen ? 'flex' : 'none'
    if (isOpen) {
      (input as HTMLInputElement).value = query
      updateList()
      setTimeout(() => input.focus(), 50)
    }
  }

  const keyHandler = (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault()
      isOpen = !isOpen
      query = ''
      selected = 0
      render()
    }
    if (e.key === 'Escape' && isOpen) {
      isOpen = false
      render()
    }
  }

  window.addEventListener('keydown', keyHandler);
  (container as any)._cleanup = () => {
    window.removeEventListener('keydown', keyHandler)
  }

  return container
}
