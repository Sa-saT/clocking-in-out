import { render, screen, cleanup } from '@testing-library/vue'
import ArrowDownButton from '../../components/icon/ArrowDownButton.vue'
import { describe, it, expect, afterEach } from 'vitest'

afterEach(() => {
  cleanup()
})

describe('ArrowDownButton', () => {
  it('propsで渡したaria-labelがbuttonに反映される', () => {
    render(ArrowDownButton, { props: { ariaLabel: '下へ' } })
    const btn = screen.getByRole('button', { name: '下へ' })
    expect(btn).toBeTruthy()
  })

  it('customClassがclass属性に反映される', () => {
    render(ArrowDownButton, { props: { customClass: 'test-class', ariaLabel: '下へ' } })
    const btn = screen.getByRole('button', { name: '下へ' })
    expect(btn.className).toContain('test-class')
  })

  it('SVGアイコンが描画されている', () => {
    render(ArrowDownButton, { props: { ariaLabel: '下へ' } })
    const btn = screen.getByRole('button', { name: '下へ' })
    expect(btn.querySelector('svg')).not.toBeNull()
  })
}) 