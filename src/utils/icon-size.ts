export const ICON_SIZE_MIN = 16
export const ICON_SIZE_MAX = 128
export const ICON_SIZE_STEP = 4
export const ICON_SIZE_DEFAULT = 24

// Older versions stored a text class, from the small/large/list menu
const legacyIconSizes: Record<string, number> = {
  'text-2xl': 24,
  'text-3xl': 32,
  'text-4xl': 36,
}

export function clampIconSize(size: number) {
  return Math.min(ICON_SIZE_MAX, Math.max(ICON_SIZE_MIN, Math.round(size)))
}

export function parseIconSize(value: string) {
  const size = Number(value)
  if (value && Number.isFinite(size))
    return clampIconSize(size)
  return legacyIconSizes[value] ?? ICON_SIZE_DEFAULT
}
