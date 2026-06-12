// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // Pinia — официальный стейт-менеджер для Nuxt (модуль авто-регистрирует stores)
  modules: ['@pinia/nuxt'],

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
