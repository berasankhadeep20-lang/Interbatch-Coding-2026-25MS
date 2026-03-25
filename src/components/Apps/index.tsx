import './Apps.css'
import { teamMembers } from '../../data/team'
import { techStack } from '../../data/techStack'

export function HomeApp() {
  return (
    <div className="app-body">
      <div className="app-section">
        <p className="app-subtitle cyan">Inter-Batch Website Development Competition 2026</p>
        <p className="app-subtitle gray">25MS Batch • IISER Kolkata • SlashDot Club</p>
      </div>
      <div className="app-divider" />
      <div className="app-section">
        <p className="app-label yellow">// what is this?</p>
        <p className="app-text">
          SlashDot OS is a browser-based operating system simulator built as our
          entry for the 2026 Inter-Batch Website Development Competition. Every
          section of the site is an app you can open from the desktop or launch via the terminal.
        </p>
      </div>
      <div className="app-section">
        <p className="app-label yellow">// quick start</p>
        <div className="app-commands">
          {[
            ['neofetch', 'System info + logos'],
            ['open about', 'About this project'],
            ['open team', 'Meet the 25MS team'],
            ['open stack', 'Tech stack details'],
            ['open contact', 'Contact information'],
            ['help', 'All commands'],
          ].map(function(item) {
            return (
              <div key={item[0]} className="app-cmd-row">
                <span className="app-cmd">{item[0]}</span>
                <span className="app-cmd-desc">{item[1]}</span>
              </div>
            )
          })}
        </div>
      </div>
      <div className="app-logos">
        <div className="logo-placeholder">
          <img src="/iiserkol_logo.png" alt="IISER Kolkata" className="logo-img" />
        </div>
        <div className="logo-placeholder">
          <img src="/slashdot_logo.png" alt="SlashDot" className="logo-img" />
        </div>
      </div>
    </div>
  )
}

export function AboutApp() {
  return (
    <div className="app-body">
      <p className="app-label cyan">// about.txt</p>
      <h2 className="app-heading">The Concept</h2>
      <p className="app-text">
        What if a club website was not just a website but an operating system?
        SlashDot OS reimagines the SlashDot club website as a retro-futuristic terminal OS
        running entirely in your browser.
      </p>
      <div className="app-divider" />
      <p className="app-label cyan">// motivation</p>
      <p className="app-text">
        SlashDot is a programming and design club. We eat code for breakfast.
        What better way to represent that than a fully navigable OS where
        every piece of content is a file, every page is an app, and every
        interaction feels like you built it yourself.
      </p>
      <div className="app-divider" />
      <p className="app-label cyan">// architecture</p>
      <div className="app-commands">
        {[
          ['Virtual filesystem', 'ls, cd, cat work on a fake FS'],
          ['App windows', 'Draggable, stackable app windows'],
          ['Terminal core', 'xterm.js with full command parser'],
          ['Boot sequence', 'BIOS screen to boot log to desktop'],
          ['Easter eggs', 'sudo party, matrix, sl, and more'],
        ].map(function(item) {
          return (
            <div key={item[0]} className="app-cmd-row">
              <span className="app-cmd">{item[0]}</span>
              <span className="app-cmd-desc">{item[1]}</span>
            </div>
          )
        })}
      </div>
      <div className="app-divider" />
      <div className="app-logos">
        <div className="logo-placeholder">
          <img src="/iiserkol_logo.png" alt="IISER Kolkata" className="logo-img" />
        </div>
        <div className="logo-placeholder">
          <img src="/slashdot_logo.png" alt="SlashDot" className="logo-img" />
        </div>
      </div>
    </div>
  )
}

export function TeamApp() {
  return (
    <div className="app-body">
      <p className="app-label cyan">// team.db — 25MS Batch</p>
      <h2 className="app-heading">The Crew</h2>
      <div className="team-grid">
        {teamMembers.map(function(member, index) {
          return (
            <div key={index} className="team-card">
              <pre className="team-ascii">{member.ascii}</pre>
              <p className="team-name">{member.name}</p>
              <p className="team-role">{member.role}</p>
              <p
                className="team-github"
                onClick={function() {
                  if (member.github) {
                    window.open('https://github.com/' + member.github, '_blank')
                  }
                }}
                style={{ cursor: member.github ? 'pointer' : 'default' }}
              >
                {member.github ? '@' + member.github : ''}
              </p>
              <p className="team-fact">{'fun fact: ' + member.fun_fact}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function TechStackApp() {
  const categories = ['frontend', 'language', 'library', 'tooling'] as const
  return (
    <div className="app-body">
      <p className="app-label cyan">// stack.log</p>
      <h2 className="app-heading">Tech Stack</h2>
      {categories.map(function(cat) {
        const items = techStack.filter(function(t) { return t.category === cat })
        return (
          <div key={cat} className="app-section">
            <p className="app-label yellow">{'// ' + cat}</p>
            <div className="stack-list">
              {items.map(function(t) {
                return (
                  <div key={t.name} className="stack-item">
                    <span className="stack-name">{t.name + (t.version ? ' v' + t.version : '')}</span>
                    <span className="stack-desc">{t.description}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
      <div className="app-divider" />
      <p className="app-label cyan">// deployment</p>
      <p className="app-text">
        Pure static frontend — no backend required. Built with Vite, deployed via
        GitHub Pages using GitHub Actions CI/CD. Zero configuration needed to run.
      </p>
    </div>
  )
}

export function ContactApp() {
  const contactInfo = [
    ['GitHub', 'github.com/berasankhadeep20-lang'],
    ['Email', 'yourname@iiserkol.ac.in'],
    ['Club', 'SlashDot — IISER Kolkata'],
    ['Competition', 'Inter-Batch Web Dev 2026'],
  ]
  return (
    <div className="app-body">
      <p className="app-label cyan">// contact.sh — executing...</p>
      <h2 className="app-heading">Get in Touch</h2>
      <div className="app-section">
        <p className="app-label yellow">// team contact</p>
        <div className="app-commands">
          {contactInfo.map(function(item) {
            return (
              <div key={item[0]} className="app-cmd-row">
                <span className="app-cmd">{item[0]}</span>
                <span className="app-cmd-desc">{item[1]}</span>
              </div>
            )
          })}
        </div>
      </div>
      <div className="app-divider" />
      <p className="app-label yellow">// source code</p>
      <p className="app-text">
        This project is open source under the MIT License.
        Find the full source code on GitHub — contributions welcome!
      </p>
    </div>
  )
}

export function NeofetchApp() {
  const info = [
    ['OS', 'SlashDot OS 2026.1-LTS'],
    ['Batch', '25MS — IISER Kolkata'],
    ['Club', 'SlashDot Programming & Design Club'],
    ['Shell', 'slashdot-sh 2026'],
    ['Terminal', 'xterm.js v5.5'],
    ['Theme', 'Terminal Green on Void Black'],
    ['CPU', 'Brain @ 3.0GHz (caffeine-cooled)'],
    ['Memory', '8GB (4GB used by browser tabs)'],
    ['Uptime', 'Since March 22, 2026'],
    ['Deadline', 'April 11, 2026'],
  ]
  const colors = ['#1a1a1a', '#ff5050', '#00ff46', '#ffd700', '#00c8ff', '#c864ff', '#00d4d4', '#e0e0e0']
  const asciiLines = [
    '     ___   ___  ',
    '    /  _| /   \\ ',
    '    \\  \\  | . | ',
    '    _\\  \\ |   | ',
    '   /____/ \\___/ ',
    '   SlashDot OS  ',
    '   -------------',
    '   25MS  Batch  ',
  ]
  return (
    <div className="app-body neofetch">
      <div className="neofetch-layout">
        <pre className="neofetch-art green">
          {asciiLines.join('\n')}
        </pre>
        <div className="neofetch-info">
          <p className="neofetch-user cyan">
            {'slashdot'}
            <span className="gray">{'@'}</span>
            <span className="yellow">{'25ms-os'}</span>
          </p>
          <p className="neofetch-sep gray">{'─'.repeat(22)}</p>
          {info.map(function(item) {
            return (
              <p key={item[0]} className="neofetch-row">
                <span className="neofetch-key cyan">{item[0]}</span>
                <span className="gray">{': '}</span>
                <span className="neofetch-val">{item[1]}</span>
              </p>
            )
          })}
          <br />
          <div className="neofetch-colors">
            {colors.map(function(col) {
              return <span key={col} className="color-block" style={{ background: col }} />
            })}
          </div>
        </div>
      </div>
      <div className="app-divider" />
      <div className="app-logos">
        <div className="logo-placeholder">
          <img src="/iiserkol_logo.png" alt="IISER Kolkata" className="logo-img" />
        </div>
        <div className="logo-placeholder">
          <img src="/slashdot_logo.png" alt="SlashDot" className="logo-img" />
        </div>
      </div>
    </div>
  )
}