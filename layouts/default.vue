<template>
  <div 
    :class="isLogin ? 'min-h-screen flex flex-col' : 'min-h-screen flex flex-col bg-gray-50'"
    :style="isLogin ? '' : 'background-image: url(\'/background.png\'); background-size: cover; background-position: center; background-repeat: no-repeat;'"
  >
    <Header />
    <main class="flex-1 container mx-auto px-4 py-6" role="main" tabindex="-1">
      <h1 class="sr-only">出退勤管理アプリ</h1>
      <NuxtPage />
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { onMounted } from 'vue'

const auth = useAuthStore()
const route = useRoute()

// ログイン画面かどうかを判定
const isLogin = computed(() => route.path === '/login')

onMounted(() => {
  auth.restoreUserFromSession()
})
</script>