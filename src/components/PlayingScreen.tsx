import { useEffect, useRef, useState } from 'react'
import { GameState, GameAction } from '@/types/game'
import { getLevelConfig } from '@/utils/gameLogic'
import { HUD } from './HUD'
import { QuestionCard } from './QuestionCard'

interface ConfettiParticle {
  id: number
  left: string
  color: string
  duration: string
  delay: string
}

const CONFETTI_COLORS = ['#ffd700', '#4ecdc4', '#ff6b9d', '#6bcb77', '#ff9f43']

function generateConfetti(count: number): ConfettiParticle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    duration: `${0.8 + Math.random() * 0.8}s`,
    delay: `${Math.random() * 0.4}s`,
  }))
}

interface PlayingScreenProps {
  state: GameState
  dispatch: React.Dispatch<GameAction>
}

export function PlayingScreen({ state, dispatch }: PlayingScreenProps) {
  const { score, lives, level, streak, currentQuestion, lastAnswerCorrect, questionsAnsweredInLevel } = state
  const [confetti, setConfetti] = useState<ConfettiParticle[]>([])
  const [feedbackVisible, setFeedbackVisible] = useState(false)
  const feedbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const levelConfig = getLevelConfig(level)

  function handleAnswer(choice: number) {
    if (feedbackTimer.current) clearTimeout(feedbackTimer.current)

    dispatch({ type: 'ANSWER', payload: choice })
    setFeedbackVisible(true)

    if (choice === currentQuestion?.correctAnswer) {
      setConfetti(generateConfetti(20))
    }

    feedbackTimer.current = setTimeout(() => {
      setFeedbackVisible(false)
      setConfetti([])
    }, 800)
  }

  useEffect(() => {
    return () => {
      if (feedbackTimer.current) clearTimeout(feedbackTimer.current)
    }
  }, [])

  return (
    <div className="playing-screen">
      <HUD score={score} lives={lives} level={level} streak={streak} />

      <div className="playing-screen__content">
        {currentQuestion && (
          <QuestionCard
            question={currentQuestion}
            onAnswer={handleAnswer}
            disabled={feedbackVisible}
            questionsAnswered={questionsAnsweredInLevel}
            levelConfig={levelConfig}
          />
        )}
      </div>

      {feedbackVisible && lastAnswerCorrect !== null && (
        <div
          className={`playing-screen__feedback ${
            lastAnswerCorrect
              ? 'playing-screen__feedback--correct'
              : 'playing-screen__feedback--wrong'
          }`}
          aria-live="assertive"
          aria-atomic="true"
        >
          {lastAnswerCorrect ? 'Corect! ✓' : 'Greșit! ✗'}
        </div>
      )}

      {confetti.length > 0 && (
        <div className="confetti-container" aria-hidden="true">
          {confetti.map((p) => (
            <div
              key={p.id}
              className="confetti-particle"
              style={{
                left: p.left,
                background: p.color,
                animationDuration: p.duration,
                animationDelay: p.delay,
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
