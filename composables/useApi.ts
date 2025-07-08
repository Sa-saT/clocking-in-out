import { useAuth } from './useAuth'
import { useAuthStore } from '@/stores/auth'

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: any
  headers?: Record<string, string>
  server?: boolean
  lazy?: boolean
  immediate?: boolean
}

interface FetchOptions extends ApiOptions {
  key?: string
}

/**
 * データフェッチング統一composable
 * 
 * 使い分けルール:
 * 1. useFetch: SSR対応が必要なデータ取得（ページ初期表示）
 * 2. useAsyncData: 複雑なデータ取得ロジック（複数API呼び出し、カスタムキャッシュ）
 * 3. $fetch: イベントハンドラー内での単発API呼び出し
 */
export const useApi = () => {
  const { $authFetch } = useAuth()
  const authStore = useAuthStore()

  /**
   * SSR対応データ取得（ページ初期表示用）
   * キャッシュ、リアクティブ更新、SSR最適化が自動で行われる
   */
  const fetchWithSSR = <T>(url: string | Ref<string> | (() => string), options: FetchOptions = {}) => {
    if (!options.headers) options.headers = {}
    if (authStore.user?.token) {
      options.headers.Authorization = `Bearer ${authStore.user.token}`
    }
    return useFetch<T>(url, {
      method: options.method?.toLowerCase() as any || 'get',
      body: options.body,
      headers: options.headers,
      server: options.server !== false, // デフォルトでSSR有効
      lazy: options.lazy || false,
      immediate: options.immediate !== false, // デフォルトで即座に実行
      ...options
    })
  }

  /**
   * 複雑なデータ取得ロジック用
   * 複数API呼び出し、カスタムキャッシュ、エラーハンドリング
   */
  const fetchAsync = <T>(key: string, fetcher: () => Promise<T>, options: FetchOptions = {}) => {
    return useAsyncData<T>(key, fetcher, {
      server: options.server !== false,
      lazy: options.lazy || false,
      immediate: options.immediate !== false,
      ...options
    })
  }

  /**
   * イベントハンドラー内での単発API呼び出し
   * 認証付きでAPIを呼び出す
   */
  const fetch = async <T>(url: string, options: ApiOptions = {}): Promise<T> => {
    if (!options.headers) options.headers = {}
    if (authStore.user?.token) {
      options.headers.Authorization = `Bearer ${authStore.user.token}`
    }
    return await $authFetch<T>(url, {
      method: options.method || 'GET',
      body: options.body,
      headers: options.headers,
      ...options
    })
  }

  /**
   * 認証不要のAPI呼び出し
   */
  const fetchPublic = async <T>(url: string, options: ApiOptions = {}): Promise<T> => {
    return await $fetch<T>(url, {
      method: options.method || 'GET',
      body: options.body,
      headers: options.headers,
      ...options
    })
  }

  return {
    fetchWithSSR,
    fetchAsync,
    fetch,
    fetchPublic
  }
} 