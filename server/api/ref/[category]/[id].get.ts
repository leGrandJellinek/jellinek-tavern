import { amberFetch, amberIcon, amberLang, isRefCategory } from '~~/server/utils/amber'

// GET /api/ref/:category/:id?lang=ru — деталь предмета (сырые данные Amber).
// Фронт сам достаёт нужные поля; базовый URL ассетов отдаём для построения иконок.
export default defineEventHandler(async (event) => {
  const category = getRouterParam(event, 'category') ?? ''
  const id = getRouterParam(event, 'id') ?? ''

  if (!isRefCategory(category)) {
    throw createError({ statusCode: 404, statusMessage: 'Неизвестный раздел' })
  }
  if (!/^\d+$/.test(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Некорректный id' })
  }

  const lang = amberLang(getQuery(event).lang)

  let data: any
  try {
    data = await amberFetch(`/${lang}/${category}/${id}`)
  } catch {
    throw createError({ statusCode: 404, statusMessage: 'Предмет не найден' })
  }

  // Для оружия/персонажей подставляем названия и иконки материалов возвышения.
  let ascensionMaterials: { id: number; count: number; name: string; icon: string | null; rank: number }[] = []
  if ((category === 'weapon' || category === 'avatar') && data.ascension) {
    try {
      const mats = await amberFetch<{ items: Record<string, any> }>(`/${lang}/material`)
      ascensionMaterials = Object.entries(data.ascension as Record<string, number>).map(
        ([mid, count]) => {
          const m = mats.items?.[mid]
          return {
            id: Number(mid),
            count,
            name: m?.name ?? `#${mid}`,
            icon: amberIcon(m?.icon),
            rank: m?.rank ?? 0,
          }
        },
      )
      // Сортировка: по редкости (убыв.), затем по имени.
      ascensionMaterials.sort((a, b) => b.rank - a.rank || a.name.localeCompare(b.name))
    } catch {
      // если справочник материалов недоступен — просто без них
    }
  }

  return { category, data, ascensionMaterials }
})
