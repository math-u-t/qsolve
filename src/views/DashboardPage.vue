<script setup lang="ts">
import { ref, computed } from 'vue'
import { useProblemsStore } from '@/stores/problems'
import { useUsersStore } from '@/stores/users'
import ProblemCard from '@/components/common/ProblemCard.vue'

const problemsStore = useProblemsStore()
const usersStore = useUsersStore()

const filterMode = ref<'all' | 'speed' | 'challenge'>('all')
const filterStatus = ref<'all' | 'open' | 'sampling' | 'solved'>('all')
const searchQuery = ref('')

const filteredProblems = computed(() => {
  const currentUserId = usersStore.currentUserId
  let problems = problemsStore.getAvailableProblems(currentUserId)

  // Filter by mode
  if (filterMode.value !== 'all') {
    problems = problems.filter(p => p.mode === filterMode.value)
  }

  // Filter by status
  if (filterStatus.value !== 'all') {
    problems = problems.filter(p => p.status === filterStatus.value)
  }

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    problems = problems.filter(p =>
      p.title.toLowerCase().includes(query) ||
      p.content.toLowerCase().includes(query)
    )
  }

  return problems
})
</script>

<template>
  <div class="dashboard-page">
    <div class="container">
      <div class="page-header">
        <h1>ダッシュボード</h1>
        <p class="page-subtitle">挑戦できる問題一覧</p>
      </div>

      <!-- Filters -->
      <div class="filters-section">
        <div class="search-box">
          <span class="material-icons">search</span>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="問題を検索..."
            class="input"
          />
        </div>

        <div class="filter-group">
          <label>モード:</label>
          <div class="filter-buttons">
            <button
              class="filter-btn"
              :class="{ active: filterMode === 'all' }"
              @click="filterMode = 'all'"
            >
              すべて
            </button>
            <button
              class="filter-btn"
              :class="{ active: filterMode === 'speed' }"
              @click="filterMode = 'speed'"
            >
              <span class="material-icons">timer</span>
              短期チャレンジ
            </button>
            <button
              class="filter-btn"
              :class="{ active: filterMode === 'challenge' }"
              @click="filterMode = 'challenge'"
            >
              <span class="material-icons">emoji_events</span>
              挑戦型
            </button>
          </div>
        </div>

        <div class="filter-group">
          <label>ステータス:</label>
          <div class="filter-buttons">
            <button
              class="filter-btn"
              :class="{ active: filterStatus === 'all' }"
              @click="filterStatus = 'all'"
            >
              すべて
            </button>
            <button
              class="filter-btn"
              :class="{ active: filterStatus === 'open' }"
              @click="filterStatus = 'open'"
            >
              公開中
            </button>
            <button
              class="filter-btn"
              :class="{ active: filterStatus === 'sampling' }"
              @click="filterStatus = 'sampling'"
            >
              サンプリング
            </button>
            <button
              class="filter-btn"
              :class="{ active: filterStatus === 'solved' }"
              @click="filterStatus = 'solved'"
            >
              解決済み
            </button>
          </div>
        </div>
      </div>

      <!-- Problems Grid -->
      <div class="problems-section">
        <div class="section-info">
          <p>{{ filteredProblems.length }}件の問題が見つかりました</p>
        </div>

        <div v-if="filteredProblems.length > 0" class="problems-grid">
          <ProblemCard
            v-for="problem in filteredProblems"
            :key="problem.id"
            :problem="problem"
          />
        </div>

        <div v-else class="empty-state">
          <span class="material-icons">search_off</span>
          <p>条件に一致する問題が見つかりませんでした</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-page {
  padding: var(--spacing-xl) 0;
}

.page-header {
  margin-bottom: var(--spacing-xl);
}

.page-header h1 {
  font-size: 2.5rem;
  margin-bottom: var(--spacing-sm);
}

.page-subtitle {
  font-size: 1.125rem;
  color: var(--text-secondary);
}

.filters-section {
  background-color: var(--bg-primary);
  padding: var(--spacing-lg);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  margin-bottom: var(--spacing-xl);
}

.search-box {
  position: relative;
  margin-bottom: var(--spacing-lg);
}

.search-box .material-icons {
  position: absolute;
  left: var(--spacing-md);
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
}

.search-box input {
  padding-left: var(--spacing-2xl);
  width: 100%;
}

.filter-group {
  margin-bottom: var(--spacing-md);
}

.filter-group:last-child {
  margin-bottom: 0;
}

.filter-group label {
  display: block;
  margin-bottom: var(--spacing-sm);
  font-weight: 500;
  color: var(--text-primary);
}

.filter-buttons {
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  border: 2px solid var(--border-color);
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  font-size: 0.875rem;
}

.filter-btn:hover {
  border-color: var(--color-primary);
  background-color: var(--bg-primary);
}

.filter-btn.active {
  border-color: var(--color-primary);
  background-color: var(--color-primary);
  color: white;
}

.filter-btn .material-icons {
  font-size: 18px;
}

.problems-section {
  margin-bottom: var(--spacing-xl);
}

.section-info {
  margin-bottom: var(--spacing-lg);
  color: var(--text-secondary);
}

.problems-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: var(--spacing-lg);
}

.empty-state {
  text-align: center;
  padding: var(--spacing-2xl);
  background-color: var(--bg-secondary);
  border-radius: var(--radius-lg);
}

.empty-state .material-icons {
  font-size: 64px;
  color: var(--text-disabled);
  margin-bottom: var(--spacing-md);
}

.empty-state p {
  color: var(--text-secondary);
  font-size: 1.125rem;
}

@media (max-width: 767px) {
  .problems-grid {
    grid-template-columns: 1fr;
  }

  .page-header h1 {
    font-size: 2rem;
  }
}
</style>
