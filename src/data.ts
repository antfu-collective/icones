// @ts-ignore
import json from './assets/collections.json'

export interface Collection {
  id: string
  name: string
  author?: string
  license?: string
  licenseUrl?: string
  url?: string
  icons: string[]
}

export const collections = Object.freeze(json as Collection[])

export const all: Collection = Object.freeze({
  id: 'all',
  name: 'All',
  icons: collections.flatMap(i => i.icons),
})
