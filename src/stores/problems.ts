import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Problem, ProblemMode } from '@/types'
import { useUsersStore } from './users'

export const useProblemsStore = defineStore('problems', () => {
  const problems = ref<Map<string, Problem>>(new Map())

  // Get problem by id
  const getProblemById = (id: string): Problem | undefined => {
    return problems.value.get(id)
  }

  // Get all problems
  const allProblems = computed(() => {
    return Array.from(problems.value.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  })

  // Get problems by status
  const getProblemsByStatus = (status: Problem['status']) => {
    return allProblems.value.filter(p => p.status === status)
  }

  // Get problems by mode
  const getProblemsByMode = (mode: ProblemMode) => {
    return allProblems.value.filter(p => p.mode === mode)
  }

  // Get problems by author
  const getProblemsByAuthor = (authorId: string) => {
    return allProblems.value.filter(p => p.authorId === authorId)
  }

  // Get problems available for user (considering sampling)
  const getAvailableProblems = (userId: string) => {
    return allProblems.value.filter(problem => {
      // Don't show own problems
      if (problem.authorId === userId) return false

      // If sampling, only show to sampling users
      if (problem.status === 'sampling') {
        return problem.samplingUsers.includes(userId)
      }

      // Show open and solved problems
      return problem.status === 'open' || problem.status === 'solved'
    })
  }

  // Create new problem
  const createProblem = (problemData: Omit<Problem, 'id' | 'createdAt' | 'status' | 'accumulatedPoints' | 'attemptCount'>): string => {
    const usersStore = useUsersStore()

    // Check if user can post today
    if (!usersStore.canPostToday(problemData.authorId)) {
      throw new Error('Daily post limit reached (5 posts per day)')
    }

    const id = `problem-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    const problem: Problem = {
      ...problemData,
      id,
      createdAt: new Date(),
      status: 'sampling', // Start in sampling mode
      accumulatedPoints: problemData.mode === 'speed' ? 100 : 50,
      attemptCount: 0
    }

    // Select random sampling users (3-5 users)
    const samplingCount = Math.floor(Math.random() * 3) + 3 // 3-5
    problem.samplingUsers = selectRandomSamplingUsers(problemData.authorId, samplingCount)

    // Set sampling end time (e.g., 1 hour from now)
    problem.samplingEndTime = new Date(Date.now() + 60 * 60 * 1000)

    problems.value.set(id, problem)
    usersStore.incrementPostCount(problemData.authorId)

    saveToLocalStorage()
    return id
  }

  // Select random sampling users (excluding author and their group)
  const selectRandomSamplingUsers = (authorId: string, count: number): string[] => {
    const usersStore = useUsersStore()
    const allUserIds = Array.from(usersStore.users.values())
      .map(u => u.id)
      .filter(id => id !== authorId) // Exclude author

    // Shuffle and take first 'count' users
    const shuffled = allUserIds.sort(() => Math.random() - 0.5)
    return shuffled.slice(0, Math.min(count, shuffled.length))
  }

  // Update problem status
  const updateProblemStatus = (problemId: string, status: Problem['status']) => {
    const problem = problems.value.get(problemId)
    if (!problem) return

    problem.status = status
    saveToLocalStorage()
  }

  // Mark problem as solved
  const solveProblem = (problemId: string, userId: string) => {
    const problem = problems.value.get(problemId)
    if (!problem) return

    problem.status = 'solved'
    problem.solvedAt = new Date()
    problem.solvedBy = userId

    saveToLocalStorage()
  }

  // Increment attempt count
  const incrementAttemptCount = (problemId: string) => {
    const problem = problems.value.get(problemId)
    if (!problem) return

    problem.attemptCount++
    saveToLocalStorage()
  }

  // Update accumulated points for challenge mode
  const updateAccumulatedPoints = (problemId: string) => {
    const problem = problems.value.get(problemId)
    if (!problem || problem.mode !== 'challenge') return

    const hoursSinceCreation = (Date.now() - problem.createdAt.getTime()) / (1000 * 60 * 60)
    const accumulated = 50 + (hoursSinceCreation * 10) + (problem.attemptCount * 5)
    problem.accumulatedPoints = Math.min(accumulated, 500) // Max 500

    saveToLocalStorage()
  }

  // Check if sampling period ended and update status
  const checkSamplingPeriods = () => {
    const now = new Date()
    problems.value.forEach(problem => {
      if (problem.status === 'sampling' && problem.samplingEndTime && problem.samplingEndTime < now) {
        problem.status = 'open'
        saveToLocalStorage()
      }
    })
  }

  // Check if speed challenge time limit exceeded
  const checkTimeLimit = (problemId: string): boolean => {
    const problem = problems.value.get(problemId)
    if (!problem || problem.mode !== 'speed' || !problem.timeLimit) return false

    const elapsed = (Date.now() - problem.createdAt.getTime()) / 1000
    if (elapsed > problem.timeLimit && problem.status !== 'solved') {
      // Time's up, give points to author
      const usersStore = useUsersStore()
      usersStore.addPoints(problem.authorId, 50, problem.id, 'post')
      return true
    }
    return false
  }

  // Save to localStorage
  const saveToLocalStorage = () => {
    const problemsArray = Array.from(problems.value.values())
    localStorage.setItem('qsolve-problems', JSON.stringify(problemsArray))
  }

  // Load from localStorage
  const loadFromLocalStorage = () => {
    const saved = localStorage.getItem('qsolve-problems')
    if (saved) {
      const problemsArray: Problem[] = JSON.parse(saved)
      problems.value.clear()
      problemsArray.forEach(problem => {
        // Convert date strings back to Date objects
        problem.createdAt = new Date(problem.createdAt)
        if (problem.solvedAt) problem.solvedAt = new Date(problem.solvedAt)
        if (problem.samplingEndTime) problem.samplingEndTime = new Date(problem.samplingEndTime)
        problems.value.set(problem.id, problem)
      })
    }
  }

  // Initialize
  loadFromLocalStorage()

  // Check sampling periods periodically
  setInterval(checkSamplingPeriods, 60000) // Check every minute

  return {
    problems,
    allProblems,
    getProblemById,
    getProblemsByStatus,
    getProblemsByMode,
    getProblemsByAuthor,
    getAvailableProblems,
    createProblem,
    updateProblemStatus,
    solveProblem,
    incrementAttemptCount,
    updateAccumulatedPoints,
    checkTimeLimit,
    loadFromLocalStorage
  }
})
