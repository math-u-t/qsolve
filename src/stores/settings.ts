import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { Theme, Settings } from '@/types'

export const useSettingsStore = defineStore('settings', () => {
  const theme = ref<Theme>('light')
  const notifications = ref({
    newProblem: true,
    solved: true,
    points: true
  })

  // Load from localStorage
  const loadSettings = () => {
    const saved = localStorage.getItem('qsolve-settings')
    if (saved) {
      const settings: Settings = JSON.parse(saved)
      theme.value = settings.theme
      notifications.value = settings.notifications
      applyTheme(settings.theme)
    }
  }

  // Save to localStorage
  const saveSettings = () => {
    const settings: Settings = {
      theme: theme.value,
      notifications: notifications.value
    }
    localStorage.setItem('qsolve-settings', JSON.stringify(settings))
  }

  // Apply theme to document
  const applyTheme = (newTheme: Theme) => {
    document.documentElement.setAttribute('data-theme', newTheme)
  }

  // Toggle theme
  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
    applyTheme(theme.value)
    saveSettings()
  }

  // Update notifications
  const updateNotifications = (key: keyof Settings['notifications'], value: boolean) => {
    notifications.value[key] = value
    saveSettings()
  }

  // Watch for changes
  watch([theme, notifications], saveSettings, { deep: true })

  // Initialize
  loadSettings()

  return {
    theme,
    notifications,
    toggleTheme,
    updateNotifications,
    loadSettings
  }
})
