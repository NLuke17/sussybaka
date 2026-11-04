import { useState } from 'react'

const EMOJI_OPTIONS = ['📦', '🔥', '⚡', '🎮', '🌙', '🦄', '💀', '🎲', '🧠', '🌈', '👾', '🍕']

export default function PackMakerScreen({ onBack, onAddToGame }) {
  const [packName, setPackName] = useState('')
  const [packEmoji, setPackEmoji] = useState('📦')
  const [cards, setCards] = useState([{ word: '', hint: '' }, { word: '', hint: '' }])

  function updateCard(i, field, val) {
    setCards(prev => { const next = [...prev]; next[i] = { ...next[i], [field]: val }; return next })
  }

  function addCard() {
    setCards(prev => [...prev, { word: '', hint: '' }])
  }

  function removeCard(i) {
    if (cards.length <= 1) return
    setCards(prev => prev.filter((_, idx) => idx !== i))
  }

  const validCards = cards.filter(c => c.word.trim() && c.hint.trim())
  const canExport = packName.trim() && validCards.length > 0

  function buildPack() {
    return {
      id: 'custom_' + Date.now(),
      name: packName.trim(),
      emoji: packEmoji,
      description: 'Custom pack',
      cards: validCards.map(c => ({ word: c.word.trim(), hint: c.hint.trim() })),
    }
  }

  function handleDownload() {
    const pack = buildPack()
    const { id, description, ...exportData } = pack
    const json = JSON.stringify(exportData, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${pack.name.toLowerCase().replace(/\s+/g, '-')}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleAddToGame() {
    onAddToGame(buildPack())
  }

  return (
    <div className="screen packmaker-screen">
      <div className="packmaker-topbar">
        <button className="quit-btn" onClick={onBack}>← Back</button>
        <h2 className="packmaker-title">Pack Maker</h2>
      </div>

      <div className="packmaker-body">
        <section className="setup-section">
          <h3 className="section-title">Pack Info</h3>
          <div className="packmaker-info-row">
            <div className="emoji-picker">
              {EMOJI_OPTIONS.map(e => (
                <button
                  key={e}
                  className={`emoji-opt ${packEmoji === e ? 'emoji-selected' : ''}`}
                  onClick={() => setPackEmoji(e)}
                >{e}</button>
              ))}
            </div>
            <input
              className="player-name-input packmaker-name-input"
              placeholder="Pack name"
              value={packName}
              onChange={e => setPackName(e.target.value)}
              maxLength={30}
            />
          </div>
        </section>

        <section className="setup-section">
          <div className="packmaker-cards-header">
            <h3 className="section-title">Cards <span className="pack-total">{validCards.length} ready</span></h3>
          </div>

          <div className="packmaker-cards-list">
            {cards.map((card, i) => (
              <div key={i} className="packmaker-card-row">
                <span className="card-row-num">{i + 1}</span>
                <input
                  className="packmaker-input"
                  placeholder="Word"
                  value={card.word}
                  onChange={e => updateCard(i, 'word', e.target.value)}
                  maxLength={40}
                />
                <input
                  className="packmaker-input packmaker-hint-input"
                  placeholder="Hint (1 word)"
                  value={card.hint}
                  onChange={e => updateCard(i, 'hint', e.target.value)}
                  maxLength={20}
                />
                <button
                  className="card-row-remove"
                  onClick={() => removeCard(i)}
                  disabled={cards.length <= 1}
                  aria-label="Remove card"
                >✕</button>
              </div>
            ))}
          </div>

          <button className="add-card-btn" onClick={addCard}>+ Add Card</button>
        </section>

        <div className="packmaker-actions">
          <button className="download-btn" onClick={handleDownload} disabled={!canExport}>
            Download JSON
          </button>
          <button className="start-btn" onClick={handleAddToGame} disabled={!canExport}>
            Add to Game 🎮
          </button>
        </div>
      </div>
    </div>
  )
}
