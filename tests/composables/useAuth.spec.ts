import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuth } from '../../composables/useAuth'

// fetchのグローバルモック
const mockUser = { id: 1, email: 'test@example.com', token: 'dummy-token' }

describe('useAuth', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({
      json: () => Promise.resolve(mockUser)
    })))
    vi.stubGlobal('$fetch', vi.fn(() => Promise.resolve(mockUser)))
    sessionStorage.clear()
  })

  it('login成功時にユーザー情報とトークンがセットされる', async () => {
    const { login, getToken } = useAuth()
    const user = await login('test@example.com', 'password')
    expect(user.email).toBe('test@example.com')
    expect(getToken()).toBe('dummy-token')
  })
}) 