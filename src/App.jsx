import { useState, useEffect } from 'react'
import SetupScreen from './components/SetupScreen'
import DealingScreen from './components/DealingScreen'
import DiscussScreen from './components/DiscussScreen'
import RevealScreen from './components/RevealScreen'
import PackMakerScreen from './components/PackMakerScreen'

export const SCREENS = {
  SETUP: 'setup',
  PACK_MAKER: 'pack_maker',
  DEALING: 'dealing',
  DISCUSS: 'discuss',
  REVEAL: 'reveal',
}

const STORAGE_KEY = 'sussy_custom_packs'

function loadCustomPacks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export default function App() {
  const [screen, setScreen] = useState(SCREENS.SETUP)
  const [gameState, setGameState] = useState(null)

  // Lifted so choices survive across rounds
  const [selectedPackIds, setSelectedPackIds] = useState(new Set(['anime']))
  const [hintsEnabled, setHintsEnabled] = useState(true)
  const [playerCount, setPlayerCount] = useState(4)
  const [playerNames, setPlayerNames] = useState(['', '', '', ''])
  const [sussyCount, setSussyCount] = useState(1)
  const [customPacks, setCustomPacks] = useState(loadCustomPacks)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customPacks))
  }, [customPacks])

  function addCustomPack(pack) {
    setCustomPacks(prev => [...prev, pack])
    setSelectedPackIds(prev => new Set([...prev, pack.id]))
  }

  function removeCustomPack(id) {
    setCustomPacks(prev => prev.filter(p => p.id !== id))
    setSelectedPackIds(prev => {
      const next = new Set(prev)
      next.delete(id)
      if (next.size === 0) next.add('anime')
      return next
    })
  }

  function startGame(config) {
    const { players, selectedCard, sussyBakaIndex } = config
    setGameState({ players, selectedCard, sussyBakaIndex, hintsEnabled })
    setScreen(SCREENS.DEALING)
  }

  function onDealtDone() {
    setScreen(SCREENS.DISCUSS)
  }

  function onQuit() {
    setGameState(null)
    setScreen(SCREENS.SETUP)
  }

  return (
    <div className="app">
      {screen === SCREENS.SETUP && (
        <SetupScreen
          onStart={startGame}
          onOpenPackMaker={() => setScreen(SCREENS.PACK_MAKER)}
          selectedPackIds={selectedPackIds}
          setSelectedPackIds={setSelectedPackIds}
          hintsEnabled={hintsEnabled}
          setHintsEnabled={setHintsEnabled}
          playerCount={playerCount}
          setPlayerCount={setPlayerCount}
          playerNames={playerNames}
          setPlayerNames={setPlayerNames}
          sussyCount={sussyCount}
          setSussyCount={setSussyCount}
          customPacks={customPacks}
          onAddCustomPack={addCustomPack}
          onRemoveCustomPack={removeCustomPack}
        />
      )}
      {screen === SCREENS.PACK_MAKER && (
        <PackMakerScreen
          onBack={() => setScreen(SCREENS.SETUP)}
          onAddToGame={(pack) => { addCustomPack(pack); setScreen(SCREENS.SETUP) }}
        />
      )}
      {screen === SCREENS.DEALING && gameState && (
        <DealingScreen gameState={gameState} onDone={onDealtDone} onQuit={onQuit} />
      )}
      {screen === SCREENS.DISCUSS && gameState && (
        <DiscussScreen gameState={gameState} onReveal={() => setScreen(SCREENS.REVEAL)} onQuit={onQuit} />
      )}
      {screen === SCREENS.REVEAL && gameState && (
        <RevealScreen gameState={gameState} onPlayAgain={onQuit} />
      )}
    </div>
  )
}
