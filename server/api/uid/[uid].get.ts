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

  // Хелпер: человекочитаемое имя из TextAssets (с фолбэком на любой язык).
  const ru = (t: { get: (lang?: any) => string } | null | undefined) => {
    try {
      return t?.get('ru') ?? null
    } catch {
      return null
    }
  }

  // Хелпер: одна характеристика → { name, value }.
  const stat = (s: any) =>
    s ? { name: ru(s.fightPropName), value: s.valueText } : null

  return {
    uid: user.uid,
    nickname: user.nickname ?? '—',
    level: user.level,
    signature: user.signature ?? '',
    worldLevel: user.worldLevel,
    achievements: user.achievements ?? 0,
    // Аватарка профиля игрока.
    profilePictureUrl: user.profilePicture?.icon?.url ?? null,
    // Широкий арт визитки (для фона шапки), с фолбэком на иконку.
    namecardUrl: user.profileCard?.pictures?.[0]?.url ?? user.profileCard?.icon?.url ?? null,
    characters: user.characters.map((char) => {
      const data = char.characterData
      const st = char.stats

      return {
        id: data.id,
        name: ru(data.name),
        element: data.element?.id ?? null,
        elementName: ru(data.element?.name),
        level: char.level,
        maxLevel: char.maxLevel,
        rarity: data.stars,
        friendship: char.friendship,
        iconUrl: data.icon?.url ?? null,
        gachaUrl: data.splashImage?.url ?? null,
        constellationLevel: char.unlockedConstellations.length,

        // Основные боевые характеристики
        stats: {
          maxHp: stat(st.maxHealth),
          atk: stat(st.attack),
          def: stat(st.defense),
          critRate: stat(st.critRate),
          critDamage: stat(st.critDamage),
          elementMastery: stat(st.elementMastery),
          chargeEfficiency: stat(st.chargeEfficiency),
          damageBonus: stat(st.highestDamageBonus?.[0] ?? null),
        },

        // Таланты (атака/умение/взрыв)
        talents: char.skillLevels.map((s) => ({
          id: s.skill.id,
          name: ru(s.skill.name),
          icon: s.skill.icon?.url ?? null,
          level: s.level.value,
        })),

        // Созвездия
        constellations: data.constellations.map((c, i) => ({
          id: c.id,
          name: ru(c.name),
          icon: c.icon?.url ?? null,
          unlocked: i < char.unlockedConstellations.length,
        })),

        // Оружие
        weapon: char.weapon
          ? {
              name: ru(char.weapon.weaponData.name),
              icon: char.weapon.weaponData.icon?.url ?? null,
              rarity: char.weapon.weaponData.stars,
              level: char.weapon.level,
              refinement: char.weapon.refinementRank,
              stats: char.weapon.weaponStats.map(stat),
            }
          : null,

        // Артефакты
        artifacts: char.artifacts.map((art) => ({
          id: art.artifactData.set?.id ?? art.level,
          slot: ru(art.artifactData.equipTypeName),
          setName: ru(art.artifactData.set?.name),
          icon: art.artifactData.icon?.url ?? null,
          rarity: art.artifactData.stars,
          level: art.level,
          mainstat: stat(art.mainstat),
          substats: art.substats.total.map(stat),
        })),
      }
    }),
  }
})
