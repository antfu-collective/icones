// @ts-ignore
import { computed } from 'vue'
import json from './assets/collections.json'
import { favoritedCollections } from './store'

export interface Collection {
  id: string
  name: string
  author?: string
  license?: string
  licenseURL?: string
  url?: string
  icons: string[]
  categories?: Record<string, string[]>
}

export const collections = json.map(collection => Object.freeze(collection as Collection))

export const all: Collection = Object.freeze({
  id: 'all',
  name: 'All',
  icons: collections.flatMap(c => c.icons.map(i => `${c.id}:${i}`)),
})

export const sortedCollections = computed(() => {
  return [...collections]
    .sort((a, b) => favoritedCollections.value.indexOf(b.id) - favoritedCollections.value.indexOf(a.id))
})
