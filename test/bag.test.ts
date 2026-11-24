import { describe, expect, it } from 'vitest'
import { getBagShareUrl, parseBagHash } from '../src/utils/bag'

describe('bag share link', () => {
  it('round-trips the icon ids', () => {
    const ids = ['mdi:home', 'carbon:add']
    const url = new URL(getBagShareUrl(ids, 'https://icones.js.org'))
    expect(url.pathname).toBe('/bag')
    expect(parseBagHash(url.hash)).toEqual(ids)
  })

  it('drops invalid and duplicate ids', () => {
    expect(parseBagHash('#mdi:home,,bad,mdi:home,%3Cscript%3E,carbon:add')).toEqual(['mdi:home', 'carbon:add'])
  })

  it('reads encoded hashes', () => {
    expect(parseBagHash('#mdi%3Ahome%2Ccarbon%3Aadd')).toEqual(['mdi:home', 'carbon:add'])
  })
})
