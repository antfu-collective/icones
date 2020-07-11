import Collections from './views/Collections.vue'
import NotFound from './views/NotFound.vue'
import IconSet from './views/IconSet.vue'
import { RouterOptions } from 'vue-router'

export let routes: RouterOptions['routes'] = [
  { path: '/', component: Collections },
  { path: '/collection/:id', component: IconSet, props: true },
  { path: '/:path(.*)', component: NotFound },
]
