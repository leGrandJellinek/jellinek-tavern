<script setup lang="ts">
// База знаний — хаб: разделы справочника + (в будущем) статьи.
const categories = [
  { id: 'avatar', icon: 'user' },
  { id: 'weapon', icon: 'sword' },
  { id: 'reliquary', icon: 'flower' },
  { id: 'material', icon: 'cube' },
] as const
</script>

<template>
  <main class="page">
    <header class="page__head">
      <h1 class="page__title">{{ $t('base.title') }}</h1>
      <p class="page__subtitle">{{ $t('base.subtitle') }}</p>
    </header>

    <h2 class="section">{{ $t('base.sectionReference') }}</h2>
    <section class="grid">
      <NuxtLink
        v-for="c in categories"
        :key="c.id"
        :to="`/base/${c.id}`"
        class="rcard"
      >
        <span class="rcard__icon"><AppIcon :name="c.icon" :size="22" /></span>
        <h3 class="rcard__title">{{ $t(`ref.categories.${c.id}`) }}</h3>
        <p class="rcard__text">{{ $t(`ref.categoryText.${c.id}`) }}</p>
      </NuxtLink>
    </section>

    <h2 class="section">{{ $t('base.sectionArticles') }}</h2>
    <div class="empty">
      <AppIcon name="book" :size="30" class="empty__icon" />
      <p>{{ $t('base.articlesSoon') }}</p>
    </div>
  </main>
</template>

<style scoped lang="scss">
.page {
  max-width: 1240px;
  margin: 0 auto;
  padding: 48px 24px;

  &__head {
    margin-bottom: 32px;
  }

  &__title {
    font-size: 2rem;
    font-weight: 800;
  }

  &__subtitle {
    opacity: 0.6;
    margin-top: 4px;
  }
}

.section {
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  opacity: 0.45;
  margin: 28px 0 14px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
  gap: 14px;
}

.rcard {
  display: flex;
  flex-direction: column;
  padding: 22px;
  border-radius: 18px;
  background: #14161d;
  border: 1px solid rgba(255, 255, 255, 0.07);
  color: inherit;
  transition: transform 0.18s, border-color 0.18s, background 0.18s;

  &:hover {
    transform: translateY(-4px);
    border-color: rgba(211, 168, 76, 0.45);
    background: #171a22;
  }

  &__icon {
    display: grid;
    place-items: center;
    width: 46px;
    height: 46px;
    border-radius: 13px;
    margin-bottom: 16px;
    background: rgba(211, 168, 76, 0.12);
    color: #f0cd84;
    transition: background 0.18s;
  }

  &:hover &__icon {
    background: rgba(211, 168, 76, 0.2);
  }

  &__title {
    font-size: 1.15rem;
    margin-bottom: 6px;
  }

  &__text {
    opacity: 0.5;
    font-size: 0.86rem;
    line-height: 1.45;
  }
}

.empty {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 26px;
  border: 1px dashed rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  opacity: 0.5;

  &__icon {
    opacity: 0.6;
  }
}
</style>
