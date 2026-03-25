interface MenuScreenProps {
  onStart: () => void
}

export function MenuScreen({ onStart }: MenuScreenProps) {
  return (
    <main className="menu-screen" aria-label="Ecran principal">
      <div className="menu-screen__rocket" aria-hidden="true">🚀</div>

      <h1 className="menu-screen__title">Misiunea<br />Matematică</h1>

      <p className="menu-screen__subtitle">
        Răspunde corect la întrebări, câștigă puncte și cucerește spațiul!
      </p>

      <button
        className="menu-screen__btn"
        onClick={onStart}
        aria-label="Începe jocul"
        autoFocus
      >
        Lansare 🚀
      </button>
    </main>
  )
}
