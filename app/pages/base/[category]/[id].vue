<script setup lang="ts">
import { elementColor, elementIcon, rarityColor } from '~/composables/useElements'
import { amberImg, cleanText } from '~/composables/useAsset'

const route = useRoute()
const { locale, t } = useI18n()

const category = computed(() => String(route.params.category))
const id = computed(() => String(route.params.id))

const { data, pending, error } = await useFetch<{ category: string; data: any }>(
  () => `/api/ref/${category.value}/${id.value}`,
  { query: { lang: locale }, watch: [locale] },
)

const d = computed(() => data.value?.data ?? null)
const accent = computed(() => elementColor(d.value?.element))

// Таланты/созвездия как отсортированные массивы.
const talents = computed(() =>
  d.value?.talent ? Object.values(d.value.talent as Record<string, any>) : [],
)
const constellations = computed(() =>
  d.value?.constellation ? Object.values(d.value.constellation as Record<string, any>) : [],
)
// Аффикс оружия (берём первый).
const weaponAffix = computed(() => {
  const a = d.value?.affix
  return a ? Object.values(a as Record<string, any>)[0] : null
})
</script>

<template>
  <main class="page" :style="{ '--accent': accent }">
    <NuxtLink :to="`/base/${category}`" class="back">
      <AppIcon name="back" :size="16" /> {{ t(`ref.categories.${category}`) }}
    </NuxtLink>

    <p v-if="pending" class="state">{{ t('ref.loading') }}</p>
    <p v-else-if="error || !d" class="state">{{ t('ref.empty') }}</p>

    <template v-else>
      <!-- Шапка -->
      <header class="head" :style="{ '--rar': rarityColor(d.rank) }">
        <div class="head__icon">
          <img v-if="d.icon" :src="amberImg(d.icon)!" :alt="d.name" />
        </div>
        <div class="head__info">
          <h1 class="head__name">{{ d.name }}</h1>
          <div v-if="d.rank" class="head__stars">{{ '★'.repeat(d.rank) }}</div>
          <div class="head__tags">
            <span v-if="d.element" class="tag tag--el">
              <img :src="elementIcon(d.element)!" :alt="d.element" class="tag__el" />{{ t(`elements.${d.element}`) }}
            </span>
            <span v-if="d.region" class="tag">{{ d.region }}</span>
            <span v-if="d.fetter?.native" class="tag">{{ d.fetter.native }}</span>
          </div>
        </div>
      </header>

      <!-- Персонаж: описание, озвучка -->
      <section v-if="d.fetter" class="block">
        <h2 class="block__title">{{ t('ref.char.story') }}</h2>
        <p v-if="d.fetter.title" class="subtitle">{{ d.fetter.title }}</p>
        <p class="story">{{ d.fetter.detail }}</p>
        <div v-if="d.fetter.cv" class="cv">
          <span v-for="(name, key) in d.fetter.cv" :key="key" class="cv__item">
            <b>{{ key }}:</b> {{ name }}
          </span>
        </div>
      </section>

      <!-- Таланты -->
      <section v-if="talents.length" class="block">
        <h2 class="block__title">{{ t('ref.char.talents') }}</h2>
        <div class="talents">
          <article v-for="tl in talents" :key="tl.skillId" class="talent">
            <img v-if="tl.icon" :src="amberImg(tl.icon)!" :alt="tl.name" class="talent__icon" />
            <div>
              <h3 class="talent__name">{{ tl.name }}</h3>
              <p class="talent__desc">{{ cleanText(tl.description) }}</p>
            </div>
          </article>
        </div>
      </section>

      <!-- Созвездия -->
      <section v-if="constellations.length" class="block">
        <h2 class="block__title">{{ t('ref.char.constellations') }}</h2>
        <div class="consts">
          <article v-for="(c, i) in constellations" :key="i" class="const">
            <img v-if="c.icon" :src="amberImg(c.icon)!" :alt="c.name" class="const__icon" />
            <div>
              <h3 class="const__name">C{{ i + 1 }} · {{ c.name }}</h3>
              <p class="const__desc">{{ cleanText(c.description) }}</p>
            </div>
          </article>
        </div>
      </section>

      <!-- Оружие: пассивка -->
      <section v-if="weaponAffix" class="block">
        <h2 class="block__title">{{ t('ref.weapon.effect') }}</h2>
        <h3 class="subtitle">{{ weaponAffix.name }}</h3>
        <p class="story">{{ cleanText(Object.values(weaponAffix.upgrade ?? {})[0] as string) }}</p>
      </section>

      <!-- Артефакты/материалы: описание -->
      <section v-if="!d.fetter && !weaponAffix && d.description" class="block">
        <h2 class="block__title">{{ t('ref.char.story') }}</h2>
        <p class="story">{{ cleanText(d.description) }}</p>
      </section>
    </template>
  </main>
</template>

<style scoped lang="scss">
.page {
  max-width: 900px;
  margin: 0 auto;
  padding: 32px 24px 64px;
}

.back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  opacity: 0.6;
  margin-bottom: 20px;

  &:hover {
    opacity: 1;
  }
}

.state {
  margin-top: 60px;
  text-align: center;
  opacity: 0.5;
}

.head {
  display: flex;
  gap: 20px;
  align-items: center;
  margin-bottom: 30px;

  &__icon {
    width: 104px;
    height: 104px;
    flex-shrink: 0;
    border-radius: 18px;
    overflow: hidden;
    background:
      radial-gradient(circle at 50% 25%, color-mix(in srgb, var(--rar) 55%, transparent), #0f1015 78%);
    border: 1px solid color-mix(in srgb, var(--rar) 55%, transparent);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__name {
    font-size: 2rem;
    font-weight: 800;
  }

  &__stars {
    color: var(--rar);
    letter-spacing: 1px;
    margin: 2px 0 8px;
  }

  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 7px;
  }
}

.tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 4px 11px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.12);

  &--el {
    color: var(--accent);
  }

  &__el {
    width: 16px;
    height: 16px;
  }
}

.block {
  margin-bottom: 30px;

  &__title {
    font-size: 0.82rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    opacity: 0.45;
    margin-bottom: 12px;
  }
}

.subtitle {
  color: var(--accent);
  font-weight: 600;
  margin-bottom: 8px;
}

.story {
  opacity: 0.85;
  line-height: 1.6;
  white-space: pre-line;
}

.cv {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-top: 12px;
  font-size: 0.85rem;
  opacity: 0.7;

  &__item b {
    opacity: 0.8;
  }
}

.talents,
.consts {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.talent,
.const {
  display: flex;
  gap: 14px;
  padding: 14px 16px;
  border-radius: 14px;
  background: #14161d;
  border: 1px solid rgba(255, 255, 255, 0.07);

  &__icon {
    width: 46px;
    height: 46px;
    flex-shrink: 0;
    padding: 6px;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.05);
  }

  &__name {
    font-size: 1.05rem;
    margin-bottom: 6px;
  }

  &__desc {
    opacity: 0.7;
    line-height: 1.55;
    font-size: 0.9rem;
    white-space: pre-line;
  }
}
</style>
