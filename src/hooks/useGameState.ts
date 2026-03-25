import { useReducer } from 'react'
import { GameState, GameAction, Screen, Operation } from '@/types/game'
import { generateQuestion, calculatePoints, getLevelConfig, MAX_LEVEL } from '@/utils/gameLogic'

// ─── Initial state ────────────────────────────────────────────────────────────

const INITIAL_STATE: GameState = {
  screen: Screen.Menu,
  level: 1,
  score: 0,
  lives: 3,
  streak: 0,
  questionsAnsweredInLevel: 0,
  currentQuestion: null,
  isRetry: false,
  lastAnswerCorrect: null,
  selectedOperations: [],
}

// ─── Reducer ──────────────────────────────────────────────────────────────────

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME': {
      const ops = action.payload.operations
      return {
        ...INITIAL_STATE,
        screen: Screen.Playing,
        selectedOperations: ops,
        currentQuestion: generateQuestion(1, ops),
      }
    }

    case 'ANSWER': {
      const { currentQuestion } = state
      if (!currentQuestion) return state

      const isCorrect = action.payload === currentQuestion.correctAnswer

      if (isCorrect) {
        const newStreak = state.streak + 1
        const points = calculatePoints(newStreak)
        const newScore = state.score + points
        const newQuestionsAnswered = state.questionsAnsweredInLevel + 1
        const config = getLevelConfig(state.level)

        if (newQuestionsAnswered >= config.questionsToPass) {
          // Level complete
          if (state.level >= MAX_LEVEL) {
            return {
              ...state,
              score: newScore,
              streak: newStreak,
              questionsAnsweredInLevel: newQuestionsAnswered,
              lastAnswerCorrect: true,
              screen: Screen.GameOver,
            }
          }
          return {
            ...state,
            score: newScore,
            streak: newStreak,
            questionsAnsweredInLevel: newQuestionsAnswered,
            lastAnswerCorrect: true,
            screen: Screen.LevelUp,
          }
        }

        return {
          ...state,
          score: newScore,
          streak: newStreak,
          questionsAnsweredInLevel: newQuestionsAnswered,
          isRetry: false,
          lastAnswerCorrect: true,
          currentQuestion: generateQuestion(state.level, state.selectedOperations),
        }
      } else {
        const newLives = state.lives - 1
        const newStreak = 0

        if (newLives <= 0) {
          return {
            ...state,
            lives: 0,
            streak: newStreak,
            lastAnswerCorrect: false,
            screen: Screen.GameOver,
          }
        }

        return {
          ...state,
          lives: newLives,
          streak: newStreak,
          isRetry: true,
          lastAnswerCorrect: false,
        }
      }
    }

    case 'NEXT_QUESTION': {
      return {
        ...state,
        isRetry: false,
        lastAnswerCorrect: null,
        currentQuestion: generateQuestion(state.level, state.selectedOperations),
      }
    }

    case 'CONFIRM_LEVEL_UP': {
      const nextLevel = state.level + 1
      return {
        ...state,
        screen: Screen.Playing,
        level: nextLevel,
        questionsAnsweredInLevel: 0,
        isRetry: false,
        lastAnswerCorrect: null,
        currentQuestion: generateQuestion(nextLevel, state.selectedOperations),
      }
    }

    case 'RESTART': {
      return {
        ...INITIAL_STATE,
        screen: Screen.Menu,
      }
    }

    default:
      return state
  }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useGameState() {
  const [state, dispatch] = useReducer(gameReducer, INITIAL_STATE)
  return { state, dispatch }
}

// Re-export for convenience
export { Operation }
