import { useState, useRef } from 'react'
import { DEFAULT_PACKS } from '../data/packs'

export default function SetupScreen({ onStart }) {
  const [playerCount, setPlayerCount] = useState(4)
  const [playerNames, setPlayerNames] = useState(['', '', '', ''])
  const [selectedPackId, setSelectedPackId] = useState('anime')
  const [customPacks, setCustomPacks] = useState([])
  const [uploadError, setUploadError] = useState('')
  const [sussyCount, setSussyCount] = useState(1)
  const [hintsEnabled, setHintsEnabled] = useState(true)
  const fileInputRef = useRef()

  const allPacks = [...DEFAULT_PACKS, ...customPacks]
  const selectedPack = allPacks.find(p => p.id === selectedPackId)

  function updatePlayerCount(n) {
    const count = Math.max(3, Math.min(12, n))
    setPlayerCount(count)
    setPlayerNames(prev => {
      const next = [...prev]
      while (next.length < count) next.push('')
      return next.slice(0, count)
    })
    if (sussyCount >= count) setSussyCount(count - 1)
  }

  function updateName(i, val) {
    setPlayerNames(prev => { const n = [...prev]; n[i] = val; return n })
  }

  function handleFileUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    setUploadError('')
    const reader = new FileReader()
    reader.onload = (evt) => {
      try {
        const data = JSON.parse(evt.target.result)
        if (!data.name || !Array.isArray(data.cards)) {
          setUploadError('Invalid pack format. Need { name, cards: [{ word, category, hint }] }')
          return
        }
        const invalid = data.cards.find(c => !c.word || !c.category || !c.hint)
        if (invalid) {
          setUploadError('Each card needs: word, category, hint')
          return
        }
        const id = 'custom_' + Date.now()
        const pack = {
          id,
          name: data.name,
          emoji: data.emoji || '📦',
          description: data.description || 'Custom pack',
          cards: data.cards,
        }
        setCustomPacks(prev => [...prev, pack])
        setSelectedPackId(id)
      } catch {
        setUploadError('Could not parse file. Make sure it is valid JSON.')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  function handleStart() {
    if (!selectedPack || selectedPack.cards.length === 0) return
    const names = playerNames.map((n, i) => n.trim() || `Player ${i + 1}`)
    const cardIndex = Math.floor(Math.random() * selectedPack.cards.length)
    const selectedCard = selectedPack.cards[cardIndex]

    const indices = Array.from({ length: playerCount }, (_, i) => i)
    const shuffled = indices.sort(() => Math.random() - 0.5)
    const sussyBakaIndices = shuffled.slice(0, sussyCount)

    onStart({ players: names, selectedCard, sussyBakaIndex: sussyBakaIndices, hintsEnabled })
  }

  const canStart = selectedPack && playerCount >= 3

  return (
    <div className="screen setup-screen">
      <div className="setup-header">
        <h1 className="game-title">
          <span className="title-sus">Sussy</span>{' '}
          <span className="title-baka">Baka</span>
        </h1>
        <p className="game-subtitle">The sneaky word impostor game 🎭</p>
      </div>

      <div className="setup-body">
        <section className="setup-section">
          <h2 className="section-title">Players</h2>
          <div className="player-count-row">
            <button className="count-btn" onClick={() => updatePlayerCount(playerCount - 1)} disabled={playerCount <= 3}>−</button>
            <span className="count-display">{playerCount}</span>
            <button className="count-btn" onClick={() => updatePlayerCount(playerCount + 1)} disabled={playerCount >= 12}>+</button>
          </div>
          <div className="player-names-grid">
            {Array.from({ length: playerCount }, (_, i) => (
              <input
                key={i}
                className="player-name-input"
                placeholder={`Player ${i + 1}`}
                value={playerNames[i] || ''}
                onChange={e => updateName(i, e.target.value)}
                maxLength={20}
              />
            ))}
          </div>
        </section>

        <section className="setup-section">
          <h2 className="section-title">Sussy Bakas</h2>
          <p className="section-hint">How many imposters?</p>
          <div className="player-count-row">
            <button className="count-btn" onClick={() => setSussyCount(s => Math.max(1, s - 1))} disabled={sussyCount <= 1}>−</button>
            <span className="count-display">{sussyCount}</span>
            <button className="count-btn" onClick={() => setSussyCount(s => Math.min(playerCount - 2, s + 1))} disabled={sussyCount >= playerCount - 2}>+</button>
          </div>
        </section>

        <section className="setup-section">
          <h2 className="section-title">Options</h2>
          <div className="option-row">
            <div className="option-info">
              <span className="option-label">Hints for Sussy Baka</span>
              <span className="option-desc">Show a vague extra clue alongside the category</span>
            </div>
            <button
              className={`toggle-btn ${hintsEnabled ? 'toggle-on' : 'toggle-off'}`}
              onClick={() => setHintsEnabled(h => !h)}
              aria-pressed={hintsEnabled}
            >
              <span className="toggle-knob" />
            </button>
          </div>
        </section>

        <section className="setup-section">
          <h2 className="section-title">Word Pack</h2>
          <div className="pack-grid">
            {allPacks.map(pack => (
              <button
                key={pack.id}
                className={`pack-card ${selectedPackId === pack.id ? 'pack-selected' : ''}`}
                onClick={() => setSelectedPackId(pack.id)}
              >
                <span className="pack-emoji">{pack.emoji}</span>
                <span className="pack-name">{pack.name}</span>
                <span className="pack-count">{pack.cards.length} cards</span>
              </button>
            ))}
          </div>

          <div className="upload-area">
            <button className="upload-btn" onClick={() => fileInputRef.current.click()}>
              + Upload Custom Pack
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              style={{ display: 'none' }}
              onChange={handleFileUpload}
            />
            {uploadError && <p className="upload-error">{uploadError}</p>}
            <p className="upload-hint">
              JSON format: {'{ "name": "My Pack", "emoji": "🔥", "cards": [{ "word": "...", "category": "...", "hint": "..." }] }'}
            </p>
          </div>
        </section>

        <button
          className="start-btn"
          onClick={handleStart}
          disabled={!canStart}
        >
          Start Game 🎭
        </button>
      </div>
    </div>
  )
}
