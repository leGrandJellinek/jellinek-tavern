import { defineStore } from 'pinia'

// Тип ответа нашего серверного роута /api/uid/[uid]
export interface PlayerResponse {
  uid: number
  nickname: string
  level: number
  signature: string
  worldLevel: number
  achievements: number
  profilePictureUrl: string | null
  namecardUrl: string | null
  characters: PlayerCharacter[]
}

export interface Stat {
  name: string | null
  value: string
}

export interface PlayerCharacter {
  id: number
  name: string | null
  element: string | null
  elementName: string | null
  level: number
  maxLevel: number
  rarity: number
  friendship: number
  iconUrl: string | null
  gachaUrl: string | null
  constellationLevel: number
  stats: {
    maxHp: Stat | null
    atk: Stat | null
    def: Stat | null
    critRate: Stat | null
    critDamage: Stat | null
    elementMastery: Stat | null
    chargeEfficiency: Stat | null
    damageBonus: Stat | null
  }
  talents: { id: number; name: string | null; icon: string | null; level: number }[]
  constellations: { id: number; name: string | null; icon: string | null; unlocked: boolean }[]
  weapon: {
    name: string | null
    icon: string | null
    rarity: number
    level: number
    refinement: number
    stats: (Stat | null)[]
  } | null
  artifacts: {
    id: number
    slot: string | null
    setName: string | null
    icon: string | null
    rarity: number
    level: number
    mainstat: Stat | null
    substats: (Stat | null)[]
  }[]
}

export const usePlayerStore = defineStore('player', () => {
  const data = ref<PlayerResponse | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchUser(uid: string) {
    const clean = uid.trim()
    if (!clean) return

    loading.value = true
    error.value = null
    try {
      // $fetch авто-импортирован Nuxt'ом; ходит в server/api/uid/[uid]
      data.value = await $fetch<PlayerResponse>(`/api/uid/${clean}`)
    } catch (e: any) {
      error.value = e?.data?.message || 'Не удалось загрузить игрока'
      data.value = null
    } finally {
      loading.value = false
    }
  }

  return { data, loading, error, fetchUser }
})
