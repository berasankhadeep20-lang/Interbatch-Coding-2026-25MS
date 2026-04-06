import './Apps.css'
import { teamMembers } from '../../data/team'
import { techStack } from '../../data/techStack'
import { h, html } from '../../../framework/render'

export function HomeApp() {
  return html(`
    <div class="app-body">
      <div class="app-section">
        <p class="app-subtitle cyan">Inter-Batch Website Development Competition 2026</p>
        <p class="app-subtitle gray">25MS Batch • IISER Kolkata • SlashDot Club</p>
      </div>
      <div class="app-divider"></div>
      <div class="app-section">
        <p class="app-label yellow">// what is this?</p>
        <p class="app-text">
          SlashDot OS is a browser-based operating system simulator built as our
          entry for the 2026 Inter-Batch Website Development Competition. Every
          section of the site is an app you can open from the desktop or launch via the terminal.
        </p>
      </div>
      <div class="app-section">
        <p class="app-label yellow">// quick start</p>
        <div class="app-commands">
          <div class="app-cmd-row"><span class="app-cmd">neofetch</span><span class="app-cmd-desc">System info + logos</span></div>
          <div class="app-cmd-row"><span class="app-cmd">open about</span><span class="app-cmd-desc">About this project</span></div>
          <div class="app-cmd-row"><span class="app-cmd">open team</span><span class="app-cmd-desc">Meet the 25MS team</span></div>
          <div class="app-cmd-row"><span class="app-cmd">open stack</span><span class="app-cmd-desc">Tech stack details</span></div>
          <div class="app-cmd-row"><span class="app-cmd">open contact</span><span class="app-cmd-desc">Contact information</span></div>
          <div class="app-cmd-row"><span class="app-cmd">help</span><span class="app-cmd-desc">All commands</span></div>
        </div>
      </div>
      <div class="app-logos">
        <div class="logo-placeholder"><img src="./iiserkol_logo.png" alt="IISER Kolkata" class="logo-img" /></div>
        <div class="logo-placeholder"><img src="./slashdot_logo.png" alt="SlashDot" class="logo-img" /></div>
      </div>
    </div>
  `)
}

export function AboutApp() {
  return html(`
    <div class="app-body">
      <p class="app-label cyan">// about.txt</p>
      <h2 class="app-heading">The Concept</h2>
      <p class="app-text">
        What if a club website was not just a website but an operating system?
        SlashDot OS reimagines the SlashDot club website as a retro-futuristic terminal OS
        running entirely in your browser.
      </p>
      <div class="app-divider"></div>
      <p class="app-label cyan">// motivation</p>
      <p class="app-text">
        SlashDot is a programming and design club. We eat code for breakfast.
        What better way to represent that than a fully navigable OS where
        every piece of content is a file, every page is an app, and every
        interaction feels like you built it yourself.
      </p>
      <div class="app-divider"></div>
      <p class="app-label cyan">// architecture</p>
      <div class="app-commands">
        <div class="app-cmd-row"><span class="app-cmd">Virtual filesystem</span><span class="app-cmd-desc">ls, cd, cat work on a fake FS</span></div>
        <div class="app-cmd-row"><span class="app-cmd">App windows</span><span class="app-cmd-desc">Draggable, stackable app windows</span></div>
        <div class="app-cmd-row"><span class="app-cmd">Terminal core</span><span class="app-cmd-desc">xterm.js with full command parser</span></div>
        <div class="app-cmd-row"><span class="app-cmd">Easter eggs</span><span class="app-cmd-desc">sudo party, matrix, sl, and more</span></div>
      </div>
      <div class="app-divider"></div>
      <div class="app-logos">
        <div class="logo-placeholder"><img src="./iiserkol_logo.png" alt="IISER Kolkata" class="logo-img" /></div>
        <div class="logo-placeholder"><img src="./slashdot_logo.png" alt="SlashDot" class="logo-img" /></div>
      </div>
    </div>
  `)
}

export function TeamApp() {
  const container = h('div', { className: 'team-grid' })
  teamMembers.forEach(member => {
    const card = h('div', { className: 'team-card' },
      h('p', { className: 'team-name' }, member.name),
      h('p', { className: 'team-role' }, member.role),
      h('p', {
        className: 'team-github',
        style: { cursor: member.github ? 'pointer' : 'default' },
        onClick: () => {
          if (member.github) window.open(`https://github.com/${member.github}`, '_blank')
        }
      }, member.github ? `@${member.github}` : ''),
      h('p', { className: 'team-fact' }, `fun fact: ${member.fun_fact}`)
    )
    container.appendChild(card)
  })

  return h('div', { className: 'app-body' },
    html('<p class="app-label cyan">// team.db — 25MS Batch</p>'),
    html('<h2 class="app-heading">The Crew</h2>'),
    container
  )
}

export function TechStackApp() {
  const container = h('div', { className: 'app-body' },
    html('<p class="app-label cyan">// stack.log</p>'),
    html('<h2 class="app-heading">Tech Stack</h2>')
  )

  const categories = ['frontend', 'language', 'library', 'tooling'] as const
  categories.forEach(cat => {
    const items = techStack.filter(t => t.category === cat)
    const list = h('div', { className: 'stack-list' })
    items.forEach(t => {
      list.appendChild(h('div', { className: 'stack-item' },
        h('span', { className: 'stack-name' }, `${t.name}${t.version ? ' v' + t.version : ''}`),
        h('span', { className: 'stack-desc' }, t.description)
      ))
    })

    container.appendChild(h('div', { className: 'app-section' },
      h('p', { className: 'app-label yellow' }, `// ${cat}`),
      list
    ))
  })

  container.appendChild(html('<div class="app-divider"></div>'))
  container.appendChild(html('<p class="app-label cyan">// deployment</p>'))
  container.appendChild(html('<p class="app-text">Pure static frontend — no backend required. Built with Vite, deployed via GitHub Pages using GitHub Actions CI/CD. Zero configuration needed to run.</p>'))

  return container
}

export function ContactApp() {
  return html(`
    <div class="app-body">
      <p class="app-label cyan">// contact.sh — executing...</p>
      <h2 class="app-heading">Get in Touch</h2>
      <div class="app-section">
        <p class="app-label yellow">// team contact</p>
        <div class="app-commands">
          <div class="app-cmd-row"><span class="app-cmd">GitHub</span><span class="app-cmd-desc">github.com/berasankhadeep20-lang</span></div>
          <div class="app-cmd-row"><span class="app-cmd">Email</span><span class="app-cmd-desc">yourname@iiserkol.ac.in</span></div>
          <div class="app-cmd-row"><span class="app-cmd">Club</span><span class="app-cmd-desc">SlashDot — IISER Kolkata</span></div>
          <div class="app-cmd-row"><span class="app-cmd">Competition</span><span class="app-cmd-desc">Inter-Batch Web Dev 2026</span></div>
        </div>
      </div>
      <div class="app-divider"></div>
      <p class="app-label yellow">// source code</p>
      <p class="app-text">This project is open source under the MIT License. Find the full source code on GitHub — contributions welcome!</p>
    </div>
  `)
}

export function NeofetchApp() {
  const colorsText = ['#1a1a1a', '#ff5050', '#00ff46', '#ffd700', '#00c8ff', '#c864ff', '#00d4d4', '#e0e0e0']
    .map(c => `<span class="color-block" style="background: ${c}"></span>`)
    .join('')

  return html(`
    <div class="app-body neofetch">
      <div class="neofetch-layout">
        <pre class="neofetch-art green">
     ___   ___  
    /  _| /   \\ 
    \\  \\  | . | 
    _\\  \\ |   | 
   /____/ \\___/ 
   SlashDot OS  
   -------------
   25MS  Batch  
        </pre>
        <div class="neofetch-info">
          <p class="neofetch-user cyan">slashdot<span class="gray">@</span><span class="yellow">25ms-os</span></p>
          <p class="neofetch-sep gray">──────────────────────</p>
          <p class="neofetch-row"><span class="neofetch-key cyan">OS</span><span class="gray">: </span><span class="neofetch-val">SlashDot OS 2026.1-LTS</span></p>
          <p class="neofetch-row"><span class="neofetch-key cyan">Batch</span><span class="gray">: </span><span class="neofetch-val">25MS — IISER Kolkata</span></p>
          <p class="neofetch-row"><span class="neofetch-key cyan">Club</span><span class="gray">: </span><span class="neofetch-val">SlashDot Programming & Design Club</span></p>
          <p class="neofetch-row"><span class="neofetch-key cyan">Shell</span><span class="gray">: </span><span class="neofetch-val">slashdot-sh 2026</span></p>
          <p class="neofetch-row"><span class="neofetch-key cyan">Terminal</span><span class="gray">: </span><span class="neofetch-val">xterm.js v5.5</span></p>
          <p class="neofetch-row"><span class="neofetch-key cyan">Theme</span><span class="gray">: </span><span class="neofetch-val">Terminal Green on Void Black</span></p>
          <p class="neofetch-row"><span class="neofetch-key cyan">CPU</span><span class="gray">: </span><span class="neofetch-val">Brain @ 3.0GHz (caffeine-cooled)</span></p>
          <p class="neofetch-row"><span class="neofetch-key cyan">Memory</span><span class="gray">: </span><span class="neofetch-val">8GB (4GB used by browser tabs)</span></p>
          <p class="neofetch-row"><span class="neofetch-key cyan">Deadline</span><span class="gray">: </span><span class="neofetch-val">April 11, 2026</span></p>
          <br />
          <div class="neofetch-colors">${colorsText}</div>
        </div>
      </div>
      <div class="app-divider"></div>
      <div class="app-logos">
        <div class="logo-placeholder"><img src="./iiserkol_logo.png" alt="IISER Kolkata" class="logo-img" /></div>
        <div class="logo-placeholder"><img src="./slashdot_logo.png" alt="SlashDot" class="logo-img" /></div>
      </div>
    </div>
  `)
}
export * from './Asteroids'
export * from './DNAViewer'
export * from './FlappyBird'
export * from './FourierViz'
export * from './GameOfLife'
export * from './GraphPlotter'
export * from './GravitySim'
export * from './MatrixCalc'
export * from './MolecularViewer'
export * from './PeriodicTable'
export * from './PhysicsSim'
export * from './Pong'
export * from './SlashDotAI'
export * from './TypingTest'
