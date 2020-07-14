import { useStorage } from '@vueuse/core'

export const themeColor = useStorage('explorer-theme-color', '#329672')
export const iconSize = useStorage('explorer-icon-size', '2xl')
export const previewColor = useStorage('explorer-preview-color', '#888')
export const listType = useStorage('explorer-list-type', 'grid')
export const showCategories = useStorage('explorer-show-categories', true)
export const favoritedCollections = useStorage<string[]>('explorer-fav-collections', [])

export function isFavorited(id: string) {
  return favoritedCollections.value.includes(id)
}

export function toggleFavorite(id: string) {
  const index = favoritedCollections.value.indexOf(id)
  if (index >= 0)
    favoritedCollections.value.splice(index, 1)
  else
    favoritedCollections.value.push(id)

  // eslint-disable-next-line no-self-assign
  favoritedCollections.value = [...favoritedCollections.value]
}

export default {
  themeColor,
  iconSize,
  previewColor,
  listType,
  favoritedCollections,
  showCategories,
}
