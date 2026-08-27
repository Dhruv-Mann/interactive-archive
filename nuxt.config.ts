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
      title: 'UNMANAGED',
      titleTemplate: '%s',
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ],
      meta: [
        { name: 'description', content: 'UNMANAGED — a collective redefining what a club can be.' }
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
})
