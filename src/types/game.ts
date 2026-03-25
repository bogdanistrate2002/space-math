// ─── Enums ───────────────────────────────────────────────────────────────────

export enum Operation {
  Addition = 'addition',
  Subtraction = 'subtraction',
  Multiplication = 'multiplication',
  Division = 'division',
}

export enum Screen {
  Menu = 'menu',
  Playing = 'playing',
  LevelUp = 'levelup',
  GameOver = 'gameover',
}

// ─── Level configuration ─────────────────────────────────────────────────────

export interface LevelConfig {
  level: number
  minNumber: number
  maxNumber: number
  questionsToPass: number
  operations: Operation[]
}

// ─── Question ─────────────────────────────────────────────────────────────────

export interface Question {
  operandA: number
  operandB: number
  operation: Operation
  correctAnswer: number
  choices: number[]
}

// ─── Game state ───────────────────────────────────────────────────────────────

export interface GameState {
  screen: Screen
  level: number
  score: number
  lives: number
  streak: number
  questionsAnsweredInLevel: number
  currentQuestion: Question | null
  /** true when the player got the current question wrong once and must retry */
  isRetry: boolean
  lastAnswerCorrect: boolean | null
  /** operations the player selected in the menu */
  selectedOperations: Operation[]
}

// ─── Reducer actions ──────────────────────────────────────────────────────────

export type GameAction =
  | { type: 'START_GAME'; payload: { operations: Operation[] } }
  | { type: 'ANSWER'; payload: number }
  | { type: 'NEXT_QUESTION' }
  | { type: 'CONFIRM_LEVEL_UP' }
  | { type: 'RESTART' }
