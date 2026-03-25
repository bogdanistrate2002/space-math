import { describe, it, expect, vi } from 'vitest'
import {
  generateQuestion,
  generateChoices,
  calculatePoints,
  getLevelConfig,
  operationSymbol,
  shuffleArray,
  LEVEL_CONFIGS,
  MAX_LEVEL,
} from '@/utils/gameLogic'
import { Operation } from '@/types/game'

describe('LEVEL_CONFIGS', () => {
  it('has 7 levels', () => {
    expect(LEVEL_CONFIGS).toHaveLength(7)
    expect(MAX_LEVEL).toBe(7)
  })

  it('each level has required fields', () => {
    for (const cfg of LEVEL_CONFIGS) {
      expect(cfg.level).toBeGreaterThan(0)
      expect(cfg.minNumber).toBeGreaterThan(0)
      expect(cfg.maxNumber).toBeGreaterThan(cfg.minNumber)
      expect(cfg.questionsToPass).toBeGreaterThan(0)
      expect(cfg.operations.length).toBeGreaterThan(0)
    }
  })
})

describe('getLevelConfig', () => {
  it('returns correct config for existing level', () => {
    const cfg = getLevelConfig(1)
    expect(cfg.level).toBe(1)
    expect(cfg.maxNumber).toBe(20)
  })

  it('returns last config for out-of-range level', () => {
    const cfg = getLevelConfig(999)
    expect(cfg.level).toBe(7)
  })
})

describe('generateChoices', () => {
  it('returns exactly 4 choices', () => {
    expect(generateChoices(10)).toHaveLength(4)
  })

  it('always includes the correct answer', () => {
    for (let correct = 1; correct <= 50; correct++) {
      const choices = generateChoices(correct)
      expect(choices).toContain(correct)
    }
  })

  it('has no duplicates', () => {
    for (let correct = 1; correct <= 50; correct++) {
      const choices = generateChoices(correct)
      expect(new Set(choices).size).toBe(4)
    }
  })

  it('all choices are positive', () => {
    for (let correct = 1; correct <= 20; correct++) {
      const choices = generateChoices(correct)
      for (const c of choices) {
        expect(c).toBeGreaterThan(0)
      }
    }
  })
})

describe('generateQuestion', () => {
  it('generates a valid question for each level', () => {
    for (let level = 1; level <= 7; level++) {
      const q = generateQuestion(level)
      expect(q.choices).toHaveLength(4)
      expect(q.choices).toContain(q.correctAnswer)
      expect(q.correctAnswer).toBeGreaterThan(0)
    }
  })

  it('subtraction result is always >= 0', () => {
    // Force subtraction by mocking Math.random
    vi.spyOn(Math, 'random').mockReturnValue(0) // picks first operation index
    // Level 1 only has addition + subtraction; index 0 = addition, 1 = subtraction
    // We'll just generate many questions and filter
    vi.restoreAllMocks()

    for (let i = 0; i < 200; i++) {
      const q = generateQuestion(1)
      if (q.operation === Operation.Subtraction) {
        expect(q.correctAnswer).toBeGreaterThanOrEqual(0)
      }
    }
  })

  it('division produces whole-number answers', () => {
    for (let i = 0; i < 200; i++) {
      const q = generateQuestion(4)
      if (q.operation === Operation.Division) {
        expect(Number.isInteger(q.correctAnswer)).toBe(true)
        expect(q.operandA % q.operandB).toBe(0)
      }
    }
  })

  it('question uses only operations allowed for the level', () => {
    const cfg1 = getLevelConfig(1)
    for (let i = 0; i < 100; i++) {
      const q = generateQuestion(1)
      expect(cfg1.operations).toContain(q.operation)
    }
  })
})

describe('calculatePoints', () => {
  it('base score is 10 for streak 1', () => {
    expect(calculatePoints(1)).toBe(10)
  })

  it('streak 2 gives 15', () => {
    expect(calculatePoints(2)).toBe(15)
  })

  it('streak 3 gives 20', () => {
    expect(calculatePoints(3)).toBe(20)
  })

  it('streak 5 gives 30', () => {
    expect(calculatePoints(5)).toBe(30)
  })

  it('streak 0 gives 10 (no negative bonus)', () => {
    expect(calculatePoints(0)).toBe(10)
  })
})

describe('operationSymbol', () => {
  it('returns correct symbols', () => {
    expect(operationSymbol(Operation.Addition)).toBe('+')
    expect(operationSymbol(Operation.Subtraction)).toBe('−')
    expect(operationSymbol(Operation.Multiplication)).toBe('×')
    expect(operationSymbol(Operation.Division)).toBe('÷')
  })
})

describe('shuffleArray', () => {
  it('returns an array of the same length', () => {
    expect(shuffleArray([1, 2, 3, 4])).toHaveLength(4)
  })

  it('contains all original elements', () => {
    const original = [1, 2, 3, 4]
    const shuffled = shuffleArray(original)
    expect(shuffled.sort()).toEqual(original.sort())
  })

  it('does not mutate the original', () => {
    const original = [1, 2, 3, 4]
    shuffleArray(original)
    expect(original).toEqual([1, 2, 3, 4])
  })
})
