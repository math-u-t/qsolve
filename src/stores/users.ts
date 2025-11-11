import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, PointHistory } from '@/types'

export const useUsersStore = defineStore('users', () => {
  const users = ref<Map<string, User>>(new Map())
  const currentUserId = ref<string>('user-1') // Mock current user
  const pointHistory = ref<PointHistory[]>([])

  // Current user getter
  const currentUser = computed(() => users.value.get(currentUserId.value))

  // Get user by id
  const getUserById = (id: string): User | undefined => {
    return users.value.get(id)
  }

  // Get all users sorted by points
  const getUsersByRank = computed(() => {
    return Array.from(users.value.values())
      .sort((a, b) => b.totalPoints - a.totalPoints)
      .map((user, index) => ({
        ...user,
        rank: index + 1
      }))
  })

  // Add or update user
  const setUser = (user: User) => {
    users.value.set(user.id, user)
    saveToLocalStorage()
  }

  // Add points to user
  const addPoints = (userId: string, points: number, problemId: string, type: 'answer' | 'post' | 'sampling') => {
    const user = users.value.get(userId)
    if (!user) return

    // Check daily limit (1000 points per day)
    if (user.todayPoints + points > 1000) {
      console.warn('Daily point limit reached')
      return false
    }

    user.totalPoints += points
    user.todayPoints += points

    // Add to point history
    pointHistory.value.push({
      id: `ph-${Date.now()}-${Math.random()}`,
      userId,
      problemId,
      points,
      type,
      createdAt: new Date()
    })

    setUser(user)
    return true
  }

  // Check if user can post today
  const canPostToday = (userId: string): boolean => {
    const user = users.value.get(userId)
    if (!user) return false
    return user.todayPostCount < 5
  }

  // Increment post count
  const incrementPostCount = (userId: string) => {
    const user = users.value.get(userId)
    if (!user) return
    user.todayPostCount++
    setUser(user)
  }

  // Reset daily counters (should be called daily)
  const resetDailyCounters = () => {
    users.value.forEach(user => {
      user.todayPoints = 0
      user.todayPostCount = 0
      setUser(user)
    })
  }

  // Get point history for user
  const getUserPointHistory = (userId: string) => {
    return pointHistory.value
      .filter(h => h.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  // Save to localStorage
  const saveToLocalStorage = () => {
    const usersArray = Array.from(users.value.values())
    localStorage.setItem('qsolve-users', JSON.stringify(usersArray))
    localStorage.setItem('qsolve-point-history', JSON.stringify(pointHistory.value))
  }

  // Load from localStorage
  const loadFromLocalStorage = () => {
    const savedUsers = localStorage.getItem('qsolve-users')
    if (savedUsers) {
      const usersArray: User[] = JSON.parse(savedUsers)
      users.value.clear()
      usersArray.forEach(user => {
        // Convert date strings back to Date objects
        user.createdAt = new Date(user.createdAt)
        users.value.set(user.id, user)
      })
    }

    const savedHistory = localStorage.getItem('qsolve-point-history')
    if (savedHistory) {
      pointHistory.value = JSON.parse(savedHistory).map((h: PointHistory) => ({
        ...h,
        createdAt: new Date(h.createdAt)
      }))
    }
  }

  // Initialize
  loadFromLocalStorage()

  return {
    users,
    currentUserId,
    currentUser,
    pointHistory,
    getUserById,
    getUsersByRank,
    setUser,
    addPoints,
    canPostToday,
    incrementPostCount,
    resetDailyCounters,
    getUserPointHistory,
    loadFromLocalStorage
  }
})
