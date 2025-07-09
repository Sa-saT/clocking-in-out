export const useThreeJS = () => {
  let scene: any = null
  let camera: any = null
  let renderer: any = null
  let animationId: number | null = null

  // シーン初期化
  const initScene = async (container: HTMLElement) => {
    // Three.jsを動的にインポート
    const { Scene, Color, PerspectiveCamera, WebGLRenderer } = await import('three')
    
    // シーン作成
    scene = new Scene()
    scene.background = new Color(0x000000)

    // カメラ作成
    const aspect = container.clientWidth / container.clientHeight
    camera = new PerspectiveCamera(75, aspect, 0.1, 1000)
    camera.position.set(0, 0, 5)

    // レンダラー作成
    renderer = new WebGLRenderer({ 
      antialias: true,
      alpha: true 
    })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    container.appendChild(renderer.domElement)

    // リサイズ対応
    const handleResize = () => {
      if (!camera || !renderer) return
      
      const width = container.clientWidth
      const height = container.clientHeight
      
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }

    window.addEventListener('resize', handleResize)

    return { scene, camera, renderer }
  }

  // アニメーションループ
  const animate = (callback?: () => void) => {
    const tick = () => {
      if (callback) callback()
      
      if (scene && camera && renderer) {
        renderer.render(scene, camera)
      }
      
      animationId = requestAnimationFrame(tick)
    }
    
    tick()
  }

  // クリーンアップ
  const dispose = () => {
    if (animationId) {
      cancelAnimationFrame(animationId)
      animationId = null
    }
    
    if (renderer) {
      renderer.dispose()
      renderer = null
    }
    
    if (scene) {
      scene.clear()
      scene = null
    }
    
    camera = null
  }

  return {
    initScene,
    animate,
    dispose,
    scene: computed(() => scene),
    camera: computed(() => camera),
    renderer: computed(() => renderer)
  }
} 