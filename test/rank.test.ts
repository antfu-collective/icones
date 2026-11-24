import { describe, expect, it } from 'vitest'
import { rankIcons, scoreName } from '../src/utils/rank'

describe('scoreName', () => {
  it('ranks closer names higher', () => {
    const names = [
      'clipboard-text-search-outline',
      'research',
      'text-search',
      'search-web',
      'search',
      'searching',
    ]
    const sorted = [...names].sort((a, b) => scoreName(b, ['search']) - scoreName(a, ['search']))
    expect(sorted).toEqual([
      'search',
      'searching',
      'search-web',
      'text-search',
      'clipboard-text-search-outline',
      'research',
    ])
  })

  it('ignores the collection prefix', () => {
    expect(scoreName('mdi:search', ['search'])).toBe(1)
  })

  it('scores more than one query word', () => {
    expect(scoreName('arrow-left', ['arrow', 'left']))
      .toBeGreaterThan(scoreName('arrow-left-bold', ['arrow', 'left']))
  })
})

describe('rankIcons', () => {
  it('puts close matches of predicted words before loose matches of the typed word', () => {
    const ranked = rankIcons([
      [
        {
          parts: ['search'],
          weight: 1,
        },
        ['mdi:clipboard-text-search-outline', 'mdi:text-search', 'mdi:search'],
      ],
      [
        {
          parts: ['magnify'],
          weight: 0.75,
        },
        ['mdi:magnify-plus-outline', 'mdi:magnify'],
      ],
    ])
    expect(ranked).toEqual([
      'mdi:search',
      'mdi:magnify',
      'mdi:text-search',
      'mdi:clipboard-text-search-outline',
      'mdi:magnify-plus-outline',
    ])
  })

  it('keeps the best score of an icon that more terms found', () => {
    const ranked = rankIcons([
      [
        {
          parts: ['sea'],
          weight: 1,
        },
        ['search', 'sea'],
      ],
      [
        {
          parts: ['search'],
          weight: 0.9,
        },
        ['search'],
      ],
    ])
    expect(ranked).toEqual(['sea', 'search'])
  })
})

describe('rankIcons with dashes', () => {
  it('matches a typed name with dashes', () => {
    expect(rankIcons([
      [
        {
          parts: ['arrow-left'],
          weight: 1,
        },
        ['arrow-left-bold', 'arrow-left'],
      ],
    ]))
      .toEqual(['arrow-left', 'arrow-left-bold'])
  })
})
