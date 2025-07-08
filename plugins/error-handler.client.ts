export default defineNuxtPlugin((nuxtApp) => {
  // クライアントサイドでのみ実行
  if (process.client) {
    // グローバルエラーハンドリング
    nuxtApp.vueApp.config.errorHandler = (error, instance, info) => {
      console.error('Vue Error:', error)
      console.error('Component:', instance)
      console.error('Info:', info)
      
      // エラーをユーザーに通知（将来的にはToast通知など）
      // 現状はコンソールログのみ
    }

    // 未処理のPromiseエラーをキャッチ
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled Promise Rejection:', event.reason)
      event.preventDefault()
    })
  }
}) 