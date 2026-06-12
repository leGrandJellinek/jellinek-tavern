// Лёгкий клиент к Project Amber (gi.yatta.moe) — открытый датасет игровых данных.
// Используем как источник справочника (персонажи, оружие, артефакты, материалы).

const API = 'https://gi.yatta.moe/api/v2'
export const AMBER_ASSETS = 'https://gi.yatta.moe/assets/UI'

// i18n локаль → код языка Amber.
const LANG: Record<string, string> = { ru: 'ru', en: 'en', ja: 'jp' }
export const amberLang = (lang?: unknown) => LANG[String(lang)] ?? 'en'

// Разрешённые разделы справочника.
export const REF_CATEGORIES = ['avatar', 'weapon', 'reliquary', 'material'] as const
export type RefCategory = (typeof REF_CATEGORIES)[number]

export const isRefCategory = (v: string): v is RefCategory =>
  (REF_CATEGORIES as readonly string[]).includes(v)

// Полный URL иконки по её имени (UI_AvatarIcon_... и т.п.).
// Иконки артефактов (UI_RelicIcon_*) лежат в подпапке /reliquary.
export const amberIcon = (name?: string | null) => {
  if (!name) return null
  const sub = /^UI_RelicIcon_/.test(name) ? 'reliquary/' : ''
  return `${AMBER_ASSETS}/${sub}${name}.png`
}

// In-memory кэш ответов (живёт в процессе Nitro), TTL 6 часов.
const cache = new Map<string, { at: number; data: unknown }>()
const TTL = 6 * 60 * 60 * 1000

export async function amberFetch<T = any>(path: string): Promise<T> {
  const hit = cache.get(path)
  if (hit && Date.now() - hit.at < TTL) return hit.data as T

  const json = await $fetch<{ response: number; data: T }>(`${API}${path}`)
  cache.set(path, { at: Date.now(), data: json.data })
  return json.data
}
