import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '.')

export default defineConfig({
  plugins: [vue()] as any,
  test: {
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      }
    },
    setupFiles: ['./tests/setup.ts'],
  },
  resolve: {
    alias: {
      '@': root,
      '#imports': path.resolve(root, 'tests/__mocks__/nuxt-imports-mock.ts'),
      '~': root,
      '~~': root,
      '@@': root,
      '@@/': root + '/',
    },
  },
  define: {
    'process.env.NODE_ENV': '"test"',
  },
  optimizeDeps: {
    include: ['vue', 'pinia'],
  },
}) 