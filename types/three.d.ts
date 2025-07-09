declare module 'three' {
  export class Scene {
    background: any
    add(object: any): void
    clear(): void
  }
  
  export class Texture {
    constructor(image?: HTMLImageElement | HTMLCanvasElement)
    needsUpdate: boolean
  }
  
  export class Color {
    constructor(color?: number)
    r: number
    g: number
    b: number
    setHSL(h: number, s: number, l: number): this
  }
  
  export class PerspectiveCamera {
    constructor(fov: number, aspect: number, near: number, far: number)
    position: any
    aspect: number
    updateProjectionMatrix(): void
  }
  
  export class WebGLRenderer {
    constructor(options?: any)
    setSize(width: number, height: number): void
    setPixelRatio(ratio: number): void
    render(scene: Scene, camera: PerspectiveCamera): void
    dispose(): void
    domElement: HTMLElement
  }
  
  export class Vector3 {
    x: number
    y: number
    z: number
    constructor(x?: number, y?: number, z?: number)
    subVectors(v1: Vector3, v2: Vector3): Vector3
    normalize(): Vector3
    copy(v: Vector3): Vector3
    lerpVectors(v1: Vector3, v2: Vector3, alpha: number): Vector3
  }
  
  export class AmbientLight {
    constructor(color: number, intensity?: number)
  }
  
  export class DirectionalLight {
    constructor(color: number, intensity?: number)
    position: any
  }

  export class BufferGeometry {
    constructor()
    setAttribute(name: string, attribute: any): void
  }

  export class Float32BufferAttribute {
    constructor(array: number[] | ArrayLike<number>, itemSize: number)
  }

  export class PointsMaterial {
    constructor(params?: any)
  }

  export class Points {
    constructor(geometry: BufferGeometry, material: PointsMaterial)
    rotation: { x: number; y: number; z: number }
  }
}

declare module 'three/examples/jsm/loaders/GLTFLoader.js' {
  export class GLTFLoader {
    load(
      url: string,
      onLoad: (gltf: any) => void,
      onProgress?: (progress: any) => void,
      onError?: (error: any) => void
    ): void
  }
} 