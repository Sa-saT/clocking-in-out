import { useAuthStore } from '@/stores/auth'

interface User {
  id: number
  email: string
  name?: string
  role?: string
  token?: string
}

const TOKEN_KEY = 'jwtToken'

// JWT付きAPIリクエスト用ラッパー
async function $authFetch<T>(url: string, options: any = {}): Promise<T> {
  const token = sessionStorage.getItem(TOKEN_KEY)
  const headers = { ...(options.headers || {}) }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  return await $fetch<T>(url, { ...options, headers })
}

export const useAuth = () => {
  const authStore = useAuthStore()

  // ログインAPI呼び出し
  const login = async (email: string, password: string) => {
    try {
      const user = await $authFetch<User>('/api/auth/login', {
        method: 'POST',
        body: { email, password },
      })
      if (user.token) {
        sessionStorage.setItem(TOKEN_KEY, user.token)
      }
      authStore.setUser(user)
      return user
    } catch (error: any) {
      authStore.setUser(null)
      sessionStorage.removeItem(TOKEN_KEY)
      throw new Error(error?.data?.message || 'ログインに失敗しました')
    }
  }

  // ログアウトAPI呼び出し
  const logout = async () => {
    await $authFetch('/api/auth/logout', { method: 'POST' })
    authStore.setUser(null)
    sessionStorage.removeItem(TOKEN_KEY)
  }

  // ユーザー情報取得API呼び出し
  const fetchUser = async () => {
    try {
      const user = await $authFetch<User>('/api/auth/me')
      authStore.setUser(user)
      return user
    } catch {
      authStore.setUser(null)
      return null
    }
  }

  // JWTトークン取得
  const getToken = () => sessionStorage.getItem(TOKEN_KEY) || ''

  // 認証チェック
  const requireAuth = () => {
    if (!authStore.isAuthenticated) {
      throw createError({ statusCode: 401, message: '認証が必要です' })
    }
    return authStore.user
  }

  // 管理者認可チェック
  const requireAdmin = () => {
    const user = requireAuth()
    // 現状はadmin@example.comで判定、将来的にはroleフィールドで判定
    if (user?.email !== 'admin@example.com') {
      throw createError({ statusCode: 403, message: '管理者権限が必要です' })
    }
    return user
  }

  // 認証状態チェック（エラーを投げない）
  const isAuthenticated = () => authStore.isAuthenticated
  const isAdmin = () => authStore.user?.email === 'admin@example.com'

  return {
    login,
    logout,
    fetchUser,
    getToken,
    $authFetch,
    requireAuth,
    requireAdmin,
    isAuthenticated,
    isAdmin
  }
} 