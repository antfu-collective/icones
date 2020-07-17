import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import { routes } from './routes'
import Icon from './components/Icon.vue'
import Notification from './components/Notification.vue'
import IconButton from './components/IconButton.vue'
import Icons from './components/Icons.vue'
import Modal from './components/Modal.vue'
import IconDetail from './components/IconDetail.vue'
import ColorPicker from './components/ColorPicker.vue'
import Navbar from './components/Navbar.vue'
import WithNavbar from './components/WithNavbar.vue'
import Footer from './components/Footer.vue'
import FAB from './components/FAB.vue'
import Drawer from './components/Drawer.vue'
import Bag from './components/Bag.vue'
import ViewControls from './components/ViewControls.vue'
import './main.css'

const app = createApp(App)
const router = createRouter({
  history: createWebHistory(),
  routes: import.meta.hot ? [] : routes,
})

if (import.meta.hot) {
  let removeRoutes = []

  for (const route of routes) removeRoutes.push(router.addRoute(route))

  import.meta.hot.acceptDeps('./routes.js', ({ routes }) => {
    for (const removeRoute of removeRoutes) removeRoute()
    removeRoutes = []
    for (const route of routes) removeRoutes.push(router.addRoute(route))

    router.replace('')
  })
}

app.use(router)

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
app.component('ViewControls', ViewControls)

app.mount('#app')
