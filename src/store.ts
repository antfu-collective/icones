import { useStorage } from '@vueuse/core'

const store = useStorage('iconify-explorer', {
  colorSchema: 'auto',
  iconColor: '#555',
  iconSize: '2xl',
})

export default store
