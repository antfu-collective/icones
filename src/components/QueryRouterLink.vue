<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { RouteLocationRaw, RouterLinkProps } from 'vue-router'

const props = defineProps<{
  to: RouterLinkProps
}>()
const emit = defineEmits<{
  (event: 'click', e: Event): void
}>()

const router = useRouter()
const route = useRoute()
const attrs = useAttrs()

async function handleNav(e: Event) {
  e.preventDefault()
  let newRoute: RouteLocationRaw = {
    query: route.query,
    path: '',
  }
  if (typeof props.to === 'string')
    newRoute.path = props.to
  else
    newRoute = props.to

  await router.push(newRoute)
  emit('click', e)
}
const slots = useSlots()
const Root = h(RouterLink, {
  ...attrs,
  to: props.to,
  onClick: handleNav,
}, slots)
</script>

<template>
  <Root />
</template>
