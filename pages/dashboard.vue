<template>
  <!-- <div class="min-h-screen bg-gray-50 dark:bg-gray-900"> -->
    <!-- ヘッダー（削除済み） -->
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

        <!-- 打刻履歴（最新1件＋今月分トグル） -->
        <div class="mt-6 bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center">
              打刻履歴
              <template v-if="!showMonth">
                <ArrowDownButton @click="toggleShowMonth" ariaLabel="今月の履歴を表示" />
              </template>
              <template v-else>
                <ArrowUpButton @click="toggleShowMonth" ariaLabel="今月の履歴を非表示" />
              </template>
              <button @click="toggleShowPrev" class="ml-2 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none" aria-label="先月以降の履歴">
                <span class="inline-block">
                  <svg class="w-6 h-6 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="13" r="7" stroke="currentColor" stroke-width="2.5" fill="none"/>
                    <rect x="10.5" y="3" width="3" height="2" rx="1" fill="currentColor"/>
                    <line x1="12" y1="13" x2="12" y2="8.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    <line x1="12" y1="13" x2="16" y2="13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </span>
              </button>
            </h3>
            <template v-if="pending">
              <p class="text-sm text-gray-500 dark:text-gray-300">読み込み中...</p>
            </template>
            <template v-else-if="error">
              <p class="text-sm text-red-500" role="alert" aria-live="assertive" tabindex="0">履歴の取得に失敗しました</p>
            </template>
            <template v-else>
              <!-- 最新1件のみ表示 -->
              <div v-if="latestClock">
                <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700" aria-label="最新打刻履歴">
                  <thead>
                    <tr>
                      <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">日付</th>
                      <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">出勤時刻</th>
                      <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">退勤時刻</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td class="px-4 py-2 whitespace-nowrap">{{ formatDate(latestClock.clockIn) }}</td>
                      <td class="px-4 py-2 whitespace-nowrap">{{ formatTime(latestClock.clockIn) }}</td>
                      <td class="px-4 py-2 whitespace-nowrap">
                        <span v-if="latestClock.clockOut">{{ formatTime(latestClock.clockOut) }}</span>
                        <span v-else class="text-red-500 font-semibold">未退勤</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p v-else class="text-sm text-gray-500 dark:text-gray-300">履歴がありません</p>

              <!-- 先月以降の履歴 月リスト -->
              <transition name="fade">
                <div v-if="showPrev" class="mt-4">
                  <div class="flex items-center mb-2">
                    <span class="font-semibold text-gray-700 dark:text-gray-200">月を選択してください</span>
                    <BackButton @click="closePrev" ariaLabel="戻る" />
                  </div>
                  <ul v-if="previousMonths.length" class="flex flex-wrap gap-2">
                    <li v-for="m in previousMonths" :key="m" class="">
                      <button @click="selectMonth(m)" class="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded hover:bg-indigo-200 dark:hover:bg-indigo-600 text-sm font-medium focus:outline-none">
                        {{ m }}
                      </button>
                    </li>
                  </ul>
                  <p v-else class="text-sm text-gray-500 dark:text-gray-300">打刻履歴はありません</p>
                </div>
              </transition>
              <!-- 選択月の履歴 -->
              <transition name="fade">
                <div v-if="selectedMonthClocks.length" class="mt-4">
                  <div class="flex items-center mb-2">
                    <BackButton @click="clearSelectedMonth" ariaLabel="戻る" />
                    <span class="font-semibold text-gray-700 dark:text-gray-200">{{ selectedMonth }}の履歴</span>
                  </div>
                  <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700" aria-label="選択月の打刻履歴">
                    <thead>
                      <tr>
                        <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">日付</th>
                        <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">出勤時刻</th>
                        <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">退勤時刻</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="clock in selectedMonthClocks" :key="clock.id">
                        <td class="px-4 py-2 whitespace-nowrap">{{ formatDate(clock.clockIn) }}</td>
                        <td class="px-4 py-2 whitespace-nowrap">{{ formatTime(clock.clockIn) }}</td>
                        <td class="px-4 py-2 whitespace-nowrap">
                          <span v-if="clock.clockOut">{{ formatTime(clock.clockOut) }}</span>
                          <span v-else class="text-red-500 font-semibold">未退勤</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </transition>

              <!-- 今月分の履歴（トグル表示） -->
              <transition name="fade">
                <div v-if="showMonth" class="mt-4">
                  <table v-if="monthlyClocks.length" class="min-w-full divide-y divide-gray-200 dark:divide-gray-700" aria-label="今月の打刻履歴">
                    <thead>
                      <tr>
                        <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">日付</th>
                        <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">出勤時刻</th>
                        <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">退勤時刻</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="clock in monthlyClocks" :key="clock.id">
                        <td class="px-4 py-2 whitespace-nowrap">{{ formatDate(clock.clockIn) }}</td>
                        <td class="px-4 py-2 whitespace-nowrap">{{ formatTime(clock.clockIn) }}</td>
                        <td class="px-4 py-2 whitespace-nowrap">
                          <span v-if="clock.clockOut">{{ formatTime(clock.clockOut) }}</span>
                          <span v-else class="text-red-500 font-semibold">未退勤</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <p v-else class="text-sm text-gray-500 dark:text-gray-300">今月の履歴はありません</p>
                </div>
              </transition>
            </template>
          </div>
        </div>
      </div>
    </main>
  <!-- </div> -->
</template>

<script setup lang="ts">
import { useApi } from '@/composables/useApi'
import BackButton from '@/components/icon/BackButton.vue'
import ArrowDownButton from '@/components/icon/ArrowDownButton.vue'
import ArrowUpButton from '@/components/icon/ArrowUpButton.vue'

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

const currentStatus = computed(() => {
  // 今日の打刻履歴を取得
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayClock = clocks.value.find((c: any) => {
    const d = new Date(c.clockIn)
    d.setHours(0, 0, 0, 0)
    return d.getTime() === today.getTime()
  })
  if (!todayClock) {
    return '未出勤'
  } else if (todayClock && !todayClock.clockOut) {
    return '出勤中'
  } else if (todayClock && todayClock.clockOut) {
    return '本日退勤'
  }
  return '未出勤'
})

const showMonth = ref(false)
const showPrev = ref(false)
const selectedMonth = ref('')
const selectedMonthClocks = ref<any[]>([])
const toggleShowMonth = () => { showMonth.value = !showMonth.value }
const toggleShowPrev = () => { showPrev.value = !showPrev.value; selectedMonth.value = ''; selectedMonthClocks.value = [] }
const closePrev = () => { showPrev.value = false; selectedMonth.value = ''; selectedMonthClocks.value = [] }
const selectMonth = (m: string) => {
  selectedMonth.value = m
  selectedMonthClocks.value = clocks.value.filter((c: any) => formatMonth(c.clockIn) === m)
}
const clearSelectedMonth = () => { selectedMonth.value = ''; selectedMonthClocks.value = [] }

// 最新1件
const latestClock = computed(() => {
  if (!clocks.value || !clocks.value.length) return null
  return [...clocks.value].sort((a, b) => new Date(b.clockIn).getTime() - new Date(a.clockIn).getTime())[0]
})
// 今月分
const monthlyClocks = computed(() => {
  const now = new Date()
  const ym = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  return clocks.value.filter((c: any) => {
    const d = new Date(c.clockIn)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}` === ym
  })
})
// 先月以降の履歴がある月リスト（今月以外）
const previousMonths = computed(() => {
  const now = new Date()
  const ymNow = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const months = clocks.value
    .map((c: any) => formatMonth(c.clockIn))
    .filter((m: string) => m !== ymNow)
  return Array.from(new Set(months) as Set<string>).sort().reverse()
})
function formatMonth(dateStr: string) {
  const d = new Date(dateStr)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}
</script> 