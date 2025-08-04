import { vi } from 'vitest'

// Nuxtのauto-import関数をグローバルにモック
globalThis.useRouter = vi.fn(() => ({
  push: vi.fn(),
  replace: vi.fn(),
  go: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  currentRoute: { value: { path: '/', query: {}, params: {} } },
}))

globalThis.useRoute = vi.fn(() => ({
  path: '/',
  query: {},
  params: {},
}))

globalThis.navigateTo = vi.fn(() => Promise.resolve())

globalThis.createError = vi.fn((options: any) => new Error(options.message || 'Error'))

globalThis.useRuntimeConfig = vi.fn(() => ({
  public: {},
  app: {},
}))

globalThis.useHead = vi.fn()
globalThis.useSeoMeta = vi.fn()
globalThis.useColorMode = vi.fn(() => ({
  value: 'light',
  preference: 'light',
  set: vi.fn(),
}))

globalThis.$fetch = vi.fn(async (url: string, options?: any) => ({ url, ...options }))

globalThis.useFetch = vi.fn((url: string, options?: any) => ({
  data: { value: null },
  pending: { value: false },
  error: { value: null },
  refresh: vi.fn(),
  execute: vi.fn(),
}))

globalThis.useAsyncData = vi.fn((key: string, fetcher?: any, options?: any) => ({
  data: { value: null },
  pending: { value: false },
  error: { value: null },
  refresh: vi.fn(),
  execute: vi.fn(),
}))

globalThis.definePageMeta = vi.fn() 