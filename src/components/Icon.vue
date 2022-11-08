<script setup lang="ts">
import { getIcon } from '../store/icon-cache'

const { icon, cache } = defineProps({
  icon: {
    type: String,
    required: true,
  },
  cache: {
    type: Boolean,
    default: false,
  },
})

const attrs = useAttrs()
const el = ref<HTMLDivElement>()

const node = getIcon(icon, cache)
watchEffect(() => {
  node.className = attrs.class as string
})

onMounted(() => {
  el.value?.appendChild(node)
})
</script>

<template>
  <div ref="el" class="icon-container" />
</template>

<style>
.icon-container {
  min-width: 1em;
  min-height: 1em;
  display: block;
}
</style>
