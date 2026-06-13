<script setup lang="ts">
// Монохромные line-иконки (stroke currentColor). Один источник на весь апп.
defineProps<{ name: keyof typeof PATHS; size?: number | string }>()

const PATHS = {
  home: '<path d="M3 10.5 12 3l9 7.5M5 9.5V21h14V9.5"/>',
  book: '<path d="M5 4h11a2 2 0 0 1 2 2v15H7a2 2 0 0 1-2-2V4Z"/><path d="M18 6h1a2 2 0 0 1 2 2v13"/><path d="M9 8h5M9 12h5"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.2-3.2"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  compass: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3c2.5 2.5 3.8 5.7 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.7-3.8-9S9.5 5.5 12 3Z"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7"/>',
  chevron: '<path d="m6 9 6 6 6-6"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-6 8-6s8 2 8 6"/>',
  sword: '<path d="M14.5 4H20v5.5L9.5 20 4 14.5 14.5 4Z"/><path d="m13 11-2 2"/><path d="m4 14.5 5.5 5.5"/>',
  flower: '<circle cx="12" cy="12" r="2.5"/><path d="M12 9.5C12 6 10.5 3 12 3s-0 3.5 0 6.5M12 14.5c0 3.5 1.5 6.5 0 6.5s0-3.5 0-6.5M9.5 12C6 12 3 13.5 3 12s3.5 0 6.5 0M14.5 12c3.5 0 6.5-1.5 6.5 0s-3.5 0-6.5 0"/>',
  cube: '<path d="M12 2 3 7v10l9 5 9-5V7l-9-5Z"/><path d="m3 7 9 5 9-5M12 12v10"/>',
  back: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
  map: '<path d="m9 4-6 2.5v14L9 18l6 2.5 6-2.5v-14L15 6.5 9 4Z"/><path d="M9 4v14M15 6.5v14"/>',
  external: '<path d="M14 4h6v6"/><path d="M20 4 11 13"/><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
} as const
</script>

<template>
  <svg
    class="icon"
    :width="size ?? 20"
    :height="size ?? 20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.8"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    v-html="PATHS[name]"
  />
</template>

<style scoped>
.icon {
  display: block;
  flex-shrink: 0;
}
</style>
