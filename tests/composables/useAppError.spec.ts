import { describe, it, expect } from 'vitest'
import { useAppError } from '../../composables/useAppError'

describe('useAppError', () => {
  it('初期状態はerror=null, isLoading=false', () => {
    const { error, isLoading } = useAppError()
    expect(error.value).toBeNull()
    expect(isLoading.value).toBe(false)
  })

  it('setErrorでエラー内容がセットされる', () => {
    const { error, setError } = useAppError()
    setError('エラー発生', 400)
    expect(error.value).toEqual({ message: 'エラー発生', code: 400 })
  })

  it('clearErrorでerrorがnullに戻る', () => {
    const { error, setError, clearError } = useAppError()
    setError('エラー発生', 400)
    clearError()
    expect(error.value).toBeNull()
  })
}) 