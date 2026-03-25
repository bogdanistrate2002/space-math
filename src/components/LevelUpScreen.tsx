interface LevelUpScreenProps {
  level: number
  score: number
  onContinue: () => void
}

export function LevelUpScreen({ level, score, onContinue }: LevelUpScreenProps) {
  return (
    <main className="levelup-screen" aria-label="Nivel următor">
      <div className="levelup-screen__icon" aria-hidden="true">⭐</div>

      <h1 className="levelup-screen__title">Nivel {level} Complet!</h1>

      <p className="levelup-screen__subtitle">
        Pregătit pentru Nivelul {level + 1}?
      </p>

      <p className="levelup-screen__score">
        Scor curent: <span>{score}</span>
      </p>

      <button
        className="levelup-screen__btn"
        onClick={onContinue}
        aria-label={`Continuă la nivelul ${level + 1}`}
        autoFocus
      >
        Continuă 🚀
      </button>
    </main>
  )
}
