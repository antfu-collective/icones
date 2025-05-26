import type { CollectionInfo } from '../data'
import infoJSON from '../data/collections-info.json'

export const collections = infoJSON.map(c => Object.freeze(c as any as CollectionInfo))
