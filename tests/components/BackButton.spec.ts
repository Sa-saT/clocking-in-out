import { render, screen } from '@testing-library/vue'
import BackButton from '../../components/icon/BackButton.vue'
import { describe, it, expect } from 'vitest'

describe('BackButton', () => {
  it('propsで渡したaria-labelがbuttonに反映される', () => {
    render(BackButton, { props: { ariaLabel: '戻る' } })
    const btn = screen.getByRole('button', { name: '戻る' })
    expect(btn).toBeTruthy()
  })

  it('customClassがclass属性に反映される', () => {
    render(BackButton, { props: { customClass: 'test-class' } })
    const btn = screen.getByRole('button')
    expect(btn.className).toContain('test-class')
  })

  it('SVGアイコンが描画されている', () => {
    render(BackButton)
    expect(screen.getByRole('button').querySelector('svg')).not.toBeNull()
  })
}) 