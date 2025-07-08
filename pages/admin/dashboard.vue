<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <header class="bg-white dark:bg-gray-800 shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between h-16 items-center">
        <h1 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
          管理者ダッシュボード
        </h1>
        <span class="text-sm text-gray-700 dark:text-gray-200">{{ authStore.user?.name || authStore.user?.email }}（管理者）</span>
      </div>
    </header>
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
          <h2 class="text-lg font-bold mb-2 dark:text-gray-100">
            管理メニュー
          </h2>
          <ul class="list-disc ml-6 text-gray-700 dark:text-gray-200">
            <li>ユーザー一覧・編集（今後実装）</li>
            <li>打刻履歴の修正・削除（今後実装）</li>
          </ul>
        </div>
        <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
          <h2 class="text-lg font-bold mb-2 dark:text-gray-100">
            ユーザー一覧
          </h2>
          <template v-if="pending">
            <p class="text-gray-500 dark:text-gray-300">読み込み中...</p>
          </template>
          <template v-else-if="error">
            <p class="text-red-500" role="alert" aria-live="assertive">ユーザー一覧の取得に失敗しました</p>
          </template>
          <template v-else-if="users.length">
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700" aria-label="ユーザー一覧">
                <thead>
                  <tr>
                    <th scope="col" class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider" tabindex="0" aria-label="ID">ID</th>
                    <th scope="col" class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider" tabindex="0" aria-label="メールアドレス">メールアドレス</th>
                    <th scope="col" class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider" tabindex="0" aria-label="名前">名前</th>
                    <th scope="col" class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider" tabindex="0" aria-label="操作">操作</th>
                  </tr>
                </thead>
                <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-800">
                  <tr v-for="user in users" :key="user.id" class="hover:bg-indigo-50 dark:hover:bg-indigo-900 focus-within:bg-indigo-100 dark:focus-within:bg-indigo-800 transition-colors">
                    <td class="px-4 py-2 whitespace-nowrap">{{ user.id }}</td>
                    <td class="px-4 py-2 whitespace-nowrap">
                      <template v-if="editingId === user.id">
                        <input v-model="editEmail" class="border rounded px-2 py-1 w-48 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500" :disabled="editPending" aria-label="メールアドレス編集" />
                      </template>
                      <template v-else>
                        {{ user.email }}
                      </template>
                    </td>
                    <td class="px-4 py-2 whitespace-nowrap">
                      <template v-if="editingId === user.id">
                        <input v-model="editName" class="border rounded px-2 py-1 w-32 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500" :disabled="editPending" aria-label="名前編集" />
                      </template>
                      <template v-else>
                        {{ user.name || '-' }}
                      </template>
                    </td>
                    <td class="px-4 py-2 whitespace-nowrap">
                      <template v-if="editingId === user.id">
                        <button class="bg-blue-500 text-white px-2 py-1 rounded mr-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400" @click="saveEdit(user)" :disabled="editPending" aria-label="保存">
                          <span class="sr-only">保存</span>保存
                        </button>
                        <button class="bg-gray-300 text-gray-700 px-2 py-1 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400" @click="cancelEdit" :disabled="editPending" aria-label="キャンセル">
                          <span class="sr-only">キャンセル</span>キャンセル
                        </button>
                      </template>
                      <template v-else>
                        <button class="bg-blue-500 text-white px-2 py-1 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400" @click="startEdit(user)" aria-label="編集">
                          <span class="sr-only">編集</span>編集
                        </button>
                      </template>
                    </td>
                  </tr>
                  <tr v-if="editingId && editError">
                    <td colspan="4" class="text-red-500 px-4 py-2" role="alert" aria-live="assertive" tabindex="0">{{ editError }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </template>
          <template v-else>
            <p class="text-gray-500 dark:text-gray-300">ユーザーが存在しません</p>
          </template>
        </div>
        <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 class="text-lg font-bold mb-2 dark:text-gray-100">
            お知らせ
          </h2>
          <p class="text-gray-600 dark:text-gray-300">
            管理者専用機能の開発を順次進めます。
          </p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'
import type { Ref } from 'vue'

const authStore = useAuthStore()
const router = useRouter()
const { $authFetch } = useAuth()

interface User {
  id: number
  email: string
  name?: string
}

const users: Ref<User[]> = ref([])
const pending = ref(false)
const error = ref('')
const editingId = ref<number|null>(null)
const editName = ref('')
const editEmail = ref('')
const editError = ref('')
const editPending = ref(false)

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

const startEdit = (user: User) => {
  editingId.value = user.id
  editName.value = user.name || ''
  editEmail.value = user.email
  editError.value = ''
}

const cancelEdit = () => {
  editingId.value = null
  editName.value = ''
  editEmail.value = ''
  editError.value = ''
}

const saveEdit = async (user: User) => {
  editPending.value = true
  editError.value = ''
  // バリデーション
  if (!editName.value || editName.value.length > 50) {
    editError.value = '名前は必須・50文字以内です'
    editPending.value = false
    return
  }
  if (!editEmail.value || !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/.test(editEmail.value) || editEmail.value.length > 100) {
    editError.value = 'メールアドレス形式が不正です'
    editPending.value = false
    return
  }
  try {
    const res = await $authFetch(`/api/admin/users/${user.id}`, {
      method: 'PATCH',
      body: { name: editName.value, email: editEmail.value },
    }) as any
    // 即時反映
    const idx = users.value.findIndex(u => u.id === user.id)
    if (idx !== -1) users.value[idx] = res.user
    cancelEdit()
  } catch (e: any) {
    editError.value = e?.data?.message || '更新に失敗しました'
  } finally {
    editPending.value = false
  }
}

onMounted(() => {
  // 管理者認可ガード（今後role拡張時はuser.role === 'admin'に切替）
  if (!authStore.isAuthenticated || authStore.user?.email !== 'admin@example.com') {
    router.replace('/login')
    return
  }
  fetchUsers()
})
</script> 