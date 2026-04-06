import { h, html } from '../../../framework/render'

interface Joke {
  setup: string
  punchline: string
  category: string
}

const JOKES: Joke[] = [
  { category: 'Programming', setup: 'Why do programmers prefer dark mode?', punchline: 'Because light attracts bugs!' },
  { category: 'Programming', setup: "How many programmers does it take to change a light bulb?", punchline: "None. It's a hardware problem." },
  { category: 'Programming', setup: 'Why do Java developers wear glasses?', punchline: "Because they can't C#!" },
  { category: 'Programming', setup: 'What did the programmer say to his date?', punchline: "You're looking array-geous tonight!" },
  { category: 'Programming', setup: "Why don't programmers like nature?", punchline: 'It has too many bugs.' },
  { category: 'Programming', setup: "What's a programmer's favorite hangout spot?", punchline: 'Foo Bar.' },
  { category: 'Science', setup: "Why can't you trust an atom?", punchline: 'Because they make up everything!' },
  { category: 'Science', setup: 'What did one photon say to the other?', punchline: '"I\'m traveling light."' },
  { category: 'Science', setup: 'Why did the physics teacher break up with the biology teacher?', punchline: 'There was no chemistry.' },
  { category: 'Science', setup: 'What do you call an acid with attitude?', punchline: 'A-mean-o acid!' },
  { category: 'Science', setup: 'Why did the student eat his homework?', punchline: 'The teacher told him it was a piece of cake.' },
  { category: 'IISER', setup: "What's an IISER student's favorite song?", punchline: '"Another One Bites the Dust" — the WiFi edition.' },
  { category: 'IISER', setup: 'Why did the IISER student cross the road?', punchline: "To submit their assignment before the deadline. They didn't make it." },
  { category: 'IISER', setup: 'What do IISER students and WiFi have in common?', punchline: 'Both disappear when you need them most.' },
  { category: 'IISER', setup: 'How many IISER students does it take to finish a project?', punchline: 'One. The night before the deadline.' },
  { category: 'Math', setup: 'Why was the equal sign so humble?', punchline: "Because it knew it wasn't less than or greater than anyone else." },
  { category: 'Math', setup: 'What do you call a snake that is 3.14 meters long?', punchline: 'A πthon.' },
  { category: 'Math', setup: 'Why was the math book sad?', punchline: 'Because it had too many problems.' },
]

export function JokeGeneratorApp() {
  let current = JOKES[0]
  let revealed = false
  let activeCategory: string | null = null
  let history: Joke[] = []

  const container = h('div', { className: 'app-body', style: { padding: '12px 16px' } })
  const categories = Array.from(new Set(JOKES.map(j => j.category)))

  function render() {
    container.innerHTML = ''
    container.appendChild(html('<p class="app-label cyan">// jokes.app — Random Joke Generator</p>'))

    // Category buttons
    const catContainer = h('div', { style: { display: 'flex', gap: '6px', marginBottom: '16px', flexWrap: 'wrap' } })
    
    catContainer.appendChild(h('button', {
      onclick: () => { activeCategory = null; render() },
      style: { padding: '3px 10px', background: !activeCategory ? '#ffd70020' : 'transparent', border: `1px solid ${!activeCategory ? '#ffd700' : '#333'}`, borderRadius: '4px', color: !activeCategory ? '#ffd700' : '#666', fontFamily: 'JetBrains Mono', fontSize: '11px', cursor: 'pointer' }
    }, 'All'))

    categories.forEach(cat => {
      catContainer.appendChild(h('button', {
        onclick: () => { activeCategory = cat; render() },
        style: { padding: '3px 10px', background: activeCategory === cat ? '#ffd70020' : 'transparent', border: `1px solid ${activeCategory === cat ? '#ffd700' : '#333'}`, borderRadius: '4px', color: activeCategory === cat ? '#ffd700' : '#666', fontFamily: 'JetBrains Mono', fontSize: '11px', cursor: 'pointer' }
      }, cat))
    })
    container.appendChild(catContainer)

    // Joke area
    const jokeContainer = h('div', { style: { background: '#111', border: '1px solid #1e1e1e', borderRadius: '8px', padding: '20px', marginBottom: '12px', minHeight: '140px' } })
    jokeContainer.appendChild(html(`<span style="background: #ffd70020; color: #ffd700; font-family: 'JetBrains Mono'; font-size: 10px; padding: 2px 8px; border-radius: 10px; border: 1px solid #ffd70040">${current.category}</span>`))
    jokeContainer.appendChild(html(`<p style="color: #fff; font-family: 'JetBrains Mono'; font-size: 14px; line-height: 1.7; margin: 12px 0 16px">${current.setup}</p>`))
    
    if (!revealed) {
      jokeContainer.appendChild(h('button', {
        onclick: () => { revealed = true; render() },
        style: { padding: '7px 20px', background: '#ffd70020', border: '1px solid #ffd700', borderRadius: '6px', color: '#ffd700', fontFamily: 'JetBrains Mono', fontSize: '12px', cursor: 'pointer' }
      }, 'Reveal punchline 🥁'))
    } else {
      jokeContainer.appendChild(html(`<p style="color: #00ff46; font-family: 'JetBrains Mono'; font-size: 13px; line-height: 1.7; border-top: 1px solid #1e1e1e; padding-top: 12px">😄 ${current.punchline}</p>`))
    }
    container.appendChild(jokeContainer)

    // Next joke button
    container.appendChild(h('button', {
      onclick: () => {
        const pool = activeCategory ? JOKES.filter(j => j.category === activeCategory) : JOKES
        const available = pool.filter(j => j.setup !== current.setup)
        const next = available[Math.floor(Math.random() * available.length)] || current
        history = [current, ...history.slice(0, 4)]
        current = next
        revealed = false
        render()
      },
      style: { width: '100%', padding: '8px', background: '#00ff4610', border: '1px solid #00ff4640', borderRadius: '6px', color: '#00ff46', fontFamily: 'JetBrains Mono', fontSize: '12px', cursor: 'pointer', marginBottom: '16px' }
    }, 'Next Joke →'))

    if (history.length > 0) {
      container.appendChild(html('<p class="app-label yellow">// recent jokes</p>'))
      const histContainer = h('div', { style: { display: 'flex', flexDirection: 'column', gap: '8px' } })
      history.forEach(j => {
        const item = h('div', { style: { background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: '6px', padding: '8px 12px' } })
        item.appendChild(html(`<p style="color: #666; font-family: 'JetBrains Mono'; font-size: 11px; margin: 0 0 4px">${j.setup}</p>`))
        item.appendChild(html(`<p style="color: #444; font-family: 'JetBrains Mono'; font-size: 11px; margin: 0">${j.punchline}</p>`))
        histContainer.appendChild(item)
      })
      container.appendChild(histContainer)
    }
  }

  render()
  return container
}
