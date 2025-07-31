import { watch } from 'vue'

export default defineNuxtPlugin((nuxtApp) => {
  if (typeof window !== 'undefined') {
    const authStore = useAuthStore()
    
    // アプリ起動時にセッションからユーザー情報を復元
    authStore.restoreUserFromSession()
    
    // 認証状態の監視
    watch(() => authStore.isAuthenticated, (isAuth) => {
      if (!isAuth) {
        // 未認証時はログインページにリダイレクト（現在のページが公開ページでない場合）
        const publicPages = ['/login', '/']
        const currentRoute = useRoute()
        if (!publicPages.includes(currentRoute.path)) {
          navigateTo('/login')
        }
      }
    })
  }
}) 