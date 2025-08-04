declare global {
  function useRouter(): {
    push: (to: string) => void
    replace: (to: string) => void
    go: (delta: number) => void
    back: () => void
    forward: () => void
    currentRoute: { value: { path: string; query: any; params: any } }
  }

  function useRoute(): {
    path: string
    query: any
    params: any
  }

  function navigateTo(to: string): Promise<void>

  function createError(options: { message?: string; statusCode?: number }): Error

  function useRuntimeConfig(): {
    public: any
    app: any
  }

  function useHead(): void
  function useSeoMeta(): void
  function useColorMode(): {
    value: string
    preference: string
    set: (mode: string) => void
  }

  function $fetch<T>(url: string, options?: any): Promise<T>

  function useFetch<T>(url: string, options?: any): {
    data: { value: T | null }
    pending: { value: boolean }
    error: { value: any }
    refresh: () => void
    execute: () => void
  }

  function useAsyncData<T>(key: string, fetcher?: () => Promise<T>, options?: any): {
    data: { value: T | null }
    pending: { value: boolean }
    error: { value: any }
    refresh: () => void
    execute: () => void
  }

  function definePageMeta(meta: any): void
}

export {} 