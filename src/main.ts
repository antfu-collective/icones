import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import routes from 'virtual:generated-pages'
import App from './App.vue'
import '@unocss/reset/tailwind.css'
import './utils/electron'
import './main.css'
import 'uno.css'

// import icons data genereted by PurgeIcons
import '@purge-icons/generated'
import { basePath } from './env'

const app = createApp(App)

const router = createRouter({
  history: createWebHistory(basePath),
  routes,
})

app.use(router)
app.mount('#app')
