<script setup lang="ts">
// Главная — атмосферный лендинг в стиле Genshin.
const features = [
  { to: '/base', icon: 'book', title: 'home.features.baseTitle', text: 'home.features.baseText' },
  { to: '/player', icon: 'search', title: 'home.features.playerTitle', text: 'home.features.playerText' },
] as const

// Псевдослучайные, но стабильные параметры для каждой искры.
function sparkStyle(n: number) {
  const rnd = (seed: number) => {
    const x = Math.sin(seed * 99.7) * 10000
    return x - Math.floor(x)
  }
  return {
    left: `${rnd(n) * 100}%`,
    bottom: `${-10 - rnd(n + 5) * 20}%`,
    '--size': `${3 + rnd(n + 1) * 4}px`,
    '--dur': `${10 + rnd(n + 2) * 12}s`,
    '--delay': `${-rnd(n + 3) * 20}s`,
    '--drift': `${(rnd(n + 4) - 0.5) * 120}px`,
  }
}
</script>

<template>
  <main class="home">
    <!-- Атмосферный фон: элементальное видео + затемнение -->
    <video class="home__bg" autoplay muted loop playsinline>
      <source src="/videos/bg/bg_pyro.webm" type="video/webm" />
    </video>
    <div class="home__veil" />

    <!-- Плавающие искры — эмбиент-атмосфера -->
    <div class="sparks">
      <span v-for="n in 18" :key="n" class="sparks__dot" :style="sparkStyle(n)" />
    </div>

    <div class="home__inner">
      <section class="hero">
        <span class="hero__badge">JT</span>
        <h1 class="hero__title">Jellinek Tavern</h1>
        <div class="hero__rule"><span /></div>
        <p class="hero__subtitle">{{ $t('home.subtitle') }}</p>
      </section>

      <section class="cards">
        <NuxtLink v-for="f in features" :key="f.to" :to="f.to" class="fcard">
          <div class="fcard__glow" />
          <div class="fcard__emblem">
            <span class="fcard__ring" />
            <AppIcon :name="f.icon" :size="30" />
          </div>
          <h3 class="fcard__title">{{ $t(f.title) }}</h3>
          <p class="fcard__text">{{ $t(f.text) }}</p>
          <span class="fcard__cta">
            <AppIcon name="arrow" :size="18" />
          </span>
        </NuxtLink>
      </section>
    </div>
  </main>
</template>

<style scoped lang="scss">
$gold: #e7c87a;

.home {
  position: relative;
  min-height: 100vh;
  overflow: hidden;

  &__bg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 0;
    filter: saturate(1.1);
  }

  &__veil {
    position: absolute;
    inset: 0;
    z-index: 1;
    background:
      radial-gradient(100% 70% at 50% -5%, rgba(211, 168, 76, 0.12), transparent 55%),
      radial-gradient(120% 85% at 50% 0%, rgba(15, 16, 21, 0.42), rgba(15, 16, 21, 0.86) 72%),
      linear-gradient(180deg, rgba(15, 16, 21, 0.5), #0f1015 94%);
  }

  &__inner {
    position: relative;
    z-index: 2;
    max-width: 980px;
    margin: 0 auto;
    padding: 90px 24px 64px;
  }
}

.sparks {
  position: absolute;
  inset: 0;
  z-index: 1;
  overflow: hidden;
  pointer-events: none;

  &__dot {
    position: absolute;
    width: var(--size);
    height: var(--size);
    border-radius: 50%;
    background: radial-gradient(circle, #ffe9a8, rgba(231, 200, 122, 0.2) 60%, transparent 70%);
    box-shadow: 0 0 8px rgba(231, 200, 122, 0.6);
    opacity: 0;
    animation: spark-rise var(--dur) linear var(--delay) infinite;
  }
}

@keyframes spark-rise {
  0% {
    transform: translate(0, 0);
    opacity: 0;
  }
  10% {
    opacity: 0.9;
  }
  90% {
    opacity: 0.7;
  }
  100% {
    transform: translate(var(--drift), -108vh);
    opacity: 0;
  }
}

.hero {
  text-align: center;
  margin-bottom: 44px;

  &__badge {
    display: inline-grid;
    place-items: center;
    width: 68px;
    height: 68px;
    margin-bottom: 22px;
    border-radius: 18px;
    font-size: 1.5rem;
    font-weight: 800;
    color: #2a2008;
    background: linear-gradient(135deg, #ffe9a8, #d3a84c);
    box-shadow: 0 10px 30px rgba(211, 168, 76, 0.4), inset 0 0 0 1px rgba(255, 255, 255, 0.4);
  }

  &__title {
    font-size: 3.1rem;
    font-weight: 800;
    letter-spacing: 0.02em;
    background: linear-gradient(180deg, #fff, #e7c87a);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    text-shadow: 0 4px 30px rgba(231, 200, 122, 0.25);
  }

  // Декоративная золотая линия с ромбом — «геншиновский» разделитель.
  &__rule {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin: 16px 0 18px;

    span {
      width: 9px;
      height: 9px;
      transform: rotate(45deg);
      background: $gold;
      box-shadow: 0 0 10px rgba(231, 200, 122, 0.6);
    }

    &::before,
    &::after {
      content: '';
      width: 90px;
      height: 1px;
      background: linear-gradient(90deg, transparent, $gold);
    }

    &::after {
      background: linear-gradient(90deg, $gold, transparent);
    }
  }

  &__subtitle {
    opacity: 0.75;
    font-size: 1.08rem;
    line-height: 1.6;
    max-width: 520px;
    margin: 0 auto;
  }
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 18px;
}

.fcard {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 34px 26px 30px;
  border-radius: 20px;
  color: inherit;
  background:
    linear-gradient(180deg, rgba(231, 200, 122, 0.05), transparent 40%),
    rgba(24, 26, 33, 0.6);
  border: 1px solid rgba(231, 200, 122, 0.16);
  backdrop-filter: blur(14px);
  box-shadow: 0 14px 40px rgba(0, 0, 0, 0.4);
  overflow: hidden;
  transition: transform 0.2s ease, border-color 0.2s;

  &__glow {
    position: absolute;
    top: -60px;
    left: 50%;
    transform: translateX(-50%);
    width: 200px;
    height: 200px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(231, 200, 122, 0.2), transparent 70%);
    opacity: 0.5;
    pointer-events: none;
    transition: opacity 0.25s;
  }

  &:hover {
    transform: translateY(-6px);
    border-color: rgba(231, 200, 122, 0.55);
  }

  &:hover &__glow {
    opacity: 1;
  }

  // Круглая эмблема с вращающимся золотым кольцом.
  &__emblem {
    position: relative;
    display: grid;
    place-items: center;
    width: 76px;
    height: 76px;
    margin-bottom: 18px;
    border-radius: 50%;
    color: #2a2008;
    background: radial-gradient(circle at 35% 30%, #ffe9a8, #d3a84c);
    box-shadow: 0 8px 24px rgba(211, 168, 76, 0.4), inset 0 0 0 1px rgba(255, 255, 255, 0.35);
  }

  &__ring {
    position: absolute;
    inset: -7px;
    border-radius: 50%;
    border: 1px dashed rgba(231, 200, 122, 0.5);
    transition: transform 0.6s ease;
  }

  &:hover &__ring {
    transform: rotate(140deg);
  }

  &__title {
    position: relative;
    font-size: 1.3rem;
    font-weight: 800;
    padding-bottom: 12px;
    margin-bottom: 12px;

    // Декоративный золотой ромб-разделитель.
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      width: 7px;
      height: 7px;
      transform: translateX(-50%) rotate(45deg);
      background: $gold;
      box-shadow: 0 0 8px rgba(231, 200, 122, 0.6);
    }
  }

  &__text {
    opacity: 0.6;
    font-size: 0.92rem;
    line-height: 1.5;
    max-width: 280px;
  }

  &__cta {
    display: grid;
    place-items: center;
    width: 38px;
    height: 38px;
    margin-top: 20px;
    border-radius: 50%;
    color: $gold;
    border: 1px solid rgba(231, 200, 122, 0.3);
    transition: background 0.2s, transform 0.2s, color 0.2s;
  }

  &:hover &__cta {
    background: $gold;
    color: #1a1c24;
    transform: translateX(2px);
  }
}
</style>
