import { defineConfig } from 'vitest/config'
import path from 'path'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  test: {
    environment: 'happy-dom',
    globals: true,
    include: [
      'composables/**/*.spec.ts',
      'stores/**/*.spec.ts',
      'components/**/*.spec.{ts,js,tsx,jsx}',
      'server/api/**/*.spec.ts',
      'tests/**/*.spec.ts'
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      reportsDirectory: './coverage'
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.')
    }
  },
  plugins: [vue()]
}) 