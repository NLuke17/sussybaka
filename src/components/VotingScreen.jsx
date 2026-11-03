import { useState } from 'react'

export default function VotingScreen({ gameState, onVote }) {
  const { players } = gameState
  const [votes, setVotes] = useState({})
  const [currentVoter, setCurrentVoter] = useState(0)
  const [voterReady, setVoterReady] = useState(false)

  const voted = votes[currentVoter]
  const isLast = currentVoter === players.length - 1

  function castVote(targetIndex) {
    setVotes(v => ({ ...v, [currentVoter]: targetIndex }))
  }

  function confirmVote() {
    if (voted === undefined) return
    if (isLast) {
      onVote({ ...votes, [currentVoter]: voted })
    } else {
      setCurrentVoter(v => v + 1)
      setVoterReady(false)
    }
  }

  function handleVoterReady() {
    setVoterReady(true)
  }

  return (
    <div className="screen voting-screen">
      <div className="voting-header">
        <h2 className="voting-title">Time to Vote 🗳️</h2>
        <div className="voter-turn">
          {!voterReady ? (
            <>
              <p className="voter-prompt">
                Hand the device to <span className="player-badge">{players[currentVoter]}</span>
              </p>
              <button className="ready-btn" onClick={handleVoterReady}>
                I'm {players[currentVoter]} — Ready to Vote
              </button>
            </>
          ) : (
            <p className="voter-prompt">
              <span className="player-badge">{players[currentVoter]}</span> — who is the Sussy Baka?
            </p>
          )}
        </div>
        <div className="progress-dots">
          {players.map((_, i) => (
            <span
              key={i}
              className={`dot ${i < currentVoter ? 'dot-done' : i === currentVoter ? 'dot-active' : 'dot-pending'}`}
            />
          ))}
        </div>
      </div>

      {voterReady && (
        <>
          <div className="vote-grid">
            {players.map((name, i) => {
              const isSelf = i === currentVoter
              const isSelected = votes[currentVoter] === i
              return (
                <button
                  key={i}
                  className={`vote-card ${isSelected ? 'vote-selected' : ''} ${isSelf ? 'vote-self' : ''}`}
                  onClick={() => !isSelf && castVote(i)}
                  disabled={isSelf}
                >
                  <span className="vote-name">{name}</span>
                  {isSelf && <span className="vote-self-label">(you)</span>}
                  {isSelected && <span className="vote-check">✓</span>}
                </button>
              )
            })}
          </div>

          <div className="voting-actions">
            <button
              className="confirm-vote-btn"
              onClick={confirmVote}
              disabled={voted === undefined}
            >
              {isLast ? 'Reveal Results 🎉' : 'Confirm Vote →'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
