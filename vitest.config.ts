import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
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
    }
  },
  resolve: {
    alias: {
      '@': '/Users/sasata/Documents/work_space/clocking-in-out_APP',
      '#imports': '/tests/__mocks__/nuxt-imports-mock.ts',
    },
  },
}) 