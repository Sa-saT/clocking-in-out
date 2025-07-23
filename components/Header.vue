<template>
  <header v-if="props.show" class="bg-white dark:bg-gray-800/90 shadow fixed top-0 w-full z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between h-16 items-center">
      <div class="flex items-center">
        <div v-if="props.showMenu">
          <Drawer />
        </div>
        <h1 class="text-xl font-semibold text-gray-900 dark:text-gray-100 ml-2">
          {{ props.title || '出退勤管理システム' }}
        </h1>
      </div>
      <div class="flex items-center gap-2">
        <span v-if="props.userInfo">{{ props.userInfo }}</span>
        <button @click="handleLogout" class="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600 text-sm font-medium">Log Out</button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useAuthStore } from '../stores/auth'
import { useRouter } from '#imports'

const props = defineProps({
  show: { type: Boolean, default: true },
  title: { type: String, default: '' },
  showMenu: { type: Boolean, default: false },
  userInfo: { type: String, default: '' }
})

const authStore = useAuthStore()
const router = useRouter()

const handleLogout = async () => {
  await authStore.logout()
  await router.push('/login')
}
</script> 