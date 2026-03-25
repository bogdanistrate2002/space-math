interface GameOverScreenProps {
  score: number
  level: number
  onRestart: () => void
}

interface Rank {
  title: string
  emoji: string
}

function getRank(score: number): Rank {
  if (score >= 500) return { title: 'Amiralul Galaxiei', emoji: '👑' }
  if (score >= 300) return { title: 'Comandant Spațial', emoji: '🏆' }
  if (score >= 150) return { title: 'Pilot Spațial', emoji: '🚀' }
  if (score >= 50)  return { title: 'Cadet Spațial', emoji: '⭐' }
  return { title: 'Recruit Spațial', emoji: '🌟' }
}

export function GameOverScreen({ score, level, onRestart }: GameOverScreenProps) {
  const rank = getRank(score)

  return (
    <main className="gameover-screen" aria-label="Joc terminat">
      <div className="gameover-screen__icon" aria-hidden="true">💫</div>

      <h1 className="gameover-screen__title">Misiune Încheiată!</h1>

      <div className="gameover-screen__rank" aria-label={`Rang obținut: ${rank.title}`}>
        <span className="gameover-screen__rank-emoji" aria-hidden="true">
          {rank.emoji}
        </span>
        <span className="gameover-screen__rank-title">{rank.title}</span>
      </div>

      <div className="gameover-screen__stats" aria-label="Statistici finale">
        <div className="gameover-screen__stat">
          <span className="gameover-screen__stat-label">Scor final</span>
          <span className="gameover-screen__stat-value gameover-screen__stat-value--gold">
            {score}
          </span>
        </div>
        <div className="gameover-screen__stat">
          <span className="gameover-screen__stat-label">Nivel atins</span>
          <span className="gameover-screen__stat-value gameover-screen__stat-value--cyan">
            {level}
          </span>
        </div>
      </div>

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
