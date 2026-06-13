import { amberFetch, amberIcon, amberLang, isRefCategory } from '~~/server/utils/amber'

// GET /api/ref/:category?lang=ru — список предметов раздела (нормализованный).
export default defineEventHandler(async (event) => {
  const category = getRouterParam(event, 'category') ?? ''
  if (!isRefCategory(category)) {
    throw createError({ statusCode: 404, statusMessage: 'Неизвестный раздел' })
  }

  const lang = amberLang(getQuery(event).lang)
  const data = await amberFetch<{ items: Record<string, any>; types?: Record<string, string> }>(
    `/${lang}/${category}`,
  )

  const items = Object.values(data.items ?? {}).map((it: any) => ({
    id: it.id,
    name: it.name,
    // У артефактов нет rank — берём макс. редкость набора из levelList.
    rank: it.rank ?? (Array.isArray(it.levelList) && it.levelList.length ? Math.max(...it.levelList) : 0),
    icon: amberIcon(it.icon),
    element: it.element ?? null,
    weaponType: it.weaponType ?? it.type ?? null,
    route: it.route ?? null,
  }))

  // Сортировка: сначала по редкости (убыв.), потом по имени.
  items.sort((a, b) => b.rank - a.rank || a.name.localeCompare(b.name))

  return { category, types: data.types ?? {}, items }
})
