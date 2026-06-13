<script setup lang="ts">
const { locale, t } = useI18n()

// i18n локаль → код языка карты HoYoLAB.
const HOYO_LANG: Record<string, string> = { ru: 'ru-ru', en: 'en-us', ja: 'ja-jp' }
const mapUrl = computed(
  () =>
    `https://act.hoyolab.com/ys/app/interactive-map/index.html?lang=${HOYO_LANG[locale.value] ?? 'en-us'}`,
)
</script>

<template>
  <main class="mappage">
    <BackLink to="/base" />

    <a :href="mapUrl" target="_blank" rel="noopener" class="open">
      <AppIcon name="external" :size="16" /> {{ t('map.openNew') }}
    </a>

    <!-- key перезагружает iframe при смене языка -->
    <iframe
      :key="locale"
      :src="mapUrl"
      class="mapframe"
      allowfullscreen
      referrerpolicy="no-referrer"
    />
  </main>
</template>

<style scoped lang="scss">
.mappage {
  position: relative;
  width: 100%;
  height: 100vh;
}

.mapframe {
  position: relative;
  z-index: 1;
  display: block;
  width: 100%;
  height: 100%;
  border: 0;
  background: #0b0c10;
}

.open {
  position: absolute;
  top: 22px;
  right: 22px;
  z-index: 8;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 8px 14px;
  border-radius: 11px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #1a1c24;
  background: linear-gradient(135deg, #ffe9a8, #d3a84c);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.35);

  &:hover {
    filter: brightness(1.05);
  }
}
</style>
