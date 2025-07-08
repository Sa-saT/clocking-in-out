// アプリ全体で統一されたエラー処理を提供
import { ref } from 'vue'

interface ErrorState {
  message: string
  code?: number
}

export function useAppError() {
  const error = ref<ErrorState | null>(null)
  const isLoading = ref(false)

  function setError(message: string, code?: number) {
    error.value = { message, code }
  }

  function clearError() {
    error.value = null
  }

  return {
    error,
    isLoading,
    setError,
    clearError,
  }
} 