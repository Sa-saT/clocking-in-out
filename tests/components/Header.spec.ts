/// <reference types="vitest" />
import { render, fireEvent } from '@testing-library/vue'
import Header from '../../components/Header.vue'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { nextTick } from 'vue'

const mockLogout = vi.fn()
const mockPush = vi.fn()

vi.mock('../../stores/auth', () => ({
  useAuthStore: () => ({ logout: mockLogout })
}))
vi.mock('#imports', () => ({
  useRouter: () => ({ push: mockPush, replace: vi.fn(), go: vi.fn() })
}))

beforeEach(() => {
  setActivePinia(createPinia())
  mockLogout.mockClear()
  mockPush.mockClear()
})

describe('Header.vue', () => {
  it('title, userInfoが表示される', () => {
    const { getByText } = render(Header, { 
      props: { show: true, title: 'テストタイトル', userInfo: 'admin@example.com', showMenu: false },
      global: { stubs: { Drawer: true } }
    })
    expect(getByText('テストタイトル')).toBeTruthy()
    expect(getByText('admin@example.com')).toBeTruthy()
  })

  it('show=falseでheaderが非表示', () => {
    const { container } = render(Header, { 
      props: { show: false, showMenu: false, title: '', userInfo: '' },
      global: { stubs: { Drawer: true } }
    })
    expect(container.querySelector('header')).toBeNull()
  })

  it('ログアウトボタン押下でauthStore.logoutとrouter.pushが呼ばれる', async () => {
    const { getAllByText } = render(Header, { props: { show: true, showMenu: false, title: '', userInfo: '' }, global: { stubs: { Drawer: true } } })
    const buttons = getAllByText('Log Out')
    await fireEvent.click(buttons[0])
    await nextTick()
    expect(mockLogout).toHaveBeenCalled()
    expect(mockPush).toHaveBeenCalledWith('/login')
  })
}) 