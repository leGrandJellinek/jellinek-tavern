<script setup lang="ts">
import { elementIcon } from '~/composables/useElements'

// Порядок как в интро Genshin.
const ELEMENTS = ['Fire', 'Water', 'Wind', 'Electric', 'Grass', 'Ice', 'Rock'] as const

const visible = ref(true)

onMounted(() => {
  const MIN = 2400
  window.setTimeout(() => {
    visible.value = false
  }, MIN)
})
</script>

<template>
  <Transition name="loader-fade">
    <div v-if="visible" class="loader">
      <div class="loader__elements">
        <span
          v-for="(el, i) in ELEMENTS"
          :key="el"
          class="loader__el"
          :style="{ '--i': i }"
        >
          <img :src="elementIcon(el)!" :alt="el" />
        </span>
      </div>
    </div>
  </Transition>
</template>

<style scoped lang="scss">
.loader {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fcfcfa;

  &__elements {
    display: flex;
    gap: clamp(12px, 3vw, 28px);
  }

  &__el {
    width: clamp(30px, 5vw, 44px);
    height: clamp(30px, 5vw, 44px);

    img {
      width: 100%;
      height: 100%;
      // Монохромные серые символы, как на стартовом экране игры.
      filter: grayscale(1) brightness(0) opacity(0.18);
      // Волна «заполнения»: символы по очереди наливаются тёмно-серым и гаснут.
      animation: el-pulse 1.6s ease-in-out infinite;
      animation-delay: calc(var(--i) * 0.14s);
    }
  }
}

@keyframes el-pulse {
  0%,
  100% {
    filter: grayscale(1) brightness(0) opacity(0.16);
  }
  40% {
    filter: grayscale(1) brightness(0) opacity(0.62);
  }
}

.loader-fade-leave-active {
  transition: opacity 0.5s ease;
}
.loader-fade-leave-to {
  opacity: 0;
}
</style>
