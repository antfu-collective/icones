import { useStorage } from '@vueuse/core'

export const themeColor = useStorage('iconify-explorer-theme-color', '#329672')
export const iconSize = useStorage('iconify-explorer-icon-size', '2xl')
export const previewColor = useStorage('iconify-explorer-preview-color', '#888')
export const listType = useStorage('iconify-explorer-list-type', 'grid')

export default {
  themeColor,
  iconSize,
  previewColor,
  listType,
}
