<template>
  <!-- Стартовый загрузочный экран в стиле Genshin -->
  <SiteLoader />

  <!-- Лейаут (сайдбар) оборачивает текущую страницу -->
  <NuxtRouteAnnouncer />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
