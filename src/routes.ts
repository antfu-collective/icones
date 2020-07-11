import { RouterOptions } from 'vue-router'
import Collections from './views/Collections.vue'
import NotFound from './views/NotFound.vue'
import IconSet from './views/IconSet.vue'

export const routes: RouterOptions['routes'] = [
  { path: '/', component: Collections },
  { path: '/collection/:id', component: IconSet, props: true },
  { path: '/:path(.*)', component: NotFound },
]
