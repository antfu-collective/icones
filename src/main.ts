import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import { routes } from './routes'
import './main.css'

const app = createApp(App)
const router = createRouter({
  history: createWebHistory(),
  routes: import.meta.hot ? [] : routes,
})

if (import.meta.hot) {
  let removeRoutes = []

  for (const route of routes)
    removeRoutes.push(router.addRoute(route))

  import.meta.hot.acceptDeps('./routes.js', ({ routes }) => {
    for (const removeRoute of removeRoutes) removeRoute()
    removeRoutes = []
    for (const route of routes)
      removeRoutes.push(router.addRoute(route))

    router.replace('')
  })
}

app.use(router)
app.mount('#app')
