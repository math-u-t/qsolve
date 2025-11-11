<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useUsersStore } from '@/stores/users'
import { useProblemsStore } from '@/stores/problems'
import { useAnswersStore } from '@/stores/answers'
import UserAvatar from '@/components/common/UserAvatar.vue'
import StatCard from '@/components/common/StatCard.vue'
import ProblemCard from '@/components/common/ProblemCard.vue'

const route = useRoute()
const usersStore = useUsersStore()
const problemsStore = useProblemsStore()
const answersStore = useAnswersStore()

const userId = route.params.id as string
const user = computed(() => usersStore.getUserById(userId))
const userProblems = computed(() => problemsStore.getProblemsByAuthor(userId))
const stats = computed(() => answersStore.getUserStats(userId))
</script>

<template>
  <div class="profile-page" v-if="user">
    <div class="container">
      <!-- Profile Header -->
      <div class="profile-header card">
        <UserAvatar :src="user.avatar" :alt="user.name" size="xl" />
        <div class="profile-info">
          <h1>{{ user.name }}</h1>
          <p class="grade">{{ user.grade }}</p>
          <div class="rank-display">
            <span class="material-icons">leaderboard</span>
            <span>ランク: <strong>#{{ user.rank }}</strong></span>
          </div>
        </div>
        <div class="points-display">
          <span class="material-icons">star</span>
          <div class="points-info">
            <span class="points-value">{{ user.totalPoints }}</span>
            <span class="points-label">ポイント</span>
          </div>
        </div>
      </div>

      <!-- Stats -->
      <div class="stats-grid">
        <StatCard
          icon="quiz"
          label="投稿した問題"
          :value="userProblems.length"
          color="primary"
        />
        <StatCard
          icon="check_circle"
          label="正解数"
          :value="stats.correctAnswers"
          color="success"
        />
        <StatCard
          icon="percent"
          label="正解率"
          :value="`${stats.successRate.toFixed(1)}%`"
          color="accent"
        />
        <StatCard
          icon="timer"
          label="平均解答時間"
          :value="`${Math.floor(stats.averageTime / 60)}分`"
          color="warning"
        />
      </div>

      <!-- Tabs -->
      <div class="profile-content">
        <h2>投稿した問題</h2>
        <div v-if="userProblems.length > 0" class="problems-grid">
          <ProblemCard
            v-for="problem in userProblems"
            :key="problem.id"
            :problem="problem"
          />
        </div>
        <div v-else class="empty-state">
          <span class="material-icons">inbox</span>
          <p>まだ問題を投稿していません</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-page {
  padding: var(--spacing-xl) 0;
  min-height: calc(100vh - 160px);
}

.profile-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-xl);
  padding: var(--spacing-2xl);
  margin-bottom: var(--spacing-xl);
}

.profile-info {
  flex: 1;
}

.profile-info h1 {
  font-size: 2rem;
  margin-bottom: var(--spacing-xs);
}

.grade {
  color: var(--text-secondary);
  margin-bottom: var(--spacing-md);
}

.rank-display {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--color-primary);
  font-size: 1.125rem;
}

.points-display {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  background: linear-gradient(135deg, var(--color-accent), var(--color-accent-light));
  border-radius: var(--radius-lg);
  color: white;
}

.points-display .material-icons {
  font-size: 48px;
}

.points-info {
  display: flex;
  flex-direction: column;
}

.points-value {
  font-size: 2rem;
  font-weight: 700;
}

.points-label {
  font-size: 0.875rem;
  opacity: 0.9;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.profile-content h2 {
  margin-bottom: var(--spacing-lg);
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

@media (max-width: 767px) {
  .profile-header {
    flex-direction: column;
    text-align: center;
  }

  .problems-grid {
    grid-template-columns: 1fr;
  }
}
</style>
