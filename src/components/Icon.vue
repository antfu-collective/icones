<script lang="ts">
import LRU from 'lru-cache'

const cache = new LRU<string, HTMLElement>({
  max: 1_000,
})

const mounted = new WeakSet<HTMLElement>()

function getIcon(name: string) {
  if (cache.has(name) && !mounted.has(cache.get(name)!))
    return cache.get(name)!
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
const node = ref<HTMLElement>()

watchEffect(() => {
  if (node.value)
    node.value.className = props.class
})

onMounted(() => {
  node.value = getIcon(props.icon)
  el.value?.appendChild(node.value)
})

onBeforeUnmount(() => {
  if (node.value)
    unmountIcon(props.icon, node.value)
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
