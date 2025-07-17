import { describe, it, expect, vi } from 'vitest'
import { useThreeJS } from '../../composables/useThreeJS'

describe('useThreeJS', () => {
  it('initScene, animate, dispose, scene/camera/rendererが存在', () => {
    const three = useThreeJS()
    expect(typeof three.initScene).toBe('function')
    expect(typeof three.animate).toBe('function')
    expect(typeof three.dispose).toBe('function')
    expect(three.scene).toBeDefined()
    expect(three.camera).toBeDefined()
    expect(three.renderer).toBeDefined()
  })

  it('scene/camera/rendererの初期値はnull', () => {
    const three = useThreeJS()
    expect(three.scene.value).toBeNull()
    expect(three.camera.value).toBeNull()
    expect(three.renderer.value).toBeNull()
  })

  it('initSceneはPromiseを返す', async () => {
    const three = useThreeJS()
    // three.jsのimportをモック
    vi.stubGlobal('import', vi.fn(async (mod: string) => ({ Scene: class { background = null; clear() {} }, Color: class {}, PerspectiveCamera: class { position = { set: vi.fn() }; aspect = 1; updateProjectionMatrix = vi.fn() }, WebGLRenderer: class { setSize = vi.fn(); setPixelRatio = vi.fn(); dispose = vi.fn(); domElement = document.createElement('div') } })))
    const container = document.createElement('div')
    const p = three.initScene(container)
    expect(p).toBeInstanceOf(Promise)
  })
}) 