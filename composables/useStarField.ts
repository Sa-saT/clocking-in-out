import { ref } from 'vue'

// 円形テクスチャ生成関数
const createCircleTexture = async () => {
  const size = 64
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  ctx.clearRect(0, 0, size, size)
  ctx.beginPath()
  ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2)
  ctx.closePath()
  ctx.fillStyle = 'white'
  ctx.shadowColor = 'white'
  ctx.shadowBlur = 8
  ctx.fill()
  const { Texture } = await import('three')
  const texture = new Texture(canvas)
  texture.needsUpdate = true
  return texture
}

export const useStarField = () => {
  let stars: any = null

  // 星空生成
  const createStars = async (scene: any, count = 800) => {
    const { BufferGeometry, Float32BufferAttribute, PointsMaterial, Points, Color } = await import('three')
    const geometry = new BufferGeometry()
    const positions: number[] = []
    const colors: number[] = []

    for (let i = 0; i < count; i++) {
      positions.push((Math.random() - 0.5) * 180)
      positions.push((Math.random() - 0.5) * 180)
      positions.push((Math.random() - 0.5) * 180)
      // 白〜淡い黄色の星
      const color = new Color().setHSL(0.1 + 0.1 * Math.random(), 0.7, 0.9)
      colors.push(color.r, color.g, color.b)
    }

    geometry.setAttribute('position', new Float32BufferAttribute(positions, 3))
    geometry.setAttribute('color', new Float32BufferAttribute(colors, 3))

    // 円形テクスチャを生成
    const texture = await createCircleTexture()

    const material = new PointsMaterial({
      size: 0.3,
      vertexColors: true,
      map: texture,
      alphaTest: 0.3,
      transparent: true,
      opacity: 0.5,
      sizeAttenuation: true,
      depthWrite: false,
    })

    stars = new Points(geometry, material)
    scene.add(stars)
  }

  // マウス連動の星の動き（既存のupdateStarsをそのまま）
  const updateStars = (x: number, y: number) => {
    if (!stars) return
    stars.rotation.y = x / window.innerWidth * 0.5
    stars.rotation.x = y / window.innerHeight * 0.5
  }

  return {
    createStars,
    updateStars
  }
} 