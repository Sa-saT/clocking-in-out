import tailwindcss from '@tailwindcss/vite'
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: {
    enabled: true
  },
  // 開発サーバーの設定
  devServer: {
    port: 3000,
    host: 'localhost'
  },
  runtimeConfig:{
    // Supabase設定
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseKey: process.env.SUPABASE_ANON_KEY,
    // JWT設定
    jwtSecret: process.env.JWT_SECRET || 'dev_secret_key'
  },
  modules: [
    '@pinia/nuxt',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/test-utils',
  ],
  css: ['../assets/css/main.css'],
  vite: {
    plugins: [
      tailwindcss(),
    ],
    build: {
      sourcemap: true,
    },
    define: {
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    },
  },
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],
});
