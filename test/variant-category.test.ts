import { describe, expect, it } from 'vitest'
import { getVariantCategories } from '../src/data/variant-category'

describe('getVariantCategories', () => {
  it('splits heroicons by size and style', () => {
    expect(getVariantCategories({
      id: 'heroicons',
      icons: [
        'home',
        'home-solid',
        'home-20-solid',
        'home-16-solid',
      ],
    })).toEqual({
      'Regular': ['home'],
      'Solid': ['home-solid'],
      '20 Solid': ['home-20-solid'],
      '16 Solid': ['home-16-solid'],
    })
  })

  it('keeps outline sharp apart from sharp in material symbols', () => {
    expect(getVariantCategories({
      id: 'material-symbols',
      icons: ['home-sharp', 'home-outline-sharp'],
    })).toEqual({
      'Sharp': ['home-sharp'],
      'Outline Sharp': ['home-outline-sharp'],
    })
  })

  it('returns nothing for sets without rules', () => {
    expect(getVariantCategories({
      id: 'carbon',
      icons: ['add'],
    })).toBeUndefined()
  })
})
