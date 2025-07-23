/// <reference types="vitest" />
import { render, fireEvent } from '@testing-library/vue'
import Drawer from '../../components/Drawer.vue'
import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Nuxt3 auto-importのuseRouter等をテスト用にモック
vi.mock('#imports', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), go: vi.fn() })
}))

beforeEach(() => {
  setActivePinia(createPinia())
})

describe('Drawer.vue', () => {
  it('ハンバーガーボタンが表示される', () => {
    const { getAllByRole } = render(Drawer)
    const buttons = getAllByRole('button')
    expect(buttons.length).toBeGreaterThan(0)
  })

  it('ハンバーガーボタン押下でDrawerが開閉する', async () => {
    const { getAllByRole, getAllByText, container } = render(Drawer)
    const buttons = getAllByRole('button')
    await fireEvent.click(buttons[0])
    // "ユーザーを選択してください"が複数ヒットする場合は最初の要素で判定
    const texts = getAllByText('ユーザーを選択してください')
    expect(texts.length).toBeGreaterThan(0)
    await fireEvent.click(buttons[0])
    // Drawerが閉じる（asideのclassで判定）
    const aside = container.querySelector('aside')
    expect(aside?.className).toContain('-translate-x-full')
  })
}) 