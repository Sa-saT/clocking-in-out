import { describe, it, expect, afterEach } from 'vitest'
import { render, cleanup } from '@testing-library/vue'
import Footer from '../../components/Footer.vue'

afterEach(() => {
  cleanup()
})

describe('Footer.vue', () => {
  it('著作権表記が表示される', () => {
    const { getByText } = render(Footer)
    expect(getByText('© 2024 出退勤管理アプリ')).toBeTruthy()
  })

  it('role="contentinfo"が付与されている', () => {
    const { getAllByRole } = render(Footer)
    const footers = getAllByRole('contentinfo')
    expect(footers).toHaveLength(1)
  })
}) 