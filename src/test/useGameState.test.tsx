import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useGameState } from '@/hooks/useGameState'
import { Screen, Operation } from '@/types/game'

const START = {
  type: 'START_GAME' as const,
  payload: { operations: [Operation.Addition, Operation.Subtraction] },
}

describe('useGameState', () => {
  it('starts on the Menu screen', () => {
    const { result } = renderHook(() => useGameState())
    expect(result.current.state.screen).toBe(Screen.Menu)
    expect(result.current.state.currentQuestion).toBeNull()
  })

  it('START_GAME transitions to Playing and generates a question', () => {
    const { result } = renderHook(() => useGameState())
    act(() => {
      result.current.dispatch(START)
    })
    expect(result.current.state.screen).toBe(Screen.Playing)
    expect(result.current.state.currentQuestion).not.toBeNull()
    expect(result.current.state.level).toBe(1)
    expect(result.current.state.lives).toBe(3)
    expect(result.current.state.score).toBe(0)
    expect(result.current.state.selectedOperations).toEqual(START.payload.operations)
  })

  it('RESTART returns to Menu', () => {
    const { result } = renderHook(() => useGameState())
    act(() => result.current.dispatch(START))
    act(() => result.current.dispatch({ type: 'RESTART' }))
    expect(result.current.state.screen).toBe(Screen.Menu)
  })

  it('correct answer increases score and streak', () => {
    const { result } = renderHook(() => useGameState())
    act(() => result.current.dispatch(START))

    const correct = result.current.state.currentQuestion!.correctAnswer
    act(() => result.current.dispatch({ type: 'ANSWER', payload: correct }))

    expect(result.current.state.score).toBeGreaterThan(0)
    expect(result.current.state.streak).toBe(1)
  })

  it('wrong answer decreases lives and resets streak', () => {
    const { result } = renderHook(() => useGameState())
    act(() => result.current.dispatch(START))

    const wrong = result.current.state.currentQuestion!.correctAnswer + 999
    act(() => result.current.dispatch({ type: 'ANSWER', payload: wrong }))

    expect(result.current.state.lives).toBe(2)
    expect(result.current.state.streak).toBe(0)
    expect(result.current.state.isRetry).toBe(true)
    expect(result.current.state.lastAnswerCorrect).toBe(false)
  })

  it('losing all 3 lives triggers Game Over', () => {
    const { result } = renderHook(() => useGameState())
    act(() => result.current.dispatch(START))

    for (let i = 0; i < 3; i++) {
      const wrong = result.current.state.currentQuestion!.correctAnswer + 999
      act(() => result.current.dispatch({ type: 'ANSWER', payload: wrong }))
    }

    expect(result.current.state.screen).toBe(Screen.GameOver)
    expect(result.current.state.lives).toBe(0)
  })

  it('answering wrong does not change question (retry mode)', () => {
    const { result } = renderHook(() => useGameState())
    act(() => result.current.dispatch(START))

    const questionBefore = result.current.state.currentQuestion
    const wrong = questionBefore!.correctAnswer + 999
    act(() => result.current.dispatch({ type: 'ANSWER', payload: wrong }))

    expect(result.current.state.currentQuestion).toEqual(questionBefore)
  })

  it('CONFIRM_LEVEL_UP advances level', () => {
    const { result } = renderHook(() => useGameState())
    act(() => result.current.dispatch(START))

    const questionsNeeded = 5 // level 1 requires 5
    for (let i = 0; i < questionsNeeded; i++) {
      const correct = result.current.state.currentQuestion!.correctAnswer
      act(() => result.current.dispatch({ type: 'ANSWER', payload: correct }))
      if (result.current.state.screen === Screen.LevelUp) break
    }

    expect(result.current.state.screen).toBe(Screen.LevelUp)

    act(() => result.current.dispatch({ type: 'CONFIRM_LEVEL_UP' }))
    expect(result.current.state.level).toBe(2)
    expect(result.current.state.screen).toBe(Screen.Playing)
    expect(result.current.state.questionsAnsweredInLevel).toBe(0)
  })

  it('streak bonus accumulates over consecutive correct answers', () => {
    const { result } = renderHook(() => useGameState())
    act(() => result.current.dispatch(START))

    for (let i = 0; i < 3; i++) {
      if (result.current.state.screen !== Screen.Playing) break
      const correct = result.current.state.currentQuestion!.correctAnswer
      act(() => result.current.dispatch({ type: 'ANSWER', payload: correct }))
    }

    // score = 10 + 15 + 20 = 45 (streak 1, 2, 3)
    expect(result.current.state.score).toBe(45)
    expect(result.current.state.streak).toBe(3)
  })
})
