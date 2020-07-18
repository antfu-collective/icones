import hotkeys from 'hotkeys-js'
import { isElectron } from '../env'
import { isSearchOpen } from '../store/search'

if (isElectron) {
  hotkeys('ctrl+f, command+f', (e) => {
    e.preventDefault()
    isSearchOpen.value = !isSearchOpen.value
  })
}
