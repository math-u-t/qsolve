<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProblemsStore } from '@/stores/problems'
import { useUsersStore } from '@/stores/users'
import { useAnswersStore } from '@/stores/answers'
import { marked } from 'marked'
import Timer from '@/components/common/Timer.vue'
import UserAvatar from '@/components/common/UserAvatar.vue'
import confetti from 'canvas-confetti'

const route = useRoute()
const router = useRouter()
const problemsStore = useProblemsStore()
const usersStore = useUsersStore()
const answersStore = useAnswersStore()

const problemId = route.params.id as string
const problem = computed(() => problemsStore.getProblemById(problemId))
const author = computed(() => problem.value ? usersStore.getUserById(problem.value.authorId) : null)
const currentUser = computed(() => usersStore.currentUser)

const userAnswer = ref<string | number>('')
const isSubmitting = ref(false)
const result = ref<{ isCorrect: boolean; pointsEarned: number } | null>(null)
const startTime = ref(new Date())

const hasAnswered = computed(() => {
  if (!currentUser.value || !problem.value) return false
  return answersStore.hasUserAnswered(currentUser.value.id, problem.value.id)
})

const contentHtml = computed(() => {
  if (!problem.value) return ''
  return marked(problem.value.content)
})

const submitAnswer = async () => {
  if (!problem.value || !currentUser.value) return

  isSubmitting.value = true

  try {
    const timeSpent = Math.floor((Date.now() - startTime.value.getTime()) / 1000)

    result.value = answersStore.submitAnswer(
      problem.value.id,
      currentUser.value.id,
      userAnswer.value,
      timeSpent
    )

    if (result.value.isCorrect) {
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 }
      })
    }
  } catch (err: any) {
    alert(err.message || '解答の送信に失敗しました')
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  if (!problem.value) {
    alert('問題が見つかりません')
    router.push({ name: 'home' })
  }
  startTime.value = new Date()
})
</script>

<template>
  <div class="problem-detail-page" v-if="problem">
    <div class="container">
      <!-- Header -->
      <div class="problem-header">
        <div class="header-top">
          <button class="btn btn-secondary" @click="router.back()">
            <span class="material-icons">arrow_back</span>
            <span>戻る</span>
          </button>
          <div class="badges">
            <span class="badge badge-primary">
              <span class="material-icons">{{ problem.mode === 'speed' ? 'timer' : 'emoji_events' }}</span>
              {{ problem.mode === 'speed' ? '短期チャレンジ' : '挑戦型' }}
            </span>
            <span
              class="badge"
              :class="{
                'badge-warning': problem.status === 'sampling',
                'badge-primary': problem.status === 'open',
                'badge-success': problem.status === 'solved'
              }"
            >
              {{ problem.status === 'sampling' ? 'サンプリング中' : problem.status === 'open' ? '公開中' : '解決済み' }}
            </span>
          </div>
        </div>

        <h1 class="problem-title">{{ problem.title }}</h1>

        <div class="problem-meta">
          <div class="meta-item" v-if="author">
            <UserAvatar :src="author.avatar" :alt="author.name" size="sm" />
            <span>{{ author.name }}</span>
          </div>
          <div class="meta-item">
            <span class="material-icons">schedule</span>
            <span>{{ new Date(problem.createdAt).toLocaleDateString('ja-JP') }}</span>
          </div>
          <div class="meta-item">
            <span class="material-icons">groups</span>
            <span>{{ problem.attemptCount }}人挑戦</span>
          </div>
          <div class="meta-item points">
            <span class="material-icons">star</span>
            <span class="points-value">{{ Math.floor(problem.accumulatedPoints) }} pts</span>
          </div>
        </div>
      </div>

      <div class="problem-content-wrapper">
        <!-- Timer (Speed mode) -->
        <div v-if="problem.mode === 'speed' && problem.timeLimit && problem.status !== 'solved'" class="timer-section">
          <Timer :start-time="problem.createdAt" :duration="problem.timeLimit" />
        </div>

        <!-- Problem Content -->
        <div class="problem-content card">
          <div class="content-html" v-html="contentHtml"></div>
        </div>

        <!-- Answer Section -->
        <div class="answer-section card">
          <h2>
            <span class="material-icons">edit</span>
            解答を入力
          </h2>

          <div v-if="problem.status === 'solved'" class="solved-notice">
            <span class="material-icons">check_circle</span>
            <p>この問題は既に解決されています</p>
          </div>

          <div v-else-if="hasAnswered" class="answered-notice">
            <span class="material-icons">info</span>
            <p>あなたは既にこの問題に解答しています</p>
          </div>

          <div v-else-if="result" class="result-display">
            <div v-if="result.isCorrect" class="result-success">
              <span class="material-icons">check_circle</span>
              <h3>正解！</h3>
              <p>獲得ポイント: <strong>{{ result.pointsEarned }}</strong> pts</p>
            </div>
            <div v-else class="result-error">
              <span class="material-icons">cancel</span>
              <h3>不正解</h3>
              <p>もう一度挑戦してみてください</p>
            </div>
          </div>

          <form v-else @submit.prevent="submitAnswer" class="answer-form">
            <div class="form-group">
              <label class="form-label">あなたの解答</label>
              <input
                v-if="problem.answerType === 'text'"
                v-model="userAnswer"
                type="text"
                class="input"
                placeholder="解答を入力"
                required
              />
              <input
                v-else-if="problem.answerType === 'number'"
                v-model.number="userAnswer"
                type="number"
                class="input"
                placeholder="数値を入力"
                required
              />
            </div>

            <button
              type="submit"
              class="btn btn-primary btn-lg"
              :disabled="isSubmitting"
            >
              <span class="material-icons">{{ isSubmitting ? 'hourglass_empty' : 'send' }}</span>
              <span>{{ isSubmitting ? '送信中...' : '解答を送信' }}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.problem-detail-page {
  padding: var(--spacing-xl) 0;
  min-height: calc(100vh - 160px);
}

.problem-header {
  margin-bottom: var(--spacing-xl);
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
}

.badges {
  display: flex;
  gap: var(--spacing-sm);
}

.problem-title {
  font-size: 2.5rem;
  margin-bottom: var(--spacing-md);
}

.problem-meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-lg);
  align-items: center;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--text-secondary);
}

.meta-item.points {
  color: var(--color-accent);
  font-weight: 700;
}

.meta-item .material-icons {
  font-size: 20px;
}

.points-value {
  font-size: 1.25rem;
}

.problem-content-wrapper {
  max-width: 900px;
  margin: 0 auto;
}

.timer-section {
  margin-bottom: var(--spacing-lg);
}

.problem-content {
  margin-bottom: var(--spacing-lg);
  padding: var(--spacing-2xl);
}

.content-html {
  line-height: 1.8;
  color: var(--text-primary);
}

.content-html :deep(h1),
.content-html :deep(h2),
.content-html :deep(h3) {
  margin-top: var(--spacing-lg);
  margin-bottom: var(--spacing-md);
}

.content-html :deep(p) {
  margin-bottom: var(--spacing-md);
}

.content-html :deep(code) {
  background-color: var(--bg-secondary);
  padding: 2px 6px;
  border-radius: var(--radius-sm);
  font-family: monospace;
}

.answer-section {
  padding: var(--spacing-2xl);
}

.answer-section h2 {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-lg);
}

.solved-notice,
.answered-notice {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  background-color: var(--bg-secondary);
  border-radius: var(--radius-md);
  color: var(--text-secondary);
}

.solved-notice .material-icons {
  font-size: 48px;
  color: var(--color-success);
}

.answered-notice .material-icons {
  font-size: 48px;
  color: var(--color-primary);
}

.result-display {
  text-align: center;
  padding: var(--spacing-xl);
}

.result-success,
.result-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
}

.result-success .material-icons {
  font-size: 72px;
  color: var(--color-success);
}

.result-error .material-icons {
  font-size: 72px;
  color: var(--color-error);
}

.result-success h3 {
  color: var(--color-success);
  font-size: 2rem;
}

.result-error h3 {
  color: var(--color-error);
  font-size: 2rem;
}

.answer-form {
  max-width: 600px;
  margin: 0 auto;
}

@media (max-width: 767px) {
  .problem-title {
    font-size: 1.75rem;
  }

  .problem-content,
  .answer-section {
    padding: var(--spacing-lg);
  }
}
</style>
