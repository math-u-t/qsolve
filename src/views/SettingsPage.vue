<script setup lang="ts">
import { useSettingsStore } from '@/stores/settings'

const settingsStore = useSettingsStore()
</script>

<template>
  <div class="settings-page">
    <div class="container">
      <div class="page-header">
        <h1>
          <span class="material-icons">settings</span>
          設定
        </h1>
      </div>

      <div class="settings-content">
        <!-- Theme Settings -->
        <div class="settings-section card">
          <h2>表示設定</h2>
          <div class="setting-item">
            <div class="setting-info">
              <span class="material-icons">
                {{ settingsStore.theme === 'light' ? 'light_mode' : 'dark_mode' }}
              </span>
              <div>
                <h3>テーマ</h3>
                <p>表示モードを切り替えます</p>
              </div>
            </div>
            <button class="btn btn-primary" @click="settingsStore.toggleTheme()">
              {{ settingsStore.theme === 'light' ? 'ダークモード' : 'ライトモード' }}に切り替え
            </button>
          </div>
        </div>

        <!-- Notification Settings -->
        <div class="settings-section card">
          <h2>通知設定</h2>
          <div class="setting-item">
            <div class="setting-info">
              <span class="material-icons">notifications</span>
              <div>
                <h3>新しい問題</h3>
                <p>新しい問題が投稿されたときに通知</p>
              </div>
            </div>
            <label class="toggle">
              <input
                type="checkbox"
                :checked="settingsStore.notifications.newProblem"
                @change="settingsStore.updateNotifications('newProblem', ($event.target as HTMLInputElement).checked)"
              />
              <span class="slider"></span>
            </label>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <span class="material-icons">check_circle</span>
              <div>
                <h3>問題解決</h3>
                <p>投稿した問題が解かれたときに通知</p>
              </div>
            </div>
            <label class="toggle">
              <input
                type="checkbox"
                :checked="settingsStore.notifications.solved"
                @change="settingsStore.updateNotifications('solved', ($event.target as HTMLInputElement).checked)"
              />
              <span class="slider"></span>
            </label>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <span class="material-icons">star</span>
              <div>
                <h3>ポイント獲得</h3>
                <p>ポイントを獲得したときに通知</p>
              </div>
            </div>
            <label class="toggle">
              <input
                type="checkbox"
                :checked="settingsStore.notifications.points"
                @change="settingsStore.updateNotifications('points', ($event.target as HTMLInputElement).checked)"
              />
              <span class="slider"></span>
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.settings-page {
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

.settings-content {
  max-width: 800px;
  margin: 0 auto;
}

.settings-section {
  margin-bottom: var(--spacing-lg);
  padding: var(--spacing-xl);
}

.settings-section h2 {
  margin-bottom: var(--spacing-lg);
  font-size: 1.5rem;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--border-color);
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  flex: 1;
}

.setting-info .material-icons {
  font-size: 32px;
  color: var(--color-primary);
}

.setting-info h3 {
  margin-bottom: var(--spacing-xs);
  font-size: 1.125rem;
}

.setting-info p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

/* Toggle Switch */
.toggle {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

.toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--bg-tertiary);
  transition: var(--transition-base);
  border-radius: var(--radius-full);
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: var(--transition-base);
  border-radius: 50%;
}

input:checked + .slider {
  background-color: var(--color-primary);
}

input:checked + .slider:before {
  transform: translateX(26px);
}

@media (max-width: 767px) {
  .setting-item {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-md);
  }

  .toggle {
    align-self: flex-end;
  }
}
</style>
