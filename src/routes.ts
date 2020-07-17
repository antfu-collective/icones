import { RouterOptions } from 'vue-router'
import Index from './views/Index.vue'
import NotFound from './views/NotFound.vue'
import Collection from './views/Collection.vue'

export const routes: RouterOptions['routes'] = [
  { path: '/', component: Index },
  { path: '/collection/:id', component: Collection, props: true },
  { path: '/:path(.*)', component: NotFound },
]
