<script setup lang="ts">
const { locale, locales, setLocale } = useI18n()

// Пункты бокового меню (label — ключ перевода).
const nav = [
  { to: '/', key: 'nav.home', icon: 'home' },
  { to: '/base', key: 'nav.base', icon: 'book' },
  { to: '/player', key: 'nav.player', icon: 'search' },
] as const

const collapsed = ref(false)

const availableLocales = computed(() =>
  (locales.value as { code: string; name: string }[]).map((l) => ({ code: l.code, name: l.name })),
)

const currentLocale = computed(
  () => availableLocales.value.find((l) => l.code === locale.value) ?? availableLocales.value[0],
)

// Дропдаун выбора языка.
const langOpen = ref(false)
const langRef = ref<HTMLElement | null>(null)

function pickLocale(code: string) {
  setLocale(code as 'ru' | 'en' | 'ja')
  langOpen.value = false
}

// Закрытие по клику вне дропдауна.
function onClickOutside(e: MouseEvent) {
  if (langRef.value && !langRef.value.contains(e.target as Node)) langOpen.value = false
}
onMounted(() => document.addEventListener('click', onClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', onClickOutside))
</script>

<template>
  <div class="app" :class="{ 'app--collapsed': collapsed }">
    <aside class="sidebar">
      <div class="sidebar__brand">
        <span class="sidebar__logo">JT</span>
        <span class="sidebar__title">Jellinek Tavern</span>
      </div>

      <nav class="sidebar__nav">
        <NuxtLink
          v-for="item in nav"
          :key="item.to"
          :to="item.to"
          class="navitem"
          active-class="navitem--active"
        >
          <AppIcon :name="item.icon" class="navitem__icon" />
          <span class="navitem__label">{{ $t(item.key) }}</span>
        </NuxtLink>
      </nav>

      <div class="sidebar__foot">
        <div ref="langRef" class="lang">
          <button
            class="lang__trigger"
            :class="{ 'lang__trigger--open': langOpen }"
            @click="langOpen = !langOpen"
          >
            <AppIcon name="globe" :size="18" class="lang__globe" />
            <span class="lang__current">{{ currentLocale?.name }}</span>
            <AppIcon name="chevron" :size="16" class="lang__chevron" />
          </button>

          <Transition name="lang-pop">
            <ul v-if="langOpen" class="lang__menu">
              <li v-for="l in availableLocales" :key="l.code">
                <button
                  class="lang__item"
                  :class="{ 'lang__item--active': locale === l.code }"
                  @click="pickLocale(l.code)"
                >
                  <span>{{ l.name }}</span>
                  <AppIcon v-if="locale === l.code" name="check" :size="15" />
                </button>
              </li>
            </ul>
          </Transition>
        </div>

        <button class="sidebar__collapse" @click="collapsed = !collapsed">
          {{ collapsed ? '»' : '«' }}
        </button>
      </div>
    </aside>

    <main class="content">
      <slot />
    </main>
  </div>
</template>

<style scoped lang="scss">
.app {
  display: grid;
  grid-template-columns: 248px 1fr;
  min-height: 100vh;
  transition: grid-template-columns 0.2s ease;

  &--collapsed {
    grid-template-columns: 74px 1fr;
  }
}

.sidebar {
  position: sticky;
  top: 0;
  align-self: start;
  height: 100vh;
  // Выше контента (iframe карты имеет z-index), иначе меню языка уходит под карту.
  z-index: 20;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 18px 14px;
  background: #14161d;
  border-right: 1px solid rgba(255, 255, 255, 0.07);

  &__brand {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 10px 18px;
    white-space: nowrap;
    overflow: hidden;
  }

  &__logo {
    flex-shrink: 0;
    width: 36px;
    height: 36px;
    display: grid;
    place-items: center;
    border-radius: 10px;
    font-size: 0.95rem;
    font-weight: 800;
    letter-spacing: 0.02em;
    color: #1a1c24;
    background: linear-gradient(135deg, #ffdf8e, #d3a84c);
  }

  &__title {
    font-size: 1.1rem;
    font-weight: 800;
    letter-spacing: 0.01em;
  }

  &__nav {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  &__foot {
    margin-top: auto;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  &__collapse {
    align-self: center;
    width: 32px;
    height: 32px;
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: transparent;
    color: inherit;
    opacity: 0;
    transition: opacity 0.18s;

    &:hover {
      background: rgba(255, 255, 255, 0.06);
    }
  }

  // Кнопка сворачивания появляется только при наведении на сайдбар.
  &:hover &__collapse {
    opacity: 0.6;

    &:hover {
      opacity: 1;
    }
  }
}

.lang {
  position: relative;

  &__trigger {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding: 10px 12px;
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.04);
    color: inherit;
    font-size: 0.9rem;
    font-weight: 600;
    transition: background 0.15s, border-color 0.15s;

    &:hover,
    &--open {
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(255, 255, 255, 0.16);
    }
  }

  &__globe {
    flex-shrink: 0;
    opacity: 0.7;
  }

  &__current {
    flex: 1;
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__chevron {
    flex-shrink: 0;
    opacity: 0.5;
    transition: transform 0.2s;
  }

  &__trigger--open &__chevron {
    transform: rotate(180deg);
  }

  &__menu {
    position: absolute;
    bottom: calc(100% + 8px);
    left: 0;
    right: 0;
    min-width: 160px;
    list-style: none;
    padding: 6px;
    border-radius: 12px;
    background: #1b1e27;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.5);
    z-index: 20;
  }

  &__item span {
    white-space: nowrap;
  }

  &__item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 9px 11px;
    border: none;
    border-radius: 9px;
    background: transparent;
    color: inherit;
    font-size: 0.9rem;
    font-weight: 600;
    opacity: 0.8;
    transition: background 0.15s, opacity 0.15s, color 0.15s;

    &:hover {
      opacity: 1;
      background: rgba(255, 255, 255, 0.06);
    }

    &--active {
      opacity: 1;
      color: #f0cd84;
    }
  }
}

.lang-pop-enter-active,
.lang-pop-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.lang-pop-enter-from,
.lang-pop-leave-to {
  opacity: 0;
  transform: translateY(6px);
}

// В свёрнутом сайдбаре — только глобус по центру.
.app--collapsed .lang__current,
.app--collapsed .lang__chevron {
  display: none;
}
.app--collapsed .lang__trigger {
  justify-content: center;
  padding-inline: 0;
}
// В свёрнутом виде меню не помещается по ширине — раскрываем вправо.
.app--collapsed .lang__menu {
  left: 0;
  right: auto;
}

.navitem {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 11px 12px;
  border-radius: 12px;
  color: inherit;
  white-space: nowrap;
  overflow: hidden;
  transition: background 0.15s, color 0.15s;

  &__icon {
    flex-shrink: 0;
    opacity: 0.7;
  }

  &__label {
    font-weight: 600;
    opacity: 0.8;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.05);

    .navitem__icon,
    .navitem__label {
      opacity: 1;
    }
  }

  &--active {
    background: rgba(211, 168, 76, 0.12);
    color: #f0cd84;

    .navitem__icon,
    .navitem__label {
      opacity: 1;
    }
  }
}

.content {
  position: relative;
  min-width: 0;
  padding: 0;
}

.app--collapsed {
  .sidebar__title,
  .navitem__label {
    display: none;
  }

  .sidebar__brand,
  .navitem {
    justify-content: center;
    gap: 0;
    padding-inline: 0;
  }
}

@media (max-width: 720px) {
  .app {
    grid-template-columns: 64px 1fr;
  }

  .sidebar__title,
  .navitem__label {
    display: none;
  }

  .sidebar__brand,
  .navitem {
    justify-content: center;
    gap: 0;
    padding-inline: 0;
  }

  .sidebar__collapse {
    display: none;
  }
}
</style>
