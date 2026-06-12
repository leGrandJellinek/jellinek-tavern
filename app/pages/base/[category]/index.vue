<script setup lang="ts">
import { elementColor, elementIcon, rarityColor } from '~/composables/useElements'

const route = useRoute()
const { locale, t } = useI18n()

const VALID = ['avatar', 'weapon', 'reliquary', 'material']
const category = computed(() => String(route.params.category))
if (!VALID.includes(category.value)) {
  throw createError({ statusCode: 404, statusMessage: 'Not found', fatal: true })
}

interface RefItem {
  id: number
  name: string
  rank: number
  icon: string | null
  element: string | null
  weaponType: string | null
}
interface RefList {
  category: string
  types: Record<string, string>
  items: RefItem[]
}

// Данные раздела (SSR + рефетч при смене языка/раздела).
const { data, pending } = await useFetch<RefList>(
  () => `/api/ref/${category.value}`,
  { query: { lang: locale }, watch: [locale, category] },
)

const query = ref('')
const rarity = ref<number | null>(null)
const element = ref<string | null>(null)

// Сброс фильтров при смене раздела.
watch(category, () => {
  query.value = ''
  rarity.value = null
  element.value = null
})

const rarities = computed(() => {
  const set = new Set<number>()
  data.value?.items.forEach((i) => i.rank && set.add(i.rank))
  return [...set].sort((a, b) => b - a)
})

const elements = computed(() => {
  if (category.value !== 'avatar') return []
  const set = new Set<string>()
  data.value?.items.forEach((i) => i.element && set.add(i.element))
  return [...set]
})

const filtered = computed(() => {
  let list = data.value?.items ?? []
  const q = query.value.trim().toLowerCase()
  if (q) list = list.filter((i) => i.name.toLowerCase().includes(q))
  if (rarity.value) list = list.filter((i) => i.rank === rarity.value)
  if (element.value) list = list.filter((i) => i.element === element.value)
  return list
})
</script>

<template>
  <main class="page">
    <NuxtLink to="/base" class="back">
      <AppIcon name="back" :size="16" /> {{ t('ref.back') }}
    </NuxtLink>

    <header class="page__head">
      <h1 class="page__title">{{ t(`ref.categories.${category}`) }}</h1>
      <span class="page__count">{{ t('ref.count', { n: filtered.length }) }}</span>
    </header>

    <div class="toolbar">
      <div class="searchbox">
        <AppIcon name="search" :size="18" class="searchbox__icon" />
        <input v-model="query" class="searchbox__input" type="search" :placeholder="t('ref.search')" />
      </div>

      <div v-if="rarities.length" class="chips">
        <button class="chip" :class="{ 'chip--active': rarity === null }" @click="rarity = null">
          {{ t('ref.all') }}
        </button>
        <button
          v-for="r in rarities"
          :key="r"
          class="chip"
          :class="{ 'chip--active': rarity === r }"
          @click="rarity = r"
        >
          {{ r }}★
        </button>
      </div>
    </div>

    <div v-if="elements.length" class="chips chips--el">
      <button class="chip" :class="{ 'chip--active': element === null }" @click="element = null">
        {{ t('ref.all') }}
      </button>
      <button
        v-for="el in elements"
        :key="el"
        class="chip"
        :class="{ 'chip--active': element === el }"
        @click="element = el"
      >
        <img :src="elementIcon(el)!" :alt="el" class="chip__el" /> {{ t(`elements.${el}`) }}
      </button>
    </div>

    <p v-if="pending" class="state">{{ t('ref.loading') }}</p>
    <p v-else-if="!filtered.length" class="state">{{ t('ref.empty') }}</p>

    <ul v-else class="grid">
      <li v-for="it in filtered" :key="it.id">
        <NuxtLink
          :to="`/base/${category}/${it.id}`"
          class="item"
          :style="{ '--rar': rarityColor(it.rank), '--el': elementColor(it.element) }"
        >
          <div class="item__icon">
            <img v-if="it.icon" :src="it.icon" :alt="it.name" loading="lazy" />
            <img v-if="it.element" :src="elementIcon(it.element)!" :alt="it.element" class="item__el" />
          </div>
          <span class="item__name">{{ it.name }}</span>
          <span v-if="it.rank" class="item__rank">{{ '★'.repeat(it.rank) }}</span>
        </NuxtLink>
      </li>
    </ul>
  </main>
</template>

<style scoped lang="scss">
.page {
  max-width: 1240px;
  margin: 0 auto;
  padding: 48px 24px 64px;
}

.back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  opacity: 0.6;
  margin-bottom: 16px;

  &:hover {
    opacity: 1;
  }
}

.page__head {
  display: flex;
  align-items: baseline;
  gap: 14px;
  margin-bottom: 22px;
}

.page__title {
  font-size: 1.9rem;
  font-weight: 800;
}

.page__count {
  opacity: 0.45;
  font-size: 0.9rem;
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  align-items: center;
  margin-bottom: 12px;
}

.searchbox {
  position: relative;
  flex: 1;
  min-width: 220px;
  max-width: 360px;

  &__icon {
    position: absolute;
    left: 13px;
    top: 50%;
    transform: translateY(-50%);
    opacity: 0.45;
  }

  &__input {
    width: 100%;
    padding: 10px 14px 10px 40px;
    border-radius: 11px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: #14161d;
    color: inherit;

    &:focus {
      outline: none;
      border-color: rgba(211, 168, 76, 0.5);
    }
  }
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;

  &--el {
    margin-bottom: 22px;
  }
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 13px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: transparent;
  color: inherit;
  font-size: 0.84rem;
  font-weight: 600;
  opacity: 0.7;
  transition: opacity 0.15s, border-color 0.15s, background 0.15s;

  &:hover {
    opacity: 1;
  }

  &--active {
    opacity: 1;
    color: #f0cd84;
    border-color: rgba(211, 168, 76, 0.45);
    background: rgba(211, 168, 76, 0.1);
  }

  &__el {
    width: 16px;
    height: 16px;
  }
}

.state {
  margin-top: 50px;
  text-align: center;
  opacity: 0.5;
}

.grid {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  gap: 12px;
}

.item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 10px 8px 12px;
  border-radius: 14px;
  background: #14161d;
  border: 1px solid rgba(255, 255, 255, 0.07);
  color: inherit;
  transition: transform 0.15s, border-color 0.15s;

  &:hover {
    transform: translateY(-3px);
    border-color: color-mix(in srgb, var(--rar) 60%, transparent);
  }

  &__icon {
    position: relative;
    width: 76px;
    height: 76px;
    border-radius: 12px;
    overflow: hidden;
    background:
      radial-gradient(circle at 50% 25%, color-mix(in srgb, var(--rar) 50%, transparent), #0f1015 78%);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__icon img#{&}__el,
  &__el {
    position: absolute;
    top: 4px;
    left: 4px;
    width: 22px;
    height: 22px;
    padding: 3px;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.55);
    backdrop-filter: blur(2px);
  }

  &__name {
    font-size: 0.85rem;
    text-align: center;
    line-height: 1.2;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
  }

  &__rank {
    font-size: 0.7rem;
    letter-spacing: 0.5px;
    color: var(--rar);
  }
}
</style>
