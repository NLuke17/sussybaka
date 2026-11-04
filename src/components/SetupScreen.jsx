import { useState, useRef } from 'react'
import { DEFAULT_PACKS } from '../data/packs'

export default function SetupScreen({
  onStart,
  selectedPackIds, setSelectedPackIds,
  hintsEnabled, setHintsEnabled,
  playerCount, setPlayerCount,
  playerNames, setPlayerNames,
  sussyCount, setSussyCount,
}) {
  const [customPacks, setCustomPacks] = useState([])
  const [uploadError, setUploadError] = useState('')
  const fileInputRef = useRef()

  const allPacks = [...DEFAULT_PACKS, ...customPacks]
  const totalCards = allPacks
    .filter(p => selectedPackIds.has(p.id))
    .reduce((sum, p) => sum + p.cards.length, 0)

  function togglePack(id) {
    setSelectedPackIds(prev => {
      if (prev.has(id) && prev.size === 1) return prev // keep at least one
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

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
    setPlayerNames(prev => { const next = [...prev]; next[i] = val; return next })
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
          setUploadError('Invalid pack format. Need { name, cards: [{ word, hint }] }')
          return
        }
        const invalid = data.cards.find(c => !c.word || !c.hint)
        if (invalid) {
          setUploadError('Each card needs: word, hint')
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
        setSelectedPackIds(prev => new Set([...prev, id]))
      } catch {
        setUploadError('Could not parse file. Make sure it is valid JSON.')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  function handleStart() {
    if (selectedPackIds.size === 0 || totalCards === 0) return
    const names = playerNames.map((n, i) => n.trim() || `Player ${i + 1}`)

    const pooledCards = allPacks
      .filter(p => selectedPackIds.has(p.id))
      .flatMap(p => p.cards.map(c => ({ ...c, packName: p.name })))

    const selectedCard = pooledCards[Math.floor(Math.random() * pooledCards.length)]

    const indices = Array.from({ length: playerCount }, (_, i) => i)
    const shuffled = indices.sort(() => Math.random() - 0.5)
    const sussyBakaIndices = shuffled.slice(0, sussyCount)

    onStart({ players: names, selectedCard, sussyBakaIndex: sussyBakaIndices, hintsEnabled })
  }

  const canStart = selectedPackIds.size > 0 && playerCount >= 3

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
              <span className="option-desc">Show a vague extra clue alongside the pack name</span>
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
          <div className="pack-section-header">
            <h2 className="section-title">Word Packs</h2>
            <span className="pack-total">{totalCards} cards in pool</span>
          </div>
          <div className="pack-grid">
            {allPacks.map(pack => {
              const selected = selectedPackIds.has(pack.id)
              return (
                <button
                  key={pack.id}
                  className={`pack-card ${selected ? 'pack-selected' : ''}`}
                  onClick={() => togglePack(pack.id)}
                >
                  {selected && <span className="pack-check">✓</span>}
                  <span className="pack-emoji">{pack.emoji}</span>
                  <span className="pack-name">{pack.name}</span>
                  <span className="pack-count">{pack.cards.length} cards</span>
                </button>
              )
            })}
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
              {'{ "name": "My Pack", "emoji": "🔥", "cards": [{ "word": "...", "hint": "..." }] }'}
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
