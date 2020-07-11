<template>
  <div class="flex flex-wrap text-gray-700" :class="`text-${size}`">
    <div
      v-for="icon of icons"
      :key="icon"
      class="p-2 cursor-pointer"
      :class="selected.includes(icon) ? 'text-green-600':'' "
      @click="$emit('select', icon)"
    >
      <Icon :icon="icon" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  emits: ['select'],
  props: {
    icons: {
      type: Array,
      default: () => [],
    },
    selected: {
      type: Array,
      default: () => [],
    },
    size: {
      type: String,
      default: '2xl',
    },
  },
})
</script>
