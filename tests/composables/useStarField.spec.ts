import { describe, it, expect, vi } from 'vitest'
import { useStarField } from '../../composables/useStarField'

describe('useStarField', () => {
  it('createStars, updateStars関数が存在する', () => {
    const { createStars, updateStars } = useStarField()
    expect(typeof createStars).toBe('function')
    expect(typeof updateStars).toBe('function')
  })

  it('updateStarsはstars未生成時は何もしない', () => {
    const { updateStars } = useStarField()
    // 例外が発生しないことを確認
    expect(() => updateStars(100, 100)).not.toThrow()
  })

  // createStarsはthree.js依存のため、ここでは型・呼び出しのみテスト
  it('createStarsはPromiseを返す', async () => {
    const { createStars } = useStarField()
    // sceneはモック
    const scene = { add: vi.fn() }
    // three.jsのimportをモック
    vi.stubGlobal('import', vi.fn(async (mod: string) => ({ BufferGeometry: class {}, Float32BufferAttribute: class {}, PointsMaterial: class {}, Points: class {}, Color: class {} })))
    const p = createStars(scene, 10)
    expect(p).toBeInstanceOf(Promise)
  })
}) 