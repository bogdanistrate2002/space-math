import { useMemo } from 'react'

interface Star {
  id: number
  top: string
  left: string
  size: number
  duration: string
  delay: string
}

export function StarField() {
  const stars = useMemo<Star[]>(
    () =>
      Array.from({ length: 80 }, (_, i) => ({
        id: i,
        // Deterministic positions using coprime multipliers for good distribution
        top: `${(i * 43 + 11) % 100}%`,
        left: `${(i * 127 + 7) % 100}%`,
        size: 1 + (i % 3),
        duration: `${2.5 + (i % 4)}s`,
        delay: `-${(i * 0.47) % 6}s`, // negative = already mid-cycle at load
      })),
    []
  )

  return (
    <div className="starfield" aria-hidden="true">
      {stars.map((star) => (
        <div
          key={star.id}
          className="starfield__star"
          style={{
            top: star.top,
            left: star.left,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDuration: star.duration,
            animationDelay: star.delay,
          }}
        />
      ))}
    </div>
  )
}
