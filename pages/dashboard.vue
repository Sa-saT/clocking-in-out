<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- ヘッダー -->
    <header class="bg-white dark:bg-gray-800 shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
              出退勤管理システム
            </h1>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-700 dark:text-gray-200">
              ようこそ、{{ authStore.user?.name || authStore.user?.email }}さん
            </span>
            <button
              @click="handleLogout"
              class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400"
              aria-label="ログアウト"
            >
              <span class="sr-only">ログアウト</span>
              ログアウト
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- メインコンテンツ -->
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <!-- 現在の状態表示 -->
        <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg mb-6">
          <div class="px-4 py-5 sm:p-6">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
                  現在の状態
                </h3>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-300">
                  {{ currentStatus }}
                </p>
              </div>
              <div class="text-right">
                <p class="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {{ currentTime }}
                </p>
                <p class="text-sm text-gray-500 dark:text-gray-300">
                  {{ currentDate }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- 打刻ボタン -->
        <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <button
                @click="handleClockIn"
                :disabled="isClockedIn"
                class="relative block w-full border-2 border-gray-300 border-dashed rounded-lg p-12 text-center hover:border-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                :class="isClockedIn ? 'bg-green-50 border-green-300 dark:bg-green-900 dark:border-green-700' : 'bg-white dark:bg-gray-900'"
                aria-label="出勤"
              >
                <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <span class="mt-2 block text-sm font-medium text-gray-900 dark:text-gray-100">
                  <span class="sr-only">出勤ボタン</span>
                  {{ isClockedIn ? '出勤済み' : '出勤' }}
                </span>
              </button>

              <button
                @click="handleClockOut"
                :disabled="!isClockedIn"
                class="relative block w-full border-2 border-gray-300 border-dashed rounded-lg p-12 text-center hover:border-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                :class="!isClockedIn ? 'bg-red-50 border-red-300 dark:bg-red-900 dark:border-red-700' : 'bg-white dark:bg-gray-900'"
                aria-label="退勤"
              >
                <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <span class="mt-2 block text-sm font-medium text-gray-900 dark:text-gray-100">
                  <span class="sr-only">退勤ボタン</span>
                  {{ !isClockedIn ? '出勤していません' : '退勤' }}
                </span>
              </button>
            </div>
          </div>
        </div>

        <!-- 履歴表示 -->
        <div class="mt-6 bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100 mb-4">
              打刻履歴
            </h3>
            <template v-if="pending">
              <p class="text-sm text-gray-500 dark:text-gray-300">読み込み中...</p>
            </template>
            <template v-else-if="error">
              <p class="text-sm text-red-500" role="alert" aria-live="assertive" tabindex="0">履歴の取得に失敗しました</p>
            </template>
            <template v-else-if="clocks && clocks.length">
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700" aria-label="打刻履歴">
                  <thead>
                    <tr>
                      <th scope="col" class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider" tabindex="0" aria-label="日付">日付</th>
                      <th scope="col" class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider" tabindex="0" aria-label="出勤時刻">出勤時刻</th>
                      <th scope="col" class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider" tabindex="0" aria-label="退勤時刻">退勤時刻</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-800">
                    <tr v-for="clock in clocks" :key="clock.id" class="hover:bg-indigo-50 dark:hover:bg-indigo-900 focus-within:bg-indigo-100 dark:focus-within:bg-indigo-800 transition-colors">
                      <td class="px-4 py-2 whitespace-nowrap">{{ formatDate(clock.clockIn) }}</td>
                      <td class="px-4 py-2 whitespace-nowrap">{{ formatTime(clock.clockIn) }}</td>
                      <td class="px-4 py-2 whitespace-nowrap">
                        <span v-if="clock.clockOut">{{ formatTime(clock.clockOut) }}</span>
                        <span v-else class="text-red-500 font-semibold" aria-label="未退勤" role="status" aria-live="polite">未退勤</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </template>
            <template v-else>
              <p class="text-sm text-gray-500 dark:text-gray-300">履歴がありません</p>
            </template>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useApi } from '@/composables/useApi'

const authStore = useAuthStore()
const router = useRouter()

// 現在時刻の表示
const currentTime = ref('')
const currentDate = ref('')
const isClockedIn = ref(false)

const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('ja-JP')
  currentDate.value = now.toLocaleDateString('ja-JP')
}

const currentStatus = computed(() => {
  return isClockedIn.value ? '出勤中' : '未出勤'
})

const { fetchWithSSR, fetch } = useApi()
const userId = computed(() => authStore.user?.id)
const { data, pending, error, refresh } = fetchWithSSR(
  () => userId.value ? `/api/clock/history?userId=${userId.value}` : '',
  { server: false }
)
const clocks = computed(() => (data.value && Array.isArray((data.value as any).clocks) ? (data.value as any).clocks : []))

// 打刻状態を履歴から判定
watchEffect(() => {
  if (clocks.value && clocks.value.length > 0) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayClock = clocks.value.find((c: any) => {
      const d = new Date(c.clockIn)
      d.setHours(0, 0, 0, 0)
      return d.getTime() === today.getTime() && !c.clockOut
    })
    isClockedIn.value = !!todayClock
  } else {
    isClockedIn.value = false
  }
})

const handleClockIn = async () => {
  try {
    await fetch('/api/clock/in', {
      method: 'POST',
      body: { userId: userId.value }
    })
    await refresh()
  } catch (e: any) {
    alert(e?.data?.message || '出勤打刻に失敗しました')
  }
}

const handleClockOut = async () => {
  try {
    await fetch('/api/clock/out', {
      method: 'POST',
      body: { userId: userId.value }
    })
    await refresh()
  } catch (e: any) {
    alert(e?.data?.message || '退勤打刻に失敗しました')
  }
}

const handleLogout = async () => {
  await authStore.logout()
  await router.push('/login')
}

// 時刻更新のタイマー
onMounted(() => {
  updateTime()
  setInterval(updateTime, 1000)
})

// 認証チェック
onMounted(() => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
  }
})

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('ja-JP')
}
function formatTime(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })
}
</script> 