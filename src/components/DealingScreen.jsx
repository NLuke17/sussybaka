import { useState } from 'react'

export default function DealingScreen({ gameState, onDone }) {
  const { players, selectedCard, sussyBakaIndex } = gameState
  const [seen, setSeen] = useState(new Set())
  const [viewing, setViewing] = useState(null)
  const [phase, setPhase] = useState('list') // 'list' | 'cover' | 'card'

  const allSeen = seen.size === players.length
  const isSussyBaka = sussyBakaIndex.includes(viewing)

  function selectPlayer(i) {
    setViewing(i)
    setPhase('cover')
  }

  function handleReady() {
    setPhase('card')
  }

  function handleDone() {
    setSeen(prev => new Set([...prev, viewing]))
    setViewing(null)
    setPhase('list')
  }

  if (phase === 'cover') {
    return (
      <div className="screen cover-screen">
        <div className="cover-content">
          <span className="cover-icon">🙈</span>
          <h2 className="cover-title">Everyone look away!</h2>
          <p className="cover-subtitle">
            Only <span className="player-badge">{players[viewing]}</span> should see the next screen
          </p>
          <button className="cover-ready-btn" onClick={handleReady}>
            I'm {players[viewing]} — Show My Card
          </button>
        </div>
      </div>
    )
  }

  if (phase === 'card') {
    return (
      <div className="screen card-screen">
        <div className={`card card-front ${isSussyBaka ? 'card-sussy' : 'card-normal'}`}>
          {isSussyBaka ? (
            <SussyCard card={selectedCard} hintsEnabled={gameState.hintsEnabled} />
          ) : (
            <NormalCard card={selectedCard} />
          )}
        </div>
        <div className="card-done-area">
          <p className="remember-hint">
            Remember your {isSussyBaka ? 'clues' : 'word'} — keep it secret!
          </p>
          <button className="next-btn" onClick={handleDone}>
            Done — Pass Back 🤫
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="screen dealing-screen">
      <div className="dealing-header">
        <h2 className="dealing-title">Get Your Word</h2>
        <p className="dealing-subtitle">
          Tap your name to see your card privately
        </p>
        <div className="seen-counter">
          {seen.size}/{players.length} players ready
        </div>
      </div>

      <div className="player-pick-grid">
        {players.map((name, i) => {
          const done = seen.has(i)
          return (
            <button
              key={i}
              className={`player-pick-btn ${done ? 'player-pick-done' : 'player-pick-pending'}`}
              onClick={() => !done && selectPlayer(i)}
              disabled={done}
            >
              {done ? <span className="pick-check">✓</span> : <span className="pick-icon">🎭</span>}
              <span className="pick-name">{name}</span>
            </button>
          )
        })}
      </div>

      {allSeen && (
        <button className="start-discuss-btn" onClick={onDone}>
          Everyone's Ready — Start Discussion 💬
        </button>
      )}

      {!allSeen && (
        <p className="dealing-waiting">
          Waiting for {players.length - seen.size} more player{players.length - seen.size !== 1 ? 's' : ''}…
        </p>
      )}
    </div>
  )
}

function NormalCard({ card }) {
  return (
    <div className="card-content">
      <div className="card-role-badge role-normal">Regular Player</div>
      <p className="card-label">Your word is:</p>
      <h1 className="card-word">{card.word}</h1>
      <p className="card-flavor">Describe it without saying it directly!</p>
    </div>
  )
}

function SussyCard({ card, hintsEnabled }) {
  return (
    <div className="card-content">
      <div className="card-role-badge role-sussy">😈 Sussy Baka</div>
      <p className="card-label">You have no word — just {hintsEnabled ? 'clues' : 'a category'}:</p>
      <div className="sussy-clues">
        <div className="clue-box">
          <span className="clue-label">Category</span>
          <span className="clue-value">{card.packName}</span>
        </div>
        {hintsEnabled && (
          <div className="clue-box">
            <span className="clue-label">Hint</span>
            <span className="clue-value">{card.hint}</span>
          </div>
        )}
      </div>
      <p className="card-flavor">Blend in. Don't get caught!</p>
    </div>
  )
}
