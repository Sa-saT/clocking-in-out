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
import { useRouter } from '#imports'

const authStore = useAuthStore()
const router = useRouter()

onMounted(() => {
  if (authStore.isAuthenticated) {
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