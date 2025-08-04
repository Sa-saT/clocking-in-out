<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="text-center">
      <div class="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
      <p class="mt-4 text-gray-600">リダイレクト中...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'


const authStore = useAuthStore()
const router = useRouter()

onMounted(() => {
  // セッションからユーザー情報を復元
  authStore.restoreUserFromSession()
  
  // 認証状態に基づいて画面遷移
  if (authStore.isAuthenticated && authStore.user?.token) {
    if (authStore.user?.email === 'admin@example.com') {
      router.push('/admin/dashboard')
    } else {
      router.push('/dashboard')
    }
  } else {
    router.push('/login')
  }
})
</script> 