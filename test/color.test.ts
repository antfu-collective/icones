import { describe, expect, it } from 'vitest'
import { getLuminance, isLowContrast } from '../src/utils/color'

describe('getLuminance', () => {
  it('parses hex colors', () => {
    expect(getLuminance('#000000')).toBe(0)
    expect(getLuminance('#fff')).toBe(1)
    expect(getLuminance('#888888')).toBeCloseTo(0.246, 2)
  })

  it('ignores other formats', () => {
    expect(getLuminance('currentColor')).toBeUndefined()
    expect(getLuminance('#12345')).toBeUndefined()
  })
})

describe('isLowContrast', () => {
  it('detects light colors in light mode', () => {
    expect(isLowContrast('#ffffff', false)).toBe(true)
    expect(isLowContrast('#f5f5f5', false)).toBe(true)
    expect(isLowContrast('#888888', false)).toBe(false)
    expect(isLowContrast('#000000', false)).toBe(false)
  })

  it('detects dark colors in dark mode', () => {
    expect(isLowContrast('#000000', true)).toBe(true)
    expect(isLowContrast('#222222', true)).toBe(true)
    expect(isLowContrast('#888888', true)).toBe(false)
    expect(isLowContrast('#ffffff', true)).toBe(false)
  })
})
