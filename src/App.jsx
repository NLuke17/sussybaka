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

  function startGame(config) {
    const { players, selectedCard, sussyBakaIndex, hintsEnabled } = config
    setGameState({ players, selectedCard, sussyBakaIndex, hintsEnabled })
    setScreen(SCREENS.DEALING)
  }

  function onDealtDone() {
    setScreen(SCREENS.DISCUSS)
  }

  function onPlayAgain() {
    setGameState(null)
    setScreen(SCREENS.SETUP)
  }

  return (
    <div className="app">
      {screen === SCREENS.SETUP && (
        <SetupScreen onStart={startGame} />
      )}
      {screen === SCREENS.DEALING && gameState && (
        <DealingScreen gameState={gameState} onDone={onDealtDone} />
      )}
      {screen === SCREENS.DISCUSS && gameState && (
        <DiscussScreen gameState={gameState} onReveal={() => setScreen(SCREENS.REVEAL)} />
      )}
      {screen === SCREENS.REVEAL && gameState && (
        <RevealScreen gameState={gameState} onPlayAgain={onPlayAgain} />
      )}
    </div>
  )
}
