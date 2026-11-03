import { useState, useEffect } from 'react'

const DISCUSSION_TIME = 180

export default function DiscussScreen({ gameState, onReveal }) {
  const { players, sussyBakaIndex } = gameState
  const [timeLeft, setTimeLeft] = useState(DISCUSSION_TIME)
  const [running, setRunning] = useState(true)

  useEffect(() => {
    if (!running) return
    if (timeLeft <= 0) {
      setRunning(false)
      return
    }
    const id = setInterval(() => setTimeLeft(t => t - 1), 1000)
    return () => clearInterval(id)
  }, [running, timeLeft])

  const mins = String(Math.floor(timeLeft / 60)).padStart(2, '0')
  const secs = String(timeLeft % 60).padStart(2, '0')
  const pct = timeLeft / DISCUSSION_TIME
  const urgent = timeLeft <= 30

  return (
    <div className="screen discuss-screen">
      <div className="discuss-header">
        <h2 className="discuss-title">Discussion Time 💬</h2>
        <p className="discuss-subtitle">
          Somewhere in this group,{' '}
          <strong>{sussyBakaIndex.length === 1 ? 'one player is' : `${sussyBakaIndex.length} players are`} the Sussy Baka</strong>.
          {' '}Take turns describing your word without saying it!
        </p>
      </div>

      <div className="timer-area">
        <svg className="timer-ring" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="52" className="timer-track" />
          <circle
            cx="60" cy="60" r="52"
            className={`timer-fill ${urgent ? 'timer-urgent' : ''}`}
            strokeDasharray={`${2 * Math.PI * 52}`}
            strokeDashoffset={`${2 * Math.PI * 52 * (1 - pct)}`}
            style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.5s' }}
          />
        </svg>
        <div className="timer-text">
          <span className={`timer-digits ${urgent ? 'timer-digits-urgent' : ''}`}>{mins}:{secs}</span>
        </div>
      </div>

      <div className="discussion-rules">
        <h3 className="rules-title">Rules</h3>
        <ul className="rules-list">
          <li>🗣️ Each player gives <strong>one clue</strong> about their word</li>
          <li>🚫 Don't say the actual word or rhymes with it</li>
          <li>🕵️ Sussy Bakas must fake it using only their hint</li>
          <li>👀 Watch for players who seem off or vague</li>
          <li>🗳️ Discuss and agree on who you think is Sussy Baka</li>
        </ul>
      </div>

      <div className="discuss-actions">
        <button
          className="timer-toggle-btn"
          onClick={() => setRunning(r => !r)}
        >
          {running ? '⏸ Pause' : '▶ Resume'}
        </button>
        <button className="vote-btn" onClick={onReveal}>
          Reveal Imposter 🎭
        </button>
      </div>
    </div>
  )
}
