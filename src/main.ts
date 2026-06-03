import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import routes from '~pages'
import App from './App.vue'
import { basePath } from './env'

import '@unocss/reset/tailwind.css'
import 'floating-vue/dist/style.css'
import './main.css'
import 'uno.css'

const app = createApp(App)

const router = createRouter({
  history: createWebHistory(basePath),
  routes,
})

if (PWA) {
  router.isReady().then(async () => {
    const { registerSW } = await import('virtual:pwa-register')
    registerSW({ immediate: true })
  })
}

app.use(router)
app.mount('#app')
