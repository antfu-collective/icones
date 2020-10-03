/* eslint-disable import/no-absolute-path */
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { directive as variantwind } from 'variantwind'
import routes from 'voie-pages'
import App from './App.vue'
import './utils/electron'
import './main.postcss'

// import icons data genereted by PurgeIcons
import '@purge-icons/generated'
import { basePath } from './env'

const app = createApp(App)

const router = createRouter({
  history: createWebHistory(basePath),
  routes,
})

app.directive('wind', variantwind)
app.use(router)
app.mount('#app')
