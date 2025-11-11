import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Answer, Problem } from '@/types'
import { useProblemsStore } from './problems'
import { useUsersStore } from './users'

export const useAnswersStore = defineStore('answers', () => {
  const answers = ref<Map<string, Answer>>(new Map())

  // Get all answers
  const allAnswers = computed(() => {
    return Array.from(answers.value.values())
      .sort((a, b) => b.answeredAt.getTime() - a.answeredAt.getTime())
  })

  // Get answers for a problem
  const getAnswersForProblem = (problemId: string) => {
    return allAnswers.value.filter(a => a.problemId === problemId)
  }

  // Get answers by user
  const getAnswersByUser = (userId: string) => {
    return allAnswers.value.filter(a => a.userId === userId)
  }

  // Check if user has answered a problem
  const hasUserAnswered = (userId: string, problemId: string): boolean => {
    return allAnswers.value.some(a => a.userId === userId && a.problemId === problemId)
  }

  // Calculate points for an answer
  const calculatePoints = (problem: Problem, timeSpent: number, _isSamplingUser: boolean): number => {
    if (problem.mode === 'speed') {
      // Short-term challenge mode
      const basePoints = 100
      const timeRatio = problem.timeLimit ? Math.max(0.5, 1 - (timeSpent / problem.timeLimit)) : 1
      const solverPoints = Math.floor(basePoints * timeRatio * 1.5)
      return solverPoints
    } else {
      // Challenge mode
      const accumulated = problem.accumulatedPoints
      const solverPoints = Math.floor(accumulated * 0.7)
      return solverPoints
    }
  }

  // Submit an answer
  const submitAnswer = (
    problemId: string,
    userId: string,
    userAnswer: string | number | string[],
    timeSpent: number
  ): { isCorrect: boolean; pointsEarned: number } => {
    const problemsStore = useProblemsStore()
    const usersStore = useUsersStore()

    const problem = problemsStore.getProblemById(problemId)
    if (!problem) {
      throw new Error('Problem not found')
    }

    // Check if already answered
    if (hasUserAnswered(userId, problemId)) {
      throw new Error('Already answered this problem')
    }

    // Check if problem is solved
    if (problem.status === 'solved') {
      throw new Error('Problem already solved')
    }

    // Increment attempt count
    problemsStore.incrementAttemptCount(problemId)

    // Update accumulated points for challenge mode
    if (problem.mode === 'challenge') {
      problemsStore.updateAccumulatedPoints(problemId)
    }

    // Check answer correctness
    const isCorrect = checkAnswer(problem.answer, userAnswer, problem.answerType)

    // Detect suspicious patterns (answering too quickly)
    if (isCorrect && timeSpent < 5) {
      console.warn('Suspicious pattern detected: Too fast answer')
      // Could implement fraud detection here
    }

    let pointsEarned = 0

    if (isCorrect) {
      // Calculate and award points
      const isSamplingUser = problem.samplingUsers.includes(userId)
      pointsEarned = calculatePoints(problem, timeSpent, isSamplingUser)

      // Award points to solver
      usersStore.addPoints(userId, pointsEarned, problemId, 'answer')

      // Award points to author (bonus)
      const authorBonus = problem.mode === 'speed'
        ? Math.floor(100 * 0.3)
        : Math.floor(problem.accumulatedPoints * 0.2)
      usersStore.addPoints(problem.authorId, authorBonus, problemId, 'post')

      // Award bonus to sampling users (challenge mode only)
      if (problem.mode === 'challenge' && problem.samplingUsers.length > 0) {
        const samplingBonus = Math.floor(problem.accumulatedPoints * 0.1 / problem.samplingUsers.length)
        problem.samplingUsers.forEach(samplingUserId => {
          if (samplingUserId !== userId) {
            usersStore.addPoints(samplingUserId, samplingBonus, problemId, 'sampling')
          }
        })
      }

      // Mark problem as solved
      problemsStore.solveProblem(problemId, userId)
    }

    // Create answer record
    const answer: Answer = {
      id: `answer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      problemId,
      userId,
      answer: userAnswer,
      isCorrect,
      pointsEarned,
      answeredAt: new Date(),
      timeSpent
    }

    answers.value.set(answer.id, answer)
    saveToLocalStorage()

    return { isCorrect, pointsEarned }
  }

  // Check if answer is correct
  const checkAnswer = (
    correctAnswer: string | number | string[],
    userAnswer: string | number | string[],
    answerType: Problem['answerType']
  ): boolean => {
    switch (answerType) {
      case 'text':
        return String(correctAnswer).trim().toLowerCase() === String(userAnswer).trim().toLowerCase()

      case 'number':
        return Number(correctAnswer) === Number(userAnswer)

      case 'multiple':
        if (!Array.isArray(correctAnswer) || !Array.isArray(userAnswer)) return false
        if (correctAnswer.length !== userAnswer.length) return false
        const sortedCorrect = [...correctAnswer].sort()
        const sortedUser = [...userAnswer].sort()
        return sortedCorrect.every((val, idx) => val === sortedUser[idx])

      default:
        return false
    }
  }

  // Get user statistics
  const getUserStats = (userId: string) => {
    const userAnswers = getAnswersByUser(userId)
    const totalAnswers = userAnswers.length
    const correctAnswers = userAnswers.filter(a => a.isCorrect).length
    const totalPoints = userAnswers.reduce((sum, a) => sum + a.pointsEarned, 0)
    const avgTime = userAnswers.length > 0
      ? userAnswers.reduce((sum, a) => sum + a.timeSpent, 0) / userAnswers.length
      : 0

    return {
      totalAnswers,
      correctAnswers,
      successRate: totalAnswers > 0 ? (correctAnswers / totalAnswers) * 100 : 0,
      totalPoints,
      averageTime: avgTime
    }
  }

  // Save to localStorage
  const saveToLocalStorage = () => {
    const answersArray = Array.from(answers.value.values())
    localStorage.setItem('qsolve-answers', JSON.stringify(answersArray))
  }

  // Load from localStorage
  const loadFromLocalStorage = () => {
    const saved = localStorage.getItem('qsolve-answers')
    if (saved) {
      const answersArray: Answer[] = JSON.parse(saved)
      answers.value.clear()
      answersArray.forEach(answer => {
        // Convert date strings back to Date objects
        answer.answeredAt = new Date(answer.answeredAt)
        answers.value.set(answer.id, answer)
      })
    }
  }

  // Initialize
  loadFromLocalStorage()

  return {
    answers,
    allAnswers,
    getAnswersForProblem,
    getAnswersByUser,
    hasUserAnswered,
    submitAnswer,
    getUserStats,
    loadFromLocalStorage
  }
})
