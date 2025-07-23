import { vi } from 'vitest'
vi.mock('nuxt/app', () => ({
  defineNuxtRouteMiddleware: (fn: any) => fn,
  useRouter: () => ({}),
}))

import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { describe, it, expect, beforeEach } from 'vitest'
import adminOnly from '../../middleware/admin-only'

const mockNavigateTo = vi.fn(() => '/login')
vi.stubGlobal('navigateTo', mockNavigateTo)

const dummyRoute = { name: '', params: {}, matched: [], fullPath: '', path: '', query: {}, hash: '', redirectedFrom: undefined, meta: {} }

describe('middleware/admin-only', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('管理者であれば何も返さない（通過）', () => {
    const store = useAuthStore()
    store.isAuthenticated = true
    store.user = { id: 1, email: 'admin@example.com' }
    const result = adminOnly(dummyRoute, dummyRoute)
    expect(result).toBeUndefined()
    expect(mockNavigateTo).not.toHaveBeenCalled()
  })

  it('未認証なら/loginにリダイレクト', () => {
    const store = useAuthStore()
    store.isAuthenticated = false
    store.user = null
    const result = adminOnly(dummyRoute, dummyRoute)
    expect(result).toBe('/login')
    expect(mockNavigateTo).toHaveBeenCalledWith('/login')
  })

  it('認証済みでもadmin以外は/loginにリダイレクト', () => {
    const store = useAuthStore()
    store.isAuthenticated = true
    store.user = { id: 2, email: 'user@example.com' }
    const result = adminOnly(dummyRoute, dummyRoute)
    expect(result).toBe('/login')
    expect(mockNavigateTo).toHaveBeenCalledWith('/login')
  })
}) 