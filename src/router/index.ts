import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomePage.vue')
  },
  {
    path: '/post',
    name: 'post',
    component: () => import('@/views/PostProblem.vue')
  },
  {
    path: '/problem/:id',
    name: 'problem',
    component: () => import('@/views/ProblemDetail.vue')
  },
  {
    path: '/ranking',
    name: 'ranking',
    component: () => import('@/views/RankingPage.vue')
  },
  {
    path: '/profile/:id',
    name: 'profile',
    component: () => import('@/views/ProfilePage.vue')
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/views/DashboardPage.vue')
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('@/views/SearchPage.vue')
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('@/views/SettingsPage.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

export default router
