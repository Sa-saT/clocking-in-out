<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
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
// import { onMounted } from 'vue'

const auth = useAuthStore()
// onMounted(() => {
//   auth.restoreUserFromSession()
// })
</script>