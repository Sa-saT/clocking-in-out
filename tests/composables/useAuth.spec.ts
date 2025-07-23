import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuth } from '../../composables/useAuth'

const mockUser = { id: 1, email: 'test@example.com', token: 'dummy-token', name: 'Test', role: 'user' }
const adminUser = { id: 2, email: 'admin@example.com', token: 'admin-token', name: 'Admin', role: 'admin' }

describe('useAuth', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({ json: () => Promise.resolve(mockUser) })))
    vi.stubGlobal('$fetch', vi.fn(() => Promise.resolve(mockUser)))
    sessionStorage.clear()
  })
  afterEach(() => {
    vi.restoreAllMocks()
    sessionStorage.clear()
  })

  it('login成功時にユーザー情報とトークンがセットされる', async () => {
    const { login, getToken } = useAuth()
    const user = await login('test@example.com', 'password')
    expect(user.email).toBe('test@example.com')
    expect(getToken()).toBe('dummy-token')
  })

  it('login失敗時はユーザー情報がクリアされエラーが投げられる', async () => {
    vi.stubGlobal('$fetch', vi.fn(() => Promise.reject({ data: { message: '認証エラー' } })))
    const { login, getToken } = useAuth()
    await expect(login('fail@example.com', 'wrong')).rejects.toThrow('認証エラー')
    expect(getToken()).toBe('')
  })

  it('logoutでユーザー情報とトークンがクリアされる', async () => {
    vi.stubGlobal('$fetch', vi.fn(() => Promise.resolve(mockUser)))
    const { login, logout, getToken } = useAuth()
    await login('test@example.com', 'password')
    expect(getToken()).toBe('dummy-token')
    vi.stubGlobal('$fetch', vi.fn(() => Promise.resolve({}))) // logout用
    await logout()
    expect(getToken()).toBe('')
  })

  it('fetchUser成功時はユーザー情報がセットされる', async () => {
    vi.stubGlobal('$fetch', vi.fn(() => Promise.resolve(mockUser)))
    const { fetchUser } = useAuth()
    const user = await fetchUser()
    expect(user!.email).toBe('test@example.com')
  })

  it('fetchUser失敗時はユーザー情報がクリアされnullを返す', async () => {
    vi.stubGlobal('$fetch', vi.fn(() => Promise.reject('error')))
    const { fetchUser } = useAuth()
    const user = await fetchUser()
    expect(user === null).toBe(true)
  })

  it('requireAuthは未認証時にエラーを投げる', () => {
    const { requireAuth } = useAuth()
    expect(() => requireAuth()).toThrow()
  })

  it('requireAuthは認証済みならユーザー情報を返す', () => {
    const { login, requireAuth } = useAuth()
    // loginで認証状態にする
    return login('test@example.com', 'password').then(() => {
      expect(requireAuth()).toBeDefined()
    })
  })

  it('requireAdminはadmin@example.comでOK', () => {
    vi.stubGlobal('$fetch', vi.fn(() => Promise.resolve(adminUser)))
    const { login, requireAdmin } = useAuth()
    return login('admin@example.com', 'password').then(() => {
      expect(requireAdmin()).toBeDefined()
    })
  })

  it('requireAdminはadmin以外でエラー', () => {
    const { login, requireAdmin } = useAuth()
    return login('test@example.com', 'password').then(() => {
      expect(() => requireAdmin()).toThrow()
    })
  })

  it('isAuthenticated, isAdminの判定', async () => {
    const { login, isAuthenticated, isAdmin } = useAuth()
    expect(isAuthenticated()).toBe(false)
    expect(isAdmin()).toBe(false)
    vi.stubGlobal('$fetch', vi.fn(() => Promise.resolve(adminUser)))
    await login('admin@example.com', 'password')
    expect(isAuthenticated()).toBe(true)
    expect(isAdmin()).toBe(true)
  })
}) 