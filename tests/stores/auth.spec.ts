import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '../../stores/auth'

describe('auth store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    sessionStorage.clear()
  })

  it('初期状態は未認証', () => {
    const store = useAuthStore()
    expect(store.isAuthenticated).toBe(false)
    expect(store.user).toBeNull()
  })

  it('setUserで認証状態とユーザー情報が更新される', () => {
    const store = useAuthStore()
    const user = { id: 1, email: 'test@example.com' }
    store.setUser(user)
    expect(store.isAuthenticated).toBe(true)
    expect(store.user).toEqual(user)
  })

  it('setUser(null)で未認証状態になる', () => {
    const store = useAuthStore()
    store.setUser(null)
    expect(store.isAuthenticated).toBe(false)
    expect(store.user).toBeNull()
  })
}) 