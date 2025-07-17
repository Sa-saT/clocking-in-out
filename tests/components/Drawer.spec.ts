/// <reference types="vitest" />
import { render, fireEvent } from '@testing-library/vue'
import Drawer from '../../components/Drawer.vue'
import { vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

describe('Drawer.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.stubGlobal('useAuthStore', () => ({ logout: vi.fn() }))
    vi.stubGlobal('useRouter', () => ({ push: vi.fn() }))
    vi.stubGlobal('useAuth', () => ({ $authFetch: vi.fn(async (url) => {
      if (url === '/api/admin/users') return { users: [{ id: 1, name: '管理者', email: 'admin@example.com' }] }
      if (url.startsWith('/api/clock/history')) return { clocks: [{ id: 1, clockIn: '2024-07-01T09:00:00Z', clockOut: '2024-07-01T18:00:00Z', note: '' }] }
      return {}
    }) }))
  })

  it('ハンバーガーボタンが表示される', () => {
    const { getByRole } = render(Drawer)
    // role=buttonの最初の要素がハンバーガー
    expect(getByRole('button')).toBeTruthy()
  })

  it('ハンバーガーボタン押下でDrawerが開閉する', async () => {
    const { getByRole, queryByText, container } = render(Drawer)
    const btn = getByRole('button')
    await fireEvent.click(btn)
    // ユーザー選択テキストが表示される（開いた状態）
    expect(queryByText('ユーザーを選択してください')).toBeTruthy()
    await fireEvent.click(btn)
    // Drawerが閉じる（asideのclassで判定）
    const aside = container.querySelector('aside')
    expect(aside?.className).toContain('-translate-x-full')
  })
}) 