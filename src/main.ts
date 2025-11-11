import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { initializeMockData } from './utils/mockData'
import './assets/styles/global.css'

// Initialize mock data
initializeMockData()

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
