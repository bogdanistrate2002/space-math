import { Question } from '@/types/game'
import { operationSymbol } from '@/utils/gameLogic'
import { LevelConfig } from '@/types/game'

interface QuestionCardProps {
  question: Question
  onAnswer: (choice: number) => void
  disabled: boolean
  lastAnswerCorrect: boolean | null
  questionsAnswered: number
  levelConfig: LevelConfig
}

export function QuestionCard({
  question,
  onAnswer,
  disabled,
  lastAnswerCorrect,
  questionsAnswered,
  levelConfig,
}: QuestionCardProps) {
  const { operandA, operandB, operation, correctAnswer, choices } = question
  const symbol = operationSymbol(operation)
  const progress = Math.min(questionsAnswered / levelConfig.questionsToPass, 1)

  function choiceClass(choice: number): string {
    let cls = 'question-card__choice'
    if (disabled && lastAnswerCorrect !== null) {
      if (choice === correctAnswer) cls += ' question-card__choice--correct'
      else if (lastAnswerCorrect === false && choice !== correctAnswer) {
        // only highlight wrong if it was selected — we don't track which was clicked,
        // so we highlight the correct one green and leave others neutral
      }
    }
    return cls
  }

  return (
    <article className="question-card" aria-label="Întrebare de matematică">
      <p className="question-card__prompt" aria-live="polite">
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
            onClick={() => onAnswer(choice)}
            disabled={disabled}
            aria-label={`Răspuns: ${choice}`}
          >
            {choice}
          </button>
        ))}
      </div>

      <div className="question-card__progress" aria-label="Progres nivel">
        <span className="question-card__progress-label">
          {questionsAnswered} / {levelConfig.questionsToPass}
        </span>
        <div className="question-card__progress-bar" role="progressbar"
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
