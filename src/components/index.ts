import type { Plugin } from 'vue'
import Icon from './Icon.vue'
import Notification from './Notification.vue'
import IconButton from './IconButton.vue'
import Icons from './Icons.vue'
import Modal from './Modal.vue'
import IconDetail from './IconDetail.vue'
import ColorPicker from './ColorPicker.vue'
import Navbar from './Navbar.vue'
import WithNavbar from './WithNavbar.vue'
import Footer from './Footer.vue'
import FAB from './FAB.vue'
import Drawer from './Drawer.vue'
import Bag from './Bag.vue'
import Progress from './Progress.vue'
import ActionsMenu from './ActionsMenu.vue'
import DarkSwitcher from './DarkSwitcher.vue'
import IconSet from './IconSet.vue'
import NavPlaceholder from './electron/NavPlaceholder.vue'
import SearchElectron from './electron/SearchElectron.vue'

export const registerComponents: Plugin = {
  install(app) {
    app.component('IconSet', IconSet)
    app.component('IconButton', IconButton)
    app.component('Icons', Icons)
    app.component('Icon', Icon)
    app.component('Modal', Modal)
    app.component('IconDetail', IconDetail)
    app.component('Notification', Notification)
    app.component('ColorPicker', ColorPicker)
    app.component('Navbar', Navbar)
    app.component('WithNavbar', WithNavbar)
    app.component('Footer', Footer)
    app.component('Drawer', Drawer)
    app.component('FAB', FAB)
    app.component('Bag', Bag)
    app.component('ActionsMenu', ActionsMenu)
    app.component('NavPlaceholder', NavPlaceholder)
    app.component('SearchElectron', SearchElectron)
    app.component('Progress', Progress)
    app.component('DarkSwitcher', DarkSwitcher)
  },
}
