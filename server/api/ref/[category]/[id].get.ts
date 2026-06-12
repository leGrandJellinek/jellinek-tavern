import { amberFetch, amberLang, isRefCategory } from '~~/server/utils/amber'

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

  let data
  try {
    data = await amberFetch(`/${lang}/${category}/${id}`)
  } catch {
    throw createError({ statusCode: 404, statusMessage: 'Предмет не найден' })
  }

  return { category, data }
})
