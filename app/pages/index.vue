<script setup lang="ts">
import { usePlayerStore, type PlayerCharacter } from '~/stores/player'

const player = usePlayerStore()
const uid = ref('726865921') // дефолтный UID для проверки, потом уберём

const selected = ref<PlayerCharacter | null>(null)

async function search() {
  selected.value = null
  await player.fetchUser(uid.value)
  // Сразу открываем первого персонажа, как было в старой версии.
  selected.value = player.data?.characters[0] ?? null
}

function openChar(char: PlayerCharacter) {
  selected.value = char
}

// Аватар игрока: профиль-пик, иначе иконка первого персонажа.
const avatarUrl = computed(
  () => player.data?.profilePictureUrl ?? player.data?.characters[0]?.iconUrl ?? null,
)

// Цвет рамки/фона аватара по рарности.
const rarityColor = (r: number) => (r >= 5 ? '#e0a64e' : '#a96bd6')
</script>

<template>
  <main class="home">
    <h1 class="home__title">Jellinek Tavern</h1>
    <p class="home__subtitle">Просмотрщик аккаунтов Genshin Impact</p>

    <form class="home__search" @submit.prevent="search">
      <input
        v-model="uid"
        class="home__input"
        type="text"
        inputmode="numeric"
        placeholder="Введите UID игрока"
      />
      <button class="home__btn" type="submit" :disabled="player.loading">
        {{ player.loading ? 'Загрузка…' : 'Найти' }}
      </button>
    </form>

    <p v-if="player.error" class="home__error">{{ player.error }}</p>

    <section v-if="player.data" class="profile">
      <header class="namecard">
        <img
          v-if="player.data.namecardUrl"
          :src="player.data.namecardUrl"
          alt=""
          class="namecard__bg"
        />
        <div class="namecard__shade" />

        <div class="namecard__body">
          <div class="namecard__avatar">
            <img v-if="avatarUrl" :src="avatarUrl" :alt="player.data.nickname" />
          </div>

          <div class="namecard__info">
            <h2 class="namecard__name">{{ player.data.nickname }}</h2>
            <p v-if="player.data.signature" class="namecard__sign">{{ player.data.signature }}</p>
            <div class="namecard__stats">
              <span class="namecard__ar">AR {{ player.data.level }}</span>
              <span class="namecard__chip">
                <span class="namecard__chip-label">Мир</span>{{ player.data.worldLevel }}
              </span>
              <span class="namecard__chip">
                <span class="namecard__chip-label">Достижения</span>{{ player.data.achievements }}
              </span>
              <span class="namecard__chip namecard__chip--uid">UID {{ player.data.uid }}</span>
            </div>
          </div>
        </div>
      </header>

      <ul class="chars">
        <li
          v-for="char in player.data.characters"
          :key="char.id"
          class="chars__item"
          :class="{ 'chars__item--active': selected?.id === char.id }"
          :style="{ '--rar': rarityColor(char.rarity) }"
          @click="openChar(char)"
        >
          <div class="chars__avatar">
            <img v-if="char.iconUrl" :src="char.iconUrl" :alt="char.name ?? ''" />
            <span class="chars__const">C{{ char.constellationLevel }}</span>
          </div>
          <div class="chars__meta">
            <strong class="chars__name">{{ char.name }}</strong>
            <div class="chars__tags">
              <span class="chars__lvl">Ур. {{ char.level }}</span>
              <span class="chars__el">{{ char.elementName ?? char.element }}</span>
            </div>
            <span class="chars__stars">{{ '★'.repeat(char.rarity) }}</span>
          </div>
        </li>
      </ul>

      <!-- Детальная карточка выбранного персонажа (enka-стиль) -->
      <CharacterDetail v-if="selected" :key="selected.id" :char="selected" />
    </section>
  </main>
</template>

<style scoped lang="scss">
.home {
  max-width: 1240px;
  margin: 0 auto;
  padding: 48px 24px;

  &__title {
    font-size: 2.4rem;
    letter-spacing: 0.04em;
  }

  &__subtitle {
    opacity: 0.6;
    margin-bottom: 28px;
  }

  &__search {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
  }

  &__input {
    flex: 1;
    padding: 12px 16px;
    border-radius: 10px;
    border: 1px solid #3a3d4a;
    background: #1a1c24;
    color: inherit;
    font-size: 1rem;
  }

  &__btn {
    padding: 12px 24px;
    border-radius: 10px;
    border: none;
    background: #d3a84c;
    color: #1a1c24;
    font-weight: 600;

    &:disabled {
      opacity: 0.5;
      cursor: default;
    }
  }

  &__error {
    color: #ff6b6b;
  }
}

.profile {
  margin-top: 32px;
}

.namecard {
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  margin-bottom: 26px;
  min-height: 150px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 14px 40px rgba(0, 0, 0, 0.4);

  &__bg {
    position: absolute;
    inset: -20px;
    width: calc(100% + 40px);
    height: calc(100% + 40px);
    object-fit: cover;
    object-position: center 35%;
    // Лёгкий блюр прячет низкое разрешение арта неймкарты.
    filter: saturate(1.15) blur(2px);
    transform: scale(1.05);
  }

  &__shade {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(140% 120% at 12% 50%, rgba(12, 13, 18, 0.95), transparent 70%),
      linear-gradient(
        90deg,
        rgba(12, 13, 18, 0.9) 0%,
        rgba(12, 13, 18, 0.62) 50%,
        rgba(12, 13, 18, 0.32) 100%
      );
  }

  &__body {
    position: relative;
    z-index: 2;
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 22px 26px;
  }

  &__avatar {
    flex-shrink: 0;
    width: 92px;
    height: 92px;
    border-radius: 50%;
    overflow: hidden;
    background: #0f1015;
    border: 2px solid rgba(255, 255, 255, 0.5);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.5);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__info {
    min-width: 0;
  }

  &__name {
    font-size: 1.8rem;
    font-weight: 800;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.8);
  }

  &__sign {
    opacity: 0.8;
    font-style: italic;
    margin: 4px 0 10px;
    max-width: 540px;
  }

  &__stats {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;
  }

  &__ar {
    font-weight: 800;
    font-size: 0.8rem;
    letter-spacing: 0.02em;
    padding: 5px 13px;
    border-radius: 999px;
    color: #2a1e06;
    background: linear-gradient(135deg, #ffdf8e, #d3a84c);
    box-shadow: 0 3px 12px rgba(211, 168, 76, 0.35);
  }

  &__chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 0.82rem;
    font-weight: 600;
    padding: 5px 12px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.07);
    border: 1px solid rgba(255, 255, 255, 0.12);
    backdrop-filter: blur(8px);

    &-label {
      font-weight: 500;
      opacity: 0.5;
    }

    &--uid {
      font-family: ui-monospace, 'SF Mono', Menlo, Consolas, monospace;
      font-size: 0.76rem;
      opacity: 0.6;
      letter-spacing: 0.02em;
    }
  }
}

.chars {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
  gap: 14px;

  &__item {
    position: relative;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px;
    border-radius: 16px;
    background: #14161d;
    border: 1px solid rgba(255, 255, 255, 0.07);
    cursor: pointer;
    overflow: hidden;
    transition: transform 0.18s ease, border-color 0.18s, box-shadow 0.18s;

    &:hover {
      transform: translateY(-3px);
      border-color: rgba(255, 255, 255, 0.18);
      box-shadow: 0 10px 26px rgba(0, 0, 0, 0.45);
    }

    &--active {
      border-color: #d3a84c;
      box-shadow: 0 0 0 1px #d3a84c, 0 10px 30px rgba(211, 168, 76, 0.18);
    }
  }

  &__avatar {
    position: relative;
    flex-shrink: 0;
    width: 60px;
    height: 60px;
    border-radius: 12px;
    overflow: hidden;
    background:
      radial-gradient(circle at 50% 30%, color-mix(in srgb, var(--rar) 55%, transparent), #0f1015 75%);
    border: 1px solid color-mix(in srgb, var(--rar) 60%, transparent);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__const {
    position: absolute;
    right: 0;
    bottom: 0;
    font-size: 0.62rem;
    font-weight: 700;
    line-height: 1;
    padding: 2px 5px;
    border-radius: 7px 0 11px 0;
    background: rgba(0, 0, 0, 0.7);
    color: #e8e8ec;
  }

  &__meta {
    display: flex;
    flex-direction: column;
    gap: 3px;
    min-width: 0;
  }

  &__name {
    font-size: 1rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__tags {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.8rem;
  }

  &__lvl {
    opacity: 0.7;
  }

  &__el {
    opacity: 0.6;
  }

  &__stars {
    font-size: 0.78rem;
    color: var(--rar);
    letter-spacing: 1px;
  }
}
</style>
