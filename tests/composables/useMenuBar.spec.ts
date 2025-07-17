import { describe, it, expect } from 'vitest'
import { useMenuBar } from '../../composables/useMenuBar'

describe('useMenuBar', () => {
  it('menuOpenの初期値はfalse', () => {
    const { menuOpen } = useMenuBar()
    expect(menuOpen.value).toBe(false)
  })

  it('toggleMenuでmenuOpenがトグルされる', () => {
    const { menuOpen, toggleMenu } = useMenuBar()
    expect(menuOpen.value).toBe(false)
    toggleMenu()
    expect(menuOpen.value).toBe(true)
    toggleMenu()
    expect(menuOpen.value).toBe(false)
  })
}) 