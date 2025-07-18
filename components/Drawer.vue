<template>
      <main class="max-w-7xl mx-auto py-6 sm:px-2 lg:px-8">
        <div class="px-2 py-4 sm:px-0">

      <button @click="toggleDrawer" class="p-2 hover:bg-gray-500/70 focus:outline-none">
          <span class="relative block w-8 h-8">
            <!-- ハンバーガー -->
            <svg
              class="absolute inset-0 w-8 h-8 transition-all duration-300"
              :class="menuOpen ? 'opacity-0 scale-90 rotate-45' : 'opacity-100 scale-100 rotate-0'"
              fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 15h16" />
            </svg>
            <!-- X -->
            <svg
              class="absolute inset-0 w-8 h-8 transition-all duration-300"
              :class="menuOpen ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-90 -rotate-45'"
              fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </span>
      </button>
          <!-- オーバーレイ（Header/Footerを避ける） -->
          <div
            v-if="menuOpen"
            class="fixed left-0 right-0 z-30 bg-zinc-700/90 bg-opacity-50 transition-opacity duration-300"
            :class="[
              'md:top-16 md:bottom-16', // PC: Header/Footer分だけ避ける
              'top-12 bottom-12 md:top-16 md:bottom-16' // モバイル: Header/Footer高さに応じて調整
            ]"
            @click.self="toggleDrawer"
          ></div>
          <!-- Drawer本体（Header/Footerを避ける） -->
          <aside
            class="fixed z-40 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-500 overflow-y-auto"
            :class="[
              // 上下位置
              'left-0',
              'md:top-16 md:bottom-16', // PC: Header/Footer分だけ避ける
              'top-12 bottom-12 md:top-16 md:bottom-16', // モバイル: Header/Footer高さに応じて調整
              // 幅
              'w-full md:w-80',
              // スライドアニメーション
              menuOpen ? 'translate-x-0' : '-translate-x-full'
            ]"
            @click.stop
            >
              <!-- Drawer内容 -->
              <div class="p-4">
                <h2 class="text-lg font-bold mb-4 dark:text-gray-100">{{ selectedUser ? (selectedUser.name || selectedUser.email) + ' の打刻履歴' : 'ユーザーを選択してください' }}</h2>
                <ul>
                  <li v-for="user in users" :key="user.id" class="mb-2">
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
                <div v-if="selectedMonthClocks.length" class="mt-4">
                  <div class="flex items-center mb-2">
                    <span class="font-semibold text-gray-700 dark:text-gray-200">{{ selectedMonth }}の打刻一覧</span>
                    <button @click="exportPDF" class="ml-2 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs">PDFエクスポート</button>
                  </div>
                  <div class="overflow-x-auto">
                    <table class="min-w-full text-xs text-white divide-y divide-gray-200 dark:divide-gray-700">
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
              </div>
          </aside>
          </div>
      </main>
</template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useAuth } from '../composables/useAuth'

  import { useAuthStore } from '../stores/auth'
  import { useRouter } from '#imports'
  // --- メニューバー・ヘッダー関連 ---
  
  const authStore = useAuthStore()
  const router = useRouter()
  const { $authFetch } = useAuth()

  const isOpen = ref(false)
  
  interface User {
    id: number
    email: string
    name?: string
  }
  
  const users = ref<User[]>([])
  const pending = ref(false)
  const error = ref('')
  const selectedUser = ref<User|null>(null)
  const userMonths = ref<string[]>([])
  const selectedMonth = ref('')
  const selectedMonthClocks = ref<any[]>([])
  const menuOpen = ref(false)

  // ユーザー一覧を取得（管理者のみ）
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
  
  // ユーザー選択時に、そのユーザーの打刻履歴から月リストを取得
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
  
  // 月選択時に、その月の打刻履歴のみを抽出
  const selectMonth = async (month: string) => {
    selectedMonth.value = month
    if (!selectedUser.value) return
    const res = await $authFetch(`/api/clock/history?userId=${selectedUser.value.id}`) as any
    const clocks = Array.isArray(res.clocks) ? res.clocks : []
    selectedMonthClocks.value = clocks.filter((c: any) => formatMonth(c.clockIn) === month)
  }
  
  // 日付を「YYYY/MM/DD」形式で表示
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString('ja-JP')
  }
  // 時刻を「HH:mm」形式で表示
  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })
  }
  // 日付から「YYYY-MM」形式の月文字列を生成
  const formatMonth = (dateStr: string) => {
    const d = new Date(dateStr)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
  }
  
  const toggleDrawer = () => {
    if (menuOpen.value) {
    // 閉じるときだけリセット
    selectedUser.value = null
    selectedMonth.value = ''
    selectedMonthClocks.value = []
  }
  menuOpen.value = !menuOpen.value
}

  // 備考欄の日本語を英語表記やOtherに変換（PDF用）
  const translateNote = (str: string | undefined) => {
    if (!str) return ''
    if (str.includes('打刻漏れ')) return 'Missed'
    if (str.includes('遅刻')) return 'Lateness'
    if (str.includes('早退')) return 'Leave Early'
    if (str.includes('外出')) return 'Out'
    if (str.includes('休憩')) return 'Break'
    // その他の日本語（全角ひらがな・カタカナ・漢字）は "Other"
    if (/[\u3040-\u30FF\u4E00-\u9FFF]/.test(str)) return 'Other'
    return str
  }
  // ユーザー名・メールアドレスをASCII文字列に変換（PDF用）
  const toAsciiName = (str: string | undefined) => {
    if (!str) return ''
    // 日本語が含まれる場合は空文字
    if (/[\u3040-\u30FF\u4E00-\u9FFF]/.test(str)) return ''
    return str
  }
  
  // PDFエクスポート処理（英語表記のみ）
  const exportPDF = async () => {
    try {
      if (!selectedMonthClocks.value.length) return
      const jsPDF = (await import('jspdf')).default
      const autoTable = (await import('jspdf-autotable')).default
      // Title (English only)
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(14)
      doc.text(`${toAsciiName(selectedUser.value?.name) || toAsciiName(selectedUser.value?.email)} ${selectedMonth.value} Attendance List`, 10, 15)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(10)
      // Table data (English only)
      const rows = selectedMonthClocks.value.map((c: any) => [
        formatDate(c.clockIn),
        formatTime(c.clockIn),
        c.clockOut ? formatTime(c.clockOut) : 'N/A',
        translateNote(c.note)
      ])
      autoTable(doc, {
        head: [['Date', 'Clock In', 'Clock Out', 'Note']],
        body: rows,
        startY: 22,
        styles: { font: 'helvetica', fontSize: 10 },
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
        bodyStyles: { textColor: 20 },
        margin: { left: 10, right: 10 },
        tableWidth: 'auto',
      })
      doc.save(`${toAsciiName(selectedUser.value?.name) || toAsciiName(selectedUser.value?.email)}_${selectedMonth.value}_attendance.pdf`)
    } catch (e: any) {
      alert('Error occurred during PDF export: ' + (e?.message || e))
    }
  }
  
  // ページマウント時に認証・権限チェック＆ユーザー一覧取得
  onMounted(() => {
    fetchUsers()
  })
  
  // definePageMeta({
  //   middleware: 'admin-only'
  // })

</script>