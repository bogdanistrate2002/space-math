import { LevelConfig, Operation, Question } from '@/types/game'

// ─── Level definitions ────────────────────────────────────────────────────────

export const LEVEL_CONFIGS: LevelConfig[] = [
  {
    level: 1,
    minNumber: 1,
    maxNumber: 20,
    questionsToPass: 5,
    operations: [Operation.Addition, Operation.Subtraction],
  },
  {
    level: 2,
    minNumber: 1,
    maxNumber: 20,
    questionsToPass: 5,
    operations: [Operation.Addition, Operation.Subtraction, Operation.Multiplication],
  },
  {
    level: 3,
    minNumber: 20,
    maxNumber: 40,
    questionsToPass: 7,
    operations: [Operation.Addition, Operation.Subtraction, Operation.Multiplication],
  },
  {
    level: 4,
    minNumber: 20,
    maxNumber: 40,
    questionsToPass: 7,
    operations: [
      Operation.Addition,
      Operation.Subtraction,
      Operation.Multiplication,
      Operation.Division,
    ],
  },
  {
    level: 5,
    minNumber: 40,
    maxNumber: 100,
    questionsToPass: 10,
    operations: [
      Operation.Addition,
      Operation.Subtraction,
      Operation.Multiplication,
      Operation.Division,
    ],
  },
  {
    level: 6,
    minNumber: 40,
    maxNumber: 100,
    questionsToPass: 10,
    operations: [
      Operation.Addition,
      Operation.Subtraction,
      Operation.Multiplication,
      Operation.Division,
    ],
  },
  {
    level: 7,
    minNumber: 40,
    maxNumber: 100,
    questionsToPass: 15,
    operations: [
      Operation.Addition,
      Operation.Subtraction,
      Operation.Multiplication,
      Operation.Division,
    ],
  },
]

export const MAX_LEVEL = LEVEL_CONFIGS.length

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Inclusive random integer in [min, max] */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function getLevelConfig(level: number): LevelConfig {
  const config = LEVEL_CONFIGS.find((c) => c.level === level)
  if (!config) return LEVEL_CONFIGS[LEVEL_CONFIGS.length - 1]
  return config
}

// ─── Question generation ──────────────────────────────────────────────────────

export function generateQuestion(level: number): Question {
  const config = getLevelConfig(level)
  const operation = config.operations[randomInt(0, config.operations.length - 1)]

  let a: number
  let b: number
  let answer: number

  switch (operation) {
    case Operation.Addition: {
      a = randomInt(config.minNumber, config.maxNumber)
      b = randomInt(config.minNumber, config.maxNumber)
      answer = a + b
      break
    }
    case Operation.Subtraction: {
      a = randomInt(config.minNumber + 1, config.maxNumber) // a > minNumber so b < a is possible
      b = randomInt(config.minNumber, a - 1) // b < a so result ≥ 1
      answer = a - b
      break
    }
    case Operation.Multiplication: {
      // Keep multiplication manageable: use smaller factors
      a = randomInt(2, Math.min(12, config.maxNumber))
      b = randomInt(2, Math.min(12, config.maxNumber))
      answer = a * b
      break
    }
    case Operation.Division: {
      // Generate a valid division: pick b then a multiple of b
      b = randomInt(2, Math.min(12, config.maxNumber))
      const quotient = randomInt(2, Math.min(12, config.maxNumber))
      a = b * quotient
      answer = quotient
      break
    }
    default: {
      a = 1
      b = 1
      answer = 2
    }
  }

  const choices = generateChoices(answer)

  return { operandA: a, operandB: b, operation, correctAnswer: answer, choices }
}

// ─── Choices generation ───────────────────────────────────────────────────────

export function generateChoices(correctAnswer: number): number[] {
  const offsets = [1, 2, 5, 3, 4, 7, 10]
  const distractors = new Set<number>()

  for (const offset of offsets) {
    if (distractors.size >= 3) break
    const candidates = [correctAnswer + offset, correctAnswer - offset]
    for (const c of candidates) {
      if (distractors.size >= 3) break
      if (c > 0 && c !== correctAnswer) {
        distractors.add(c)
      }
    }
  }

  // Fallback: add larger offsets if needed
  let fallback = correctAnswer + 6
  while (distractors.size < 3) {
    if (fallback !== correctAnswer && fallback > 0) distractors.add(fallback)
    fallback++
  }

  const choices = [correctAnswer, ...Array.from(distractors).slice(0, 3)]
  return shuffleArray(choices)
}

export function shuffleArray<T>(arr: T[]): T[] {
  const result = [...arr]
  for (let i = result.length - 1; i > 0; i--) {
    const j = randomInt(0, i)
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

// ─── Scoring ──────────────────────────────────────────────────────────────────

/** streak is the count of consecutive correct answers (including this one) */
export function calculatePoints(streak: number): number {
  const base = 10
  const bonus = Math.max(0, streak - 1) * 5
  return base + bonus
}

// ─── Operator symbol helper ───────────────────────────────────────────────────

export function operationSymbol(op: Operation): string {
  switch (op) {
    case Operation.Addition:
      return '+'
    case Operation.Subtraction:
      return '−'
    case Operation.Multiplication:
      return '×'
    case Operation.Division:
      return '÷'
  }
}
