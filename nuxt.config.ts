// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/google-fonts',
  ],
  css: [
    '~/assets/css/main.css'
  ],
  components: [
    { path: '~/components' },
  ],
  app: {
    head: {
      title: 'NEXUS',
      titleTemplate: '%s',
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ],
      meta: [
        { name: 'description', content: 'NEXUS — A high-performance Nuxt 4 creative template.' }
      ]
    }
  },
  googleFonts: {
    families: {
      'Sora': [400, 500, 600, 700],
      'Inter': [400, 500, 600],
      'JetBrains+Mono': [400],
    },
    display: 'swap',
  },
  vite: {
    // Pre-bundle three.js so Vite doesn't crawl and re-bundle it on every dev start.
    // On prod this also ensures it lands in a single, consistently-named chunk.
    optimizeDeps: {
      include: ['three'],
    },
    build: {
      // Warn when any chunk exceeds 500KB so large deps stay visible.
      chunkSizeWarningLimit: 500,
    },
  },
})

