<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'

const props = defineProps<{
  startTime: Date
  duration: number // seconds
}>()

const elapsed = ref(0)
let intervalId: number | null = null

const remaining = computed(() => {
  return Math.max(0, props.duration - elapsed.value)
})

const progress = computed(() => {
  return (elapsed.value / props.duration) * 100
})

const formattedTime = computed(() => {
  const hours = Math.floor(remaining.value / 3600)
  const minutes = Math.floor((remaining.value % 3600) / 60)
  const seconds = Math.floor(remaining.value % 60)

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
})

const isWarning = computed(() => {
  return remaining.value < props.duration * 0.2 // Less than 20% remaining
})

const isExpired = computed(() => {
  return remaining.value <= 0
})

const updateElapsed = () => {
  const now = Date.now()
  const start = props.startTime.getTime()
  elapsed.value = Math.floor((now - start) / 1000)
}

onMounted(() => {
  updateElapsed()
  intervalId = window.setInterval(updateElapsed, 1000)
})

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId)
  }
})
</script>

<template>
  <div class="timer" :class="{ warning: isWarning, expired: isExpired }">
    <div class="timer-icon">
      <span class="material-icons">{{ isExpired ? 'alarm_off' : 'timer' }}</span>
    </div>
    <div class="timer-content">
      <div class="timer-label">{{ isExpired ? '時間切れ' : '残り時間' }}</div>
      <div class="timer-value">{{ formattedTime }}</div>
      <div class="timer-progress">
        <div class="progress-bar" :style="{ width: `${progress}%` }"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.timer {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background-color: var(--bg-secondary);
  border-radius: var(--radius-lg);
  border: 2px solid var(--color-primary);
  transition: all var(--transition-base);
}

.timer.warning {
  border-color: var(--color-warning);
  background-color: rgba(255, 152, 0, 0.1);
}

.timer.expired {
  border-color: var(--color-error);
  background-color: rgba(244, 67, 54, 0.1);
}

.timer-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background-color: var(--color-primary);
  border-radius: 50%;
  color: white;
}

.timer.warning .timer-icon {
  background-color: var(--color-warning);
}

.timer.expired .timer-icon {
  background-color: var(--color-error);
}

.timer-icon .material-icons {
  font-size: 28px;
}

.timer-content {
  flex: 1;
}

.timer-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: var(--spacing-xs);
}

.timer-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  font-variant-numeric: tabular-nums;
  margin-bottom: var(--spacing-sm);
}

.timer-progress {
  width: 100%;
  height: 6px;
  background-color: var(--bg-tertiary);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, var(--color-primary), var(--color-primary-light));
  border-radius: var(--radius-full);
  transition: width var(--transition-base);
}

.timer.warning .progress-bar {
  background: linear-gradient(90deg, var(--color-warning), var(--color-accent-light));
}

.timer.expired .progress-bar {
  background: linear-gradient(90deg, var(--color-error), #EF5350);
}
</style>
