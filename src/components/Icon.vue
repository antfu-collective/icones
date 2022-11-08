<script setup lang="ts">
import { getIcon } from '../store/icon-cache'

const { icon } = defineProps({
  icon: {
    type: String,
    required: true,
  },
})

const attrs = useAttrs()
const el = ref<HTMLDivElement>()

onMounted(() => {
  const node = getIcon(icon)
  el.value?.appendChild(node)
  node.className = attrs.class as string

  watch(() => attrs.class, (val) => {
    node.className = val as string
  })
})
</script>

<template>
  <div ref="el" />
</template>

<style>
iconify-icon {
  min-width: 1em;
  min-height: 1em;
  display: block;
}
</style>
