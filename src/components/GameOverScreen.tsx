interface GameOverScreenProps {
  score: number
  level: number
  onRestart: () => void
}

export function GameOverScreen({ score, level, onRestart }: GameOverScreenProps) {
  return (
    <main className="gameover-screen" aria-label="Joc terminat">
      <div className="gameover-screen__icon" aria-hidden="true">💫</div>

      <h1 className="gameover-screen__title">Misiune Încheiată!</h1>

      <p className="gameover-screen__score">
        Scor final: <span>{score}</span>
      </p>

      <p className="gameover-screen__level">
        Ai ajuns la <span>nivelul {level}</span>
      </p>

      <button
        className="gameover-screen__btn"
        onClick={onRestart}
        aria-label="Joacă din nou"
        autoFocus
      >
        Joacă din nou 🚀
      </button>
    </main>
  )
}
