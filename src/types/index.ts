// User types
export interface User {
  id: string
  name: string
  avatar: string
  grade: string // "1年A組"
  totalPoints: number
  rank: number
  createdAt: Date
  todayPoints: number // 今日のポイント（不正防止用）
  todayPostCount: number // 今日の投稿数（不正防止用）
}

// Problem types
export type ProblemMode = 'speed' | 'challenge'
export type ProblemStatus = 'sampling' | 'open' | 'solved'
export type AnswerType = 'text' | 'number' | 'multiple'

export interface Problem {
  id: string
  authorId: string
  mode: ProblemMode
  title: string
  content: string // Markdown
  answer: string | number | string[]
  answerType: AnswerType
  images?: string[]
  status: ProblemStatus
  samplingUsers: string[] // ランダム抽出されたユーザーID
  samplingEndTime?: Date
  createdAt: Date
  solvedAt?: Date
  timeLimit?: number // 短期チャレンジの制限時間（秒）
  accumulatedPoints: number
  attemptCount: number
  solvedBy?: string // 解いたユーザーID
}

// Answer types
export interface Answer {
  id: string
  problemId: string
  userId: string
  answer: string | number | string[]
  isCorrect: boolean
  pointsEarned: number
  answeredAt: Date
  timeSpent: number // 秒
}

// Point History types
export interface PointHistory {
  id: string
  userId: string
  problemId: string
  points: number
  type: 'answer' | 'post' | 'sampling'
  createdAt: Date
}

// Theme types
export type Theme = 'light' | 'dark'

// Settings types
export interface Settings {
  theme: Theme
  notifications: {
    newProblem: boolean
    solved: boolean
    points: boolean
  }
}

// Statistics types
export interface UserStats {
  totalProblems: number
  solvedProblems: number
  successRate: number
  averageTime: number
  totalAnswers: number
}

// Ranking types
export interface RankingEntry {
  user: User
  points: number
  rank: number
  change: number // 順位変動
}

// Anti-fraud types
export interface FraudDetection {
  userId: string
  suspiciousPatterns: string[]
  detectedAt: Date
}

// Group detection for fraud prevention
export interface UserGroup {
  users: string[]
  interactionCount: number
  lastInteraction: Date
}
