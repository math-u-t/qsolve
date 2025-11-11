<script setup lang="ts">
defineProps<{
  icon: string
  label: string
  value: string | number
  trend?: number // Percentage change
  color?: 'primary' | 'success' | 'warning' | 'error' | 'accent'
}>()
</script>

<template>
  <div class="stat-card">
    <div class="stat-icon" :class="`bg-${color}`">
      <span class="material-icons">{{ icon }}</span>
    </div>
    <div class="stat-content">
      <div class="stat-label">{{ label }}</div>
      <div class="stat-value">{{ value }}</div>
      <div v-if="trend !== undefined" class="stat-trend" :class="trend >= 0 ? 'positive' : 'negative'">
        <span class="material-icons">{{ trend >= 0 ? 'trending_up' : 'trending_down' }}</span>
        <span>{{ Math.abs(trend) }}%</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stat-card {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  background-color: var(--bg-primary);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-base);
}

.stat-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.stat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: var(--radius-lg);
  color: white;
}

.stat-icon .material-icons {
  font-size: 32px;
}

.bg-primary { background-color: var(--color-primary); }
.bg-success { background-color: var(--color-success); }
.bg-warning { background-color: var(--color-warning); }
.bg-error { background-color: var(--color-error); }
.bg-accent { background-color: var(--color-accent); }

.stat-content {
  flex: 1;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: var(--spacing-xs);
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--spacing-xs);
}

.stat-trend {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: 0.875rem;
  font-weight: 500;
}

.stat-trend.positive {
  color: var(--color-success);
}

.stat-trend.negative {
  color: var(--color-error);
}

.stat-trend .material-icons {
  font-size: 18px;
}
</style>
