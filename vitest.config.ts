import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

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
      '@': '.',
      '#imports': './tests/__mocks__/nuxt-imports-mock.ts',
      '~': '.',
      '~~': '.',
      '@@': '.',
      '@@/': './',
    },
  },
  define: {
    'process.env.NODE_ENV': '"test"',
  },
  optimizeDeps: {
    include: ['vue', 'pinia'],
  },
}) 