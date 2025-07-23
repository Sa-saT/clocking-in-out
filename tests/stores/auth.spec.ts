import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '../../stores/auth'

const mockUser = { id: 1, email: 'test@example.com', token: 'dummy-token' }

describe('auth store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    sessionStorage.clear()
    vi.resetAllMocks()
  })
  afterEach(() => {
    vi.restoreAllMocks()
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

  it('login成功時にuser, isAuthenticated, sessionStorageが更新', async () => {
    vi.stubGlobal('useAuth', () => ({
      login: vi.fn(() => Promise.resolve(mockUser))
    }))
    const store = useAuthStore()
    await store.login('test@example.com', 'pass')
    expect(store.isAuthenticated).toBe(true)
    expect(store.user).toEqual(mockUser)
    expect(JSON.parse(sessionStorage.getItem('authUser')!)).toEqual(mockUser)
  })

  it('login失敗時はuser, isAuthenticated, sessionStorageがクリア', async () => {
    vi.stubGlobal('useAuth', () => ({
      login: vi.fn(() => Promise.reject(new Error('fail')))
    }))
    const store = useAuthStore()
    await store.login('fail@example.com', 'wrong')
    expect(store.isAuthenticated).toBe(false)
    expect(store.user).toBeNull()
    expect(sessionStorage.getItem('authUser')).toBeNull()
    expect(store.error).toBe('fail')
  })

  it('logoutでuser, isAuthenticated, sessionStorageがクリア', async () => {
    const store = useAuthStore()
    store.setUser(mockUser)
    await store.logout()
    expect(store.isAuthenticated).toBe(false)
    expect(store.user).toBeNull()
    expect(sessionStorage.getItem('authUser')).toBeNull()
  })

  it('restoreUserFromSessionでセッションから復元', () => {
    sessionStorage.setItem('authUser', JSON.stringify(mockUser))
    const store = useAuthStore()
    store.restoreUserFromSession()
    expect(store.isAuthenticated).toBe(true)
    expect(store.user).toEqual(mockUser)
  })
}) 