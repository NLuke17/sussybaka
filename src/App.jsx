import { useState } from 'react'
import SetupScreen from './components/SetupScreen'
import DealingScreen from './components/DealingScreen'
import DiscussScreen from './components/DiscussScreen'
import RevealScreen from './components/RevealScreen'

export const SCREENS = {
  SETUP: 'setup',
  DEALING: 'dealing',
  DISCUSS: 'discuss',
  REVEAL: 'reveal',
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
