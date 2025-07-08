<template>
  <header class="bg-white/80 shadow" role="banner">
    <div class="container mx-auto px-4 py-3 flex items-center justify-between">
      <div class="text-xl font-bold text-blue-700" aria-label="出退勤管理アプリ" tabindex="0">
        出退勤管理アプリ
      </div>
      <div class="flex items-center space-x-4">
        <span v-if="authStore.user" class="text-sm text-gray-700">
          {{ authStore.user.name || authStore.user.email }} さん
        </span>
        <button
          v-if="authStore.isAuthenticated"
          @click="handleLogout"
          class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400"
          aria-label="ログアウト"
        >
          ログアウト
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const authStore = useAuthStore()
const router = useRouter()

const handleLogout = async () => {
  await authStore.logout()
  await router.push('/login')
}
</script> 