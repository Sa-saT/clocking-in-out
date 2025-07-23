import { render, screen, cleanup } from '@testing-library/vue'
import BackButton from '../../components/icon/BackButton.vue'
import { describe, it, expect, afterEach } from 'vitest'

afterEach(() => {
  cleanup()
})

describe('BackButton', () => {
  it('propsで渡したaria-labelがbuttonに反映される', () => {
    render(BackButton, { props: { ariaLabel: '戻る' } })
    const btn = screen.getByRole('button', { name: '戻る' })
    expect(btn).toBeTruthy()
  })

  it('customClassがclass属性に反映される', () => {
    render(BackButton, { props: { customClass: 'test-class', ariaLabel: '戻る' } })
    const btn = screen.getByRole('button', { name: '戻る' })
    expect(btn.className).toContain('test-class')
  })

  it('SVGアイコンが描画されている', () => {
    render(BackButton, { props: { ariaLabel: '戻る' } })
    const btn = screen.getByRole('button', { name: '戻る' })
    expect(btn.querySelector('svg')).not.toBeNull()
  })
}) 