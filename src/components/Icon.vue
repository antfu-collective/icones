<script lang="ts">
import { LRUCache } from 'lru-cache'

const cache = new LRUCache<string, HTMLElement>({
  max: 1_000,
})

const mounted = new WeakSet<HTMLElement>()

function getIcon(name: string) {
  const el = cache.get(name)
  if (el) {
    if (!mounted.has(el)) {
      mounted.add(el)
      return el
    }
  }
  const icon = document.createElement('iconify-icon')
  icon.setAttribute('icon', name)
  cache.set(name, icon)
  mounted.add(icon)
  return icon
}

function unmountIcon(name: string, icon: HTMLElement) {
  mounted.delete(icon)
  cache.set(name, icon)
}
</script>

<script setup lang="ts">
const props = defineProps({
  icon: {
    type: String,
    required: true,
  },
  class: {
    type: String,
    default: '',
  },
  outerClass: {
    type: String,
    default: '',
  },
})

const el = ref<HTMLDivElement>()
let node: HTMLElement | undefined

watchEffect(() => {
  if (node)
    node.className = props.class
})

onMounted(() => {
  node = getIcon(props.icon)
  el.value?.appendChild(node)
})

onBeforeUnmount(() => {
  if (node)
    unmountIcon(props.icon, node)
})
</script>

<template>
  <div ref="el" class="icon-container" :class="[props.class, props.outerClass]" />
</template>

<style>
iconify-icon {
  min-width: 1em;
  min-height: 1em;
  display: block;
}

.icon-container {
  display: inline-block;
  vertical-align: middle;
  line-height: 1em !important;
}
</style>
