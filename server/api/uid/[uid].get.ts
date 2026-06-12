import { ensureEnkaReady } from '~~/server/utils/enka'

// GET /api/uid/:uid — серверный роут (Nitro).
// Браузер ходит сюда, а сервер уже дёргает enka.network — так нет проблем с CORS,
// а сырые ID превращаются в человекочитаемые имена/иконки силами enka-network-api.
export default defineEventHandler(async (event) => {
  const uidParam = getRouterParam(event, 'uid')

  if (!uidParam || !/^\d{9,10}$/.test(uidParam)) {
    throw createError({ statusCode: 400, statusMessage: 'Некорректный UID' })
  }

  const enka = await ensureEnkaReady()

  let user
  try {
    user = await enka.fetchUser(Number(uidParam))
  } catch {
    throw createError({ statusCode: 404, statusMessage: 'Игрок не найден или витрина закрыта' })
  }

  return {
    uid: user.uid,
    nickname: user.nickname ?? '—',
    level: user.level,
    signature: user.signature ?? '',
    worldLevel: user.worldLevel,
    namecardUrl: user.profileCard?.icon?.url ?? null,
    characters: user.characters.map((char) => {
      const data = char.characterData
      return {
        id: data.id,
        name: data.name.get('ru'),
        element: data.element?.id ?? null,
        level: char.level,
        rarity: data.stars,
        friendship: char.friendship,
        iconUrl: data.icon?.url ?? null,
      }
    }),
  }
})
