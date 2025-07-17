import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

vi.mock('@/stores/auth', () => ({
  useAuthStore: () => ({ user: { token: 'test-token' } })
}))
vi.mock('../../composables/useAuth', () => ({
  useAuth: () => ({ $authFetch: vi.fn(async (url, opts) => ({ url, ...opts, headers: opts.headers })) })
}))

import { useApi } from '../../composables/useApi'

describe('useApi', () => {
  let mockUseFetch: any
  let mockUseAsyncData: any
  let mock$fetch: any

  beforeEach(() => {
    setActivePinia(createPinia())
    mockUseFetch = vi.fn((url, opts) => ({ data: { value: 'fetched' }, url, opts: { ...opts, headers: opts.headers } }))
    mockUseAsyncData = vi.fn((key, fetcher, opts) => ({ data: { value: 'async' }, key, opts }))
    mock$fetch = vi.fn(async (url, opts) => ({ url, ...opts, headers: opts.headers }))
    vi.stubGlobal('useFetch', mockUseFetch)
    vi.stubGlobal('useAsyncData', mockUseAsyncData)
    vi.stubGlobal('$fetch', mock$fetch)
  })

  it('fetchWithSSR: 認証ヘッダーが付与される', () => {
    const { fetchWithSSR } = useApi()
    const res = fetchWithSSR('/api/test')
    expect(res.url).toBe('/api/test')
    expect(res.opts.headers.Authorization).toBe('Bearer test-token')
  })

  it('fetch: $authFetchが呼ばれ、認証ヘッダーが付与される', async () => {
    const { fetch } = useApi()
    const res = await fetch('/api/test', { method: 'POST', body: { foo: 'bar' } }) as any
    expect(res.url).toBe('/api/test')
    expect(res.method).toBe('POST')
    expect(res.body).toEqual({ foo: 'bar' })
    expect(res.headers.Authorization).toBe('Bearer test-token')
  })

  it('fetchPublic: $fetchが呼ばれる', async () => {
    const { fetchPublic } = useApi()
    const res = await fetchPublic('/api/public', { method: 'GET' }) as any
    expect(res.url).toBe('/api/public')
    expect(res.method).toBe('GET')
  })

  it('fetchAsync: useAsyncDataが呼ばれる', () => {
    const { fetchAsync } = useApi()
    const res = fetchAsync('key', async () => 'data')
    expect(res.key).toBe('key')
    expect(res.data.value).toBe('async')
  })
}) 