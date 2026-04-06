import { h, html } from '../../../framework/render'

interface PollOption {
  label: string
  votes: number
}

interface PollData {
  question: string
  options: PollOption[]
}

const POLLS: PollData[] = [
  {
    question: 'Which is the best programming language?',
    options: [
      { label: 'Python', votes: 42 },
      { label: 'JavaScript', votes: 38 },
      { label: 'C++', votes: 21 },
      { label: 'Rust', votes: 15 },
      { label: 'Java', votes: 8 },
    ],
  },
  {
    question: 'Favourite part of IISER?',
    options: [
      { label: 'The research', votes: 55 },
      { label: 'The friends', votes: 89 },
      { label: 'The canteen food', votes: 12 },
      { label: 'The WiFi', votes: 3 },
      { label: 'Nothing lol', votes: 44 },
    ],
  },
  {
    question: 'Best time to code?',
    options: [
      { label: '12am - 3am', votes: 67 },
      { label: '3am - 6am', votes: 23 },
      { label: 'Morning', votes: 11 },
      { label: 'Afternoon', votes: 8 },
      { label: 'Whenever deadline hits', votes: 99 },
    ],
  },
]

export function PollApp() {
  const polls = structuredClone(POLLS)
  const voted: Record<string, number> = {}
  let activePoll = 0

  const container = h('div', { className: 'app-body', style: { padding: '12px 16px' } })

  function render() {
    container.innerHTML = ''
    container.appendChild(html('<p class="app-label cyan">// poll.app — Community Voting</p>'))

    const tabs = h('div', { style: { display: 'flex', gap: '6px', marginBottom: '16px', flexWrap: 'wrap' } })
    polls.forEach((_, i) => {
      tabs.appendChild(h('button', {
        onclick: () => { activePoll = i; render() },
        style: {
          padding: '4px 12px', background: activePoll === i ? '#00c8ff20' : 'transparent',
          border: `1px solid ${activePoll === i ? '#00c8ff' : '#333'}`,
          borderRadius: '4px', color: activePoll === i ? '#00c8ff' : '#666',
          fontFamily: 'JetBrains Mono', fontSize: '11px', cursor: 'pointer',
        }
      }, `Poll ${i + 1}`))
    })
    container.appendChild(tabs)

    const poll = polls[activePoll]
    const totalVotes = poll.options.reduce((a, o) => a + o.votes, 0)
    const hasVoted = voted[String(activePoll)] !== undefined

    const card = h('div', { style: { background: '#111', border: '1px solid #1e1e1e', borderRadius: '8px', padding: '16px' } })
    card.appendChild(html(`<p style="color: #fff; font-family: 'JetBrains Mono'; font-size: 14px; font-weight: 700; margin-bottom: 16px">${poll.question}</p>`))

    const optsList = h('div', { style: { display: 'flex', flexDirection: 'column', gap: '8px' } })
    poll.options.forEach((opt, i) => {
      const pct = totalVotes > 0 ? Math.round(opt.votes / totalVotes * 100) : 0
      const isVoted = voted[String(activePoll)] === i
      
      const optDiv = h('div', {})
      const header = h('div', { style: { display: 'flex', justifyContent: 'space-between', marginBottom: '4px' } })
      
      const btn = h('button', {
        onclick: () => {
          if (hasVoted) return
          poll.options[i].votes++
          voted[String(activePoll)] = i
          render()
        },
        style: {
          background: 'transparent', border: 'none', cursor: hasVoted ? 'default' : 'pointer',
          color: isVoted ? '#00ff46' : '#aaa', fontFamily: 'JetBrains Mono', fontSize: '12px',
          textAlign: 'left', padding: '0', display: 'flex', alignItems: 'center', gap: '6px',
        }
      })
      btn.innerHTML = `<span style="color: ${isVoted ? '#00ff46' : '#333'}; font-size: 14px">${isVoted ? '●' : '○'}</span>${opt.label}`
      header.appendChild(btn)
      
      if (hasVoted) {
        header.appendChild(html(`<span style="color: #555; font-family: 'JetBrains Mono'; font-size: 11px">${opt.votes} (${pct}%)</span>`))
        const bar = h('div', { style: { height: '4px', background: '#1a1a1a', borderRadius: '2px', overflow: 'hidden' } })
        bar.appendChild(html(`<div style="height: 100%; width: ${pct}%; background: ${isVoted ? '#00ff46' : '#00c8ff'}; border-radius: 2px; transition: width 0.4s"></div>`))
        optDiv.appendChild(header)
        optDiv.appendChild(bar)
      } else {
         optDiv.appendChild(header)
      }
      
      optsList.appendChild(optDiv)
    })
    
    card.appendChild(optsList)
    
    if (!hasVoted) {
      card.appendChild(html('<p style="color: #444; font-family: \'JetBrains Mono\'; font-size: 11px; margin-top: 12px">Click an option to vote</p>'))
    } else {
      card.appendChild(html(`<p style="color: #555; font-family: 'JetBrains Mono'; font-size: 11px; margin-top: 12px">Total votes: ${totalVotes}</p>`))
    }

    container.appendChild(card)
  }

  render()
  return container
}
