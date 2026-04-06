import { h, html } from '../../../framework/render'

interface Entry {
  name: string
  message: string
  time: string
  batch?: string
}

const INITIAL: Entry[] = [
  { name: 'Sankhadeep Bera', message: 'Built this whole thing. Send help.', time: '2026-04-11 03:00', batch: '25MS' },
  { name: 'SlashDot Bot', message: 'Welcome to SlashDot OS! Type help in the terminal.', time: '2026-03-22 00:00', batch: 'System' },
]

export function GuestbookApp() {
  const entries: Entry[] = [...INITIAL]
  let name = ''
  let message = ''
  let batch = ''
  let submitted = false

  const container = h('div', { className: 'app-body', style: { padding: '12px 16px' } })

  function render() {
    container.innerHTML = ''
    container.appendChild(html('<p class="app-label cyan">// guestbook.app — Leave a message</p>'))

    const formStyle = { background: '#111', border: '1px solid #1e1e1e', borderRadius: '8px', padding: '12px 14px', marginBottom: '16px' }
    const inputStyle = { width: '100%', padding: '7px 10px', background: '#111', border: '1px solid #222', borderRadius: '6px', color: '#d0d0d0', fontFamily: 'JetBrains Mono', fontSize: '12px', outline: 'none', marginBottom: '8px', boxSizing: 'border-box' }

    const form = h('div', { style: formStyle })
    form.appendChild(html('<p class="app-label yellow" style="margin-top: 0">// sign the guestbook</p>'))

    const nameInput = h('input', { value: name, placeholder: 'Your name *', oninput: (e: any) => { name = e.target.value; updateBtn() } })
    Object.assign(nameInput.style, inputStyle)
    
    const batchInput = h('input', { value: batch, placeholder: 'Batch (optional, e.g. 25MS)', oninput: (e: any) => { batch = e.target.value; updateBtn() } })
    Object.assign(batchInput.style, inputStyle)
    
    const msgInput = h('textarea', { value: message, placeholder: 'Leave a message... *', rows: 3, oninput: (e: any) => { message = e.target.value; updateBtn() } })
    Object.assign(msgInput.style, { ...inputStyle, resize: 'vertical' })

    const btn = h('button', {
      onclick: () => {
        if (!name.trim() || !message.trim()) return
        entries.unshift({
          name: name.trim(),
          message: message.trim(),
          batch: batch.trim() || undefined,
          time: new Date().toLocaleString(),
        })
        name = ''
        message = ''
        batch = ''
        submitted = true
        render()
        setTimeout(() => { submitted = false; render() }, 2000)
      }
    }, submitted ? '✓ Signed!' : '✍ Sign Guestbook')

    const updateBtn = () => {
      const isValid = name.trim().length > 0 && message.trim().length > 0
      btn.disabled = !isValid
      btn.style.opacity = isValid ? '1' : '0.5'
      Object.assign(btn.style, {
        padding: '7px 20px', background: submitted ? '#00ff4630' : '#00ff4620',
        border: '1px solid #00ff46', borderRadius: '6px',
        color: '#00ff46', fontFamily: 'JetBrains Mono', fontSize: '12px',
        cursor: isValid ? 'pointer' : 'not-allowed', transition: 'all 0.15s'
      })
    }
    updateBtn()

    form.appendChild(nameInput)
    form.appendChild(batchInput)
    form.appendChild(msgInput)
    form.appendChild(btn)
    container.appendChild(form)

    container.appendChild(html(`<p class="app-label yellow">// ${entries.length} entries</p>`))
    
    const list = h('div', { style: { display: 'flex', flexDirection: 'column', gap: '10px' } })
    entries.forEach(e => {
      const item = h('div', { style: { background: '#111', border: '1px solid #1e1e1e', borderRadius: '8px', padding: '10px 14px', borderLeft: '3px solid #00ff4640' } })
      
      const header = h('div', { style: { display: 'flex', justifyContent: 'space-between', marginBottom: '4px' } })
      const titleSpan = h('span', { style: { color: '#00ff46', fontFamily: 'JetBrains Mono', fontSize: '13px', fontWeight: '700' } }, e.name)
      if (e.batch) {
        titleSpan.appendChild(html(`<span style="color: #555; font-size: 11px; margin-left: 8px">[${e.batch}]</span>`))
      }
      header.appendChild(titleSpan)
      header.appendChild(h('span', { style: { color: '#444', fontFamily: 'JetBrains Mono', fontSize: '10px' } }, e.time))
      
      item.appendChild(header)
      item.appendChild(html(`<p style="color: #aaa; font-family: 'JetBrains Mono'; font-size: 12px; line-height: 1.6; margin: 0">${e.message.replace(/</g, '&lt;')}</p>`))
      list.appendChild(item)
    })
    
    container.appendChild(list)
  }

  render()
  return container
}
