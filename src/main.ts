/* eslint-disable import/no-absolute-path */
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { directive as variantwind } from 'variantwind'
import App from './App.vue'
import { registerComponents } from './components'
import './utils/electron'
import './main.postcss'

// @ts-ignore: this is generated from voie, which TypeScript is not able to infer types correctly
import routes from '/@voie/pages'
// import icons data genereted by PurgeIcons
import '@purge-icons/generated'

const app = createApp(App)

const router = createRouter({
  history: createWebHistory(),
  routes,
})

app.directive('wind', variantwind)
app.use(router)
app.use(registerComponents)
app.mount('#app')
