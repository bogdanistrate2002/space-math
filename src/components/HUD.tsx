interface HUDProps {
  score: number
  lives: number
  level: number
  streak: number
}

const MAX_LIVES = 3

export function HUD({ score, lives, level, streak }: HUDProps) {
  return (
    <header className="hud" aria-label="Panou de joc">
      <div className="hud__item">
        <span className="hud__label">Nivel</span>
        <span className="hud__value hud__value--level" aria-live="polite">
          {level}
        </span>
      </div>

      <div className="hud__item">
        <span className="hud__label">Scor</span>
        <span className="hud__value hud__value--score" aria-live="polite" aria-atomic="true">
          {score}
        </span>
      </div>

      <div className="hud__item" aria-label={`Vieți rămase: ${lives}`}>
        <span className="hud__label">Vieți</span>
        <div className="hud__lives" role="img" aria-label={`${lives} din ${MAX_LIVES} vieți`}>
          {Array.from({ length: MAX_LIVES }, (_, i) => (
            <span
              key={i}
              className={`hud__heart${i >= lives ? ' hud__heart--lost' : ''}`}
              aria-hidden="true"
            >
              ❤️
            </span>
          ))}
        </div>
      </div>

      {streak >= 2 && (
        <div className="hud__item" aria-live="polite">
          <span className="hud__streak" aria-label={`Serie de ${streak} răspunsuri corecte`}>
            🔥 ×{streak}
          </span>
        </div>
      )}
    </header>
  )
}
