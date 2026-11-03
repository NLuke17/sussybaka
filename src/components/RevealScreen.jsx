export default function RevealScreen({ gameState, onPlayAgain: onQuit }) {
  const { players, selectedCard, sussyBakaIndex } = gameState
  const sussyNames = sussyBakaIndex.map(i => players[i])

  return (
    <div className="screen reveal-screen">
      <div className="sussy-reveal-cards">
        {sussyBakaIndex.map(idx => (
          <div key={idx} className="sussy-reveal-card">
            <div className="sussy-reveal-name">{players[idx]}</div>
            <div className="sussy-reveal-label">was the Sussy Baka 😈</div>
          </div>
        ))}
      </div>

      <div className="word-reveal">
        <p className="word-reveal-label">The word was:</p>
        <h1 className="word-reveal-word">{selectedCard.word}</h1>
        <div className="word-reveal-meta">
          <span className="word-reveal-cat">{selectedCard.category}</span>
          <span className="word-reveal-hint">Hint: {selectedCard.hint}</span>
        </div>
      </div>

      <button className="play-again-btn" onClick={onQuit}>
        Play Again 🎮
      </button>
    </div>
  )
}
