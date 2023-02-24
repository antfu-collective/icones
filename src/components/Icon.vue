<script setup lang="ts">
import { getIcon, unmountIcon } from '../store/icon-cache'

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
