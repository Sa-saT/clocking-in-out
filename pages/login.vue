<template>
  <div ref="starContainer" class="three-container star-bg"></div>
  <div v-if="show3DModel" ref="threeContainer" class="three-container"></div>
    
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">
        出退勤管理システム
      </h2>
      <p class="mt-2 text-center text-sm text-gray-800 dark:text-gray-200">
        アカウントにログインしてください
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="login-form-bg py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
        <form class="space-y-6" @submit.prevent="handleLogin" aria-label="ログインフォーム">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              メールアドレス
            </label>
            <div class="mt-1">
              <input
                id="email"
                v-model="email"
                name="email"
                type="email"
                autocomplete="email"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="example@company.com"
                aria-label="メールアドレス"
              />
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              パスワード
            </label>
            <div class="mt-1">
              <input
                id="password"
                v-model="password"
                name="password"
                type="password"
                autocomplete="current-password"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="パスワードを入力"
                aria-label="パスワード"
              />
            </div>
          </div>

          <div v-if="authStore.error" class="rounded-md bg-red-50 dark:bg-red-900 p-4">
            <div class="flex">
              <div class="ml-3">
                <h3 class="text-sm font-medium text-red-800 dark:text-red-200" role="alert" aria-live="assertive">
                  {{ authStore.error }}
                </h3>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              :disabled="authStore.loading"
              class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="ログイン"
            >
              <span v-if="authStore.loading" class="absolute left-0 inset-y-0 flex items-center pl-3">
                <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span class="sr-only">読み込み中</span>
              </span>
              {{ authStore.loading ? 'ログイン中...' : 'ログイン' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  <!-- </div> -->
</template>

<script setup lang="ts">
import { useThreeJS } from '@/composables/useThreeJS'
import { useGLTFLoader } from '@/composables/useGLTFLoader'
import { useAnimation } from '@/composables/useAnimation'
import { useStarField } from '@/composables/useStarField'

const authStore = useAuthStore()
const router = useRouter()

const email = ref('')
const password = ref('')
const show3DModel = ref(false)
const threeContainer = ref<HTMLElement>()

// Three.js関連
const { initScene, animate, dispose } = useThreeJS()
const { loadModel, scaleModel, positionModel } = useGLTFLoader()
const { createFighterAnimation } = useAnimation()
const { createStars, updateStars } = useStarField()

let scene: any = null
let camera: any = null
let renderer: any = null
let model: any = null
let fighterAnimation: any = null
let animationId: number | null = null
let startTime: number = 0

  // 3Dシーン初期化
  const initThreeScene = async () => {
    if (!threeContainer.value) return

    const result = await initScene(threeContainer.value)
    scene = result.scene
    camera = result.camera
    renderer = result.renderer
  
  if (!scene || !camera) return

  try {
    // モデルロード
    model = await loadModel('/TripoStudio3DModel.glb')
    
    // モデルの初期設定
    scaleModel(model, 0.5)
    positionModel(model, 10, 5, -15)
    
    // シーンに追加
    scene.add(model)
    
    // ライティング追加
    const { AmbientLight, DirectionalLight } = await import('three')
    const ambientLight = new AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight)
    
    const directionalLight = new DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(10, 10, 5)
    scene.add(directionalLight)
    
    // アニメーション開始
    startTime = Date.now()
    fighterAnimation = await createFighterAnimation(model)
    
    // アニメーションループ
    animate(() => {
      if (fighterAnimation) {
        const elapsedTime = Date.now() - startTime
        const isComplete = fighterAnimation.animate(elapsedTime)
        
        if (isComplete) {
          // アニメーション完了後、少し待ってからダッシュボードに遷移
          setTimeout(() => {
            router.push('/dashboard')
          }, 1000)
        }
      }
    })
    
  } catch (error) {
    console.error('Failed to load 3D model:', error)
    // エラー時は直接ダッシュボードに遷移
    router.push('/dashboard')
  }
}

// ログイン処理
const handleLogin = async () => {
  if (!email.value || !password.value) {
    return
  }

  try {
    await authStore.login(email.value, password.value)
    // ログイン成功時に3Dモデルを表示
    show3DModel.value = true
    await nextTick()
    await initThreeScene()
  } catch (error) {
    // エラーはstores/auth.tsで処理される
    console.error('ログインエラー:', error)
  }
}

// 星空Three.js用
let starScene: any = null
let starCamera: any = null
let starRenderer: any = null
const starContainer = ref<HTMLElement>()

// 星空Three.js初期化
const initStarField = async () => {
  if (!starContainer.value) return
  const { initScene } = useThreeJS()
  const result = await initScene(starContainer.value)
  starScene = result.scene
  starCamera = result.camera
  starRenderer = result.renderer
  await createStars(starScene, 500)
  // アニメーションループ
  const animateStar = () => {
    if (starScene && starCamera && starRenderer) {
      starRenderer.render(starScene, starCamera)
    }
    requestAnimationFrame(animateStar)
  }
  animateStar()
}

// マウス連動
const onStarMouseMove = (e: MouseEvent) => {
  const x = e.clientX - window.innerWidth / 2
  const y = e.clientY - window.innerHeight / 2
  updateStars(x, y)
}

// 既にログイン済みの場合はダッシュボードにリダイレクト
onMounted(() => {
  if (authStore.isAuthenticated) {
    router.push('/dashboard')
  }
  nextTick(() => {
    initStarField()
    window.addEventListener('mousemove', onStarMouseMove)
  })
})

// コンポーネントアンマウント時のクリーンアップ
onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  dispose()
  window.removeEventListener('mousemove', onStarMouseMove)
})
</script>

<style scoped>
.three-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
}
.star-bg {
  z-index: -1;
}
.three-container:not(.star-bg) {
  z-index: 50;
}
.login-form-bg {
  background: rgba(255,255,255,0.95);
  border: 1px solid #e5e7eb;
  box-shadow: 0 4px 24px 0 rgba(0,0,0,0.10);
}
.dark .login-form-bg {
  background: rgba(30,41,59,0.95);
  border: 1px solid #334155;
  box-shadow: 0 4px 24px 0 rgba(0,0,0,0.30);
}
</style> 