import { useState, useEffect } from 'react'
import { Question, LevelConfig } from '@/types/game'
import { operationSymbol } from '@/utils/gameLogic'

interface QuestionCardProps {
  question: Question
  onAnswer: (choice: number) => void
  disabled: boolean
  questionsAnswered: number
  levelConfig: LevelConfig
}

export function QuestionCard({
  question,
  onAnswer,
  disabled,
  questionsAnswered,
  levelConfig,
}: QuestionCardProps) {
  const { operandA, operandB, operation, correctAnswer, choices } = question
  const symbol = operationSymbol(operation)
  const progress = Math.min(questionsAnswered / levelConfig.questionsToPass, 1)

  const [selected, setSelected] = useState<number | null>(null)

  // Reset local selection whenever a new question arrives
  useEffect(() => {
    setSelected(null)
  }, [question])

  function handleSelect(choice: number) {
    if (selected !== null || disabled) return
    setSelected(choice)
    onAnswer(choice)
  }

  function choiceClass(choice: number): string {
    let cls = 'question-card__choice'
    if (selected !== null) {
      if (choice === correctAnswer) {
        cls += ' question-card__choice--correct'
      } else if (choice === selected) {
        cls += ' question-card__choice--wrong'
      } else {
        cls += ' question-card__choice--neutral'
      }
    }
    return cls
  }

  return (
    <article className="question-card" aria-label="Întrebare de matematică">
      <p
        className="question-card__prompt"
        aria-live="polite"
        aria-label={`Cât face ${operandA} ${symbol} ${operandB}?`}
      >
        {operandA} {symbol} {operandB} = ?
      </p>

      <div
        className="question-card__choices"
        role="group"
        aria-label="Variante de răspuns"
      >
        {choices.map((choice) => (
          <button
            key={choice}
            className={choiceClass(choice)}
            onClick={() => handleSelect(choice)}
            disabled={disabled || selected !== null}
            aria-label={`Răspuns: ${choice}`}
            aria-pressed={selected === choice}
          >
            {choice}
          </button>
        ))}
      </div>

      <div
        className="question-card__progress"
        aria-label={`Progres nivel: ${questionsAnswered} din ${levelConfig.questionsToPass}`}
      >
        <span className="question-card__progress-label">
          {questionsAnswered} / {levelConfig.questionsToPass}
        </span>
        <div
          className="question-card__progress-bar"
          role="progressbar"
          aria-valuenow={questionsAnswered}
          aria-valuemin={0}
          aria-valuemax={levelConfig.questionsToPass}
        >
          <div
            className="question-card__progress-fill"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>
    </article>
  )
}
