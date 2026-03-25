import { Screen, Operation } from '@/types/game'
import { useGameState } from '@/hooks/useGameState'
import { StarField } from '@/components/StarField'
import { MenuScreen } from '@/components/MenuScreen'
import { PlayingScreen } from '@/components/PlayingScreen'
import { LevelUpScreen } from '@/components/LevelUpScreen'
import { GameOverScreen } from '@/components/GameOverScreen'
import '@/styles/index.css'

export default function App() {
  const { state, dispatch } = useGameState()

  function renderScreen() {
    switch (state.screen) {
      case Screen.Menu:
        return (
          <MenuScreen
            onStart={(operations: Operation[]) =>
              dispatch({ type: 'START_GAME', payload: { operations } })
            }
          />
        )

      case Screen.Playing:
        return <PlayingScreen state={state} dispatch={dispatch} />

      case Screen.LevelUp:
        return (
          <LevelUpScreen
            level={state.level}
            score={state.score}
            onContinue={() => dispatch({ type: 'CONFIRM_LEVEL_UP' })}
          />
        )

      case Screen.GameOver:
        return (
          <GameOverScreen
            score={state.score}
            level={state.level}
            onRestart={() => dispatch({ type: 'RESTART' })}
          />
        )
    }
  }

  return (
    <div className="app">
      <StarField />
      {renderScreen()}
    </div>
  )
}
