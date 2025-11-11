<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { Problem } from '@/types'
import { useUsersStore } from '@/stores/users'

const props = defineProps<{
  problem: Problem
}>()

const router = useRouter()
const usersStore = useUsersStore()

const author = computed(() => usersStore.getUserById(props.problem.authorId))

const modeIcon = computed(() => {
  return props.problem.mode === 'speed' ? 'timer' : 'emoji_events'
})

const modeLabel = computed(() => {
  return props.problem.mode === 'speed' ? '短期チャレンジ' : '挑戦型'
})

const statusBadge = computed(() => {
  switch (props.problem.status) {
    case 'sampling':
      return { text: 'サンプリング中', class: 'badge-warning' }
    case 'open':
      return { text: '公開中', class: 'badge-primary' }
    case 'solved':
      return { text: '解決済み', class: 'badge-success' }
    default:
      return { text: '', class: '' }
  }
})

const timeRemaining = computed(() => {
  if (props.problem.mode === 'speed' && props.problem.timeLimit && props.problem.status !== 'solved') {
    const elapsed = (Date.now() - props.problem.createdAt.getTime()) / 1000
    const remaining = Math.max(0, props.problem.timeLimit - elapsed)
    const hours = Math.floor(remaining / 3600)
    const minutes = Math.floor((remaining % 3600) / 60)
    return `残り ${hours}時間${minutes}分`
  }
  return null
})

const viewProblem = () => {
  router.push({ name: 'problem', params: { id: props.problem.id } })
}
</script>

<template>
  <div class="problem-card" @click="viewProblem">
    <!-- Header -->
    <div class="card-header">
      <div class="mode-badge">
        <span class="material-icons">{{ modeIcon }}</span>
        <span>{{ modeLabel }}</span>
      </div>
      <span class="badge" :class="statusBadge.class">{{ statusBadge.text }}</span>
    </div>

    <!-- Title -->
    <h3 class="problem-title">{{ problem.title }}</h3>

    <!-- Info -->
    <div class="problem-info">
      <div class="info-item">
        <span class="material-icons">person</span>
        <span>{{ author?.name || 'Unknown' }}</span>
      </div>
      <div class="info-item">
        <span class="material-icons">schedule</span>
        <span>{{ new Date(problem.createdAt).toLocaleDateString('ja-JP') }}</span>
      </div>
      <div class="info-item">
        <span class="material-icons">groups</span>
        <span>{{ problem.attemptCount }}人挑戦</span>
      </div>
    </div>

    <!-- Points -->
    <div class="points-section">
      <div class="points-display">
        <span class="material-icons">star</span>
        <span class="points-value">{{ Math.floor(problem.accumulatedPoints) }}</span>
        <span class="points-label">pts</span>
      </div>
      <div v-if="timeRemaining" class="time-remaining">
        <span class="material-icons">timer</span>
        <span>{{ timeRemaining }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.problem-card {
  background-color: var(--bg-primary);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  transition: all var(--transition-base);
  border: 2px solid transparent;
}

.problem-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-4px);
  border-color: var(--color-primary);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.mode-badge {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: var(--bg-secondary);
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
}

.mode-badge .material-icons {
  font-size: 18px;
}

.problem-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--spacing-md);
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.problem-info {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.info-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.info-item .material-icons {
  font-size: 18px;
}

.points-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--border-color);
}

.points-display {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.points-display .material-icons {
  color: var(--color-accent);
  font-size: 24px;
}

.points-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-accent);
}

.points-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.time-remaining {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: 0.875rem;
  color: var(--color-error);
  font-weight: 500;
}

.time-remaining .material-icons {
  font-size: 18px;
}
</style>
