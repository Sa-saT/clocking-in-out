// import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app'
// import { useAuthStore } from '@/stores/auth'

// export default defineNuxtRouteMiddleware((to) => {
//   // 認証不要なページをスキップ
//   const publicPages = ['/login', '/']
//   if (publicPages.includes(to.path)) {
//     return
//   }

//   const authStore = useAuthStore()
  
//   // セッションからユーザー情報を復元
//   authStore.restoreUserFromSession()
  
//   // 未認証の場合はログインページにリダイレクト
//   if (!authStore.isAuthenticated || !authStore.user?.token) {
//     return navigateTo('/login')
//   }
// }) 