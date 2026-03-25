import { useMemo } from 'react'

interface Star {
  id: number
  left: string
  width: string
  duration: string
  delay: string
}

export function StarField() {
  const stars = useMemo<Star[]>(() => {
    return Array.from({ length: 80 }, (_, i) => ({
      id: i,
      left: `${(i * 1.25 + 0.5) % 100}%`,
      width: `${1 + (i % 3)}px`,
      duration: `${6 + (i % 10)}s`,
      delay: `${(i * 0.37) % 8}s`,
    }))
  }, [])

  return (
    <div className="starfield" aria-hidden="true">
      {stars.map((star) => (
        <div
          key={star.id}
          className="starfield__star"
          style={{
            left: star.left,
            width: star.width,
            height: star.width,
            animationDuration: star.duration,
            animationDelay: star.delay,
          }}
        />
      ))}
    </div>
  )
}
