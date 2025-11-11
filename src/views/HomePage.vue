<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useProblemsStore } from '@/stores/problems'
import { useUsersStore } from '@/stores/users'
import ProblemCard from '@/components/common/ProblemCard.vue'
import StatCard from '@/components/common/StatCard.vue'

const router = useRouter()
const problemsStore = useProblemsStore()
const usersStore = useUsersStore()

const recentProblems = computed(() => {
  const currentUserId = usersStore.currentUserId
  return problemsStore.getAvailableProblems(currentUserId).slice(0, 6)
})

const stats = computed(() => ({
  totalProblems: problemsStore.allProblems.length,
  activeChallenges: problemsStore.getProblemsByStatus('open').length,
  totalUsers: usersStore.users.size,
  solvedToday: problemsStore.getProblemsByStatus('solved').filter(p => {
    const today = new Date()
    const solvedDate = p.solvedAt ? new Date(p.solvedAt) : null
    return solvedDate && solvedDate.toDateString() === today.toDateString()
  }).length
}))

const navigateTo = (name: string) => {
  router.push({ name })
}
</script>

<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <div class="hero-text">
            <h1 class="hero-title slide-up">
              校内問題投稿<br />プラットフォーム
            </h1>
            <p class="hero-subtitle slide-up">
              あなたの知識を問題にして、みんなで挑戦しよう。
              ポイントを獲得して、ランキングトップを目指そう！
            </p>
            <div class="hero-actions slide-up">
              <button class="btn btn-primary btn-lg" @click="navigateTo('post')">
                <span class="material-icons">add_circle</span>
                <span>問題を投稿</span>
              </button>
              <button class="btn btn-outline btn-lg" @click="navigateTo('dashboard')">
                <span class="material-icons">dashboard</span>
                <span>ダッシュボード</span>
              </button>
            </div>
          </div>
          <div class="hero-image">
            <div class="hero-card card">
              <span class="material-icons hero-icon">emoji_events</span>
              <h3>挑戦を始めよう</h3>
              <p>様々な問題に挑戦してポイントを獲得</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="stats-section">
      <div class="container">
        <div class="stats-grid">
          <StatCard
            icon="quiz"
            label="総問題数"
            :value="stats.totalProblems"
            :trend="12"
            color="primary"
          />
          <StatCard
            icon="whatshot"
            label="公開中の挑戦"
            :value="stats.activeChallenges"
            color="accent"
          />
          <StatCard
            icon="group"
            label="参加ユーザー"
            :value="stats.totalUsers"
            :trend="8"
            color="success"
          />
          <StatCard
            icon="check_circle"
            label="本日の解決数"
            :value="stats.solvedToday"
            color="success"
          />
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features-section">
      <div class="container">
        <h2 class="section-title">主要機能</h2>
        <div class="features-grid">
          <div class="feature-card card">
            <div class="feature-icon">
              <span class="material-icons">timer</span>
            </div>
            <h3>短期チャレンジモード</h3>
            <p>制限時間内に素早く解答。スピード重視で高ポイント獲得のチャンス！</p>
          </div>

          <div class="feature-card card">
            <div class="feature-icon">
              <span class="material-icons">emoji_events</span>
            </div>
            <h3>挑戦型モード</h3>
            <p>難問に時間をかけて挑戦。解けない問題ほどポイントが増加していきます。</p>
          </div>

          <div class="feature-card card">
            <div class="feature-icon">
              <span class="material-icons">security</span>
            </div>
            <h3>不正防止機構</h3>
            <p>ランダムサンプリングと異常パターン検出で公平な競争環境を実現。</p>
          </div>

          <div class="feature-card card">
            <div class="feature-icon">
              <span class="material-icons">leaderboard</span>
            </div>
            <h3>ランキングシステム</h3>
            <p>日次・週次・月次のランキングであなたの実力を証明しよう！</p>
          </div>

          <div class="feature-card card">
            <div class="feature-icon">
              <span class="material-icons">groups</span>
            </div>
            <h3>チーム解答</h3>
            <p>友達と協力して難問に挑戦。協力プレイも可能です。</p>
          </div>

          <div class="feature-card card">
            <div class="feature-icon">
              <span class="material-icons">star</span>
            </div>
            <h3>ポイントシステム</h3>
            <p>解答者にも投稿者にもポイント。みんながWin-Winの仕組みです。</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Recent Problems Section -->
    <section class="problems-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">最新の問題</h2>
          <button class="btn btn-primary" @click="navigateTo('dashboard')">
            <span>すべて見る</span>
            <span class="material-icons">arrow_forward</span>
          </button>
        </div>
        <div class="problems-grid" v-if="recentProblems.length > 0">
          <ProblemCard
            v-for="problem in recentProblems"
            :key="problem.id"
            :problem="problem"
          />
        </div>
        <div v-else class="empty-state">
          <span class="material-icons">inbox</span>
          <p>まだ問題がありません</p>
          <button class="btn btn-primary" @click="navigateTo('post')">
            <span class="material-icons">add</span>
            <span>最初の問題を投稿</span>
          </button>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-card card">
          <h2>今すぐ参加しよう！</h2>
          <p>問題を投稿して、挑戦して、ポイントを獲得しよう</p>
          <div class="cta-actions">
            <button class="btn btn-primary btn-lg" @click="navigateTo('post')">
              <span class="material-icons">add_circle</span>
              <span>問題を投稿</span>
            </button>
            <button class="btn btn-secondary btn-lg" @click="navigateTo('ranking')">
              <span class="material-icons">leaderboard</span>
              <span>ランキングを見る</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-page {
  min-height: 100vh;
}

/* Hero Section */
.hero {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
  color: white;
  padding: var(--spacing-2xl) 0;
  margin-bottom: var(--spacing-2xl);
}

.hero-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-2xl);
  align-items: center;
}

.hero-title {
  font-size: 3rem;
  margin-bottom: var(--spacing-lg);
  line-height: 1.2;
}

.hero-subtitle {
  font-size: 1.25rem;
  margin-bottom: var(--spacing-xl);
  opacity: 0.95;
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  gap: var(--spacing-md);
  flex-wrap: wrap;
}

.hero-image {
  display: flex;
  justify-content: center;
  align-items: center;
}

.hero-card {
  text-align: center;
  padding: var(--spacing-xl);
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.2);
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

.hero-icon {
  font-size: 64px;
  color: var(--color-accent);
  margin-bottom: var(--spacing-md);
}

.hero-card h3 {
  margin-bottom: var(--spacing-sm);
  color: white;
}

.hero-card p {
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
}

/* Stats Section */
.stats-section {
  margin-bottom: var(--spacing-2xl);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-lg);
}

/* Features Section */
.features-section {
  margin-bottom: var(--spacing-2xl);
}

.section-title {
  text-align: center;
  font-size: 2rem;
  margin-bottom: var(--spacing-xl);
  color: var(--text-primary);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-lg);
}

.feature-card {
  text-align: center;
  padding: var(--spacing-xl);
}

.feature-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));
  border-radius: var(--radius-lg);
  margin-bottom: var(--spacing-md);
  color: white;
}

.feature-icon .material-icons {
  font-size: 40px;
}

.feature-card h3 {
  margin-bottom: var(--spacing-sm);
  color: var(--text-primary);
}

.feature-card p {
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0;
}

/* Problems Section */
.problems-section {
  margin-bottom: var(--spacing-2xl);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xl);
}

.problems-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: var(--spacing-lg);
}

.empty-state {
  text-align: center;
  padding: var(--spacing-2xl);
}

.empty-state .material-icons {
  font-size: 64px;
  color: var(--text-disabled);
  margin-bottom: var(--spacing-md);
}

.empty-state p {
  color: var(--text-secondary);
  margin-bottom: var(--spacing-lg);
}

/* CTA Section */
.cta-section {
  margin-bottom: var(--spacing-2xl);
}

.cta-card {
  text-align: center;
  padding: var(--spacing-2xl);
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
  color: white;
}

.cta-card h2 {
  font-size: 2rem;
  margin-bottom: var(--spacing-md);
  color: white;
}

.cta-card p {
  font-size: 1.25rem;
  margin-bottom: var(--spacing-xl);
  opacity: 0.95;
}

.cta-actions {
  display: flex;
  gap: var(--spacing-md);
  justify-content: center;
  flex-wrap: wrap;
}

/* Responsive */
@media (max-width: 1023px) {
  .hero-content {
    grid-template-columns: 1fr;
  }

  .hero-image {
    order: -1;
  }

  .hero-title {
    font-size: 2.5rem;
  }
}

@media (max-width: 767px) {
  .hero {
    padding: var(--spacing-xl) 0;
  }

  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .section-title {
    font-size: 1.5rem;
  }

  .problems-grid {
    grid-template-columns: 1fr;
  }

  .section-header {
    flex-direction: column;
    gap: var(--spacing-md);
  }
}
</style>
