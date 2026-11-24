import type { CollectionInfo } from '../src/data'
import { describe, expect, it } from 'vitest'
import { getLicenseComment } from '../src/utils/svg/loader'

const collections = [
  {
    id: 'mdi',
    name: 'Material Design Icons',
    author: { name: 'Pictogrammers' },
    license: { title: 'Apache 2.0', url: 'https://example.com/LICENSE' },
  },
  {
    id: 'carbon',
    name: 'Carbon',
    author: { name: 'IBM' },
    license: { title: 'Apache 2.0' },
  },
  { id: 'bare', name: 'Bare' },
] as CollectionInfo[]

describe('getLicenseComment', () => {
  it('includes author and license url', async () => {
    expect(await getLicenseComment(collections, 'mdi:home'))
      .toBe('<!-- Icon from Material Design Icons by Pictogrammers - https://example.com/LICENSE -->')
  })

  it('falls back to the license title without a url', async () => {
    expect(await getLicenseComment(collections, 'carbon:apps'))
      .toBe('<!-- Icon from Carbon by IBM - Apache 2.0 -->')
  })

  it('leaves out missing author and license', async () => {
    expect(await getLicenseComment(collections, 'bare:x'))
      .toBe('<!-- Icon from Bare -->')
  })

  it('returns empty for an unknown collection', async () => {
    expect(await getLicenseComment(collections, 'nope:x')).toBe('')
  })
})
