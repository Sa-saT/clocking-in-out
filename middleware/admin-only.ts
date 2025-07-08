import { defineNuxtRouteMiddleware, useRouter } from 'nuxt/app'
import { useAuthStore } from '@/stores/auth'

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()
  if (!authStore.isAuthenticated || authStore.user?.email !== 'admin@example.com') {
    return navigateTo('/login')
  }
}) 