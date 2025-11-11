<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUsersStore } from '@/stores/users'
import UserAvatar from '@/components/common/UserAvatar.vue'

const router = useRouter()
const usersStore = useUsersStore()

const rankedUsers = computed(() => usersStore.getUsersByRank.slice(0, 50))

const getMedalIcon = (rank: number) => {
  if (rank === 1) return { icon: 'emoji_events', color: '#FFD700' }
  if (rank === 2) return { icon: 'emoji_events', color: '#C0C0C0' }
  if (rank === 3) return { icon: 'emoji_events', color: '#CD7F32' }
  return null
}

const viewProfile = (userId: string) => {
  router.push({ name: 'profile', params: { id: userId } })
}
</script>

<template>
  <div class="ranking-page">
    <div class="container">
      <div class="page-header">
        <h1>
          <span class="material-icons">leaderboard</span>
          ランキング
        </h1>
        <p class="page-subtitle">トップユーザーをチェック</p>
      </div>

      <!-- Top 3 Podium -->
      <div class="podium" v-if="rankedUsers.length >= 3">
        <div class="podium-item second">
          <div class="podium-user" @click="viewProfile(rankedUsers[1].id)">
            <UserAvatar :src="rankedUsers[1].avatar" :alt="rankedUsers[1].name" size="lg" />
            <div class="rank-badge silver">2</div>
          </div>
          <div class="user-info">
            <h3>{{ rankedUsers[1].name }}</h3>
            <p class="points">{{ rankedUsers[1].totalPoints }} pts</p>
          </div>
          <div class="podium-base">2位</div>
        </div>

        <div class="podium-item first">
          <div class="podium-user" @click="viewProfile(rankedUsers[0].id)">
            <UserAvatar :src="rankedUsers[0].avatar" :alt="rankedUsers[0].name" size="xl" />
            <div class="rank-badge gold">1</div>
            <span class="crown material-icons">emoji_events</span>
          </div>
          <div class="user-info">
            <h3>{{ rankedUsers[0].name }}</h3>
            <p class="points">{{ rankedUsers[0].totalPoints }} pts</p>
          </div>
          <div class="podium-base">1位</div>
        </div>

        <div class="podium-item third">
          <div class="podium-user" @click="viewProfile(rankedUsers[2].id)">
            <UserAvatar :src="rankedUsers[2].avatar" :alt="rankedUsers[2].name" size="lg" />
            <div class="rank-badge bronze">3</div>
          </div>
          <div class="user-info">
            <h3>{{ rankedUsers[2].name }}</h3>
            <p class="points">{{ rankedUsers[2].totalPoints }} pts</p>
          </div>
          <div class="podium-base">3位</div>
        </div>
      </div>

      <!-- Ranking Table -->
      <div class="ranking-table card">
        <table>
          <thead>
            <tr>
              <th>順位</th>
              <th>ユーザー</th>
              <th>学年</th>
              <th>ポイント</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="user in rankedUsers"
              :key="user.id"
              @click="viewProfile(user.id)"
              class="table-row"
            >
              <td class="rank-cell">
                <div v-if="getMedalIcon(user.rank)" class="medal">
                  <span class="material-icons" :style="{ color: getMedalIcon(user.rank)!.color }">
                    {{ getMedalIcon(user.rank)!.icon }}
                  </span>
                </div>
                <span v-else class="rank-number">{{ user.rank }}</span>
              </td>
              <td class="user-cell">
                <UserAvatar :src="user.avatar" :alt="user.name" size="sm" />
                <span>{{ user.name }}</span>
              </td>
              <td>{{ user.grade }}</td>
              <td class="points-cell">
                <span class="material-icons">star</span>
                <strong>{{ user.totalPoints }}</strong>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ranking-page {
  padding: var(--spacing-xl) 0;
  min-height: calc(100vh - 160px);
}

.page-header {
  text-align: center;
  margin-bottom: var(--spacing-2xl);
}

.page-header h1 {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  font-size: 2.5rem;
  margin-bottom: var(--spacing-sm);
}

.page-subtitle {
  font-size: 1.125rem;
  color: var(--text-secondary);
}

/* Podium */
.podium {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-2xl);
  padding: var(--spacing-xl) 0;
}

.podium-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
}

.podium-user {
  position: relative;
  cursor: pointer;
  transition: transform var(--transition-fast);
}

.podium-user:hover {
  transform: scale(1.05);
}

.rank-badge {
  position: absolute;
  bottom: 0;
  right: -8px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-weight: 700;
  color: white;
  border: 3px solid var(--bg-primary);
}

.rank-badge.gold {
  background: linear-gradient(135deg, #FFD700, #FFA500);
}

.rank-badge.silver {
  background: linear-gradient(135deg, #C0C0C0, #A0A0A0);
}

.rank-badge.bronze {
  background: linear-gradient(135deg, #CD7F32, #B87333);
}

.crown {
  position: absolute;
  top: -24px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 32px;
  color: #FFD700;
  animation: float 2s ease-in-out infinite;
}

.podium-item .user-info {
  text-align: center;
}

.podium-item .user-info h3 {
  margin-bottom: var(--spacing-xs);
  color: var(--text-primary);
}

.podium-item .points {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-accent);
  margin: 0;
}

.podium-base {
  padding: var(--spacing-lg) var(--spacing-xl);
  border-radius: var(--radius-md) var(--radius-md) 0 0;
  font-weight: 700;
  color: white;
  text-align: center;
  min-width: 120px;
}

.first .podium-base {
  background: linear-gradient(135deg, #FFD700, #FFA500);
  padding: var(--spacing-2xl) var(--spacing-xl);
}

.second .podium-base {
  background: linear-gradient(135deg, #C0C0C0, #A0A0A0);
  padding: var(--spacing-xl) var(--spacing-xl);
}

.third .podium-base {
  background: linear-gradient(135deg, #CD7F32, #B87333);
  padding: var(--spacing-lg) var(--spacing-xl);
}

/* Table */
.ranking-table {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background-color: var(--bg-secondary);
}

th {
  padding: var(--spacing-md);
  text-align: left;
  font-weight: 600;
  color: var(--text-primary);
  border-bottom: 2px solid var(--border-color);
}

tbody tr {
  border-bottom: 1px solid var(--border-color);
  transition: background-color var(--transition-fast);
}

tbody tr:hover {
  background-color: var(--bg-secondary);
  cursor: pointer;
}

td {
  padding: var(--spacing-md);
  color: var(--text-primary);
}

.rank-cell {
  text-align: center;
  font-weight: 700;
}

.medal {
  display: flex;
  justify-content: center;
}

.medal .material-icons {
  font-size: 28px;
}

.user-cell {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.points-cell {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--color-accent);
}

.points-cell .material-icons {
  font-size: 20px;
}

@media (max-width: 767px) {
  .podium {
    flex-direction: column;
    align-items: center;
  }

  .podium-item {
    width: 100%;
  }

  .first {
    order: -1;
  }

  table {
    font-size: 0.875rem;
  }

  th, td {
    padding: var(--spacing-sm);
  }
}
</style>
