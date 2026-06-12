// Полный URL иконки Amber по её имени (UI_AvatarIcon_... и т.п.).
// Иконки артефактов (UI_RelicIcon_*) лежат в подпапке /reliquary.
const AMBER_ASSETS = 'https://gi.yatta.moe/assets/UI'
export const amberImg = (name?: string | null) => {
  if (!name) return null
  const sub = /^UI_RelicIcon_/.test(name) ? 'reliquary/' : ''
  return `${AMBER_ASSETS}/${sub}${name}.png`
}

// Очистка игровой разметки описаний: убираем <color> теги и нормализуем переводы строк.
export const cleanText = (s?: string | null) =>
  (s ?? '')
    .replace(/<color=[^>]*>/g, '')
    .replace(/<\/color>/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\\n/g, '\n')
    .trim()
