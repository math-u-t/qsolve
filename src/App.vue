<script setup lang="ts">
import { onMounted } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import { useUsersStore } from '@/stores/users'
import { useProblemsStore } from '@/stores/problems'
import { useAnswersStore } from '@/stores/answers'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'

const settingsStore = useSettingsStore()
const usersStore = useUsersStore()
const problemsStore = useProblemsStore()
const answersStore = useAnswersStore()

onMounted(() => {
  // Load data from localStorage
  settingsStore.loadSettings()
  usersStore.loadFromLocalStorage()
  problemsStore.loadFromLocalStorage()
  answersStore.loadFromLocalStorage()
})
</script>

<template>
  <div id="app" class="app-container">
    <AppHeader />
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <AppFooter />
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding-top: 80px; /* Account for fixed header */
  padding-bottom: var(--spacing-xl);
}

/* Page transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--transition-base), transform var(--transition-base);
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
