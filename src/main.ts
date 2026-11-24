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
  // On mobile the document scrolls, so reset it on a new page,
  // but keep it when only the query changes (search, icon dialog)
  scrollBehavior(to, from) {
    return to.path !== from.path
      ? { top: 0 }
      : false
  },
})

if (PWA) {
  router.isReady().then(async () => {
    const { registerSW } = await import('virtual:pwa-register')
    registerSW({ immediate: true })
  })
}

app.use(router)

// Tools for AI agents in the browser, see `src/utils/agent-tools.ts`
if ('modelContext' in document || 'modelContext' in navigator)
  import('./utils/agent-tools').then(({ registerAgentTools }) => registerAgentTools(router))
app.mount('#app')
