import { defineStore } from 'pinia'

// Тип ответа нашего серверного роута /api/uid/[uid]
export interface PlayerResponse {
  uid: number
  nickname: string
  level: number
  signature: string
  worldLevel: number
  namecardUrl: string | null
  characters: PlayerCharacter[]
}

export interface PlayerCharacter {
  id: number
  name: string
  element: string | null
  level: number
  rarity: number
  friendship: number
  iconUrl: string | null
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
