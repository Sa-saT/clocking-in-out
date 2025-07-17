<template>
  <div 
    :class="isLogin ? 'min-h-screen flex flex-col' : 'min-h-screen flex flex-col bg-gray-50'"
    :style="isLogin ? '' : 'background-image: url(\'/background.png\'); background-size: cover; background-position: center; background-repeat: no-repeat;'"
  >
    <Header v-if="!isLogin"
      :title="headerTitle"
      :showMenu="showMenu"
      :userInfo="userDisplay"
      :menuOpen="menuOpen"
      :onMenuClick="showMenu ? toggleMenu : undefined"
    />
    <main class="flex-1 container mx-auto px-4 py-6" role="main" tabindex="-1">
      <h1 class="sr-only">出退勤管理アプリ</h1>
      <NuxtPage />
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { onMounted, ref, computed } from 'vue'
import { useMenuBar } from '@/composables/useMenuBar'

const auth = useAuthStore()
const route = useRoute()

// ログイン画面かどうかを判定
const isLogin = computed(() => route.path === '/login')

onMounted(() => {
  auth.restoreUserFromSession()
})

const isAdminDashboard = computed(() => route.path.startsWith('/admin'))
const isAdmin = computed(() => auth.user?.email === 'admin@example.com')
const headerTitle = computed(() => isAdminDashboard.value ? '管理者ダッシュボード' : '出退勤管理システム')
const userDisplay = computed(() => isAdminDashboard.value && isAdmin.value ? `${auth.user?.name || auth.user?.email}（管理者）` : (auth.user?.name || auth.user?.email || ''))
const showMenu = computed(() => isAdminDashboard.value && isAdmin.value)
const { menuOpen, toggleMenu } = useMenuBar()
</script>