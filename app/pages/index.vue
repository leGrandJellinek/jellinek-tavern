<script setup lang="ts">
// Главная — атмосферный лендинг в стиле Genshin.
const features = [
  { to: '/base', icon: 'book', title: 'home.features.baseTitle', text: 'home.features.baseText' },
  { to: '/player', icon: 'search', title: 'home.features.playerTitle', text: 'home.features.playerText' },
] as const
</script>

<template>
  <main class="home">
    <!-- Атмосферный фон: элементальное видео + затемнение -->
    <video class="home__bg" autoplay muted loop playsinline>
      <source src="/videos/bg/bg_pyro.webm" type="video/webm" />
    </video>
    <div class="home__veil" />

    <div class="home__inner">
      <section class="hero">
        <span class="hero__badge">JT</span>
        <h1 class="hero__title">Jellinek Tavern</h1>
        <div class="hero__rule"><span /></div>
        <p class="hero__subtitle">{{ $t('home.subtitle') }}</p>
      </section>

      <section class="cards">
        <NuxtLink v-for="f in features" :key="f.to" :to="f.to" class="fcard">
          <span class="fcard__icon"><AppIcon :name="f.icon" :size="26" /></span>
          <div class="fcard__body">
            <h3 class="fcard__title">{{ $t(f.title) }}</h3>
            <p class="fcard__text">{{ $t(f.text) }}</p>
          </div>
          <AppIcon name="arrow" class="fcard__arrow" :size="20" />
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
      radial-gradient(110% 80% at 50% 0%, rgba(15, 16, 21, 0.55), rgba(15, 16, 21, 0.9) 70%),
      linear-gradient(180deg, rgba(15, 16, 21, 0.6), #0f1015 92%);
  }

  &__inner {
    position: relative;
    z-index: 2;
    max-width: 980px;
    margin: 0 auto;
    padding: 90px 24px 64px;
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
  grid-template-columns: repeat(auto-fit, minmax(330px, 1fr));
  gap: 16px;
}

.fcard {
  position: relative;
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 22px;
  border-radius: 18px;
  color: inherit;
  background: rgba(26, 28, 36, 0.55);
  border: 1px solid rgba(231, 200, 122, 0.18);
  backdrop-filter: blur(14px);
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.35);
  overflow: hidden;
  transition: transform 0.18s ease, border-color 0.18s, background 0.18s;

  // Лёгкий золотой блик в углу.
  &::after {
    content: '';
    position: absolute;
    top: -40px;
    right: -40px;
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(231, 200, 122, 0.16), transparent 70%);
    pointer-events: none;
  }

  &:hover {
    transform: translateY(-5px);
    border-color: rgba(231, 200, 122, 0.5);
    background: rgba(32, 34, 44, 0.7);
  }

  &__icon {
    display: grid;
    place-items: center;
    width: 54px;
    height: 54px;
    flex-shrink: 0;
    border-radius: 14px;
    color: #2a2008;
    background: linear-gradient(135deg, #ffe9a8, #d3a84c);
    box-shadow: 0 6px 18px rgba(211, 168, 76, 0.35);
  }

  &__title {
    font-size: 1.2rem;
    margin-bottom: 4px;
  }

  &__text {
    opacity: 0.6;
    font-size: 0.9rem;
    line-height: 1.45;
  }

  &__arrow {
    flex-shrink: 0;
    margin-left: auto;
    color: $gold;
    opacity: 0.5;
    transition: transform 0.18s, opacity 0.18s;
  }

  &:hover &__arrow {
    opacity: 1;
    transform: translateX(4px);
  }
}
</style>
