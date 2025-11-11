<script setup lang="ts">
import { ref, computed } from 'vue'
import { useProblemsStore } from '@/stores/problems'
import { useUsersStore } from '@/stores/users'
import ProblemCard from '@/components/common/ProblemCard.vue'

const problemsStore = useProblemsStore()
const usersStore = useUsersStore()

const searchQuery = ref('')

const searchResults = computed(() => {
  if (!searchQuery.value.trim()) return []

  const query = searchQuery.value.toLowerCase()
  const currentUserId = usersStore.currentUserId

  return problemsStore.getAvailableProblems(currentUserId).filter(problem => {
    return (
      problem.title.toLowerCase().includes(query) ||
      problem.content.toLowerCase().includes(query)
    )
  })
})
</script>

<template>
  <div class="search-page">
    <div class="container">
      <div class="page-header">
        <h1>
          <span class="material-icons">search</span>
          検索
        </h1>
      </div>

      <div class="search-section">
        <div class="search-box">
          <span class="material-icons">search</span>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="問題を検索..."
            class="input"
            autofocus
          />
        </div>

        <div v-if="searchQuery" class="search-results">
          <div class="results-header">
            <p>{{ searchResults.length }}件の結果が見つかりました</p>
          </div>

          <div v-if="searchResults.length > 0" class="problems-grid">
            <ProblemCard
              v-for="problem in searchResults"
              :key="problem.id"
              :problem="problem"
            />
          </div>

          <div v-else class="empty-state">
            <span class="material-icons">search_off</span>
            <p>検索結果が見つかりませんでした</p>
          </div>
        </div>

        <div v-else class="search-prompt">
          <span class="material-icons">info</span>
          <p>キーワードを入力して問題を検索してください</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.search-page {
  padding: var(--spacing-xl) 0;
  min-height: calc(100vh - 160px);
}

.page-header {
  margin-bottom: var(--spacing-xl);
}

.page-header h1 {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: 2.5rem;
}

.search-section {
  max-width: 1000px;
  margin: 0 auto;
}

.search-box {
  position: relative;
  margin-bottom: var(--spacing-xl);
}

.search-box .material-icons {
  position: absolute;
  left: var(--spacing-lg);
  top: 50%;
  transform: translateY(-50%);
  font-size: 28px;
  color: var(--text-secondary);
}

.search-box input {
  padding-left: var(--spacing-2xl);
  padding-right: var(--spacing-xl);
  font-size: 1.125rem;
  height: 60px;
  width: 100%;
}

.results-header {
  margin-bottom: var(--spacing-lg);
  color: var(--text-secondary);
}

.problems-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: var(--spacing-lg);
}

.empty-state,
.search-prompt {
  text-align: center;
  padding: var(--spacing-2xl);
  background-color: var(--bg-secondary);
  border-radius: var(--radius-lg);
}

.empty-state .material-icons,
.search-prompt .material-icons {
  font-size: 64px;
  color: var(--text-disabled);
  margin-bottom: var(--spacing-md);
}

.empty-state p,
.search-prompt p {
  color: var(--text-secondary);
  font-size: 1.125rem;
  margin: 0;
}

@media (max-width: 767px) {
  .problems-grid {
    grid-template-columns: 1fr;
  }
}
</style>
