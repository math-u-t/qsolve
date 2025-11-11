<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useProblemsStore } from '@/stores/problems'
import { useUsersStore } from '@/stores/users'
import type { ProblemMode, AnswerType } from '@/types'
import confetti from 'canvas-confetti'

const router = useRouter()
const problemsStore = useProblemsStore()
const usersStore = useUsersStore()

const mode = ref<ProblemMode>('speed')
const title = ref('')
const content = ref('')
const answerType = ref<AnswerType>('text')
const answer = ref<string | number | string[]>('')
const timeLimit = ref(3600) // 1 hour default

const isSubmitting = ref(false)
const error = ref('')

const submitProblem = async () => {
  error.value = ''

  // Validation
  if (!title.value.trim()) {
    error.value = 'タイトルを入力してください'
    return
  }

  if (!content.value.trim()) {
    error.value = '問題文を入力してください'
    return
  }

  if (!answer.value) {
    error.value = '正解を入力してください'
    return
  }

  const currentUserId = usersStore.currentUserId
  if (!currentUserId) {
    error.value = 'ユーザーが見つかりません'
    return
  }

  try {
    isSubmitting.value = true

    const problemId = problemsStore.createProblem({
      authorId: currentUserId,
      mode: mode.value,
      title: title.value.trim(),
      content: content.value.trim(),
      answer: answer.value,
      answerType: answerType.value,
      timeLimit: mode.value === 'speed' ? timeLimit.value : undefined,
      samplingUsers: []
    })

    // Success feedback
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    })

    // Navigate to the problem
    setTimeout(() => {
      router.push({ name: 'problem', params: { id: problemId } })
    }, 1000)
  } catch (err: any) {
    error.value = err.message || '問題の投稿に失敗しました'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="post-problem-page">
    <div class="container">
      <div class="page-header">
        <h1>問題を投稿</h1>
        <p class="page-subtitle">あなたの知識を問題にして、みんなに挑戦させよう</p>
      </div>

      <div class="form-container">
        <!-- Mode Selection -->
        <div class="form-group">
          <label class="form-label">モード選択 *</label>
          <div class="mode-selector">
            <button
              type="button"
              class="mode-option"
              :class="{ active: mode === 'speed' }"
              @click="mode = 'speed'"
            >
              <span class="material-icons">timer</span>
              <div>
                <strong>短期チャレンジモード</strong>
                <p>スピード重視、時間制限あり</p>
              </div>
            </button>
            <button
              type="button"
              class="mode-option"
              :class="{ active: mode === 'challenge' }"
              @click="mode = 'challenge'"
            >
              <span class="material-icons">emoji_events</span>
              <div>
                <strong>挑戦型モード</strong>
                <p>難問向け、ポイント累積</p>
              </div>
            </button>
          </div>
        </div>

        <!-- Title -->
        <div class="form-group">
          <label class="form-label">タイトル *</label>
          <input
            v-model="title"
            type="text"
            class="input"
            placeholder="問題のタイトルを入力"
            maxlength="100"
          />
        </div>

        <!-- Content -->
        <div class="form-group">
          <label class="form-label">問題文 * (Markdown対応)</label>
          <textarea
            v-model="content"
            class="input"
            rows="10"
            placeholder="問題文を入力してください。Markdownでフォーマットできます。"
          ></textarea>
        </div>

        <!-- Answer Type -->
        <div class="form-group">
          <label class="form-label">解答形式 *</label>
          <select v-model="answerType" class="input">
            <option value="text">テキスト</option>
            <option value="number">数値</option>
          </select>
        </div>

        <!-- Answer -->
        <div class="form-group">
          <label class="form-label">正解 *</label>
          <input
            v-if="answerType === 'text'"
            v-model="answer"
            type="text"
            class="input"
            placeholder="正解を入力"
          />
          <input
            v-else-if="answerType === 'number'"
            v-model.number="answer"
            type="number"
            class="input"
            placeholder="正解の数値を入力"
          />
        </div>

        <!-- Time Limit (Speed mode only) -->
        <div v-if="mode === 'speed'" class="form-group">
          <label class="form-label">制限時間（秒）</label>
          <input
            v-model.number="timeLimit"
            type="number"
            class="input"
            min="60"
            max="86400"
            step="60"
          />
          <small class="form-hint">推奨: 3600秒（1時間）</small>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="error-message">
          <span class="material-icons">error</span>
          <span>{{ error }}</span>
        </div>

        <!-- Submit Button -->
        <div class="form-actions">
          <button
            type="button"
            class="btn btn-secondary"
            @click="router.back()"
          >
            キャンセル
          </button>
          <button
            type="button"
            class="btn btn-primary btn-lg"
            @click="submitProblem"
            :disabled="isSubmitting"
          >
            <span class="material-icons">{{ isSubmitting ? 'hourglass_empty' : 'send' }}</span>
            <span>{{ isSubmitting ? '投稿中...' : '問題を投稿' }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.post-problem-page {
  padding: var(--spacing-xl) 0;
  min-height: calc(100vh - 160px);
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

.form-container {
  max-width: 800px;
  margin: 0 auto;
  background-color: var(--bg-primary);
  padding: var(--spacing-2xl);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}

.mode-selector {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-md);
}

.mode-option {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  border: 2px solid var(--border-color);
  background-color: var(--bg-secondary);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-fast);
  text-align: left;
}

.mode-option:hover {
  border-color: var(--color-primary);
  transform: translateY(-2px);
}

.mode-option.active {
  border-color: var(--color-primary);
  background-color: rgba(33, 150, 243, 0.1);
}

.mode-option .material-icons {
  font-size: 36px;
  color: var(--color-primary);
}

.mode-option strong {
  display: block;
  margin-bottom: var(--spacing-xs);
  color: var(--text-primary);
}

.mode-option p {
  margin: 0;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.form-hint {
  display: block;
  margin-top: var(--spacing-xs);
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.error-message {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  background-color: rgba(244, 67, 54, 0.1);
  border: 1px solid var(--color-error);
  border-radius: var(--radius-md);
  color: var(--color-error);
  margin-bottom: var(--spacing-lg);
}

.form-actions {
  display: flex;
  gap: var(--spacing-md);
  justify-content: flex-end;
  margin-top: var(--spacing-xl);
}

@media (max-width: 767px) {
  .mode-selector {
    grid-template-columns: 1fr;
  }

  .form-container {
    padding: var(--spacing-lg);
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .form-actions button {
    width: 100%;
  }
}
</style>
