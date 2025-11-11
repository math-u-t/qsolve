<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useSettingsStore } from '@/stores/settings'
import { useUsersStore } from '@/stores/users'

const router = useRouter()
const route = useRoute()
const settingsStore = useSettingsStore()
const usersStore = useUsersStore()

const currentUser = computed(() => usersStore.currentUser)

const isActive = (name: string) => {
  return route.name === name
}

const navigateTo = (name: string) => {
  router.push({ name })
}
</script>

<template>
  <header class="app-header">
    <div class="container">
      <div class="header-content">
        <!-- Logo -->
        <div class="logo" @click="navigateTo('home')">
          <span class="material-icons">quiz</span>
          <span class="logo-text">qsolve</span>
        </div>

        <!-- Navigation -->
        <nav class="nav">
          <button
            class="nav-item"
            :class="{ active: isActive('home') }"
            @click="navigateTo('home')"
          >
            <span class="material-icons">home</span>
            <span>ホーム</span>
          </button>

          <button
            class="nav-item"
            :class="{ active: isActive('dashboard') }"
            @click="navigateTo('dashboard')"
          >
            <span class="material-icons">dashboard</span>
            <span>ダッシュボード</span>
          </button>

          <button
            class="nav-item"
            :class="{ active: isActive('ranking') }"
            @click="navigateTo('ranking')"
          >
            <span class="material-icons">leaderboard</span>
            <span>ランキング</span>
          </button>

          <button
            class="nav-item btn-primary"
            @click="navigateTo('post')"
          >
            <span class="material-icons">add_circle</span>
            <span>問題投稿</span>
          </button>
        </nav>

        <!-- Right side -->
        <div class="header-actions">
          <!-- Theme toggle -->
          <button class="icon-btn" @click="settingsStore.toggleTheme()" title="テーマ切替">
            <span class="material-icons">
              {{ settingsStore.theme === 'light' ? 'dark_mode' : 'light_mode' }}
            </span>
          </button>

          <!-- Search -->
          <button class="icon-btn" @click="navigateTo('search')" title="検索">
            <span class="material-icons">search</span>
          </button>

          <!-- User profile -->
          <div v-if="currentUser" class="user-menu" @click="navigateTo('profile')">
            <img :src="currentUser.avatar" :alt="currentUser.name" class="user-avatar" />
            <div class="user-info">
              <div class="user-name">{{ currentUser.name }}</div>
              <div class="user-points">
                <span class="material-icons">star</span>
                {{ currentUser.totalPoints }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: var(--bg-primary);
  border-bottom: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
  z-index: var(--z-fixed);
  transition: all var(--transition-base);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-md) 0;
  gap: var(--spacing-lg);
}

.logo {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  cursor: pointer;
  transition: transform var(--transition-fast);
}

.logo:hover {
  transform: scale(1.05);
}

.logo .material-icons {
  font-size: 32px;
  color: var(--color-primary);
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
}

.nav {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  flex: 1;
  justify-content: center;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  border: none;
  background-color: transparent;
  color: var(--text-secondary);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  font-size: 0.95rem;
  white-space: nowrap;
}

.nav-item:hover {
  background-color: var(--bg-secondary);
  color: var(--text-primary);
}

.nav-item.active {
  color: var(--color-primary);
  background-color: rgba(33, 150, 243, 0.1);
}

.nav-item.btn-primary {
  background-color: var(--color-primary);
  color: white;
}

.nav-item.btn-primary:hover {
  background-color: var(--color-primary-dark);
  transform: translateY(-2px);
}

.nav-item .material-icons {
  font-size: 20px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  background-color: transparent;
  color: var(--text-secondary);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.icon-btn:hover {
  background-color: var(--bg-secondary);
  color: var(--text-primary);
}

.user-menu {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.user-menu:hover {
  background-color: var(--bg-secondary);
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid var(--color-primary);
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
}

.user-points {
  display: flex;
  align-items: center;
  gap: 2px;
  font-size: 0.75rem;
  color: var(--color-accent);
}

.user-points .material-icons {
  font-size: 14px;
}

@media (max-width: 1023px) {
  .nav-item span:not(.material-icons) {
    display: none;
  }

  .user-info {
    display: none;
  }
}

@media (max-width: 767px) {
  .header-content {
    padding: var(--spacing-sm) 0;
  }

  .logo-text {
    display: none;
  }

  .nav {
    gap: var(--spacing-xs);
  }

  .nav-item {
    padding: var(--spacing-xs);
    min-width: 40px;
    justify-content: center;
  }
}
</style>
