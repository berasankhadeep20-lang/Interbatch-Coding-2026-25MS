import './Apps.css'

// ─── HomeApp ────────────────────────────────────────────────────────────────
export function HomeApp() {
  return (
    <div className="app-body">
      <div className="app-section">
        <pre className="app-ascii green">{`
  ██╗    ██╗███████╗██╗      ██████╗ ██████╗ ███╗   ███╗███████╗
  ██║    ██║██╔════╝██║     ██╔════╝██╔═══██╗████╗ ████║██╔════╝
  ██║ █╗ ██║█████╗  ██║     ██║     ██║   ██║██╔████╔██║█████╗  
  ██║███╗██║██╔══╝  ██║     ██║     ██║   ██║██║╚██╔╝██║██╔══╝  
  ╚███╔███╔╝███████╗███████╗╚██████╗╚██████╔╝██║ ╚═╝ ██║███████╗
   ╚══╝╚══╝ ╚══════╝╚══════╝ ╚═════╝ ╚═════╝ ╚═╝     ╚═╝╚══════╝`}
        </pre>
        <p className="app-subtitle cyan">Inter-Batch Website Development Competition 2026</p>
        <p className="app-subtitle gray">25MS Batch &nbsp;•&nbsp; IISER Kolkata &nbsp;•&nbsp; SlashDot Club</p>
      </div>

      <div className="app-divider" />

      <div className="app-section">
        <p className="app-label yellow">// what is this?</p>
        <p className="app-text">
          SlashDot OS is a browser-based operating system simulator built as our
          entry for the 2026 Inter-Batch Website Development Competition. Every
          section of the site — About, Team, Tech Stack, Contact — is an "app"
          you can open from the desktop or launch via the terminal.
        </p>
      </div>

      <div className="app-section">
        <p className="app-label yellow">// quick start</p>
        <div className="app-commands">
          {[
            ['neofetch',    'System info + logos'],
            ['open about',  'About this project'],
            ['open team',   'Meet the 25MS team'],
            ['open stack',  'Tech stack details'],
            ['open contact','Contact information'],
            ['help',        'All commands'],
          ].map(([cmd, desc]) => (
            <div key={cmd} className="app-cmd-row">
              <span className="app-cmd">{cmd}</span>
              <span className="app-cmd-desc">{desc}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="app-logos">
        <div className="logo-placeholder">IISER Kolkata</div>
        <div className="logo-placeholder">SlashDot</div>
      </div>
    </div>
  )
}

// ─── AboutApp ───────────────────────────────────────────────────────────────
export function AboutApp() {
  return (
    <div className="app-body">
      <p className="app-label cyan">// about.txt</p>
      <h2 className="app-heading">The Concept</h2>
      <p className="app-text">
        What if a club's website wasn't just a website — but an <span className="hl-green">operating system</span>?
        SlashDot OS reimagines the SlashDot club website as a retro-futuristic terminal OS
        running entirely in your browser.
      </p>
      <div className="app-divider" />
      <p className="app-label cyan">// motivation</p>
      <p className="app-text">
        SlashDot is a programming and design club. We eat code for breakfast.
        What better way to represent that than a fully navigable OS — where
        every piece of content is a file, every page is an app, and every
        interaction feels like you're deep in a system you built yourself.
      </p>
      <div className="app-divider" />
      <p className="app-label cyan">// architecture</p>
      <div className="app-commands">
        {[
          ['Virtual filesystem', 'ls, cd, cat work on a fake FS'],
          ['App windows',        'Draggable, stackable app windows'],
          ['Terminal core',      'xterm.js with full command parser'],
          ['Boot sequence',      'BIOS screen → boot log → desktop'],
          ['Easter eggs',        'sudo party, matrix, sl, and more'],
        ].map(([k, v]) => (
          <div key={k} className="app-cmd-row">
            <span className="app-cmd">{k}</span>
            <span className="app-cmd-desc">{v}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── TeamApp ────────────────────────────────────────────────────────────────
import { teamMembers } from '../../data/team'

export function TeamApp() {
  return (
    <div className="app-body">
      <p className="app-label cyan">// team.db — 25MS Batch</p>
      <h2 className="app-heading">The Crew</h2>
      <div className="team-grid">
        {teamMembers.map((m, i) => (
          <div key={i} className="team-card">
            <pre className="team-ascii">{m.ascii}</pre>
            <p className="team-name">{m.name}</p>
            <p className="team-role">{m.role}</p>
            {m.github && (
              <a
                className="team-github"
                href={`https://github.com/${m.github}`}
                target="_blank"
                rel="noreferrer"
              >
                @{m.github}
              </a>
            )}
            <p className="team-fact">💡 {m.fun_fact}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── TechStackApp ────────────────────────────────────────────────────────────
import { techStack } from '../../data/techStack'

export function TechStackApp() {
  const categories = ['frontend', 'language', 'library', 'tooling'] as const
  return (
    <div className="app-body">
      <p className="app-label cyan">// stack.log</p>
      <h2 className="app-heading">Tech Stack</h2>
      {categories.map(cat => (
        <div key={cat} className="app-section">
          <p className="app-label yellow">// {cat}</p>
          <div className="stack-list">
            {techStack.filter(t => t.category === cat).map(t => (
              <div key={t.name} className="stack-item">
                <span className="stack-name">{t.name}{t.version ? ` v${t.version}` : ''}</span>
                <span className="stack-desc">{t.description}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
      <div className="app-divider" />
      <p className="app-label cyan">// deployment</p>
      <p className="app-text">
        Pure static frontend — no backend required. Built with Vite, deployed via
        GitHub Pages using GitHub Actions CI/CD. Zero configuration needed to run.
      </p>
    </div>
  )
}

// ─── ContactApp ──────────────────────────────────────────────────────────────
export function ContactApp() {
  return (
    <div className="app-body">
      <p className="app-label cyan">// contact.sh — executing...</p>
      <h2 className="app-heading">Get in Touch</h2>
      <div className="app-section">
        <p className="app-label yellow">// team contact</p>
        <div className="app-commands">
          {[
            ['GitHub',       'github.com/your-username'],
            ['Email',        'yourname@iiserkol.ac.in'],
            ['Club',         'SlashDot — IISER Kolkata'],
            ['Competition',  'Inter-Batch Web Dev 2026'],
          ].map(([k, v]) => (
            <div key={k} className="app-cmd-row">
              <span className="app-cmd">{k}</span>
              <span className="app-cmd-desc">{v}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="app-divider" />
      <p className="app-label yellow">// source code</p>
      <p className="app-text">
        This project is open source under the MIT License.
        Find the full source code on GitHub — contributions welcome!
      </p>
      <div className="app-section">
        <pre className="app-ascii gray">{`
  ┌─────────────────────────────────────┐
  │  $ git clone <your-repo-url>        │
  │  $ cd slashdot-os                   │
  │  $ npm install && npm run dev       │
  └─────────────────────────────────────┘`}
        </pre>
      </div>
    </div>
  )
}

// ─── NeofetchApp ─────────────────────────────────────────────────────────────
export function NeofetchApp() {
  const info = [
    ['OS',       'SlashDot OS 2026.1-LTS'],
    ['Batch',    '25MS — IISER Kolkata'],
    ['Club',     'SlashDot Programming & Design Club'],
    ['Shell',    'slashdot-sh 2026'],
    ['Terminal', 'xterm.js v5.3'],
    ['Theme',    'Terminal Green on Void Black'],
    ['CPU',      'Brain @ 3.0GHz (caffeine-cooled)'],
    ['Memory',   '8GB (4GB used by browser tabs)'],
    ['Uptime',   'Since March 22, 2026'],
    ['Deadline', 'April 11, 2026'],
  ]

  return (
    <div className="app-body neofetch">
      <div className="neofetch-layout">
        <pre className="neofetch-art green">{`
     ___   ___  
    /  _| /   \\ 
    \\  \\  | . | 
    _\\  \\ |   | 
   /____/ \\___/ 
   SlashDot OS  
   ─────────────
   25MS  Batch  `}
        </pre>
        <div className="neofetch-info">
          <p className="neofetch-user cyan">slashdot<span className="gray">@</span><span className="yellow">25ms-os</span></p>
          <p className="neofetch-sep gray">{'─'.repeat(22)}</p>
          {info.map(([k, v]) => (
            <p key={k} className="neofetch-row">
              <span className="neofetch-key cyan">{k}</span>
              <span className="gray">: </span>
              <span className="neofetch-val">{v}</span>
            </p>
          ))}
          <br />
          <div className="neofetch-colors">
            {['#1a1a1a','#ff5050','#00ff46','#ffd700','#00c8ff','#c864ff','#00d4d4','#e0e0e0'].map(c => (
              <span key={c} className="color-block" style={{ background: c }} />
            ))}
          </div>
        </div>
      </div>

      <div className="app-divider" />
      <div className="app-logos">
        <div className="logo-placeholder">IISER Kolkata</div>
        <div className="logo-placeholder">SlashDot</div>
      </div>
    </div>
  )
}
