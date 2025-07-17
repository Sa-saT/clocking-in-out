import { render, screen } from '@testing-library/vue'
import ArrowUpButton from '../../components/icon/ArrowUpButton.vue'
import { describe, it, expect } from 'vitest'

describe('ArrowUpButton', () => {
  it('propsで渡したaria-labelがbuttonに反映される', () => {
    render(ArrowUpButton, { props: { ariaLabel: '上へ' } })
    const btn = screen.getByRole('button', { name: '上へ' })
    expect(btn).toBeTruthy()
  })

  it('customClassがclass属性に反映される', () => {
    render(ArrowUpButton, { props: { customClass: 'test-class' } })
    const btn = screen.getByRole('button')
    expect(btn.className).toContain('test-class')
  })

  it('SVGアイコンが描画されている', () => {
    render(ArrowUpButton)
    expect(screen.getByRole('button').querySelector('svg')).not.toBeNull()
  })
}) 