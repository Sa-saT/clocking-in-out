import { defineStore } from 'pinia'

interface User {
  id: number
  email: string
  name?: string
  role?: string
  token?: string
}

const SESSION_KEY = 'authUser'

function saveUserToSession(user: User | null) {
  if (user) {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(user))
  } else {
    sessionStorage.removeItem(SESSION_KEY)
  }
}

function loadUserFromSession(): User | null {
  const data = sessionStorage.getItem(SESSION_KEY)
  if (!data) return null
  try {
    return JSON.parse(data) as User
  } catch {
    return null
  }
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    isAuthenticated: false as boolean,
    loading: false as boolean,
    error: null as string | null,
  }),
  actions: {
    async login(email: string, password: string) {
      this.loading = true
      this.error = null
      try {
        const { login } = useAuth()
        const user = await login(email, password)
        this.user = user
        this.isAuthenticated = true
        saveUserToSession(user)
      } catch (e: any) {
        this.error = e.message || 'ログインに失敗しました'
        this.user = null
        this.isAuthenticated = false
        saveUserToSession(null)
      } finally {
        this.loading = false
      }
    },
    async logout() {
      this.user = null
      this.isAuthenticated = false
      saveUserToSession(null)
    },
    setUser(user: User | null) {
      this.user = user
      this.isAuthenticated = !!user
      saveUserToSession(user)
    },
    restoreUserFromSession() {
      const user = loadUserFromSession()
      this.user = user
      this.isAuthenticated = !!user
    },
  },
})

// ストア初期化時にSessionStorageから復元
// if (typeof window !== 'undefined') {
//   const store = useAuthStore()
//   store.restoreUserFromSession()
// } 