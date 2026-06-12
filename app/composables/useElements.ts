// Цвета стихий Genshin (id из enka/amber: Fire/Water/...).
export const ELEMENT_COLOR: Record<string, string> = {
  Fire: '#ff7a55',
  Water: '#3fb6ff',
  Grass: '#8fd24a',
  Electric: '#c98bff',
  Wind: '#5fe6c0',
  Rock: '#f6c54b',
  Ice: '#7fe3ff',
}

export const elementColor = (el?: string | null) =>
  (el && ELEMENT_COLOR[el]) || '#8a8f9c'

// URL иконки стихии (Amber): UI_Buff_Element_Wind и т.п.
export const elementIcon = (el?: string | null) =>
  el && ELEMENT_COLOR[el] ? `https://gi.yatta.moe/assets/UI/UI_Buff_Element_${el}.png` : null

// Цвет рамки по редкости (5★ золото / иначе фиолет).
export const rarityColor = (rank?: number) => (rank && rank >= 5 ? '#e0a64e' : '#a96bd6')
