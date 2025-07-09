<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <header class="bg-white dark:bg-gray-800 shadow sticky top-0 z-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between h-16 items-center">
        <h1 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
          管理者ダッシュボード
        </h1>
        <!-- ハンバーガーメニュー（モバイル） -->
        <button class="md:hidden p-2 focus:outline-none" @click="menuOpen = !menuOpen" aria-label="メニュー開閉">
          <span v-if="!menuOpen">
            <!-- ハンバーガー -->
            <svg class="w-8 h-8 text-gray-700 dark:text-gray-200" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </span>
          <span v-else>
            <!-- X -->
            <svg class="w-8 h-8 text-gray-700 dark:text-gray-200" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </span>
        </button>
        <span class="hidden md:inline text-sm text-gray-700 dark:text-gray-200">{{ authStore.user?.name || authStore.user?.email }}（管理者）</span>
      </div>
      <!-- ドロワーメニュー（モバイル） -->
      <transition name="fade">
        <nav v-if="menuOpen" class="md:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-4">
          <div class="mb-2 font-bold text-gray-700 dark:text-gray-200">ユーザー選択</div>
          <ul>
            <li v-for="user in users" :key="user.id" class="mb-1">
              <button @click="selectUser(user); menuOpen = false" class="w-full text-left px-2 py-1 rounded hover:bg-indigo-100 dark:hover:bg-indigo-900" :class="selectedUser?.id === user.id ? 'bg-indigo-200 dark:bg-indigo-800 font-bold' : ''">
                {{ user.name || user.email }}
              </button>
            </li>
          </ul>
          <div v-if="selectedUser" class="mt-4">
            <div class="mb-2 font-bold text-gray-700 dark:text-gray-200">月選択</div>
            <ul class="flex flex-wrap gap-2">
              <li v-for="m in userMonths" :key="m">
                <button @click="selectMonth(m); menuOpen = false" class="px-3 py-1 rounded bg-gray-100 dark:bg-gray-700 hover:bg-indigo-200 dark:hover:bg-indigo-600 text-sm font-medium" :class="selectedMonth === m ? 'bg-indigo-300 dark:bg-indigo-800 font-bold' : ''">
                  {{ m }}
                </button>
              </li>
            </ul>
          </div>
          <div v-if="selectedMonthClocks.length" class="mt-4">
            <div class="flex items-center mb-2">
              <span class="font-semibold text-gray-700 dark:text-gray-200">{{ selectedMonth }}の打刻一覧</span>
              <button @click="exportPDF" class="ml-2 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs">PDFエクスポート</button>
            </div>
            <div class="overflow-x-auto">
              <table class="min-w-full text-xs divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th class="px-2 py-1 text-left">日付</th>
                    <th class="px-2 py-1 text-left">出勤</th>
                    <th class="px-2 py-1 text-left">退勤</th>
                    <th class="px-2 py-1 text-left">備考</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="clock in selectedMonthClocks" :key="clock.id">
                    <td class="px-2 py-1">{{ formatDate(clock.clockIn) }}</td>
                    <td class="px-2 py-1">{{ formatTime(clock.clockIn) }}</td>
                    <td class="px-2 py-1">{{ clock.clockOut ? formatTime(clock.clockOut) : '未退勤' }}</td>
                    <td class="px-2 py-1">{{ clock.note || '' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </nav>
      </transition>
    </header>
    <main class="max-w-7xl mx-auto py-6 sm:px-2 lg:px-8">
      <div class="px-2 py-4 sm:px-0">
        <!-- PC用サイドメニュー -->
        <aside class="hidden md:block float-left w-full max-w-xs mr-6">
          <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-4 mb-6">
            <div class="mb-2 font-bold text-gray-700 dark:text-gray-200">ユーザー選択</div>
            <ul>
              <li v-for="user in users" :key="user.id" class="mb-1">
                <button @click="selectUser(user)" class="w-full text-left px-2 py-1 rounded hover:bg-indigo-100 dark:hover:bg-indigo-900" :class="selectedUser?.id === user.id ? 'bg-indigo-200 dark:bg-indigo-800 font-bold' : ''">
                  {{ user.name || user.email }}
                </button>
              </li>
            </ul>
            <div v-if="selectedUser" class="mt-4">
              <div class="mb-2 font-bold text-gray-700 dark:text-gray-200">月選択</div>
              <ul class="flex flex-wrap gap-2">
                <li v-for="m in userMonths" :key="m">
                  <button @click="selectMonth(m)" class="px-3 py-1 rounded bg-gray-100 dark:bg-gray-700 hover:bg-indigo-200 dark:hover:bg-indigo-600 text-sm font-medium" :class="selectedMonth === m ? 'bg-indigo-300 dark:bg-indigo-800 font-bold' : ''">
                    {{ m }}
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </aside>
        <!-- メイン表示エリア -->
        <section :class="['bg-white dark:bg-gray-800 shadow rounded-lg p-4 mb-6', 'md:ml-72']">
          <h2 class="text-lg font-bold mb-2 dark:text-gray-100">{{ selectedUser ? (selectedUser.name || selectedUser.email) + ' の打刻履歴' : 'ユーザーを選択してください' }}</h2>
          <div v-if="selectedMonthClocks.length">
            <div class="flex items-center mb-2 flex-wrap gap-2">
              <span class="font-semibold text-gray-700 dark:text-gray-200">{{ selectedMonth }}の打刻一覧</span>
              <button @click="exportPDF" class="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs">PDFエクスポート</button>
            </div>
            <div class="overflow-x-auto">
              <table class="min-w-full text-xs divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th class="px-2 py-1 text-left">日付</th>
                    <th class="px-2 py-1 text-left">出勤</th>
                    <th class="px-2 py-1 text-left">退勤</th>
                    <th class="px-2 py-1 text-left">備考</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="clock in selectedMonthClocks" :key="clock.id">
                    <td class="px-2 py-1">{{ formatDate(clock.clockIn) }}</td>
                    <td class="px-2 py-1">{{ formatTime(clock.clockIn) }}</td>
                    <td class="px-2 py-1">{{ clock.clockOut ? formatTime(clock.clockOut) : '未退勤' }}</td>
                    <td class="px-2 py-1">{{ clock.note || '' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div v-else class="text-gray-500 dark:text-gray-300">月を選択してください</div>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

const authStore = useAuthStore()
const router = useRouter()
const { $authFetch } = useAuth()

interface User {
  id: number
  email: string
  name?: string
}

const users = ref<User[]>([])
const pending = ref(false)
const error = ref('')
const menuOpen = ref(false)
const selectedUser = ref<User|null>(null)
const userMonths = ref<string[]>([])
const selectedMonth = ref('')
const selectedMonthClocks = ref<any[]>([])

const fetchUsers = async () => {
  pending.value = true
  error.value = ''
  try {
    const res = await $authFetch('/api/admin/users') as any
    users.value = res.users || []
  } catch (e: any) {
    error.value = e?.data?.message || '取得に失敗しました'
  } finally {
    pending.value = false
  }
}

const selectUser = async (user: User) => {
  selectedUser.value = user
  selectedMonth.value = ''
  selectedMonthClocks.value = []
  // ユーザーの打刻履歴から月リスト取得
  const res = await $authFetch(`/api/clock/history?userId=${user.id}`) as any
  const clocks = Array.isArray(res.clocks) ? res.clocks : []
  const months = clocks.map((c: any) => formatMonth(c.clockIn)) as string[]
  userMonths.value = Array.from(new Set(months)) as string[]
}

const selectMonth = async (month: string) => {
  selectedMonth.value = month
  if (!selectedUser.value) return
  const res = await $authFetch(`/api/clock/history?userId=${selectedUser.value.id}`) as any
  const clocks = Array.isArray(res.clocks) ? res.clocks : []
  selectedMonthClocks.value = clocks.filter((c: any) => formatMonth(c.clockIn) === month)
}

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr)
  return d.toLocaleDateString('ja-JP')
}
const formatTime = (dateStr: string) => {
  const d = new Date(dateStr)
  return d.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })
}
const formatMonth = (dateStr: string) => {
  const d = new Date(dateStr)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

const exportPDF = () => {
  if (!selectedMonthClocks.value.length) return
  const doc = new jsPDF()
  doc.text(`${selectedUser.value?.name || selectedUser.value?.email} ${selectedMonth.value}の打刻一覧`, 10, 10)
  const rows = selectedMonthClocks.value.map((c: any) => [
    formatDate(c.clockIn),
    formatTime(c.clockIn),
    c.clockOut ? formatTime(c.clockOut) : '未退勤',
    c.note || ''
  ])
  ;(doc as any).autoTable({
    head: [['日付', '出勤', '退勤', '備考']],
    body: rows,
    startY: 20,
    styles: { font: 'helvetica', fontSize: 10 },
    headStyles: { fillColor: [41, 128, 185] },
  })
  doc.save(`${selectedUser.value?.name || selectedUser.value?.email}_${selectedMonth.value}_打刻一覧.pdf`)
}

onMounted(() => {
  if (!authStore.isAuthenticated || authStore.user?.email !== 'admin@example.com') {
    router.replace('/login')
    return
  }
  fetchUsers()
})
</script> 