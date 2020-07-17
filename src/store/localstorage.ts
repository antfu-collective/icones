import { useStorage } from '@vueuse/core'
import { ref } from 'vue'

export const themeColor = useStorage('explorer-theme-color', '#329672')
export const iconSize = useStorage('explorer-icon-size', '2xl')
export const previewColor = useStorage('explorer-preview-color', '#888')
export const listType = useStorage('explorer-list-type', 'grid')
export const favoritedCollections = useStorage<string[]>('explorer-fav-collections', [])
export const bags = useStorage<string[]>('explorer-bags', [])
export const selectingMode = ref(false)

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
