<template>
  <div class="flex flex-wrap" :class="`text-${size}`" :style="{color, '--hover-color': themeColor }">
    <div
      v-for="icon of icons"
      :key="icon"
      class="icons-item p-2 cursor-pointer"
      :class="selected.includes(icon) ? 'active': ''"
      @click="$emit('select', icon)"
    >
      <Icon :icon="icon" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { themeColor } from '../store'

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
    color: {
      type: String,
      default: '#555',
    },
  },
  setup() {
    return {
      themeColor,
    }
  },
})
</script>

<style>
.icons-item:hover, .icons-item.active {
  color: var(--hover-color);
}
</style>
