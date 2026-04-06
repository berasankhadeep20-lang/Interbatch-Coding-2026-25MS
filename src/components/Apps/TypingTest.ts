import { h } from '../../../framework/render'

const PASSAGES = [
  'the quick brown fox jumps over the lazy dog',
  'code is like humor when you have to explain it it is bad',
  'first solve the problem then write the code',
  'any fool can write code that a computer can understand good programmers write code that humans can understand',
  'talk is cheap show me the code',
  'in iiser kolkata we do not sleep we compile',
  'debugging is twice as hard as writing the code in the first place',
  'the best error message is the one that never shows up',
  'slashdot is the coolest club at iiser kolkata',
  'it works on my machine is not a valid deployment strategy',
]

export function TypingTestApp(): HTMLElement {
  let passage = PASSAGES[0]
  let typed = ''
  let started = false
  let finished = false
  let startTime = 0
  let elapsed = 0
  let wpm = 0
  let accuracy = 100
  let timer: ReturnType<typeof setInterval> | null = null

  const statEls: { value: HTMLElement; label: HTMLElement }[] = []
  const statsRow = h('div', { style: 'display:flex;gap:20px;margin-bottom:20px' })
  const stats = [
    { label: 'WPM', color: '#00ff46' },
    { label: 'Accuracy', color: '#00c8ff' },
    { label: 'Time', color: '#ffd700' },
    { label: 'Progress', color: '#c864ff' },
  ]
  stats.forEach(s => {
    const valEl = h('div', { style: `color:${s.color};font-family:JetBrains Mono;font-size:22px;font-weight:700` }, '0')
    const lblEl = h('div', { style: 'color:#555;font-family:JetBrains Mono;font-size:10px' }, s.label)
    statEls.push({ value: valEl, label: lblEl })
    statsRow.appendChild(h('div', { style: 'text-align:center;flex:1;background:#111;border:1px solid #1e1e1e;border-radius:8px;padding:10px' }, valEl, lblEl))
  })

  const passageDisplay = h('div', { style: 'background:#111;border:1px solid #1e1e1e;border-radius:8px;padding:16px;margin-bottom:16px;line-height:2;font-family:JetBrains Mono;font-size:14px' })

  function renderPassage() {
    passageDisplay.innerHTML = ''
    passage.split('').forEach((char, i) => {
      let color = '#444'
      if (i < typed.length) color = typed[i] === char ? '#00ff46' : '#ff5050'
      else if (i === typed.length) color = '#fff'
      const span = h('span', { style: `color:${color};${i === typed.length ? 'border-bottom:2px solid #fff' : ''}` }, char)
      passageDisplay.appendChild(span)
    })
  }
  renderPassage()

  const input = h('input', {
    placeholder: 'Start typing...',
    style: 'width:100%;padding:10px 14px;background:#111;border:1px solid #333;border-radius:8px;color:#d0d0d0;font-family:JetBrains Mono;font-size:14px;outline:none;margin-bottom:10px;box-sizing:border-box',
  }) as HTMLInputElement

  const resultDiv = h('div', { style: 'display:none;background:#00ff4615;border:1px solid #00ff4640;border-radius:8px;padding:16px;text-align:center;margin-bottom:10px' })

  function updateStats() {
    const liveWpm = started && !finished ? Math.round((typed.split(' ').length / Math.max(elapsed / 60, 0.01))) : (finished ? wpm : 0)
    statEls[0].value.textContent = String(liveWpm)
    statEls[1].value.textContent = accuracy + '%'
    statEls[2].value.textContent = elapsed + 's'
    statEls[3].value.textContent = Math.round(typed.length / passage.length * 100) + '%'
  }

  input.addEventListener('input', () => {
    const val = input.value
    if (!started && val.length === 1) {
      started = true
      startTime = Date.now()
      timer = setInterval(() => {
        elapsed = Math.floor((Date.now() - startTime) / 1000)
        updateStats()
      }, 500)
    }
    typed = val

    const correct = val.split('').filter((c, i) => c === passage[i]).length
    accuracy = val.length > 0 ? Math.round(correct / val.length * 100) : 100

    if (val === passage) {
      finished = true
      if (timer) clearInterval(timer)
      const mins = (Date.now() - startTime) / 60000
      wpm = Math.round(passage.split(' ').length / mins)
      input.style.display = 'none'
      resultDiv.style.display = 'block'
      resultDiv.innerHTML = ''
      resultDiv.appendChild(h('p', { style: 'color:#00ff46;font-family:JetBrains Mono;font-size:18px;font-weight:700;margin:0 0 4px' }, '✓ Complete!'))
      resultDiv.appendChild(h('p', { style: 'color:#888;font-family:JetBrains Mono;font-size:12px;margin:0' }, `${wpm} WPM at ${accuracy}% accuracy in ${elapsed}s`))
    }

    renderPassage()
    updateStats()
  })

  function reset() {
    passage = PASSAGES[Math.floor(Math.random() * PASSAGES.length)]
    typed = ''
    started = false
    finished = false
    elapsed = 0
    wpm = 0
    accuracy = 100
    if (timer) clearInterval(timer)
    input.value = ''
    input.style.display = ''
    resultDiv.style.display = 'none'
    renderPassage()
    updateStats()
    setTimeout(() => input.focus(), 50)
  }

  const resetBtn = h('button', {
    style: 'padding:8px 20px;background:transparent;border:1px solid #333;border-radius:6px;color:#888;font-family:JetBrains Mono;font-size:12px;cursor:pointer',
    onClick: reset,
  }, '↺ New passage')

  return h('div', { className: 'app-body', style: 'padding:20px 24px' },
    h('p', { className: 'app-label cyan' }, '// typing.exe — Typing Speed Test'),
    statsRow, passageDisplay, input, resultDiv, resetBtn
  )
}
