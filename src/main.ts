import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { directive } from 'variantwind'
import App from './App.vue'
import { routes } from './routes'
import { registerComponents } from './components'
import './utils/electron'
import './main.postcss'

const app = createApp(App)

const router = createRouter({
  history: createWebHistory(),
  // @ts-ignore
  routes: import.meta.hot ? [] : routes,
})

// @ts-ignore
if (import.meta.hot) {
  let removeRoutes: any[] = []

  for (const route of routes) removeRoutes.push(router.addRoute(route))

  // @ts-ignore
  import.meta.hot.acceptDeps('./routes.js', ({ routes }) => {
    for (const removeRoute of removeRoutes) removeRoute()
    removeRoutes = []
    for (const route of routes) removeRoutes.push(router.addRoute(route))

    router.replace('')
  })
}

app.directive('wind', directive)
app.use(router)
app.use(registerComponents)

app.mount('#app')
