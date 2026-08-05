import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  devtools: { enabled: false },
  ssr: true,
  debug: false,
  css: ['~/assets/css/index.sass'],
  components: {
    dirs: ['~/components/global', '~/components/pages']
  },
  experimental: {
    payloadExtraction: false,
    inlineSSRStyles: false,
    viewTransition: true
  },
  modules: ['@pinia/nuxt', '@nuxt/image'],
  image: {
    quality: 80,
    format: ['webp', 'avif', 'png', 'jpg'],
    densities: [1, 2]
  },
  vite: {
    build: {
      // o pacote @edusites/icons usa top-level await; precisa de target moderno
      target: 'esnext'
    }
  },
  nitro: {
    compressPublicAssets: true,
    minify: true,
    esbuild: {
      options: {
        target: 'esnext'
      }
    },
    storage: {
      memory: {
        driver: 'memory'
      }
    }
  },
  build: {
    optimization: {
      splitChunks: {
        layouts: true,
        pages: true,
        commons: true
      }
    }
  },
  compatibilityDate: '2025-04-03'
})
