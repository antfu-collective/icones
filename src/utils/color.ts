/**
 * Relative luminance of a `#rgb` or `#rrggbb` color, from 0 (black) to 1 (white).
 * Returns `undefined` for other formats.
 */
export function getLuminance(color: string): number | undefined {
  let hex = color.trim().replace(/^#/, '')
  if (hex.length === 3)
    hex = hex.replace(/./g, c => c + c)
  if (!/^[0-9a-f]{6}$/i.test(hex))
    return
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = Number.parseInt(hex.slice(i, i + 2), 16) / 255
    return c <= 0.03928
      ? c / 12.92
      : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/**
 * Whether a color is hard to see on the page background:
 * a very light color in light mode, or a very dark color in dark mode.
 */
export function isLowContrast(color: string, dark: boolean): boolean {
  const l = getLuminance(color)
  if (l === undefined)
    return false
  // Contrast ratio with the page background (white, or #181818 in dark mode)
  const bg = dark ? 0.0091 : 1
  const ratio = (Math.max(l, bg) + 0.05) / (Math.min(l, bg) + 0.05)
  return ratio < 1.5
}
