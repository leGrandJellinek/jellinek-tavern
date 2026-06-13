<script setup lang="ts">
import type { PlayerCharacter, Stat } from '~/stores/player'

const props = defineProps<{ char: PlayerCharacter }>()

// Стихия enka (Fire/Water/...) → имя видео-фона в /public/videos/bg.
const ELEMENT_BG: Record<string, string> = {
  Fire: 'bg_pyro.webm',
  Water: 'bg_hydro.webm',
  Grass: 'bg_dendro.webm',
  Electric: 'bg_electro.webm',
  Wind: 'bg_anemo.webm',
  Rock: 'bg_geo.webm',
  Ice: 'bg_cryo.webm',
}

// Акцентный цвет по стихии.
const ELEMENT_COLOR: Record<string, string> = {
  Fire: '#ff7a55',
  Water: '#3fb6ff',
  Grass: '#8fd24a',
  Electric: '#c98bff',
  Wind: '#5fe6c0',
  Rock: '#f6c54b',
  Ice: '#7fe3ff',
}

const bgVideo = computed(() => {
  const file = props.char.element ? ELEMENT_BG[props.char.element] : null
  return file ? `/videos/bg/${file}` : null
})

const accent = computed(() => (props.char.element && ELEMENT_COLOR[props.char.element]) || '#d3a84c')

const stars = (n: number) => '★'.repeat(n)

// Короткие подписи статов, чтобы не переносились/не обрезались.
const SHORT_NAME: Record<string, string> = {
  'Шанс крит. попадания': 'Крит. шанс',
  'Крит. урон': 'Крит. урон',
  'Восст. энергии': 'Восст. энергии',
  'Мастерство стихий': 'Мастерство',
  'Сила атаки': 'Сила атаки',
  'Базовая сила атаки': 'База атаки',
}
const shortName = (s: Stat | null | undefined) => {
  const n = s?.name ?? ''
  return SHORT_NAME[n] ?? n
}

// Подсветка крита в статах.
const isCrit = (s: Stat) =>
  /крит|crit/i.test(s.name ?? '')

const mainStats = computed(() => {
  const s = props.char.stats
  return [
    s.maxHp,
    s.atk,
    s.def,
    s.elementMastery,
    s.critRate,
    s.critDamage,
    s.chargeEfficiency,
    s.damageBonus,
  ].filter((x): x is NonNullable<typeof x> => x != null)
})
</script>

<template>
  <article
    class="card"
    :style="{ '--accent': accent }"
  >
    <!-- Видео-фон по стихии -->
    <video v-if="bgVideo" class="card__bg" autoplay muted loop playsinline>
      <source :src="bgVideo" type="video/webm" />
    </video>
    <div class="card__overlay" />

    <div class="card__grid">
      <!-- ЛЕВО: сплэш-арт, имя, таланты, созвездия -->
      <section class="hero">
        <img
          v-if="char.gachaUrl"
          :src="char.gachaUrl"
          :alt="char.name ?? ''"
          class="hero__splash"
        />

        <div class="hero__top">
          <h3 class="hero__name">{{ char.name }}</h3>
          <p class="hero__lvl">Ур. {{ char.level }} / {{ char.maxLevel }}</p>
          <div class="hero__badges">
            <span class="chip chip--accent">C{{ char.constellationLevel }}</span>
            <span class="chip">{{ char.elementName ?? char.element }}</span>
          </div>
        </div>

        <!-- Созвездия -->
        <div class="consts">
          <div
            v-for="c in char.constellations"
            :key="c.id"
            class="consts__node"
            :class="{ 'consts__node--off': !c.unlocked }"
            :title="c.name ?? ''"
          >
            <img v-if="c.icon" :src="c.icon" :alt="c.name ?? ''" />
          </div>
        </div>

        <!-- Таланты -->
        <div class="talents">
          <div v-for="t in char.talents" :key="t.id" class="talents__node" :title="t.name ?? ''">
            <img v-if="t.icon" :src="t.icon" :alt="t.name ?? ''" />
            <span class="talents__lvl">{{ t.level }}</span>
          </div>
        </div>
      </section>

      <!-- ЦЕНТР: оружие + характеристики -->
      <section class="center">
        <div v-if="char.weapon" class="weapon">
          <img v-if="char.weapon.icon" :src="char.weapon.icon" :alt="char.weapon.name ?? ''" class="weapon__icon" />
          <div class="weapon__body">
            <strong class="weapon__name">{{ char.weapon.name }}</strong>
            <div class="weapon__tags">
              <span class="chip chip--gold">{{ stars(char.weapon.rarity) }}</span>
              <span class="chip chip--accent">R{{ char.weapon.refinement }}</span>
              <span class="chip">Ур. {{ char.weapon.level }}/90</span>
            </div>
            <div class="weapon__stats">
              <span v-for="(ws, i) in char.weapon.stats" :key="i" class="weapon__stat">
                <span class="weapon__stat-name">{{ shortName(ws) }}</span>
                <b>{{ ws?.value }}</b>
              </span>
            </div>
          </div>
        </div>

        <ul class="stats">
          <li
            v-for="s in mainStats"
            :key="s.name ?? ''"
            class="stats__row"
            :class="{ 'stats__row--crit': isCrit(s) }"
          >
            <span class="stats__name">{{ shortName(s) }}</span>
            <strong class="stats__val">{{ s.value }}</strong>
          </li>
        </ul>
      </section>

      <!-- ПРАВО: артефакты -->
      <section class="arts">
        <div v-for="(art, i) in char.artifacts" :key="i" class="art">
          <div class="art__left">
            <img v-if="art.icon" :src="art.icon" :alt="art.slot ?? ''" class="art__icon" />
            <strong v-if="art.mainstat" class="art__mainval">{{ art.mainstat.value }}</strong>
            <span class="art__mainname">{{ shortName(art.mainstat) }}</span>
            <span class="art__lvl">+{{ art.level }}</span>
          </div>
          <ul class="art__subs">
            <li
              v-for="(sub, j) in art.substats"
              :key="j"
              :class="{ 'art__sub--crit': sub && isCrit(sub) }"
            >
              <span>{{ shortName(sub) }}</span>
              <strong>{{ sub?.value }}</strong>
            </li>
          </ul>
        </div>
      </section>
    </div>
  </article>
</template>

<style scoped lang="scss">
.card {
  position: relative;
  margin-top: 28px;
  border-radius: 24px;
  overflow: hidden;
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.55);

  &__bg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 0;
    filter: saturate(1.1);
  }

  &__overlay {
    position: absolute;
    inset: 0;
    z-index: 1;
    background:
      radial-gradient(120% 100% at 0% 0%, rgba(0, 0, 0, 0.15), transparent 60%),
      linear-gradient(105deg, rgba(10, 10, 14, 0.72) 0%, rgba(10, 10, 14, 0.4) 38%, rgba(10, 10, 14, 0.78) 100%);
  }

  &__grid {
    position: relative;
    z-index: 2;
    display: grid;
    grid-template-columns: 1.1fr 1fr 1.35fr;
    gap: 18px;
    padding: 22px;

    @media (max-width: 1000px) {
      grid-template-columns: 1fr;
    }
  }
}

.chip {
  font-size: 0.74rem;
  font-weight: 600;
  padding: 3px 9px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.14);
  backdrop-filter: blur(6px);
  white-space: nowrap;

  &--accent {
    background: color-mix(in srgb, var(--accent) 28%, transparent);
    border-color: color-mix(in srgb, var(--accent) 55%, transparent);
  }

  &--gold {
    color: #ffcf6b;
  }
}

/* ЛЕВО */
.hero {
  position: relative;
  border-radius: 18px;
  overflow: hidden;
  min-height: 480px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.05), rgba(0, 0, 0, 0.15));

  &__splash {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    height: 100%;
    width: auto;
    max-width: none;
    object-fit: cover;
    object-position: top center;
    mask-image: linear-gradient(to bottom, #000 78%, transparent);
  }

  &__top {
    position: relative;
    z-index: 2;
    padding: 18px 20px;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.9);
  }

  &__name {
    font-size: 2rem;
    font-weight: 800;
    letter-spacing: 0.01em;
  }

  &__lvl {
    opacity: 0.85;
    margin-top: 2px;
  }

  &__badges {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 12px;
  }
}

.consts {
  position: absolute;
  left: 14px;
  top: 130px;
  z-index: 3;
  display: flex;
  flex-direction: column;
  gap: 9px;

  &__node {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    background: rgba(15, 14, 20, 0.7);
    border: 1px solid color-mix(in srgb, var(--accent) 45%, rgba(255, 255, 255, 0.2));
    backdrop-filter: blur(6px);
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      width: 26px;
      height: 26px;
    }

    &--off {
      opacity: 0.28;
      filter: grayscale(1);
      border-color: rgba(255, 255, 255, 0.15);
    }
  }
}

.talents {
  position: absolute;
  right: 14px;
  bottom: 18px;
  z-index: 3;
  display: flex;
  flex-direction: column;
  gap: 12px;

  &__node {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: rgba(15, 14, 20, 0.7);
    border: 1px solid rgba(255, 255, 255, 0.25);
    backdrop-filter: blur(6px);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;

    img {
      width: 30px;
      height: 30px;
    }
  }

  &__lvl {
    position: absolute;
    bottom: -7px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 0.72rem;
    font-weight: 700;
    background: var(--accent);
    color: #11131a;
    border-radius: 7px;
    padding: 0 7px;
    line-height: 1.5;
  }
}

/* ЦЕНТР */
.center {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 4px 2px;
}

.weapon {
  display: flex;
  gap: 14px;
  align-items: center;
  padding: 14px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);

  &__icon {
    width: 72px;
    height: 72px;
    border-radius: 12px;
    background: rgba(0, 0, 0, 0.4);
  }

  &__body {
    display: flex;
    flex-direction: column;
    gap: 7px;
  }

  &__name {
    font-size: 1.15rem;
  }

  &__tags {
    display: flex;
    gap: 6px;
  }

  &__stats {
    display: flex;
    flex-wrap: wrap;
    gap: 6px 18px;
    font-size: 0.88rem;
  }

  &__stat {
    display: inline-flex;
    align-items: baseline;
    gap: 6px;

    &-name {
      opacity: 0.6;
    }

    b {
      font-weight: 700;
    }
  }
}

.stats {
  list-style: none;
  display: flex;
  flex-direction: column;
  padding: 8px 14px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.09);
  backdrop-filter: blur(10px);

  &__row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 11px 4px;
    font-size: 1rem;

    & + & {
      border-top: 1px solid rgba(255, 255, 255, 0.07);
    }

    &--crit .stats__val {
      color: var(--accent);
    }
  }

  &__name {
    opacity: 0.82;
  }

  &__val {
    font-weight: 700;
    font-variant-numeric: tabular-nums;
  }
}

/* ПРАВО */
.arts {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.art {
  display: flex;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 16px;
  background: rgba(15, 14, 20, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);

  &__left {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 104px;
    flex-shrink: 0;
    text-align: center;
    border-right: 1px solid rgba(255, 255, 255, 0.08);
    padding-right: 12px;
  }

  &__icon {
    width: 50px;
    height: 50px;
  }

  &__mainval {
    font-size: 1.5rem;
    font-weight: 800;
    line-height: 1.1;
    color: var(--accent);
  }

  &__mainname {
    font-size: 0.68rem;
    opacity: 0.65;
  }

  &__lvl {
    margin-top: 4px;
    font-size: 0.66rem;
    font-weight: 700;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 6px;
    padding: 1px 7px;
  }

  &__subs {
    list-style: none;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 7px;
    flex: 1;
    min-width: 0;

    li {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      gap: 12px;
      font-size: 0.9rem;

      span {
        opacity: 0.7;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      strong {
        font-variant-numeric: tabular-nums;
        white-space: nowrap;
      }
    }

    li.art__sub--crit strong {
      color: var(--accent);
    }
  }
}
</style>
