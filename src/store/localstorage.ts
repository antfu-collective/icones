import type { IdCase } from '../utils/case'
import { idCases } from '../utils/case'
import { defaultConfig } from '../utils/config'

const RECENT_CAPACITY = 10

export type ActiveMode = 'normal' | 'select' | 'copy'

export const themeColor = useStorage('icones-theme-color', '#329672')
export const iconSize = useStorage('icones-icon-size', '2xl')
export const previewColor = useStorage('icones-preview-color', '#888888')
export const copyPreviewColor = useStorage('icones-copy-preview-color', false)
export const listType = useStorage('icones-list-type', 'grid')
export const favoritedIds = useStorage<string[]>('icones-fav-collections', [])
export const recentIds = useStorage<string[]>('icones-recent-collections', [])
export const bags = useStorage<string[]>('icones-bags', [])
export const activeMode = useStorage<ActiveMode>('active-mode', 'normal')
export const preferredCase = useStorage<IdCase>('icones-preferfed-case', 'iconify')
export const userConfig = useStorage('icones-config', defaultConfig)

export function getTransformedId(icon: string) {
  return idCases[preferredCase.value]?.(icon) || icon
}

export function isFavorited(id: string) {
  return favoritedIds.value.includes(id)
}

export function isRecent(id: string) {
  return recentIds.value.includes(id)
}

export function pushRecent(id: string) {
  recentIds.value = [id, ...recentIds.value.filter(i => i !== id)].slice(0, RECENT_CAPACITY)
}

export function removeRecent(id: string) {
  recentIds.value = recentIds.value.filter(i => i !== id)
}

export function toggleFavorite(id: string) {
  const index = favoritedIds.value.indexOf(id)
  if (index >= 0)
    favoritedIds.value.splice(index, 1)
  else
    favoritedIds.value.push(id)
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
