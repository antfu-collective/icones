import { describe, expect, it } from 'vitest'
import { ICON_SIZE_DEFAULT, ICON_SIZE_MAX, ICON_SIZE_MIN, parseIconSize } from '../src/utils/icon-size'

describe('icon size', () => {
  it('migrates the old small/large/list values', () => {
    expect(parseIconSize('text-2xl')).toBe(24)
    expect(parseIconSize('text-4xl')).toBe(36)
    expect(parseIconSize('text-3xl')).toBe(32)
    expect(parseIconSize('2xl')).toBe(ICON_SIZE_DEFAULT)
  })

  it('reads and clamps px values', () => {
    expect(parseIconSize('64')).toBe(64)
    expect(parseIconSize('4')).toBe(ICON_SIZE_MIN)
    expect(parseIconSize('999')).toBe(ICON_SIZE_MAX)
    expect(parseIconSize('')).toBe(ICON_SIZE_DEFAULT)
  })
})
