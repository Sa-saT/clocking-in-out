/// <reference types="vitest" />
import { render, fireEvent } from '@testing-library/vue'
import Header from '../../components/Header.vue'
import { vi } from 'vitest'

describe('Header.vue', () => {
  const mockLogout = vi.fn()
  const mockPush = vi.fn()
  beforeEach(() => {
    vi.stubGlobal('useAuthStore', () => ({ logout: mockLogout }))
    vi.stubGlobal('useRouter', () => ({ push: mockPush }))
  })

  it('title, userInfoが表示される', () => {
    const { getByText } = render(Header, {
      props: { title: 'テストタイトル', userInfo: 'admin@example.com' }
    })
    getByText('テストタイトル')
    getByText('admin@example.com')
  })

  it('show=falseでheaderが非表示', () => {
    const { queryByRole } = render(Header, { props: { show: false } })
    expect(queryByRole('banner')).toBeNull()
  })

  it('ログアウトボタン押下でauthStore.logoutとrouter.pushが呼ばれる', async () => {
    const { getByText } = render(Header)
    const btn = getByText('Log Out')
    await fireEvent.click(btn)
    expect(mockLogout).toHaveBeenCalled()
    expect(mockPush).toHaveBeenCalledWith('/login')
  })
}) 