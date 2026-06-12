<script setup lang="ts">
import { usePlayerStore } from '~/stores/player'

const player = usePlayerStore()
const uid = ref('726865921') // дефолтный UID для проверки, потом уберём

function search() {
  player.fetchUser(uid.value)
}
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
      <header class="profile__head">
        <h2>{{ player.data.nickname }}</h2>
        <span>AR {{ player.data.level }} · WL {{ player.data.worldLevel }}</span>
        <p v-if="player.data.signature" class="profile__sign">{{ player.data.signature }}</p>
      </header>

      <ul class="chars">
        <li v-for="char in player.data.characters" :key="char.id" class="chars__item">
          <img v-if="char.iconUrl" :src="char.iconUrl" :alt="char.name" class="chars__icon" />
          <div class="chars__meta">
            <strong>{{ char.name }}</strong>
            <span>Ур. {{ char.level }} · {{ char.element ?? '—' }} · {{ char.rarity }}★</span>
          </div>
        </li>
      </ul>
    </section>
  </main>
</template>

<style scoped lang="scss">
.home {
  max-width: 960px;
  margin: 0 auto;
  padding: 48px 20px;

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

  &__head {
    margin-bottom: 24px;
  }

  &__sign {
    opacity: 0.6;
    font-style: italic;
  }
}

.chars {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 14px;

  &__item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    border-radius: 12px;
    background: #1a1c24;
    border: 1px solid #2c2f3a;
  }

  &__icon {
    width: 56px;
    height: 56px;
    border-radius: 8px;
    object-fit: cover;
    background: #0f1015;
  }

  &__meta {
    display: flex;
    flex-direction: column;
    gap: 4px;

    span {
      font-size: 0.85rem;
      opacity: 0.6;
    }
  }
}
</style>
