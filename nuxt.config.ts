import tailwindcss from '@tailwindcss/vite'
import { defineNuxtConfig } from 'nuxt/config'
import { resolve } from 'path'

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: {
    enabled: true
  },
  runtimeConfig:{
    DATABASE_URL:process.env.DATABASE_URL,
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
    ssr: {
      noExternal: ['@prisma/client'],
    },
  },
  build: {
    transpile: ['@prisma/client'],
  },
  alias: {
    '.prisma/client':
    resolve(__dirname, 'node_modules/@prisma/client'),
  },
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],
});
