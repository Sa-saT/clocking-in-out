import tailwindcss from '@tailwindcss/vite'
import { defineNuxtConfig } from 'nuxt/config'
import { resolve } from 'path'

const prismaPath = resolve(__dirname, 'node_modules/@prisma/client')

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: {
    enabled: true
  },
  runtimeConfig:{
    DATABASE_URL:process.env.DATABASE_URL,
    DIRECT_URL:process.env.DIRECT_URL,
  },
  modules: [
    '@pinia/nuxt',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/test-utils',
    '@prisma/nuxt',
  ],
  css: ['../assets/css/main.css'],
  vite: {
    plugins: [
      tailwindcss(),
    ],
    // resolve: {
    //   preserveSymlinks: false, // Symlink解決を安定化
    // },
    // ssr: {
    //   noExternal: ['@prisma/client'],
    // },
    // build: {
    //   sourcemap: true, // ソースマップを有効にする
    // },
  },
  build: {
    transpile: ['@prisma/client'],
  },
  alias: {
    '@prisma/client': prismaPath
  },
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],
});
