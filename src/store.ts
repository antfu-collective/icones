import { useStorage } from '@vueuse/core'
import { ref } from 'vue'

export const themeColor = useStorage('explorer-theme-color', '#329672')
export const iconSize = useStorage('explorer-icon-size', '2xl')
export const previewColor = useStorage('explorer-preview-color', '#888')
export const listType = useStorage('explorer-list-type', 'grid')
export const showCategories = useStorage('explorer-show-categories', true)
export const favoritedCollections = useStorage<string[]>('explorer-fav-collections', [])
export const iconsCart = useStorage<string[]>('explorer-cart', [])
export const cartEnabled = ref(false)

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

export function addToCart(id: string) {
  if (!iconsCart.value.includes(id))
    iconsCart.value.push(id)
}

export function removeFromCart(id: string) {
  const index = iconsCart.value.indexOf(id)
  if (index >= 0)
    iconsCart.value.splice(index, 1)
}

export function toggleCart(id: string) {
  const index = iconsCart.value.indexOf(id)
  if (index >= 0)
    iconsCart.value.splice(index, 1)
  else
    iconsCart.value.push(id)
}

export function clearCart() {
  iconsCart.value = []
}
