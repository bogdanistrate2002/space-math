import { useState, useCallback } from 'react'
import { Operation } from '@/types/game'

interface OpDef {
  op: Operation
  emoji: string
  name: string
}

const OP_DEFS: OpDef[] = [
  { op: Operation.Addition,       emoji: '➕', name: 'Adunare' },
  { op: Operation.Subtraction,    emoji: '➖', name: 'Scădere' },
  { op: Operation.Multiplication, emoji: '✖️', name: 'Înmulțire' },
  { op: Operation.Division,       emoji: '➗', name: 'Împărțire' },
]

interface MenuScreenProps {
  onStart: (operations: Operation[]) => void
}

export function MenuScreen({ onStart }: MenuScreenProps) {
  const [selected, setSelected] = useState<Set<Operation>>(
    () => new Set([Operation.Addition, Operation.Subtraction])
  )

  const toggle = useCallback((op: Operation) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(op)) {
        if (next.size > 1) next.delete(op) // at least one must remain selected
      } else {
        next.add(op)
      }
      return next
    })
  }, [])

  const handleStart = useCallback(() => {
    onStart(Array.from(selected))
  }, [selected, onStart])

  return (
    <main className="menu-screen" aria-label="Ecran principal">
      <div className="menu-screen__rocket" aria-hidden="true">🚀</div>

      <h1 className="menu-screen__title">
        Misiunea<br />Matematică
      </h1>

      <p className="menu-screen__subtitle">
        Răspunde corect, câștigă puncte și cucerește spațiul!
      </p>

      <div
        className="menu-screen__ops"
        role="group"
        aria-label="Selectează operații matematice"
      >
        <p className="menu-screen__ops-label">Alege operațiile</p>
        <div className="menu-screen__ops-grid">
          {OP_DEFS.map(({ op, emoji, name }) => (
            <button
              key={op}
              className={`menu-screen__op-btn${selected.has(op) ? ' menu-screen__op-btn--active' : ''}`}
              onClick={() => toggle(op)}
              aria-pressed={selected.has(op)}
              aria-label={`${name}: ${selected.has(op) ? 'selectat' : 'neselectat'}`}
            >
              <span className="menu-screen__op-emoji" aria-hidden="true">
                {emoji}
              </span>
              <span className="menu-screen__op-name">{name}</span>
            </button>
          ))}
        </div>
      </div>

      <button
        className="menu-screen__btn"
        onClick={handleStart}
        aria-label="Începe jocul"
        autoFocus
      >
        Lansare 🚀
      </button>
    </main>
  )
}
