import type { IdCase } from '../utils/case'
import { idCases } from '../utils/case'

export type ActiveMode = 'normal' | 'selecting' | 'copying'

export const themeColor = useStorage('icones-theme-color', '#329672')
export const iconSize = useStorage('icones-icon-size', '2xl')
export const previewColor = useStorage('icones-preview-color', '#888888')
export const copyPreviewColor = useStorage('icones-copy-preview-color', false)
export const listType = useStorage('icones-list-type', 'grid')
export const favoritedCollections = useStorage<string[]>('icones-fav-collections', [])
export const bags = useStorage<string[]>('icones-bags', [])
export const activeMode = useStorage<ActiveMode>('active-mode', 'normal')
export const preferredCase = useStorage<IdCase>('icones-preferfed-case', 'iconify')

export function getTransformedId(icon: string) {
  return idCases[preferredCase.value]?.(icon) || icon
}

export function isFavorited(id: string) {
  return favoritedCollections.value.includes(id)
}

export function toggleFavorite(id: string) {
  const index = favoritedCollections.value.indexOf(id)
  if (index >= 0)
    favoritedCollections.value.splice(index, 1)
  else
    favoritedCollections.value.push(id)
}

export function addToBag(id: string) {
  if (!bags.value.includes(id))
    bags.value.push(id)
}

export function removeFromBag(id: string) {
  const index = bags.value.indexOf(id)
  if (index >= 0)
    bags.value.splice(index, 1)
}

export function inBag(id: string) {
  return bags.value.includes(id)
}

export function toggleBag(id: string) {
  const index = bags.value.indexOf(id)
  if (index >= 0)
    bags.value.splice(index, 1)
  else
    bags.value.push(id)
}

export function clearBag() {
  bags.value = []
}
