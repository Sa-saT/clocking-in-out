import { render, screen, cleanup } from '@testing-library/vue'
import ArrowUpButton from '../../components/icon/ArrowUpButton.vue'
import { describe, it, expect, afterEach } from 'vitest'

afterEach(() => {
  cleanup()
})

describe('ArrowUpButton', () => {
  it('propsで渡したaria-labelがbuttonに反映される', () => {
    render(ArrowUpButton, { props: { ariaLabel: '上へ' } })
    const btn = screen.getByRole('button', { name: '上へ' })
    expect(btn).toBeTruthy()
  })

  it('customClassがclass属性に反映される', () => {
    render(ArrowUpButton, { props: { customClass: 'test-class', ariaLabel: '上へ' } })
    const btn = screen.getByRole('button', { name: '上へ' })
    expect(btn.className).toContain('test-class')
  })

  it('SVGアイコンが描画されている', () => {
    render(ArrowUpButton, { props: { ariaLabel: '上へ' } })
    const btn = screen.getByRole('button', { name: '上へ' })
    expect(btn.querySelector('svg')).not.toBeNull()
  })
}) 