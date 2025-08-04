export const useRouter = () => ({
  push: () => {},
  replace: () => {},
  go: () => {},
})

export const useRoute = () => ({
  path: '/',
  query: {},
  params: {},
})

export const navigateTo = () => Promise.resolve()

export const createError = (options: any) => new Error(options.message || 'Error')

export const useRuntimeConfig = () => ({
  public: {},
  app: {},
})

export const useHead = () => {}
export const useSeoMeta = () => {}
export const useColorMode = () => ({
  value: 'light',
  preference: 'light',
  set: () => {},
})

export const $fetch = async (url: string, options?: any) => ({ url, ...options })

export const useFetch = (url: string, options?: any) => ({
  data: { value: null },
  pending: { value: false },
  error: { value: null },
  refresh: () => {},
  execute: () => {},
})

export const useAsyncData = (key: string, fetcher?: any, options?: any) => ({
  data: { value: null },
  pending: { value: false },
  error: { value: null },
  refresh: () => {},
  execute: () => {},
}) 