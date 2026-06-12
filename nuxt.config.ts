// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // Pinia — стейт-менеджер; i18n — локализация (ru/en/ja)
  modules: ['@pinia/nuxt', '@nuxtjs/i18n'],

  i18n: {
    strategy: 'no_prefix', // без префиксов в URL, язык хранится в cookie
    defaultLocale: 'ru',
    locales: [
      { code: 'ru', name: 'Русский', file: 'ru.json' },
      { code: 'en', name: 'English', file: 'en.json' },
      { code: 'ja', name: '日本語', file: 'ja.json' },
    ],
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_locale',
      redirectOn: 'root',
    },
  },

  // Глобальные стили. '~' указывает на папку app/ (srcDir в Nuxt 4)
  css: ['~/assets/sass/main.scss'],

  app: {
    head: {
      title: 'Jellinek Tavern',
      htmlAttrs: { lang: 'ru' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Просмотрщик аккаунтов Genshin Impact' },
      ],
    },
  },
})
