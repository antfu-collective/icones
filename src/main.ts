import { createApp } from 'vue'
import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import { disableCache } from 'iconify-icon'
import App from './App.vue'
import '@unocss/reset/tailwind.css'
import './utils/electron'
import './main.css'
import 'uno.css'

import { basePath, isElectron } from './env'
import routes from '~pages'

const app = createApp(App)

const router = createRouter({
  history: isElectron ? createWebHashHistory(basePath) : createWebHistory(basePath),
  routes,
})

if (!isElectron && PWA) {
  // disable local storage cache when there is PWA:
  // we need to keep local storage when running dev server without PWA
  // to avoid send requests to iconify server api
  disableCache('all')
  router.isReady().then(async () => {
    const { registerSW } = await import('virtual:pwa-register')
    registerSW({ immediate: true })
  })
}

app.use(router)
app.mount('#app')
