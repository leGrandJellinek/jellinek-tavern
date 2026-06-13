<script setup lang="ts">
import { elementColor, elementIcon, rarityColor } from '~/composables/useElements'
import { amberImg, cleanText } from '~/composables/useAsset'

const route = useRoute()
const { locale, t } = useI18n()

const category = computed(() => String(route.params.category))
const id = computed(() => String(route.params.id))

const { data, pending, error } = await useFetch<{ category: string; data: any; ascensionMaterials: any[] }>(
  () => `/api/ref/${category.value}/${id.value}`,
  { query: { lang: locale }, watch: [locale] },
)

const d = computed(() => data.value?.data ?? null)
const accent = computed(() => (d.value?.element ? elementColor(d.value.element) : '#e7c87a'))

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

// Форматирование значения характеристики (процент vs плоское).
function fmtProp(propType: string, value: number) {
  if (propType === 'FIGHT_PROP_ELEMENT_MASTERY') return String(Math.round(value))
  return `${(value * 100).toFixed(1)}%`
}

// Характеристики оружия (на 1 ур.): база атаки + вторичный стат.
const weaponStats = computed(() => {
  if (category.value !== 'weapon') return null
  const props = d.value?.upgrade?.prop as any[] | undefined
  if (!props) return null
  const base = props.find((p) => p.propType === 'FIGHT_PROP_BASE_ATTACK')
  const sub = props.find((p) => p.propType !== 'FIGHT_PROP_BASE_ATTACK' && p.propType !== 'FIGHT_PROP_NONE')
  return {
    baseAtk: base ? Math.round(base.initValue) : null,
    sub: sub ? { type: sub.propType, value: fmtProp(sub.propType, sub.initValue) } : null,
  }
})

// Фазы возвышения оружия (только значимые: с unlockMaxLevel > 20).
const weaponAscension = computed(() => {
  if (category.value !== 'weapon') return []
  const promote = d.value?.upgrade?.promote as any[] | undefined
  if (!promote) return []
  return promote
    .filter((p) => p.promoteLevel > 0)
    .map((p) => ({
      phase: p.promoteLevel,
      maxLevel: p.unlockMaxLevel,
      addAtk: p.addProps?.FIGHT_PROP_BASE_ATTACK ? Math.round(p.addProps.FIGHT_PROP_BASE_ATTACK) : 0,
      mora: p.coinCost ?? 0,
    }))
})

const ascensionMaterials = computed(() => data.value?.ascensionMaterials ?? [])

// Артефакты: бонусы набора (2/4 предмета) и части набора.
const setBonuses = computed(() => {
  const a = d.value?.affixList
  if (!a) return []
  const vals = Object.values(a as Record<string, string>)
  // Обычно 2 записи: бонус за 2 и за 4 предмета.
  const labels = vals.length >= 2 ? ['ref.artifact.bonus2', 'ref.artifact.bonus4'] : ['ref.artifact.bonus2']
  return vals.map((text, i) => ({ label: labels[i] ?? 'ref.artifact.bonus4', text }))
})
const setPieces = computed(() =>
  d.value?.suit ? Object.values(d.value.suit as Record<string, any>) : [],
)
</script>

<template>
  <main class="page" :style="{ '--accent': accent }">
    <BackLink :to="`/base/${category}`" :label="t(`ref.categories.${category}`)" />

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

      <!-- Оружие: характеристики -->
      <section v-if="weaponStats" class="block">
        <h2 class="block__title">{{ t('ref.weapon.stats') }}</h2>
        <div class="wstats">
          <div v-if="weaponStats.baseAtk" class="wstat">
            <span class="wstat__name">{{ t('ref.weapon.baseAtk') }}</span>
            <strong class="wstat__val">{{ weaponStats.baseAtk }}</strong>
            <span class="wstat__hint">{{ t('ref.weapon.atLvl1') }}</span>
          </div>
          <div v-if="weaponStats.sub" class="wstat">
            <span class="wstat__name">{{ t(`ref.fightprop.${weaponStats.sub.type}`) }}</span>
            <strong class="wstat__val">{{ weaponStats.sub.value }}</strong>
            <span class="wstat__hint">{{ t('ref.weapon.atLvl1') }}</span>
          </div>
        </div>
      </section>

      <!-- Оружие: возвышение -->
      <section v-if="weaponAscension.length" class="block">
        <h2 class="block__title">{{ t('ref.weapon.ascension') }}</h2>
        <div class="asc">
          <div class="asc__row asc__row--head">
            <span>{{ t('ref.weapon.phase') }}</span>
            <span>{{ t('ref.weapon.maxLevel') }}</span>
            <span>+{{ t('ref.weapon.baseAtk') }}</span>
            <span>Mora</span>
          </div>
          <div v-for="p in weaponAscension" :key="p.phase" class="asc__row">
            <span>{{ p.phase }}</span>
            <span>{{ p.maxLevel }}</span>
            <span class="asc__atk">+{{ p.addAtk }}</span>
            <span>{{ p.mora.toLocaleString() }}</span>
          </div>
        </div>
      </section>

      <!-- Материалы возвышения -->
      <section v-if="ascensionMaterials.length" class="block">
        <h2 class="block__title">{{ t('ref.weapon.ascensionMat') }}</h2>
        <div class="mats">
          <div
            v-for="m in ascensionMaterials"
            :key="m.id"
            class="mat"
            :style="{ '--rar': rarityColor(m.rank) }"
            :title="m.name"
          >
            <img v-if="m.icon" :src="m.icon" :alt="m.name" loading="lazy" />
            <span class="mat__count">×{{ m.count }}</span>
          </div>
        </div>
      </section>

      <!-- Оружие: пассивка -->
      <section v-if="weaponAffix" class="block">
        <h2 class="block__title">{{ t('ref.weapon.effect') }}</h2>
        <h3 class="subtitle">{{ weaponAffix.name }}</h3>
        <p class="story">{{ cleanText(Object.values(weaponAffix.upgrade ?? {})[0] as string) }}</p>
      </section>

      <!-- Артефакты: бонусы набора -->
      <section v-if="setBonuses.length" class="block">
        <h2 class="block__title">{{ t('ref.artifact.setBonus') }}</h2>
        <div class="bonuses">
          <div v-for="(b, i) in setBonuses" :key="i" class="bonus">
            <span class="bonus__label">{{ t(b.label) }}</span>
            <p class="bonus__text">{{ cleanText(b.text) }}</p>
          </div>
        </div>
      </section>

      <!-- Артефакты: части набора -->
      <section v-if="setPieces.length" class="block">
        <h2 class="block__title">{{ t('ref.artifact.pieces') }}</h2>
        <div class="pieces">
          <article v-for="(p, i) in setPieces" :key="i" class="piece">
            <img v-if="p.icon" :src="amberImg(p.icon)!" :alt="p.name" class="piece__icon" />
            <div>
              <h3 class="piece__name">{{ p.name }}</h3>
              <p class="piece__desc">{{ cleanText(p.description) }}</p>
            </div>
          </article>
        </div>
      </section>

      <!-- Материалы: описание -->
      <section v-if="!d.fetter && !weaponAffix && !setBonuses.length && d.description" class="block">
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
  padding: 72px 24px 64px;
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

.wstats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
}

.wstat {
  padding: 16px;
  border-radius: 14px;
  background: #14161d;
  border: 1px solid rgba(255, 255, 255, 0.07);

  &__name {
    display: block;
    font-size: 0.82rem;
    opacity: 0.6;
    margin-bottom: 6px;
  }

  &__val {
    font-size: 1.5rem;
    font-weight: 800;
    color: var(--accent);
  }

  &__hint {
    margin-left: 6px;
    font-size: 0.72rem;
    opacity: 0.4;
  }
}

.asc {
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);

  &__row {
    display: grid;
    grid-template-columns: 1fr 1.2fr 1fr 1.2fr;
    gap: 10px;
    padding: 11px 16px;
    font-size: 0.9rem;
    font-variant-numeric: tabular-nums;

    & + & {
      border-top: 1px solid rgba(255, 255, 255, 0.06);
    }

    &--head {
      background: rgba(255, 255, 255, 0.04);
      font-size: 0.76rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      opacity: 0.55;
    }
  }

  &__atk {
    color: var(--accent);
    font-weight: 600;
  }
}

.mats {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.mat {
  position: relative;
  width: 60px;
  height: 60px;
  border-radius: 12px;
  overflow: hidden;
  background:
    radial-gradient(circle at 50% 28%, color-mix(in srgb, var(--rar) 50%, transparent), #0f1015 78%);
  border: 1px solid color-mix(in srgb, var(--rar) 50%, transparent);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__count {
    position: absolute;
    right: 0;
    bottom: 0;
    font-size: 0.7rem;
    font-weight: 700;
    padding: 1px 5px;
    border-radius: 7px 0 0 0;
    background: rgba(0, 0, 0, 0.75);
  }
}

.bonuses {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.bonus {
  padding: 14px 16px;
  border-radius: 14px;
  background: #14161d;
  border: 1px solid rgba(255, 255, 255, 0.07);

  &__label {
    display: inline-block;
    font-size: 0.74rem;
    font-weight: 700;
    color: var(--accent);
    padding: 3px 10px;
    border-radius: 999px;
    background: color-mix(in srgb, var(--accent) 14%, transparent);
    margin-bottom: 8px;
  }

  &__text {
    opacity: 0.85;
    line-height: 1.55;
    font-size: 0.92rem;
  }
}

.pieces {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 12px;
}

.piece {
  display: flex;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 14px;
  background: #14161d;
  border: 1px solid rgba(255, 255, 255, 0.07);

  &__icon {
    width: 48px;
    height: 48px;
    flex-shrink: 0;
  }

  &__name {
    font-size: 0.98rem;
    margin-bottom: 4px;
  }

  &__desc {
    opacity: 0.6;
    line-height: 1.5;
    font-size: 0.82rem;
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
