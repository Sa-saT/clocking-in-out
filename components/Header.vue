<template>
  <header v-if="show" class="bg-white dark:bg-gray-800 shadow sticky top-0 z-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between h-16 items-center">
      <div class="flex items-center">
        <!-- 管理者のみメニューバーslot表示（slotが提供されていれば必ず表示） -->
        <template v-if="isAdmin && hasMenuBarSlot">
          <slot name="menu-bar" />
        </template>
        <h1 class="text-xl font-semibold text-gray-900 dark:text-gray-100 ml-2">
          <slot name="title">出退勤管理システム</slot>
        </h1>
      </div>
      <div class="flex items-center gap-2">
        <slot name="user-info"></slot>
        <button @click="handleLogout" class="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600 text-sm font-medium">ログアウト</button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useSlots, computed } from 'vue'
const props = defineProps({
  show: { type: Boolean, default: true }
})
const authStore = useAuthStore()
const router = useRouter()
const slots = useSlots()

const isAdmin = computed(() => authStore.user?.email === 'admin@example.com')
// slotの有無はVue3推奨の!!slots['menu-bar']で判定
const hasMenuBarSlot = !!slots['menu-bar']

const handleLogout = async () => {
  await authStore.logout()
  await router.push('/login')
}
</script> 