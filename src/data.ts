// @ts-ignore
import json from './assets/collections.json'

export interface Collection {
  id: string,
  name: string,
  author: string,
  license: string,
  icons: string[]
}

export const collections = json as Collection[]
