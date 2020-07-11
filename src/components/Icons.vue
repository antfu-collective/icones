<template>
  <div class="flex flex-wrap text-gray-700 text-2xl" :class="`text-${size}`">
    <div
      class="p-2 cursor-pointer"
      v-for="icon of icons"
      :key="icon"
      :class="selected.includes(icon) ? 'text-green-600':'' "
      @click="$emit('select', icon)"
    >
      <Icon :icon="icon"/>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Icon from './Icon.vue'

export default defineComponent({
  components: {
    Icon
  },
  emits: ['select'],
  props: {
    icons: {
      type: Array,
      default: () => []
    },
    selected: {
      type: Array,
      default: () => []
    },
    size: {
      type: String,
      default: '2xl'
    }
  }
})
</script>