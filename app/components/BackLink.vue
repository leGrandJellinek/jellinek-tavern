<script setup lang="ts">
// Единая кнопка «назад» — прижата к левому краю контента (ближе к меню).
withDefaults(defineProps<{ to: string; label?: string }>(), { label: '' })
</script>

<template>
  <NuxtLink :to="to" class="backlink">
    <AppIcon name="back" :size="16" />
    <span>{{ label || $t('ref.back') }}</span>
  </NuxtLink>
</template>

<style scoped lang="scss">
.backlink {
  position: absolute;
  top: 22px;
  left: 26px;
  z-index: 8;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 7px 12px;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 600;
  color: inherit;
  background: rgba(20, 22, 29, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(6px);
  opacity: 0.75;
  transition: opacity 0.15s, background 0.15s, border-color 0.15s;

  &:hover {
    opacity: 1;
    background: rgba(30, 33, 42, 0.8);
    border-color: rgba(255, 255, 255, 0.16);
  }
}
</style>
