import { h } from '../../../framework/render'

const RESPONSES: Record<string, string[]> = {
  hello:     ['Hello! I am SlashDot AI. How can I assist you today?', 'Greetings, human. What brings you to my terminal?', 'Hi there! Ready to answer your questions — or pretend to.'],
  hi:        ['Hey! What can I help you with?', 'Hi! Ask me anything about IISER, coding, or the meaning of life.'],
  iiser:     ['IISER Kolkata — Indian Institute of Science Education and Research, Kolkata. A premier research institution. Home to some of the most sleep-deprived students in India.', 'Ah, IISER Kolkata! Where the WiFi is a myth and the deadlines are real.'],
  slashdot:  ['SlashDot is the Programming & Design Club of IISER Kolkata. We build cool stuff and occasionally sleep.', 'The best club at IISER. Obviously. I may be biased — I am their AI.'],
  code:      ['Ah, coding! The art of turning caffeine into software. What language are you working with?', 'Code is poetry. Except when it has bugs. Then it is a horror novel.'],
  python:    ['Python is excellent! Readable, versatile, and beloved. pip install everything.', 'Ah Python — the language that makes you think programming is easy until it isn\'t.'],
  javascript: ['JavaScript — the language of the web! Also the language of unexpected behavior. typeof null === "object"? Classic.', 'JavaScript: where every function returns undefined until it doesn\'t.'],
  help:      ['I can talk about: IISER, SlashDot, programming, science, jokes, life advice, or the meaning of the universe.', 'Ask me anything! I will answer with varying degrees of accuracy.'],
  joke:      ['Why do programmers prefer dark mode? Because light attracts bugs! 😄', 'Why was the computer cold? It left its Windows open! 😂', 'What do you call a sleeping dinosaur? A dino-snore! 🦕'],
  cgpa:      ['CGPA is just a number. A very important number that determines your entire future. But just a number.', 'The secret to a good CGPA: attend class, do assignments, sleep occasionally. I am told this is "hard".'],
  deadline:  ['Deadlines are merely suggestions... said no professor ever. Submit on time!', 'The best time to start was yesterday. The second best time is right now. But really, 3am the night before works too.'],
  wifi:      ['IISER WiFi: Schrödinger\'s connection — it both works and doesn\'t work until you need it.', 'The WiFi is down? Ah yes, that is the default state.'],
  sleep:     ['Sleep is important! Aim for 8 hours. IISER students typically aim for 4 and get 3.', 'Sleep is for the weak. Just kidding. Sleep. Please sleep.'],
  food:      ['The IISER canteen serves food that is nutritionally adequate and emotionally questionable.', 'Food at IISER: it exists. That is the most positive thing I can say.'],
  life:      ['The meaning of life is 42. But also: curiosity, connection, and occasionally finishing your code before the deadline.', 'Life at IISER: wake up, study, question your choices, sleep, repeat.'],
  thanks:    ['You\'re welcome! Come back anytime.', 'Happy to help! Now go study.', 'Anytime! I am always here, floating in the terminal.'],
  bye:       ['Goodbye! Don\'t forget to submit your assignments.', 'See you! May your code compile on the first try.', 'Farewell! May the WiFi be with you.'],
  weather:   ['I hear the weather in Mohanpur is hot and humid. The canteen queue is long. The WiFi is down. Business as usual.'],
  music:     ['I enjoy the sound of compilation errors. Very rhythmic.'],
  game:      ['I hear there are games in this OS! Try opening Asteroids or Pong from the desktop.'],
  study:     ['Study tip: Pomodoro technique. 25 minutes of work, 5 minutes of existential dread, repeat.'],
}

const FALLBACKS = [
  'Interesting question. I am processing... still processing... I have no idea.',
  'That is beyond my current knowledge base. Try asking the terminal.',
  'Hmm. My training data does not cover that. Have you tried Stack Overflow?',
  'I am a fake AI in a fake OS. My capabilities are... limited. But my enthusiasm is boundless.',
  'Error 404: Answer not found. But I appreciate the question!',
  'Let me think... nope. I have nothing. But the silence was meaningful.',
  'Great question! I will deflect it with this fun fact: there are more stars in the universe than grains of sand on Earth.',
]

function getResponse(input: string): string {
  const lower = input.toLowerCase()
  for (const [key, responses] of Object.entries(RESPONSES)) {
    if (lower.includes(key)) return responses[Math.floor(Math.random() * responses.length)]
  }
  return FALLBACKS[Math.floor(Math.random() * FALLBACKS.length)]
}

export function SlashDotAIApp(): HTMLElement {
  const msgsContainer = h('div', { style: 'flex:1;overflow-y:auto;padding:12px 16px;display:flex;flex-direction:column;gap:10px' })
  const bottomAnchor = h('div')
  msgsContainer.appendChild(bottomAnchor)

  function addMsg(role: 'user' | 'ai', content: string) {
    const time = new Date().toLocaleTimeString()
    const isUser = role === 'user'
    const bubble = h('div', { style: `display:flex;flex-direction:${isUser ? 'row-reverse' : 'row'};gap:8px;align-items:flex-end` },
      h('div', { style: `background:${isUser ? '#00ff4620' : '#111'};border:1px solid ${isUser ? '#00ff4640' : '#1e1e1e'};border-radius:${isUser ? '12px 12px 2px 12px' : '12px 12px 12px 2px'};padding:8px 12px;max-width:75%` },
        h('p', { style: `color:${isUser ? '#00ff46' : '#d0d0d0'};font-family:JetBrains Mono;font-size:12px;line-height:1.6;margin:0` }, content),
        h('span', { style: 'color:#444;font-family:JetBrains Mono;font-size:9px;margin-top:4px;display:block' }, time)
      )
    )
    msgsContainer.insertBefore(bubble, bottomAnchor)
    bottomAnchor.scrollIntoView({ behavior: 'smooth' })
  }

  addMsg('ai', "Hello! I am SlashDot AI — the world's most fake AI assistant. Ask me anything about IISER, coding, science, or life. I will answer with variable accuracy.")

  let typingEl: HTMLElement | null = null

  const inputEl = h('input', {
    placeholder: 'Ask SlashDot AI anything...',
    style: 'flex:1;padding:8px 12px;background:#111;border:1px solid #222;border-radius:6px;color:#d0d0d0;font-family:JetBrains Mono;font-size:12px;outline:none',
  }) as HTMLInputElement

  function send() {
    const text = inputEl.value.trim()
    if (!text) return
    addMsg('user', text)
    inputEl.value = ''

    typingEl = h('div', { style: 'display:flex;gap:8px;align-items:flex-end' },
      h('div', { style: 'background:#111;border:1px solid #1e1e1e;border-radius:12px 12px 12px 2px;padding:10px 16px' },
        h('span', { style: 'color:#555;font-family:JetBrains Mono;font-size:12px' }, 'thinking...')
      )
    )
    msgsContainer.insertBefore(typingEl, bottomAnchor)
    bottomAnchor.scrollIntoView({ behavior: 'smooth' })

    const response = getResponse(text)
    setTimeout(() => {
      if (typingEl && typingEl.parentNode) typingEl.parentNode.removeChild(typingEl)
      typingEl = null
      addMsg('ai', response)
    }, 600 + Math.random() * 800)
  }

  inputEl.addEventListener('keydown', (e: KeyboardEvent) => { if (e.key === 'Enter') send() })

  const sendBtn = h('button', {
    style: 'padding:8px 16px;background:#00ff4620;border:1px solid #00ff46;border-radius:6px;color:#00ff46;font-family:JetBrains Mono;font-size:12px;cursor:pointer',
    onClick: send,
  }, 'Send')

  return h('div', { style: 'background:#0a0a0a;width:100%;height:100%;display:flex;flex-direction:column' },
    h('div', { style: 'padding:8px 16px;border-bottom:1px solid #1e1e1e;display:flex;align-items:center;gap:10px' },
      h('span', { style: 'color:#00ff46;font-family:JetBrains Mono;font-size:12px;font-weight:700' }, 'SlashDot AI'),
      h('span', { style: 'background:#00ff4620;color:#00ff46;font-family:JetBrains Mono;font-size:10px;padding:1px 8px;border-radius:10px;border:1px solid #00ff4640' }, '● online'),
      h('span', { style: 'color:#444;font-family:JetBrains Mono;font-size:10px;margin-left:auto' }, 'Powered by imagination'),
    ),
    msgsContainer,
    h('div', { style: 'padding:10px 16px;border-top:1px solid #1e1e1e;display:flex;gap:8px' }, inputEl, sendBtn),
  )
}
