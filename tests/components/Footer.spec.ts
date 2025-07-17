/// <reference types="vitest" />
import { render } from '@testing-library/vue'
import Footer from '../../components/Footer.vue'

describe('Footer.vue', () => {
  it('著作権表記が表示される', () => {
    const { getByText } = render(Footer)
    getByText('© 2024 出退勤管理アプリ')
  })

  it('role="contentinfo"が付与されている', () => {
    const { getByRole } = render(Footer)
    expect(getByRole('contentinfo')).toBeTruthy()
  })
}) 