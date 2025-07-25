// https://nuxt.com/docs/api/configuration/nuxt-config
// import tailwindcss from "@tailwindcss/vite";
// import { defineNuxtConfig } from 'nuxt/config'
// import { createRequire } from 'module'
// import path from 'path'

// const require = createRequire(import.meta.url)
// const prismaClient = `prisma${path.sep}client`
// let prismaClientIndexBrowser = ''
// try {
//   prismaClientIndexBrowser = require.resolve('@prisma/client/index-browser').replace(`@${prismaClient}`, `.${prismaClient}`)
// } catch (e) {
//   prismaClientIndexBrowser = ''
// }

// export default defineNuxtConfig({
//   compatibilityDate: '2025-05-15',
//   devtools: {
//     enabled: true
//   },
//   runtimeConfig:{
//     DATABASE_URL:process.env.DATABASE_URL,
//   },
//   modules: [
//     '@pinia/nuxt',
//     '@nuxt/fonts',
//     '@nuxt/icon',
//     '@nuxt/image',
//     '@nuxt/test-utils',
//     '@prisma/nuxt',
//     // '@nuxtjs/tailwindcss',
//   ],
//   css: ['../assets/css/main.css'],
//   vite: {
//     plugins: [
//       tailwindcss(),
//     ],
//     build: {
//       rollupOptions: {
//         external: [
//           '@prisma/client',
//         ],
//       },
//     },
//   },
//   build: {
//     transpile: ['@prisma/client'],
//   },
//   components: [
//     {
//       path: '~/components',
//       pathPrefix: false,
//     },
//   ],
// });

import tailwindcss from "@tailwindcss/vite";
import { defineNuxtConfig } from 'nuxt/config'

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
    // '@nuxtjs/tailwindcss',
  ],
  css: ['../assets/css/main.css'],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],
});